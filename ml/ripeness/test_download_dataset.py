import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from download_dataset import download_split


class DownloadResumeTests(unittest.TestCase):
    def test_resumes_existing_split_without_redownloading_completed_images(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            split_dir = Path(temporary_directory) / "train"
            existing_image = split_dir / "banana__unripe" / "train_00000.jpg"
            existing_image.parent.mkdir(parents=True)
            existing_image.write_bytes(b"already downloaded")
            rows = {
                "num_rows_total": 2,
                "rows": [
                    {"row_idx": 0, "row": {"label": 0}},
                    {"row_idx": 1, "row": {"label": 1, "image": {"src": "image-url"}}},
                ],
            }
            downloaded: list[Path] = []

            def save_image(_url: str, image_path: Path) -> None:
                downloaded.append(image_path)
                image_path.write_bytes(b"downloaded")

            with (
                patch("download_dataset.fetch_rows", return_value=rows),
                patch("download_dataset.download_image", side_effect=save_image),
            ):
                saved_count = download_split("train", Path(temporary_directory), overwrite=False)

            self.assertEqual(saved_count, 2)
            self.assertEqual(downloaded, [split_dir / "mango__unripe" / "train_00001.jpg"])
            self.assertTrue((split_dir / "mango__unripe" / "train_00001.jpg").is_file())


if __name__ == "__main__":
    unittest.main()
