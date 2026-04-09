import CrudPage, { FieldDef } from "../components/CrudPage";

const FIELDS: FieldDef[] = [
  { key: "title",       label: "Title",        placeholder: "Package name" },
  { key: "description", label: "Description",  type: "textarea", placeholder: "Short description" },
  { key: "icon",        label: "Icon (emoji)",  placeholder: "🚗" },
  { key: "price",       label: "Price (IDR)",   type: "number", placeholder: "350000" },
  { key: "duration",    label: "Duration",      placeholder: "8 hours" },
  { key: "isHighlighted", label: "Highlighted", type: "boolean" },
];

const renderCell = (key: string, value: unknown) => {
  if (key === "price") return `IDR ${Number(value).toLocaleString("id-ID")}`;
  return null;
};

export default function DriverPackagesPage() {
  return (
    <CrudPage
      title="Driver Packages"
      endpoint="/api/admin/driver-packages"
      fields={FIELDS}
      renderCell={renderCell}
    />
  );
}
