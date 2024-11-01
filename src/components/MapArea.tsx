import React, { useEffect, useState } from 'react';
import { AttributionControl, MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapArea.css';
import L from 'leaflet';

const defaultBounds = L.latLngBounds(L.latLng(54, -3), L.latLng(56, 3));
const MapArea: React.FC = () => {

  const [geoData, setGeoData] = useState(null);
  const [bounds, setBounds] = useState<L.LatLngBounds>(defaultBounds);

  useEffect(() => {
    fetch('/waypoints.geojson')
      .then(response => response.json())
      .then(data => {
        setGeoData(data);
        const geojsonLayer = L.geoJSON(data);
        console.log('setting bounds', geojsonLayer.getBounds());
        setBounds(geojsonLayer.getBounds());
      });
  }, []);

  console.log('bounds', bounds);

  return (
    <div className="map-area">
      <MapContainer bounds={bounds} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {geoData && <GeoJSON data={geoData} />}
        <AttributionControl position="bottomright" />
      </MapContainer>
    </div>
  );
}

export default MapArea;
