"use client";

import { useState, useEffect } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUploadLocation } from "@/hooks/useUploadLocation";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { ChevronRight, MapPin } from "lucide-react";

const MapFormSchema = z.object({
  area: z.string().min(1, "Area is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Pincode must be at least 6 characters"),
});

interface LocationProps {
  onNext: () => void;
  model?: string;
  fromSettings?: boolean;
}

export default function Location({ onNext, model = "teacher", fromSettings = false }: LocationProps) {
  const [position, setPosition] = useState({ lat: 20.5937, lng: 78.9629 }); // Default to India's coordinates
  const [locationAccess, setLocationAccess] = useState(false);
  
  const { handleMapForm, loading } = useUploadLocation(fromSettings);

  const form = useForm({
    resolver: zodResolver(MapFormSchema),
    defaultValues: {
      area: "",
      state: "",
      pincode: "",
    },
  });

  const askForLocation = () => {
    navigator.permissions?.query({ name: "geolocation" }).then((result) => {
      if (result.state === "denied") {
        alert(
          "Location access is blocked for this site.\n\n" +
          "To re-enable:\n" +
          "1. Click the 🔒 lock icon in your browser's address bar.\n" +
          "2. Go to 'Site settings' or 'Permissions'.\n" +
          "3. Set 'Location' to 'Allow'.\n" +
          "4. Refresh this page."
        );
      } else {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLocationAccess(true);
            setPosition({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          },
          (err) => {
            console.error("Geolocation failed:", err.message);
            setLocationAccess(false);
          },
          { enableHighAccuracy: true, maximumAge: 0 }
        );
      }
    });
  };

  useEffect(() => {
    // Try to get user's location on component mount
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setLocationAccess(true);
        setPosition({ 
          lat: pos.coords.latitude, 
          lng: pos.coords.longitude 
        });
      },
      (err) => {
        setLocationAccess(false);
        console.warn("Geolocation failed:", err.message);
      },
      { enableHighAccuracy: true, maximumAge: 0 }
    );
  }, []);

  const onSubmit = async (values: any) => {
    await handleMapForm(values, position, model);
    if (!fromSettings) {
      onNext();
    }
  };

  return (
    <div className="flex justify-center">
      <Card className={`${fromSettings ? "w-1/2" : "w-full"} md:rounded-md rounded-t-none h-full`}>
        <CardHeader>
          <CardTitle className="flex md:flex-row flex-col justify-between items-center gap-2">
            <div>
              {fromSettings ? "Update Your Location" : "Set your Location"}
            </div>
            <div>
              {!locationAccess && (
                <LoadingButton
                  onClick={askForLocation}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  variant="outline"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Get Current Location
                </LoadingButton>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Area/Locality <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your area or locality" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      State <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your state" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Pincode <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter your pincode"
                        maxLength={6}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {locationAccess && (
                <div className="text-sm text-green-600 flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  Location access granted. Your coordinates: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
                </div>
              )}

              <div className="flex justify-end mt-8">
                <LoadingButton
                  className="bg-green-700 hover:bg-green-900"
                  isLoading={loading}
                  type="submit"
                >
                  {fromSettings ? "Update Location" : "Complete Profile"} 
                  <ChevronRight className="ml-2 w-4 h-4" />
                </LoadingButton>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}