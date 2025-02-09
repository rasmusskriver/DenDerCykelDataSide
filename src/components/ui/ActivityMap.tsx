"use client";

import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

type ActivityMapProps = {
  polyline: string;
};

const ActivityMap = ({ polyline }: ActivityMapProps) => {
  // Funktion til at dekode polyline-data
  const decodePolyline = (polyline: string) => {
    const coordinates: [number, number][] = [];
    let index = 0;
    const len = polyline.length; // Her bruger vi 'const', da len ikke ændres
    let lat = 0;
    let lng = 0;

    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = polyline.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result >> 1) ^ -(result & 1);
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = polyline.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result >> 1) ^ -(result & 1);
      lng += dlng;

      coordinates.push([lat / 1e5, lng / 1e5]);
    }
    return coordinates;
  };

  const coordinates = decodePolyline(polyline);

  if (!coordinates || coordinates.length === 0) {
    return <p>Ingen kortdata tilgængelig</p>;
  }

  // Udregn bounding box for ruten
  const latitudes = coordinates.map((coord) => coord[0]);
  const longitudes = coordinates.map((coord) => coord[1]);
  const bounds: [[number, number], [number, number]] = [
    [Math.min(...latitudes), Math.min(...longitudes)],
    [Math.max(...latitudes), Math.max(...longitudes)],
  ];

  // Beregn evt. et center (kan bruges som fallback)
  const center: [number, number] = [
    (bounds[0][0] + bounds[1][0]) / 2,
    (bounds[0][1] + bounds[1][1]) / 2,
  ];

  // Custom komponent der "fitter" kortet til de udregnede bounds
  const FitBounds = ({
    bounds,
  }: {
    bounds: [[number, number], [number, number]];
  }) => {
    const map = useMap();
    useEffect(() => {
      map.fitBounds(bounds);
    }, [map, bounds]);
    return null;
  };

  return (
    <MapContainer
      center={center} // Bruges som initialt center
      zoom={13} // Startzoom; vil blive overskrevet af fitBounds
      style={{ height: "400px", width: "100%" }}
      scrollWheelZoom={false} // Deaktiverer scroll zoom
      dragging={false} // Deaktiverer panoreringsmulighed
      touchZoom={false} // Deaktiverer zoom med touch
      doubleClickZoom={false} // Deaktiverer zoom ved dobbeltklik
      boxZoom={false} // Deaktiverer zoom med bokse
      keyboard={false} // Deaktiverer tastaturkontroller
      attributionControl={false} // Deaktiverer attribution control (om ønsket)
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Polyline positions={coordinates} color="blue" />
      <FitBounds bounds={bounds} />
    </MapContainer>
  );
};

export default ActivityMap;
