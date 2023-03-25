import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { nanoid } from 'nanoid';
import { supabase } from './../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export default function Home({ aiweaver }) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [inputplaceholder, setInputplaceholder] = useState('');
  const [buttonname, setButtonname] = useState('');
  const [prompt, setPrompt] = useState('');
  const [disclaimer, setDisclaimer] = useState('');
  const [response, setResponse] = useState('');
  const [id, setId] = useState(uuidv4()); // Generate a unique ID for the new record

  const handleSave = async (event) => {
    event.preventDefault();
    
    // Generate a unique ID for the new record
    const id = uuidv4();
    
    // Submit prompt to the API route and fetch the response
    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, subtitle, inputplaceholder, buttonname, prompt, disclaimer }),
    });    
    const data = await res.json();
    
    // Set the response in the state
    setResponse(data.choices && data.choices[0] ? data.choices[0].text : '');
  };  

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Generate a unique ID for the new record
    const id = nanoid();
  
    // Submit prompt to the API route and fetch the response
    const res = await fetch('/api/prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, title, subtitle, inputplaceholder, buttonname, prompt, disclaimer }),
    });    
    const data = await res.json();
  
    // Set the response in the state
    setResponse(data.choices && data.choices[0] ? data.choices[0].text : '');
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
            Title:
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            Subtitle:
            <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
          </label>
          <label>
            Input Placeholder:
            <input type="text" value={inputplaceholder} onChange={(e) => setInputplaceholder(e.target.value)} />
          </label>
          <label>
            Button Name:
            <input type="text" value={buttonname} onChange={(e) => setButtonname(e.target.value)} />
          </label>
          <label>
            Prompt:
            <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          </label>
          <label>
            Disclaimer:
            <input type="text" value={disclaimer} onChange={(e) => setDisclaimer(e.target.value)} />
          </label>
          <button type="submit">Create Webapp</button>
        </form>
        {response && <p>Your webapp URL is: {response}</p>}
        <ul>
          {aiweaver.map((prompt) => (
            <li key={prompt.id}>
              <h2>{prompt.prompt}</h2>
              <p>{prompt.response}</p>
              <Link href={prompt.url}>Go to Prompt</Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  let { data } = await supabase.from('webapps').select();

  return {
    props: {
      aiweaver: data,
    },
  };
}
