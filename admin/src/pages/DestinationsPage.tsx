import CrudPage, { FieldDef } from "../components/CrudPage";

const FIELDS: FieldDef[] = [
  { key: "name",  label: "Name",      placeholder: "e.g. Ubud" },
  { key: "image", label: "Image URL", placeholder: "https://..." },
];

const renderCell = (key: string, value: unknown) => {
  if (key === "image") return <img src={String(value)} alt="" className="w-16 h-10 object-cover rounded-lg" />;
  return null;
};

export default function DestinationsPage() {
  return (
    <CrudPage
      title="Destinations"
      endpoint="/api/admin/destinations"
      fields={FIELDS}
      renderCell={renderCell}
    />
  );
}
