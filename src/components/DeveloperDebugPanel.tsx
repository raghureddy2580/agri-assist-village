import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getAllJobPostings,
  exportJobPostings,
  clearAllJobPostings,
  getJobStatistics,
  logAllJobPostings,
  type JobPosting,
} from '@/lib/jobStorage';
import { Download, Trash2, RefreshCw, Terminal, X, ChevronDown, ChevronUp } from 'lucide-react';

const DeveloperDebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [stats, setStats] = useState<ReturnType<typeof getJobStatistics> | null>(null);

  const refreshData = () => {
    setJobs(getAllJobPostings());
    setStats(getJobStatistics());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all job postings? This cannot be undone.')) {
      clearAllJobPostings();
      refreshData();
    }
  };

  const handleExport = () => {
    exportJobPostings();
  };

  const handleLogToConsole = () => {
    logAllJobPostings();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg z-50 flex items-center gap-2"
        title="Open Developer Debug Panel"
      >
        <Terminal className="h-5 w-5" />
        <span className="text-xs font-medium">Dev Panel</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 w-full md:w-[600px] h-[80vh] bg-background border-l border-t shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          <h2 className="font-bold">Developer Debug Panel</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-purple-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="p-4 border-b bg-muted/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div>
              <div className="font-semibold">Total Jobs</div>
              <div className="text-2xl font-bold text-purple-600">{stats.total}</div>
            </div>
            <div>
              <div className="font-semibold">Active</div>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            </div>
            <div>
              <div className="font-semibold">Filled</div>
              <div className="text-2xl font-bold text-blue-600">{stats.filled}</div>
            </div>
            <div>
              <div className="font-semibold">Closed</div>
              <div className="text-2xl font-bold text-gray-600">{stats.closed}</div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-4 border-b flex flex-wrap gap-2">
        <Button onClick={refreshData} size="sm" variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button onClick={handleLogToConsole} size="sm" variant="outline">
          <Terminal className="h-4 w-4 mr-2" />
          Log to Console
        </Button>
        <Button onClick={handleExport} size="sm" variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export JSON
        </Button>
        <Button onClick={handleClearAll} size="sm" variant="destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      {/* Job List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {jobs.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No job postings yet. Post a job to see data here.
          </div>
        ) : (
          jobs.map((job) => (
            <Card key={job.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{job.title}</CardTitle>
                    <div className="text-xs text-muted-foreground mt-1">
                      ID: {job.id}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                  >
                    {expandedJob === job.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                    {job.status}
                  </Badge>
                  <Badge variant="outline">{job.jobType}</Badge>
                  <Badge variant="outline">₹{job.amount}/{job.wageType}</Badge>
                </div>

                <div className="text-sm space-y-1">
                  <div><strong>Posted by:</strong> {job.userName} ({job.userEmail})</div>
                  <div><strong>Location:</strong> {job.village}, {job.district}, {job.state}</div>
                  <div><strong>Posted:</strong> {new Date(job.createdAt).toLocaleString()}</div>
                </div>

                {expandedJob === job.id && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-sm space-y-2">
                      <div><strong>Description:</strong> {job.description}</div>
                      <div><strong>Duration:</strong> {job.duration}</div>
                      {job.workingHours && <div><strong>Working Hours:</strong> {job.workingHours}</div>}
                      <div><strong>Skills:</strong> {job.skills.join(', ')}</div>
                      {job.languages.length > 0 && (
                        <div><strong>Languages:</strong> {job.languages.join(', ')}</div>
                      )}
                      {job.experience && <div><strong>Experience:</strong> {job.experience}</div>}
                      {job.gender && <div><strong>Gender:</strong> {job.gender}</div>}
                      {(job.minAge || job.maxAge) && (
                        <div><strong>Age Range:</strong> {job.minAge || 'Any'} - {job.maxAge || 'Any'}</div>
                      )}
                      {job.paymentSchedule && (
                        <div><strong>Payment Schedule:</strong> {job.paymentSchedule}</div>
                      )}
                      {job.benefits.length > 0 && (
                        <div><strong>Benefits:</strong> {job.benefits.join(', ')}</div>
                      )}
                    </div>
                    <div className="mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          console.log('Full Job Data:', job);
                          alert('Job data logged to console');
                        }}
                      >
                        Log Full Data to Console
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default DeveloperDebugPanel;