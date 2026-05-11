import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { MapPin, Loader2, X, Map } from "lucide-react";
import MapPickerModal from "./MapPickerModal";

interface Suggestion {
  id: string;
  place_name: string;
  lat: number;
  lng: number;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  wrapperClassName?: string;
}

const DEFAULT_WRAPPER =
  "flex items-center gap-2.5 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all";

export default function LocationAutocomplete({
  value,
  onChange,
  placeholder,
  wrapperClassName,
}: Props) {
  const [suggestions, setSuggestions]     = useState<Suggestion[]>([]);
  const [loading, setLoading]             = useState(false);
  const [showDropdown, setShowDropdown]   = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const [mapOpen, setMapOpen]             = useState(false);
  const [confirmed, setConfirmed]         = useState(false);
  const [coords, setCoords]               = useState<[number, number] | null>(null);

  const wrapperRef  = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { if (!value) { setConfirmed(false); setCoords(null); } }, [value]);

  const updatePosition = () => {
    if (!wrapperRef.current) return;
    const r = wrapperRef.current.getBoundingClientRect();
    setDropdownStyle({ position: "fixed", top: r.bottom + 4, left: r.left, width: r.width, zIndex: 9999 });
  };

  useEffect(() => {
    const outside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
        setShowDropdown(false);
    };
    const scroll = () => setShowDropdown(false);
    document.addEventListener("mousedown", outside);
    window.addEventListener("scroll", scroll, true);
    return () => {
      document.removeEventListener("mousedown", outside);
      window.removeEventListener("scroll", scroll, true);
    };
  }, []);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setSuggestions([]); setShowDropdown(false); return; }
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q, format: "json", limit: "5", countrycodes: "id",
        addressdetails: "0", "accept-language": "en", viewbox: "114.4,-9.2,116.0,-7.9",
      });
      const res  = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
        headers: { "User-Agent": "MangBaliTrip/1.0" },
      });
      const data: NominatimResult[] = await res.json();
      const results: Suggestion[] = data.map((d) => ({
        id: String(d.place_id), place_name: d.display_name,
        lat: parseFloat(d.lat), lng: parseFloat(d.lon),
      }));
      setSuggestions(results);
      if (results.length > 0) { updatePosition(); setShowDropdown(true); }
      else setShowDropdown(false);
    } catch { setSuggestions([]); setShowDropdown(false); }
    finally { setLoading(false); }
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    setConfirmed(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 350);
  };

  const handleSelect = (s: Suggestion) => {
    onChange(s.place_name);
    setCoords([s.lat, s.lng]);
    setSuggestions([]);
    setShowDropdown(false);
    setConfirmed(true);
  };

  const handleMapSelect = (addr: string, lat: number, lng: number) => {
    onChange(addr);
    setCoords([lat, lng]);
    setSuggestions([]);
    setShowDropdown(false);
    setConfirmed(true);
  };

  const handleClear = () => {
    onChange(""); setConfirmed(false); setCoords(null); setSuggestions([]);
  };

  /* ══ CONFIRMED CARD (GoFood style) ══════════════════════ */
  if (confirmed && value) {
    return (
      <>
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          {/* Location row */}
          <div className="flex items-start gap-3 px-4 py-3.5 bg-white">
            <div className="flex-shrink-0 pt-1">
              <div className="w-3 h-3 rounded-full bg-primary-500 ring-[3px] ring-primary-100" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest mb-0.5">Pickup</p>
              <p className="text-sm font-medium text-gray-800 leading-snug break-words">{value}</p>
              {coords && (
                <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                  {coords[0].toFixed(5)}, {coords[1].toFixed(5)}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="flex-shrink-0 text-gray-300 hover:text-red-400 p-1 rounded-full hover:bg-red-50 transition-all"
            >
              <X size={14} />
            </button>
          </div>

          {/* OSM iframe preview (only when coords available) */}
          {coords && (
            <div className="relative border-t border-gray-100" style={{ height: 140 }}>
              <iframe
                title="map-preview"
                className="w-full h-full pointer-events-none"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords[1]-0.012},${coords[0]-0.009},${coords[1]+0.012},${coords[0]+0.009}&layer=mapnik&marker=${coords[0]},${coords[1]}`}
                style={{ border: 0 }}
              />
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-2 right-2 bg-white text-xs text-primary-500 font-semibold px-3 py-1.5 rounded-full shadow border border-primary-100 hover:bg-primary-50 transition-all"
              >
                Change
              </button>
            </div>
          )}
        </div>

        {mapOpen && (
          <MapPickerModal isOpen={mapOpen} onClose={() => setMapOpen(false)} onSelect={handleMapSelect} />
        )}
      </>
    );
  }

  /* ══ INPUT + MAP BUTTON ══════════════════════════════════ */
  return (
    <>
      <div ref={wrapperRef} className="space-y-2">
        {/* Text input */}
        <div className={wrapperClassName ?? DEFAULT_WRAPPER}>
          <MapPin size={16} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={value}
            onChange={handleInput}
            onFocus={() => { if (suggestions.length > 0) { updatePosition(); setShowDropdown(true); } }}
            placeholder={placeholder}
            autoComplete="off"
            className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder-gray-400"
          />
          {loading && <Loader2 size={14} className="text-gray-400 animate-spin flex-shrink-0" />}
        </div>

        {/* Pick on Map button */}
        <button
          type="button"
          onClick={() => setMapOpen(true)}
          className="w-full group flex items-center gap-3 px-4 py-2.5 rounded-xl border border-dashed border-primary-200 hover:border-primary-400 bg-orange-50/50 hover:bg-orange-50 transition-all duration-200 text-left"
        >
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-primary-300 rounded-full animate-ping opacity-30" />
            <div className="relative w-7 h-7 bg-primary-500 group-hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors">
              <Map size={13} className="text-white" />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700">Pick on Interactive Map</p>
            <p className="text-[11px] text-gray-400">Tap a point on Bali map</p>
          </div>
        </button>
      </div>

      {/* Autocomplete dropdown */}
      {showDropdown && suggestions.length > 0 && createPortal(
        <div style={dropdownStyle} className="bg-white border border-gray-100 rounded-xl shadow-2xl py-1 overflow-hidden">
          {suggestions.map((s) => (
            <button
              key={s.id}
              onMouseDown={() => handleSelect(s)}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-primary-600 flex items-start gap-2.5 transition-colors"
            >
              <MapPin size={13} className="text-primary-400 flex-shrink-0 mt-0.5" />
              <span className="leading-snug">{s.place_name}</span>
            </button>
          ))}
        </div>,
        document.body
      )}

      {mapOpen && (
        <MapPickerModal isOpen={mapOpen} onClose={() => setMapOpen(false)} onSelect={handleMapSelect} />
      )}
    </>
  );
}
