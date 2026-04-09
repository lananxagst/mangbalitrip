import { useFetch } from "./useFetch";
import type { TravelGuide } from "../data/packages";

export function useTravelGuides() {
  const { data, loading, error } = useFetch<TravelGuide[]>("/api/guides");
  return { data: data ?? [], loading, error };
}
