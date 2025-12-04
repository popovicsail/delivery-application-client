import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import SearchControl from "./SearchControl.jsx";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

// Custom marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
});

const LocationPicker = ({ onLocationSelected }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelected({ latitude: lat, longitude: lng });
    },
  });

  return position ? <Marker position={position} /> : null;
};

const MapModal = ({ isOpen, onClose, onLocationSelected }) => {
  if (!isOpen) return null;

  return (
    <div className="map-modal-overlay">
      <div className="map-modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <MapContainer
          className="map-container"
          center={[45.2671, 19.8335]}
          zoom={13}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <LocationPicker onLocationSelected={onLocationSelected} />
          <SearchControl onLocationSelected={onLocationSelected} />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapModal;
