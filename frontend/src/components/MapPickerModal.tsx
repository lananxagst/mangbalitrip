import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, MapPin, Loader2, Navigation } from "lucide-react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)["_getIconUrl"];
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const BALI_CENTER: L.LatLngExpression = [-8.4095, 115.1889];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (address: string, lat: number, lng: number) => void;
}

export default function MapPickerModal({ isOpen, onClose, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<L.Map | null>(null);
  const markerRef    = useRef<L.Marker | null>(null);
  const [address, setAddress]     = useState("");
  const [coords, setCoords]       = useState<[number, number] | null>(null);
  const [loading, setLoading]     = useState(false);

  const reverseGeocode = async (lat: number, lng: number) => {
    setLoading(true);
    setAddress("");
    setCoords([lat, lng]);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`,
        { headers: { "User-Agent": "MangBaliTrip/1.0" } }
      );
      const data = await res.json();
      setAddress(data.display_name ?? `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    } catch {
      setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      if (!containerRef.current || mapRef.current) return;
      const map = L.map(containerRef.current, { center: BALI_CENTER, zoom: 13 });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);
      map.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        if (markerRef.current) markerRef.current.setLatLng(e.latlng);
        else markerRef.current = L.marker(e.latlng).addTo(map);
        reverseGeocode(lat, lng);
      });
      mapRef.current = map;
    }, 50);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
      setAddress("");
      setCoords(null);
    }
  }, [isOpen]);

  const handleMyLocation = () => {
    if (!navigator.geolocation || !mapRef.current) return;
    navigator.geolocation.getCurrentPosition(({ coords: c }) => {
      const ll = L.latLng(c.latitude, c.longitude);
      mapRef.current!.setView(ll, 15);
      if (markerRef.current) markerRef.current.setLatLng(ll);
      else markerRef.current = L.marker(ll).addTo(mapRef.current!);
      reverseGeocode(c.latitude, c.longitude);
    });
  };

  const handleConfirm = () => {
    if (address && coords) {
      onSelect(address, coords[0], coords[1]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden"
           style={{ maxHeight: "90vh" }}>

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary-50 rounded-xl">
              <MapPin size={15} className="text-primary-500" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Pick Pickup Location</h3>
              <p className="text-xs text-gray-400">Tap anywhere on the map</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={17} />
          </button>
        </div>

        {/* Map */}
        <div className="relative flex-1" style={{ minHeight: 320 }}>
          <div ref={containerRef} className="absolute inset-0" />
          <button
            onClick={handleMyLocation}
            className="absolute bottom-3 right-3 z-[1000] flex items-center gap-1.5 bg-white text-xs font-semibold text-gray-700 px-2.5 py-1.5 rounded-full shadow-md border border-gray-200 hover:border-primary-300 hover:text-primary-500 transition-all"
          >
            <Navigation size={11} className="text-primary-500" /> My Location
          </button>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
          {/* Address preview */}
          <div className={`flex items-start gap-2.5 rounded-xl px-3 py-2.5 mb-4 min-h-[44px] transition-all ${
            address ? "bg-orange-50 border border-orange-100" : "bg-gray-50 border border-gray-100"
          }`}>
            {loading
              ? <Loader2 size={13} className="text-primary-400 animate-spin flex-shrink-0 mt-0.5" />
              : <MapPin size={13} className="text-primary-500 flex-shrink-0 mt-0.5" />
            }
            <p className="text-sm leading-snug text-gray-600">
              {loading ? "Getting address..." : address || "Tap anywhere on the map to set location"}
            </p>
          </div>

          {/* Coords */}
          {coords && !loading && (
            <p className="text-xs font-mono text-gray-400 mb-3 text-center">
              {coords[0].toFixed(6)}, {coords[1].toFixed(6)}
            </p>
          )}

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium hover:bg-gray-50 transition-all">
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!address || loading}
              className="flex-1 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-all"
            >
              Use This Location
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
