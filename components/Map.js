import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// This is needed to fix the issue with default Leaflet markers not showing up
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function ChangeMapView({ data }) {
  const map = useMap();

  useEffect(() => {
    if (data) {
      const geojsonData = L.geoJSON(data);
      const bounds = geojsonData.getBounds();
      map.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 1 });
    }
  }, [data, map]);

  return null;
}

function onEachFeature(feature, layer) {
  if (feature.properties) {
    const { zipCode, city, state, county } = feature.properties;
    layer.bindPopup(`<b>Zipcode:</b> ${zipCode}<br><b>City:</b> ${city}<br><b>State:</b> ${state}<br><b>County:</b> ${county}`);
  }
}

export default function Map({ data }) {
  const [mapData, setMapData] = useState(null);

  useEffect(() => {
    setMapData(data);
  }, [data]);

  return (
    <MapContainer center={[39.5, -98.35]} zoom={4} style={{ height: '50vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {mapData && <GeoJSON key={mapData.properties.zipCode} data={mapData} onEachFeature={onEachFeature} />}
      <ChangeMapView data={mapData} />
    </MapContainer>
  );
}
