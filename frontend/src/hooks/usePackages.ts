import { useFetch } from "./useFetch";
import type { Package } from "../data/packages";

export function useTopPicks() {
  const { data, loading, error } = useFetch<Package[]>("/api/packages?topPick=true");
  return { data: data ?? [], loading, error };
}

export function usePackages(category = "All") {
  const url =
    category === "All"
      ? "/api/packages"
      : `/api/packages?category=${encodeURIComponent(category)}`;
  const { data, loading, error } = useFetch<Package[]>(url, [category]);
  return { data: data ?? [], loading, error };
}

export function useCategories() {
  const { data, loading, error } = useFetch<string[]>("/api/categories");
  return { data: data ?? ["All"], loading, error };
}
