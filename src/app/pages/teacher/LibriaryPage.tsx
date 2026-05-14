import { useNavigate } from "react-router";
import { Download, FileCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NotificationDropdown } from "../../components/NotificationDropdown";
import { Initials } from "../../components/Initials";
import { Sidebar } from "../../components/Sidebar";
import { Continuum } from "../../components/LirbaryPage/Continuum";
import { exportContinuumToPdf } from "../../components/utils/exportContinuumToPdf";
import { Button } from "../../components/ui/Button";

interface Resource {
  id: number;
  title: string;
  icon: React.ReactNode;
}

export function LibraryPage() {
  const { t } = useTranslation();

  return (
    <div
      className="h-screen flex overflow-hidden"
      style={{ background: "#dff3ff" }}
    >
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 p-12 overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <h1 className="text-3xl mb-2" style={{ color: "#004aad" }}>
              {t("library.library")}
            </h1>
            <p className="text-lg" style={{ color: "#000000" }}>
              {t("library.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <Initials size="sm" />
          </div>
        </div>
        {/* Continuum Section */}
        <Continuum />
      </div>
    </div>
  );
}
