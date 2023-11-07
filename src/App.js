
import './App.css';

/// app.js
import React, { useRef, useEffect, useState } from 'react';
import DeckGL from '@deck.gl/react';
import {LineLayer} from '@deck.gl/layers';
import {Map} from 'react-map-gl';
import mapboxgl from 'mapbox-gl';

import LayerCanvas from './LayerCanvas';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;


export default function App({data}) {

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(8.2357);
  const [lat, setLat] = useState(47.05);
  const [zoom, setZoom] = useState(6.76);
  const [activeLayer, setActiveLayer] = useState("canvas");


  const chooseTool = () => {
    setActiveLayer(prev => {
      if(prev === "canvas"){
        return 'map'
      } else {
        return 'canvas'
      }
    });
  }

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
    container: mapContainer.current,
    style: 'mapbox://styles/vwake65/cler2mnma00f801qfzjqdr449',
    center: [lng, lat],
    zoom: zoom,
    minZoom: 6,
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
 

  /* const showsomething = () => {

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
          'fill-color': 'rgba(61,153,80,0.1)'
      }
    });

  } */




  return (
    
    <div

      
    >

    <button className={`bttn toggleTools ${(activeLayer === 'canvas') ? 'activeToolHand':''}`} onClick={chooseTool}>Board</button>

    <button className={`bttn toggleTools toolPen ${(activeLayer === 'canvas') ? '' : 'activeToolPen'}`} onClick={chooseTool}>Map</button>

      
      {/* <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div> */}
      
      
      

      <div ref={mapContainer} className={`map-container ${(activeLayer === 'canvas') ? 'inactivemap':'activemap'}`}  /> 

      <LayerCanvas
      activeLayer={activeLayer}
      />
      
    </div>
  );

}


