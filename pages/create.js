import { useState } from 'react';
import { nanoid } from 'nanoid';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';

export default function Create() {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [inputplaceholder, setInputplaceholder] = useState('');
  const [buttonname, setButtonname] = useState('');
  const [prompt, setPrompt] = useState('');
  const [disclaimer, setDisclaimer] = useState('');
  const [url, setUrl] = useState(null);
  const [id, setId] = useState(uuidv4()); // Generate a unique ID for the new record

  const handleSubmit = async (event) => {
    event.preventDefault();

    // save the user-generated data to the database
    const { data, error } = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, subtitle, inputplaceholder, buttonname, prompt, disclaimer }),
      }).then((res) => res.json());
    // Do something with the form data
    console.log('Title:', title);
    console.log('Subtitle:', subtitle);
    console.log('Response data:', data);
    // Clear the form
    setTitle('');
    setSubtitle('');
    setInputplaceholder('');
    setButtonname('');
    setPrompt('');
    setDisclaimer('');
    // set the response in the state
    if (data) {
      console.log(data);
      setUrl(`/webapp/${data.id}`); // Update the URL state variable
    } else {
      console.error(error);
    }
  };

  return (
    <>
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
      {url && <Link href={url}><button>Visit your webapp here</button></Link>}
    </>
  );
}
