import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";


export const processPDF = async (filePath: string) => {
  const loader = new PDFLoader(filePath, {
  // you may need to add `.then(m => m.default)` to the end of the import
  // @lc-ts-ignore
      // pdfjs: () => import("pdfjs-dist/"),
  });
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const splittedDoc = (await splitter.splitDocuments(docs));
  return splittedDoc;
};