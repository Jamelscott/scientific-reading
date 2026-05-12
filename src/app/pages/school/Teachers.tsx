import { Sidebar } from "../../components/Sidebar";
import { Initials } from "../../components/Initials";
import { NotificationDropdown } from "../../components/NotificationDropdown";
import { HardHat } from "lucide-react";

export function SchoolTeachers() {
  return (
    <div
      className="h-screen flex overflow-hidden"
      style={{ background: "#dff3ff" }}
    >
      <Sidebar />
      <div className="flex-1 p-12 overflow-y-auto">
        <div className="flex items-start justify-between mb-12">
          <div>
            <h1 className="text-3xl mb-2" style={{ color: "#004aad" }}>
              Enseignants
            </h1>
            <p className="text-lg" style={{ color: "#000000" }}>
              Gestion des enseignants de l'école
            </p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <Initials size="sm" />
          </div>
        </div>
        <div
          className="rounded-2xl p-12 shadow-lg flex flex-col items-center gap-4 text-center max-w-md"
          style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
        >
          <HardHat className="w-16 h-16" style={{ color: "#ffde59" }} />
          <p className="text-xl" style={{ color: "#004aad" }}>
            Page en construction
          </p>
        </div>
      </div>
    </div>
  );
}
