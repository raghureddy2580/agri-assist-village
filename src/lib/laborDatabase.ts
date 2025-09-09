// Labor Hiring System Database Schema
// Similar to Indeed.com functionality for connecting farmers with laborers

export interface FarmerProfile {
    id: string;
    userId: string; // Links to AuthContext user
    name: string;
    email: string;
    phone: string;
    location: {
        village: string;
        district: string;
        state: string;
        pincode: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    farmDetails: {
        farmSize: number; // in acres
        crops: string[]; // crop IDs from cropDatabase
        farmingType: 'organic' | 'conventional' | 'mixed';
        experience: number; // years of farming experience
    };
    preferences: {
        workType: ('daily_wage' | 'contract' | 'seasonal')[];
        skills: string[];
        paymentMethod: 'daily' | 'weekly' | 'monthly';
        accommodation: boolean;
    };
    rating: number; // 1-5 stars
    totalJobsPosted: number;
    completedJobs: number;
    createdAt: string;
    updatedAt: string;
}

export interface LaborerProfile {
    id: string;
    userId: string; // Links to AuthContext user
    name: string;
    email: string;
    phone: string;
    location: {
        village: string;
        district: string;
        state: string;
        pincode: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    personalDetails: {
        age: number;
        gender: 'male' | 'female' | 'other';
        education: string;
        languages: string[];
    };
    workExperience: {
        totalYears: number;
        skills: string[];
        previousJobs: WorkExperience[];
        certifications: string[];
    };
    availability: {
        workType: ('daily_wage' | 'contract' | 'seasonal')[];
        availableDays: string[]; // ['monday', 'tuesday', etc.]
        preferredLocations: string[]; // districts willing to work in
        travelWillingness: 'local' | 'district' | 'state' | 'anywhere';
    };
    preferences: {
        minWage: number; // minimum daily wage expected
        maxDistance: number; // maximum distance willing to travel (km)
        accommodation: boolean; // willing to work with accommodation
        food: boolean; // food provided
    };
    rating: number; // 1-5 stars
    totalJobsCompleted: number;
    completedJobs: number;
    profileVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface WorkExperience {
    id: string;
    farmerId: string;
    farmerName: string;
    jobTitle: string;
    duration: {
        startDate: string;
        endDate: string;
    };
    skillsUsed: string[];
    rating: number; // rating given by farmer
    review: string;
}

export interface JobPosting {
    id: string;
    farmerId: string;
    farmerName: string;
    title: string;
    description: string;
    jobType: 'daily_wage' | 'contract' | 'seasonal';
    workDetails: {
        skills: string[];
        duration: string; // "2 weeks", "3 months", etc.
        workingHours: string; // "8 hours/day", "flexible", etc.
        workLocation: {
            village: string;
            district: string;
            state: string;
            coordinates?: {
                lat: number;
                lng: number;
            };
        };
    };
    requirements: {
        experience: string; // "experienced", "beginner", "any"
        gender: 'male' | 'female' | 'any';
        ageRange: {
            min: number;
            max: number;
        };
        languages: string[];
    };
    compensation: {
        wageType: 'daily' | 'weekly' | 'monthly';
        amount: number;
        paymentSchedule: string;
        additionalBenefits: string[]; // ['accommodation', 'food', 'transport']
    };
    status: 'active' | 'filled' | 'cancelled' | 'expired';
    applications: JobApplication[];
    createdAt: string;
    updatedAt: string;
    expiresAt: string;
}

export interface JobApplication {
    id: string;
    jobId: string;
    laborerId: string;
    laborerName: string;
    appliedAt: string;
    status: 'pending' | 'shortlisted' | 'accepted' | 'rejected' | 'withdrawn';
    coverLetter?: string;
    expectedWage?: number;
    availability: string;
    reviewedAt?: string;
    reviewedBy?: string;
}

export interface JobContract {
    id: string;
    jobId: string;
    farmerId: string;
    laborerId: string;
    terms: {
        startDate: string;
        endDate: string;
        workingHours: string;
        wage: number;
        wageType: string;
        benefits: string[];
        responsibilities: string[];
    };
    status: 'active' | 'completed' | 'terminated' | 'disputed';
    createdAt: string;
    signedAt?: string;
    completedAt?: string;
    rating?: {
        farmerRating: number;
        laborerRating: number;
        farmerReview: string;
        laborerReview: string;
    };
}

export interface Notification {
    id: string;
    userId: string;
    type: 'job_application' | 'job_accepted' | 'job_rejected' | 'contract_signed' | 'payment_due' | 'rating_received';
    title: string;
    message: string;
    relatedId: string; // jobId, applicationId, contractId, etc.
    isRead: boolean;
    createdAt: string;
}

// Sample data for development
export const sampleFarmers: FarmerProfile[] = [
    {
        id: 'farmer_001',
        userId: 'user_001',
        name: 'Rajesh Kumar',
        email: 'rajesh.farmer@email.com',
        phone: '+91-9876543210',
        location: {
            village: 'Kolar',
            district: 'Kolar',
            state: 'Karnataka',
            pincode: '563101'
        },
        farmDetails: {
            farmSize: 25,
            crops: ['rice', 'wheat', 'maize'],
            farmingType: 'conventional',
            experience: 15
        },
        preferences: {
            workType: ['daily_wage', 'seasonal'],
            skills: ['harvesting', 'plowing', 'irrigation'],
            paymentMethod: 'weekly',
            accommodation: true
        },
        rating: 4.2,
        totalJobsPosted: 45,
        completedJobs: 42,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-09-09T14:00:00Z'
    }
];

export const sampleLaborers: LaborerProfile[] = [
    {
        id: 'laborer_001',
        userId: 'user_002',
        name: 'Suresh Patel',
        email: 'suresh.worker@email.com',
        phone: '+91-9876543211',
        location: {
            village: 'Bangalore Rural',
            district: 'Bangalore Rural',
            state: 'Karnataka',
            pincode: '560001'
        },
        personalDetails: {
            age: 32,
            gender: 'male',
            education: '10th Grade',
            languages: ['Hindi', 'Kannada', 'English']
        },
        workExperience: {
            totalYears: 8,
            skills: ['harvesting', 'plowing', 'irrigation', 'pest_control'],
            previousJobs: [
                {
                    id: 'exp_001',
                    farmerId: 'farmer_001',
                    farmerName: 'Rajesh Kumar',
                    jobTitle: 'Rice Harvesting',
                    duration: {
                        startDate: '2024-03-01',
                        endDate: '2024-03-15'
                    },
                    skillsUsed: ['harvesting', 'threshing'],
                    rating: 5,
                    review: 'Excellent worker, very skilled and hardworking'
                }
            ],
            certifications: ['Basic Farming Training']
        },
        availability: {
            workType: ['daily_wage', 'seasonal'],
            availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
            preferredLocations: ['Kolar', 'Bangalore Rural', 'Chikkaballapur'],
            travelWillingness: 'district'
        },
        preferences: {
            minWage: 300,
            maxDistance: 50,
            accommodation: true,
            food: true
        },
        rating: 4.5,
        totalJobsCompleted: 28,
        completedJobs: 26,
        profileVerified: true,
        createdAt: '2024-02-01T10:00:00Z',
        updatedAt: '2024-09-09T14:00:00Z'
    }
];

export const sampleJobPostings: JobPosting[] = [
    {
        id: 'job_001',
        farmerId: 'farmer_001',
        farmerName: 'Rajesh Kumar',
        title: 'Rice Harvesting Workers Needed',
        description: 'Urgent requirement for skilled rice harvesting workers. Need 5 experienced workers for 2 weeks. Good accommodation and food provided.',
        jobType: 'seasonal',
        workDetails: {
            skills: ['harvesting', 'threshing'],
            duration: '2 weeks',
            workingHours: '8 hours/day',
            workLocation: {
                village: 'Kolar',
                district: 'Kolar',
                state: 'Karnataka'
            }
        },
        requirements: {
            experience: 'experienced',
            gender: 'any',
            ageRange: { min: 20, max: 50 },
            languages: ['Kannada', 'Hindi']
        },
        compensation: {
            wageType: 'daily',
            amount: 350,
            paymentSchedule: 'Weekly',
            additionalBenefits: ['accommodation', 'food', 'transport']
        },
        status: 'active',
        applications: [],
        createdAt: '2024-09-01T10:00:00Z',
        updatedAt: '2024-09-01T10:00:00Z',
        expiresAt: '2024-09-15T10:00:00Z'
    }
];

// Helper functions
export const getFarmerById = (id: string): FarmerProfile | undefined => {
    return sampleFarmers.find(farmer => farmer.id === id);
};

export const getLaborerById = (id: string): LaborerProfile | undefined => {
    return sampleLaborers.find(laborer => laborer.id === id);
};

export const getJobById = (id: string): JobPosting | undefined => {
    return sampleJobPostings.find(job => job.id === id);
};

export const getJobsByFarmer = (farmerId: string): JobPosting[] => {
    return sampleJobPostings.filter(job => job.farmerId === farmerId);
};

export const getApplicationsByLaborer = (laborerId: string): JobApplication[] => {
    return sampleJobPostings.flatMap(job =>
        job.applications.filter(app => app.laborerId === laborerId)
    );
};

export const searchJobs = (query: string, filters?: {
    location?: string;
    skills?: string[];
    jobType?: string;
    wageRange?: { min: number; max: number };
}): JobPosting[] => {
    let results = sampleJobPostings.filter(job => job.status === 'active');

    if (query) {
        const lowercaseQuery = query.toLowerCase();
        results = results.filter(job =>
            job.title.toLowerCase().includes(lowercaseQuery) ||
            job.description.toLowerCase().includes(lowercaseQuery) ||
            job.workDetails.skills.some(skill => skill.toLowerCase().includes(lowercaseQuery))
        );
    }

    if (filters?.location) {
        results = results.filter(job =>
            job.workDetails.workLocation.district.toLowerCase().includes(filters.location!.toLowerCase())
        );
    }

    if (filters?.skills && filters.skills.length > 0) {
        results = results.filter(job =>
            filters.skills!.some(skill => job.workDetails.skills.includes(skill))
        );
    }

    if (filters?.jobType) {
        results = results.filter(job => job.jobType === filters.jobType);
    }

    if (filters?.wageRange) {
        results = results.filter(job =>
            job.compensation.amount >= filters.wageRange!.min &&
            job.compensation.amount <= filters.wageRange!.max
        );
    }

    return results;
};

export const searchLaborers = (query: string, filters?: {
    location?: string;
    skills?: string[];
    experience?: string;
    wageRange?: { min: number; max: number };
}): LaborerProfile[] => {
    let results = sampleLaborers.filter(laborer => laborer.profileVerified);

    if (query) {
        const lowercaseQuery = query.toLowerCase();
        results = results.filter(laborer =>
            laborer.name.toLowerCase().includes(lowercaseQuery) ||
            laborer.workExperience.skills.some(skill => skill.toLowerCase().includes(lowercaseQuery))
        );
    }

    if (filters?.location) {
        results = results.filter(laborer =>
            laborer.location.district.toLowerCase().includes(filters.location!.toLowerCase())
        );
    }

    if (filters?.skills && filters.skills.length > 0) {
        results = results.filter(laborer =>
            filters.skills!.some(skill => laborer.workExperience.skills.includes(skill))
        );
    }

    if (filters?.experience) {
        const minYears = filters.experience === 'beginner' ? 0 :
            filters.experience === 'intermediate' ? 2 : 5;
        results = results.filter(laborer => laborer.workExperience.totalYears >= minYears);
    }

    if (filters?.wageRange) {
        results = results.filter(laborer =>
            laborer.preferences.minWage >= filters.wageRange!.min &&
            laborer.preferences.minWage <= filters.wageRange!.max
        );
    }

    return results;
};

// Connection and Matching System
export interface MatchScore {
    laborerId: string;
    jobId: string;
    score: number; // 0-100
    reasons: string[];
    matchFactors: {
        skills: number; // 0-30
        location: number; // 0-25
        experience: number; // 0-20
        wageCompatibility: number; // 0-15
        availability: number; // 0-10
    };
}

export interface Connection {
    id: string;
    farmerId: string;
    laborerId: string;
    jobId: string;
    status: 'pending' | 'accepted' | 'rejected' | 'completed';
    initiatedBy: 'farmer' | 'laborer';
    createdAt: string;
    updatedAt: string;
    notes?: string;
}

// Matching Algorithm
export const calculateMatchScore = (laborer: LaborerProfile, job: JobPosting): MatchScore => {
    let totalScore = 0;
    const reasons: string[] = [];
    const matchFactors = {
        skills: 0,
        location: 0,
        experience: 0,
        wageCompatibility: 0,
        availability: 0
    };

    // Skills matching (30 points max)
    const jobSkills = job.workDetails.skills;
    const laborerSkills = laborer.workExperience.skills;
    const matchingSkills = jobSkills.filter(skill => laborerSkills.includes(skill));
    const skillMatchRatio = matchingSkills.length / jobSkills.length;

    if (skillMatchRatio >= 0.8) {
        matchFactors.skills = 30;
        reasons.push('Excellent skill match');
    } else if (skillMatchRatio >= 0.6) {
        matchFactors.skills = 25;
        reasons.push('Good skill match');
    } else if (skillMatchRatio >= 0.4) {
        matchFactors.skills = 20;
        reasons.push('Moderate skill match');
    } else if (skillMatchRatio >= 0.2) {
        matchFactors.skills = 10;
        reasons.push('Basic skill match');
    } else {
        matchFactors.skills = 5;
        reasons.push('Limited skill match');
    }

    // Location matching (25 points max)
    const jobDistrict = job.workDetails.workLocation.district.toLowerCase();
    const laborerDistrict = laborer.location.district.toLowerCase();
    const preferredLocations = laborer.availability.preferredLocations.map(loc => loc.toLowerCase());

    if (jobDistrict === laborerDistrict) {
        matchFactors.location = 25;
        reasons.push('Same district');
    } else if (preferredLocations.includes(jobDistrict)) {
        matchFactors.location = 20;
        reasons.push('Preferred location');
    } else if (laborer.availability.travelWillingness === 'district') {
        matchFactors.location = 15;
        reasons.push('Willing to travel within district');
    } else if (laborer.availability.travelWillingness === 'state') {
        matchFactors.location = 10;
        reasons.push('Willing to travel within state');
    } else {
        matchFactors.location = 5;
        reasons.push('Location may be challenging');
    }

    // Experience matching (20 points max)
    const jobExperience = job.requirements.experience;
    const laborerExperience = laborer.workExperience.totalYears;

    const requiredYears = jobExperience === 'beginner' ? 0 :
        jobExperience === 'intermediate' ? 2 :
            jobExperience === 'experienced' ? 5 : 8;

    if (laborerExperience >= requiredYears + 3) {
        matchFactors.experience = 20;
        reasons.push('Highly experienced');
    } else if (laborerExperience >= requiredYears) {
        matchFactors.experience = 15;
        reasons.push('Meets experience requirements');
    } else if (laborerExperience >= requiredYears - 2) {
        matchFactors.experience = 10;
        reasons.push('Close to experience requirements');
    } else {
        matchFactors.experience = 5;
        reasons.push('Less experienced than required');
    }

    // Wage compatibility (15 points max)
    const jobWage = job.compensation.amount;
    const laborerMinWage = laborer.preferences.minWage;

    if (jobWage >= laborerMinWage * 1.2) {
        matchFactors.wageCompatibility = 15;
        reasons.push('Excellent wage offer');
    } else if (jobWage >= laborerMinWage) {
        matchFactors.wageCompatibility = 12;
        reasons.push('Good wage compatibility');
    } else if (jobWage >= laborerMinWage * 0.8) {
        matchFactors.wageCompatibility = 8;
        reasons.push('Acceptable wage range');
    } else {
        matchFactors.wageCompatibility = 3;
        reasons.push('Wage below expectations');
    }

    // Availability matching (10 points max)
    const jobType = job.jobType;
    const laborerWorkTypes = laborer.availability.workType;

    if (laborerWorkTypes.includes(jobType)) {
        matchFactors.availability = 10;
        reasons.push('Available for job type');
    } else {
        matchFactors.availability = 2;
        reasons.push('May not be available for this job type');
    }

    totalScore = Object.values(matchFactors).reduce((sum, score) => sum + score, 0);

    return {
        laborerId: laborer.id,
        jobId: job.id,
        score: Math.min(totalScore, 100),
        reasons,
        matchFactors
    };
};

// Get top matches for a job
export const getTopMatchesForJob = (jobId: string, limit: number = 10): MatchScore[] => {
    const job = sampleJobPostings.find(j => j.id === jobId);
    if (!job) return [];

    const matches: MatchScore[] = sampleLaborers
        .filter(laborer => laborer.profileVerified)
        .map(laborer => calculateMatchScore(laborer, job))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    return matches;
};

// Get recommended jobs for a laborer
export const getRecommendedJobsForLaborer = (laborerId: string, limit: number = 10): { job: JobPosting; matchScore: MatchScore }[] => {
    const laborer = sampleLaborers.find(l => l.id === laborerId);
    if (!laborer) return [];

    const recommendations = sampleJobPostings
        .filter(job => job.status === 'active')
        .map(job => ({
            job,
            matchScore: calculateMatchScore(laborer, job)
        }))
        .sort((a, b) => b.matchScore.score - a.matchScore.score)
        .slice(0, limit);

    return recommendations;
};

// Connection management
export const sampleConnections: Connection[] = [
    {
        id: 'conn_001',
        farmerId: 'farmer_001',
        laborerId: 'laborer_001',
        jobId: 'job_001',
        status: 'pending',
        initiatedBy: 'laborer',
        createdAt: '2024-09-05T10:00:00Z',
        updatedAt: '2024-09-05T10:00:00Z',
        notes: 'Applied through job portal'
    }
];

export const createConnection = (
    farmerId: string,
    laborerId: string,
    jobId: string,
    initiatedBy: 'farmer' | 'laborer',
    notes?: string
): Connection => {
    const connection: Connection = {
        id: `conn_${Date.now()}`,
        farmerId,
        laborerId,
        jobId,
        status: 'pending',
        initiatedBy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes
    };

    sampleConnections.push(connection);
    return connection;
};

export const updateConnectionStatus = (
    connectionId: string,
    status: 'pending' | 'accepted' | 'rejected' | 'completed'
): Connection | null => {
    const connection = sampleConnections.find(c => c.id === connectionId);
    if (connection) {
        connection.status = status;
        connection.updatedAt = new Date().toISOString();
        return connection;
    }
    return null;
};

export const getConnectionsForUser = (userId: string): Connection[] => {
    return sampleConnections.filter(c =>
        c.farmerId === userId || c.laborerId === userId
    );
};

export const getConnectionsForJob = (jobId: string): Connection[] => {
    return sampleConnections.filter(c => c.jobId === jobId);
};

// Advanced matching with filters
export const findBestMatches = (
    job: JobPosting,
    filters?: {
        minScore?: number;
        maxDistance?: number;
        preferredSkills?: string[];
        experienceLevel?: string;
    }
): MatchScore[] => {
    const allMatches = sampleLaborers
        .filter(laborer => laborer.profileVerified)
        .map(laborer => calculateMatchScore(laborer, job));

    let filteredMatches = allMatches;

    if (filters?.minScore) {
        filteredMatches = filteredMatches.filter(match => match.score >= filters.minScore!);
    }

    if (filters?.preferredSkills && filters.preferredSkills.length > 0) {
        filteredMatches = filteredMatches.filter(match => {
            const laborer = sampleLaborers.find(l => l.id === match.laborerId);
            return laborer && filters.preferredSkills!.some(skill =>
                laborer.workExperience.skills.includes(skill)
            );
        });
    }

    if (filters?.experienceLevel) {
        const minYears = filters.experienceLevel === 'beginner' ? 0 :
            filters.experienceLevel === 'intermediate' ? 2 : 5;
        filteredMatches = filteredMatches.filter(match => {
            const laborer = sampleLaborers.find(l => l.id === match.laborerId);
            return laborer && laborer.workExperience.totalYears >= minYears;
        });
    }

    return filteredMatches.sort((a, b) => b.score - a.score);
};