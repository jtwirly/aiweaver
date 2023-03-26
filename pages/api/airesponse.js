const { Configuration, OpenAIApi } = require("openai");
const { supabase } = require("../lib/supabase");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { id, userInput } = req.query;
      const { data, error } = await supabase
        .from("webapps")
        .select("*")
        .eq("url", `/${id}`)
        .single();

      if (error) {
        console.error("Error fetching web app data:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (!data) {
        res.status(404).json({ error: "Web app not found" });
      } else {
        const { prompt } = data;

        const completion = await openai.createCompletion({
          model: "text-davinci-002",
          prompt: `${prompt}: ${userInput}`,
          max_tokens: 200,
          temperature: 0.8,
        });

        const text = completion.data.choices[0].text.trim();
        const cleanedText = text.replace(/^[.,\s]+|[.,\s]+$/g, "");

        res.status(200).json({ text: cleanedText });
      }
    } catch (error) {
      console.error("Error generating AI response:", error);
      console.error('Error response:', error.response?.data); // Add this line to inspect the error response
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
