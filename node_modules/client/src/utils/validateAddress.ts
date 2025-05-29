import axios from "axios";

export const validateAddress = async (address: string) => {
  try {
    const response = await axios.post("/api/address/validate", { address });
    return response.data.standardizedAddress;
  } catch (err: any) {
    console.error("Validation error:", err?.response?.data || err.message);
    throw new Error(err?.response?.data?.error || "Failed to validate address.");
  }
};
