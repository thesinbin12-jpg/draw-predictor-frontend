const BASE_URL = "http://127.0.0.1:8000";

export async function getMatches() {
  try {
    const res = await fetch(`${BASE_URL}/matches`);
    if (!res.ok) {
      throw new Error("Failed to fetch matches");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching matches:", error);
    return [];
  }
}