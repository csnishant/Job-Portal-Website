import fs from "fs";
import pdf from "@cedrugs/pdf-parse";

export const extractTextFromPDF = async (filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);

    const data = await pdf(buffer);

    return data.text || "";
  } catch (error) {
    console.log("PDF Parse Error:", error);
    return "";
  }
};
