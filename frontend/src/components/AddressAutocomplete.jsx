import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

const fetchSuggestions = async (query) => {
   if (!query) return [];
   const res = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
         query
      )}&key=${import.meta.env.VITE_API_OPENCAGE}&limit=5`
   );
   const data = await res.json();
   return data.results.map((r) => r.formatted);
};

export default function AddressAutocomplete({
   value,
   onChange,
   placeholder = "Enter address...",
}) {
   const [inputValue, setInputValue] = useState(value || "");
   const [debouncedValue] = useDebounce(inputValue, 400);
   const [showDropdown, setShowDropdown] = useState(false);

   useEffect(() => {
      setInputValue(value || "");
   }, [value]);

   const { data: suggestions, isLoading } = useQuery({
      queryKey: ["address", debouncedValue],
      queryFn: () => fetchSuggestions(debouncedValue),
      enabled: !!debouncedValue,
   });

   return (
      <div className="relative w-full">
         <Input
            value={inputValue}
            onChange={(e) => {
               const val = e.target.value;
               setInputValue(val);
               setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder={placeholder}
         />
         {showDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-background border rounded shadow-md max-h-60 overflow-y-auto">
               {isLoading ? (
                  <div className="p-2 text-sm text-muted">Loading...</div>
               ) : suggestions?.length > 0 ? (
                  suggestions.map((suggestion, i) => (
                     <div
                        key={i}
                        className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                        onMouseDown={() => {
                           setInputValue(suggestion);
                           onChange(suggestion);
                           setShowDropdown(false);
                        }}
                     >
                        {suggestion}
                     </div>
                  ))
               ) : (
                  <div className="p-2 text-sm text-gray-500">No results found.</div>
               )}
            </div>
         )}
      </div>
   );
}

