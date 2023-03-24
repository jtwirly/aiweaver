import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { nanoid } from 'nanoid';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Submit prompt to the API route and fetch the response
    const res = await fetch('/api/prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();

    // Set the response in the state
    setResponse(data.choices[0].text);
  };

  const handleSave = async () => {
    // Generate a unique URL for the prompt and save it to Supabase
    const url = `/${nanoid()}`;
    const { data, error } = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, response, url }),
    }).then((res) => res.json());

    // Navigate to the saved prompt page
    if (data) {
      window.location.href = data[0].url;
    } else {
      console.error(error);
    }
  };

  return (
    <div>
      <Head>
        <title>My Webapp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to My Webapp</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Prompt:
            <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          </label>
          <button type="submit">Submit</button>
        </form>
        {response && <p>{response}</p>}
        <button onClick={handleSave}>Save Prompt</button>
        <p>
          <Link href="/saved-prompts">View Saved Prompts</Link>
        </p>
      </main>
    </div>
  );
}
