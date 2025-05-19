import { sendMethodNotAllowed, sendOk } from "../../../../utils/apiMethods";
import { getCollection } from "../../../../utils/functions";
import { COLLECTION_NAME } from "./constants";
import openai from "../../../../lib/openai";
import { fetchImageUrl, downloadAndSaveImage, isValidImageUrl } from "../../../../utils/downloadImage";

const getPlaces = async (city) => {
    const collection = await getCollection(COLLECTION_NAME);
    const query = { city };
    const places = await collection.find(query).toArray();

    const updatedPlaces = await Promise.all(
        places.map(async (place) => {
            const isPixabay = place.image?.startsWith("https://pixabay.com/get/");
            const needsRefresh = isPixabay && !(await isValidImageUrl(place.image));

            if (needsRefresh && place.pixabayId) {
                const newUrl = `https://pixabay.com/get/${place.pixabayId}`;
                const isStillValid = await isValidImageUrl(newUrl);

                if (isStillValid) {
                    await collection.updateOne({ _id: place._id }, { $set: { image: newUrl } });
                    place.image = newUrl;
                } else {
                    await collection.updateOne({ _id: place._id }, { $set: { image: "/images/default.jpg" } });
                    place.image = "/images/default.jpg";
                }
            }

            return place;
        })
    );

    return updatedPlaces;
};

const createPlace = async (place) => {
    const collection = await getCollection(COLLECTION_NAME);
    return await collection.insertOne(place);
};

export default async function handler(req, res) {
    const { method, body, query } = req;

    try {
        switch (method) {
            case "GET": {
                const { city } = query;

                if (!city) {
                    return res.status(400).json({ message: "Missing city parameter" });
                }

                const result = await getPlaces(city);
                res.setHeader("Cache-Control", "no-store");
                return sendOk(res, result);
            }

            case "POST": {
                const { city } = body;
                if (!city) {
                    return res.status(400).json({ message: "City is required" });
                }

                const existingPlaces = await getPlaces(city);

                const prompt = `Give me 15 interesting, obscure, or unusual places to visit in ${city}. 
For each place, provide the following fields in a JSON array of objects:
- name: the name of the place
- story: a 5 to 8 lines description/story/legend of the place
- city: "${city}"
- country: the country the city is in
- description: a cool name given to the place based on the story
- image: a black and white image of the place

The result should be a valid JSON array only. No explanation, no extra text.`;

                const response = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.8
                });

                const jsonString = response.choices[0].message.content;

                let places;
                try {
                    places = JSON.parse(jsonString);
                } catch (err) {
                    return res.status(500).json({ message: "GPT response is not valid JSON", error: err.message });
                }

                const existingNames = new Set(existingPlaces.map((p) => p.name.toLowerCase()));
                const uniqueNewPlaces = places.filter(
                    (place) => !existingNames.has(place.name.toLowerCase())
                );

                for (const place of uniqueNewPlaces) {
                    const imageUrl = await fetchImageUrl(`${place.name} ${place.city}`);
                    const safeFileName = `${place.city}-${place.name}`
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-]/g, "");

                    if (process.env.NODE_ENV === "development") {
                        const localPath = imageUrl
                            ? await downloadAndSaveImage(imageUrl, `${safeFileName}.jpg`)
                            : "/images/default.jpg";
                        place.image = localPath;
                    } else {
                        place.image = imageUrl || "/images/default.jpg";
                    }

                    await createPlace(place);
                }

                const finalPlaces = await getPlaces(city);
                return sendOk(res, finalPlaces);
            }

            default:
                return sendMethodNotAllowed(res, "Method Not Allowed");
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}