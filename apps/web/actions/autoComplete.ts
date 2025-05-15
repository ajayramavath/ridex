"use server";
import { fetchWithRetry } from "@/lib/fetchWrapper";
import redis from "@/lib/redis";
import { AutoCompleteResponse } from "@ridex/common";

export interface Prediction {
  description: string;
  place_id: string;
}

export interface AutocompleteResponse {
  predictions: Prediction[];
  status: string;
}

export async function autoComplete(query: string) {
  if (!query) return [];
  const cacheKey = `autocomplete:${query}`;
  const cacheExpiry = 15552000; // 6 months

  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log("Serving from cache", query);
    return JSON.parse(cached);
  }
  console.log("Searching from Google API", query);

  const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
  const API_URL = process.env.GOOGLE_AUTOCOMPLETE_URL;
  const url = `${API_URL}&input=${query}&key=${API_KEY}`;

  try {
    const res = await fetchWithRetry(url);
    const data: AutocompleteResponse = await res.json();
    const predictions = AutoCompleteResponse.parse(data).predictions;

    await redis.set(cacheKey, JSON.stringify(predictions), "EX", cacheExpiry);

    return predictions as Prediction[];
  } catch (error) {
    console.log(error);
    return [];
  }
}