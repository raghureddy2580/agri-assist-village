import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { sampleJobPostings, sampleLaborers, JobPosting, LaborerProfile } from '@/lib/laborDatabase';
import {
    MapPin,
    Clock,
    DollarSign,
    Users,
    Briefcase,
    Search,
    Filter,
    Calendar,
    Star,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

const LaborMarketplace: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [jobs, setJobs] = useState<JobPosting[]>(sampleJobPostings);
    const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>(sampleJobPostings);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        location: '',
        jobType: '',
        skills: '',
        wageRange: { min: '', max: '' },
        experience: ''
    });
    const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

    // Application form state
    const [applicationData, setApplicationData] = useState({
        coverLetter: '',
        expectedWage: ''
    });

    useEffect(() => {
        applyFilters();
    }, [jobs, searchQuery, filters]);

    const applyFilters = () => {
        let filtered = jobs.filter(job => job.status === 'active');

        // Search query filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(job =>
                job.title.toLowerCase().includes(query) ||
                job.description.toLowerCase().includes(query) ||
                job.workDetails.skills.some(skill => skill.toLowerCase().includes(query))
            );
        }

        // Location filter
        if (filters.location) {
            filtered = filtered.filter(job =>
                job.workDetails.workLocation.district.toLowerCase().includes(filters.location.toLowerCase()) ||
                job.workDetails.workLocation.village.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        // Job type filter
        if (filters.jobType) {
            filtered = filtered.filter(job => job.jobType === filters.jobType);
        }

        // Skills filter
        if (filters.skills) {
            filtered = filtered.filter(job =>
                job.workDetails.skills.some(skill =>
                    skill.toLowerCase().includes(filters.skills.toLowerCase())
                )
            );
        }

        // Wage range filter
        if (filters.wageRange.min) {
            filtered = filtered.filter(job =>
                job.compensation.amount >= parseFloat(filters.wageRange.min)
            );
        }
        if (filters.wageRange.max) {
            filtered = filtered.filter(job =>
                job.compensation.amount <= parseFloat(filters.wageRange.max)
            );
        }

        // Experience filter
        if (filters.experience) {
            filtered = filtered.filter(job =>
                job.requirements.experience === filters.experience
            );
        }

        setFilteredJobs(filtered);
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleWageRangeChange = (type: 'min' | 'max', value: string) => {
        setFilters(prev => ({
            ...prev,
            wageRange: { ...prev.wageRange, [type]: value }
        }));
    };

    const clearFilters = () => {
        setFilters({
            location: '',
            jobType: '',
            skills: '',
            wageRange: { min: '', max: '' },
            experience: ''
        });
        setSearchQuery('');
    };

    const handleApply = (job: JobPosting) => {
        if (!user) {
            navigate('/login');
            return;
        }

        setSelectedJob(job);
        setApplicationData({
            coverLetter: '',
            expectedWage: job.compensation.amount.toString()
        });
    };

    const submitApplication = () => {
        if (!selectedJob || !user) return;

        // Here you would typically send the application to your backend
        console.log('Application submitted:', {
            jobId: selectedJob.id,
            laborerId: user.id,
            ...applicationData
        });

        // Add to applied jobs
        setAppliedJobs(prev => [...prev, selectedJob.id]);

        // Close dialog and show success
        setSelectedJob(null);
        alert('Application submitted successfully!');
    };

    const isApplied = (jobId: string) => appliedJobs.includes(jobId);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getDaysLeft = (expiresAt: string) => {
        const today = new Date();
        const expiry = new Date(expiresAt);
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? `${diffDays} days left` : 'Expired';
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="max-w-6xl mx-auto p-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Please Login</h1>
                        <p className="text-muted-foreground">You need to be logged in to access the labor marketplace.</p>
                        <Button onClick={() => navigate('/login')} className="mt-4">
                            Login
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="max-w-6xl mx-auto p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Labor Marketplace</h1>
                    <p className="text-muted-foreground">Find farming jobs that match your skills</p>
                </div>

                {/* Search and Filters */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search Bar */}
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search jobs by title, skills, or location..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Filter Toggle */}
                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center space-x-2"
                            >
                                <Filter className="h-4 w-4" />
                                <span>Filters</span>
                            </Button>
                        </div>

                        {/* Filters Panel */}
                        {showFilters && (
                            <div className="mt-6 pt-6 border-t">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <Label htmlFor="location-filter">Location</Label>
                                        <Input
                                            id="location-filter"
                                            placeholder="District or village"
                                            value={filters.location}
                                            onChange={(e) => handleFilterChange('location', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="job-type-filter">Job Type</Label>
                                        <Select value={filters.jobType} onValueChange={(value) => handleFilterChange('jobType', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All types" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="daily_wage">Daily Wage</SelectItem>
                                                <SelectItem value="contract">Contract</SelectItem>
                                                <SelectItem value="seasonal">Seasonal</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="skills-filter">Skills</Label>
                                        <Input
                                            id="skills-filter"
                                            placeholder="e.g., harvesting, plowing"
                                            value={filters.skills}
                                            onChange={(e) => handleFilterChange('skills', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="experience-filter">Experience Required</Label>
                                        <Select value={filters.experience} onValueChange={(value) => handleFilterChange('experience', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Any experience" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="beginner">Beginner</SelectItem>
                                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                                <SelectItem value="experienced">Experienced</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <Label htmlFor="min-wage">Min Wage (₹)</Label>
                                        <Input
                                            id="min-wage"
                                            type="number"
                                            placeholder="0"
                                            value={filters.wageRange.min}
                                            onChange={(e) => handleWageRangeChange('min', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="max-wage">Max Wage (₹)</Label>
                                        <Input
                                            id="max-wage"
                                            type="number"
                                            placeholder="1000"
                                            value={filters.wageRange.max}
                                            onChange={(e) => handleWageRangeChange('max', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end mt-4">
                                    <Button variant="outline" onClick={clearFilters}>
                                        Clear Filters
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Results Summary */}
                <div className="mb-6">
                    <p className="text-muted-foreground">
                        Showing {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
                        {searchQuery && ` for "${searchQuery}"`}
                    </p>
                </div>

                {/* Job Listings */}
                <div className="space-y-6">
                    {filteredJobs.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-12">
                                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                                <p className="text-muted-foreground mb-4">
                                    Try adjusting your search criteria or filters
                                </p>
                                <Button onClick={clearFilters}>Clear Filters</Button>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredJobs.map((job) => (
                            <Card key={job.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="text-xl font-semibold text-foreground">
                                                    {job.title}
                                                </h3>
                                                <Badge variant={job.jobType === 'seasonal' ? 'default' : 'secondary'}>
                                                    {job.jobType.replace('_', ' ')}
                                                </Badge>
                                            </div>

                                            <p className="text-muted-foreground mb-4">{job.description}</p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                                <div className="flex items-center space-x-2">
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">
                                                        {job.workDetails.workLocation.village}, {job.workDetails.workLocation.district}
                                                    </span>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">{job.workDetails.duration}</span>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm font-medium">
                                                        ₹{job.compensation.amount} {job.compensation.wageType}
                                                    </span>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm text-orange-600">
                                                        {getDaysLeft(job.expiresAt)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {job.workDetails.skills.slice(0, 4).map((skill) => (
                                                    <Badge key={skill} variant="outline" className="text-xs capitalize">
                                                        {skill.replace('_', ' ')}
                                                    </Badge>
                                                ))}
                                                {job.workDetails.skills.length > 4 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{job.workDetails.skills.length - 4} more
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                <span>Posted by {job.farmerName}</span>
                                                <span>•</span>
                                                <span>{formatDate(job.createdAt)}</span>
                                                <span>•</span>
                                                <span>{job.applications.length} applicants</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col space-y-2 lg:min-w-[200px]">
                                            {job.compensation.additionalBenefits.length > 0 && (
                                                <div className="text-sm text-green-600 mb-2">
                                                    ✓ {job.compensation.additionalBenefits.join(', ')}
                                                </div>
                                            )}

                                            <Button
                                                onClick={() => handleApply(job)}
                                                disabled={isApplied(job.id)}
                                                className="w-full"
                                                variant={isApplied(job.id) ? "secondary" : "default"}
                                            >
                                                {isApplied(job.id) ? (
                                                    <>
                                                        <CheckCircle className="h-4 w-4 mr-2" />
                                                        Applied
                                                    </>
                                                ) : (
                                                    'Apply Now'
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Application Dialog */}
                <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Apply for Job</DialogTitle>
                        </DialogHeader>

                        {selectedJob && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">{selectedJob.title}</h3>
                                    <p className="text-muted-foreground mb-4">{selectedJob.description}</p>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium">Location:</span>
                                            <p>{selectedJob.workDetails.workLocation.village}, {selectedJob.workDetails.workLocation.district}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Duration:</span>
                                            <p>{selectedJob.workDetails.duration}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Wage:</span>
                                            <p>₹{selectedJob.compensation.amount} {selectedJob.compensation.wageType}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Posted by:</span>
                                            <p>{selectedJob.farmerName}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="expected-wage">Expected Wage (₹)</Label>
                                        <Input
                                            id="expected-wage"
                                            type="number"
                                            value={applicationData.expectedWage}
                                            onChange={(e) => setApplicationData(prev => ({ ...prev, expectedWage: e.target.value }))}
                                            placeholder="Your expected daily wage"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="cover-letter">Cover Letter (Optional)</Label>
                                        <Textarea
                                            id="cover-letter"
                                            value={applicationData.coverLetter}
                                            onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
                                            placeholder="Tell the farmer why you're a good fit for this job..."
                                            rows={4}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <Button variant="outline" onClick={() => setSelectedJob(null)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={submitApplication} className="bg-green-600 hover:bg-green-700">
                                        Submit Application
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default LaborMarketplace;