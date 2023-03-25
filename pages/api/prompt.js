import { nanoid } from 'nanoid';
import { supabase } from '../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const id = uuidv4(); // Generate a unique ID for the new record
    const { title, subtitle, inputplaceholder, buttonname, prompt, disclaimer } = req.body;
    const response = await fetch(
      'https://api.openai.com/v1/engines/text-davinci-003/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt,
          max_tokens: 64,
        }),
      }
    )
      .then((res) => {
        console.log('Response from OpenAI API:', res);
        return res.json();
      })
      .then((data) => {
        console.log('Data from OpenAI API:', data);
        return data.choices[0].text;
      })
      .catch((error) => {
        console.log('Error fetching response from OpenAI API:', error);
        return '';
      });

    const url = `/${nanoid()}`;
    const { data, error } = await supabase.from('webapps').insert([{ id, title, subtitle, inputplaceholder, buttonname, prompt, disclaimer, url }]);
    if (error) {
      console.log('Error saving prompt:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.status(201).json({ message: 'Prompt saved successfully', url });
  }
}
