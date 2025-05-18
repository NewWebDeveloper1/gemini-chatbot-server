const allowedOrigins = ["http://127.0.0.1:5500"];

const handler = async (req, res) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  // Allow CORS
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-type");

  // Handle if not POST
  if (req.method != "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { message } = req.body;

  const GEMINI_API_KEY = process.env.API_KEY;

  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contents: message }),
      signal: signal,
    });

    const data = await response.json();

    res.status(200).json({ reply: data });
  } catch (error) {
    console.log("Error : ", error);
    res.status(500).json({ error: "Failed to get response from GEMINI AI" });
  }
};

export default handler;
