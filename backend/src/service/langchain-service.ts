import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

// load the docmuments to be vectorized and stored in memory vector store
export async function loadVectorStore(link: string) {
  const loader = new CheerioWebBaseLoader(link);
  
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter();
  const splitDocs = await splitter.splitDocuments(docs);

  const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const vectorstore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
  );
}

export const langchainService = {
  loadVectorStore,
};
