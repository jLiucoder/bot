import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import supabaseClient from "../clients/supabase";
import { llm } from "../clients/openai";
import { PromptTemplate } from "langchain/prompts";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "langchain/schema/runnable";
import { StringOutputParser } from "langchain/schema/output_parser";
import { retriever } from "../util/langchainRetriever-util";
import {
  combineDocuments,
  formatConvHistory,
} from "../util/langchainMisc-util";

// load the webpages to be vectorized and stored in supabase vectore store
async function loadVectorStore(link: string) {
  try {
    const loader = new CheerioWebBaseLoader(link);

    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
      separators: ["\n\n", "\n", " ", ""], // default setting
    });

    const splitDocs = await splitter.splitDocuments(docs);

    const embeddings = new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    await SupabaseVectorStore.fromDocuments(splitDocs, embeddings, {
      client: supabaseClient,
      tableName: "documents",
    });
  } catch (e: unknown) {
    console.log(
      "service-An error occurred while uploading link to vector store:",
      e
    );
    throw e;
  }
}

async function chat(question: string) {

  // change the template to prompt the user for the information you need
  const standaloneQuestionTemplate = `Given some conversation history (if any) and a question, convert the question to a standalone question. 
conversation history: {conv_history}
question: {question} 
standalone question:`;

  const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
    standaloneQuestionTemplate
  );

  const answerTemplate = `You are a helpful and enthusiastic language teacher who can answer a given question about certain language based on the context provided and the conversation history. Try to find the answer in the context. If the answer is not given in the context, find the answer in the conversation history if possible. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." Don't try to make up an answer. Always speak as if you were chatting to a friend.
  context: {context}
  conversation history: {conv_history}
  question: {question}
  answer: `;
  const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

  const standaloneQuestionChain = standaloneQuestionPrompt
    .pipe(llm)
    .pipe(new StringOutputParser());

  const retrieverChain = RunnableSequence.from([
    (prevResult) => prevResult.standalone_question,
    retriever,
    combineDocuments,
  ]);

  const answerChain = answerPrompt.pipe(llm).pipe(new StringOutputParser());

  const chain = RunnableSequence.from([
    {
      standalone_question: standaloneQuestionChain,
      original_input: new RunnablePassthrough(),
    },
    {
      context: retrieverChain,
      question: ({ original_input }) => original_input.question,
      conv_history: ({ original_input }) => original_input.conv_history,
    },
    answerChain,
  ]);

  // integrate convhistory with supabase or redis, with users email and session
  const response = await chain.invoke({
    question: question,
    conv_history: formatConvHistory(convHistory),
  });
}

export const langchainService = {
  loadVectorStore,
};
