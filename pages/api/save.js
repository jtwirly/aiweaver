import { nanoid } from 'nanoid';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const id = uuidv4(); // Generate a unique ID for the new record
    const url = `/${nanoid()}`;
    const { title, subtitle, inputplaceholder, buttonname, prompt, disclaimer } = req.body;

    // Save the data to the database
    const { data, error } = await supabase.from('webapps').insert([{ id, title, subtitle, inputplaceholder, buttonname, prompt, disclaimer, url }]);
    if (error) {
      console.log('Error saving prompt:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    // Send the URL as a response
    res.status(201).json({ url });
  }
}
