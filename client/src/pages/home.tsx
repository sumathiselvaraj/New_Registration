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

export default function Home() {
  const [, setLocation] = useLocation();
  const [eventType, setEventType] = useState<string>();

  const handleContinue = () => {
    if (eventType) {
      if (eventType === "Hackathon") {
        setLocation(`/select-track?type=${eventType}`);
      } else {
        setLocation(`/register?type=${eventType}`);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome to Registration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Registration Type</label>
            <Select onValueChange={setEventType}>
              <SelectTrigger>
                <SelectValue placeholder="Select Registration Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hackathon">Hackathon</SelectItem>
                <SelectItem value="Buildathon">Buildathon</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            className="w-full"
            onClick={handleContinue}
            disabled={!eventType}
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}