import { useTranslation } from "react-i18next";
import { Button } from "../../ui/Button";
import PdfIcon from "../../ui/PdfIcon";

function EvaluationHeader({
  unitNumber,
  handleCheckAll,
  handleClearAll,
  handleFailAll,
}: {
  unitNumber: number;
  handleCheckAll: () => void;
  handleClearAll: () => void;
  handleFailAll: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between mb-6">
      <div
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full"
        style={{ background: `var(--unit-${unitNumber}-bg)` }}
      >
        <span
          className="text-xs font-semibold"
          style={{ color: `var(--unit-${unitNumber}-fg)` }}
        >
          {t("units.unit", { number: unitNumber })}
        </span>
      </div>
      <div className="flex gap-3 items-center">
        <Button
          onClick={handleCheckAll}
          size="small"
          className="px-4 py-2 rounded-lg text-sm transition-all"
          variant="success"
          label={"evaluation.allSuccess"}
        />
        <Button
          onClick={handleFailAll}
          size="small"
          className="px-4 py-2 rounded-lg text-sm transition-all"
          variant="error"
          label={"evaluation.allFail"}
        />
        <Button
          onClick={handleClearAll}
          size="small"
          className="px-4 py-2 rounded-lg text-sm transition-all"
          variant="clear"
          label={"evaluation.clear"}
        />
        <PdfIcon />
      </div>
    </div>
  );
}

export default EvaluationHeader;
