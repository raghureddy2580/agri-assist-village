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
    },
    {
        id: 'maize',
        name: 'Maize (Corn)',
        scientificName: 'Zea mays',
        category: 'Cereal',
        description: 'Important cereal crop used for food, feed, and industrial purposes. High in carbohydrates and provides essential nutrients.',
        growingSeason: {
            planting: 'June-July (Kharif)',
            harvesting: 'September-October',
            duration: '90-110 days'
        },
        climate: {
            temperature: { min: 18, max: 32, optimal: 25 },
            humidity: { min: 50, max: 80, optimal: 65 },
            rainfall: { min: 500, max: 800, optimal: 600 }
        },
        soil: {
            type: 'Well-drained fertile soil',
            ph: { min: 5.8, max: 7.0, optimal: 6.5 },
            nutrients: ['Nitrogen', 'Phosphorus', 'Potassium', 'Zinc']
        },
        watering: {
            frequency: 'Every 8-10 days',
            amount: '6-8 cm per irrigation',
            method: 'Drip or sprinkler irrigation'
        },
        diseases: [
            {
                id: 'turcicum',
                name: 'Turcicum Leaf Blight',
                symptoms: ['Elliptical lesions on leaves', 'Yellow halos', 'Premature drying'],
                causes: ['High humidity', 'Fungal spores', 'Poor air circulation'],
                prevention: ['Use resistant varieties', 'Proper spacing', 'Fungicide application'],
                treatment: [
                    {
                        method: 'chemical',
                        products: [
                            {
                                id: 'propiconazole_maize',
                                name: 'Propiconazole 25% EC',
                                type: 'fungicide',
                                activeIngredient: 'Propiconazole',
                                concentration: '25%',
                                application: 'Foliar spray',
                                dosage: '1ml per liter of water',
                                price: 720,
                                availability: 'available',
                                safety: 'medium',
                                environmental: 'moderate'
                            }
                        ],
                        instructions: 'Apply at first sign of disease',
                        timing: '7-10 days interval if needed'
                    }
                ],
                severity: 'medium'
            }
        ],
        pests: [
            {
                id: 'stem_borer_maize',
                name: 'Stem Borer',
                type: 'insect',
                symptoms: ['Holes in stems', 'Broken stalks', 'Dead hearts'],
                damage: ['Yield loss up to 40%', 'Poor grain quality', 'Lodging'],
                naturalControl: ['Trichogramma wasps', 'Bird predation'],
                chemicalControl: [
                    {
                        id: 'emamectin_maize',
                        name: 'Emamectin Benzoate 5% SG',
                        type: 'insecticide',
                        activeIngredient: 'Emamectin Benzoate',
                        concentration: '5%',
                        application: 'Foliar spray',
                        dosage: '0.4g per liter of water',
                        price: 850,
                        availability: 'available',
                        safety: 'medium',
                        environmental: 'moderate'
                    }
                ]
            }
        ],
        fertilizers: [
            {
                type: 'NPK 20-20-20',
                composition: '20% Nitrogen, 20% Phosphorus, 20% Potassium',
                application: 'Basal application',
                frequency: 'Once',
                quantity: '100-120 kg per hectare'
            },
            {
                type: 'Urea',
                composition: '46% Nitrogen',
                application: 'Top dressing',
                frequency: '30 and 50 DAS',
                quantity: '100-120 kg per hectare'
            }
        ],
        steps: [
            {
                id: 'land_preparation_maize',
                title: 'Land Preparation and Sowing',
                description: 'Prepare field with proper puddling for water retention',
                duration: '7-10 days',
                requirements: ['Tractor', 'Puddling equipment', 'Leveling tools'],
                tips: ['Ensure proper water drainage', 'Remove weeds completely', 'Achieve fine tilth'],
                warnings: ['Avoid over-puddling', 'Don\'t work when too wet', 'Ensure field leveling']
            },
            {
                id: 'seed_treatment_maize',
                title: 'Seed Treatment and Sowing',
                description: 'Treat seeds and sow in puddled field',
                duration: '1-2 days',
                requirements: ['Quality seeds', 'Seed treatment chemicals', 'Drum seeder'],
                tips: ['Use certified seeds', 'Treat with fungicides', 'Maintain proper seed rate'],
                warnings: ['Don\'t use damaged seeds', 'Avoid sowing in standing water', 'Ensure uniform depth']
            },
            {
                id: 'water_management_maize',
                title: 'Water Management',
                description: 'Maintain continuous flooding throughout growing season',
                duration: 'Throughout season',
                requirements: ['Irrigation channels', 'Water control structures'],
                tips: ['Maintain 5-7 cm water depth', 'Drain periodically', 'Monitor water quality'],
                warnings: ['Avoid water stagnation', 'Watch for salinity', 'Prevent water logging']
            },
            {
                id: 'weed_management_maize',
                title: 'Weed Management',
                description: 'Control weeds through manual and chemical methods',
                duration: 'Multiple times',
                requirements: ['Weedicides', 'Manual labor', 'Cono weeder'],
                tips: ['Early weed control crucial', 'Use recommended herbicides', 'Manual weeding at 20-25 DAS'],
                warnings: ['Follow herbicide safety', 'Don\'t spray during windy conditions', 'Respect waiting periods']
            },
            {
                id: 'harvest_threshing_maize',
                title: 'Harvesting and Threshing',
                description: 'Harvest at proper maturity and thresh grains',
                duration: '7-10 days',
                requirements: ['Harvester', 'Threshing machine', 'Drying yard'],
                tips: ['Harvest at 20-22% moisture', 'Thresh immediately', 'Clean and store properly'],
                warnings: ['Avoid harvesting when wet', 'Prevent grain damage', 'Ensure proper drying']
            }
        ],
        images: ['🌽']
    },
    {
        id: 'sugarcane',
        name: 'Sugarcane',
        scientificName: 'Saccharum officinarum',
        category: 'Cash Crop',
        description: 'Major cash crop used for sugar production, ethanol, and various industrial applications.',
        growingSeason: {
            planting: 'February-March (Spring) or October-November (Autumn)',
            harvesting: '12-18 months after planting',
            duration: '12-18 months'
        },
        climate: {
            temperature: { min: 20, max: 35, optimal: 27 },
            humidity: { min: 60, max: 80, optimal: 70 },
            rainfall: { min: 1500, max: 2500, optimal: 2000 }
        },
        soil: {
            type: 'Deep, fertile, well-drained soil',
            ph: { min: 6.5, max: 7.5, optimal: 7.0 },
            nutrients: ['Nitrogen', 'Phosphorus', 'Potassium', 'Calcium']
        },
        watering: {
            frequency: 'Every 7-10 days',
            amount: '8-10 cm per irrigation',
            method: 'Flood irrigation preferred'
        },
        diseases: [
            {
                id: 'red_rot',
                name: 'Red Rot',
                symptoms: ['Red discoloration in internodes', 'White fungal growth', 'Dried leaves'],
                causes: ['Fungal infection', 'Wounds during harvesting', 'Infected setts'],
                prevention: ['Use healthy setts', 'Hot water treatment', 'Field sanitation'],
                treatment: [
                    {
                        method: 'chemical',
                        products: [
                            {
                                id: 'carbendazim_sugarcane',
                                name: 'Carbendazim 50% WP',
                                type: 'fungicide',
                                activeIngredient: 'Carbendazim',
                                concentration: '50%',
                                application: 'Sett treatment',
                                dosage: '2g per kg of setts',
                                price: 340,
                                availability: 'available',
                                safety: 'medium',
                                environmental: 'moderate'
                            }
                        ],
                        instructions: 'Treat setts before planting',
                        timing: 'Before planting'
                    }
                ],
                severity: 'high'
            }
        ],
        pests: [
            {
                id: 'borer_sugarcane',
                name: 'Sugarcane Borer',
                type: 'insect',
                symptoms: ['Holes in canes', 'Reddish frass', 'Dead hearts'],
                damage: ['Yield loss up to 30%', 'Poor sugar recovery', 'Plant death'],
                naturalControl: ['Parasitic wasps', 'Bird predation'],
                chemicalControl: [
                    {
                        id: 'chlorpyrifos_sugarcane',
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
                type: 'NPK 10-26-26',
                composition: '10% Nitrogen, 26% Phosphorus, 26% Potassium',
                application: 'Basal application',
                frequency: 'Once',
                quantity: '200-250 kg per hectare'
            },
            {
                type: 'Urea',
                composition: '46% Nitrogen',
                application: 'Split application',
                frequency: '3-4 months after planting',
                quantity: '150-200 kg per hectare'
            }
        ],
        steps: [
            {
                id: 'sett_preparation',
                title: 'Sett Preparation and Treatment',
                description: 'Select and treat healthy sugarcane setts',
                duration: '7-10 days',
                requirements: ['Quality setts', 'Fungicides', 'Hot water treatment facility'],
                tips: ['Use 2-3 bud setts', 'Treat with fungicides', 'Hot water treatment at 52°C'],
                warnings: ['Avoid damaged setts', 'Don\'t use treated setts immediately', 'Follow safety precautions']
            },
            {
                id: 'field_preparation_sugarcane',
                title: 'Field Preparation and Planting',
                description: 'Prepare ridges and plant treated setts',
                duration: '10-15 days',
                requirements: ['Tractor', 'Ridger', 'Planting equipment'],
                tips: ['Make 75-90 cm spaced ridges', 'Plant setts at 15-20 cm depth', 'Maintain 1.5m row spacing'],
                warnings: ['Ensure proper drainage', 'Avoid waterlogged areas', 'Don\'t plant in saline soil']
            },
            {
                id: 'irrigation_sugarcane',
                title: 'Irrigation and Weed Management',
                description: 'Maintain moisture and control weeds',
                duration: 'Throughout season',
                requirements: ['Irrigation system', 'Weedicides'],
                tips: ['First irrigation immediately after planting', 'Apply 2,4-D for weed control', 'Irrigate every 7-10 days'],
                warnings: ['Avoid water stress', 'Don\'t over-irrigate', 'Follow herbicide guidelines']
            },
            {
                id: 'earthing_up',
                title: 'Earthing Up and Top Dressing',
                description: 'Build up soil around plants and apply fertilizers',
                duration: '3-4 months after planting',
                requirements: ['Labor', 'Fertilizers'],
                tips: ['Earthing up at 3-4 months', 'Apply nitrogen fertilizers', 'Remove side shoots'],
                warnings: ['Don\'t damage plants', 'Apply fertilizers carefully', 'Monitor for nutrient deficiencies']
            },
            {
                id: 'harvesting_sugarcane',
                title: 'Harvesting',
                description: 'Harvest mature sugarcane',
                duration: '7-10 days',
                requirements: ['Harvesting equipment', 'Transport vehicles'],
                tips: ['Harvest when sucrose content is high', 'Cut close to ground', 'Transport immediately to mill'],
                warnings: ['Avoid harvesting during rains', 'Prevent sucrose loss', 'Ensure timely transport']
            }
        ],
        images: ['🎋']
    },
    {
        id: 'cotton',
        name: 'Cotton',
        scientificName: 'Gossypium spp.',
        category: 'Cash Crop',
        description: 'Major fiber crop used for textile industry. Also known as "white gold" of India.',
        growingSeason: {
            planting: 'May-June (Kharif)',
            harvesting: 'December-January',
            duration: '180-200 days'
        },
        climate: {
            temperature: { min: 20, max: 35, optimal: 28 },
            humidity: { min: 40, max: 70, optimal: 55 },
            rainfall: { min: 600, max: 1000, optimal: 750 }
        },
        soil: {
            type: 'Black cotton soil or well-drained alluvial soil',
            ph: { min: 6.0, max: 8.0, optimal: 7.0 },
            nutrients: ['Nitrogen', 'Phosphorus', 'Potassium', 'Boron']
        },
        watering: {
            frequency: 'Every 7-10 days',
            amount: '5-7 cm per irrigation',
            method: 'Drip irrigation preferred'
        },
        diseases: [
            {
                id: 'bacterial_blight',
                name: 'Bacterial Blight',
                symptoms: ['Angular leaf spots', 'Dark lesions', 'Boll rot'],
                causes: ['Bacterial infection', 'High humidity', 'Wounded plants'],
                prevention: ['Use resistant varieties', 'Avoid overhead irrigation', 'Field sanitation'],
                treatment: [
                    {
                        method: 'chemical',
                        products: [
                            {
                                id: 'streptomycin_cotton',
                                name: 'Streptomycin Sulphate 90% SP',
                                type: 'fungicide',
                                activeIngredient: 'Streptomycin Sulphate',
                                concentration: '90%',
                                application: 'Foliar spray',
                                dosage: '1g per liter of water',
                                price: 650,
                                availability: 'available',
                                safety: 'medium',
                                environmental: 'moderate'
                            }
                        ],
                        instructions: 'Apply at first sign of disease',
                        timing: 'Repeat every 10-15 days if needed'
                    }
                ],
                severity: 'high'
            }
        ],
        pests: [
            {
                id: 'bollworm',
                name: 'American Bollworm',
                type: 'insect',
                symptoms: ['Holes in bolls', 'Larvae feeding', 'Boll damage'],
                damage: ['Yield loss up to 60%', 'Poor fiber quality', 'Economic losses'],
                naturalControl: ['Parasitic wasps', 'Predatory bugs'],
                chemicalControl: [
                    {
                        id: 'emamectin_cotton',
                        name: 'Emamectin Benzoate 5% SG',
                        type: 'insecticide',
                        activeIngredient: 'Emamectin Benzoate',
                        concentration: '5%',
                        application: 'Foliar spray',
                        dosage: '0.4g per liter of water',
                        price: 850,
                        availability: 'available',
                        safety: 'medium',
                        environmental: 'moderate'
                    }
                ]
            }
        ],
        fertilizers: [
            {
                type: 'NPK 20-20-20',
                composition: '20% Nitrogen, 20% Phosphorus, 20% Potassium',
                application: 'Basal application',
                frequency: 'Once',
                quantity: '100-120 kg per hectare'
            },
            {
                type: 'Urea',
                composition: '46% Nitrogen',
                application: 'Split application',
                frequency: '45 and 75 DAS',
                quantity: '80-100 kg per hectare'
            }
        ],
        steps: [
            {
                id: 'seed_treatment_cotton',
                title: 'Seed Treatment and Sowing',
                description: 'Treat seeds and sow in prepared field',
                duration: '7-10 days',
                requirements: ['Quality seeds', 'Seed treatment chemicals', 'Seed drill'],
                tips: ['Treat with fungicides and insecticides', 'Sow at 3-4 cm depth', 'Maintain 60-75 cm row spacing'],
                warnings: ['Use certified seeds', 'Avoid sowing in wet soil', 'Follow seed rate recommendations']
            },
            {
                id: 'thinning_cotton',
                title: 'Thinning and Gap Filling',
                description: 'Remove excess plants and fill gaps',
                duration: '15-20 DAS',
                requirements: ['Labor', 'Extra seedlings'],
                tips: ['Maintain 30-45 cm plant spacing', 'Fill gaps within 15 days', 'Remove weak plants'],
                warnings: ['Don\'t damage roots', 'Ensure proper spacing', 'Monitor for pests']
            },
            {
                id: 'irrigation_cotton',
                title: 'Irrigation and Nutrition',
                description: 'Maintain moisture and provide nutrients',
                duration: 'Throughout season',
                requirements: ['Irrigation system', 'Fertilizers'],
                tips: ['Critical stages: flowering, boll formation', 'Apply micronutrients', 'Monitor soil moisture'],
                warnings: ['Avoid waterlogging', 'Don\'t apply fertilizers during boll formation', 'Prevent nutrient deficiencies']
            },
            {
                id: 'pest_management_cotton',
                title: 'Pest and Disease Management',
                description: 'Regular monitoring and control measures',
                duration: 'Throughout season',
                requirements: ['Pesticides', 'Monitoring tools', 'Safety equipment'],
                tips: ['Use pheromone traps', 'Apply pesticides at recommended times', 'Follow IPM practices'],
                warnings: ['Use PPE', 'Follow label instructions', 'Respect waiting periods']
            },
            {
                id: 'picking_cotton',
                title: 'Picking and Processing',
                description: 'Harvest mature cotton bolls',
                duration: '30-45 days',
                requirements: ['Labor', 'Picking equipment'],
                tips: ['Pick when bolls are fully open', 'Multiple pickings required', 'Store in dry conditions'],
                warnings: ['Avoid picking wet cotton', 'Prevent contamination', 'Ensure proper storage']
            }
        ],
        images: ['☁️']
    },
    {
        id: 'potato',
        name: 'Potato',
        scientificName: 'Solanum tuberosum',
        category: 'Vegetable',
        description: 'Important tuber crop, fourth most important food crop worldwide. Rich in carbohydrates and essential nutrients.',
        growingSeason: {
            planting: 'October-November (Rabi) or February-March (Spring)',
            harvesting: 'March-April or June-July',
            duration: '90-120 days'
        },
        climate: {
            temperature: { min: 15, max: 25, optimal: 20 },
            humidity: { min: 60, max: 80, optimal: 70 },
            rainfall: { min: 500, max: 1000, optimal: 750 }
        },
        soil: {
            type: 'Well-drained sandy loam soil',
            ph: { min: 5.0, max: 6.5, optimal: 5.8 },
            nutrients: ['Nitrogen', 'Phosphorus', 'Potassium', 'Magnesium']
        },
        watering: {
            frequency: 'Every 7-10 days',
            amount: '5-7 cm per irrigation',
            method: 'Drip irrigation preferred'
        },
        diseases: [
            {
                id: 'late_blight',
                name: 'Late Blight',
                symptoms: ['Dark water-soaked lesions', 'White fungal growth', 'Rapid plant death'],
                causes: ['High humidity', 'Cool temperatures', 'Fungal spores'],
                prevention: ['Use resistant varieties', 'Proper spacing', 'Fungicide application'],
                treatment: [
                    {
                        method: 'chemical',
                        products: [
                            {
                                id: 'mancozeb_potato',
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
                        instructions: 'Apply every 7-10 days when conditions are favorable',
                        timing: 'At first sign of disease'
                    }
                ],
                severity: 'critical'
            }
        ],
        pests: [
            {
                id: 'potato_beetle',
                name: 'Colorado Potato Beetle',
                type: 'insect',
                symptoms: ['Skeletonized leaves', 'Yellow eggs on undersides', 'Larvae feeding'],
                damage: ['Complete defoliation', 'Yield loss up to 80%', 'Tuber quality reduction'],
                naturalControl: ['Ladybird beetles', 'Parasitic wasps'],
                chemicalControl: [
                    {
                        id: 'imidacloprid_potato',
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
                frequency: 'Once',
                quantity: '100-120 kg per hectare'
            },
            {
                type: 'Urea',
                composition: '46% Nitrogen',
                application: 'Top dressing',
                frequency: '30 and 50 DAS',
                quantity: '80-100 kg per hectare'
            }
        ],
        steps: [
            {
                id: 'seed_treatment_potato',
                title: 'Seed Treatment and Cutting',
                description: 'Treat and cut seed tubers for planting',
                duration: '7-10 days',
                requirements: ['Quality seed tubers', 'Fungicides', 'Sharp knife'],
                tips: ['Use certified seeds', 'Cut tubers 2-3 days before planting', 'Treat with fungicides'],
                warnings: ['Avoid damaged tubers', 'Don\'t cut too small pieces', 'Allow cut surfaces to dry']
            },
            {
                id: 'ridge_making',
                title: 'Ridge Making and Planting',
                description: 'Prepare ridges and plant seed pieces',
                duration: '5-7 days',
                requirements: ['Ridger', 'Seed tubers', 'Fertilizers'],
                tips: ['Make 60-75 cm spaced ridges', 'Plant at 15-20 cm depth', 'Apply basal fertilizers'],
                warnings: ['Ensure proper depth', 'Don\'t plant in wet soil', 'Maintain proper spacing']
            },
            {
                id: 'earthing_up_potato',
                title: 'Irrigation and Earthing Up',
                description: 'Maintain moisture and earth up plants',
                duration: 'Throughout season',
                requirements: ['Irrigation system', 'Labor for earthing'],
                tips: ['First irrigation immediately after planting', 'Earth up at 30-40 DAS', 'Irrigate every 7-10 days'],
                warnings: ['Avoid waterlogging', 'Don\'t earth up too early', 'Monitor for diseases']
            },
            {
                id: 'pest_control_potato',
                title: 'Pest and Disease Management',
                description: 'Regular monitoring and control measures',
                duration: 'Throughout season',
                requirements: ['Pesticides', 'Monitoring tools'],
                tips: ['Regular field visits', 'Use recommended pesticides', 'Follow IPM practices'],
                warnings: ['Use PPE', 'Follow safety precautions', 'Respect waiting periods']
            },
            {
                id: 'harvesting_potato',
                title: 'Harvesting and Storage',
                description: 'Harvest mature tubers and store properly',
                duration: '7-10 days',
                requirements: ['Labor', 'Storage facility'],
                tips: ['Harvest when haulms dry', 'Handle tubers gently', 'Cure tubers before storage'],
                warnings: ['Avoid bruising tubers', 'Don\'t harvest when wet', 'Ensure proper curing']
            }
        ],
        images: ['🥔']
    },
    {
        id: 'onion',
        name: 'Onion',
        scientificName: 'Allium cepa',
        category: 'Vegetable',
        description: 'Popular bulb vegetable used worldwide for cooking. Rich in antioxidants and medicinal properties.',
        growingSeason: {
            planting: 'October-November (Rabi)',
            harvesting: 'March-April',
            duration: '120-150 days'
        },
        climate: {
            temperature: { min: 15, max: 30, optimal: 22 },
            humidity: { min: 50, max: 70, optimal: 60 },
            rainfall: { min: 400, max: 600, optimal: 500 }
        },
        soil: {
            type: 'Well-drained fertile soil',
            ph: { min: 6.0, max: 7.0, optimal: 6.5 },
            nutrients: ['Nitrogen', 'Phosphorus', 'Potassium', 'Sulfur']
        },
        watering: {
            frequency: 'Every 7-10 days',
            amount: '4-6 cm per irrigation',
            method: 'Furrow irrigation'
        },
        diseases: [
            {
                id: 'purple_blotch',
                name: 'Purple Blotch',
                symptoms: ['Purple blotches on leaves', 'White fungal growth', 'Leaf drying'],
                causes: ['High humidity', 'Fungal infection', 'Poor air circulation'],
                prevention: ['Proper spacing', 'Avoid overhead irrigation', 'Fungicide application'],
                treatment: [
                    {
                        method: 'chemical',
                        products: [
                            {
                                id: 'propiconazole_onion',
                                name: 'Propiconazole 25% EC',
                                type: 'fungicide',
                                activeIngredient: 'Propiconazole',
                                concentration: '25%',
                                application: 'Foliar spray',
                                dosage: '1ml per liter of water',
                                price: 720,
                                availability: 'available',
                                safety: 'medium',
                                environmental: 'moderate'
                            }
                        ],
                        instructions: 'Apply at first sign of disease',
                        timing: 'Repeat every 10-15 days if needed'
                    }
                ],
                severity: 'high'
            }
        ],
        pests: [
            {
                id: 'thrips_onion',
                name: 'Onion Thrips',
                type: 'insect',
                symptoms: ['Silver streaks on leaves', 'Black fecal spots', 'Leaf curling'],
                damage: ['Reduced bulb size', 'Poor quality', 'Yield loss up to 30%'],
                naturalControl: ['Predatory mites', 'Minute pirate bugs'],
                chemicalControl: [
                    {
                        id: 'spinosad_onion',
                        name: 'Spinosad 45% SC',
                        type: 'insecticide',
                        activeIngredient: 'Spinosad',
                        concentration: '45%',
                        application: 'Foliar spray',
                        dosage: '0.5ml per liter of water',
                        price: 650,
                        availability: 'available',
                        safety: 'low',
                        environmental: 'eco_friendly'
                    }
                ]
            }
        ],
        fertilizers: [
            {
                type: 'NPK 15-15-15',
                composition: '15% Nitrogen, 15% Phosphorus, 15% Potassium',
                application: 'Basal application',
                frequency: 'Once',
                quantity: '80-100 kg per hectare'
            },
            {
                type: 'Urea',
                composition: '46% Nitrogen',
                application: 'Top dressing',
                frequency: '30 and 60 DAS',
                quantity: '60-80 kg per hectare'
            }
        ],
        steps: [
            {
                id: 'seed_treatment_onion',
                title: 'Seed Treatment and Nursery',
                description: 'Treat seeds and raise nursery seedlings',
                duration: '15-20 days',
                requirements: ['Quality seeds', 'Nursery beds', 'Fertilizers'],
                tips: ['Use treated seeds', 'Maintain proper moisture', 'Protect from pests'],
                warnings: ['Avoid overwatering', 'Protect from direct sun', 'Watch for damping off']
            },
            {
                id: 'transplanting_onion',
                title: 'Transplanting',
                description: 'Transplant seedlings to main field',
                duration: '5-7 days',
                requirements: ['Healthy seedlings', 'Prepared field', 'Water'],
                tips: ['Transplant at 4-5 leaf stage', 'Maintain 10-15 cm spacing', 'Water immediately after transplanting'],
                warnings: ['Don\'t transplant in hot sun', 'Handle seedlings carefully', 'Ensure proper root establishment']
            },
            {
                id: 'irrigation_onion',
                title: 'Irrigation and Weed Control',
                description: 'Maintain moisture and control weeds',
                duration: 'Throughout season',
                requirements: ['Irrigation system', 'Weedicides'],
                tips: ['Irrigate every 7-10 days', 'Apply weedicides at 20-25 DAS', 'Monitor soil moisture'],
                warnings: ['Avoid water stress', 'Don\'t over-irrigate', 'Follow herbicide guidelines']
            },
            {
                id: 'nutrition_onion',
                title: 'Nutrition and Pest Management',
                description: 'Apply fertilizers and manage pests',
                duration: 'Throughout season',
                requirements: ['Fertilizers', 'Pesticides'],
                tips: ['Apply fertilizers as scheduled', 'Monitor for pests regularly', 'Use recommended pesticides'],
                warnings: ['Don\'t apply fertilizers during bulb formation', 'Use PPE', 'Follow safety precautions']
            },
            {
                id: 'harvesting_onion',
                title: 'Harvesting and Curing',
                description: 'Harvest mature bulbs and cure properly',
                duration: '7-10 days',
                requirements: ['Labor', 'Curing area'],
                tips: ['Harvest when 50% tops fall', 'Cure in shade for 7-10 days', 'Store in cool dry place'],
                warnings: ['Don\'t harvest when wet', 'Avoid bruising bulbs', 'Ensure proper curing']
            }
        ],
        images: ['🧅']
    },
    {
        id: 'chickpea',
        name: 'Chickpea (Chana)',
        scientificName: 'Cicer arietinum',
        category: 'Pulse',
        description: 'Important pulse crop, rich in protein and carbohydrates. Major source of dietary protein in India.',
        growingSeason: {
            planting: 'October-November (Rabi)',
            harvesting: 'March-April',
            duration: '90-110 days'
        },
        climate: {
            temperature: { min: 15, max: 30, optimal: 22 },
            humidity: { min: 40, max: 60, optimal: 50 },
            rainfall: { min: 400, max: 600, optimal: 500 }
        },
        soil: {
            type: 'Well-drained sandy loam soil',
            ph: { min: 6.0, max: 8.0, optimal: 7.0 },
            nutrients: ['Nitrogen', 'Phosphorus', 'Potassium', 'Molybdenum']
        },
        watering: {
            frequency: '4-5 irrigations',
            amount: '5-6 cm per irrigation',
            method: 'Drip or sprinkler irrigation'
        },
        diseases: [
            {
                id: 'fusarium_wilt_chickpea',
                name: 'Fusarium Wilt',
                symptoms: ['Yellowing of leaves', 'Brown vascular discoloration', 'Plant wilting'],
                causes: ['Soil-borne fungus', 'Poor drainage', 'Infected seeds'],
                prevention: ['Use resistant varieties', 'Crop rotation', 'Soil sterilization'],
                treatment: [
                    {
                        method: 'chemical',
                        products: [
                            {
                                id: 'carbendazim_chickpea',
                                name: 'Carbendazim 50% WP',
                                type: 'fungicide',
                                activeIngredient: 'Carbendazim',
                                concentration: '50%',
                                application: 'Seed treatment',
                                dosage: '2g per kg of seeds',
                                price: 320,
                                availability: 'available',
                                safety: 'medium',
                                environmental: 'moderate'
                            }
                        ],
                        instructions: 'Treat seeds before sowing',
                        timing: 'Before planting'
                    }
                ],
                severity: 'high'
            }
        ],
        pests: [
            {
                id: 'pod_borer_chickpea',
                name: 'Pod Borer',
                type: 'insect',
                symptoms: ['Holes in pods', 'Larvae inside pods', 'Damaged grains'],
                damage: ['Yield loss up to 40%', 'Poor grain quality', 'Economic losses'],
                naturalControl: ['Parasitic wasps', 'Predatory bugs'],
                chemicalControl: [
                    {
                        id: 'quinalphos_chickpea',
                        name: 'Quinalphos 25% EC',
                        type: 'insecticide',
                        activeIngredient: 'Quinalphos',
                        concentration: '25%',
                        application: 'Foliar spray',
                        dosage: '2ml per liter of water',
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
                application: 'Basal application',
                frequency: 'Once',
                quantity: '60-80 kg per hectare'
            },
            {
                type: 'Urea',
                composition: '46% Nitrogen',
                application: 'Split application',
                frequency: '30 and 50 DAS',
                quantity: '40-50 kg per hectare'
            }
        ],
        steps: [
            {
                id: 'seed_treatment_chickpea',
                title: 'Seed Treatment and Sowing',
                description: 'Treat seeds and sow in prepared field',
                duration: '7-10 days',
                requirements: ['Quality seeds', 'Seed treatment chemicals', 'Seed drill'],
                tips: ['Treat with fungicides', 'Sow at 5-6 cm depth', 'Maintain 30-45 cm row spacing'],
                warnings: ['Use certified seeds', 'Don\'t sow in wet soil', 'Avoid deep sowing']
            },
            {
                id: 'irrigation_chickpea',
                title: 'Irrigation and Weed Management',
                description: 'Maintain moisture and control weeds',
                duration: 'Throughout season',
                requirements: ['Irrigation system', 'Weedicides'],
                tips: ['First irrigation at 20-25 DAS', 'Apply weedicides at 15-20 DAS', 'Irrigate at critical stages'],
                warnings: ['Avoid waterlogging', 'Don\'t irrigate during pod filling', 'Follow herbicide guidelines']
            },
            {
                id: 'pest_management_chickpea',
                title: 'Pest and Disease Management',
                description: 'Monitor and control pests and diseases',
                duration: 'Throughout season',
                requirements: ['Pesticides', 'Monitoring tools'],
                tips: ['Regular field scouting', 'Use economic thresholds', 'Apply pesticides at recommended times'],
                warnings: ['Use PPE', 'Follow label instructions', 'Respect waiting periods']
            },
            {
                id: 'harvesting_chickpea',
                title: 'Harvesting and Threshing',
                description: 'Harvest mature pods and thresh grains',
                duration: '7-10 days',
                requirements: ['Harvester', 'Threshing equipment'],
                tips: ['Harvest when 80% pods mature', 'Thresh immediately after harvest', 'Dry grains to 12% moisture'],
                warnings: ['Don\'t harvest when wet', 'Prevent grain damage', 'Ensure proper drying']
            }
        ],
        images: ['🫘']
    },
    {
        id: 'groundnut',
        name: 'Groundnut (Peanut)',
        scientificName: 'Arachis hypogaea',
        category: 'Oilseed',
        description: 'Major oilseed crop, important source of edible oil and protein. Also known as peanut.',
        growingSeason: {
            planting: 'June-July (Kharif)',
            harvesting: 'October-November',
            duration: '100-120 days'
        },
        climate: {
            temperature: { min: 20, max: 35, optimal: 28 },
            humidity: { min: 50, max: 70, optimal: 60 },
            rainfall: { min: 500, max: 1000, optimal: 750 }
        },
        soil: {
            type: 'Well-drained sandy loam soil',
            ph: { min: 6.0, max: 7.5, optimal: 6.5 },
            nutrients: ['Nitrogen', 'Phosphorus', 'Potassium', 'Calcium']
        },
        watering: {
            frequency: 'Every 10-12 days',
            amount: '5-6 cm per irrigation',
            method: 'Drip irrigation preferred'
        },
        diseases: [
            {
                id: 'tkv_groundnut',
                name: 'TKV Disease',
                symptoms: ['Yellow spots on leaves', 'Brown lesions', 'Defoliation'],
                causes: ['Fungal infection', 'High humidity', 'Poor air circulation'],
                prevention: ['Use resistant varieties', 'Proper spacing', 'Fungicide application'],
                treatment: [
                    {
                        method: 'chemical',
                        products: [
                            {
                                id: 'tebuconazole_groundnut',
                                name: 'Tebuconazole 25.9% EC',
                                type: 'fungicide',
                                activeIngredient: 'Tebuconazole',
                                concentration: '25.9%',
                                application: 'Foliar spray',
                                dosage: '1ml per liter of water',
                                price: 850,
                                availability: 'available',
                                safety: 'medium',
                                environmental: 'moderate'
                            }
                        ],
                        instructions: 'Apply at first sign of disease',
                        timing: 'Repeat every 15 days if needed'
                    }
                ],
                severity: 'high'
            }
        ],
        pests: [
            {
                id: 'aphid_groundnut',
                name: 'Groundnut Aphid',
                type: 'insect',
                symptoms: ['Yellowing leaves', 'Sticky honeydew', 'Sooty mold'],
                damage: ['Reduced pod yield', 'Poor oil quality', 'Virus transmission'],
                naturalControl: ['Ladybird beetles', 'Hoverflies', 'Parasitic wasps'],
                chemicalControl: [
                    {
                        id: 'imidacloprid_groundnut',
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
                type: 'SSP',
                composition: '16% Phosphorus',
                application: 'Basal application',
                frequency: 'Once',
                quantity: '200-250 kg per hectare'
            },
            {
                type: 'Urea',
                composition: '46% Nitrogen',
                application: 'Split application',
                frequency: '25 and 45 DAS',
                quantity: '60-80 kg per hectare'
            }
        ],
        steps: [
            {
                id: 'seed_treatment_groundnut',
                title: 'Seed Treatment and Sowing',
                description: 'Treat seeds and sow in prepared field',
                duration: '7-10 days',
                requirements: ['Quality seeds', 'Seed treatment chemicals', 'Seed drill'],
                tips: ['Treat with fungicides and insecticides', 'Sow at 5-6 cm depth', 'Maintain 30-45 cm spacing'],
                warnings: ['Use certified seeds', 'Don\'t sow in wet soil', 'Avoid saline soils']
            },
            {
                id: 'irrigation_groundnut',
                title: 'Irrigation and Weed Control',
                description: 'Maintain moisture and control weeds',
                duration: 'Throughout season',
                requirements: ['Irrigation system', 'Weedicides'],
                tips: ['First irrigation at 15-20 DAS', 'Apply weedicides at 15-20 DAS', 'Irrigate every 10-12 days'],
                warnings: ['Avoid waterlogging', 'Don\'t irrigate during pod development', 'Follow herbicide guidelines']
            },
            {
                id: 'pest_control_groundnut',
                title: 'Pest and Disease Management',
                description: 'Regular monitoring and control measures',
                duration: 'Throughout season',
                requirements: ['Pesticides', 'Monitoring tools'],
                tips: ['Regular field visits', 'Use pheromone traps', 'Apply pesticides at recommended times'],
                warnings: ['Use PPE', 'Follow safety precautions', 'Respect waiting periods']
            },
            {
                id: 'harvesting_groundnut',
                title: 'Harvesting and Drying',
                description: 'Harvest mature pods and dry properly',
                duration: '7-10 days',
                requirements: ['Labor', 'Drying yard'],
                tips: ['Harvest when 70-80% pods mature', 'Dry pods to 8-10% moisture', 'Store in cool dry place'],
                warnings: ['Don\'t harvest when wet', 'Avoid pod damage', 'Ensure proper drying']
            }
        ],
        images: ['🥜']
    },
    {
        id: 'mango',
        name: 'Mango',
        scientificName: 'Mangifera indica',
        category: 'Fruit',
        description: 'King of fruits, most important fruit crop in India. Rich in vitamins and minerals.',
        growingSeason: {
            planting: 'June-July (Monsoon)',
            harvesting: 'April-June (next year)',
            duration: '5-8 years to first fruiting'
        },
        climate: {
            temperature: { min: 20, max: 35, optimal: 27 },
            humidity: { min: 50, max: 80, optimal: 65 },
            rainfall: { min: 750, max: 2500, optimal: 1500 }
        },
        soil: {
            type: 'Deep, well-drained alluvial soil',
            ph: { min: 5.5, max: 7.5, optimal: 6.5 },
            nutrients: ['Nitrogen', 'Phosphorus', 'Potassium', 'Zinc']
        },
        watering: {
            frequency: 'Every 7-10 days',
            amount: '8-10 cm per irrigation',
            method: 'Drip irrigation preferred'
        },
        diseases: [
            {
                id: 'powdery_mildew_mango',
                name: 'Powdery Mildew',
                symptoms: ['White powdery coating on leaves', 'Leaf curling', 'Reduced fruit size'],
                causes: ['Fungal infection', 'High humidity', 'Poor air circulation'],
                prevention: ['Proper pruning', 'Good air circulation', 'Fungicide application'],
                treatment: [
                    {
                        method: 'chemical',
                        products: [
                            {
                                id: 'sulfur_mango',
                                name: 'Sulfur 80% WDG',
                                type: 'fungicide',
                                activeIngredient: 'Sulfur',
                                concentration: '80%',
                                application: 'Foliar spray',
                                dosage: '2g per liter of water',
                                price: 280,
                                availability: 'available',
                                safety: 'low',
                                environmental: 'eco_friendly'
                            }
                        ],
                        instructions: 'Apply during flowering and fruit development',
                        timing: 'Repeat every 15-20 days'
                    }
                ],
                severity: 'medium'
            }
        ],
        pests: [
            {
                id: 'fruit_fly_mango',
                name: 'Mango Fruit Fly',
                type: 'insect',
                symptoms: ['Sting marks on fruits', 'Larvae inside fruits', 'Fruit dropping'],
                damage: ['Yield loss up to 50%', 'Poor fruit quality', 'Export rejection'],
                naturalControl: ['Parasitic wasps', 'Predatory insects'],
                chemicalControl: [
                    {
                        id: 'malathion_mango',
                        name: 'Malathion 50% EC',
                        type: 'insecticide',
                        activeIngredient: 'Malathion',
                        concentration: '50%',
                        application: 'Foliar spray',
                        dosage: '1.5ml per liter of water',
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
                type: 'NPK 19-19-19',
                composition: '19% Nitrogen, 19% Phosphorus, 19% Potassium',
                application: 'Basal application',
                frequency: 'Once',
                quantity: '200-300 kg per hectare'
            },
            {
                type: 'Urea',
                composition: '46% Nitrogen',
                application: 'Split application',
                frequency: 'March, June, September',
                quantity: '150-200 kg per hectare'
            }
        ],
        steps: [
            {
                id: 'grafting_mango',
                title: 'Propagation and Planting',
                description: 'Graft or bud superior varieties and plant',
                duration: '30-45 days',
                requirements: ['Quality grafts', 'Prepared pits', 'Staking materials'],
                tips: ['Use stone grafting', 'Plant in 1m x 1m pits', 'Provide staking support'],
                warnings: ['Use healthy grafts', 'Avoid waterlogged areas', 'Protect from wind']
            },
            {
                id: 'training_mango',
                title: 'Training and Pruning',
                description: 'Train young plants and prune mature trees',
                duration: 'Throughout year',
                requirements: ['Pruning tools', 'Growth regulators'],
                tips: ['Train to open center system', 'Prune during February-March', 'Remove water sprouts'],
                warnings: ['Don\'t prune during flowering', 'Avoid heavy pruning', 'Use sharp tools']
            },
            {
                id: 'irrigation_mango',
                title: 'Irrigation and Nutrition',
                description: 'Maintain moisture and provide nutrients',
                duration: 'Throughout year',
                requirements: ['Irrigation system', 'Fertilizers'],
                tips: ['Irrigate every 7-10 days', 'Apply fertilizers as scheduled', 'Use mulch to conserve moisture'],
                warnings: ['Avoid water stress', 'Don\'t over-fertilize', 'Monitor nutrient deficiencies']
            },
            {
                id: 'pest_management_mango',
                title: 'Pest and Disease Management',
                description: 'Regular monitoring and control measures',
                duration: 'Throughout year',
                requirements: ['Pesticides', 'Monitoring tools'],
                tips: ['Regular orchard visits', 'Use pheromone traps', 'Apply pesticides at recommended times'],
                warnings: ['Use PPE', 'Follow safety precautions', 'Respect waiting periods']
            },
            {
                id: 'harvesting_mango',
                title: 'Harvesting and Post-Harvest',
                description: 'Harvest mature fruits and handle properly',
                duration: '30-45 days',
                requirements: ['Harvesting tools', 'Storage facility'],
                tips: ['Harvest when fruits are mature', 'Handle fruits gently', 'Pre-cool immediately after harvest'],
                warnings: ['Don\'t harvest immature fruits', 'Avoid bruising', 'Ensure proper storage']
            }
        ],
        images: ['🥭']
    },
    {
        id: 'chili',
        name: 'Chili (Chilli)',
        scientificName: 'Capsicum annuum',
        category: 'Spice',
        description: 'Important spice crop, major source of capsaicin. Used in cooking and medicine worldwide.',
        growingSeason: {
            planting: 'February-March (Spring) or June-July (Monsoon)',
            harvesting: 'May-June or October-November',
            duration: '120-150 days'
        },
        climate: {
            temperature: { min: 20, max: 35, optimal: 28 },
            humidity: { min: 60, max: 80, optimal: 70 },
            rainfall: { min: 600, max: 1000, optimal: 800 }
        },
        soil: {
            type: 'Well-drained fertile soil',
            ph: { min: 6.0, max: 7.0, optimal: 6.5 },
            nutrients: ['Nitrogen', 'Phosphorus', 'Potassium', 'Calcium']
        },
        watering: {
            frequency: 'Every 4-6 days',
            amount: '4-5 cm per irrigation',
            method: 'Drip irrigation preferred'
        },
        diseases: [
            {
                id: 'fruit_rot_chili',
                name: 'Fruit Rot',
                symptoms: ['Dark lesions on fruits', 'Fruit softening', 'White fungal growth'],
                causes: ['High humidity', 'Fungal infection', 'Poor air circulation'],
                prevention: ['Proper spacing', 'Avoid overhead irrigation', 'Fungicide application'],
                treatment: [
                    {
                        method: 'chemical',
                        products: [
                            {
                                id: 'mancozeb_chili',
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
                        instructions: 'Apply every 10-15 days',
                        timing: 'At first sign of disease'
                    }
                ],
                severity: 'high'
            }
        ],
        pests: [
            {
                id: 'aphid_chili',
                name: 'Chili Aphid',
                type: 'insect',
                symptoms: ['Yellowing leaves', 'Sticky honeydew', 'Leaf curling'],
                damage: ['Reduced fruit size', 'Poor quality', 'Yield loss up to 40%'],
                naturalControl: ['Ladybird beetles', 'Hoverflies', 'Parasitic wasps'],
                chemicalControl: [
                    {
                        id: 'acetamiprid_chili',
                        name: 'Acetamiprid 20% SP',
                        type: 'insecticide',
                        activeIngredient: 'Acetamiprid',
                        concentration: '20%',
                        application: 'Foliar spray',
                        dosage: '0.2g per liter of water',
                        price: 720,
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
                frequency: 'Once',
                quantity: '80-100 kg per hectare'
            },
            {
                type: 'Urea',
                composition: '46% Nitrogen',
                application: 'Top dressing',
                frequency: '30 and 50 DAS',
                quantity: '60-80 kg per hectare'
            }
        ],
        steps: [
            {
                id: 'seed_treatment_chili',
                title: 'Seed Treatment and Nursery',
                description: 'Treat seeds and raise nursery seedlings',
                duration: '15-20 days',
                requirements: ['Quality seeds', 'Nursery beds', 'Seed treatment chemicals'],
                tips: ['Treat seeds with fungicides', 'Maintain proper temperature', 'Protect from pests'],
                warnings: ['Avoid overwatering', 'Protect from direct sun', 'Watch for damping off']
            },
            {
                id: 'transplanting_chili',
                title: 'Transplanting',
                description: 'Transplant seedlings to main field',
                duration: '5-7 days',
                requirements: ['Healthy seedlings', 'Prepared field', 'Water'],
                tips: ['Transplant at 4-5 leaf stage', 'Maintain 45-60 cm spacing', 'Water immediately after transplanting'],
                warnings: ['Don\'t transplant in hot sun', 'Handle seedlings carefully', 'Ensure proper root establishment']
            },
            {
                id: 'irrigation_chili',
                title: 'Irrigation and Weed Control',
                description: 'Maintain moisture and control weeds',
                duration: 'Throughout season',
                requirements: ['Irrigation system', 'Weedicides'],
                tips: ['Irrigate every 4-6 days', 'Apply weedicides at 20-25 DAS', 'Monitor soil moisture'],
                warnings: ['Avoid water stress', 'Don\'t over-irrigate', 'Follow herbicide guidelines']
            },
            {
                id: 'pest_management_chili',
                title: 'Pest and Disease Management',
                description: 'Regular monitoring and control measures',
                duration: 'Throughout season',
                requirements: ['Pesticides', 'Monitoring tools'],
                tips: ['Regular field visits', 'Use yellow sticky traps', 'Apply pesticides at recommended times'],
                warnings: ['Use PPE', 'Follow safety precautions', 'Respect waiting periods']
            },
            {
                id: 'harvesting_chili',
                title: 'Harvesting and Drying',
                description: 'Harvest mature fruits and dry properly',
                duration: '15-20 days',
                requirements: ['Labor', 'Drying racks'],
                tips: ['Harvest when fruits are red/ripe', 'Dry in shade', 'Store in cool dry place'],
                warnings: ['Don\'t harvest when wet', 'Avoid bruising fruits', 'Ensure proper drying']
            }
        ],
        images: ['🌶️']
    },
    {
        id: 'coffee',
        name: 'Coffee',
        scientificName: 'Coffea arabica',
        category: 'Cash Crop',
        description: 'Major cash crop, important beverage crop. Grown in hilly regions of South India.',
        growingSeason: {
            planting: 'October-November (Post-monsoon)',
            harvesting: 'December-March (next year)',
            duration: '3-4 years to first harvest'
        },
        climate: {
            temperature: { min: 15, max: 28, optimal: 22 },
            humidity: { min: 60, max: 80, optimal: 70 },
            rainfall: { min: 1500, max: 2500, optimal: 2000 }
        },
        soil: {
            type: 'Well-drained red loamy soil',
            ph: { min: 5.5, max: 6.5, optimal: 6.0 },
            nutrients: ['Nitrogen', 'Phosphorus', 'Potassium', 'Organic matter']
        },
        watering: {
            frequency: 'Every 3-4 days',
            amount: '3-4 cm per irrigation',
            method: 'Drip irrigation preferred'
        },
        diseases: [
            {
                id: 'coffee_rust',
                name: 'Coffee Rust',
                symptoms: ['Orange-yellow powdery spots on leaves', 'Leaf yellowing', 'Defoliation'],
                causes: ['Fungal infection', 'High humidity', 'Poor air circulation'],
                prevention: ['Use resistant varieties', 'Proper spacing', 'Fungicide application'],
                treatment: [
                    {
                        method: 'chemical',
                        products: [
                            {
                                id: 'copper_oxychloride_coffee',
                                name: 'Copper Oxychloride 50% WP',
                                type: 'fungicide',
                                activeIngredient: 'Copper Oxychloride',
                                concentration: '50%',
                                application: 'Foliar spray',
                                dosage: '3g per liter of water',
                                price: 380,
                                availability: 'available',
                                safety: 'medium',
                                environmental: 'moderate'
                            }
                        ],
                        instructions: 'Apply during pre-monsoon period',
                        timing: 'March-April'
                    }
                ],
                severity: 'high'
            }
        ],
        pests: [
            {
                id: 'coffee_berry_borer',
                name: 'Coffee Berry Borer',
                type: 'insect',
                symptoms: ['Holes in berries', 'Brown powder around holes', 'Berry damage'],
                damage: ['Yield loss up to 30%', 'Poor bean quality', 'Economic losses'],
                naturalControl: ['Parasitic wasps', 'Predatory insects'],
                chemicalControl: [
                    {
                        id: 'endosulfan_coffee',
                        name: 'Endosulfan 35% EC',
                        type: 'insecticide',
                        activeIngredient: 'Endosulfan',
                        concentration: '35%',
                        application: 'Foliar spray',
                        dosage: '1.5ml per liter of water',
                        price: 520,
                        availability: 'available',
                        safety: 'medium',
                        environmental: 'harmful'
                    }
                ]
            }
        ],
        fertilizers: [
            {
                type: 'Coffee Special',
                composition: '18% Nitrogen, 12% Phosphorus, 18% Potassium',
                application: 'Basal application',
                frequency: 'Once',
                quantity: '200-250 kg per hectare'
            },
            {
                type: 'Urea',
                composition: '46% Nitrogen',
                application: 'Split application',
                frequency: 'March, June, September',
                quantity: '100-150 kg per hectare'
            }
        ],
        steps: [
            {
                id: 'seed_preparation_coffee',
                title: 'Seed Preparation and Nursery',
                description: 'Prepare seeds and raise nursery seedlings',
                duration: '6-9 months',
                requirements: ['Quality seeds', 'Nursery beds', 'Shade nets'],
                tips: ['Use fresh seeds', 'Maintain 50-60% shade', 'Water regularly'],
                warnings: ['Avoid direct sunlight', 'Protect from pests', 'Maintain proper moisture']
            },
            {
                id: 'planting_coffee',
                title: 'Planting and Training',
                description: 'Plant seedlings and train young plants',
                duration: '30-45 days',
                requirements: ['Healthy seedlings', 'Prepared pits', 'Staking materials'],
                tips: ['Plant at 2.5m x 2.5m spacing', 'Provide shade for first 2-3 years', 'Mulch around plants'],
                warnings: ['Don\'t plant in waterlogged areas', 'Avoid windy locations', 'Protect from frost']
            },
            {
                id: 'irrigation_coffee',
                title: 'Irrigation and Nutrition',
                description: 'Maintain moisture and provide nutrients',
                duration: 'Throughout year',
                requirements: ['Irrigation system', 'Fertilizers'],
                tips: ['Irrigate during dry periods', 'Apply fertilizers as scheduled', 'Use organic mulches'],
                warnings: ['Avoid waterlogging', 'Don\'t over-fertilize', 'Monitor nutrient deficiencies']
            },
            {
                id: 'pest_management_coffee',
                title: 'Pest and Disease Management',
                description: 'Regular monitoring and control measures',
                duration: 'Throughout year',
                requirements: ['Pesticides', 'Monitoring tools'],
                tips: ['Regular field visits', 'Use pheromone traps', 'Apply pesticides at recommended times'],
                warnings: ['Use PPE', 'Follow safety precautions', 'Respect waiting periods']
            },
            {
                id: 'harvesting_coffee',
                title: 'Harvesting and Processing',
                description: 'Harvest ripe cherries and process beans',
                duration: '3-4 months',
                requirements: ['Labor', 'Processing equipment'],
                tips: ['Harvest when cherries are red', 'Process within 24 hours', 'Dry beans to 12% moisture'],
                warnings: ['Don\'t harvest overripe cherries', 'Avoid fermentation', 'Ensure proper drying']
            }
        ],
        images: ['☕']
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