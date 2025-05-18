import axios from "axios";

const allowedOrigins = [
  "http://127.0.0.1:5500",
  "https://gemini-chatbot-replica.vercel.app",
];

const handler = async (req, res) => {
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

    // if message not provided
    if (!message) {
      return res.status(400).json({ error: "No Message provided" });
    }

    const GEMINI_API_KEY = process.env.API_KEY;

    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await axios.post(GEMINI_API_URL, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contents: message }),
    });

    const data = await response.json();

    res.status(200).json({ reply: data });
  } catch (error) {
    console.log("Error : ", error);
    res.status(500).json({ error: "Failed to get response from GEMINI AI" });
  }
};

export default handler;
