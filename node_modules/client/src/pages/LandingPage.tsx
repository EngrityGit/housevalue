import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useWizardStore } from "@/store/wizardStore";
import axios from "axios";
import debounce from "lodash.debounce";

export default function LandingPage() {
  const [address, setAddress] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const navigate = useNavigate();
  const setData = useWizardStore((state) => state.setData);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;


  const fetchSuggestions = debounce(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await axios.get(`${BASE_URL}/api/address/autocomplete`, {
        params: { q: query },
      });
      setSuggestions(res.data);
    } catch (error) {
      console.error("Autocomplete fetch error:", error);
      setSuggestions([]);
    }
  }, 300);

  useEffect(() => {
    fetchSuggestions(address);

    return () => {
      fetchSuggestions.cancel();
    };
  }, [address]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validateAddressWithGoogle = async (placeId: string) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/address/validate`, {
        params: { placeId },
      });
      console.log("Validation result:", res.data);
      return res.data.valid === true;
    } catch (error: any) {
      console.error("Validation API error:", error?.response?.data || error.message);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedAddress = address.trim();

    if (!trimmedAddress) {
      toast.error("Please enter an address");
      return;
    }

    if (!selectedPlaceId) {
      toast.error("Please select an address from the suggestions");
      return;
    }

    console.log("Submitting address for validation:", trimmedAddress, "placeId:", selectedPlaceId);

    setLoading(true);
    const isValid = await validateAddressWithGoogle(selectedPlaceId);

    if (!isValid) {
      toast.error("Please enter a valid Canadian address");
      setLoading(false);
      return;
    }

    setData("address", trimmedAddress);
    toast.success("Address accepted!");
    setLoading(false);
    navigate("/wizard");
  };

  return (
    <div className="mt-24 flex flex-col bg-white text-primaryText font-inter relative">
      <main className="flex-grow flex flex-col justify-center items-center px-6 max-w-xl mx-auto w-full">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold mb-4 text-primaryBlue text-center leading-tight"
        >
          Find Your Home’s Value
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg mb-10 text-gray-700 text-center max-w-md"
        >
          Enter your property address below to get an instant estimate of your home’s worth.
        </motion.p>

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col space-y-2 relative"
          noValidate
        >
          <input
            type="text"
            placeholder="Enter your property address"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setSelectedPlaceId(null); // clear placeId when typing manually
            }}
            className="flex-grow px-5 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-4 focus:ring-deepGreen/60 text-lg transition-shadow duration-300"
            disabled={loading}
            autoComplete="off"
            aria-autocomplete="list"
            aria-controls="address-suggestions"
            aria-expanded={suggestions.length > 0}
            aria-haspopup="listbox"
            role="combobox"
          />

          {suggestions.length > 0 && (
            <ul
              id="address-suggestions"
              ref={suggestionsRef}
              className="absolute top-[60px] z-10 bg-white border border-gray-300 rounded-md w-full max-h-60 overflow-auto shadow-md"
              role="listbox"
            >
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  role="option"
                  tabIndex={0}
                  className="px-4 py-2 hover:bg-deepGreen hover:text-lemonYellow cursor-pointer"
                  onClick={() => {
                    setAddress(s.displayName.trim());
                    setSelectedPlaceId(s.placeId);
                    setSuggestions([]);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setAddress(s.displayName.trim());
                      setSelectedPlaceId(s.placeId);
                      setSuggestions([]);
                    }
                  }}
                >
                  {s.displayName}
                </li>
              ))}
            </ul>
          )}

          <button
            type="submit"
            className={`bg-deepGreen text-lemonYellow py-4 px-6 rounded-lg font-semibold shadow-md transition-colors duration-300
              ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-lemonYellow hover:text-deepGreen"}`}
            disabled={loading}
          >
            {loading ? "Processing..." : "Find Out"}
          </button>
        </form>
      </main>
    </div>
  );
}
