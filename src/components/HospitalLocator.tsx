import React, { useState, useEffect, useId } from 'react';
import { HospitalFacility } from '../types';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Phone,
  Navigation,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Search,
  CheckCircle2,
  X,
  ExternalLink,
  ChevronRight,
  Info,
  Hospital,
  Filter,
  Flame,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HospitalLocatorProps {
  onBackToPartners?: () => void;
}

export const HospitalLocator: React.FC<HospitalLocatorProps> = ({ onBackToPartners }) => {
  const { user } = useApp();
  const searchInputId = useId();

  // State
  const [facilities, setFacilities] = useState<HospitalFacility[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [permissionStatusMessage, setPermissionStatusMessage] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'verified' | 'emergency' | 'maternity'>('all');
  const [selectedFacility, setSelectedFacility] = useState<HospitalFacility | null>(null);
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);
  const [usingLiveGooglePlaces, setUsingLiveGooglePlaces] = useState<boolean>(false);

  // Fetch facilities from server-side endpoint
  const fetchNearbyFacilities = async (
    lat?: number,
    lng?: number,
    manualQuery?: string,
    filter: string = activeFilter
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (lat !== undefined && lng !== undefined) {
        params.append('lat', lat.toString());
        params.append('lng', lng.toString());
      }
      if (manualQuery && manualQuery.trim()) {
        params.append('query', manualQuery.trim());
      }
      if (filter && filter !== 'all') {
        params.append('type', filter);
      }

      const res = await fetch(`/api/hospitals/nearby?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to load facilities');
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.facilities)) {
        setFacilities(data.facilities);
        setUsingLiveGooglePlaces(!!data.usingGooglePlacesLive);
      }
    } catch (err) {
      console.error('Error fetching nearby hospitals:', err);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  // User initiates location request
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setPermissionDenied(true);
      setPermissionStatusMessage('Geolocation is not supported by your device browser. You can search manually below.');
      fetchNearbyFacilities(6.6885, -1.6244, '', activeFilter);
      return;
    }

    setLoading(true);
    setPermissionDenied(false);
    setPermissionStatusMessage('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserCoords(coords);
        setPermissionDenied(false);
        fetchNearbyFacilities(coords.lat, coords.lng, searchQuery, activeFilter);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setLoading(false);
        setHasSearched(true);
        if (error.code === error.PERMISSION_DENIED) {
          setPermissionDenied(true);
          setPermissionStatusMessage(
            'Location access was not granted. To use your current GPS location, please enable location permissions in your browser or device settings. You can also search manually below.'
          );
        } else {
          setPermissionStatusMessage('Unable to retrieve your precise location. Showing facilities in the Kumasi district.');
        }
        // Fallback search with default Kumasi coordinates so user isn't stuck
        fetchNearbyFacilities(6.6885, -1.6244, searchQuery, activeFilter);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // 5 min cache
      }
    );
  };

  // Handle manual query submit
  const handleManualSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const lat = userCoords?.lat ?? 6.6885;
    const lng = userCoords?.lng ?? -1.6244;
    fetchNearbyFacilities(lat, lng, searchQuery, activeFilter);
  };

  // Preset location quick chips
  const handlePresetSelect = (preset: string) => {
    setSearchQuery(preset);
    const lat = userCoords?.lat ?? 6.6885;
    const lng = userCoords?.lng ?? -1.6244;
    fetchNearbyFacilities(lat, lng, preset, activeFilter);
  };

  // Filter change
  const handleFilterChange = (filter: 'all' | 'verified' | 'emergency' | 'maternity') => {
    setActiveFilter(filter);
    const lat = userCoords?.lat ?? 6.6885;
    const lng = userCoords?.lng ?? -1.6244;
    fetchNearbyFacilities(lat, lng, searchQuery, filter);
  };

  // Load initial results once if user hasn't searched yet
  useEffect(() => {
    fetchNearbyFacilities(6.6885, -1.6244, '', 'all');
  }, []);

  return (
    <div id="hospital-locator-feature" className="space-y-5">
      {/* Back button & Title bar */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#E61964]">
            Mama Yie Health Services
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#1E232B]">
            Find a Hospital Near Me
          </h2>
        </div>
        {onBackToPartners && (
          <button
            id="back-to-partners-btn"
            onClick={onBackToPartners}
            className="text-xs font-bold text-[#64748B] hover:text-[#1E232B] px-3 py-1.5 rounded-xl bg-white border border-[#F0EBE9] cursor-pointer shadow-xs"
          >
            ← Verified Partners
          </button>
        )}
      </div>

      {/* Emergency Pathway Banner */}
      <div
        id="emergency-pathway-banner"
        className="bg-[#FFF4F2] rounded-2xl p-4 border-2 border-[#FECACA] flex items-start gap-3 shadow-xs"
      >
        <div className="w-9 h-9 rounded-xl bg-[#DC2626] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#DC2626]">
              Emergency Pathway
            </span>
            <button
              id="open-emergency-guidance-btn"
              onClick={() => setShowEmergencyModal(true)}
              className="text-[11px] font-bold text-[#DC2626] underline cursor-pointer hover:text-[#B91C1C]"
            >
              Emergency Helpline (193) →
            </button>
          </div>
          <p className="text-xs text-[#7F1D1D] mt-0.5 leading-relaxed">
            Severe pain, heavy bleeding, high fever, or reduced baby movements?
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <a
              id="emergency-call-193-btn"
              href="tel:193"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[11px] font-bold rounded-lg shadow-xs"
            >
              <Phone className="w-3 h-3" />
              <span>Call Ambulance: 193</span>
            </a>
            <button
              id="emergency-checklist-btn"
              onClick={() => setShowEmergencyModal(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#FECACA] text-[#7F1D1D] text-[11px] font-semibold rounded-lg hover:bg-[#FFF4F2]"
            >
              <span>View Danger Signs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Location Activation Card */}
      <div className="bg-white rounded-3xl p-5 border-2 border-[#F0EBE9] shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              GPS Proximity Search
            </span>
            <h3 className="font-serif font-bold text-lg text-[#1E232B]">
              Use Current Location
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
              {userCoords
                ? `Using your coordinates (${userCoords.lat.toFixed(3)}, ${userCoords.lng.toFixed(3)})`
                : 'Request location once to calculate accurate travel distance to the closest maternity wards.'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#FDF2F5] text-[#E61964] flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
        </div>

        {/* Action Button: Get Location */}
        <button
          id="request-user-location-btn"
          onClick={handleRequestLocation}
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-[#E61964] hover:bg-[#D01255] active:scale-[0.99] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          <Navigation className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Finding Nearby Facilities...' : 'Use My Current Location'}</span>
        </button>

        {/* Permission Denied / Explanation Notice */}
        {permissionDenied && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 bg-[#FAF8F8] rounded-2xl border border-[#F0EBE9] space-y-2 text-xs"
          >
            <div className="flex items-start gap-2 text-[#991B1B]">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#E61964]" />
              <p className="leading-relaxed">
                {permissionStatusMessage ||
                  'Location access was denied. You can enable location permission in your device settings, or search manually below.'}
              </p>
            </div>
            <div className="text-[11px] text-[#64748B] bg-white p-2.5 rounded-xl border border-[#F0EBE9]">
              <strong>How to enable:</strong> In your browser tap the lock / settings icon beside the URL bar → Permissions → Allow Location, then tap "Use My Current Location" again.
            </div>
          </motion.div>
        )}

        {/* Manual Search Input */}
        <form onSubmit={handleManualSearch} className="pt-2 border-t border-[#F0EBE9] space-y-2">
          <label htmlFor={searchInputId} className="block text-[11px] font-bold text-[#64748B]">
            Or search by town, neighborhood, or facility name:
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                id={searchInputId}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Suntreso, Bantama, Adum, KATH..."
                className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F8] border border-[#F0EBE9] rounded-xl text-xs text-[#1E232B] focus:outline-none focus:border-[#E61964] focus:bg-white"
              />
              <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-3" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    fetchNearbyFacilities(userCoords?.lat ?? 6.6885, userCoords?.lng ?? -1.6244, '', activeFilter);
                  }}
                  className="absolute right-2.5 top-2.5 text-[#64748B] hover:text-[#1E232B]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              id="manual-search-submit-btn"
              type="submit"
              className="px-4 py-2.5 bg-[#1E232B] hover:bg-[#2D3748] text-white text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
            >
              Search
            </button>
          </div>

          {/* Quick preset location chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 no-scrollbar text-[11px]">
            <span className="text-[#64748B] shrink-0 font-medium">Quick areas:</span>
            {['Suntreso', 'Bantama', 'Adum', 'Manhyia', 'Tafo', 'Accra'].map((chip) => (
              <button
                key={chip}
                type="button"
                id={`location-chip-${chip.toLowerCase()}`}
                onClick={() => handlePresetSelect(chip)}
                className={`px-2.5 py-1 rounded-lg border text-xs whitespace-nowrap cursor-pointer transition-colors ${
                  searchQuery === chip
                    ? 'bg-[#E61964] text-white border-[#E61964]'
                    : 'bg-white text-[#64748B] border-[#F0EBE9] hover:bg-[#FDF2F5]'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Safety Notice & Distinction Banner */}
      <div className="bg-white rounded-2xl p-3.5 border border-[#F0EBE9] flex items-start gap-2.5 text-xs text-[#64748B] shadow-2xs">
        <ShieldCheck className="w-4 h-4 text-[#2E7D46] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-[#1E232B]">Verified vs. Public Facilities: </strong>
          Facilities with the green <span className="font-bold text-[#2E7D46]">Verified Partner</span> badge accept Mama Yie Fund vouchers at negotiated rates. Public facilities from Google Places are unverified directory listings; please verify services directly.
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        <button
          id="filter-all-btn"
          onClick={() => handleFilterChange('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeFilter === 'all'
              ? 'bg-[#1E232B] text-white shadow-xs'
              : 'bg-white text-[#64748B] border border-[#F0EBE9] hover:bg-[#FAF8F8]'
          }`}
        >
          All Facilities ({facilities.length})
        </button>
        <button
          id="filter-verified-btn"
          onClick={() => handleFilterChange('verified')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
            activeFilter === 'verified'
              ? 'bg-[#2E7D46] text-white shadow-xs'
              : 'bg-white text-[#2E7D46] border border-[#BAE3C2] hover:bg-[#EDF7EE]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified Partners Only</span>
        </button>
        <button
          id="filter-emergency-btn"
          onClick={() => handleFilterChange('emergency')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
            activeFilter === 'emergency'
              ? 'bg-[#DC2626] text-white shadow-xs'
              : 'bg-white text-[#DC2626] border border-[#FECACA] hover:bg-[#FFF4F2]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>24/7 Emergency Delivery</span>
        </button>
        <button
          id="filter-maternity-btn"
          onClick={() => handleFilterChange('maternity')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeFilter === 'maternity'
              ? 'bg-[#E61964] text-white shadow-xs'
              : 'bg-white text-[#64748B] border border-[#F0EBE9] hover:bg-[#FAF8F8]'
          }`}
        >
          Maternity Clinics
        </button>
      </div>

      {/* Facility Results List */}
      <div className="space-y-3.5">
        {loading && (
          <div className="bg-white rounded-3xl p-8 border-2 border-[#F0EBE9] text-center space-y-3">
            <div className="w-10 h-10 border-3 border-[#E61964] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-medium text-[#64748B]">
              Searching nearby healthcare facilities via Google Maps Platform &amp; Mama Yie Network...
            </p>
          </div>
        )}

        {!loading && facilities.length === 0 && (
          <div className="bg-white rounded-3xl p-6 border-2 border-[#F0EBE9] text-center space-y-2">
            <Hospital className="w-10 h-10 text-[#64748B] mx-auto opacity-50" />
            <h4 className="font-serif font-bold text-base text-[#1E232B]">No facilities match this query</h4>
            <p className="text-xs text-[#64748B]">
              Try clearing your search term or selecting one of the quick area buttons above.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
                fetchNearbyFacilities(6.6885, -1.6244, '', 'all');
              }}
              className="mt-2 px-4 py-2 bg-[#FDF2F5] border border-[#F8B4C8] text-xs font-bold text-[#E61964] rounded-xl hover:bg-[#FCE7F0]"
            >
              Reset Search
            </button>
          </div>
        )}

        {!loading &&
          facilities.map((facility) => {
            const isVerified = facility.isMamaYieVerified;
            return (
              <div
                key={facility.id}
                id={`hospital-card-${facility.id}`}
                onClick={() => setSelectedFacility(facility)}
                className={`bg-white rounded-3xl p-5 border-2 transition-all cursor-pointer shadow-xs hover:shadow-md ${
                  isVerified ? 'border-[#BAE3C2] ring-1 ring-[#2E7D46]/10' : 'border-[#F0EBE9]'
                }`}
              >
                {/* Badge Row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1C592E] bg-[#EDF7EE] px-2.5 py-0.5 rounded-full border border-[#BAE3C2]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{facility.verificationBadge}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#64748B] bg-[#FAF8F8] px-2.5 py-0.5 rounded-full border border-[#F0EBE9]">
                      <MapPin className="w-3 h-3 text-[#64748B]" />
                      <span>{facility.verificationBadge}</span>
                    </span>
                  )}

                  {facility.isEmergencyReady && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-[#DC2626] bg-[#FFF4F2] px-2 py-0.5 rounded-full border border-[#FECACA]">
                      24/7 Emergency
                    </span>
                  )}
                </div>

                {/* Facility Name */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-[#1E232B] leading-snug">
                      {facility.name}
                    </h3>
                    <p className="text-[11px] font-medium text-[#64748B] mt-0.5">
                      {facility.category || 'Healthcare Facility'}
                    </p>
                  </div>
                </div>

                {/* Distance & Location */}
                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#64748B]">
                  <MapPin className="w-3.5 h-3.5 text-[#E61964] shrink-0" />
                  <span className="font-bold text-[#1E232B]">{facility.distanceFormatted}</span>
                  <span className="text-[#64748B]">•</span>
                  <span className="line-clamp-1 text-[#64748B]">{facility.address}</span>
                </div>

                {/* Open/Closed status */}
                {facility.openStatusText && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                    <Clock className="w-3.5 h-3.5 text-[#2E7D46] shrink-0" />
                    <span className="font-semibold text-[#2E7D46]">
                      {facility.openStatusText}
                    </span>
                  </div>
                )}

                {/* Fund acceptance status */}
                {isVerified && (
                  <div className="mt-2 bg-[#EDF7EE] px-3 py-1.5 rounded-xl border border-[#BAE3C2] flex items-center justify-between text-xs">
                    <span className="text-[#1C592E] font-medium">Mama Yie Fund Accepted:</span>
                    <strong className="text-[#2E7D46]">GH₵{user.currentSavings} available</strong>
                  </div>
                )}

                {/* Action Buttons: Directions & Call */}
                <div className="mt-3.5 pt-3 border-t border-[#F0EBE9] flex items-center gap-2">
                  {/* Directions */}
                  <a
                    id={`directions-btn-${facility.id}`}
                    href={facility.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#FDF2F5] hover:bg-[#FCE7F0] text-[#E61964] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#F8B4C8]"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Get Directions</span>
                  </a>

                  {/* Call */}
                  {facility.phone ? (
                    <a
                      id={`call-btn-${facility.id}`}
                      href={`tel:${facility.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#1E232B] hover:bg-[#2D3748] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Facility</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFacility(facility);
                      }}
                      className="py-2.5 px-3 rounded-xl bg-[#FAF8F8] text-[#64748B] text-xs font-medium border border-[#F0EBE9]"
                    >
                      Details
                    </button>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Facility Detail Sheet / Modal */}
      <AnimatePresence>
        {selectedFacility && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full border-2 border-[#F0EBE9] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-3 border-b border-[#F0EBE9]">
                <div>
                  {selectedFacility.isMamaYieVerified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1C592E] bg-[#EDF7EE] px-2.5 py-0.5 rounded-full mb-1 border border-[#BAE3C2]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Mama Yie Verified Partner</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#64748B] bg-[#FAF8F8] px-2.5 py-0.5 rounded-full mb-1 border border-[#F0EBE9]">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Google Places Discovery</span>
                    </span>
                  )}
                  <h3 className="font-serif font-bold text-xl text-[#1E232B]">
                    {selectedFacility.name}
                  </h3>
                  <p className="text-xs text-[#64748B]">{selectedFacility.category}</p>
                </div>
                <button
                  id="close-facility-detail-btn"
                  onClick={() => setSelectedFacility(null)}
                  className="p-1.5 text-[#64748B] hover:text-[#1E232B] cursor-pointer rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Address & Hours */}
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 text-[#64748B]">
                  <MapPin className="w-4 h-4 text-[#E61964] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#1E232B]">Address &amp; Distance:</strong>
                    <span>{selectedFacility.address}</span>
                    <span className="block text-[#E61964] font-bold mt-0.5">
                      {selectedFacility.distanceFormatted}
                    </span>
                  </div>
                </div>

                {selectedFacility.openStatusText && (
                  <div className="flex items-start gap-2 text-[#64748B]">
                    <Clock className="w-4 h-4 text-[#2E7D46] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#1E232B]">Operating Status:</strong>
                      <span className="text-[#2E7D46] font-semibold">
                        {selectedFacility.openStatusText}
                      </span>
                    </div>
                  </div>
                )}

                {selectedFacility.phone && (
                  <div className="flex items-start gap-2 text-[#64748B]">
                    <Phone className="w-4 h-4 text-[#1E232B] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#1E232B]">Direct Telephone:</strong>
                      <a href={`tel:${selectedFacility.phone}`} className="text-[#E61964] font-bold underline">
                        {selectedFacility.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Maternal Services */}
              {selectedFacility.maternalServices && selectedFacility.maternalServices.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-[#F0EBE9]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    Available Maternal Services
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedFacility.maternalServices.map((service, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-[#FDF2F5] text-[#E61964] border border-[#F8B4C8] rounded-lg text-xs font-medium"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Verification & Fund notes */}
              <div
                className={`p-3 rounded-2xl text-xs space-y-1 ${
                  selectedFacility.isMamaYieVerified
                    ? 'bg-[#EDF7EE] text-[#1C592E] border border-[#BAE3C2]'
                    : 'bg-[#FAF8F8] text-[#64748B] border border-[#F0EBE9]'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  {selectedFacility.isMamaYieVerified ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#2E7D46]" />
                      <span>Mama Yie Vetted Partner</span>
                    </>
                  ) : (
                    <>
                      <Info className="w-4 h-4 text-[#64748B]" />
                      <span>Public Listing Disclaimer</span>
                    </>
                  )}
                </div>
                <p className="text-[11px] leading-relaxed">
                  {selectedFacility.verificationNote}
                </p>
              </div>

              {/* Action Buttons in Modal */}
              <div className="space-y-2 pt-2">
                <a
                  id="modal-get-directions-btn"
                  href={selectedFacility.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-2xl bg-[#E61964] hover:bg-[#D01255] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                {selectedFacility.phone && (
                  <a
                    id="modal-call-facility-btn"
                    href={`tel:${selectedFacility.phone}`}
                    className="w-full py-3 rounded-2xl bg-white hover:bg-[#FAF8F8] text-[#1E232B] border-2 border-[#F0EBE9] font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Phone className="w-4 h-4 text-[#E61964]" />
                    <span>Call {selectedFacility.phone}</span>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Emergency Guidance Modal */}
      <AnimatePresence>
        {showEmergencyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full border-2 border-[#FECACA] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE9]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#DC2626] text-white flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#1E232B]">
                    Maternal Emergency Pathway
                  </h3>
                </div>
                <button
                  id="close-emergency-modal-btn"
                  onClick={() => setShowEmergencyModal(false)}
                  className="p-1.5 text-[#64748B] hover:text-[#1E232B] cursor-pointer rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Immediate Call Hotlines */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                  Immediate Emergency Hotlines
                </span>

                <a
                  id="emergency-modal-call-193"
                  href="tel:193"
                  className="w-full p-3.5 rounded-2xl bg-[#DC2626] hover:bg-[#B91C1C] text-white flex items-center justify-between shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-bold text-sm">National Ambulance Service</div>
                      <div className="text-[11px] opacity-90">Toll-free emergency dispatch</div>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-lg bg-white/20 px-2.5 py-1 rounded-xl">
                    193
                  </span>
                </a>

                <a
                  id="emergency-modal-call-112"
                  href="tel:112"
                  className="w-full p-3 rounded-2xl bg-white border border-[#F0EBE9] text-[#1E232B] hover:bg-[#FAF8F8] flex items-center justify-between shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#E61964]" />
                    <div className="text-left">
                      <div className="font-bold text-xs">National Emergency Response</div>
                      <div className="text-[10px] text-[#64748B]">Police, Medical &amp; Rescue</div>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-sm text-[#1E232B]">
                    112
                  </span>
                </a>

                <a
                  id="emergency-modal-call-midwife"
                  href="tel:+233244119820"
                  className="w-full p-3 rounded-2xl bg-[#EDF7EE] border border-[#BAE3C2] text-[#2E7D46] hover:bg-[#DCFCE7] flex items-center justify-between shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-[#2E7D46]" />
                    <div className="text-left">
                      <div className="font-bold text-xs">Sister Afia Midwife On-Call</div>
                      <div className="text-[10px] text-[#2E7D46]">Mama Yie Triage Partner</div>
                    </div>
                  </div>
                  <span className="font-mono font-semibold text-xs text-[#2E7D46]">
                    Call
                  </span>
                </a>
              </div>

              {/* Danger Signs Checklist */}
              <div className="space-y-2 pt-2 border-t border-[#F0EBE9]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#DC2626]">
                  Maternal Warning Signs (Go to Hospital Immediately)
                </span>
                <ul className="text-xs text-[#1E232B] space-y-1.5 pl-1">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] mt-1.5 shrink-0" />
                    <span>Heavy vaginal bleeding with or without pain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] mt-1.5 shrink-0" />
                    <span>Severe, persistent headache or blurred vision</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] mt-1.5 shrink-0" />
                    <span>Sudden reduction or stoppage in baby kicks / movements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] mt-1.5 shrink-0" />
                    <span>Fluid gushing or leaking before labor due date</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] mt-1.5 shrink-0" />
                    <span>High fever, chills, or convulsions</span>
                  </li>
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="p-3 bg-[#FAF8F8] rounded-xl border border-[#F0EBE9] text-[10px] text-[#64748B] leading-relaxed">
                <strong>Medical Notice:</strong> Mama Yie does not provide clinical diagnosis or emergency medical triage. If you experience any of the warning signs above, proceed to the nearest emergency healthcare facility immediately.
              </div>

              <button
                onClick={() => setShowEmergencyModal(false)}
                className="w-full py-2.5 rounded-xl bg-[#1E232B] text-white text-xs font-bold hover:bg-[#2D3748] cursor-pointer"
              >
                Close Emergency Notice
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
