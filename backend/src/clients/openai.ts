import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";

const openAIApiKey = process.env.OPENAI_API_KEY;
export const embeddings = new OpenAIEmbeddings({ openAIApiKey });
export const llm = new OpenAI({ openAIApiKey });