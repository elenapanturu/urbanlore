import { sendMethodNotAllowed, sendOk } from "../../../../utils/apiMethods";
import { getCollection } from "../../../../utils/functions";
import { COLLECTION_NAME } from "./constants";

const getPlaces = async () => {
    const collection = await getCollection(COLLECTION_NAME);
    return await collection.find({}).toArray();
}

const createPlace = async (data) => {
    const collection = await getCollection(COLLECTION_NAME);
    return await collection.insertOne(data);
}

export default async function handler(req,res){
    const {method, body} = req;
    
    try {
        let result = null;

        switch(method) {
            case "GET":
                result = await getPlaces();
                break;
            case "POST":
                result = await createPlace(body);
                break;
            default:
                return sendMethodNotAllowed(res, "Method Not Allowed");
        }

        return sendOk(res,result);
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({message: "Internal Server Error", error: error.message});
    };
}