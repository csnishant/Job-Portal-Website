import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const getAiJobInsights = async (req, res) => {
  try {
    const { prompt } = req.body; // मान लीजिये आप फ्रंटेंड से प्रॉम्प्ट भेज रहे हैं

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content:
            prompt ||
            "Suggest top 5 interview questions for a MERN stack developer.",
        },
      ],
      model: "llama-3.3-70b-versatile", // Groq का सबसे पॉवरफुल मॉडल
    });

    const responseText = chatCompletion.choices[0]?.message?.content;

    return res.status(200).json({
      success: true,
      data: responseText,
    });
  } catch (error) {
    console.error("Groq Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "AI Analysis failed" });
  }
};
