
import './App.css';

/// app.js
import React, { useRef, useEffect, useState } from 'react';
import DeckGL from '@deck.gl/react';
import {LineLayer} from '@deck.gl/layers';
import {Map} from 'react-map-gl';
import mapboxgl from 'mapbox-gl';

import Canvas from './LayerCanvas';

// Set your mapbox access token here
mapboxgl.accessToken = 'pk.eyJ1Ijoidndha2U2NSIsImEiOiJjbGVyMTJzYjEwYWl6M3Fwa2I2ZDA1ZmM2In0.nG-7I7CEN3CG8nHSpFLhAA';


export default function App({data}) {

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(8.2357);
  const [lat, setLat] = useState(47.05);
  const [zoom, setZoom] = useState(6.76);


  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
    container: mapContainer.current,
    style: 'mapbox://styles/vwake65/cler2mnma00f801qfzjqdr449',
    center: [lng, lat],
    zoom: zoom
    });
  });


  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
    setLng(map.current.getCenter().lng.toFixed(4));
    setLat(map.current.getCenter().lat.toFixed(4));
    setZoom(map.current.getZoom().toFixed(2));
    });
  });


  
  const showsomething = () => {

    map.addLayer({
      id: 'rpd_parks',
      type: 'fill',
      source: {
          type: 'vector',
          url: 'mapbox://mapbox.3o7ubwm8'
      },
      'source-layer': 'RPD_Parks',
      layout: {
          visibility: 'visible'
      },
      paint: {
          'fill-color': 'rgba(61,153,80,0.55)'
      }
    });

  }

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
      <Canvas />
    </div>
  );

}


