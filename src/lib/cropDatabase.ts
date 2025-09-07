export interface CropInfo {
    id: string;
    name: string;
    scientificName: string;
    category: string;
    description: string;
    growingSeason: {
        planting: string;
        harvesting: string;
        duration: string;
    };
    climate: {
        temperature: {
            min: number;
            max: number;
            optimal: number;
        };
        humidity: {
            min: number;
            max: number;
            optimal: number;
        };
        rainfall: {
            min: number;
            max: number;
            optimal: number;
        };
    };
    soil: {
        type: string;
        ph: {
            min: number;
            max: number;
            optimal: number;
        };
        nutrients: string[];
    };
    watering: {
        frequency: string;
        amount: string;
        method: string;
    };
    diseases: DiseaseInfo[];
    pests: PestInfo[];
    fertilizers: FertilizerInfo[];
    steps: CropStep[];
    images: string[];
}

export interface DiseaseInfo {
    id: string;
    name: string;
    symptoms: string[];
    causes: string[];
    prevention: string[];
    treatment: TreatmentInfo[];
    severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface PestInfo {
    id: string;
    name: string;
    type: 'insect' | 'mite' | 'nematode' | 'weed' | 'fungus';
    symptoms: string[];
    damage: string[];
    naturalControl: string[];
    chemicalControl: PesticideInfo[];
}

export interface PesticideInfo {
    id: string;
    name: string;
    type: 'insecticide' | 'fungicide' | 'herbicide' | 'nematocide';
    activeIngredient: string;
    concentration: string;
    application: string;
    dosage: string;
    price: number;
    availability: 'available' | 'limited' | 'out_of_stock';
    safety: 'low' | 'medium' | 'high';
    environmental: 'eco_friendly' | 'moderate' | 'harmful';
}

export interface TreatmentInfo {
    method: 'chemical' | 'organic' | 'cultural' | 'biological';
    products: PesticideInfo[];
    instructions: string;
    timing: string;
}

export interface FertilizerInfo {
    type: string;
    composition: string;
    application: string;
    frequency: string;
    quantity: string;
}

export interface CropStep {
    id: string;
    title: string;
    description: string;
    duration: string;
    requirements: string[];
    tips: string[];
    warnings: string[];
}

// Comprehensive crop database
export const cropDatabase: CropInfo[] = [
    {
        id: 'tomato',
        name: 'Tomato',
        scientificName: 'Solanum lycopersicum',
        category: 'Vegetable',
        description: 'Popular warm-season crop known for its versatility in cooking and nutritional value.',
        growingSeason: {
            planting: 'February-March (Spring)',
            harvesting: 'June-August',
            duration: '60-80 days'
        },
        climate: {
            temperature: { min: 15, max: 35, optimal: 21 },
            humidity: { min: 40, max: 70, optimal: 60 },
            rainfall: { min: 500, max: 1000, optimal: 750 }
        },
        soil: {
            type: 'Well-drained loamy soil',
            ph: { min: 6.0, max: 7.0, optimal: 6.5 },
            nutrients: ['Nitrogen', 'Phosphorus', 'Potassium', 'Calcium']
        },
        watering: {
            frequency: 'Every 2-3 days',
            amount: '20-30 liters per square meter',
            method: 'Drip irrigation preferred'
        },
        diseases: [
            {
                id: 'blight',
                name: 'Late Blight',
                symptoms: ['Dark lesions on leaves', 'White mold on undersides', 'Fruit rot'],
                causes: ['High humidity', 'Cool temperatures', 'Poor air circulation'],
                prevention: ['Plant resistant varieties', 'Ensure good air circulation', 'Avoid overhead watering'],
                treatment: [
                    {
                        method: 'chemical',
                        products: [
                            {
                                id: 'mancozeb',
                                name: 'Mancozeb 75% WP',
                                type: 'fungicide',
                                activeIngredient: 'Mancozeb',
                                concentration: '75%',
                                application: 'Foliar spray',
                                dosage: '2g per liter of water',
                                price: 450,
                                availability: 'available',
                                safety: 'medium',
                                environmental: 'moderate'
                            }
                        ],
                        instructions: 'Spray every 7-10 days when conditions are favorable for disease',
                        timing: 'At first sign of disease or preventively'
                    }
                ],
                severity: 'high'
            },
            {
                id: 'fusarium',
                name: 'Fusarium Wilt',
                symptoms: ['Yellowing of lower leaves', 'Brown vascular discoloration', 'Plant wilting'],
                causes: ['Soil-borne fungus', 'Poor soil drainage', 'Infected seeds'],
                prevention: ['Use disease-resistant varieties', 'Crop rotation', 'Soil sterilization'],
                treatment: [
                    {
                        method: 'chemical',
                        products: [
                            {
                                id: 'carbendazim',
                                name: 'Carbendazim 50% WP',
                                type: 'fungicide',
                                activeIngredient: 'Carbendazim',
                                concentration: '50%',
                                application: 'Soil drench',
                                dosage: '1g per liter of water',
                                price: 320,
                                availability: 'available',
                                safety: 'medium',
                                environmental: 'moderate'
                            }
                        ],
                        instructions: 'Apply as soil drench at transplanting',
                        timing: 'Before transplanting or at first symptoms'
                    }
                ],
                severity: 'critical'
            }
        ],
        pests: [
            {
                id: 'aphids',
                name: 'Aphids',
                type: 'insect',
                symptoms: ['Curled leaves', 'Sticky honeydew', 'Yellowing leaves'],
                damage: ['Reduced plant growth', 'Virus transmission', 'Sooty mold development'],
                naturalControl: ['Ladybird beetles', 'Hoverflies', 'Parasitic wasps'],
                chemicalControl: [
                    {
                        id: 'imidacloprid',
                        name: 'Imidacloprid 17.8% SL',
                        type: 'insecticide',
                        activeIngredient: 'Imidacloprid',
                        concentration: '17.8%',
                        application: 'Foliar spray',
                        dosage: '0.5ml per liter of water',
                        price: 580,
                        availability: 'available',
                        safety: 'medium',
                        environmental: 'moderate'
                    }
                ]
            }
        ],
        fertilizers: [
            {
                type: 'NPK 10-26-26',
                composition: '10% Nitrogen, 26% Phosphorus, 26% Potassium',
                application: 'Basal application',
                frequency: 'Once at planting',
                quantity: '50-100 kg per hectare'
            },
            {
                type: 'Urea',
                composition: '46% Nitrogen',
                application: 'Top dressing',
                frequency: 'Every 15-20 days',
                quantity: '25-50 kg per hectare'
            }
        ],
        steps: [
            {
                id: 'seed_preparation',
                title: 'Seed Preparation and Sowing',
                description: 'Prepare seeds and nursery for healthy seedlings',
                duration: '7-10 days',
                requirements: ['Quality seeds', 'Nursery trays', 'Coco peat', 'Water'],
                tips: ['Use treated seeds', 'Maintain 25-30°C temperature', 'Keep soil moist'],
                warnings: ['Avoid overwatering', 'Protect from direct sunlight', 'Watch for damping off']
            },
            {
                id: 'transplanting',
                title: 'Transplanting',
                description: 'Move seedlings to main field when they have 4-6 true leaves',
                duration: '1 day',
                requirements: ['Prepared field', 'Healthy seedlings', 'Watering can'],
                tips: ['Transplant in evening', 'Water immediately after transplanting', 'Space plants 45-60cm apart'],
                warnings: ['Avoid transplanting during hot sun', 'Handle seedlings carefully', 'Ensure proper root establishment']
            },
            {
                id: 'watering_fertilizing',
                title: 'Watering and Fertilizing',
                description: 'Maintain proper irrigation and nutrient supply',
                duration: 'Throughout growing season',
                requirements: ['Irrigation system', 'Fertilizers', 'pH testing kit'],
                tips: ['Water early morning or evening', 'Test soil pH regularly', 'Apply fertilizers as per schedule'],
                warnings: ['Avoid waterlogging', 'Don\'t apply fertilizers during fruiting', 'Monitor for nutrient deficiencies']
            },
            {
                id: 'pest_disease_management',
                title: 'Pest and Disease Management',
                description: 'Regular monitoring and timely intervention',
                duration: 'Throughout season',
                requirements: ['Pesticides', 'Protective equipment', 'Monitoring tools'],
                tips: ['Regular field visits', 'Identify pests early', 'Use IPM practices'],
                warnings: ['Follow safety precautions', 'Respect waiting periods', 'Don\'t overuse chemicals']
            },
            {
                id: 'harvesting',
                title: 'Harvesting',
                description: 'Harvest when fruits are mature and firm',
                duration: '2-3 weeks',
                requirements: ['Sharp knife', 'Collection baskets', 'Storage facility'],
                tips: ['Harvest in morning', 'Handle fruits gently', 'Sort by size and quality'],
                warnings: ['Don\'t harvest when wet', 'Avoid bruising fruits', 'Store in cool place']
            }
        ],
        images: ['🍅']
    },
    {
        id: 'rice',
        name: 'Rice',
        scientificName: 'Oryza sativa',
        category: 'Cereal',
        description: 'Staple food crop, major source of carbohydrates for billions of people worldwide.',
        growingSeason: {
            planting: 'June-July (Monsoon)',
            harvesting: 'October-November',
            duration: '120-150 days'
        },
        climate: {
            temperature: { min: 20, max: 35, optimal: 28 },
            humidity: { min: 60, max: 90, optimal: 80 },
            rainfall: { min: 1000, max: 2000, optimal: 1500 }
        },
        soil: {
            type: 'Clay or clay-loam soil',
            ph: { min: 5.5, max: 7.0, optimal: 6.5 },
            nutrients: ['Nitrogen', 'Phosphorus', 'Potassium', 'Silicon']
        },
        watering: {
            frequency: 'Continuous flooding',
            amount: '5-10 cm water depth',
            method: 'Flood irrigation'
        },
        diseases: [
            {
                id: 'blast',
                name: 'Rice Blast',
                symptoms: ['Diamond-shaped lesions on leaves', 'Node infection', 'Panicle blasting'],
                causes: ['High humidity', 'Temperature fluctuations', 'Nitrogen excess'],
                prevention: ['Use resistant varieties', 'Balanced fertilization', 'Proper water management'],
                treatment: [
                    {
                        method: 'chemical',
                        products: [
                            {
                                id: 'tricyclazole',
                                name: 'Tricyclazole 75% WP',
                                type: 'fungicide',
                                activeIngredient: 'Tricyclazole',
                                concentration: '75%',
                                application: 'Foliar spray',
                                dosage: '1g per liter of water',
                                price: 680,
                                availability: 'available',
                                safety: 'medium',
                                environmental: 'moderate'
                            }
                        ],
                        instructions: 'Apply at panicle initiation stage',
                        timing: 'When disease incidence reaches 5%'
                    }
                ],
                severity: 'high'
            }
        ],
        pests: [
            {
                id: 'stem_borer',
                name: 'Stem Borer',
                type: 'insect',
                symptoms: ['Whiteheads in field', 'Holes in stems', 'Broken tillers'],
                damage: ['Yield loss up to 30%', 'Poor grain quality', 'Lodging'],
                naturalControl: ['Egg parasites', 'Bird predation', 'Fungal pathogens'],
                chemicalControl: [
                    {
                        id: 'chlorpyrifos',
                        name: 'Chlorpyrifos 20% EC',
                        type: 'insecticide',
                        activeIngredient: 'Chlorpyrifos',
                        concentration: '20%',
                        application: 'Foliar spray',
                        dosage: '2ml per liter of water',
                        price: 420,
                        availability: 'available',
                        safety: 'medium',
                        environmental: 'harmful'
                    }
                ]
            }
        ],
        fertilizers: [
            {
                type: 'Urea',
                composition: '46% Nitrogen',
                application: 'Split application',
                frequency: 'Basal + 30 DAT + 50 DAT',
                quantity: '80-100 kg per hectare'
            },
            {
                type: 'SSP',
                composition: '16% Phosphorus',
                application: 'Basal',
                frequency: 'Once',
                quantity: '60-80 kg per hectare'
            }
        ],
        steps: [
            {
                id: 'land_preparation',
                title: 'Land Preparation',
                description: 'Prepare field with proper puddling for water retention',
                duration: '7-10 days',
                requirements: ['Tractor', 'Puddling equipment', 'Leveling tools'],
                tips: ['Ensure proper water drainage', 'Remove weeds completely', 'Achieve fine tilth'],
                warnings: ['Avoid over-puddling', 'Don\'t work when too wet', 'Ensure field leveling']
            },
            {
                id: 'seed_treatment',
                title: 'Seed Treatment and Sowing',
                description: 'Treat seeds and sow in puddled field',
                duration: '1-2 days',
                requirements: ['Quality seeds', 'Seed treatment chemicals', 'Drum seeder'],
                tips: ['Use certified seeds', 'Treat with fungicides', 'Maintain proper seed rate'],
                warnings: ['Don\'t use damaged seeds', 'Follow safety precautions', 'Avoid sowing in standing water']
            },
            {
                id: 'water_management',
                title: 'Water Management',
                description: 'Maintain continuous flooding throughout growing season',
                duration: 'Throughout season',
                requirements: ['Irrigation channels', 'Water control structures'],
                tips: ['Maintain 5-7 cm water depth', 'Drain periodically', 'Monitor water quality'],
                warnings: ['Avoid water stagnation', 'Watch for salinity', 'Prevent water logging']
            },
            {
                id: 'weed_management',
                title: 'Weed Management',
                description: 'Control weeds through manual and chemical methods',
                duration: 'Multiple times',
                requirements: ['Weedicides', 'Manual labor', 'Cono weeder'],
                tips: ['Early weed control crucial', 'Use recommended herbicides', 'Manual weeding at 20-25 DAT'],
                warnings: ['Follow herbicide safety', 'Don\'t spray during windy conditions', 'Respect waiting periods']
            },
            {
                id: 'harvest_threshing',
                title: 'Harvesting and Threshing',
                description: 'Harvest at proper maturity and thresh grains',
                duration: '7-10 days',
                requirements: ['Harvester', 'Threshing machine', 'Drying yard'],
                tips: ['Harvest at 20-22% moisture', 'Dry grains to 12-14%', 'Clean and store properly'],
                warnings: ['Avoid harvesting when wet', 'Prevent grain damage', 'Ensure proper drying']
            }
        ],
        images: ['🌾']
    },
    {
        id: 'wheat',
        name: 'Wheat',
        scientificName: 'Triticum aestivum',
        category: 'Cereal',
        description: 'Important staple crop, primary source of carbohydrates in many regions.',
        growingSeason: {
            planting: 'October-November (Rabi)',
            harvesting: 'March-April',
            duration: '120-140 days'
        },
        climate: {
            temperature: { min: 10, max: 25, optimal: 15 },
            humidity: { min: 40, max: 70, optimal: 60 },
            rainfall: { min: 300, max: 600, optimal: 450 }
        },
        soil: {
            type: 'Well-drained loamy soil',
            ph: { min: 6.0, max: 7.5, optimal: 6.8 },
            nutrients: ['Nitrogen', 'Phosphorus', 'Potassium', 'Zinc']
        },
        watering: {
            frequency: '4-5 irrigations',
            amount: '6-8 cm per irrigation',
            method: 'Flood or sprinkler irrigation'
        },
        diseases: [
            {
                id: 'rust',
                name: 'Wheat Rust',
                symptoms: ['Orange-brown pustules on leaves', 'Yellowing', 'Premature leaf death'],
                causes: ['Fungal spores', 'High humidity', 'Susceptible varieties'],
                prevention: ['Use resistant varieties', 'Proper field sanitation', 'Balanced fertilization'],
                treatment: [
                    {
                        method: 'chemical',
                        products: [
                            {
                                id: 'propiconazole',
                                name: 'Propiconazole 25% EC',
                                type: 'fungicide',
                                activeIngredient: 'Propiconazole',
                                concentration: '25%',
                                application: 'Foliar spray',
                                dosage: '1ml per liter of water',
                                price: 750,
                                availability: 'available',
                                safety: 'medium',
                                environmental: 'moderate'
                            }
                        ],
                        instructions: 'Apply at first sign of disease',
                        timing: 'Flag leaf emergence to flowering'
                    }
                ],
                severity: 'high'
            }
        ],
        pests: [
            {
                id: 'aphids',
                name: 'Wheat Aphids',
                type: 'insect',
                symptoms: ['Clustered insects on leaves', 'Honeydew secretion', 'Yellowing leaves'],
                damage: ['Reduced grain weight', 'Virus transmission', 'Quality deterioration'],
                naturalControl: ['Ladybird beetles', 'Parasitic wasps', 'Fungal diseases'],
                chemicalControl: [
                    {
                        id: 'dimethoate',
                        name: 'Dimethoate 30% EC',
                        type: 'insecticide',
                        activeIngredient: 'Dimethoate',
                        concentration: '30%',
                        application: 'Foliar spray',
                        dosage: '1.5ml per liter of water',
                        price: 380,
                        availability: 'available',
                        safety: 'medium',
                        environmental: 'harmful'
                    }
                ]
            }
        ],
        fertilizers: [
            {
                type: 'DAP',
                composition: '18% Nitrogen, 46% Phosphorus',
                application: 'Basal',
                frequency: 'Once',
                quantity: '50-60 kg per hectare'
            },
            {
                type: 'Urea',
                composition: '46% Nitrogen',
                application: 'Split doses',
                frequency: 'Crown root initiation + Flowering',
                quantity: '80-100 kg per hectare'
            }
        ],
        steps: [
            {
                id: 'field_preparation',
                title: 'Field Preparation',
                description: 'Prepare seedbed with proper tillage and leveling',
                duration: '7-10 days',
                requirements: ['Tractor', 'Harrows', 'Leveler'],
                tips: ['Deep ploughing for weed control', 'Fine seedbed preparation', 'Ensure proper drainage'],
                warnings: ['Avoid working in wet soil', 'Don\'t over-plough', 'Maintain soil structure']
            },
            {
                id: 'sowing',
                title: 'Sowing',
                description: 'Sow seeds at proper depth and spacing',
                duration: '3-5 days',
                requirements: ['Wheat seeds', 'Seed drill', 'Fertilizer drill'],
                tips: ['Sow at 4-5 cm depth', 'Maintain 20-22 cm row spacing', 'Use recommended seed rate'],
                warnings: ['Don\'t sow in dry soil', 'Avoid broadcasting', 'Ensure uniform depth']
            },
            {
                id: 'irrigation',
                title: 'Irrigation Management',
                description: 'Apply water at critical growth stages',
                duration: 'Throughout season',
                requirements: ['Irrigation system', 'Water measurement tools'],
                tips: ['First irrigation at 20-25 DAS', 'Critical stages: CRI, flowering, grain filling', 'Avoid water stress'],
                warnings: ['Don\'t over-irrigate', 'Monitor soil moisture', 'Prevent waterlogging']
            },
            {
                id: 'pest_control',
                title: 'Pest and Disease Control',
                description: 'Monitor and control pests and diseases',
                duration: 'Throughout season',
                requirements: ['Pesticides', 'Monitoring tools', 'Safety equipment'],
                tips: ['Regular field scouting', 'Use economic thresholds', 'Follow IPM practices'],
                warnings: ['Use PPE', 'Follow label instructions', 'Respect waiting periods']
            },
            {
                id: 'harvesting',
                title: 'Harvesting',
                description: 'Harvest at proper maturity stage',
                duration: '7-10 days',
                requirements: ['Harvester', 'Labor', 'Storage facility'],
                tips: ['Harvest at 12-14% moisture', 'Thresh immediately', 'Dry to safe moisture level'],
                warnings: ['Avoid harvesting when wet', 'Prevent grain damage', 'Ensure proper drying']
            }
        ],
        images: ['🌾']
    }
];

// Helper functions
export const getCropById = (id: string): CropInfo | undefined => {
    return cropDatabase.find(crop => crop.id === id);
};

export const getCropsByCategory = (category: string): CropInfo[] => {
    return cropDatabase.filter(crop => crop.category === category);
};

export const searchCrops = (query: string): CropInfo[] => {
    const lowercaseQuery = query.toLowerCase();
    return cropDatabase.filter(crop =>
        crop.name.toLowerCase().includes(lowercaseQuery) ||
        crop.scientificName.toLowerCase().includes(lowercaseQuery) ||
        crop.description.toLowerCase().includes(lowercaseQuery)
    );
};

export const getDiseaseById = (cropId: string, diseaseId: string): DiseaseInfo | undefined => {
    const crop = getCropById(cropId);
    return crop?.diseases.find(disease => disease.id === diseaseId);
};

export const getPestById = (cropId: string, pestId: string): PestInfo | undefined => {
    const crop = getCropById(cropId);
    return crop?.pests.find(pest => pest.id === pestId);
};

export const getRecommendedPesticides = (cropId: string, issueType: 'disease' | 'pest', issueId: string): PesticideInfo[] => {
    const crop = getCropById(cropId);
    if (!crop) return [];

    if (issueType === 'disease') {
        const disease = crop.diseases.find(d => d.id === issueId);
        return disease?.treatment.flatMap(t => t.products) || [];
    } else {
        const pest = crop.pests.find(p => p.id === issueId);
        return pest?.chemicalControl || [];
    }
};