import axios from "axios";

const allowedOrigins = [
  "http://127.0.0.1:5500",
  "https://gemini-chatbot-replica.vercel.app",
];

export default async function handler(req, res) {
  console.log("Request body : ", req.body);
  console.log("Request Method : ", req.method);
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  // Allow CORS
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-type");

  // Handle pre-flight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
  }

  // Handle if not POST
  if (req.method != "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  try {
    const { message } = req.body;
    console.log("Parsed message : ", message);

    // if message not provided
    if (!message) {
      return res.status(400).json({ error: "No Message provided" });
    }

    if (!Array.isArray(message)) {
      return res.status(400).json({ error: "Message must be an array" });
    }

    const GEMINI_API_KEY = process.env.API_KEY;

    if (!API_KEY) {
      console.error("Missing API_KEY");
      return res.status(500).json({ error: "Missing API key" });
    }

    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await axios.post(
      GEMINI_API_URL,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
      { contents: message }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini error response:", data);
      return res.status(500).json({ error: data.error || "Gemini API error" });
    }

    res.status(200).json({ reply: data });
  } catch (error) {
    console.log("Error : ", error);
    res.status(500).json({ error: "Failed to get response from GEMINI AI" });
  }
}
