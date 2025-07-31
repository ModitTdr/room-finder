import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";

const fetchSuggestions = async (query) => {
   if (!query) return [];
   const res = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${import.meta.env.VITE_API_OPENCAGE}&limit=5`);
   const data = await res.json();
   return data.results.map((r) => ({
      label: r.formatted,
      lat: r.geometry.lat,
      lng: r.geometry.lng,
   }));
};

export default function AddressAutocomplete({
   value,
   onChange,
   onSelect,
   placeholder = "Enter address...",
}) {
   const [inputValue, setInputValue] = useState(value || "");
   const [debouncedValue] = useDebounce(inputValue, 400);
   const [showDropdown, setShowDropdown] = useState(false);
   const inputRef = useRef(null);
   const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

   useEffect(() => {
      setInputValue(value || "");
   }, [value]);

   const updateDropdownPosition = () => {
      if (inputRef.current) {
         const rect = inputRef.current.getBoundingClientRect();
         setDropdownPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width
         });
      }
   };

   useEffect(() => {
      if (showDropdown) {
         updateDropdownPosition();
         
         // Update position during scroll to follow the input
         const handleScroll = () => {
            updateDropdownPosition();
         };
         
         const handleResize = () => {
            updateDropdownPosition();
         };
         
         window.addEventListener('scroll', handleScroll, true);
         window.addEventListener('resize', handleResize);
         
         return () => {
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleResize);
         };
      }
   }, [showDropdown]);

   const { data: suggestions, isLoading } = useQuery({
      queryKey: ["address", debouncedValue],
      queryFn: () => fetchSuggestions(debouncedValue),
      enabled: !!debouncedValue,
   });

   const dropdown = showDropdown && (
      <div 
         className="absolute bg-background border rounded shadow-md max-h-60 overflow-auto"
         style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            zIndex: 9999
         }}
      >
         {isLoading ? (
            <div className="p-2 text-sm text-muted">Loading...</div>
         ) : suggestions?.length > 0 ? (
            suggestions.map((suggestion, i) => (
               <div
                  key={i}
                  className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                  onMouseDown={() => {
                     setInputValue(suggestion.label);
                     onChange(suggestion.label);
                     if (onSelect) onSelect(suggestion);
                     setShowDropdown(false);
                  }}
               >
                  {suggestion.label}
               </div>
            ))
         ) : (
            <div className="p-2 text-sm text-gray-500">No results found.</div>
         )}
      </div>
   );

   return (
      <div className="relative w-full">
         <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => {
               setInputValue(e.target.value);
               setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder={placeholder}
         />
         
         {typeof document !== 'undefined' && createPortal(dropdown, document.body)}
      </div>
   );
}