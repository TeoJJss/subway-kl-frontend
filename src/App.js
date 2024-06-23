import React from 'react';
import MapContainerComponent from './components/MapContainer';

const url = 'http://127.0.0.1:8000/subway-kl-api';

const App = () => {
  return (
    <MapContainerComponent
      url={url}
    />
  );
};

export default App;
