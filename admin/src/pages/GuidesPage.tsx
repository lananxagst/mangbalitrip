import CrudPage, { FieldDef } from "../components/CrudPage";

const FIELDS: FieldDef[] = [
  { key: "title",    label: "Title",    placeholder: "Article title" },
  { key: "category", label: "Category", type: "select", options: ["Island News", "Travel Tips & Guides"] },
  { key: "excerpt",  label: "Excerpt",  type: "textarea", placeholder: "Short preview text" },
  { key: "image",    label: "Image URL", placeholder: "https://..." },
  { key: "readTime", label: "Read Time", placeholder: "5 min read" },
  { key: "views",    label: "Views",    type: "number", placeholder: "1200" },
];

const renderCell = (key: string, value: unknown) => {
  if (key === "image") return <img src={String(value)} alt="" className="w-16 h-10 object-cover rounded-lg" />;
  return null;
};

export default function GuidesPage() {
  return (
    <CrudPage
      title="Travel Guides"
      endpoint="/api/admin/guides"
      fields={FIELDS}
      renderCell={renderCell}
    />
  );
}
