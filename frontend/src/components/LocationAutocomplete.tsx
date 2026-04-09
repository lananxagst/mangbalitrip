import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { MapPin, Loader2 } from "lucide-react";

interface Suggestion {
  id: string;
  place_name: string;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
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
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updatePosition = () => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    }
  };

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    const handleScroll = () => setShowDropdown(false);
    document.addEventListener("mousedown", handleOutside);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q,
        format: "json",
        limit: "5",
        countrycodes: "id",
        addressdetails: "0",
        "accept-language": "en",
        viewbox: "114.4,-9.2,116.0,-7.9",
      });
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?${params}`,
        { headers: { "User-Agent": "MangBaliTrip/1.0" } }
      );
      const data: NominatimResult[] = await res.json();
      const results: Suggestion[] = data.map((item) => ({
        id: String(item.place_id),
        place_name: item.display_name,
      }));
      setSuggestions(results);
      if (results.length > 0) {
        updatePosition();
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    } catch {
      setSuggestions([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 350);
  };

  const handleSelect = (s: Suggestion) => {
    onChange(s.place_name);
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <div ref={wrapperRef} className={wrapperClassName ?? DEFAULT_WRAPPER}>
      <MapPin size={16} className="text-gray-400 flex-shrink-0" />
      <input
        type="text"
        value={value}
        onChange={handleInput}
        onFocus={() => {
          if (suggestions.length > 0) {
            updatePosition();
            setShowDropdown(true);
          }
        }}
        placeholder={placeholder}
        autoComplete="off"
        className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder-gray-400"
      />
      {loading && (
        <Loader2 size={14} className="text-gray-400 animate-spin flex-shrink-0" />
      )}

      {showDropdown &&
        suggestions.length > 0 &&
        createPortal(
          <div
            style={dropdownStyle}
            className="bg-white border border-gray-100 rounded-xl shadow-2xl py-1 overflow-hidden"
          >
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
    </div>
  );
}
