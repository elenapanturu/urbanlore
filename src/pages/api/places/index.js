import { sendMethodNotAllowed, sendOk } from "../../../../utils/apiMethods";
import { getCollection } from "../../../../utils/functions";
import { COLLECTION_NAME } from "./constants";
import openai from "../../../../lib/openai";

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

                    const prompt = `Give me 5 interesting, obscure, or unusual places to visit in ${city}. 
                                    For each place, provide the following fields in a JSON array of objects:
                                            - name: the name of the place
                                            - story: a short description
                                            - city: "${city}"
                                            - country: the country the city is in
                                            - images: an empty array []
                                    The result should be a valid JSON array only. No explanation, no extra text.

                                            Example:
                                            [
                                                {
                                                    "name": "Museum of the shadows",
                                                    "story": "A small museum with a captivating history in shadows blah blah",
                                                    "city": "Berlin",
                                                    "country": "Germany",
                                                    "images": []
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


                    for (const place of places) {
                        await createPlace(place);
                    }

                    return sendOk(res, places);
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