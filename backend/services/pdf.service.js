import fs from "fs";
import { createRequire } from "module";
import { extractText, getDocumentProxy } from "unpdf";

/*
  pdf-parse is a CommonJS library.
  Since this project uses ES Modules, we load it using createRequire.
*/
const require = createRequire(import.meta.url);
const pdfModule = require("pdf-parse");
const pdfParse = pdfModule.default || pdfModule;

/*
  This function extracts text from a PDF file.
  It tries TWO methods:
  1) pdf-parse (fast, works for normal PDFs)
  2) unpdf (fallback for difficult PDFs)
*/
export const extractTextFromPDF = async (filePath) => {
  // Step 1: Read the PDF file from disk
  const buffer = fs.readFileSync(filePath);

  /*
    STEP 2: Try pdf-parse first
    This works for most text-based PDFs
  */
  try {
    const result = await pdfParse(buffer);

    if (result && result.text && result.text.trim().length > 0) {
      return result.text.trim();
    }
  } catch (error) {
    // If pdf-parse fails, we silently move to fallback
    console.log("pdf-parse failed, trying fallback method...");
  }

  /*
    STEP 3: Fallback using unpdf
    This handles complex or non-standard PDFs
  */
  try {
    const pdfDocument = await getDocumentProxy(new Uint8Array(buffer));

    const extracted = await extractText(pdfDocument, {
      mergePages: true,
    });

    if (!extracted.text || extracted.text.trim().length === 0) {
      throw new Error("No readable text found");
    }

    return extracted.text.trim();
  } catch (error) {
    // If both methods fail, throw a clear error
    throw new Error(
      "Unable to extract text from the PDF. " +
        "The file may be scanned, corrupted, or password-protected.",
    );
  }
};
