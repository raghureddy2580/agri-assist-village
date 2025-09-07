interface Product {
    id: number;
    name: string;
    farmer: string;
    price: string;
    quantity: string;
    rating: number;
    image: string;
    category: string;
    quality: string;
    location: {
        city: string;
        area: string;
        lat: number;
        lng: number;
    };
}

const INVENTORY_KEY = 'agri_inventory';

// Initial inventory data
const initialInventory: { [key: number]: number } = {
    1: 500, // Premium Basmati Rice
    2: 200, // Fresh Tomatoes
    3: 1000, // Wheat Flour
    4: 150, // Organic Carrots
    5: 100, // Fresh Spinach
    6: 300, // Red Rice
    7: 250, // Green Peas
    8: 400, // Jasmine Rice
    9: 80, // Cherry Tomatoes
    10: 120, // Roma Tomatoes
    11: 300, // Organic Onions
    12: 400, // Fresh Potatoes
    13: 90, // Bell Peppers
    14: 50, // Fresh Ginger
    15: 75, // Garlic
    16: 350, // Potato
    17: 280, // Onion
    18: 450, // Chickpea
    19: 320, // Groundnut
    20: 180, // Mango
    21: 220, // Chili
    22: 150, // Coffee
};

// Product details for enhanced display
export const productDetails: { [key: number]: any } = {
    1: {
        description: "Long-grain aromatic rice, perfect for biryani and pulao. Grown using traditional farming methods without chemical pesticides.",
        specifications: {
            variety: "Basmati 386",
            grainLength: "8.5mm",
            moisture: "12%",
            shelfLife: "2 years",
            packaging: "5kg vacuum sealed bags"
        },
        harvestDate: "2024-08-15",
        certification: "NPOP Certified Organic"
    },
    2: {
        description: "Vine-ripened tomatoes with rich red color and juicy texture. Perfect for salads, cooking, and making sauces.",
        specifications: {
            variety: "Local Hybrid",
            size: "Medium (80-100g)",
            color: "Deep red",
            shelfLife: "7-10 days",
            packaging: "5kg wooden crates"
        },
        harvestDate: "2024-09-01",
        certification: "Fresh Produce Certified"
    },
    3: {
        description: "Finely milled whole wheat flour, ideal for making chapatis, parathas, and traditional Indian breads.",
        specifications: {
            type: "Whole Wheat",
            protein: "12.5%",
            moisture: "10%",
            shelfLife: "6 months",
            packaging: "1kg, 5kg, 10kg bags"
        },
        harvestDate: "2024-07-20",
        certification: "FSSAI Approved"
    },
    4: {
        description: "Sweet and crunchy organic carrots grown without synthetic pesticides. Rich in beta-carotene and nutrients.",
        specifications: {
            variety: "Nantes",
            size: "Medium (15-18cm)",
            color: "Orange",
            shelfLife: "14 days",
            packaging: "2kg mesh bags"
        },
        harvestDate: "2024-08-25",
        certification: "NPOP Organic Certified"
    },
    5: {
        description: "Tender green spinach leaves, harvested fresh daily. Excellent source of iron, vitamins, and minerals.",
        specifications: {
            variety: "Palak",
            leafSize: "Medium",
            color: "Deep green",
            shelfLife: "3-4 days",
            packaging: "500g bunches"
        },
        harvestDate: "2024-09-05",
        certification: "Fresh Produce Certified"
    },
    6: {
        description: "Nutritious red rice with high fiber content and nutty flavor. Rich in antioxidants and minerals.",
        specifications: {
            variety: "Kerala Red",
            grainLength: "6mm",
            color: "Red-brown",
            shelfLife: "18 months",
            packaging: "2kg vacuum packs"
        },
        harvestDate: "2024-08-10",
        certification: "Organic & Natural"
    },
    7: {
        description: "Sweet and tender green peas, perfect for cooking curries, soups, or eating fresh from the pod.",
        specifications: {
            variety: "Sweet Peas",
            size: "Small to medium",
            color: "Bright green",
            shelfLife: "5-7 days",
            packaging: "1kg plastic bags"
        },
        harvestDate: "2024-09-03",
        certification: "Fresh Produce Certified"
    },
    8: {
        description: "Fragrant long-grain rice with delicate aroma. Perfect for Asian cuisine and special occasions.",
        specifications: {
            variety: "Thai Jasmine",
            grainLength: "8mm",
            fragrance: "High",
            shelfLife: "24 months",
            packaging: "5kg premium bags"
        },
        harvestDate: "2024-08-20",
        certification: "Premium Quality Certified"
    },
    9: {
        description: "Sweet and juicy cherry tomatoes, perfect for salads, snacking, or garnishing. Grown in controlled greenhouse environment.",
        specifications: {
            variety: "Sweet 100",
            size: "Small (15-20g)",
            color: "Bright red",
            shelfLife: "10-12 days",
            packaging: "250g punnet boxes"
        },
        harvestDate: "2024-09-02",
        certification: "Premium Quality Certified"
    },
    10: {
        description: "Oval-shaped tomatoes ideal for cooking sauces, pastes, and canning. Firm texture with fewer seeds.",
        specifications: {
            variety: "Roma VF",
            size: "Medium (100-120g)",
            shape: "Oval",
            shelfLife: "8-10 days",
            packaging: "5kg wooden boxes"
        },
        harvestDate: "2024-09-01",
        certification: "Fresh Produce Certified"
    },
    11: {
        description: "Sweet and pungent organic onions grown without chemical fertilizers. Perfect for cooking and medicinal uses.",
        specifications: {
            variety: "Red Onion",
            size: "Medium (80-100g)",
            color: "Deep red",
            shelfLife: "30-45 days",
            packaging: "10kg mesh bags"
        },
        harvestDate: "2024-08-30",
        certification: "NPOP Organic Certified"
    },
    12: {
        description: "Fresh dug potatoes with smooth skin and firm texture. Excellent for boiling, baking, or frying.",
        specifications: {
            variety: "Kufri Jyoti",
            size: "Medium (100-150g)",
            skin: "Smooth, light brown",
            shelfLife: "20-25 days",
            packaging: "20kg gunny bags"
        },
        harvestDate: "2024-09-04",
        certification: "Fresh Produce Certified"
    },
    13: {
        description: "Crisp and colorful bell peppers, rich in vitamins. Available in red, yellow, and green varieties.",
        specifications: {
            variety: "California Wonder",
            size: "Large (150-200g)",
            colors: "Red, Yellow, Green",
            shelfLife: "10-14 days",
            packaging: "2kg cardboard boxes"
        },
        harvestDate: "2024-09-03",
        certification: "Premium Quality Certified"
    },
    14: {
        description: "Aromatic organic ginger with strong flavor and medicinal properties. Perfect for cooking and health remedies.",
        specifications: {
            variety: "Rio de Janeiro",
            size: "Medium (8-10cm)",
            moisture: "8-10%",
            shelfLife: "6-8 months",
            packaging: "5kg jute bags"
        },
        harvestDate: "2024-08-28",
        certification: "NPOP Organic Certified"
    },
    15: {
        description: "Fresh garlic bulbs with strong aroma and flavor. Excellent for cooking and health benefits.",
        specifications: {
            variety: "G-282",
            bulbSize: "Medium (40-50g)",
            cloves: "10-12 per bulb",
            shelfLife: "8-10 months",
            packaging: "10kg mesh bags"
        },
        harvestDate: "2024-08-25",
        certification: "Fresh Produce Certified"
    },
    16: {
        description: "Fresh dug potatoes with smooth skin and firm texture. Excellent for boiling, baking, or frying.",
        specifications: {
            variety: "Kufri Jyoti",
            size: "Medium (100-150g)",
            skin: "Smooth, light brown",
            shelfLife: "20-25 days",
            packaging: "20kg gunny bags"
        },
        harvestDate: "2024-09-04",
        certification: "Fresh Produce Certified"
    },
    17: {
        description: "Sweet and pungent organic onions grown without chemical fertilizers. Perfect for cooking and medicinal uses.",
        specifications: {
            variety: "Red Onion",
            size: "Medium (80-100g)",
            color: "Deep red",
            shelfLife: "30-45 days",
            packaging: "10kg mesh bags"
        },
        harvestDate: "2024-08-30",
        certification: "NPOP Organic Certified"
    },
    18: {
        description: "Important pulse crop, rich in protein and carbohydrates. Major source of dietary protein in India.",
        specifications: {
            variety: "JG-11",
            protein: "18-20%",
            size: "Medium (8-9mm)",
            color: "Beige",
            shelfLife: "12 months",
            packaging: "50kg jute bags"
        },
        harvestDate: "2024-03-15",
        certification: "FSSAI Approved"
    },
    19: {
        description: "Major oilseed crop, important source of edible oil and protein. Also known as peanut.",
        specifications: {
            variety: "TAG-24",
            oilContent: "45-48%",
            size: "Medium pods",
            shelling: "70-75%",
            shelfLife: "6 months",
            packaging: "50kg jute bags"
        },
        harvestDate: "2024-10-20",
        certification: "FSSAI Approved"
    },
    20: {
        description: "King of fruits, most important fruit crop in India. Rich in vitamins and minerals.",
        specifications: {
            variety: "Alphonso",
            size: "Large (300-400g)",
            color: "Yellow with red blush",
            brix: "18-20%",
            shelfLife: "7-10 days",
            packaging: "5kg wooden crates"
        },
        harvestDate: "2024-05-15",
        certification: "Agmark Certified"
    },
    21: {
        description: "Important spice crop, major source of capsaicin. Used in cooking and medicine worldwide.",
        specifications: {
            variety: "Byadgi",
            length: "8-10cm",
            color: "Deep red",
            capsaicin: "High",
            shelfLife: "6 months",
            packaging: "10kg jute bags"
        },
        harvestDate: "2024-11-10",
        certification: "Spice Board Certified"
    },
    22: {
        description: "Major cash crop, important beverage crop. Grown in hilly regions of South India.",
        specifications: {
            variety: "Coffea arabica",
            beanSize: "Medium",
            caffeine: "1.2-1.5%",
            moisture: "10-12%",
            shelfLife: "12 months",
            packaging: "60kg jute bags"
        },
        harvestDate: "2024-12-20",
        certification: "Coffee Board Certified"
    }
};

// Get current inventory from localStorage
export const getInventory = (): { [key: number]: number } => {
    const stored = localStorage.getItem(INVENTORY_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    // Initialize with default values
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(initialInventory));
    return { ...initialInventory };
};

// Update inventory for a specific product
export const updateInventory = (productId: number, newQuantity: number): void => {
    const inventory = getInventory();
    inventory[productId] = Math.max(0, newQuantity);
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
};

// Reduce inventory when an order is placed
export const reduceInventory = (productId: number, quantity: number): boolean => {
    const inventory = getInventory();
    const currentQuantity = inventory[productId] || 0;

    if (currentQuantity >= quantity) {
        inventory[productId] = currentQuantity - quantity;
        localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
        return true;
    }
    return false; // Insufficient inventory
};

// Get available quantity for a product
export const getAvailableQuantity = (productId: number): number => {
    const inventory = getInventory();
    return inventory[productId] || 0;
};

// Reset inventory to initial values
export const resetInventory = (): void => {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(initialInventory));
};