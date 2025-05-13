import axios from 'axios';

const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;

export const getCityFromAPI = async (city) => {
    try {
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
            params: {
                q: city,
                key: apiKey,
                language: 'en',
            },
        });

        if (response.data.results.length > 0) {
            const normalizedCity = response.data.results[0].components.city ||
                response.data.results[0].components.town ||
                response.data.results[0].components.village;

            return normalizedCity;
        } else {
            throw new Error("City not found");
        }
    }
    catch (error) {
        console.error("Error fetching city data: ", error);
        throw error;
    }
}

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