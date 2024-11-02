import React from 'react';
import { AttributionControl, MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapArea.css';
import { FeatureCollection } from 'geojson';
import State from '../state';

interface MapAreaProps {
  state: State;
}

const MapArea: React.FC<MapAreaProps> = ({ state }) => {
  const currentState: FeatureCollection = state.getState();

  return (
    <div className="map-area">
      <MapContainer bounds={[[51.505, -0.09], [51.505, -0.09]]} style={{ height: "100%", width: "100%" }}>
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
