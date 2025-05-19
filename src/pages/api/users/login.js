import { getCollection } from "../../../../utils/functions";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { COLLECTION_NAME } from "./constants";


export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email și parola sunt obligatorii" });
  }

  const collection = await getCollection(COLLECTION_NAME);
  const user = await collection.findOne({ email });

  if (!user) {
    return res.status(401).json({ error: "Email sau parola incorecte" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ error: "Email sau parola incorecte" });
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return res.json({ token });
}
