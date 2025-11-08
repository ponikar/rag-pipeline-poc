import { tool } from "ai";
import { z } from "zod";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";

export const searchTool = tool({
  description: "Get information regarding interview candidate",
  inputSchema: z.object({
    query: z.string().describe("Query to search regarding user candidate"),
    candidateName: z
      .string()
      .optional()
      .describe("The name of the candidate to filter by."),
  }),
  execute: async ({ query, candidateName }) => {
    try {
      console.log("CALLING TOOL", query, candidateName);
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!supabaseKey) throw new Error(`Expected SUPABASE_SERVICE_ROLE_KEY`);
      const url = process.env.SUPABASE_URL;
      if (!url) throw new Error(`Expected env var SUPABASE_URL`);

      const embeddings = new GoogleGenerativeAIEmbeddings({
        model: "models/gemini-embedding-001",
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      });

      const client = createClient(url, supabaseKey);

      const store = new SupabaseVectorStore(embeddings, {
        client,
        tableName: "documents",
      });

      let filter: any = {};
      if (candidateName) {
        filter = { candidateName };
      }

      const response = await store.similaritySearch(query, 2, filter);

      return response.map((res) => res.pageContent).join("\n");
    } catch (e) {
      console.log("ERRORROROR", e);
    }
  },
});
