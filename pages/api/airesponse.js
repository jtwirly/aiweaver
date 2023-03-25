const { Configuration, OpenAIApi } = require("openai");

//Setup OpenAI
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const handler = async (req, res) => {
    switch (req.method) {
        case 'GET':
            await getAdvice(req, res);
            break;
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${req.method} Not Allowed`)
    }

}

const getAdvice = async (req, res) => {
    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `As a kind, supportive and ethical friend, please provide encouragement on the following topic: ${req.query.prompt}. If the topic is unclear, please ask for clarification.`,
            max_tokens: 200,
            temperature: 0.8,
        });        

        // Clean up the text output
        const text = completion.data.choices[0].text.trim();
        const cleanedText = text.replace(/^[.,\s]+|[.,\s]+$/g, '');

        res.status(200).json({ text: cleanedText });
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else {
            res.status(500).send(error.message);
        }
    }
}

export default handler;