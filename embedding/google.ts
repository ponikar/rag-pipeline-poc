import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export async function getEmbeddings() {
  return new GoogleGenerativeAIEmbeddings({
    model: "models/gemini-embedding-001",
  });
}
