import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import EvaluationHeader from "../components/EvaluationHeader";
import UnitContainer from "../components/UnitContainer";
import UnitHeader from "../components/UnitHeader";
import { ConfirmationModal } from "../../ui/ConfirmationModal";
import { useUnitsStore } from "../../../../stores";
import { useParams } from "react-router";
import { EvaluationCheckbox } from "../../ui/EvaluationCheckbox";
import CommentsContainer from "../components/CommentsContainer";
import { StudentAnswers, MockQuestions } from "../../../../../mockData";
import { soundRows, syllables } from "../../../pages/const";

export function UnitTwoEvaluationFive() {
  const { t } = useTranslation();
  const { classId, studentId, evaluationId } = useParams();
  const [notRequired, setNotRequired] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const unitsData = useUnitsStore((state) => state.getUnitsData);

  const evaluations = useUnitsStore((state) => state.getAnswersByClass);
  const updateAnswer = useUnitsStore((state) => state.updateAnswer);
  const classAnswers = evaluations(Number(classId));
  const classAnswersMap = useMemo(() => {
    const studentMap = new Map<number, Map<number, StudentAnswers>>();

    classAnswers.forEach((answer) => {
      const { studentId, unitDataId } = answer;
      if (!studentMap.has(studentId)) {
        studentMap.set(studentId, new Map());
      }
      studentMap.get(studentId)!.set(unitDataId, answer);
    });

    return studentMap;
  }, [classAnswers]);
  const evaluationAnswersMap = classAnswersMap.get(Number(studentId));
  const singleAnswer = evaluationAnswersMap?.get(Number(evaluationId));
  const evaluationFiveData = unitsData[4];

  type EvaluationState = {
    syllableReading: Array<boolean | null>;
    soundCorrespondence: Array<boolean | null>;
    comments: string;
  };

  const buildEvaluationArray = (value: boolean | null, length: number) =>
    new Array(length).fill(value) as Array<boolean | null>;

  const [evaluationState, setEvaluationState] = useState<EvaluationState>({
    syllableReading: buildEvaluationArray(null, syllables.length),
    soundCorrespondence: buildEvaluationArray(null, soundRows.length),
    comments: "",
  });

  useEffect(() => {
    if (!singleAnswer || !singleAnswer.answers) return;
    const ans: MockQuestions = singleAnswer.answers as any;

    const mapToArray = (obj: any, length: number) => {
      if (!obj) return new Array(length).fill(null);
      return Array.from({ length }, (_, i) => {
        const val = obj[i];
        if (val === true) return true;
        if (val === false) return false;
        return null;
      });
    };

    setEvaluationState({
      syllableReading: mapToArray(ans.syllableReading, syllables.length),
      soundCorrespondence: mapToArray(
        ans.soundCorrespondence,
        soundRows.length,
      ),
      comments: singleAnswer.comment,
    });
    setNotRequired(!singleAnswer.required);
    setHasChanges(false);
  }, [singleAnswer]);

  const handleCheckAll = () => {
    setConfirmMessage(t("evaluation.confirmCheckAll"));
    setPendingAction(() => () => {
      setEvaluationState((prev) => ({
        ...prev,
        syllableReading: buildEvaluationArray(true, syllables.length),
        soundCorrespondence: buildEvaluationArray(true, soundRows.length),
      }));
      setHasChanges(true);
    });
    setShowConfirmModal(true);
  };

  const handleFailAll = () => {
    setConfirmMessage(t("evaluation.confirmFailAll"));
    setPendingAction(() => () => {
      setEvaluationState((prev) => ({
        ...prev,
        syllableReading: buildEvaluationArray(false, syllables.length),
        soundCorrespondence: buildEvaluationArray(false, soundRows.length),
      }));
      setHasChanges(true);
    });
    setShowConfirmModal(true);
  };

  const handleClearAll = () => {
    setConfirmMessage(t("evaluation.confirmClearAll"));
    setPendingAction(() => () => {
      setEvaluationState((prev) => ({
        ...prev,
        syllableReading: buildEvaluationArray(null, syllables.length),
        soundCorrespondence: buildEvaluationArray(null, soundRows.length),
        comments: "",
      }));
      setHasChanges(true);
    });
    setShowConfirmModal(true);
  };

  const handleNotRequired = () => {
    setEvaluationState((prev) => ({
      ...prev,
      syllableReading: buildEvaluationArray(null, syllables.length),
      soundCorrespondence: buildEvaluationArray(null, soundRows.length),
      comments: "",
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    const answers: any = {
      syllableReading: evaluationState.syllableReading.reduce(
        (acc, val, idx) => {
          acc[idx] = val;
          return acc;
        },
        {} as Record<string, boolean | null>,
      ),
      soundCorrespondence: evaluationState.soundCorrespondence.reduce(
        (acc, val, idx) => {
          acc[idx] = val;
          return acc;
        },
        {} as Record<string, boolean | null>,
      ),
    };

    updateAnswer(
      Number(studentId),
      Number(classId),
      Number(evaluationId),
      answers,
      evaluationState.comments,
      !notRequired,
    );
    setHasChanges(false);
  };

  return (
    <>
      <UnitHeader
        title={evaluationFiveData.title}
        evaluationNumber={evaluationFiveData.evaluation}
        notRequired={notRequired}
        handleNotRequired={handleNotRequired}
        setNotRequired={setNotRequired}
        handleSave={handleSave}
        isSaveDisabled={!hasChanges}
        setIsSaveDisabled={setHasChanges}
      />
      <UnitContainer notRequired={notRequired}>
        <EvaluationHeader
          unitNumber={evaluationFiveData.unit}
          handleCheckAll={handleCheckAll}
          handleClearAll={handleClearAll}
          handleFailAll={handleFailAll}
          evaluationId={evaluationId!}
        />
        <div
          className="mb-6 p-4 rounded-xl"
          style={{ background: "#fff9e6", border: "1px solid #ffde59" }}
        >
          <p className="text-sm" style={{ color: "#004aad" }}>
            <strong>{t("unitFive.instructions.title")}</strong>{" "}
            {t("unitFive.instructions.body")}
          </p>
        </div>

        <div id="atelier5-content" className="space-y-6">
          <div className="p-5 rounded-xl" style={{ background: "#dff3ff" }}>
            <h3
              className="text-base mb-4 font-bold"
              style={{ color: "#004aad" }}
            >
              {t("unitFive.syllableReading.title")}
            </h3>
            <p className="text-sm mb-3" style={{ color: "#666" }}>
              {t("unitFive.syllableReading.prompt")}
            </p>
            <div className="grid grid-cols-5 gap-3">
              {syllables.map((syl, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg"
                  style={{ background: "#ffffff" }}
                >
                  <span
                    className="text-lg font-bold"
                    style={{ color: "#004aad" }}
                  >
                    {syl}
                  </span>
                  <EvaluationCheckbox
                    value={evaluationState.syllableReading[i]}
                    onCheck={() => {
                      const newArr = [...evaluationState.syllableReading];
                      newArr[i] = true;
                      setEvaluationState((prev) => ({
                        ...prev,
                        syllableReading: newArr,
                      }));
                      setHasChanges(true);
                    }}
                    onFail={() => {
                      const newArr = [...evaluationState.syllableReading];
                      newArr[i] = false;
                      setEvaluationState((prev) => ({
                        ...prev,
                        syllableReading: newArr,
                      }));
                      setHasChanges(true);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-xl" style={{ background: "#dff3ff" }}>
            <h3
              className="text-base mb-4 font-bold"
              style={{ color: "#004aad" }}
            >
              {t("unitFive.soundCorrespondence.title")}
            </h3>
            <p className="text-sm mb-3" style={{ color: "#666" }}>
              {t("unitFive.soundCorrespondence.prompt")}
            </p>
            <table className="w-full" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#ffffff" }}>
                  <th
                    className="px-3 py-2 text-left text-sm"
                    style={{ color: "#004aad", border: "1px solid #dff3ff" }}
                  >
                    {t("unitFive.soundCorrespondence.labels.lettersShown")}
                  </th>
                  <th
                    className="px-3 py-2 text-center text-sm"
                    style={{ color: "#004aad", border: "1px solid #dff3ff" }}
                  >
                    {t("unitFive.soundCorrespondence.labels.soundRequested")}
                  </th>
                  <th
                    className="px-3 py-2 text-center text-sm"
                    style={{ color: "#004aad", border: "1px solid #dff3ff" }}
                  >
                    {t("unitFive.soundCorrespondence.labels.correctLetter")}
                  </th>
                  <th
                    className="px-3 py-2 text-center text-sm"
                    style={{ color: "#004aad", border: "1px solid #dff3ff" }}
                  >
                    {t("unitFive.soundCorrespondence.labels.success")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {soundRows.map((item, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #dff3ff" }}>
                    <td
                      className="px-3 py-2 font-medium"
                      style={{ color: "#004aad", border: "1px solid #dff3ff" }}
                    >
                      {item.letters}
                    </td>
                    <td
                      className="px-3 py-2 text-center"
                      style={{ color: "#666", border: "1px solid #dff3ff" }}
                    >
                      {item.sound}
                    </td>
                    <td
                      className="px-3 py-2 text-center font-bold"
                      style={{ color: "#2e7d32", border: "1px solid #dff3ff" }}
                    >
                      {item.correct}
                    </td>
                    <td
                      className="px-3 py-2 text-center"
                      style={{ border: "1px solid #dff3ff" }}
                    >
                      <EvaluationCheckbox
                        value={evaluationState.soundCorrespondence[i]}
                        onCheck={() => {
                          const newArr = [
                            ...evaluationState.soundCorrespondence,
                          ];
                          newArr[i] = true;
                          setEvaluationState((prev) => ({
                            ...prev,
                            soundCorrespondence: newArr,
                          }));
                          setHasChanges(true);
                        }}
                        onFail={() => {
                          const newArr = [
                            ...evaluationState.soundCorrespondence,
                          ];
                          newArr[i] = false;
                          setEvaluationState((prev) => ({
                            ...prev,
                            soundCorrespondence: newArr,
                          }));
                          setHasChanges(true);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <CommentsContainer
          comments={evaluationState.comments}
          onChange={(value) => {
            setEvaluationState((prev) => ({ ...prev, comments: value }));
            setHasChanges(true);
          }}
        />
      </UnitContainer>
      <ConfirmationModal
        isOpen={showConfirmModal}
        message={confirmMessage}
        onConfirm={() => {
          if (pendingAction) {
            pendingAction();
            setPendingAction(null);
          }
        }}
        onCancel={() => {
          setShowConfirmModal(false);
          setPendingAction(null);
        }}
      />
    </>
  );
}
export default UnitTwoEvaluationFive;
