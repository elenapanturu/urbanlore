import { getCollection } from "../../../../utils/functions";
import { COLLECTION_NAME } from "./constants";

const getUsers = async () => {
  const collection = await getCollection(COLLECTION_NAME);
  return await collection.find({}).toArray(); 
};

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const users = await getUsers();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
