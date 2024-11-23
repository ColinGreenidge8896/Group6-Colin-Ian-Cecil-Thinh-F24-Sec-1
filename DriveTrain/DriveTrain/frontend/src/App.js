import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('There was an error making the request!', error);
      });
  }, []);

  return (
      <div>
          <div className="App">
              <header className="App-header">
                  <button className="center-button">Click Me</button>
              </header>
              <h1>{data}</h1>
          </div>
    </div>
  );
};

export default App;
