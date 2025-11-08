import { processPDF } from "./loader/pdf-loader";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

import path from "path";

const resumes = ["./data/darshan_ponikar.pdf", "./data/smit_kadawala.pdf"];

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseKey) throw new Error(`Expected SUPABASE_SERVICE_ROLE_KEY`);
const url = process.env.SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);

const embedAndStore = async () => {
  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "models/gemini-embedding-001",
  });

  const client = createClient(url, supabaseKey);

  const store = new SupabaseVectorStore(embeddings, {
    client,
    tableName: "documents",
  });

  for (const resume of resumes) {
    try {
      const documents = await processPDF(resume);
      const candidateName = path.basename(resume, path.extname(resume));

      documents.forEach((doc) => {
        doc.metadata = { ...doc.metadata, candidateName };
      });

      store.addDocuments(documents);

      console.log(`Embedded and stored ${resume}`);
    } catch (e) {
      console.log(`Error processing ${resume}:`, e);
    }
  }
};

embedAndStore().catch((e) => console.log("Error in embedAndStore:", e));
