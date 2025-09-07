interface LocationData {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
}

export const getCurrentLocation = (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by this browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    // Try to get address from coordinates using reverse geocoding
                    const address = await reverseGeocode(latitude, longitude);
                    resolve({
                        latitude,
                        longitude,
                        ...address
                    });
                } catch (error) {
                    // If reverse geocoding fails, return coordinates only
                    resolve({
                        latitude,
                        longitude
                    });
                }
            },
            (error) => {
                let errorMessage = 'Unable to retrieve your location';

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location access denied by user';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out';
                        break;
                }

                reject(new Error(errorMessage));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        );
    });
};

const reverseGeocode = async (lat: number, lng: number): Promise<Partial<LocationData>> => {
    try {
        // Using OpenStreetMap Nominatim API for reverse geocoding (free)
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            {
                headers: {
                    'User-Agent': 'AgriAssist/1.0'
                }
            }
        );

        if (!response.ok) {
            throw new Error('Reverse geocoding failed');
        }

        const data = await response.json();

        if (data && data.address) {
            const address = data.address;
            return {
                address: data.display_name,
                city: address.city || address.town || address.village || address.suburb,
                state: address.state,
                country: address.country,
                postalCode: address.postcode
            };
        }

        return {};
    } catch (error) {
        console.warn('Reverse geocoding failed:', error);
        return {};
    }
};

export const formatAddress = (locationData: Partial<LocationData>): string => {
    const parts = [];

    if (locationData.address) {
        parts.push(locationData.address);
    } else {
        // Fallback format if no full address
        if (locationData.city) parts.push(locationData.city);
        if (locationData.state) parts.push(locationData.state);
        if (locationData.postalCode) parts.push(locationData.postalCode);
        if (locationData.country) parts.push(locationData.country);
    }

    return parts.join(', ') || 'Current Location';
};