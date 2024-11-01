import React from 'react';
import { AttributionControl, MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapArea.css';

const MapArea: React.FC = () => {
  return (
    <div className="map-area">
      <MapContainer  bounds={[[51.505, -0.09], [51.505, -0.09]]} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <AttributionControl  position="bottomright" />
      </MapContainer>
    </div>
  );
}

export default MapArea;
