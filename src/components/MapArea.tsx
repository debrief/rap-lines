import React, { useEffect, useRef, useState } from 'react';
import { AttributionControl, MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapArea.css';
import { FeatureCollection } from 'geojson';
import * as L from 'leaflet'
import { printFeature } from '../state';
import { buffer, lineString, featureCollection } from '@turf/turf';

interface MapAreaProps {
  state: FeatureCollection | null;
}

const convertPointsToLine = (points: FeatureCollection) => {
  const coordinates = points.features.map(feature => feature.geometry.coordinates);
  const line = lineString(coordinates);
  return featureCollection([line]);
};

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
    if (state) {
      printFeature('map update', state);
    }
  }, [state]);


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
  }, [mapRef]);

  if (state === null) {
    return <div>Loading...</div>;
  } else {
    const customRenderer = (featureCollection: FeatureCollection) => {
      if (featureCollection.name === 'Route') {
        return convertPointsToLine(featureCollection);
      }
      return featureCollection;
    };

    const renderedState = customRenderer(state);

    return (
      <div className="map-area" style={{ position: 'relative' }}>
        <MapContainer ref={mapRef} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <GeoJSON key={JSON.stringify(renderedState)} data={renderedState} />
          <AttributionControl position="bottomright" />
        </MapContainer>
        {mousePosition && (
          <div
            className="mouse-tracker"
            style={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              background: 'rgba(255, 255, 255, 0.8)',
              padding: '5px',
              borderRadius: '4px',
              zIndex: 1000,
            }}
          >
            Lat: {mousePosition.lat.toFixed(2)}, Lng: {mousePosition.lng.toFixed(2)}
          </div>
        )}
      </div>
    );
  }

}

export default MapArea;
