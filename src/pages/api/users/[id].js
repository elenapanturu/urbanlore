import { sendBadRequest, sendMethodNotAllowed, sendNotFound, sendOk } from "../../../../utils/apiMethods";
import { getCollection } from "../../../../utils/functions";
import { COLLECTION_NAME } from "./constants";
import { ObjectId } from "mongodb";

const getUserById = async (id) => {
  const collection = await getCollection(COLLECTION_NAME);
  return await collection.findOne({ _id: new ObjectId(id) });
};

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  if (method === "GET") {
    if (!id) {
      return sendBadRequest(res, "User ID is required");
    }
    try {
      const user = await getUserById(id);
      if (!user) {
        return sendNotFound(res, "User not found");
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  } else {
    return sendMethodNotAllowed(res, "Method not allowed");
  }
}
