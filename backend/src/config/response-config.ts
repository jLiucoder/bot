// Objective: Define the error config interface to be used in the application
import { Response } from "express";

// Utility function for sending successful responses
function sendResponse(
  res: Response,
  data: object,
  statusCode: number,
  message: string,
  error: Error | undefined = undefined
) {
  res.status(statusCode).send({
    data: data,
    error: error instanceof Error ? error.message : undefined,
    message: message,
    status: statusCode,
  });
}

export { sendResponse };
