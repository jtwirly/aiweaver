import { useState } from 'react';
import { nanoid } from 'nanoid';

export default function Prompt() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleResponseChange = (event) => {
    setResponse(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = `/${nanoid()}`;
    const data = { prompt, response, url };
    const res = await fetch('/api/prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      console.log('Error saving prompt:', res.status);
      return;
    }
    window.location.href = url;
  };  

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Prompt:
        <input type="text" value={prompt} onChange={handlePromptChange} />
      </label>
      <label>
        Response:
        <select value={response} onChange={handleResponseChange}>
          <option value="response1">Response 1</option>
          <option value="response2">Response 2</option>
          <option value="response3">Response 3</option>
        </select>
      </label>
      <button type="submit">Create Webapp</button>
    </form>
  );
}
