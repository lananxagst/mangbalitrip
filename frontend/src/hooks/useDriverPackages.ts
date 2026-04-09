import { useFetch } from "./useFetch";
import type { DriverPackage } from "../data/packages";

export function useDriverPackages() {
  const { data, loading, error } = useFetch<DriverPackage[]>("/api/driver-packages");
  return { data: data ?? [], loading, error };
}
