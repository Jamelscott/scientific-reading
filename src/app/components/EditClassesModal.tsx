import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useClassStore } from "../../stores";
import { Button } from "./ui/Button";
import { Trash2, Pencil } from "lucide-react";

interface EditClassesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditClassesModal({ isOpen, onClose }: EditClassesModalProps) {
  const { t } = useTranslation();
  const classes = useClassStore((state) => state.classes);
  const updateClass = useClassStore((state) => state.updateClass);
  const setClasses = useClassStore((state) => state.setClasses);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState<number | null>(
    null,
  );

  if (!isOpen) return null;

  const handleEdit = (id: number, name: string) => {
    setEditingId(id);
    setEditedName(name);
  };

  const handleSave = (id: number) => {
    if (editedName.trim()) {
      updateClass(id, { name: editedName.trim() });
    }
    setEditingId(null);
    setEditedName("");
  };

  const handleDelete = (id: number) => {
    setClasses(classes.filter((cls) => cls.id !== id));
    setShowConfirmDelete(null);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl p-8 w-full max-w-lg mx-4 shadow-2xl"
        style={{ background: "#fff", border: "2px solid #cccccc" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl mb-6" style={{ color: "#004aad" }}>
          {t("dashboard.editClasses")}
        </h2>
        <div className="space-y-4 mb-8">
          {classes.map((cls) => (
            <div key={cls.id} className="flex items-center gap-3">
              {editingId === cls.id ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onBlur={() => handleSave(cls.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave(cls.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  autoFocus
                  className="px-2 py-1 rounded-lg border-2 outline-none text-lg"
                  style={{ borderColor: "#38b6ff", background: "#dff3ff" }}
                />
              ) : (
                <span
                  className="text-lg cursor-pointer hover:opacity-70 transition-opacity"
                  onClick={() => handleEdit(cls.id, cls.name)}
                  style={{ color: "#004aad" }}
                >
                  {cls.name}
                </span>
              )}
              <button
                type="button"
                onClick={() => handleEdit(cls.id, cls.name)}
                className="p-2 rounded-lg hover:bg-[#dff3ff]"
              >
                <Pencil className="w-4 h-4" />
              </button>
              {showConfirmDelete === cls.id ? (
                <>
                  <span className="text-sm" style={{ color: "#ff5757" }}>
                    {t("common.confirmDelete") || "Are you sure?"}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(cls.id)}
                    className="px-3 py-1 rounded-lg text-white"
                    style={{ background: "#ff5757" }}
                  >
                    {t("common.confirm") || "Confirm"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirmDelete(null)}
                    className="px-3 py-1 rounded-lg"
                    style={{ background: "#f0f0f0", color: "#666" }}
                  >
                    {t("common.cancel")}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(cls.id)}
                  className="p-2 rounded-lg hover:bg-[#ffeaea]"
                >
                  <Trash2 className="w-4 h-4 text-[#ff5757]" />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose} label="common.close" variant="secondary" />
        </div>
      </div>
    </div>
  );
}
