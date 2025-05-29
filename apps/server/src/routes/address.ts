import express from "express";
import axios from "axios";

const router = express.Router();

// Autocomplete endpoint
router.get("/autocomplete", async (req, res) => {
  const query = req.query.q as string;
  const langleyLat = 49.1044;
const langleyLng = -122.6600;
const langleyRadiusMeters = 10000; 

  if (!query || query.trim().length === 0) {
    return res.status(400).json({ error: "Query parameter 'q' is required." });
  }

  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json",
      {
        params: {
          input: query,
          key: process.env.GOOGLE_API_KEY,
          types: "address",
          components: "country:ca", // restrict to Canada
        location: `${langleyLat},${langleyLng}`, // bias around Langley
        radius: langleyRadiusMeters,
        },
      }
    );

    if (response.data.status !== "OK") {
      console.warn("Google Places API error:", response.data.status);
      return res.status(500).json({ error: "Failed to fetch autocomplete suggestions." });
    }

    const suggestions = response.data.predictions.map((place: any) => ({
      displayName: place.description,
      placeId: place.place_id,
    }));

    res.json(suggestions);
  } catch (error) {
    console.error("Autocomplete error:", error);
    res.status(500).json({ error: "Failed to fetch autocomplete suggestions." });
  }
});

// Validation endpoint
router.get("/validate", async (req, res) => {
  const placeId = req.query.placeId as string;

  if (!placeId || placeId.trim().length === 0) {
    return res.status(400).json({ valid: false, error: "placeId parameter is required." });
  }

  try {
    const response = await axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
      params: {
        place_id: placeId,
        key: process.env.GOOGLE_API_KEY,
        fields: "address_component", // Only fetch address components
      },
    });

    const result = response.data.result;

    if (!result || !result.address_components) {
      return res.json({ valid: false });
    }

    const isValid = result.address_components.some((component: any) =>
      component.types.includes("country") && component.long_name === "Canada"
    );

    res.json({ valid: isValid });
  } catch (error) {
    console.error("Address validation error:", error);
    res.status(500).json({ valid: false, error: "Failed to validate address." });
  }
});


export default router;
