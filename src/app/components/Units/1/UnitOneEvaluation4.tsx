import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { UnitContainer } from "../components/UnitContainer";
import CommentsContainer from "../components/CommentsContainer";
import UnitHeader from "../components/UnitHeader";
import { ConfirmationModal } from "../../ui/ConfirmationModal";
import { useUnitsStore } from "../../../../stores";
import { EvaluationCheckbox } from "../../ui/EvaluationCheckbox";
import EvaluationHeader from "../components/EvaluationHeader";
import { useParams } from "react-router";
import type { Questions, StudentAnswers } from "../../../../../mockData/types";

type EvaluationArray = Array<boolean | null>;
type EvaluationTwoState = {
  upperCase: EvaluationArray;
  comments: string;
};

export function UnitOneEvaluationFour() {
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
  const classAnswers = evaluations(classId!);
  const classAnswersMap = useMemo(() => {
    const studentMap = new Map<string, Map<string, StudentAnswers>>();

    classAnswers.forEach((answer) => {
      const { student_id, unit_data_id } = answer;
      if (!studentMap.has(student_id)) {
        studentMap.set(student_id, new Map());
      }
      studentMap.get(student_id)!.set(String(unit_data_id), answer);
    });

    return studentMap;
  }, [classAnswers]);
  const evaluationAnswersMap = classAnswersMap.get(studentId!);
  const singleAnswer = evaluationAnswersMap?.get(evaluationId!);
  const evaluationFourData = unitsData[3];

  const getKeys = (cat: any) =>
    cat && typeof cat === "object" && !Array.isArray(cat)
      ? Object.keys(cat)
      : [];

  const smallKeys = useMemo(
    () => getKeys(evaluationFourData.questions.smallLetters),
    [evaluationFourData.questions.smallLetters],
  );
  const buildEvaluationArray = (value: boolean | null): EvaluationArray =>
    new Array(smallKeys.length).fill(value);

  const [evaluationFour, setEvaluationFour] = useState<EvaluationTwoState>({
    upperCase: buildEvaluationArray(null),
    comments: "",
  });

  useEffect(() => {
    if (!singleAnswer || !singleAnswer.answers) return;

    const ans: Questions = singleAnswer.answers;
    const small: Record<string, { correct?: boolean | null }> =
      (ans.smallLetters as Record<string, { correct?: boolean | null }>) || {};

    const smallKeysArray = getKeys(evaluationFourData.questions.smallLetters);
    const mapToState = (
      letters: string[],
      obj: Record<string, { correct?: boolean | null }> | undefined,
    ) =>
      letters.map((ltr) => {
        const key = ltr === ltr.toLowerCase() ? ltr.toUpperCase() : ltr;
        const val = obj?.[key]?.correct ?? obj?.[ltr]?.correct;
        if (val === true) return true;
        if (val === false) return false;
        return null;
      });

    setEvaluationFour({
      upperCase: mapToState(smallKeysArray, small),
      comments: singleAnswer.comment,
    });
    setNotRequired(!singleAnswer.required);
    setHasChanges(false);
  }, [singleAnswer]);

  const handleCheckAll = () => {
    setEvaluationFour((prev) => ({
      ...prev,
      upperCase: buildEvaluationArray(true),
    }));
    setHasChanges(true);
  };

  const handleFailAll = () => {
    setEvaluationFour((prev) => ({
      ...prev,
      upperCase: buildEvaluationArray(false),
    }));
    setHasChanges(true);
  };

  const handleClearAll = () => {
    setConfirmMessage(t("evaluation.confirmClearAll"));
    setPendingAction(() => () => {
      setEvaluationFour((prev) => ({
        ...prev,
        upperCase: buildEvaluationArray(null),
        comments: "",
      }));
      setHasChanges(true);
    });
    setShowConfirmModal(true);
  };

  const handleNotRequired = () => {
    setEvaluationFour((prev) => ({
      ...prev,
      upperCase: buildEvaluationArray(null),
      comments: "",
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    const answers: Questions = {
      smallLetters: smallKeys.reduce(
        (acc, letter, idx) => {
          acc[letter] = {
            recognition: evaluationFour.upperCase[idx],
          };
          return acc;
        },
        {} as Record<string, Record<string, boolean | null>>,
      ),
    };

    updateAnswer(
      studentId!,
      classId!,
      evaluationId!,
      answers,
      evaluationFour.comments,
      !notRequired,
    );
    setHasChanges(false);
  };

  return (
    <>
      <UnitHeader
        title={evaluationFourData.title}
        evaluationNumber={evaluationFourData.evaluation}
        notRequired={notRequired}
        handleNotRequired={handleNotRequired}
        setNotRequired={setNotRequired}
        handleSave={handleSave}
        isSaveDisabled={!hasChanges}
        setIsSaveDisabled={setHasChanges}
      />
      <UnitContainer notRequired={notRequired}>
        <EvaluationHeader
          unitNumber={evaluationFourData.unit}
          handleCheckAll={handleCheckAll}
          handleFailAll={handleFailAll}
          handleClearAll={handleClearAll}
          evaluationId={evaluationId!}
        />
        <div
          className="mb-6 p-4 rounded-xl"
          style={{ background: "#fff9e6", border: "1px solid #ffde59" }}
        >
          <p className="text-sm" style={{ color: "#004aad" }}>
            <strong>{t("unitTwo.instructions.title")}</strong>{" "}
            {t("unitTwo.instructions.body")}
          </p>
        </div>

        <div>
          <h3 className="text-lg mb-4" style={{ color: "#004aad" }}>
            {t("unitTwo.lowercase")}
          </h3>
          <div className="space-y-2">
            {smallKeys.map((letter, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg"
                style={{ background: "#f7ffd6" }}
              >
                <span className="font-bold w-8" style={{ color: "#004aad" }}>
                  {letter}
                </span>
                <EvaluationCheckbox
                  value={evaluationFour.upperCase[idx]}
                  onCheck={() => {
                    const newArr = [...evaluationFour.upperCase];
                    newArr[idx] = true;
                    setEvaluationFour((prev) => ({
                      ...prev,
                      upperCase: newArr,
                    }));
                    setHasChanges(true);
                  }}
                  onFail={() => {
                    const newArr = [...evaluationFour.upperCase];
                    newArr[idx] = false;
                    setEvaluationFour((prev) => ({
                      ...prev,
                      upperCase: newArr,
                    }));
                    setHasChanges(true);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <CommentsContainer
          comments={evaluationFour.comments}
          onChange={(value) => {
            setEvaluationFour((prev) => ({ ...prev, comments: value }));
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
