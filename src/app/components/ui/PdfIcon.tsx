import { CloudDownload } from "lucide-react";
import { Tooltip } from "./Tooltip";
import { useTranslation } from "react-i18next";

export function PdfIcon() {
  const { t } = useTranslation();
  return (
    <div className="w-fit relative">
      <Tooltip label={t("common.pdfLabel")} position="bottom-right">
        <CloudDownload />
      </Tooltip>
    </div>
  );
}
export default PdfIcon;
