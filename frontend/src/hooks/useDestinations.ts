import { useFetch } from "./useFetch";
import type { Destination } from "../data/packages";

export function useDestinations() {
  const { data, loading, error } = useFetch<Destination[]>("/api/destinations");
  return { data: data ?? [], loading, error };
}
