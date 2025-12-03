export interface JobPosting {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  title: string;
  description: string;
  jobType: string;
  skills: string[];
  duration: string;
  workingHours: string;
  village: string;
  district: string;
  state: string;
  experience: string;
  gender: string;
  minAge: string;
  maxAge: string;
  languages: string[];
  wageType: string;
  amount: string;
  paymentSchedule: string;
  benefits: string[];
  createdAt: string;
  status: 'active' | 'closed' | 'filled';
}

const STORAGE_KEY = 'agri_assist_job_postings';

/**
 * Save a new job posting to localStorage
 */
export const saveJobPosting = (jobData: Omit<JobPosting, 'id' | 'createdAt' | 'status'>) => {
  const jobPosting: JobPosting = {
    ...jobData,
    id: generateJobId(),
    createdAt: new Date().toISOString(),
    status: 'active',
  };

  const existingJobs = getAllJobPostings();
  const updatedJobs = [...existingJobs, jobPosting];
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedJobs));
  
  // Log to console for developer visibility
  console.group('🚀 New Job Posted');
  console.log('Job ID:', jobPosting.id);
  console.log('Posted by:', jobPosting.userName, `(${jobPosting.userEmail})`);
  console.log('Job Title:', jobPosting.title);
  console.log('Location:', `${jobPosting.village}, ${jobPosting.district}, ${jobPosting.state}`);
  console.log('Wage:', `₹${jobPosting.amount} (${jobPosting.wageType})`);
  console.log('Full Job Data:', jobPosting);
  console.groupEnd();
  
  return jobPosting;
};

/**
 * Get all job postings from localStorage
 */
export const getAllJobPostings = (): JobPosting[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading job postings:', error);
    return [];
  }
};

/**
 * Get job postings by user ID
 */
export const getJobPostingsByUser = (userId: string): JobPosting[] => {
  return getAllJobPostings().filter(job => job.userId === userId);
};

/**
 * Get a single job posting by ID
 */
export const getJobPostingById = (id: string): JobPosting | null => {
  const jobs = getAllJobPostings();
  return jobs.find(job => job.id === id) || null;
};

/**
 * Update job posting status
 */
export const updateJobStatus = (id: string, status: JobPosting['status']) => {
  const jobs = getAllJobPostings();
  const updatedJobs = jobs.map(job => 
    job.id === id ? { ...job, status } : job
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedJobs));
};

/**
 * Delete a job posting
 */
export const deleteJobPosting = (id: string) => {
  const jobs = getAllJobPostings();
  const updatedJobs = jobs.filter(job => job.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedJobs));
};

/**
 * Export all job postings as JSON
 */
export const exportJobPostings = () => {
  const jobs = getAllJobPostings();
  const dataStr = JSON.stringify(jobs, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `job-postings-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Clear all job postings (for development/testing)
 */
export const clearAllJobPostings = () => {
  localStorage.removeItem(STORAGE_KEY);
  console.log('✅ All job postings cleared');
};

/**
 * Log all job postings to console (for developer debugging)
 */
export const logAllJobPostings = () => {
  const jobs = getAllJobPostings();
  console.group('📋 All Job Postings');
  console.log(`Total Jobs: ${jobs.length}`);
  console.table(jobs.map(job => ({
    ID: job.id,
    Title: job.title,
    'Posted By': job.userName,
    Location: `${job.village}, ${job.district}`,
    Wage: `₹${job.amount}/${job.wageType}`,
    Status: job.status,
    'Created At': new Date(job.createdAt).toLocaleString(),
  })));
  console.log('Full Data:', jobs);
  console.groupEnd();
};

/**
 * Generate a unique job ID
 */
const generateJobId = (): string => {
  return `JOB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get statistics about job postings
 */
export const getJobStatistics = () => {
  const jobs = getAllJobPostings();
  return {
    total: jobs.length,
    active: jobs.filter(j => j.status === 'active').length,
    closed: jobs.filter(j => j.status === 'closed').length,
    filled: jobs.filter(j => j.status === 'filled').length,
    byJobType: {
      daily_wage: jobs.filter(j => j.jobType === 'daily_wage').length,
      contract: jobs.filter(j => j.jobType === 'contract').length,
      seasonal: jobs.filter(j => j.jobType === 'seasonal').length,
    },
    totalWageOffered: jobs.reduce((sum, job) => sum + parseFloat(job.amount || '0'), 0),
  };
};

// Make functions available globally for developer console access
if (typeof window !== 'undefined') {
  (window as any).jobPostingDebug = {
    getAll: getAllJobPostings,
    getById: getJobPostingById,
    getByUser: getJobPostingsByUser,
    logAll: logAllJobPostings,
    export: exportJobPostings,
    clear: clearAllJobPostings,
    stats: getJobStatistics,
  };
  
  console.log('💡 Job Posting Debug Tools Available:');
  console.log('  window.jobPostingDebug.getAll() - Get all job postings');
  console.log('  window.jobPostingDebug.logAll() - Log all jobs to console');
  console.log('  window.jobPostingDebug.export() - Download jobs as JSON');
  console.log('  window.jobPostingDebug.stats() - Get statistics');
  console.log('  window.jobPostingDebug.clear() - Clear all jobs');
}