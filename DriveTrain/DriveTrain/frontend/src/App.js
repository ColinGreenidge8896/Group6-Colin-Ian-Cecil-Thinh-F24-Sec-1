import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import LocationComponent from './LocationComponent';

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
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>Click Me</p>
                {data}
                <LocationComponent />
            </header>
        </div>
    );
};

export default App;