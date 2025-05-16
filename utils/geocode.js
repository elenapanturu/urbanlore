import axios from 'axios';

const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;

export const getCityFromAPI = async (city) => {
    try {
        const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
            params: {
                q: city,
                key: apiKey,
                language: 'en',
            },
        });

        if (response.data && response.data.results && response.data.results.length > 0) {
            const components = response.data.results[0].components;
            const normalizedCity = components._normalized_city || components.city || components.town || components.village;

            if (normalizedCity) {
                return normalizedCity;
            } else {
                console.warn(`No normalized city found for "${city}". Using original input.`);
                return city;
            }
        } else {
            console.warn(`No geocoding results for "${city}".`);
            return city;
        }
    } catch (error) {
        console.error('Error fetching city data:', error);
        throw new Error('Failed to fetch city data');
    }
};


export const getCoordinates = async (place) => {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(place)}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        return { lat, lng };
    }
    return null;
}