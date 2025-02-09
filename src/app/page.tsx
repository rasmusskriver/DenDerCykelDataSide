"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
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
  Zap,
  Gauge,
  Users,
  Bike,
  Map as MapIcon,
} from "lucide-react";
const ActivityMap = dynamic(() => import("@/components/ui/ActivityMap"), {
  ssr: false,
});

type Activity = {
  id: number;
  name: string;
  start_date: string;
  distance: number;
  moving_time: number;
  average_cadence: number;
  average_heartrate: number;
  average_speed: number;
  max_speed: number;
  kilojoules: number;
  max_heartrate: number;
  average_watts?: number | null;
  elev_high: number;
  elev_low: number;
  kudos_count: number;
  total_elevation_gain: number;
  max_watts?: number | null;
  map: {
    summary_polyline: string;
  };
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
    const redirectUri = encodeURIComponent(
      "https://den-der-cykel-data-side.vercel.app/callback",
    );
    const scope = "activity:read_all";

    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    localStorage.removeItem("stravaAccessToken");
    setIsAuthenticated(false);
    setActivities([]);
  };

  const ActivityCard = ({ activity }: { activity: Activity }) => {
    return (
      <Card className="overflow-hidden w-full max-w-5xl mx-auto mb-6">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 p-0">
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
                {
                  icon: <Zap className="w-4 h-4 text-black" />, // Lyn-ikon til energi
                  label: "Forbrændte kalorier",
                  value: `${activity.kilojoules} kcal`,
                },
                {
                  icon: <Gauge className="w-4 h-4 text-black" />,
                  label: "Hastighed",
                  value: `${((activity?.average_speed ?? 0) * 3.6).toFixed(1)} km/t / ${(
                    (activity?.max_speed ?? 0) * 3.6
                  ).toFixed(1)} km/t Max`,
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
