import express, { Request, Response } from "express";
import { langchainService } from "../service/langchain-service";
import { sendResponse } from "../config/response-config";
import { ChatOpenAI } from "@langchain/openai";
import { OpenAI } from "@langchain/openai";

const langchainRouter = express.Router();

const upload = async (req: Request, res: Response) => {
  const link = req.body.link;
  if (link === undefined || link === null || link === "") {
    sendResponse(res, {}, 400, "Link not provided");
    return;
  }

  try {
    //upload link to vector store
    await langchainService.loadVectorStore(link);
    sendResponse(res, {}, 200, "Link uploaded to vector store successfully");
  } catch (e: unknown) {
    console.error("An error occurred while uploading link to vector store:", e);
    if (e instanceof Error) sendResponse(res, {}, 500, e.message);
  }
};

const test = (req: Request, res: Response) => {
  try {
    res.status(200).send("Test successful");
  } catch (error) {
    console.error("An error occurred while testing:", error);
    throw error;
  }
};

langchainRouter.post("/upload", upload);
langchainRouter.get("/", test);

export default langchainRouter;
