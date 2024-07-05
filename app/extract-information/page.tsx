'use client';
/*eslint-disable*/

import React, { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files[0]); // Assurez-vous que les fichiers sont sélectionnés
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://127.0.0.1:8080/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Server Response:', response.data);
      setMessage('File uploaded successfully!');
      setTimeout(() => setMessage(''), 4000); // Efface le message après 4 secondes
    } catch (error) {
      console.error('Error sending file:', error);
      setMessage('Failed to upload file.');
      setTimeout(() => setMessage(''), 4000); // Efface le message après 4 secondes
    }
  };

  // Styles with correct TypeScript types
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: '20px'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      width: '300px'
    },
    input: {
      marginBottom: '10px',
      paddingBottom: '8px',
      paddingTop: '8px',
    },
    button: {
      padding: '10px',
      background: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'box-shadow 0.3s ease',
    },
    header: {
      color: '#333',
      marginBottom: '20px'
    },
    label: {
      marginBottom: '5px',
      fontWeight: 'bold',
      color: '#333',
    },
    message: { // Style pour le message de confirmation
      color: 'green',
      fontSize: '16px',
      marginTop: '10px'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Please attach your PDF document:</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label htmlFor="pdfFile" style={styles.label}>PDF File:</label>
        <input
          id="pdfFile"
          type="file"
          onChange={handleFileChange}
          accept=".pdf"
          style={styles.input}
        />
        <button
          type="submit"
          style={styles.button}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0px 21px 27px -10px rgba(96, 60, 255, 0.48)')}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Send
        </button>
        {message && <div style={styles.message}>{message}</div>}
      </form>
    </div>
  );
}