import { sendMethodNotAllowed, sendOk } from "../../../../utils/apiMethods";
import { getCollection } from "../../../../utils/functions";
import { COLLECTION_NAME } from "./constants";
import openai from "../../../../lib/openai";
import { fetchImageUrl, downloadAndSaveImage } from "../../../../utils/downloadImage";

const getPlaces = async (city) => {
    const collection = await getCollection(COLLECTION_NAME);
    const query = { city };
    const places = await collection.find(query).toArray();
    return places;

}

const createPlace = async (place) => {
    const collection = await getCollection(COLLECTION_NAME);
    return await collection.insertOne(place);
}

export default async function handler(req, res) {
    const { method, body, query } = req;

    try {
        let result = null;

        switch (method) {
            case "GET":
                {
                    const { city } = query;

                    if (!city) {
                        return res.status(400).json({ message: "Misssing city parameteres" });
                    }

                    result = await getPlaces(city);
                    res.setHeader("Cache-Control", "no-store");

                    return sendOk(res, result);
                }
            case "POST":
                {
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
                                    The result should be a valid JSON array only. No explanation, no extra text.

                                            Example:
                                            [
                                                {
                                                    "name": "Museum of the shadows",
                                                    "story": "A small museum with a captivating history in shadows blah blah",
                                                    "city": "Berlin",
                                                    "country": "Germany",
                                                    "description": "The museum of the shadows.."
                                                    "image": "images/name_of_the_image.jpg"
                                                },
                                                ...
                                            ]`;

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
                        const localPath = imageUrl
                            ? await downloadAndSaveImage(imageUrl, `${safeFileName}.jpg`)
                            : "/images/default.jpg";

                        place.image = localPath;

                        await createPlace(place);
                    }

                    const finalPlaces = await getPlaces(city);
                    return sendOk(res, finalPlaces);
                }
            default:
                return sendMethodNotAllowed(res, "Method Not Allowed");
        }


    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    };
}