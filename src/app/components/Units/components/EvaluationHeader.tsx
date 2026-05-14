import { useTranslation } from "react-i18next";
import { Button } from "../../ui/Button";
import PdfIcon from "../../ui/PdfIcon";

const unitPdfFiles = [
  "1 - Atelier 1 _ Connaissance des lettres et des sons.pdf",
  "2 - Atelier 2 _ Formation des lettres.pdf",
  "5 - Atelier 5 _ Lecture de syllabes simples et correspondance son-lettre.pdf",
  "6 - Atelier 6 _ Lecture de syllabes ouvertes, fermées et complexes.pdf",
  "7 - Atelier 7 _ Lecture de mots usuels.pdf",
  "8 - Atelier 8 _ Lecture de graphèmes complexes.pdf",
  "9 - Atelier 9 _ Familles de mots et terminaisons fréquentes.pdf",
  "10 - Atelier 10 _ Lecture répétée de phrases.pdf",
  "11 - Atelier 11 _ Lecture de graphèmes avancés.pdf",
  "13 - Atelier 13 _ Lecture autonome et compréhension.pdf",
];

function EvaluationHeader({
  unitNumber,
  handleCheckAll,
  handleClearAll,
  handleFailAll,
  evaluationId,
}: {
  unitNumber: number;
  handleCheckAll: () => void;
  handleClearAll: () => void;
  handleFailAll: () => void;
  evaluationId: string;
}) {
  const { t } = useTranslation();

  const handleOpenUnitPdf = () => {
    const matchingFile = unitPdfFiles.find((fileName) =>
      fileName.startsWith(`${evaluationId}`),
    );

    if (!matchingFile) {
      console.warn(`No PDF found for evaluation ${evaluationId}`);
      return;
    }

    const pdfUrl = `/pdfs/${encodeURIComponent(matchingFile)}`;
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

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
        {evaluationId !== "3" &&
          evaluationId !== "4" &&
          evaluationId !== "12" && (
            <div
              onClick={handleOpenUnitPdf}
              className="cursor-pointer"
              aria-label="Open unit PDF"
            >
              <PdfIcon />
            </div>
          )}
      </div>
    </div>
  );
}

export default EvaluationHeader;
