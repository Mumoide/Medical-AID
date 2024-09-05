import React, { useEffect, useState } from 'react';
import Spinner from './Spinner';
import logo from './logo.svg';
import './App.css';


function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/message')
      .then(response => response.json())
      .then(data => {
        setMessage(data.message);
        setLoading(false); // Stop loading when data is received
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {loading ? (
          <Spinner />
        ) : (
          <>
            <img src={logo} className="App-logo" alt="logo" />
            <p>{message || "Edit src/App.js and save to reload."}</p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
