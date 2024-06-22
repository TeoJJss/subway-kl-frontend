import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { getDistance } from 'geolib';

const url = 'http://127.0.0.1:8000/subway-kl-api';

const outletIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const yellowMarkerIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const redMarkerIcon = new L.Icon({
  iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const App = () => {
  const [outlets, setOutlets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searched, setSearched] = useState(false);
  const [outletsCount, setOutletsCount] = useState(0);
  const [type, setType] = useState(0);

  useEffect(() => {
    fetchOutlets();
  }, []);

  const fetchOutlets = async () => {
    try {
      const response = await axios.get(`${url}/kl-outlets`);
      const formattedOutlets = response.data.map(outlet => ({
        ...outlet,
        latitude: parseFloat(outlet.latitude),
        longitude: parseFloat(outlet.longitude),
        icon: outletIcon,
      }));
      setOutlets(formattedOutlets);
    } catch (error) {
      console.error('Error fetching outlets:', error);
    }
  };

  const handleMarkerClick = (clickedOutlet) => {
    const updatedOutlets = outlets.map(outlet => {
      const distance = calculateDistance(clickedOutlet.latitude, clickedOutlet.longitude, outlet.latitude, outlet.longitude);
      return {
        ...outlet,
        icon: distance <= 5000 ? yellowMarkerIcon : outletIcon,
      };
    });

    setOutlets(updatedOutlets);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const distance = getDistance(
      { latitude: lat1, longitude: lon1 },
      { latitude: lat2, longitude: lon2 }
    );
    return distance; // in meter
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${url}/search?query=${searchTerm}`);
      const searchData = response.data.data; 

      const resetMarkers = outlets.map(outlet => ({
        ...outlet,
        icon: outletIcon,
      }));

      const updatedMarkers = resetMarkers.map(outlet => {
        const foundOutlet = searchData.find(item => item.name === outlet.name);
        const isMatched = !!foundOutlet;
        if (foundOutlet) {
          return {
            ...outlet,
            icon: isMatched ? redMarkerIcon : outletIcon,
            coordinate: isMatched ? foundOutlet.coordinate : outlet.coordinate,
          };
        } else {
          return outlet; 
        }
      });

      setOutlets(updatedMarkers);
      setSearched(true);
      setOutletsCount(searchData.length);
      setType(response.data.type)
    } catch (error) {
      console.error('Error fetching outlets:', error);
    }
  };

  return (
    <div style={{ margin: '5%' }}>
      <h1>Subway KL Outlets Map</h1>
      <div className="search-bar-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search outlet with latest closing time or location (Capitalize first letter of location name for higher accuracy)"
            value={searchTerm} // action after submit
            onChange={(e) => setSearchTerm(e.target.value)} // To allow text appear in text field when typing
            style={{width:'60vw', height: '1.5vw', fontSize:'1vw'}}
          />
          <button type="submit" style={{height: '2vw'}}>Search</button>
        </form>
        {searched && type === "outlets_in_location" && (
              <p>Found {outletsCount} outlets matching your search.</p>
          )}
      </div>
      <p>Click on a marker to view details and highlight outlets within 5km</p>
      <MapContainer center={[3.139, 101.6841]} zoom={13} style={{ height: '500px', width: '80%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {outlets.map((outlet, index) => (
          <React.Fragment key={index}>
            <Marker
              position={[outlet.latitude, outlet.longitude]}
              icon={outlet.icon}
              eventHandlers={{
                click: (e) => {
                  console.log('marker clicked', e);
                  handleMarkerClick(outlet);
                },
              }}
            >
              <Popup maxWidth={200} maxHeight={150}>
                <div>
                  <h3>{outlet.name}</h3>
                  <p><b>Address: </b>{outlet.address}</p>
                  <p><b>Operating hour: </b>{outlet.operating_hour}</p>
                  <p><b>Waze Link: </b><a href={outlet.waze} target="_blank" rel="noopener noreferrer">Open in Waze</a></p>
                  <p><b>Latitude: </b>{outlet.latitude} <b>Longitude: </b>{outlet.longitude}</p>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}
      </MapContainer>
      <span>* It takes 1 to 3 minutes to load the markers on map</span>
    </div>
  );
};

export default App;
