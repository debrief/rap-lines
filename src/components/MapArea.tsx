import React, { useEffect, useRef } from 'react';
import { AttributionControl, MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapArea.css';
import { FeatureCollection } from 'geojson';
import State from '../state';
import * as L from 'leaflet'

interface MapAreaProps {
  state: State;
}

const MapArea: React.FC<MapAreaProps> = ({ state }) => {
  console.log('state', state, state.getState());
  const currentState: FeatureCollection = state.getState();
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    if (mapRef.current !== null) {
      const map = mapRef.current;
      const bounds = new L.GeoJSON(currentState).getBounds();
      const bufferedBounds = bounds.pad(1); // 1km buffer
      map.fitBounds(bufferedBounds);
    }
  }, [currentState]);

  return (
    <div className="map-area">
      <MapContainer ref={mapRef} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <GeoJSON data={currentState} />
        <AttributionControl position="bottomright" />
      </MapContainer>
    </div>
  );
}

export default MapArea;
