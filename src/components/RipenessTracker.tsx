import { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  Check,
  CircleAlert,
  ImagePlus,
  Leaf,
  Trash2,
  Upload,
  X,
} from "lucide-react";

type Ripeness = "ripe" | "unripe";

type ModelStatus = "checking" | "ready" | "missing" | "offline";

interface RipenessPrediction {
  crop: string;
  ripeness: Ripeness;
  confidence: number;
}

interface RipenessObservation {
  id: string;
  crop: string;
  ripeness: Ripeness;
  count: number;
  createdAt: string;
}

interface RoverPlantReview {
  id: string;
  plantNumber: number;
  crop: string;
  ripeness: Ripeness;
  confidence: number | null;
  image: string;
  reviewedAt: string;
  source: "live" | "demo";
}

interface FieldFruitAnnotation {
  x: number;
  y: number;
  ripeness: Ripeness;
}

interface RoverFieldScan {
  image: string;
  crop: string;
  ripeness: Ripeness;
  source: "live" | "demo";
  annotations: FieldFruitAnnotation[];
  scannedAt: string;
}

interface RoverDemoPlantEvent extends Event {
  detail: {
    x: number;
    y: number;
    direction: "forward" | "reverse";
  };
}

const STORAGE_KEY = "agri-assist-ripeness-observations";
const ROVER_CAMERA_URL_STORAGE_KEY = "agri-assist-rover-camera-url";
const RIPENESS_API_URL_STORAGE_KEY = "agri-assist-ripeness-api-url";
const DEFAULT_RIPENESS_API_URL = (
  import.meta.env.VITE_RIPENESS_API_URL ?? (import.meta.env.DEV ? "http://localhost:8000" : "")
).replace(/\/+$/, "");
const MAX_PREDICTION_IMAGE_BYTES = 10 * 1024 * 1024;
const CROPS = [
  "Tomato",
  "Chili",
  "Mango",
  "Banana",
  "Apple",
  "Orange",
  "Bell pepper",
  "Cucumber",
  "Eggplant",
  "Other",
];
const DEMO_PLANTS: Array<{ crop: string; ripeness: Ripeness; image: string }> = [
  { crop: "Mango tree", ripeness: "ripe", image: "/demo-plants/mango-tree-1.svg" },
  { crop: "Banana plant", ripeness: "unripe", image: "/demo-plants/banana-grove.svg" },
  { crop: "Mango tree", ripeness: "unripe", image: "/demo-plants/mango-tree-2.svg" },
  { crop: "Banana plant", ripeness: "ripe", image: "/demo-plants/banana-grove.svg" },
  { crop: "Mango tree", ripeness: "ripe", image: "/demo-plants/mango-tree-2.svg" },
];
const DEMO_FRUIT_POSITIONS = [
  { x: 194, y: 161 },
  { x: 272, y: 169 },
  { x: 329, y: 158 },
];
const DEMO_BANANA_POSITIONS = [
  { x: 205, y: 176 },
  { x: 246, y: 179 },
  { x: 282, y: 174 },
];

function canvasToJpeg(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Unable to process this image."))),
      "image/jpeg",
      0.85,
    );
  });
}

