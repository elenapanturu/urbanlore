import { sendMethodNotAllowed } from "../../../../utils/apiMethods";
import { getCollection } from "../../../../utils/functions";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { COLLECTION_NAME } from "./constants";


export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendMethodNotAllowed(res, "Method Not Allowed");
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return sendBadRequest(res, "email and password are manadatory");
  }

  const collection = await getCollection(COLLECTION_NAME);
  const user = await collection.findOne({ email });

  if (!user) {
    return sendUnauthorized(res, "wrong email or password");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return sendUnauthorized(res, "wrong email or password");
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return res.json({ token });
}
