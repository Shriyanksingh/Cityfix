import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Fix for default marker icon in leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Red Icon for User Location
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const UserLocationMarker = () => {
  const [position, setPosition] = useState(null);
  const map = useMapEvents({
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 14); // fly to user location on success
    },
    locationerror(e) {
      console.warn("Geolocation denied or failed:", e.message);
    }
  });

  useEffect(() => {
    // Request location immediately on mount
    map.locate();
  }, [map]);

  return position === null ? null : (
    <Marker position={position} icon={userIcon}>
      <Popup>
        <strong>You are here</strong>
      </Popup>
    </Marker>
  );
};

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      if (setPosition) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Location selected</Popup>
    </Marker>
  );
};

const MapComponent = ({ issues = [], newIssuePosition, setNewIssuePosition, onIssueClick }) => {
  const defaultCenter = [40.7128, -74.0060]; // fallback location

  return (
    <MapContainer center={defaultCenter} zoom={13} scrollWheelZoom={true} className="h-full w-full rounded-xl shadow-md z-0" style={{ minHeight: '400px' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <UserLocationMarker />

      {setNewIssuePosition && (
        <LocationMarker position={newIssuePosition} setPosition={setNewIssuePosition} />
      )}

      {issues.map((issue) => {
        if (!issue.location || !issue.location.coordinates) return null;
        // coordinates come from Mongo as [longitude, latitude]
        const position = [issue.location.coordinates[1], issue.location.coordinates[0]];
        return (
          <Marker 
            key={issue._id} 
            position={position}
            eventHandlers={{
              click: () => onIssueClick && onIssueClick(issue)
            }}
          >
            <Popup>
              <strong>{issue.title}</strong><br/>
              Status: {issue.status}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapComponent;
