import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// This is needed to fix the issue with default Leaflet markers not showing up
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function Map({ data }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (data && mapRef.current) {
      const mapInstance = mapRef.current.leafletElement;
      const geojsonData = L.geoJSON(data);
      const bounds = geojsonData.getBounds();
      mapInstance.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [data]);

  const onEachFeature = (feature, layer) => {
    const popupContent = `
      <div>
        <h3>Zipcode: ${feature.properties.zipCode}</h3>
        <p>City: ${feature.properties.city}</p>
        <p>County: ${feature.properties.county}</p>
        <p>State: ${feature.properties.state}</p>
      </div>
    `;
    layer.bindPopup(popupContent);
  };

  return (
    <MapContainer center={[39.5, -98.35]} zoom={4} style={{ height: '50vh', width: '100%' }} ref={mapRef}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {data && <GeoJSON key={data.properties.zipCode} data={data} onEachFeature={onEachFeature} />}
    </MapContainer>
  );
}
