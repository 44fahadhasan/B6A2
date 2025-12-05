import { Response } from "express";

interface ISendResponse {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data?: any;
}

// Send a API response
const sendResponse = (
  res: Response,
  {
    statusCode = 200,
    success = true,
    message = "Success",
    data = false,
  }: ISendResponse = {}
) => {
  return res.status(statusCode).json({
    success,
    message,
    ...(data !== false && { data }),
  });
};

export default sendResponse;
