import React, { useEffect, useRef, useState } from 'react';
import { AttributionControl, MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapArea.css';
import { FeatureCollection } from 'geojson';
import * as L from 'leaflet'
import { printFeature } from '../state';
import { buffer } from '@turf/turf';

interface MapAreaProps {
  state: FeatureCollection | null;
}

const MapArea: React.FC<MapAreaProps> = ({ state }) => {
  const mapRef = useRef<L.Map>(null);
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);
  const [mousePosition, setMousePosition] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (mapRef.current !== null && !bounds && state) {
      const map = mapRef.current;
      const bufferedState: FeatureCollection = buffer(state, 500, { units: 'kilometers' });
      const bounds = new L.GeoJSON(bufferedState).getBounds();
      setBounds(bounds.pad(5));
      console.log('fitting bounds', state?.features[0].geometry, bounds.getNorthWest(), bounds.getSouthEast());
      map.fitBounds(bounds);
    }
  }, [state, bounds, setBounds]);

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      console.log('adding mousemove listener');
      const handleMouseMove = (e: L.LeafletMouseEvent) => {
        setMousePosition({ lat: e.latlng.lat, lng: e.latlng.lng });
      };
      map.on('mousemove', handleMouseMove);
      return () => {
        map.off('mousemove', handleMouseMove);
      };
    }
  }, []);

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
        {mousePosition && (
          <div className="mouse-tracker">
            Lat: {mousePosition.lat.toFixed(4)}, Lng: {mousePosition.lng.toFixed(4)}
          </div>
        )}
      </div>
    );
  }

}

export default MapArea;
