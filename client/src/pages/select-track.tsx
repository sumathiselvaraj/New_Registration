import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getHackathonOptionsForTrack } from "@shared/schema";

const trackTypes = ["SDET", "DA", "DEV", "SMPO"] as const;

export default function SelectTrack() {
  const [, setLocation] = useLocation();
  const [track, setTrack] = useState<string>();
  const [hackathonType, setHackathonType] = useState<string>();
  const searchParams = new URLSearchParams(window.location.search);
  const eventType = searchParams.get("type");

  // Get hackathon options based on selected track
  const hackathonOptions = track ? getHackathonOptionsForTrack(track) : [];

  const handleContinue = () => {
    if (track && hackathonType) {
      setLocation(`/register?type=${eventType}&track=${track}&hackathonType=${hackathonType}`);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Select Your Track and Event Type
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Track</label>
            <Select onValueChange={(value) => {
              setTrack(value);
              setHackathonType(undefined); // Reset hackathon type when track changes
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select your track" />
              </SelectTrigger>
              <SelectContent>
                {trackTypes
                  .filter(track => hackathonType !== "API_REST Assured" || track !== "DA")
                  .map((track) => (
                    <SelectItem key={track} value={track}>
                      {track}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {track && hackathonOptions.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Hackathon Type</label>
              <Select onValueChange={setHackathonType} value={hackathonType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select hackathon type" />
                </SelectTrigger>
                <SelectContent>
                  {hackathonOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button 
            className="w-full"
            onClick={handleContinue}
            disabled={!track || !hackathonType}
          >
            Continue to Registration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}