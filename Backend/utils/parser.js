import fs from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const extractTextFromPDF = async (filePath) => {
  try {
    if (!filePath) {
      console.log("No file path received");
      return "";
    }

    const buffer = fs.readFileSync(filePath);

    const data = await pdfParse(buffer);

    return data?.text || "";
  } catch (error) {
    console.log("PDF Parse Error:", error);
    return "";
  }
};
