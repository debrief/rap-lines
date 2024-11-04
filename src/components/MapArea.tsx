import React, { useEffect, useRef, useState } from 'react';
import { AttributionControl, MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapArea.css';
import { FeatureCollection, Point } from 'geojson';
import * as L from 'leaflet'
import { buffer, lineString, featureCollection } from '@turf/turf';

interface MapAreaProps {
  state: FeatureCollection | null;
}

const convertPointsToLine = (points: FeatureCollection) => {
  if (points.type === 'FeatureCollection') {
    if(points.features.length > 0) {
      if (points.features[0].geometry.type === 'Point') {
        const coordinates = points.features.map(feature => {
          const point: Point = feature.geometry as Point
          return point.coordinates
        });
        const line = lineString(coordinates);
        return featureCollection([line]);
      }
    }
  }
  return points;
};

const defaultInitialCenter: L.LatLngExpression = [43, -71];

const MapArea: React.FC<MapAreaProps> = ({ state }) => {
  const mapRef = useRef<L.Map>(null);
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);
  const [mousePosition, setMousePosition] = useState<{ lat: number; lng: number } | null>(null);
  const [renderedState, setRenderedState] = useState<FeatureCollection | null>(null);
  
  useEffect(() => {
    if (mapRef.current !== null && !bounds && state) {
      const map = mapRef.current;
      const bufferedState: FeatureCollection = buffer(state, 50, { units: 'kilometers' });
      const bounds = new L.GeoJSON(bufferedState).getBounds();
      setBounds(bounds.pad(5));
      console.log('fitting bounds', state?.features[0].geometry, bounds.getNorthWest(), bounds.getSouthEast());
      map.fitBounds(bounds);
    }
  }, [state, bounds, setBounds]);
  
  useEffect(() => {
    if (state) {
      setRenderedState(convertPointsToLine(state));
    }
  }, [state]);
  
  
  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      const handleMouseMove = (e: L.LeafletMouseEvent) => {
        setMousePosition({ lat: e.latlng.lat, lng: e.latlng.lng });
      };
      map.on('mousemove', handleMouseMove);
      return () => {
        map.off('mousemove', handleMouseMove);
      };
    }
  }, [mapRef]);


  type MouseProps = {
    position: { lat: number; lng: number } | null  }
  
  const MousePosition: React.FC<MouseProps> = ({ position }) => {
    return       <div
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
      { position ?  <span>Lat: {position.lat.toFixed(2)}, Lng: {position.lng.toFixed(2)}</span> : <span>Pending</span> }
    </div>
  }
  
  return (
    <div className="map-area" style={{ position: 'relative' }}>
      <MapContainer center={defaultInitialCenter} zoom={6} ref={mapRef} style={{ height: "100%", width: "100%" }}>
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
        { renderedState && 
          <GeoJSON key={JSON.stringify(renderedState)} data={renderedState} />
        }
      </MapContainer>
      <MousePosition position={mousePosition} />
    </div>
  );
}

export default MapArea;
