import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { searchTool } from "./tools/search";

async function main() {
  const userPrompt = "Decide who is good at for React Native Engineer role?";
  const { text, toolCalls, toolResults } = await generateText({
    model: google("gemini-2.5-flash"),
    system: `
    You are helpful AI assistant, which help users to shortlist candidate. 
    You have given a list of candidates. In order to fetch their information you can use function
    searchTool.

    User may ask you about candidates skillset, years of experinces, etc. 

    Currently user have two following candidates 
    darshan_ponikar, smit_kadawala 

    use tool **searchTool** to get information about candidate,
    you can pass candiateName as an argument if you want to search for a specific candidate name. 
    (pass the exact name as mentioned above).

    Evaluate user's message and pass shopsicated and clear query to **searchTool** function.

    Before calling a tool, refine user's query, plan and evaluate what user's required.
    Prepare a clear and in-depth query, do not just pass the plain words. 
    for example, if asking for a contact information, mention way like contact number, email, etc.
    Prepare a proper question. Your job is to pass the right question to searchTool, otherwise it won't give you correct answer.

    
    `,
    prompt: userPrompt,
    tools: {
      search: searchTool,
    },
    toolChoice: "required",
  });

  const response = await generateText({
    model: google("gemini-2.5-flash"),
    system: `
    You are helpful AI asistant which gives answer strictly based on the context it has provided and the query. 

    ${toolResults
      .map(
        (t) =>
          `
        Candidate Information
        ---------------------------
        Name: ${t.input.candidateName}
        Information: ${t.output}
      `
      )
      .join("\n")}
    `,
    prompt: `Based on the given context and query, create a proper straigh forward response that user can understand. Keep it simple.
    User Prompt: ${userPrompt}
    `,
  });

  console.log("final result:", response.text);
}

main().catch(console.error);
