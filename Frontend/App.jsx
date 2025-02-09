import React, { useEffect, useState } from 'react';

const App = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('/api/data')
            .then(response => response.json())
            .then(setData);
    }, []);

    return (
        <div>
            <h1>Glentech Web App</h1>
            <ul>{data.map(item => <li key={item.id}>{item.name}</li>)}</ul>
        </div>
    );
};

export default App;