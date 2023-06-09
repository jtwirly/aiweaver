const { Configuration, OpenAIApi } = require("openai");
const { supabase } = require("../../lib/supabase");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { id } = req.query;
      const { data, error } = await supabase
        .from("webapps")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching web app data:", error.message);
        res.status(500).json({ error: error.message });
      } else if (!data) {
        res.status(404).json({ error: "Web app not found" });
      } else {
        const { prompt } = data;
        const { userInput } = req.query;

        const completion = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: `${prompt}: ${userInput}`,
          max_tokens: 150,
          n: 1,
          stop: null,
          temperature: 1,
        });

        const text = completion.data.choices[0].text.trim();
        const cleanedText = text.replace(/^[.,\s]+|[.,\s]+$/g, "");

        res.status(200).json({ text: cleanedText });
      }
    } catch (error) {
      console.error("Error generating AI response:", error);
      console.error('Error response:', error.response?.data); // Add this line to inspect the error response
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

console.log('id:', id);
const { data, error } = await supabase
  .from("webapps")
  .select("*")
  .eq("id", id)
  .single();
