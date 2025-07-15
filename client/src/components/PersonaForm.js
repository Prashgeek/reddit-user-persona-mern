import React, { useState } from 'react';
import axios from 'axios';

function PersonaForm() {
  const [url, setUrl] = useState('');
  const [output, setOutput] = useState('');

  const BACKEND_BASE_URL =
    process.env.REACT_APP_BACKEND_URL || 'https://reddit-user-persona-mern-2.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOutput(' Generating your AI persona...');
    try {
      const res = await axios.post(`${BACKEND_BASE_URL}/api/persona/generate`, {
        redditUrl: url,
      });
      setOutput(res.data.persona);
    } catch (err) {
      setOutput(' Failed to generate persona. Please check the URL and try again.');
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.card}>
        <h1 style={styles.heading}>
          Reddit User <span style={styles.glow}>Persona Generator</span>
        </h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="🔗 Enter Reddit Profile URL"
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>⚡ Generate Persona</button>
        </form>
        <div style={styles.outputBox}>
          <pre style={styles.outputText}>{output}</pre>
        </div>
      </div>
    </div>
  );
}

// [Same styles remain unchanged...]

export default PersonaForm;
