import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import {
    sampleJobPostings,
    sampleLaborers,
    getTopMatchesForJob,
    getRecommendedJobsForLaborer,
    MatchScore,
    JobPosting,
    LaborerProfile,
    createConnection
} from '@/lib/laborDatabase';
import {
    Users,
    MapPin,
    Star,
    Briefcase,
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp,
    UserCheck,
    MessageSquare
} from 'lucide-react';

const JobMatches: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [userJobs, setUserJobs] = useState<JobPosting[]>([]);
    const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
    const [matches, setMatches] = useState<MatchScore[]>([]);
    const [recommendedJobs, setRecommendedJobs] = useState<{ job: JobPosting; matchScore: MatchScore }[]>([]);
    const [viewMode, setViewMode] = useState<'farmer' | 'laborer'>('farmer');
    const [selectedLaborer, setSelectedLaborer] = useState<LaborerProfile | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<Record<string, string>>({});

    useEffect(() => {
        if (user) {
            // Check if user is a farmer (has posted jobs) or laborer
            const farmerJobs = sampleJobPostings.filter(job => job.farmerId === user.id);
            if (farmerJobs.length > 0) {
                setViewMode('farmer');
                setUserJobs(farmerJobs);
                if (farmerJobs.length > 0) {
                    setSelectedJob(farmerJobs[0]);
                    loadMatches(farmerJobs[0].id);
                }
            } else {
                setViewMode('laborer');
                loadRecommendedJobs();
            }
        }
    }, [user]);

    const loadMatches = (jobId: string) => {
        const jobMatches = getTopMatchesForJob(jobId, 20);
        setMatches(jobMatches);
    };

    const loadRecommendedJobs = () => {
        if (user) {
            const recommendations = getRecommendedJobsForLaborer(user.id, 20);
            setRecommendedJobs(recommendations);
        }
    };

    const handleJobSelect = (job: JobPosting) => {
        setSelectedJob(job);
        loadMatches(job.id);
    };

    const getMatchScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 bg-green-100';
        if (score >= 60) return 'text-blue-600 bg-blue-100';
        if (score >= 40) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    const getMatchScoreLabel = (score: number) => {
        if (score >= 80) return 'Excellent Match';
        if (score >= 60) return 'Good Match';
        if (score >= 40) return 'Fair Match';
        return 'Poor Match';
    };

    const handleConnect = (laborerId: string, jobId: string) => {
        if (!user) return;

        // Create connection
        const connection = createConnection(user.id, laborerId, jobId, 'farmer', 'Recommended by matching system');

        // Update connection status
        setConnectionStatus(prev => ({
            ...prev,
            [`${laborerId}-${jobId}`]: 'pending'
        }));

        alert('Connection request sent successfully!');
    };

    const handleApply = (jobId: string) => {
        navigate(`/labor-marketplace`);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="max-w-6xl mx-auto p-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Please Login</h1>
                        <p className="text-muted-foreground">You need to be logged in to view matches.</p>
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
                    <h1 className="text-3xl font-bold mb-2">Job Matches</h1>
                    <p className="text-muted-foreground">
                        {viewMode === 'farmer'
                            ? 'Find the best laborers for your job postings'
                            : 'Discover jobs that match your skills and preferences'
                        }
                    </p>
                </div>

                {viewMode === 'farmer' ? (
                    // Farmer View
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Job Selection Sidebar */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Your Job Postings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {userJobs.map((job) => (
                                            <Button
                                                key={job.id}
                                                variant={selectedJob?.id === job.id ? "default" : "outline"}
                                                className="w-full justify-start text-left"
                                                onClick={() => handleJobSelect(job)}
                                            >
                                                <div className="truncate">
                                                    <div className="font-medium text-sm">{job.title}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {job.applications.length} applicants
                                                    </div>
                                                </div>
                                            </Button>
                                        ))}
                                    </div>
                                    {userJobs.length === 0 && (
                                        <div className="text-center py-4">
                                            <p className="text-sm text-muted-foreground mb-4">No job postings yet</p>
                                            <Button onClick={() => navigate('/post-job')} size="sm">
                                                Post Your First Job
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Matches Display */}
                        <div className="lg:col-span-3">
                            {selectedJob ? (
                                <div className="space-y-6">
                                    {/* Selected Job Info */}
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h2 className="text-xl font-semibold">{selectedJob.title}</h2>
                                                <Badge variant="secondary">{selectedJob.jobType.replace('_', ' ')}</Badge>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                    <span>{selectedJob.workDetails.workLocation.village}, {selectedJob.workDetails.workLocation.district}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                                    <span>₹{selectedJob.compensation.amount} {selectedJob.compensation.wageType}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Users className="h-4 w-4 text-muted-foreground" />
                                                    <span>{matches.length} potential matches</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Matches List */}
                                    <div className="space-y-4">
                                        {matches.length === 0 ? (
                                            <Card>
                                                <CardContent className="text-center py-12">
                                                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                                    <h3 className="text-lg font-medium mb-2">No matches found</h3>
                                                    <p className="text-muted-foreground">
                                                        Try adjusting your job requirements or check back later.
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        ) : (
                                            matches.map((match) => {
                                                const laborer = sampleLaborers.find(l => l.id === match.laborerId);
                                                if (!laborer) return null;

                                                const connectionKey = `${laborer.id}-${selectedJob.id}`;
                                                const status = connectionStatus[connectionKey] || 'none';

                                                return (
                                                    <Card key={match.laborerId} className="hover:shadow-md transition-shadow">
                                                        <CardContent className="p-6">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex items-start space-x-4 flex-1">
                                                                    {/* Laborer Avatar */}
                                                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                                        <span className="text-blue-600 font-semibold">
                                                                            {laborer.name.charAt(0)}
                                                                        </span>
                                                                    </div>

                                                                    {/* Laborer Info */}
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center space-x-3 mb-2">
                                                                            <h3 className="text-lg font-semibold">{laborer.name}</h3>
                                                                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(match.score)}`}>
                                                                                {match.score}% - {getMatchScoreLabel(match.score)}
                                                                            </div>
                                                                        </div>

                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                                                                            <div className="flex items-center space-x-2">
                                                                                <MapPin className="h-3 w-3" />
                                                                                <span>{laborer.location.village}, {laborer.location.district}</span>
                                                                            </div>
                                                                            <div className="flex items-center space-x-2">
                                                                                <Briefcase className="h-3 w-3" />
                                                                                <span>{laborer.workExperience.totalYears} years experience</span>
                                                                            </div>
                                                                        </div>

                                                                        {/* Skills */}
                                                                        <div className="flex flex-wrap gap-1 mb-3">
                                                                            {laborer.workExperience.skills.slice(0, 3).map((skill) => (
                                                                                <Badge key={skill} variant="outline" className="text-xs">
                                                                                    {skill.replace('_', ' ')}
                                                                                </Badge>
                                                                            ))}
                                                                            {laborer.workExperience.skills.length > 3 && (
                                                                                <Badge variant="outline" className="text-xs">
                                                                                    +{laborer.workExperience.skills.length - 3} more
                                                                                </Badge>
                                                                            )}
                                                                        </div>

                                                                        {/* Match Reasons */}
                                                                        <div className="text-sm">
                                                                            <span className="font-medium text-green-600">Why this match: </span>
                                                                            <span className="text-muted-foreground">
                                                                                {match.reasons.slice(0, 2).join(', ')}
                                                                                {match.reasons.length > 2 && '...'}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Actions */}
                                                                <div className="flex flex-col space-y-2">
                                                                    <Dialog>
                                                                        <DialogTrigger asChild>
                                                                            <Button variant="outline" size="sm">
                                                                                View Profile
                                                                            </Button>
                                                                        </DialogTrigger>
                                                                        <DialogContent className="max-w-2xl">
                                                                            <DialogHeader>
                                                                                <DialogTitle>{laborer.name}'s Profile</DialogTitle>
                                                                            </DialogHeader>
                                                                            <div className="space-y-4">
                                                                                <div className="grid grid-cols-2 gap-4">
                                                                                    <div>
                                                                                        <h4 className="font-medium mb-2">Contact</h4>
                                                                                        <p className="text-sm text-muted-foreground">{laborer.phone}</p>
                                                                                        <p className="text-sm text-muted-foreground">{laborer.email}</p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <h4 className="font-medium mb-2">Rating</h4>
                                                                                        <div className="flex items-center space-x-1">
                                                                                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                                                            <span className="text-sm">{laborer.rating} ({laborer.completedJobs} jobs)</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div>
                                                                                    <h4 className="font-medium mb-2">Skills</h4>
                                                                                    <div className="flex flex-wrap gap-1">
                                                                                        {laborer.workExperience.skills.map((skill) => (
                                                                                            <Badge key={skill} variant="outline" className="text-xs">
                                                                                                {skill.replace('_', ' ')}
                                                                                            </Badge>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                                <div>
                                                                                    <h4 className="font-medium mb-2">Experience</h4>
                                                                                    <p className="text-sm text-muted-foreground">
                                                                                        {laborer.workExperience.totalYears} years in farming
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </DialogContent>
                                                                    </Dialog>

                                                                    {status === 'pending' ? (
                                                                        <Button variant="secondary" size="sm" disabled>
                                                                            <Clock className="h-4 w-4 mr-2" />
                                                                            Pending
                                                                        </Button>
                                                                    ) : (
                                                                        <Button
                                                                            onClick={() => handleConnect(laborer.id, selectedJob.id)}
                                                                            size="sm"
                                                                            className="bg-green-600 hover:bg-green-700"
                                                                        >
                                                                            <UserCheck className="h-4 w-4 mr-2" />
                                                                            Connect
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <Card>
                                    <CardContent className="text-center py-12">
                                        <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-medium mb-2">Select a job to view matches</h3>
                                        <p className="text-muted-foreground">
                                            Choose a job posting from the sidebar to see recommended laborers.
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                ) : (
                    // Laborer View - Recommended Jobs
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Recommended Jobs for You</h2>
                            <Button onClick={() => navigate('/labor-marketplace')}>
                                View All Jobs
                            </Button>
                        </div>

                        {recommendedJobs.length === 0 ? (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-medium mb-2">No recommendations yet</h3>
                                    <p className="text-muted-foreground">
                                        Complete your profile to get better job recommendations.
                                    </p>
                                    <Button onClick={() => navigate('/laborer-profile')} className="mt-4">
                                        Update Profile
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {recommendedJobs.slice(0, 6).map(({ job, matchScore }) => (
                                    <Card key={job.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
                                                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${getMatchScoreColor(matchScore.score)}`}>
                                                        {matchScore.score}% Match
                                                    </div>
                                                </div>
                                                <Badge variant="secondary">{job.jobType.replace('_', ' ')}</Badge>
                                            </div>

                                            <div className="space-y-2 text-sm text-muted-foreground mb-4">
                                                <div className="flex items-center space-x-2">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{job.workDetails.workLocation.village}, {job.workDetails.workLocation.district}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Briefcase className="h-4 w-4" />
                                                    <span>₹{job.compensation.amount} {job.compensation.wageType}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Users className="h-4 w-4" />
                                                    <span>Posted by {job.farmerName}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {job.workDetails.skills.slice(0, 3).map((skill) => (
                                                    <Badge key={skill} variant="outline" className="text-xs">
                                                        {skill.replace('_', ' ')}
                                                    </Badge>
                                                ))}
                                            </div>

                                            <div className="text-sm mb-4">
                                                <span className="font-medium text-green-600">Match reasons: </span>
                                                <span className="text-muted-foreground">
                                                    {matchScore.reasons.slice(0, 2).join(', ')}
                                                </span>
                                            </div>

                                            <Button onClick={() => handleApply(job.id)} className="w-full">
                                                Apply Now
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobMatches;