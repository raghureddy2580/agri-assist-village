export interface ProduceListing {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    cropId: string;
    cropName: string;
    quantity: number;
    unit: string;
    pricePerUnit: number;
    totalPrice: number;
    quality: string;
    harvestDate: string;
    description: string;
    images: string[];
    availableUntil: string;
    deliveryAvailable: boolean;
    negotiable: boolean;
    organic: boolean;
    village: string;
    district: string;
    state: string;
    createdAt: string;
    status: 'active' | 'sold' | 'expired';
}

const STORAGE_KEY = 'agri_assist_produce_listings';

/**
 * Save a new produce listing to localStorage
 */
export const saveProduceListing = (listingData: Omit<ProduceListing, 'id' | 'createdAt' | 'status' | 'totalPrice'>) => {
    const totalPrice = listingData.quantity * listingData.pricePerUnit;

    const produceListing: ProduceListing = {
        ...listingData,
        id: generateListingId(),
        totalPrice,
        createdAt: new Date().toISOString(),
        status: 'active',
    };

    const existingListings = getAllProduceListings();
    const updatedListings = [...existingListings, produceListing];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedListings));

    // Log to console for developer visibility only
    console.group('🌾 New Produce Listing Added');
    console.log('Listing ID:', produceListing.id);
    console.log('Listed by:', produceListing.userName, `(${produceListing.userEmail})`);
    console.log('Crop:', produceListing.cropName);
    console.log('Location:', `${produceListing.village}, ${produceListing.district}, ${produceListing.state}`);
    console.log('Quantity:', `${produceListing.quantity} ${produceListing.unit}`);
    console.log('Price:', `₹${produceListing.pricePerUnit}/${produceListing.unit} (Total: ₹${produceListing.totalPrice})`);
    console.log('Quality:', produceListing.quality);
    console.log('Organic:', produceListing.organic ? 'Yes' : 'No');
    console.log('Full Listing Data:', produceListing);
    console.groupEnd();

    return produceListing;
};

/**
 * Get all produce listings from localStorage
 */
export const getAllProduceListings = (): ProduceListing[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error reading produce listings:', error);
        return [];
    }
};

/**
 * Get active produce listings only
 */
export const getActiveProduceListings = (): ProduceListing[] => {
    const allListings = getAllProduceListings();
    const now = new Date();

    return allListings.filter(listing => {
        if (listing.status !== 'active') return false;

        // Check if listing hasn't expired
        const expiryDate = new Date(listing.availableUntil);
        return expiryDate > now;
    });
};

/**
 * Get produce listings by user ID
 */
export const getProduceListingsByUser = (userId: string): ProduceListing[] => {
    return getAllProduceListings().filter(listing => listing.userId === userId);
};

/**
 * Get a single produce listing by ID
 */
export const getProduceListingById = (id: string): ProduceListing | null => {
    const listings = getAllProduceListings();
    return listings.find(listing => listing.id === id) || null;
};

/**
 * Update produce listing status
 */
export const updateProduceListingStatus = (id: string, status: ProduceListing['status']) => {
    const listings = getAllProduceListings();
    const updatedListings = listings.map(listing =>
        listing.id === id ? { ...listing, status } : listing
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedListings));
};

/**
 * Delete a produce listing
 */
export const deleteProduceListing = (id: string) => {
    const listings = getAllProduceListings();
    const updatedListings = listings.filter(listing => listing.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedListings));
};

/**
 * Export all produce listings as JSON
 */
export const exportProduceListings = () => {
    const listings = getAllProduceListings();
    const dataStr = JSON.stringify(listings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `produce-listings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
};

/**
 * Clear all produce listings (for development/testing)
 */
export const clearAllProduceListings = () => {
    localStorage.removeItem(STORAGE_KEY);
    console.log('✅ All produce listings cleared');
};

/**
 * Log all produce listings to console (for developer debugging)
 */
export const logAllProduceListings = () => {
    const listings = getAllProduceListings();
    console.group('📦 All Produce Listings');
    console.log(`Total Listings: ${listings.length}`);
    console.table(listings.map(listing => ({
        ID: listing.id,
        Crop: listing.cropName,
        'Listed By': listing.userName,
        Location: `${listing.village}, ${listing.district}`,
        Quantity: `${listing.quantity} ${listing.unit}`,
        Price: `₹${listing.pricePerUnit}/${listing.unit}`,
        Status: listing.status,
        'Created At': new Date(listing.createdAt).toLocaleString(),
    })));
    console.log('Full Data:', listings);
    console.groupEnd();
};

/**
 * Get statistics about produce listings
 */
export const getProduceStatistics = () => {
    const listings = getAllProduceListings();
    return {
        total: listings.length,
        active: listings.filter(l => l.status === 'active').length,
        sold: listings.filter(l => l.status === 'sold').length,
        expired: listings.filter(l => l.status === 'expired').length,
        totalValue: listings.reduce((sum, listing) => sum + listing.totalPrice, 0),
        byCrop: listings.reduce((acc, listing) => {
            acc[listing.cropName] = (acc[listing.cropName] || 0) + 1;
            return acc;
        }, {} as Record<string, number>),
        organicCount: listings.filter(l => l.organic).length,
    };
};

/**
 * Generate a unique listing ID
 */
const generateListingId = (): string => {
    return `LISTING-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Make functions available globally for developer console access
if (typeof window !== 'undefined') {
    (window as any).produceListingDebug = {
        getAll: getAllProduceListings,
        getActive: getActiveProduceListings,
        getById: getProduceListingById,
        getByUser: getProduceListingsByUser,
        logAll: logAllProduceListings,
        export: exportProduceListings,
        clear: clearAllProduceListings,
        stats: getProduceStatistics,
        updateStatus: updateProduceListingStatus,
        delete: deleteProduceListing,
    };

    console.log('💡 Produce Listing Debug Tools Available:');
    console.log('  window.produceListingDebug.getAll() - Get all produce listings');
    console.log('  window.produceListingDebug.getActive() - Get active listings only');
    console.log('  window.produceListingDebug.logAll() - Log all listings to console');
    console.log('  window.produceListingDebug.export() - Download listings as JSON');
    console.log('  window.produceListingDebug.stats() - Get statistics');
    console.log('  window.produceListingDebug.clear() - Clear all listings');
}
