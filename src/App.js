
import './App.css';

/// app.js
import React from 'react';
import DeckGL from '@deck.gl/react';
import {LineLayer} from '@deck.gl/layers';
import {Map} from 'react-map-gl';

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoidndha2U2NSIsImEiOiJjbGVyMTJzYjEwYWl6M3Fwa2I2ZDA1ZmM2In0.nG-7I7CEN3CG8nHSpFLhAA';

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0
};

// Data to be used by the LineLayer
const data = [
  {sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781]}
];

function App({data}) {
  const layers = [
    new LineLayer({id: 'line-layer', data})
  ];

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
    >
      <Map 
      mapStyle={"mapbox://styles/vwake65/cler2mnma00f801qfzjqdr449"}
      mapboxAccessToken={MAPBOX_ACCESS_TOKEN} />
    </DeckGL>
  );
}

export default App;
