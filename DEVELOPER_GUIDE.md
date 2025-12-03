# Developer Guide - Job Posting Data Access

## Overview
All job postings submitted through the "Post a Job" section are automatically stored in the browser's localStorage and are accessible to developers through multiple methods.

## Accessing Job Data

### 1. Developer Debug Panel (Visual Interface)
The easiest way to view and manage job postings:

- Look for the **purple "Dev Panel" button** in the bottom-right corner of the application
- Click it to open the Developer Debug Panel
- Features:
  - View all job postings with detailed information
  - See statistics (total jobs, active, filled, closed)
  - Expand individual jobs to see full details
  - Export all data as JSON file
  - Clear all job postings
  - Refresh data in real-time
  - Log data to browser console

### 2. Browser Console (Programmatic Access)
Open your browser's developer console (F12) and use these commands:

```javascript
// Get all job postings
window.jobPostingDebug.getAll()

// Log all jobs in a formatted table
window.jobPostingDebug.logAll()

// Get statistics
window.jobPostingDebug.stats()

// Export jobs as JSON file
window.jobPostingDebug.export()

// Get a specific job by ID
window.jobPostingDebug.getById('JOB-1234567890-abc123')

// Get all jobs posted by a specific user
window.jobPostingDebug.getByUser('user-id-here')

// Clear all job postings (use with caution!)
window.jobPostingDebug.clear()
```

### 3. Browser DevTools - Application Tab
1. Open DevTools (F12)
2. Go to **Application** tab
3. Navigate to **Storage → Local Storage → your-domain**
4. Look for the key: `agri_assist_job_postings`
5. Click to view the raw JSON data

## Job Data Structure

Each job posting contains the following fields:

```typescript
{
  id: string;                    // Unique job ID (e.g., "JOB-1234567890-abc123")
  userId: string;                // ID of the user who posted the job
  userName: string;              // Name of the poster
  userEmail: string;             // Email of the poster
  title: string;                 // Job title
  description: string;           // Job description
  jobType: string;              // "daily_wage" | "contract" | "seasonal"
  skills: string[];             // Required skills
  duration: string;             // Job duration
  workingHours: string;         // Working hours
  village: string;              // Village location
  district: string;             // District location
  state: string;                // State location
  experience: string;           // Experience level required
  gender: string;               // Gender preference
  minAge: string;               // Minimum age
  maxAge: string;               // Maximum age
  languages: string[];          // Required languages
  wageType: string;             // "daily" | "weekly" | "monthly"
  amount: string;               // Wage amount
  paymentSchedule: string;      // Payment schedule
  benefits: string[];           // Additional benefits
  createdAt: string;            // ISO timestamp of creation
  status: string;               // "active" | "closed" | "filled"
}
```

## Automatic Logging

When a job is posted, the system automatically logs detailed information to the console:

```
🚀 New Job Posted
  Job ID: JOB-1234567890-abc123
  Posted by: John Doe (john@example.com)
  Job Title: Rice Harvesting Workers Needed
  Location: Village Name, District, State
  Wage: ₹350 (daily)
  Full Job Data: {...}
```

## Exporting Data

### Method 1: Using Debug Panel
1. Open the Developer Debug Panel
2. Click the "Export JSON" button
3. A file named `job-postings-YYYY-MM-DD.json` will be downloaded

### Method 2: Using Console
```javascript
window.jobPostingDebug.export()
```

### Method 3: Manual Copy
1. Open DevTools → Application → Local Storage
2. Copy the value of `agri_assist_job_postings`
3. Paste into a text editor and save as `.json`

## Statistics

Get comprehensive statistics about job postings:

```javascript
const stats = window.jobPostingDebug.stats()
console.log(stats)
// Output:
// {
//   total: 10,
//   active: 7,
//   closed: 2,
//   filled: 1,
//   byJobType: {
//     daily_wage: 5,
//     contract: 3,
//     seasonal: 2
//   },
//   totalWageOffered: 3500
// }
```

## Testing & Development

### Clear All Data
```javascript
window.jobPostingDebug.clear()
```

### Sample Data Creation
To test with sample data, you can manually add jobs through the UI or use the console:

```javascript
// This function is available in jobStorage.ts
import { saveJobPosting } from '@/lib/jobStorage';

saveJobPosting({
  userId: 'test-user-1',
  userName: 'Test Farmer',
  userEmail: 'test@example.com',
  title: 'Test Job',
  description: 'This is a test job posting',
  jobType: 'daily_wage',
  skills: ['harvesting', 'plowing'],
  duration: '2 weeks',
  workingHours: '8 hours/day',
  village: 'Test Village',
  district: 'Test District',
  state: 'Test State',
  experience: 'intermediate',
  gender: 'any',
  minAge: '18',
  maxAge: '60',
  languages: ['Hindi', 'English'],
  wageType: 'daily',
  amount: '350',
  paymentSchedule: 'daily',
  benefits: ['food', 'transport']
});
```

## Data Persistence

- Data is stored in browser's localStorage
- Data persists across browser sessions
- Data is specific to the domain/origin
- Clearing browser data will remove job postings
- Data is not synced across devices (local only)

## Security Notes

- All data is stored client-side only
- No backend integration in current implementation
- Data is visible to anyone with access to the browser
- Consider implementing backend storage for production use

## Troubleshooting

### Data Not Showing
1. Check if localStorage is enabled in browser
2. Verify you're on the correct domain
3. Check browser console for errors
4. Try refreshing the debug panel

### Debug Panel Not Visible
1. Scroll to bottom-right of the page
2. Look for purple "Dev Panel" button
3. Check if it's behind other elements
4. Try refreshing the page

### Console Commands Not Working
1. Ensure you're on a page where the app is loaded
2. Check console for initialization message
3. Verify `window.jobPostingDebug` exists by typing it in console

## Future Enhancements

Consider implementing:
- Backend API integration
- Database storage
- User authentication for data access
- Data analytics dashboard
- Export to CSV/Excel
- Email notifications for new jobs
- Search and filter capabilities
- Data backup and restore

---

**Last Updated:** 2025
**Maintained By:** Development Team