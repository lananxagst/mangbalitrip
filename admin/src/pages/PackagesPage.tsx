import CrudPage, { FieldDef } from "../components/CrudPage";

const FIELDS: FieldDef[] = [
  { key: "title",    label: "Title",    placeholder: "Package title" },
  { key: "category", label: "Category", type: "select", options: ["All", "Trekking", "Water Sports", "Cultural Tour", "Cycling", "Photography", "Cooking Class", "Spa & Wellness", "Night Tour", "Waterfalls"] },
  { key: "type",     label: "Type",     placeholder: "e.g. Private Tour" },
  { key: "price",    label: "Price (IDR)", type: "number", placeholder: "150000" },
  { key: "duration", label: "Duration", placeholder: "4 hours" },
  { key: "image",    label: "Image URL", placeholder: "https://..." },
  { key: "badge",    label: "Badge",    type: "select", options: ["", "Top Pick", "Popular"] },
  { key: "rating",   label: "Rating",   type: "number", placeholder: "4.9" },
  { key: "reviews",  label: "Reviews",  type: "number", placeholder: "120" },
  { key: "topPick",  label: "Top Pick", type: "boolean" },
];

const renderCell = (key: string, value: unknown) => {
  if (key === "image") return <img src={String(value)} alt="" className="w-12 h-8 object-cover rounded-lg" />;
  if (key === "price") return `IDR ${Number(value).toLocaleString("id-ID")}`;
  return null;
};

export default function PackagesPage() {
  return (
    <CrudPage
      title="Packages"
      endpoint="/api/admin/packages"
      fields={FIELDS}
      renderCell={renderCell}
    />
  );
}
