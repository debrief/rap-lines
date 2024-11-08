import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapArea.css';
import { FeatureCollection, Point } from 'geojson';
import * as L from 'leaflet'
import { lineString, featureCollection } from '@turf/turf';
import { Outcomes, ShadedOutcome, SpatialOutcome, TypeSpatialOutcome } from '../Store';

interface MapAreaProps {
  state: FeatureCollection | null;
  visibleOutcomes: ShadedOutcome[];
  outcomes: Outcomes;
  mapBounds: L.LatLngBounds | undefined;
}

type MouseProps = {
  position: { lat: number; lng: number } | null  }


const MousePosition: React.FC<MouseProps> = ({ position }) => {
  return <div
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
    { position ?  <span>Lat: {position.lat.toFixed(2)}, Lng: {position.lng.toFixed(2)}</span> : <span>Pending 2</span> }
  </div>
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

const defaultInitialCenter: L.LatLngExpression = [42.5, -71];

const MapArea: React.FC<MapAreaProps> = ({ state, visibleOutcomes, outcomes, mapBounds }) => {
  const mapRef = useRef<L.Map>(null);
  const [mousePosition, setMousePosition] = useState<{ lat: number; lng: number } | null>(null);
  const [renderedState, setRenderedState] = useState<FeatureCollection | null>(null);
  
  useEffect(() => {
    if (mapBounds) {
      const map = mapRef.current;
      if (map) {
        map.fitBounds(mapBounds)
      }
    }
  }, [mapBounds]);
  

  useEffect(() => {
    if (state) {
      setRenderedState(convertPointsToLine(state));
    }
  }, [state]);

  const spatialOutcomes = useMemo(() => {
    return visibleOutcomes.map(shaded => {
      const outcome = outcomes[shaded.id];
      if (outcome && outcome.type === TypeSpatialOutcome) {
        const spatialOutcome = outcome as SpatialOutcome;
        const afterLine = convertPointsToLine(spatialOutcome.after);
        // we have to update the key each time to force a re-render,
        // since if the id hasn't changed, leaflet won't redraw it
        const prefix = new Date().getTime()
        const key = `${prefix}-${shaded.id}-after`
        const style = { color: shaded.color }
        return (
          <GeoJSON key={key} data={afterLine} style={style} />
        );
      }
      return null;
    });
}, [visibleOutcomes, outcomes]);  
  
  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      setTimeout(function () {
        window.dispatchEvent(new Event("resize"));
     }, 500);
      const handleMouseMove = (e: L.LeafletMouseEvent) => {
        setMousePosition({ lat: e.latlng.lat, lng: e.latlng.lng });
      };
      map.on('mousemove', handleMouseMove);
      return () => {
        map.off('mousemove', handleMouseMove);
      };
    }
  }, [mapRef]);
  
  return (
    <div className="map-area">
      <MapContainer className='map-container' center={defaultInitialCenter} zoom={10} ref={mapRef}>
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
        { renderedState && 
          <GeoJSON key={JSON.stringify(renderedState)} data={renderedState} />
        }
        {spatialOutcomes}
      </MapContainer>
      <MousePosition position={mousePosition} />
    </div>
  );
}

export default MapArea;
