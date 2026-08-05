"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface SimpleMapComponentProps {
  formData: any;
  setFormData: (data: any) => void;
}

const SimpleMapComponent = ({ formData, setFormData }: SimpleMapComponentProps) => {
  const [position, setPosition] = useState({ lat: 20.5937, lng: 78.9629 });
  const [zoom, setZoom] = useState(5);
  const [locationAccess, setLocationAccess] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<any>(null);

  // Initialize client-side only
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update formData when position changes
  useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      position: { lat: position.lat, lng: position.lng },
    }));
  }, [position, setFormData]);

  // Try to get user's location automatically on mount
  useEffect(() => {
    if (isClient && typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationAccess(true);
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setZoom(15);
        },
        (err) => {
          setLocationDenied(true);
          setLocationAccess(false);
          console.warn("Geolocation failed:", err.message);
          // Create fake coordinates around major Indian cities
          const indianCities = [
            { lat: 28.6139, lng: 77.2090 }, // Delhi
            { lat: 19.0760, lng: 72.8777 }, // Mumbai  
            { lat: 12.9716, lng: 77.5946 }, // Bangalore
            { lat: 13.0827, lng: 80.2707 }, // Chennai
            { lat: 22.5726, lng: 88.3639 }, // Kolkata
            { lat: 17.3850, lng: 78.4867 }  // Hyderabad
          ];
          const randomCity = indianCities[Math.floor(Math.random() * indianCities.length)];
          setPosition({
            lat: randomCity.lat + (Math.random() - 0.5) * 0.1,
            lng: randomCity.lng + (Math.random() - 0.5) * 0.1
          });
          setZoom(10);
        },
        { enableHighAccuracy: true, maximumAge: 0 }
      );
    }
  }, [isClient]);

  const askForLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser.");
      return;
    }

    // Check permissions like React repo does
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
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
              setLocationDenied(false);
              setPosition({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              });
              setZoom(15);
              toast.success("Location detected successfully!");
            },
            (err) => {
              console.error("Geolocation failed:", err.message);
              toast.error("Failed to detect location. Please enter your address manually.");
            },
            { enableHighAccuracy: true, maximumAge: 0 }
          );
        }
      });
    } else {
      // Fallback for browsers without permissions API
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationAccess(true);
          setLocationDenied(false);
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setZoom(15);
          toast.success("Location detected successfully!");
        },
        (err) => {
          console.error("Geolocation failed:", err.message);
          toast.error("Failed to detect location. Please enter your address manually.");
        },
        { enableHighAccuracy: true, maximumAge: 0 }
      );
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Initialize map with pure Leaflet (no React-Leaflet)
  const initializeMap = async () => {
    if (!isClient || mapLoaded || !mapContainerRef.current) return;

    try {
      // Import Leaflet library only, CSS is handled globally
      const L = await import("leaflet");

      // Fix marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Create map instance
      const map = L.map(mapContainerRef.current).setView([position.lat, position.lng], zoom);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Add marker
      const marker = L.marker([position.lat, position.lng]).addTo(map);
      marker.bindPopup(`Latitude: ${position.lat.toFixed(6)}, Longitude: ${position.lng.toFixed(6)}`);

      // Handle map clicks
      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        setPosition({ lat, lng });
        marker.setLatLng([lat, lng]);
        marker.bindPopup(`Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`).openPopup();
        map.setView([lat, lng], 17);
        toast.success("Location selected on map!");
      });

      mapRef.current = map;
      markerRef.current = marker;
      setMapLoaded(true);
    } catch (error) {
      console.error("Failed to load map:", error);
      toast.error("Failed to load map. Please enter your address manually.");
    }
  };

  // Initialize map when component is ready
  useEffect(() => {
    if (isClient && mapContainerRef.current && !mapLoaded) {
      initializeMap();
    }
    
    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
        setMapLoaded(false);
      }
    };
  }, [isClient]);

  // Update marker position when coordinates change
  useEffect(() => {
    if (mapRef.current && markerRef.current && mapLoaded) {
      markerRef.current.setLatLng([position.lat, position.lng]);
      markerRef.current.bindPopup(`Latitude: ${position.lat.toFixed(6)}, Longitude: ${position.lng.toFixed(6)}`);
      mapRef.current.setView([position.lat, position.lng], locationAccess ? 15 : zoom);
    }
  }, [position, mapLoaded, locationAccess, zoom]);

  if (!isClient) {
    return (
      <div className="flex justify-center">
        <Card className="w-full md:rounded-md rounded-t-none h-full">
          <CardHeader>
            <CardTitle>Set your Location</CardTitle>
            <CardDescription>Loading map...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] bg-gray-200 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading map...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <Card className="w-full md:rounded-md rounded-t-none h-full">
        <CardHeader>
          <CardTitle className="flex md:flex-row flex-col justify-between items-center gap-2">
            <div>Set your Location</div>
            <div>
              <Button onClick={askForLocation} variant="outline">
                Detect My Location <MapPin className="ml-2" />
              </Button>
            </div>
          </CardTitle>
          <CardDescription className="mb-4">
            Please select your location on the map or Fetch Current Location and fill in the details.
          </CardDescription>
        </CardHeader>
        
        {/* Map Container - using pure Leaflet */}
        <div
          ref={mapContainerRef}
          className="z-0"
          style={{ height: "500px", width: "100%" }}
        />

        <CardContent className="mt-4">
          {/* Location Form Fields */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="area">
                Area/Locality {locationDenied && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="area"
                value={formData.area || ""}
                onChange={(e) => handleInputChange("area", e.target.value)}
                placeholder="Enter your area/locality"
                required={locationDenied}
                className={locationDenied && !formData.area ? "border-red-300" : ""}
              />
            </div>
            <div>
              <Label htmlFor="state">
                State {locationDenied && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="state"
                value={formData.state || ""}
                onChange={(e) => handleInputChange("state", e.target.value)}
                placeholder="Enter your state"
                required={locationDenied}
                className={locationDenied && !formData.state ? "border-red-300" : ""}
              />
            </div>
            <div>
              <Label htmlFor="pincode">
                Pincode {locationDenied && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="pincode"
                value={formData.pincode || ""}
                onChange={(e) => handleInputChange("pincode", e.target.value)}
                placeholder="Enter your pincode"
                maxLength={6}
                required={locationDenied}
                className={locationDenied && !formData.pincode ? "border-red-300" : ""}
              />
            </div>
          </div>

          {/* Status indicators */}
          {locationAccess && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 font-medium">
                ✓ Your location has been detected automatically
              </p>
            </div>
          )}
          
          {locationDenied && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700">
                <strong>Location access denied.</strong> Please fill in all the address fields above to continue.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleMapComponent;