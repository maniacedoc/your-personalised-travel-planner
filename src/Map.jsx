import React, { useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

const Map = ({ locations = [], center = { lat: 12.9716, lng: 77.5946 }, zoom = 10, height = "400px" }) => {
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);

  const render = (status) => {
    switch (status) {
      case Status.LOADING:
        return <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">Loading map...</div>;
      case Status.FAILURE:
        return <div className="flex items-center justify-center h-full bg-red-100 rounded-lg text-red-600">Error loading Google Maps</div>;
      case Status.SUCCESS:
        return <MapContent locations={locations} center={center} zoom={zoom} mapRef={mapRef} setMap={setMap} height={height} />;
    }
  };

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg">
      <Wrapper apiKey={import.meta.env.GOOGLE_MAPS_API_KEY} render={render} />
    </div>
  );
};

const MapContent = ({ locations, center, zoom, mapRef, setMap, height }) => {
  useEffect(() => {
    if (!window.google) return;

    const mapOptions = {
      center,
      zoom,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
    };

    const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);

    // Add markers for locations
    if (locations.length > 0) {
      addMarkers(newMap, locations);
    }
  }, [locations, center, zoom, setMap]);

  return <div ref={mapRef} style={{ width: '100%', height }} className="rounded-lg" />;
};

const addMarkers = (map, locations) => {
  const bounds = new window.google.maps.LatLngBounds();

  locations.forEach((location, index) => {
    if (location.lat && location.lng) {
      const marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.name || `Location ${index + 1}`,
        label: (index + 1).toString(),
      });

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold">${location.name || `Location ${index + 1}`}</h3>
            ${location.description ? `<p class="text-sm text-gray-600">${location.description}</p>` : ''}
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      bounds.extend(marker.getPosition());
    }
  });

  // Fit map to show all markers
  if (locations.length > 1) {
    map.fitBounds(bounds);
  }
};

export default Map;
