import axios from "axios";
import { GEMINI_API_KEY } from "../Config/config";

const BASE_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

const getGeminiResponse = async (userMsg) => {
  try {
    const response = await axios.post(
      `${BASE_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: userMsg,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (
      response.data &&
      response.data.candidates &&
      response.data.candidates[0]
    ) {
      return {
        data: {
          contents: [
            {
              parts: [
                {
                  text: response.data.candidates[0].content.parts[0].text,
                },
              ],
            },
          ],
        },
      };
    } else {
      throw new Error("Invalid response structure from Gemini API");
    }
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    throw error;
  }
};

export default getGeminiResponse;
