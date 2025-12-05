import jwt from "jsonwebtoken";
import config from "../config";

interface IUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}

// Generate Token
export const generateToken = (payload: IUser) => {
  const token = jwt.sign(
    payload, // Payload
    config.jwt.token_secret as string, // Secret key
    { expiresIn: config.jwt.token_expires_in } // Expiration time
  );

  return token;
};
