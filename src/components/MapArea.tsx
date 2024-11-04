import React, { useEffect, useRef } from 'react';
import { AttributionControl, MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapArea.css';
import { FeatureCollection } from 'geojson';
import * as L from 'leaflet'

interface MapAreaProps {
  state: FeatureCollection | null;
}

const MapArea: React.FC<MapAreaProps> = ({ state }) => {
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    if (mapRef.current !== null) {
      const map = mapRef.current;
      const bounds = new L.GeoJSON(state).getBounds();
      const bufferedBounds = bounds.pad(1); // 1km buffer
      map.fitBounds(bufferedBounds);
    }
  }, [state]);

  if (state === null) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="map-area">
        <MapContainer ref={mapRef} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <GeoJSON data={state} />
          <AttributionControl position="bottomright" />
        </MapContainer>
      </div>
    );
  }

}

export default MapArea;
