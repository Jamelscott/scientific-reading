import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Download } from "lucide-react";
import { useUnitsStore } from "../../../stores";
import { NotificationDropdown } from "../../components/NotificationDropdown";

export function ResourcePage() {
  const navigate = useNavigate();
  const { category, resourceId, teacherId } = useParams();

  const categories = useUnitsStore((s) => s.getResources());

  const slugify = (str: string) =>
    str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-");

  const categoryData =
    categories.find((c) => slugify(c.title) === (category || "")) ||
    categories[0];
  if (!categoryData) return <div>Loading...</div>;

  const resource = (() => {
    const asNumber = Number(resourceId);
    if (!Number.isNaN(asNumber))
      return categoryData.resources.find((r) => r.id === asNumber);
    return categoryData.resources.find(
      (r) =>
        slugify(r.title) === (resourceId || "") ||
        r.activities?.some(
          (a) =>
            slugify(a.name) === (resourceId || "") ||
            slugify(a.description) === (resourceId || ""),
        ),
    );
  })();

  if (!resource) return <div>Ressource introuvable</div>;

  const { color, title } = categoryData;
  const activities = resource.activities || [];

  const handleDownload = (fileName: string) => {
    // simple download handler; adjust as needed
    window.open(fileName, "_blank");
  };

  return (
    <div
      className="h-screen overflow-hidden"
      style={{ background: `${color}15` }}
    >
      <div className="h-full overflow-y-auto">
        <div className="p-12 pb-8" style={{ background: "#ffffff" }}>
          <div className="flex items-start justify-between">
            <div>
              <button
                onClick={() => navigate(`/teacher/${teacherId}/library`)}
                className="flex items-center gap-2 mb-4 text-sm hover:shadow-md transition-all cursor-pointer"
                style={{ color: "#38b6ff" }}
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à la bibliothèque
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: color }}
                >
                  <Download className="w-6 h-6" style={{ color: "#ffffff" }} />
                </div>
                <div>
                  <p className="text-sm" style={{ color: "#666" }}>
                    {title}
                  </p>
                  <h1 className="text-3xl" style={{ color: "#004aad" }}>
                    {resource.title}
                  </h1>
                </div>
              </div>
              <p className="text-lg" style={{ color: "#000000" }}>
                Sélectionnez une ressource à télécharger
              </p>
            </div>
            <div className="flex items-center gap-4">
              <NotificationDropdown />
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "#38b6ff", color: "#ffffff" }}
              >
                MG
              </div>
            </div>
          </div>
        </div>

        <div className="p-12 pt-8">
          <div className="grid grid-cols-1 gap-4 max-w-3xl">
            {activities.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => handleDownload(item.fileName)}
                className="rounded-2xl p-6 shadow-lg transition-all hover:shadow-xl text-left flex items-center justify-between group cursor-pointer"
                style={{
                  background: "#ffffff",
                  border: `2px solid ${color}30`,
                }}
              >
                <div>
                  <h3
                    className="text-lg mb-1 font-semibold"
                    style={{ color: "#004aad" }}
                  >
                    Activité {idx + 1} · {item.name}
                  </h3>
                  <p className="text-sm" style={{ color: "#666" }}>
                    {item.description}
                  </p>
                </div>
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all"
                  style={{ background: `${color}15`, color: color }}
                >
                  <Download className="w-5 h-5" />
                  <span className="text-sm font-semibold">Télécharger</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
