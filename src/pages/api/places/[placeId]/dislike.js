import { ObjectId } from "mongodb";
import { getCollection } from "../../../../../utils/functions";

export default async function handler(req, res) {
    const { placeId } = req.query;
    const { userId } = req.body;

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    if (!placeId || !userId) {
        return res.status(400).json({ message: "Missing placeId or userId" });
    }

    try {
        const collection = await getCollection("places");
        const objectPlaceId = new ObjectId(placeId);

        const place = await collection.findOne({ _id: objectPlaceId });

        if (!place) {
            return res.status(404).json({ message: "Place not found" });
        }

        const existingVote = place.voters?.find(v => v.userId === userId);

        if (existingVote?.type === "dislike") {
            const result = await collection.findOneAndUpdate(
                { _id: objectPlaceId },
                {
                    $inc: { dislikes: -1 },
                    $pull: { voters: { userId } }
                },
                { returnDocument: "after" }
            );
            return res.status(200).json({ message: "Dislike removed", place: result.value });
        } else {
            if (existingVote?.type === "like") {
                await collection.findOneAndUpdate(
                    { _id: objectPlaceId },
                    {
                        $inc: { likes: -1 },
                        $pull: { voters: { userId } }
                    }
                );
            } else {
                await collection.findOneAndUpdate(
                    { _id: objectPlaceId },
                    {
                        $pull: { voters: { userId } }
                    }
                );
            }

            const result = await collection.findOneAndUpdate(
                { _id: objectPlaceId },
                {
                    $inc: { dislikes: 1 },
                    $push: { voters: { userId, type: "dislike" } }
                },
                { returnDocument: "after" }
            );

            return res.status(200).json({ message: "Dislike added", place: result.value });
        }
    } catch (error) {
        console.error("Error in dislike API:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
