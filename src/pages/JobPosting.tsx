import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { MapPin, Clock, DollarSign, Users, Briefcase } from 'lucide-react';
import { saveJobPosting } from '@/lib/jobStorage';
import type { JobPosting as JobPostingType } from '@/lib/jobStorage';

const JobPosting: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        jobType: '',
        skills: [] as string[],
        duration: '',
        workingHours: '',
        village: '',
        district: '',
        state: '',
        experience: '',
        gender: '',
        minAge: '',
        maxAge: '',
        languages: [] as string[],
        wageType: '',
        amount: '',
        paymentSchedule: '',
        benefits: [] as string[]
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const skillOptions = [
        'harvesting', 'plowing', 'irrigation', 'pest_control', 'planting',
        'weeding', 'fertilizing', 'threshing', 'transport', 'equipment_operation'
    ];

    const languageOptions = ['Hindi', 'English', 'Kannada', 'Telugu', 'Tamil', 'Marathi', 'Gujarati', 'Punjabi'];

    const benefitOptions = ['accommodation', 'food', 'transport', 'medical', 'insurance'];

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSkillChange = (skill: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            skills: checked
                ? [...prev.skills, skill]
                : prev.skills.filter(s => s !== skill)
        }));
    };

    const handleLanguageChange = (language: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            languages: checked
                ? [...prev.languages, language]
                : prev.languages.filter(l => l !== language)
        }));
    };

    const handleBenefitChange = (benefit: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            benefits: checked
                ? [...prev.benefits, benefit]
                : prev.benefits.filter(b => b !== benefit)
        }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) newErrors.title = 'Job title is required';
        if (!formData.description.trim()) newErrors.description = 'Job description is required';
        if (!formData.jobType) newErrors.jobType = 'Job type is required';
        if (formData.skills.length === 0) newErrors.skills = 'At least one skill is required';
        if (!formData.duration.trim()) newErrors.duration = 'Duration is required';
        if (!formData.village.trim()) newErrors.village = 'Village is required';
        if (!formData.district.trim()) newErrors.district = 'District is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.wageType) newErrors.wageType = 'Wage type is required';
        if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid wage amount is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            // Save job posting to localStorage
            const jobPosting = saveJobPosting({
                userId: user?.id || 'unknown',
                userName: user?.name || 'Unknown User',
                userEmail: user?.email || 'unknown@email.com',
                ...formData,
            });

            // Show success message with job ID
            alert(`Job posted successfully!\nJob ID: ${jobPosting.id}\n\nCheck browser console for details.`);
            
            // Navigate back to marketplace
            navigate('/labor-marketplace');
        } catch (error) {
            console.error('Error posting job:', error);
            alert('Failed to post job. Please try again.');
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="max-w-4xl mx-auto p-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Please Login</h1>
                        <p className="text-muted-foreground">You need to be logged in to post jobs.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="max-w-4xl mx-auto p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Post a Job</h1>
                    <p className="text-muted-foreground">Find skilled workers for your farming needs</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Briefcase className="h-5 w-5" />
                                <span>Basic Information</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="title">Job Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="e.g., Rice Harvesting Workers Needed"
                                    className={errors.title ? 'border-red-500' : ''}
                                />
                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <Label htmlFor="description">Job Description *</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Describe the work, requirements, and any special instructions..."
                                    rows={4}
                                    className={errors.description ? 'border-red-500' : ''}
                                />
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="jobType">Job Type *</Label>
                                    <Select value={formData.jobType} onValueChange={(value) => handleInputChange('jobType', value)}>
                                        <SelectTrigger className={errors.jobType ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Select job type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="daily_wage">Daily Wage</SelectItem>
                                            <SelectItem value="contract">Contract</SelectItem>
                                            <SelectItem value="seasonal">Seasonal</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.jobType && <p className="text-red-500 text-sm mt-1">{errors.jobType}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="duration">Duration *</Label>
                                    <Input
                                        id="duration"
                                        value={formData.duration}
                                        onChange={(e) => handleInputChange('duration', e.target.value)}
                                        placeholder="e.g., 2 weeks, 3 months"
                                        className={errors.duration ? 'border-red-500' : ''}
                                    />
                                    {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="workingHours">Working Hours</Label>
                                <Input
                                    id="workingHours"
                                    value={formData.workingHours}
                                    onChange={(e) => handleInputChange('workingHours', e.target.value)}
                                    placeholder="e.g., 8 hours/day, flexible"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Required Skills */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Skills Required *</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {skillOptions.map((skill) => (
                                    <div key={skill} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={skill}
                                            checked={formData.skills.includes(skill)}
                                            onCheckedChange={(checked) => handleSkillChange(skill, checked as boolean)}
                                        />
                                        <Label htmlFor={skill} className="text-sm capitalize">
                                            {skill.replace('_', ' ')}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            {errors.skills && <p className="text-red-500 text-sm mt-2">{errors.skills}</p>}
                        </CardContent>
                    </Card>

                    {/* Location */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <MapPin className="h-5 w-5" />
                                <span>Work Location *</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="village">Village *</Label>
                                    <Input
                                        id="village"
                                        value={formData.village}
                                        onChange={(e) => handleInputChange('village', e.target.value)}
                                        className={errors.village ? 'border-red-500' : ''}
                                    />
                                    {errors.village && <p className="text-red-500 text-sm mt-1">{errors.village}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="district">District *</Label>
                                    <Input
                                        id="district"
                                        value={formData.district}
                                        onChange={(e) => handleInputChange('district', e.target.value)}
                                        className={errors.district ? 'border-red-500' : ''}
                                    />
                                    {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="state">State *</Label>
                                    <Input
                                        id="state"
                                        value={formData.state}
                                        onChange={(e) => handleInputChange('state', e.target.value)}
                                        className={errors.state ? 'border-red-500' : ''}
                                    />
                                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Requirements */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Users className="h-5 w-5" />
                                <span>Worker Requirements</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="experience">Experience Level</Label>
                                    <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select experience" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="beginner">Beginner</SelectItem>
                                            <SelectItem value="intermediate">Intermediate</SelectItem>
                                            <SelectItem value="experienced">Experienced</SelectItem>
                                            <SelectItem value="expert">Expert</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="gender">Gender Preference</Label>
                                    <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="any">Any</SelectItem>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <Label htmlFor="minAge">Min Age</Label>
                                        <Input
                                            id="minAge"
                                            type="number"
                                            value={formData.minAge}
                                            onChange={(e) => handleInputChange('minAge', e.target.value)}
                                            placeholder="18"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="maxAge">Max Age</Label>
                                        <Input
                                            id="maxAge"
                                            type="number"
                                            value={formData.maxAge}
                                            onChange={(e) => handleInputChange('maxAge', e.target.value)}
                                            placeholder="60"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label>Languages Required</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                                    {languageOptions.map((language) => (
                                        <div key={language} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`lang-${language}`}
                                                checked={formData.languages.includes(language)}
                                                onCheckedChange={(checked) => handleLanguageChange(language, checked as boolean)}
                                            />
                                            <Label htmlFor={`lang-${language}`} className="text-sm">
                                                {language}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Compensation */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <DollarSign className="h-5 w-5" />
                                <span>Compensation *</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="wageType">Wage Type *</Label>
                                    <Select value={formData.wageType} onValueChange={(value) => handleInputChange('wageType', value)}>
                                        <SelectTrigger className={errors.wageType ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Select wage type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="daily">Daily</SelectItem>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.wageType && <p className="text-red-500 text-sm mt-1">{errors.wageType}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="amount">Amount (₹) *</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        value={formData.amount}
                                        onChange={(e) => handleInputChange('amount', e.target.value)}
                                        placeholder="350"
                                        className={errors.amount ? 'border-red-500' : ''}
                                    />
                                    {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="paymentSchedule">Payment Schedule</Label>
                                    <Select value={formData.paymentSchedule} onValueChange={(value) => handleInputChange('paymentSchedule', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select schedule" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="daily">Daily</SelectItem>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                            <SelectItem value="end_of_work">End of Work</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label>Additional Benefits</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                                    {benefitOptions.map((benefit) => (
                                        <div key={benefit} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`benefit-${benefit}`}
                                                checked={formData.benefits.includes(benefit)}
                                                onCheckedChange={(checked) => handleBenefitChange(benefit, checked as boolean)}
                                            />
                                            <Label htmlFor={`benefit-${benefit}`} className="text-sm capitalize">
                                                {benefit.replace('_', ' ')}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex justify-end space-x-4">
                        <Button type="button" variant="outline" onClick={() => navigate('/labor-marketplace')}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-green-600 hover:bg-green-700">
                            Post Job
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobPosting;