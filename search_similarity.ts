import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseKey) throw new Error(`Expected SUPABASE_SERVICE_ROLE_KEY`);
const url = process.env.SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "models/gemini-embedding-001",
});

const client = createClient(url, supabaseKey);

const store = new SupabaseVectorStore(embeddings, {
  client,
  tableName: "documents",
});

const response = await store.similaritySearch(
  "How to contact Darshan Ponikar?",
  2,
  {
    candidateName: "darshan_ponikar",
  }
);

console.log("RESPONSE", response[0]);
