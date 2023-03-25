import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function UserWebapp() {
  const router = useRouter();
  const { id } = router.query;
  const [webappData, setWebappData] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState(null);

  useEffect(() => {
    if (id) {
      fetchWebappData(id);
    }
  }, [id]);

  const fetchWebappData = async (url) => {
    const { data, error } = await supabase.from('webapps').select('*').eq('url', `/${id}`).single();
    if (error) {
      console.error('Error fetching web app data:', error.message);
    } else {
      setWebappData(data);
    }
  };  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const aiResponse = await assistant.generate({ prompt: `${webappData.prompt}: ${userInput}`, maxTokens: 150 });
    setResponse(aiResponse.choices[0].text);
  };

  if (!webappData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Debugging Information:</h1>
      <pre>{JSON.stringify(webappData, null, 2)}</pre>
      <h1>{webappData.title}</h1>
      <h2>{webappData.subtitle}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={webappData.inputplaceholder}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button type="submit">{webappData.buttonname}</button>
      </form>
      {response && <div><strong>Response:</strong><p>{response}</p></div>}
      <p>{webappData.disclaimer}</p>
    </div>
  );
}
