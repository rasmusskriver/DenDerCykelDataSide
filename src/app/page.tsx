"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/Spinner";
import {
  Activity as ActivityIcon,
  Heart,
  LogOut,
  Ruler,
  Timer,
  TrendingUp,
  Users,
  Bike,
  Map as MapIcon,
} from "lucide-react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Sikrer at ikoner vises korrekt
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
//   iconUrl: require("leaflet/dist/images/marker-icon.png"),
//   shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
// });

type PhotosSummary_primary = {
  id: number;
  source: number;
  unique_id: string;
  urls: {
    small?: string;
    medium?: string;
    large?: string;
    original?: string;
  };
};

type Activity = {
  id: number;
  name: string;
  start_date: string;
  distance: number;
  moving_time: number;
  average_cadence: number;
  average_heartrate: number;
  average_watts?: number | null;
  elev_high: number;
  elev_low: number;
  kudos_count: number;
  total_elevation_gain: number;
  max_watts?: number | null;
  map: {
    summary_polyline: string;
  };
  photos?: PhotosSummary_primary[];
};

const StravaActivity = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchActivities = useCallback(async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://www.strava.com/api/v3/athlete/activities",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Kunne ikke hente aktiviteter");
      }

      const data: Activity[] = await res.json();
      setActivities(data);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Fejl ved hentning af aktiviteter",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("stravaAccessToken");
    if (token) {
      setIsAuthenticated(true);
      fetchActivities(token);
    }
  }, [fetchActivities]);

  const handleStravaAuth = () => {
    const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
    const redirectUri = encodeURIComponent("http://localhost:3000/callback");
    const scope = "activity:read_all";

    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    localStorage.removeItem("stravaAccessToken");
    setIsAuthenticated(false);
    setActivities([]);
  };

  const ActivityMap = ({ polyline }: { polyline: string }) => {
    const decodePolyline = (polyline: string) => {
      const coordinates: [number, number][] = [];
      let index = 0,
        len = polyline.length;
      let lat = 0,
        lng = 0;

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

    const center = coordinates[0];

    return (
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Polyline positions={coordinates} color="blue" />
      </MapContainer>
    );
  };

  const ActivityCard = ({ activity }: { activity: Activity }) => {
    // Find det første billede, hvis der er nogen
    const photoUrl =
      activity.photos && activity.photos.length > 0
        ? activity.photos[0].urls.medium ||
          activity.photos[0].urls.small ||
          activity.photos[0].urls.original ||
          ""
        : "";

    return (
      <Card className="overflow-hidden w-full max-w-3xl mx-auto mb-6">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 p-0">
          {/* Billede øverst */}
          {photoUrl && (
            <img
              src={photoUrl}
              alt={`Photo from ${activity.name}`}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <CardTitle className="text-white">{activity.name}</CardTitle>
            <p className="text-orange-100 text-2xl font-semibold">
              {new Date(activity.start_date).toLocaleDateString("da-DK")}
            </p>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: <Ruler className="w-4 h-4 text-black" />,
                  label: "Distance",
                  value: `${(activity.distance / 1000).toFixed(2)} km`,
                },
                {
                  icon: <Timer className="w-4 h-4 text-black" />,
                  label: "Tid",
                  value: `${Math.round(activity.moving_time / 60)} min`,
                },
                {
                  icon: <Heart className="w-4 h-4 text-black" />,
                  label: "Puls",
                  value: `${activity.average_heartrate.toFixed(1)} bpm / ${activity.max_heartrate} bpm Max`,
                },
                {
                  icon: <Bike className="w-4 h-4 text-black" />,
                  label: "Watt",
                  value: `${activity.average_watts?.toFixed(1) || 0} W / ${
                    activity.max_watts?.toFixed(1) || 0
                  } W Max`,
                },
              ].map(({ icon, label, value }) => (
                <div className="flex items-center gap-2" key={label}>
                  {icon}
                  <div>
                    <p className="text-sm text-black">{label}</p>
                    <p className="font-medium text-black">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gray-500" />
                <div className="flex gap-2 text-sm text-gray-600">
                  <span>↑ {Math.round(activity.elev_high)}m</span>
                  <span>↓ {Math.round(activity.elev_low)}m</span>
                  <span>
                    Total elevation {Math.round(activity.total_elevation_gain)}m
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {activity.kudos_count} kudos
                </span>
              </div>
            </div>
            {activity.map.summary_polyline ? (
              <div className="flex items-center gap-2 mt-2">
                <MapIcon className="w-4 h-4 text-gray-500" />
                <ActivityMap polyline={activity.map.summary_polyline} />
              </div>
            ) : (
              <div className="mt-2 text-gray-500">
                Ingen kortdata tilgængelig
              </div>
            )}
            {/* Fjern billeder herfra, da det nu vises i toppen */}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Strava Aktiviteter</h1>
        {isAuthenticated && (
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Log ud
          </Button>
        )}
      </div>

      {!isAuthenticated ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <ActivityIcon className="w-16 h-16 text-orange-500 mb-4" />
            <Button
              onClick={handleStravaAuth}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Forbind med Strava
            </Button>
          </CardContent>
        </Card>
      ) : loading ? (
        <Spinner />
      ) : activities.length > 0 ? (
        <div>
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            Ingen aktiviteter fundet
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default StravaActivity;
