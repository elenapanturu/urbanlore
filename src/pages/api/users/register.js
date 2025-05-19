import { sendMethodNotAllowed, sendOk } from "../../../../utils/apiMethods";
import { getCollection } from "../../../../utils/functions";
import { COLLECTION_NAME } from "./constants"
import bcrypt from "bcryptjs";


function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePassword(password) {
  return typeof password === "string" && password.length >= 5;
}

const getUsers = async () => {
  const collection = await getCollection(COLLECTION_NAME);
  return await collection.find({}, { projection: { password: 0 } }).toArray();
};

const createUser = async (user) => {
  const collection = await getCollection(COLLECTION_NAME);
  return await collection.insertOne(user);
};

export default async function handler(req, res) {
  const { method, body } = req;

  try {
    switch (method) {
      case "GET":
        const users = await getUsers();
        return sendOk(res, users);

      case "POST":
        const { email, password } = body;

        if (!email || !password) {
          return res.status(400).json({ error: "email and password are mandatory" });
        }
        if (!validateEmail(email)) {
          return res.status(400).json({ error: "invalid email" });
        }
        if (!validatePassword(password)) {
          return res.status(400).json({ error: "password must be at least 5 characters long" });
        }

        const collection = await getCollection(COLLECTION_NAME);
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ error: "email is already used" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await createUser({ email, password: hashedPassword });

        return res.status(201).json({ message: "successful registration" });

      default:
        return sendMethodNotAllowed(res, "Method Not Allowed");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "internal server error", details: error.message });
  }
}
