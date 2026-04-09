import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Loader2, Search } from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";

export interface FieldDef {
  key: string;
  label: string;
  type?: "text" | "number" | "textarea" | "select" | "boolean";
  options?: string[];
  placeholder?: string;
  tableHide?: boolean;
}

interface Props {
  title: string;
  endpoint: string;
  fields: FieldDef[];
  renderCell?: (key: string, value: unknown) => React.ReactNode;
}

export default function CrudPage({ title, endpoint, fields, renderCell }: Props) {
  const { token } = useAdminAuth();
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const fetchData = () => {
    setLoading(true);
    fetch(endpoint, { headers })
      .then((r) => r.json())
      .then((data) => { setItems(Array.isArray(data) ? data : []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [endpoint, token]); // eslint-disable-line react-hooks/exhaustive-deps

  const openCreate = () => {
    const defaults: Record<string, unknown> = {};
    fields.forEach((f) => { defaults[f.key] = f.type === "boolean" ? false : f.type === "number" ? 0 : ""; });
    setEditing(null);
    setForm(defaults);
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (item: Record<string, unknown>) => {
    setEditing(item);
    setForm({ ...item });
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const url = editing ? `${endpoint}/${editing.id}` : endpoint;
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save");
      setModalOpen(false);
      fetchData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`${endpoint}/${id}`, { method: "DELETE", headers });
    setDeleteId(null);
    fetchData();
  };

  const visibleFields = fields.filter((f) => !f.tableHide);
  const filtered = items.filter((item) =>
    Object.values(item).some((v) => String(v).toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{items.length} records</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm"
        >
          <Plus size={16} /> Add New
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 mb-5 max-w-sm">
        <Search size={15} className="text-gray-400" />
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..." className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 size={24} className="animate-spin mr-2" /> Loading...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {visibleFields.map((f) => (
                    <th key={f.key} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {f.label}
                    </th>
                  ))}
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={String(item.id)} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    {visibleFields.map((f) => (
                      <td key={f.key} className="px-5 py-3.5 text-gray-700 max-w-[200px] truncate">
                        {renderCell?.(f.key, item[f.key]) ?? (
                          f.type === "boolean"
                            ? <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${item[f.key] ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{item[f.key] ? "Yes" : "No"}</span>
                            : String(item[f.key] ?? "—")
                        )}
                      </td>
                    ))}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button onClick={() => openEdit(item)} className="text-gray-400 hover:text-primary-500 transition-colors mr-3 p-1">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setDeleteId(String(item.id))} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={visibleFields.length + 1} className="text-center py-12 text-gray-400">No records found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editing ? "Edit" : "Add New"} {title}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea
                      value={String(form[f.key] ?? "")}
                      onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder} rows={3}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-400 resize-none"
                    />
                  ) : f.type === "select" ? (
                    <select
                      value={String(form[f.key] ?? "")}
                      onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-400 bg-white"
                    >
                      {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : f.type === "boolean" ? (
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox" checked={Boolean(form[f.key])}
                        onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.checked }))}
                        className="w-4 h-4 rounded accent-primary-500"
                      />
                      <span className="text-sm text-gray-600">Enabled</span>
                    </label>
                  ) : (
                    <input
                      type={f.type === "number" ? "number" : "text"}
                      value={String(form[f.key] ?? "")}
                      onChange={(e) => setForm((p) => ({ ...p, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-400"
                    />
                  )}
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
                  {saving && <Loader2 size={15} className="animate-spin" />}
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-7 max-w-sm w-full text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Record?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
