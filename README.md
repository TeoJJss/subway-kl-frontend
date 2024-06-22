<h1>KL Subway Outlets Finder Project (Frontend)</h1>
<h2>Introduction</h2>

The <b>KL Subway Outlets Finder Project</b> is a project which webscrap the Subway outlets in Kuala Lumpur area from the <a href="https://subway.com.my/find-a-subway">offical outlet locator</a>. 

This repository contains the frontend script for this project.  
It should be used together with the <a href="https://github.com/TeoJJss/subway-kl-finder">backend script</a>. 

The frontend script is built using React.js with the support of Leaflet.  

<h2>Prerequisites</h2>

<b>Node 18.16.1</b> is used for the development.  
Please install dependencies and launch the frontend.  
```
npm install
npm start
```
The backend server should be launched simultaneously when the frontend script is launched. 

<h2>Important Notes</h2>

- This frontend script should be used together with the backend script at https://github.com/TeoJJss/subway-kl-finder. The frontend script will send HTTP requests to the APIs in this backend server. 
- The backend server is hosted at the 8000 port by default. If it is changed, please change the URL at `./src/App.js`, `url` const at line 8.
- The frontend is hosted at the 3000 port by default. 
- When the frontend is launched, the webpage takes some time to send HTTP request and render markers on the Leaflet map.

<h2>Interact with the markers on Leaflet map</h2>

Clicking on a marker on the Leaflet map will turn the clicked marker and other markers within 5km radius to yellow marker icon. 

<h2>Use of search box</h2>

Currently, the search box which is located above the map supports the following queries:
- Which are the outlets that close the latest
- How many outlets are located in [area]  

While this search functionality does not support other types of queries, feel free to try out multiple ways to express the above queries which are suppported (in English).  
Matched outlets will be marked with red marker icons on the Leaflet map.  