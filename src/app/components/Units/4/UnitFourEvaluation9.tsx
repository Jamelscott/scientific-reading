import { useMemo, useState, useEffect } from "react";
import { useUnitsStore } from "../../../../stores";
import EvaluationHeader from "../components/EvaluationHeader";
import UnitContainer from "../components/UnitContainer";
import UnitHeader from "../components/UnitHeader";
import { ConfirmationModal } from "../../ui/ConfirmationModal";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { StudentAnswers, MockQuestions } from "../../../../../mockData/types";
import { EvaluationCheckbox } from "../../ui/EvaluationCheckbox";
import CommentsContainer from "../components/CommentsContainer";

export function UnitFourEvaluationNine() {
  const { t } = useTranslation();
  const { classId, studentId, evaluationId } = useParams();
  const [notRequired, setNotRequired] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const unitsData = useUnitsStore((state) => state.unitsData);

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
  const evaluationNineData = unitsData[8];

  const getKeys = (cat: any) =>
    cat && typeof cat === "object" && !Array.isArray(cat)
      ? Object.keys(cat)
      : [];

  const frequentWordsSliceKeys = useMemo(
    () => getKeys(evaluationNineData.questions.frequentWordsSlice),
    [evaluationNineData.questions.frequentWordsSlice],
  );

  type EvaluationState = {
    frequent: Array<boolean | null>;
    comments: string;
  };

  const buildEvaluationArray = (value: boolean | null, length: number) =>
    new Array(length).fill(value) as Array<boolean | null>;

  const [evaluationState, setEvaluationState] = useState<EvaluationState>({
    frequent: buildEvaluationArray(null, frequentWordsSliceKeys.length),
    comments: "",
  });

  useEffect(() => {
    if (!singleAnswer || !singleAnswer.answers) return;
    const ans: MockQuestions = singleAnswer.answers as any;
    const mapToArray = (keys: string[], obj: any) => {
      if (!obj) return new Array(keys.length).fill(null);
      return keys.map((key) => {
        const val = obj[key];
        // Handle direct boolean values
        if (val === true) return true;
        if (val === false) return false;
        // Handle object format with 'correct' property
        if (typeof val === "object" && val !== null && "correct" in val) {
          if (val.correct === true) return true;
          if (val.correct === false) return false;
        }
        return null;
      });
    };

    setEvaluationState({
      frequent: mapToArray(frequentWordsSliceKeys, ans.frequentWordsSlice),
      comments: singleAnswer.comment,
    });
    setNotRequired(!singleAnswer.required);
    setHasChanges(false);
  }, [singleAnswer, frequentWordsSliceKeys]);

  const handleCheckAll = () => {
    setConfirmMessage(t("evaluation.confirmCheckAll"));
    setPendingAction(() => () => {
      setEvaluationState((prev) => ({
        ...prev,
        frequent: buildEvaluationArray(true, frequentWordsSliceKeys.length),
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
        frequent: buildEvaluationArray(false, frequentWordsSliceKeys.length),
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
        frequent: buildEvaluationArray(null, frequentWordsSliceKeys.length),
        comments: "",
      }));
      setHasChanges(true);
    });
    setShowConfirmModal(true);
  };

  const handleNotRequired = () => {
    setEvaluationState((prev) => ({
      ...prev,
      frequent: buildEvaluationArray(null, frequentWordsSliceKeys.length),
      comments: "",
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    const answers: any = {
      frequentWordsSlice: frequentWordsSliceKeys.reduce(
        (acc, word, idx) => {
          acc[word] = evaluationState.frequent[idx];
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
        title={evaluationNineData.title}
        evaluationNumber={evaluationNineData.evaluation}
        notRequired={notRequired}
        handleNotRequired={handleNotRequired}
        setNotRequired={setNotRequired}
        handleSave={handleSave}
        isSaveDisabled={!hasChanges}
        setIsSaveDisabled={setHasChanges}
      />
      <UnitContainer notRequired={notRequired}>
        <EvaluationHeader
          unitNumber={evaluationNineData.unit}
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
            {frequentWordsSliceKeys.map((word, i) => (
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

export default UnitFourEvaluationNine;
