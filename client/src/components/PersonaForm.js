import React, { useState } from 'react';
import axios from 'axios';

function PersonaForm() {
  const [url, setUrl] = useState('');
  const [output, setOutput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOutput(' Generating your AI persona...');
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/persona/generate`, {

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

const styles = {
  body: {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at top left, #1b1f27, #111)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: '"Orbitron", sans-serif',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(15px)',
    borderRadius: '20px',
    padding: '40px 30px',
    width: '100%',
    maxWidth: '650px',
    boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)',
    border: '1px solid rgba(0, 255, 255, 0.1)',
  },
  heading: {
    fontSize: '28px',
    textAlign: 'center',
    marginBottom: '30px',
    color: '#ffffff',
    letterSpacing: '1px',
  },
  glow: {
    color: '#00ffff',
    textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  input: {
    padding: '12px 18px',
    borderRadius: '12px',
    fontSize: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    border: '1px solid #00ffff',
    outline: 'none',
    transition: '0.3s',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '12px',
    border: 'none',
    background:
      'linear-gradient(90deg, #00ffff 0%, #00bfff 50%, #00ffff 100%)',
    color: '#000',
    cursor: 'pointer',
    boxShadow: '0 0 15px #00ffff',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  outputBox: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '15px',
    border: '1px solid rgba(0,255,255,0.2)',
    maxHeight: '300px',
    overflowY: 'auto',
  },
  outputText: {
    color: '#00ffae',
    fontSize: '14px',
    whiteSpace: 'pre-wrap',
  },
};

export default PersonaForm;
