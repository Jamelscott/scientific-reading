import { useMemo, useState, useEffect } from "react";
import { useUnitsStore } from "../../../../stores";
import EvaluationHeader from "../components/EvaluationHeader";
import UnitContainer from "../components/UnitContainer";
import UnitHeader from "../components/UnitHeader";
import { ConfirmationModal } from "../../ui/ConfirmationModal";
import { useTranslation } from "react-i18next";
import { frequentWords } from "../../../pages/const";
import { EvaluationCheckbox } from "../../ui/EvaluationCheckbox";
import CommentsContainer from "../components/CommentsContainer";
import { useParams } from "react-router";
import { StudentAnswers, MockQuestions } from "../../../../../mockData";

export function UnitFourEvaluationSeven() {
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
  const evaluationSevenData = unitsData[6];

  const list = frequentWords.slice(5, 20);

  type EvaluationState = {
    frequent: Array<boolean | null>;
    comments: string;
  };

  const buildEvaluationArray = (value: boolean | null, length: number) =>
    new Array(length).fill(value) as Array<boolean | null>;

  const [evaluationState, setEvaluationState] = useState<EvaluationState>({
    frequent: buildEvaluationArray(null, list.length),
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
      frequent: mapToArray(ans.frequentWords, list.length),
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
        frequent: buildEvaluationArray(true, list.length),
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
        frequent: buildEvaluationArray(false, list.length),
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
        frequent: buildEvaluationArray(null, list.length),
        comments: "",
      }));
      setHasChanges(true);
    });
    setShowConfirmModal(true);
  };

  const handleNotRequired = () => {
    setEvaluationState((prev) => ({
      ...prev,
      frequent: buildEvaluationArray(null, list.length),
      comments: "",
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    const answers: any = {
      frequentWords: evaluationState.frequent.reduce(
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
        title={evaluationSevenData.title}
        evaluationNumber={evaluationSevenData.evaluation}
        notRequired={notRequired}
        handleNotRequired={handleNotRequired}
        setNotRequired={setNotRequired}
        handleSave={handleSave}
        isSaveDisabled={!hasChanges}
        setIsSaveDisabled={setHasChanges}
      />
      <UnitContainer notRequired={notRequired}>
        <EvaluationHeader
          unitNumber={evaluationSevenData.unit}
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
            <strong>{t("unitFour.instructions.title")}</strong>{" "}
            {t("unitFour.instructions.body")}
          </p>
        </div>

        <div
          id="atelier7-content"
          className="p-5 rounded-xl"
          style={{ background: "#f7ffd6" }}
        >
          <h3 className="text-base mb-4 font-bold" style={{ color: "#004aad" }}>
            {t("unitFour.frequentWords.title")}
          </h3>
          <p className="text-sm mb-3" style={{ color: "#666" }}>
            {t("unitFour.frequentWords.prompt")}
          </p>
          <div className="grid grid-cols-5 gap-3">
            {list.map((word, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 p-3 rounded-lg"
                style={{ background: "#ffffff" }}
              >
                <span
                  className="text-base font-semibold"
                  style={{ color: "#004aad" }}
                >
                  {word}
                </span>
                <EvaluationCheckbox
                  value={evaluationState.frequent[i]}
                  onCheck={() => {
                    const newArr = [...evaluationState.frequent];
                    newArr[i] = true;
                    setEvaluationState((prev) => ({
                      ...prev,
                      frequent: newArr,
                    }));
                    setHasChanges(true);
                  }}
                  onFail={() => {
                    const newArr = [...evaluationState.frequent];
                    newArr[i] = false;
                    setEvaluationState((prev) => ({
                      ...prev,
                      frequent: newArr,
                    }));
                    setHasChanges(true);
                  }}
                />
              </div>
            ))}
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
          setShowConfirmModal(false);
        }}
        onCancel={() => {
          setShowConfirmModal(false);
          setPendingAction(null);
        }}
      />
    </>
  );
}

export default UnitFourEvaluationSeven;