async function prepareImageFrame(imageBlob: Blob): Promise<{ preview: string; frame: Blob }> {
  const imageUrl = URL.createObjectURL(imageBlob);
  const image = new Image();

  try {
    const loaded = new Promise<void>((resolve, reject) => {
      image.addEventListener("load", () => resolve(), { once: true });
      image.addEventListener("error", () => reject(new Error("Unable to read this image.")), {
        once: true,
      });
    });
    image.src = imageUrl;
    await loaded;

    const scale = Math.min(1, 1280 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.naturalWidth * scale);
    canvas.height = Math.round(image.naturalHeight * scale);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Unable to process images in this browser.");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const frame = await canvasToJpeg(canvas);
    if (frame.size > MAX_PREDICTION_IMAGE_BYTES) {
      throw new Error("This image is too large to analyze. Choose a smaller photo.");
    }
    return { preview: canvas.toDataURL("image/jpeg", 0.85), frame };
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

async function extractVideoFrames(file: File): Promise<{ preview: string; frames: Blob[] }> {
  const video = document.createElement("video");
  const videoUrl = URL.createObjectURL(file);
  video.preload = "metadata";
  video.muted = true;

  try {
    const metadata = new Promise<void>((resolve, reject) => {
      video.addEventListener("loadedmetadata", () => resolve(), { once: true });
      video.addEventListener("error", () => reject(new Error("Unable to read this video.")), {
        once: true,
      });
    });
    video.src = videoUrl;
    await metadata;
    if (!Number.isFinite(video.duration) || video.duration <= 0) {
      throw new Error("This video has no readable duration.");
    }

    const sampleTimes =
      video.duration < 0.5
        ? [video.duration / 2]
        : [0.2, 0.5, 0.8].map((position) => Math.min(video.duration * position, video.duration - 0.01));
    const frames: Blob[] = [];
    let preview = "";

    for (const sampleTime of sampleTimes) {
      await new Promise<void>((resolve, reject) => {
        video.addEventListener("seeked", () => resolve(), { once: true });
        video.addEventListener("error", () => reject(new Error("Unable to read a frame from this video.")), {
          once: true,
        });
        video.currentTime = sampleTime;
      });

      if (video.videoWidth === 0 || video.videoHeight === 0) {
        throw new Error("This video does not contain a readable frame.");
      }

      const scale = Math.min(1, 1280 / Math.max(video.videoWidth, video.videoHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(video.videoWidth * scale);
      canvas.height = Math.round(video.videoHeight * scale);
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Unable to process video frames in this browser.");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frame = await canvasToJpeg(canvas);
      if (frame.size > MAX_PREDICTION_IMAGE_BYTES) {
        throw new Error("A video frame is too large to analyze. Choose a different video.");
      }
      frames.push(frame);
      if (!preview) preview = canvas.toDataURL("image/jpeg", 0.85);
    }

    return { preview, frames };
  } finally {
    video.pause();
    video.removeAttribute("src");
    video.load();
    URL.revokeObjectURL(videoUrl);
  }
}

function isObservation(value: unknown): value is RipenessObservation {
  if (typeof value !== "object" || value === null) return false;

  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.crop === "string" &&
    (record.ripeness === "ripe" || record.ripeness === "unripe") &&
    typeof record.count === "number" &&
    Number.isInteger(record.count) &&
    record.count > 0 &&
    typeof record.createdAt === "string" &&
    Number.isFinite(Date.parse(record.createdAt))
  );
}

function isRipenessPrediction(value: unknown): value is RipenessPrediction {
  return (
    typeof value === "object" &&
    value !== null &&
    "crop" in value &&
    typeof value.crop === "string" &&
    "ripeness" in value &&
    (value.ripeness === "ripe" || value.ripeness === "unripe") &&
    "confidence" in value &&
    typeof value.confidence === "number" &&
    Number.isFinite(value.confidence) &&
    value.confidence >= 0 &&
    value.confidence <= 1
  );
}

const RipenessTracker: React.FC = () => {
  const [observations, setObservations] = useState<RipenessObservation[]>([]);
  const [storageLoaded, setStorageLoaded] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [crop, setCrop] = useState(CROPS[0]);
  const [ripeness, setRipeness] = useState<Ripeness>("ripe");
  const [count, setCount] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisFrames, setAnalysisFrames] = useState<Blob[]>([]);
  const [isProcessingMedia, setIsProcessingMedia] = useState(false);
  const [isRoverPlantReview, setIsRoverPlantReview] = useState(false);
  const [roverPlantReviews, setRoverPlantReviews] = useState<RoverPlantReview[]>([]);
  const [activeFieldScan, setActiveFieldScan] = useState<RoverFieldScan | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [roverCameraUrl, setRoverCameraUrl] = useState(import.meta.env.VITE_ROVER_CAMERA_URL ?? "");
  const [roverCameraConnected, setRoverCameraConnected] = useState(false);
  const [roverCameraFrame, setRoverCameraFrame] = useState<string | null>(null);
  const [roverCameraStatus, setRoverCameraStatus] = useState<"disconnected" | "connecting" | "connected" | "offline">("disconnected");
  const [roverCameraError, setRoverCameraError] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [modelStatus, setModelStatus] = useState<ModelStatus>("checking");
  const [modelApiUrl, setModelApiUrl] = useState(DEFAULT_RIPENESS_API_URL);
  const [modelApiUrlDraft, setModelApiUrlDraft] = useState(DEFAULT_RIPENESS_API_URL);
  const [modelApiError, setModelApiError] = useState("");
  const [modelApiCheckAttempt, setModelApiCheckAttempt] = useState(0);
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState<RipenessPrediction | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaUploadSequenceRef = useRef(0);
  const nextPlantNumberRef = useRef(1);
  const latestRoverFrameRef = useRef<Blob | null>(null);
  const roverFrameUrlRef = useRef<string | null>(null);

  useEffect(() => {
    try {
      const savedApiUrl = window.localStorage.getItem(RIPENESS_API_URL_STORAGE_KEY);
      if (savedApiUrl) {
        setModelApiUrl(savedApiUrl);
        setModelApiUrlDraft(savedApiUrl);
      }
    } catch (storageError) {
      console.error("Unable to load the saved ripeness API URL:", storageError);
      setModelApiError("The saved model API address could not be loaded from this browser.");
    }
  }, []);

  useEffect(() => {
    try {
      const savedUrl = window.localStorage.getItem(ROVER_CAMERA_URL_STORAGE_KEY);
      if (savedUrl) setRoverCameraUrl(savedUrl);
    } catch (storageError) {
      console.error("Unable to load the saved rover camera URL:", storageError);
      setRoverCameraError("The saved rover camera URL could not be loaded from this browser.");
    }
  }, []);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (!Array.isArray(parsed) || !parsed.every(isObservation)) {
          throw new Error("Saved ripeness records have an invalid format.");
        }
        setObservations(parsed);
      }
      setStorageLoaded(true);
    } catch (loadError) {
      console.error("Unable to load saved ripeness records:", loadError);
      setStorageError("Saved harvest records could not be loaded on this device.");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const checkModel = async () => {
      if (!modelApiUrl) {
        setModelStatus("offline");
        setModelApiError(
          "No model API address is configured. Enter the URL of a running ripeness model service below.",
        );
        return;
      }
      try {
        const response = await fetch(`${modelApiUrl}/health`, { signal: controller.signal });
        if (!response.ok) throw new Error(`Model health check failed (${response.status}).`);
        const health: unknown = await response.json();
        if (
          typeof health !== "object" ||
          health === null ||
          !("model_loaded" in health) ||
          typeof health.model_loaded !== "boolean"
        ) {
          throw new Error("Model health response is invalid.");
        }
        if (health.model_loaded === true) {
          setModelStatus("ready");
          setModelApiError("");
        } else {
          setModelStatus("missing");
          setModelApiError(
            "model_error" in health && typeof health.model_error === "string"
              ? health.model_error
              : "The API is reachable, but it has no trained model loaded.",
          );
        }
      } catch (healthError) {
        if (controller.signal.aborted) return;
        console.error("Unable to check ripeness model status:", healthError);
        setModelStatus("offline");
        setModelApiError(
          healthError instanceof TypeError
            ? `Could not reach ${modelApiUrl}. Start the model API or check its URL, network access, and CORS settings.`
            : healthError instanceof Error
              ? healthError.message
              : "Unable to check the model API. Verify the address and try again.",
        );
      }
    };
    void checkModel();
    return () => controller.abort();
  }, [modelApiUrl, modelApiCheckAttempt]);

  const connectModelApi = () => {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(modelApiUrlDraft.trim());
    } catch {
      setModelApiError("Enter the full model API address, including http:// or https://.");
      return;
    }
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      setModelApiError("The model API address must use HTTP or HTTPS.");
      return;
    }

    const normalizedUrl = parsedUrl.toString().replace(/\/+$/, "");
    try {
      window.localStorage.setItem(RIPENESS_API_URL_STORAGE_KEY, normalizedUrl);
    } catch (storageError) {
      console.error("Unable to save the ripeness API URL:", storageError);
      setModelApiError("The model API address could not be saved in this browser.");
      return;
    }
    setModelApiUrlDraft(normalizedUrl);
    setModelApiUrl(normalizedUrl);
    setModelStatus("checking");
    setModelApiError("");
    setModelApiCheckAttempt((attempt) => attempt + 1);
  };

  useEffect(() => {
    if (!storageLoaded) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(observations));
      setStorageError("");
    } catch (saveError) {
      console.error("Unable to save ripeness records:", saveError);
      setStorageError("Harvest records could not be saved. Check this browser's storage settings.");
    }
  }, [observations, storageLoaded]);

  useEffect(() => {
    const showNextDemoPlant = (event: Event) => {
      const { x, y } = (event as RoverDemoPlantEvent).detail;
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;
      const sample = DEMO_PLANTS[(nextPlantNumberRef.current - 1) % DEMO_PLANTS.length];
      const plantNumber = nextPlantNumberRef.current;
      nextPlantNumberRef.current += 1;
      const image = sample.image;
      setActiveFieldScan({
        image,
        crop: sample.crop,
        ripeness: sample.ripeness,
        source: "demo",
        annotations: (sample.crop === "Banana plant" ? DEMO_BANANA_POSITIONS : DEMO_FRUIT_POSITIONS)
          .map((position) => ({ ...position, ripeness: sample.ripeness })),
        scannedAt: new Date().toISOString(),
      });
      setRoverPlantReviews((current) =>
        [
          ...current,
          {
            id: `demo-${Date.now()}-${plantNumber}`,
            plantNumber,
            crop: sample.crop,
            ripeness: sample.ripeness,
            confidence: null,
            image,
            reviewedAt: new Date().toISOString(),
            source: "demo" as const,
          },
        ].slice(-8),
      );
    };
    window.addEventListener("rover-demo-plant", showNextDemoPlant);
    return () => window.removeEventListener("rover-demo-plant", showNextDemoPlant);
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
  }, []);

  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraActive]);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (roverFrameUrlRef.current) URL.revokeObjectURL(roverFrameUrlRef.current);
  }, []);

  useEffect(() => {
    if (!roverCameraConnected) return;

    let active = true;
    let retryTimer: ReturnType<typeof setTimeout>;
    let controller: AbortController | null = null;

    const pollRoverCamera = async () => {
      controller = new AbortController();
      try {
        const response = await fetch(roverCameraUrl, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Rover camera request failed (${response.status}).`);
        if (!response.headers.get("content-type")?.toLowerCase().startsWith("image/")) {
          throw new Error("The rover camera endpoint must return a JPEG or other image.");
        }

        const frame = await response.blob();
        if (!active) return;
        latestRoverFrameRef.current = frame;
        if (roverFrameUrlRef.current) URL.revokeObjectURL(roverFrameUrlRef.current);
        roverFrameUrlRef.current = URL.createObjectURL(frame);
        setRoverCameraFrame(roverFrameUrlRef.current);
        setRoverCameraStatus("connected");
        setRoverCameraError("");
      } catch (cameraError) {
        if (!active || controller.signal.aborted) return;
        console.error("Unable to read a frame from the rover camera:", cameraError);
        setRoverCameraStatus("offline");
        setRoverCameraError(
          cameraError instanceof Error
            ? `${cameraError.message} Check the URL, network connection, and camera CORS settings.`
            : "Unable to read a frame from the rover camera.",
        );
      } finally {
        if (active) retryTimer = setTimeout(pollRoverCamera, 2000);
      }
    };

    setRoverCameraStatus("connecting");
    void pollRoverCamera();
    return () => {
      active = false;
      clearTimeout(retryTimer);
      controller?.abort();
    };
  }, [roverCameraConnected, roverCameraUrl]);

  const startCamera = async () => {
    setError("");
    setMessage("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera access is unavailable. Use a secure connection or upload a photo instead.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });
      streamRef.current = stream;
      setCameraActive(true);
    } catch (cameraError) {
      console.error("Unable to start the ripeness camera:", cameraError);
      setError("Unable to access the camera. Check browser permissions or upload a photo.");
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      setError("The camera image is not ready yet. Please try again in a moment.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) {
      setError("Unable to capture the camera image in this browser.");
      return;
    }

    context.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError("Unable to prepare the camera image. Please try again.");
          return;
        }
        setImagePreview(canvas.toDataURL("image/jpeg", 0.85));
        setAnalysisFrames([blob]);
        setIsRoverPlantReview(false);
        setPrediction(null);
        setError("");
        setMessage("Photo captured. Confirm the crop and ripeness label before saving.");
        stopCamera();
      },
      "image/jpeg",
      0.85,
    );
  };

  const connectRoverCamera = () => {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(roverCameraUrl);
    } catch {
      setRoverCameraError("Enter a complete rover camera URL, such as http://192.168.4.1/capture.");
      return;
    }
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      setRoverCameraError("The rover camera URL must use HTTP or HTTPS.");
      return;
    }

    try {
      window.localStorage.setItem(ROVER_CAMERA_URL_STORAGE_KEY, parsedUrl.toString());
    } catch (storageError) {
      console.error("Unable to save the rover camera URL:", storageError);
      setRoverCameraError("The rover camera URL could not be saved in this browser.");
      return;
    }

    setRoverCameraUrl(parsedUrl.toString());
    setRoverCameraError("");
    setRoverCameraConnected(true);
  };

  const captureRoverFrame = () => {
    const frame = latestRoverFrameRef.current;
    if (!frame) {
      setError("Wait for a rover camera frame before capturing it.");
      return;
    }

    void prepareImageFrame(frame)
      .then(({ preview, frame: analysisFrame }) => {
        setImagePreview(preview);
        setAnalysisFrames([analysisFrame]);
        setIsRoverPlantReview(true);
        setPrediction(null);
        setError("");
        setMessage("Rover field frame captured. Confirm the crop and ripeness before saving.");
      })
      .catch((frameError: unknown) => {
        console.error("Unable to prepare the rover camera frame:", frameError);
        setError(
          frameError instanceof Error
            ? frameError.message
            : "Unable to prepare the rover camera frame. Please try again.",
        );
      });
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const uploadSequence = ++mediaUploadSequenceRef.current;
    setIsRoverPlantReview(false);
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      setError("Choose an image or video file to review.");
      setIsProcessingMedia(false);
      event.target.value = "";
      return;
    }

    stopCamera();
    setImagePreview(null);
    setAnalysisFrames([]);
    setIsProcessingMedia(true);
    setError("");
    setMessage("");
    setPrediction(null);
    if (file.type.startsWith("video/")) {
      void extractVideoFrames(file)
        .then(({ preview, frames }) => {
          if (uploadSequence !== mediaUploadSequenceRef.current) return;
          setImagePreview(preview);
          setAnalysisFrames(frames);
          setMessage(`Video uploaded. ${frames.length} frames are ready for ripeness analysis.`);
        })
        .catch((mediaError: unknown) => {
          if (uploadSequence !== mediaUploadSequenceRef.current) return;
          console.error("Unable to process the uploaded video:", mediaError);
          setImagePreview(null);
          setAnalysisFrames([]);
          setError(
            mediaError instanceof Error
              ? mediaError.message
              : "Unable to read this video. Please try another file.",
          );
        })
        .finally(() => {
          if (uploadSequence === mediaUploadSequenceRef.current) setIsProcessingMedia(false);
        });
      event.target.value = "";
      return;
    }

    void prepareImageFrame(file)
      .then(({ preview, frame }) => {
        if (uploadSequence !== mediaUploadSequenceRef.current) return;
        setImagePreview(preview);
        setAnalysisFrames([frame]);
        setPrediction(null);
        setError("");
        setMessage("Photo uploaded and prepared. Confirm the crop and ripeness label before saving.");
      })
      .catch((mediaError: unknown) => {
        if (uploadSequence !== mediaUploadSequenceRef.current) return;
        console.error("Unable to prepare the uploaded photo:", mediaError);
        setError(
          mediaError instanceof Error
            ? mediaError.message
            : "Unable to read this image. Please try another file.",
        );
      })
      .finally(() => {
        if (uploadSequence === mediaUploadSequenceRef.current) setIsProcessingMedia(false);
      });
    event.target.value = "";
  };

  const analyzeImage = async () => {
    if (!imagePreview || analysisFrames.length === 0) {
      setError("Capture or upload a photo or video before requesting a model prediction.");
      return;
    }
    if (!modelApiUrl) {
      setError("Connect to a trained model API before requesting a prediction.");
      return;
    }

    setIsPredicting(true);
    const reviewingRoverPlant = isRoverPlantReview;
    setError("");
    setMessage("");
    setPrediction(null);
    try {
      const predictions = await Promise.all(
        analysisFrames.map(async (frame) => {
          const formData = new FormData();
          formData.append("image", frame, "crop-frame.jpg");
          const response = await fetch(`${modelApiUrl}/predict`, {
            method: "POST",
            body: formData,
          });
          if (!response.ok) {
            const body: unknown = await response.json().catch(() => null);
            const detail =
              typeof body === "object" &&
              body !== null &&
              "detail" in body &&
              typeof body.detail === "string"
                ? body.detail
                : `Model request failed (${response.status}).`;
            if (response.status === 503) setModelStatus("missing");
            throw new Error(detail);
          }

          const result: unknown = await response.json();
          if (!isRipenessPrediction(result)) {
            throw new Error("The model returned an invalid prediction.");
          }
          return result;
        }),
      );
      const groupedPredictions = new Map<
        string,
        { prediction: RipenessPrediction; votes: number; confidenceTotal: number }
      >();
      for (const framePrediction of predictions) {
        const key = `${framePrediction.crop}:${framePrediction.ripeness}`;
        const group = groupedPredictions.get(key);
        if (group) {
          group.votes += 1;
          group.confidenceTotal += framePrediction.confidence;
        } else {
          groupedPredictions.set(key, {
            prediction: framePrediction,
            votes: 1,
            confidenceTotal: framePrediction.confidence,
          });
        }
      }
      const bestPrediction = [...groupedPredictions.values()].sort(
        (left, right) =>
          right.votes - left.votes ||
          right.confidenceTotal / right.votes - left.confidenceTotal / left.votes,
      )[0];
      const modelPrediction = {
        ...bestPrediction.prediction,
        confidence: bestPrediction.confidenceTotal / bestPrediction.votes,
      };
      setPrediction(modelPrediction);
      setModelStatus("ready");
      setActiveFieldScan({
        image: imagePreview,
        crop: modelPrediction.crop,
        ripeness: modelPrediction.ripeness,
        source: "live",
        annotations: [],
        scannedAt: new Date().toISOString(),
      });
      if (reviewingRoverPlant) {
        const plantNumber = nextPlantNumberRef.current;
        nextPlantNumberRef.current += 1;
        setRoverPlantReviews((current) =>
          [
            ...current,
            {
              id: `${Date.now()}-${plantNumber}`,
              plantNumber,
              crop: modelPrediction.crop,
              ripeness: modelPrediction.ripeness,
              confidence: modelPrediction.confidence,
              image: imagePreview,
              reviewedAt: new Date().toISOString(),
              source: "live" as const,
            },
          ].slice(-8),
        );
        setIsRoverPlantReview(false);
      }
      setMessage(
        analysisFrames.length > 1
          ? `Model suggestion from ${analysisFrames.length} video frames. Review the labels before saving.`
          : "Model suggestion received. Review the crop and ripeness labels before saving.",
      );

      const predictedCrop = CROPS.find(
        (item) =>
          item.replace(/[^a-z0-9]/gi, "").toLowerCase() ===
          modelPrediction.crop.replace(/[^a-z0-9]/gi, "").toLowerCase(),
      );
      if (predictedCrop) setCrop(predictedCrop);
      setRipeness(modelPrediction.ripeness);
    } catch (predictionError) {
      console.error("Ripeness model prediction failed:", predictionError);
      setError(
        predictionError instanceof TypeError
          ? `Could not reach ${modelApiUrl}. Check that the model API is running and allows this website in its CORS settings.`
          : predictionError instanceof Error
            ? predictionError.message
            : "Unable to get a ripeness prediction. Check the model API and try again.",
      );
    } finally {
      setIsPredicting(false);
    }
  };

  const addObservation = () => {
    if (!imagePreview) {
      setError("Capture or upload a photo before saving an observation.");
      return;
    }
    if (!Number.isInteger(count) || count < 1 || count > 1_000_000) {
      setError("Enter a whole-number fruit or vegetable count between 1 and 1,000,000.");
      return;
    }

    const observation: RipenessObservation = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      crop,
      ripeness,
      count,
      createdAt: new Date().toISOString(),
    };
    setObservations((current) => [observation, ...current]);
    setImagePreview(null);
    setAnalysisFrames([]);
    setIsRoverPlantReview(false);
    setCount(1);
    setError("");
    setMessage(`${count} ${crop} item${count === 1 ? "" : "s"} recorded as ${ripeness}.`);
  };

  const removeObservation = (id: string) => {
    setObservations((current) => current.filter((observation) => observation.id !== id));
  };

  const hasSampleData = observations.some((observation) => observation.id.startsWith("sample-"));
  const addSampleData = () => {
    const samples: Omit<RipenessObservation, "createdAt">[] = [
      { id: "sample-tomato-ripe", crop: "Tomato", ripeness: "ripe", count: 18 },
      { id: "sample-tomato-unripe", crop: "Tomato", ripeness: "unripe", count: 7 },
      { id: "sample-mango-ripe", crop: "Mango", ripeness: "ripe", count: 12 },
      { id: "sample-mango-unripe", crop: "Mango", ripeness: "unripe", count: 5 },
      { id: "sample-banana-ripe", crop: "Banana", ripeness: "ripe", count: 15 },
      { id: "sample-banana-unripe", crop: "Banana", ripeness: "unripe", count: 9 },
      { id: "sample-chili-ripe", crop: "Chili", ripeness: "ripe", count: 10 },
      { id: "sample-chili-unripe", crop: "Chili", ripeness: "unripe", count: 6 },
    ];
    const createdAt = new Date().toISOString();
    setObservations((current) => [
      ...samples
        .filter((sample) => !current.some((observation) => observation.id === sample.id))
        .map((sample) => ({ ...sample, createdAt })),
      ...current,
    ]);
    setMessage("Demo sample observations added. They are labeled as sample data and included in field totals.");
  };

  const removeSampleData = () => {
    setObservations((current) => current.filter((observation) => !observation.id.startsWith("sample-")));
    setMessage("Demo sample observations removed. Farmer-confirmed observations were kept.");
  };

  const cropObservations = observations.filter((observation) => observation.crop === crop);
  const ripeCount = cropObservations
    .filter((observation) => observation.ripeness === "ripe")
    .reduce((total, observation) => total + observation.count, 0);
  const unripeCount = cropObservations
    .filter((observation) => observation.ripeness === "unripe")
    .reduce((total, observation) => total + observation.count, 0);
  const cropTotals = observations.reduce<Record<string, { ripe: number; unripe: number }>>(
    (totals, observation) => {
      const current = totals[observation.crop] ?? { ripe: 0, unripe: 0 };
      current[observation.ripeness] += observation.count;
      totals[observation.crop] = current;
      return totals;
    },
    {},
  );

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="ripeness-heading">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-green-700">
            <Leaf size={17} />
            Harvest readiness
          </div>
          <h2 id="ripeness-heading" className="text-2xl font-bold text-gray-900">
            Fruit &amp; vegetable ripeness
          </h2>
          <p className="mt-1 max-w-3xl text-sm text-gray-600">
            Review a camera photo, confirm its crop and ripeness, and keep a running harvest count for each crop.
          </p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${
          modelStatus === "ready"
            ? "border-green-200 bg-green-50 text-green-800"
            : "border-amber-200 bg-amber-50 text-amber-800"
        }`}>
          {modelStatus === "ready"
            ? "Trained model connected · confirm each result"
            : modelStatus === "checking"
              ? "Checking ripeness model…"
              : modelStatus === "missing"
                ? "No trained model · manual labels active"
                : "Model API offline · manual labels active"}
        </span>
      </div>

      <div className="mb-5 flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        <CircleAlert className="mt-0.5 shrink-0" size={18} />
        <p>
          Predictions require a trained model and a running inference API. Always confirm the suggested crop and
          ripeness before saving; videos are sampled across several frames, and predictions do not count individual produce. Rover camera
          snapshots and harvest records are handled by this dashboard and saved records stay in this browser.
        </p>
      </div>

      <div className="mb-5 rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex flex-wrap items-end gap-3">
          <label htmlFor="ripeness-api-url" className="min-w-0 flex-1 text-sm font-medium text-gray-700">
            Trained model API address
            <input
              id="ripeness-api-url"
              type="url"
              value={modelApiUrlDraft}
              onChange={(event) => setModelApiUrlDraft(event.target.value)}
              placeholder="http://localhost:8000"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            />
          </label>
          <button
            type="button"
            onClick={connectModelApi}
            disabled={modelStatus === "checking"}
            className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:cursor-wait disabled:opacity-60"
          >
            {modelStatus === "checking" ? "Connecting…" : "Connect model"}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-600">
          For local use, start the trained model API on port 8000. For a deployed website, enter the public HTTPS
          address of your deployed model API; localhost points to the farmer&apos;s own device.
        </p>
        {modelApiError && (
          <p role="alert" className="mt-2 text-sm text-red-700">{modelApiError}</p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Review a crop photo or video</h3>

          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-semibold text-green-950">Rover field camera</h4>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                roverCameraStatus === "connected"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-700"
              }`}>
                {roverCameraStatus === "connected"
                  ? "Receiving field frames"
                  : roverCameraStatus === "connecting"
                    ? "Connecting…"
                    : roverCameraStatus === "offline"
                      ? "Camera unavailable"
                      : "Not connected"}
              </span>
            </div>
            <label htmlFor="rover-camera-url" className="text-sm font-medium text-gray-700">
              Rover JPEG snapshot URL
            </label>
            <div className="mt-1 flex flex-wrap gap-2">
              <input
                id="rover-camera-url"
                type="url"
                value={roverCameraUrl}
                disabled={roverCameraConnected}
                onChange={(event) => setRoverCameraUrl(event.target.value)}
                placeholder="http://192.168.4.1/capture"
                className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
              />
              {roverCameraConnected ? (
                <button
                  type="button"
                  onClick={() => {
                    setRoverCameraConnected(false);
                    setRoverCameraStatus("disconnected");
                    setRoverCameraFrame(null);
                    if (roverFrameUrlRef.current) URL.revokeObjectURL(roverFrameUrlRef.current);
                    roverFrameUrlRef.current = null;
                    latestRoverFrameRef.current = null;
                  }}
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  type="button"
                  onClick={connectRoverCamera}
                  className="rounded-md bg-green-700 px-3 py-2 text-sm font-medium text-white hover:bg-green-800"
                >
                  Connect rover camera
                </button>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-600">
              Enter an endpoint that returns one JPEG image; the dashboard checks for a new frame every 2 seconds.
              The rover camera must allow browser CORS requests.
            </p>
            {roverCameraError && <p role="alert" className="mt-2 text-sm text-red-700">{roverCameraError}</p>}
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="min-w-0 rounded-lg border border-gray-200 bg-white p-2">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h5 className="text-sm font-semibold text-gray-900">Before scan</h5>
                  <span className="text-[11px] text-gray-500">Field view</span>
                </div>
                <div className="relative flex aspect-[8/5] items-center justify-center overflow-hidden rounded-md bg-gray-900">
                  {activeFieldScan || roverCameraFrame ? (
                    <img
                      src={activeFieldScan?.image ?? roverCameraFrame ?? ""}
                      alt="Unannotated whole plant before ripeness review"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <p className="px-3 text-center text-xs text-gray-300">
                      Start the virtual rover or connect the field camera to show a plant.
                    </p>
                  )}
                </div>
              </div>
              <div className="min-w-0 rounded-lg border border-gray-200 bg-white p-2">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h5 className="text-sm font-semibold text-gray-900">After scan</h5>
                  <span className="text-[11px] text-gray-500">
                    {activeFieldScan ? activeFieldScan.source === "demo" ? "Virtual annotations" : "Model result" : "Awaiting scan"}
                  </span>
                </div>
                <div className="relative flex aspect-[8/5] items-center justify-center overflow-hidden rounded-md bg-gray-900">
                  {activeFieldScan ? (
                    <>
                      <img
                        src={activeFieldScan.image}
                        alt={`Whole ${activeFieldScan.crop.toLowerCase()} plant after scan`}
                        className="h-full w-full object-contain"
                      />
                      {activeFieldScan.source === "demo" ? (
                        <svg
                          viewBox="0 0 480 300"
                          preserveAspectRatio="xMidYMid meet"
                          className="pointer-events-none absolute inset-0 h-full w-full"
                          role="img"
                          aria-label={`Virtual example annotations: fruit marked ${activeFieldScan.ripeness}`}
                        >
                          {activeFieldScan.annotations.map((annotation, index) => {
                            const ripe = annotation.ripeness === "ripe";
                            const color = ripe ? "#15803d" : "#c2410c";
                            return (
                              <g key={`${annotation.x}-${annotation.y}-${index}`}>
                                <circle
                                  cx={annotation.x}
                                  cy={annotation.y}
                                  r="17"
                                  fill="none"
                                  stroke="white"
                                  strokeWidth="5"
                                />
                                <circle
                                  cx={annotation.x}
                                  cy={annotation.y}
                                  r="17"
                                  fill="none"
                                  stroke={color}
                                  strokeWidth="3"
                                />
                                <rect
                                  x={annotation.x - 32}
                                  y={annotation.y + 19}
                                  width="64"
                                  height="18"
                                  rx="5"
                                  fill={color}
                                />
                                <text
                                  x={annotation.x}
                                  y={annotation.y + 32}
                                  fill="white"
                                  fontSize="11"
                                  fontWeight="700"
                                  textAnchor="middle"
                                >
                                  {ripe ? "RIPE" : "UNRIPE"}
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      ) : (
                        <div className="absolute inset-x-2 top-2 rounded-md bg-black/75 px-2 py-1.5 text-xs font-semibold text-white">
                          {activeFieldScan.crop.replace(/_/g, " ")} · {activeFieldScan.ripeness.toUpperCase()}
                          <span className="block text-[10px] font-normal">
                            Whole-frame model result; individual fruit locations are not detected.
                          </span>
                        </div>
                      )}
                    </>
                  ) : roverCameraFrame ? (
                    <>
                      <img
                        src={roverCameraFrame}
                        alt="Latest whole plant image awaiting analysis"
                        className="h-full w-full object-contain"
                      />
                      <span className="absolute inset-x-2 top-2 rounded-md bg-black/75 px-2 py-1 text-center text-xs text-white">
                        Capture and analyze this frame to see the model result.
                      </span>
                    </>
                  ) : (
                    <p className="px-3 text-center text-xs text-gray-300">
                      Fruit ripeness annotations will appear here after a virtual scan or model analysis.
                    </p>
                  )}
                </div>
              </div>
            </div>
            {roverCameraFrame && (
              <button
                type="button"
                onClick={captureRoverFrame}
                className="mt-2 inline-flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
              >
                <Camera size={16} />
                Capture and analyze field plant
              </button>
            )}
            <div className="mt-4 rounded-lg border border-green-200 bg-white p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h5 className="text-sm font-semibold text-gray-900">Farmer field plant view</h5>
                  <p className="mt-1 text-xs text-gray-600">
                    See each whole plant in its field as the rover moves past it, or view the live camera frame.
                  </p>
                </div>
                <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-800">
                  {roverPlantReviews.length} reviewed
                </span>
              </div>
              <p className="mt-2 text-[11px] text-amber-800">
                Virtual rover shows illustrated whole plants in a field. Example ripeness labels are for demonstration only, not camera detections.
              </p>
              {roverPlantReviews.length === 0 ? (
                <p className="mt-3 rounded-md border border-dashed border-gray-200 px-3 py-4 text-center text-xs text-gray-500">
                  Start the rover and hold Forward or Reverse to see whole field plants appear here in sequence.
                </p>
              ) : (
                <ol className="mt-3 flex gap-3 overflow-x-auto pb-1">
                  {roverPlantReviews.map((review) => (
                    <li
                      key={review.id}
                      className="w-52 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50 sm:w-60"
                    >
                      <img
                        src={review.image}
                        alt={`Whole ${review.crop.toLowerCase()} growing in a field, plant ${review.plantNumber}`}
                        className="h-32 w-full bg-green-100 object-cover sm:h-36"
                      />
                      <div className="p-2">
                        <p className="text-xs font-semibold text-gray-900">Plant {review.plantNumber}</p>
                        <p className="truncate text-xs capitalize text-gray-700">
                          {review.crop.replace(/_/g, " ")} · {review.ripeness}
                        </p>
                        <p className={`text-[11px] font-medium ${review.source === "demo" ? "text-amber-700" : "text-green-700"}`}>
                          {review.source === "demo"
                            ? "Virtual demo · sample label"
                            : `${((review.confidence ?? 0) * 100).toFixed(0)}% model confidence`}
                        </p>
                        <time
                          dateTime={review.reviewedAt}
                          className="text-[11px] text-gray-500"
                        >
                          {new Date(review.reviewedAt).toLocaleTimeString()}
                        </time>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={startCamera}
              disabled={cameraActive}
              className="inline-flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Camera size={16} />
              Open camera
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Upload size={16} />
              Upload photo or video
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaUpload}
              className="hidden"
              aria-label="Upload a fruit or vegetable photo or video"
            />
          </div>

          {cameraActive && (
            <div className="mb-4 space-y-3">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="max-h-72 w-full rounded-lg bg-gray-900 object-contain"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={captureImage}
                  className="inline-flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
                >
                  <Camera size={16} />
                  Capture photo
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <X size={16} />
                  Close camera
                </button>
              </div>
            </div>
          )}

          {!cameraActive && imagePreview ? (
            <div className="relative mb-4">
              <img src={imagePreview} alt="Uploaded media frame awaiting farmer ripeness confirmation" className="max-h-72 w-full rounded-lg bg-gray-50 object-contain" />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setAnalysisFrames([]);
                  setIsRoverPlantReview(false);
                  setPrediction(null);
                }}
                aria-label="Remove media"
                className="absolute right-2 top-2 rounded-full bg-white p-2 text-gray-700 shadow hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>
          ) : !cameraActive && (
            <div className="mb-4 flex min-h-36 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 text-center text-sm text-gray-500">
              <div>
                <ImagePlus className="mx-auto mb-2" size={24} />
                {isProcessingMedia
                  ? "Preparing uploaded media for analysis…"
                  : "Capture or upload a photo or video to start a farmer-reviewed record."}
              </div>
            </div>
          )}

          {imagePreview && (
            <div className="mb-4">
              <button
                type="button"
                onClick={analyzeImage}
                disabled={isPredicting || isProcessingMedia || modelStatus === "checking"}
                className="inline-flex items-center gap-2 rounded-md border border-green-700 px-4 py-2 text-sm font-medium text-green-800 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Leaf size={16} />
                {isPredicting
                  ? "Analyzing media…"
                  : isRoverPlantReview
                    ? `Analyze plant ${nextPlantNumberRef.current}`
                    : "Analyze with trained model"}
              </button>
              {prediction && (
                <p role="status" className="mt-2 text-sm text-gray-700">
                  Model suggestion: <strong>{prediction.crop.replace(/_/g, " ")}</strong>,{" "}
                  <strong className="capitalize">{prediction.ripeness}</strong>
                  {" "}({(prediction.confidence * 100).toFixed(1)}% model confidence).
                  Confirm or change these labels below.
                </p>
              )}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="text-sm font-medium text-gray-700">
              Crop
              <select
                value={crop}
                onChange={(event) => setCrop(event.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                {CROPS.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-gray-700">
              Number of items
              <input
                type="number"
                min={1}
                max={1_000_000}
                step={1}
                value={count}
                onChange={(event) => setCount(Number(event.target.value))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </label>
            <fieldset>
              <legend className="text-sm font-medium text-gray-700">Ripeness</legend>
              <div className="mt-1 flex gap-2">
                {(["ripe", "unripe"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={ripeness === item}
                    onClick={() => setRipeness(item)}
                    className={`flex-1 rounded-md border px-2 py-2 text-sm font-medium capitalize ${
                      ripeness === item
                        ? item === "ripe" ? "border-green-700 bg-green-50 text-green-800" : "border-orange-600 bg-orange-50 text-orange-800"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <button
            type="button"
            onClick={addObservation}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
          >
            <Check size={16} />
            Save confirmed count
          </button>
          {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
          {message && !error && <p role="status" className="mt-3 text-sm text-green-700">{message}</p>}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <label htmlFor="ripeness-crop-filter" className="text-sm font-medium text-gray-700">Crop information</label>
            <select
              id="ripeness-crop-filter"
              value={crop}
              onChange={(event) => setCrop(event.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              {CROPS.map((item) => <option key={item}>{item}</option>)}
            </select>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-sm font-medium text-green-800">Ripe · {crop}</p>
                <p className="mt-1 text-3xl font-bold text-green-900">{ripeCount}</p>
                <p className="text-xs text-green-800">ready for farmer review</p>
              </div>
              <div className="rounded-lg bg-orange-50 p-4">
                <p className="text-sm font-medium text-orange-800">Unripe · {crop}</p>
                <p className="mt-1 text-3xl font-bold text-orange-900">{unripeCount}</p>
                <p className="text-xs text-orange-800">leave to mature</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">Field totals by crop</h3>
            <p className="mb-4 text-sm text-gray-600">Counts include farmer-confirmed observations and any clearly marked demo samples saved in this browser.</p>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={addSampleData}
                className="rounded-md border border-green-700 px-3 py-2 text-sm font-medium text-green-800 hover:bg-green-50"
              >
                {hasSampleData ? "Restore sample data" : "Load sample data"}
              </button>
              {hasSampleData && (
                <button
                  type="button"
                  onClick={removeSampleData}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Remove sample data
                </button>
              )}
              {!hasSampleData && <span className="text-xs text-gray-500">Demo counts are labeled and can be removed.</span>}
            </div>
            {Object.keys(cropTotals).length === 0 ? (
              <p className="text-sm text-gray-500">No crop counts recorded yet.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(cropTotals).sort(([a], [b]) => a.localeCompare(b)).map(([name, totals]) => (
                  <article key={name} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <h4 className="mb-3 font-semibold text-gray-900">{name}</h4>
                    <dl className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-md bg-green-50 p-2">
                        <dt className="text-xs font-medium text-green-800">Ripe</dt>
                        <dd className="mt-1 text-xl font-bold text-green-900">{totals.ripe}</dd>
                      </div>
                      <div className="rounded-md bg-orange-50 p-2">
                        <dt className="text-xs font-medium text-orange-800">Unripe</dt>
                        <dd className="mt-1 text-xl font-bold text-orange-900">{totals.unripe}</dd>
                      </div>
                      <div className="rounded-md bg-white p-2">
                        <dt className="text-xs font-medium text-gray-600">Total</dt>
                        <dd className="mt-1 text-xl font-bold text-gray-900">{totals.ripe + totals.unripe}</dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-lg font-semibold text-gray-900">Recent farmer-confirmed observations</h3>
        {storageError && <p role="alert" className="mb-3 flex items-center gap-2 text-sm text-amber-800"><CircleAlert size={16} />{storageError}</p>}
        {observations.length === 0 ? (
          <p className="text-sm text-gray-500">Saved observations will appear here and remain available in this browser.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {observations.slice(0, 10).map((observation) => (
              <li key={observation.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-medium text-gray-900">
                    {observation.count} {observation.crop} · <span className={observation.ripeness === "ripe" ? "text-green-700" : "text-orange-700"}>{observation.ripeness}</span>
                  </p>
                  {observation.id.startsWith("sample-") && (
                    <span className="text-xs font-medium text-blue-700">Demo sample data</span>
                  )}
                  <time dateTime={observation.createdAt} className="text-xs text-gray-500">
                    {new Date(observation.createdAt).toLocaleString()}
                  </time>
                </div>
                <button
                  type="button"
                  onClick={() => removeObservation(observation.id)}
                  aria-label={`Delete ${observation.crop} ${observation.ripeness} observation`}
                  className="rounded-md p-2 text-gray-500 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default RipenessTracker;
