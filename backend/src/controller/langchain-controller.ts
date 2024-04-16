import express from "express";
import { Request, Response } from "express";
import { langchainService } from "../service/langchain-service";


const langchainRouter = express.Router();

const uploadFile = (req: Request, res: Response) => {

    try {
        //upload link to vector store
        const link = req.body.link;
        langchainService.loadVectorStore(link);
        res.status(200).send("Link uploaded to vector store successfully");
    } catch (error) {
        console.error("An error occurred while uploading link to vector store:", error);
        throw error;
    }
}