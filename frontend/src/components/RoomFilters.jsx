import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const RoomFilters = ({ rooms, onFilteredRooms }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Extract unique values from rooms
  const roomTypes = useMemo(() => {
    return [...new Set(rooms?.map(room => room.roomType) || [])];
  }, [rooms]);

  const amenities = useMemo(() => {
    const allAmenities = rooms?.flatMap(room => room.amenities) || [];
    return [...new Set(allAmenities)].sort();
  }, [rooms]);

  // Filter logic
  const filteredRooms = useMemo(() => {
    if (!rooms) return [];

    return rooms.filter(room => {
      // Search filter (title, description, address)
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' ||
        room.title.toLowerCase().includes(searchLower) ||
        room.description.toLowerCase().includes(searchLower) ||
        room.address.toLowerCase().includes(searchLower);

      // Price filter
      const minPrice = priceRange.min ? parseInt(priceRange.min) : 0;
      const maxPrice = priceRange.max ? parseInt(priceRange.max) : Infinity;
      const matchesPrice = room.price >= minPrice && room.price <= maxPrice;

      // Room type filter
      const matchesRoomType = selectedRoomTypes.length === 0 ||
        selectedRoomTypes.includes(room.roomType);

      // Amenities filter
      const matchesAmenities = selectedAmenities.length === 0 ||
        selectedAmenities.every(amenity => room.amenities.includes(amenity));

      return matchesSearch && matchesPrice && matchesRoomType && matchesAmenities;
    });
  }, [rooms, searchTerm, priceRange, selectedRoomTypes, selectedAmenities]);

  // Update parent component with filtered rooms
  useMemo(() => {
    onFilteredRooms(filteredRooms);
  }, [filteredRooms, onFilteredRooms]);

  const toggleRoomType = (type) => {
    setSelectedRoomTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setPriceRange({ min: '', max: '' });
    setSelectedRoomTypes([]);
    setSelectedAmenities([]);
  };

  const hasActiveFilters = searchTerm || priceRange.min || priceRange.max ||
    selectedRoomTypes.length > 0 || selectedAmenities.length > 0;

  return (
    <div className="mb-6 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search by name, description, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
        />
      </div>

      {/* Filter Toggle & Clear Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${showFilters
            ? 'bg-orange-600 border-orange-600 text-white'
            : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-orange-600'
            }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
          {(selectedRoomTypes.length > 0 || selectedAmenities.length > 0 || priceRange.min || priceRange.max) && (
            <Badge className="ml-1 bg-orange-700 hover:bg-orange-700">
              {selectedRoomTypes.length + selectedAmenities.length + (priceRange.min ? 1 : 0) + (priceRange.max ? 1 : 0)}
            </Badge>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-300 hover:border-red-600 hover:text-red-500 transition-colors"
          >
            <X className="h-4 w-4" />
            <span>Clear All</span>
          </button>
        )}

        <div className="ml-auto text-sm text-gray-400">
          {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'} found
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 space-y-6">
          {/* Price Range */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Price Range</h3>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
              />
              <span className="text-gray-500">—</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Room Type */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Room Type</h3>
            <div className="flex flex-wrap gap-2">
              {roomTypes.map(type => (
                <button
                  key={type}
                  onClick={() => toggleRoomType(type)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${selectedRoomTypes.includes(type)
                    ? 'bg-orange-600 border-orange-600 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-orange-600'
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Amenities</h3>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {amenities.map(amenity => (
                <button
                  key={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${selectedAmenities.includes(amenity)
                    ? 'bg-orange-600 border-orange-600 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-orange-600'
                    }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomFilters;
