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

export function UnitOneEvaluationThree() {
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
  const evaluationThreeData = unitsData[2];

  const getKeys = (cat: any) =>
    cat && typeof cat === "object" && !Array.isArray(cat)
      ? Object.keys(cat)
      : [];

  const bigKeys = useMemo(
    () => getKeys(evaluationThreeData.questions.bigLetters),
    [evaluationThreeData.questions.bigLetters],
  );
  const buildEvaluationArray = (value: boolean | null): EvaluationArray =>
    new Array(bigKeys.length).fill(value);

  const [evaluationThree, setEvaluationThree] = useState<EvaluationTwoState>({
    upperCase: buildEvaluationArray(null),
    comments: "",
  });

  useEffect(() => {
    if (!singleAnswer || !singleAnswer.answers) return;

    const ans: Questions = singleAnswer.answers;
    const big: Record<string, { correct?: boolean | null }> =
      (ans.bigLetters as Record<string, { correct?: boolean | null }>) || {};

    const bigKeysArray = getKeys(evaluationThreeData.questions.bigLetters);
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

    setEvaluationThree({
      upperCase: mapToState(bigKeysArray, big),
      comments: singleAnswer.comment,
    });
    setNotRequired(!singleAnswer.required);
    setHasChanges(false);
  }, [singleAnswer]);

  const handleCheckAll = () => {
    setConfirmMessage(t("evaluation.confirmCheckAll"));
    setPendingAction(() => () => {
      setEvaluationThree((prev) => ({
        ...prev,
        upperCase: buildEvaluationArray(true),
      }));
      setHasChanges(true);
    });
    setShowConfirmModal(true);
  };

  const handleFailAll = () => {
    setConfirmMessage(t("evaluation.confirmFailAll"));
    setPendingAction(() => () => {
      setEvaluationThree((prev) => ({
        ...prev,
        upperCase: buildEvaluationArray(false),
      }));
      setHasChanges(true);
    });
    setShowConfirmModal(true);
  };

  const handleClearAll = () => {
    setConfirmMessage(t("evaluation.confirmClearAll"));
    setPendingAction(() => () => {
      setEvaluationThree((prev) => ({
        ...prev,
        upperCase: buildEvaluationArray(null),
        comments: "",
      }));
      setHasChanges(true);
    });
    setShowConfirmModal(true);
  };

  const handleNotRequired = () => {
    setEvaluationThree((prev) => ({
      ...prev,
      upperCase: buildEvaluationArray(null),
      comments: "",
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    const answers: Questions = {
      bigLetters: bigKeys.reduce(
        (acc, letter, idx) => {
          acc[letter] = {
            recognition: evaluationThree.upperCase[idx],
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
      evaluationThree.comments,
      !notRequired,
    );
    setHasChanges(false);
  };

  return (
    <>
      <UnitHeader
        title={evaluationThreeData.title}
        evaluationNumber={evaluationThreeData.evaluation}
        notRequired={notRequired}
        handleNotRequired={handleNotRequired}
        setNotRequired={setNotRequired}
        handleSave={handleSave}
        isSaveDisabled={!hasChanges}
        setIsSaveDisabled={setHasChanges}
      />
      <UnitContainer notRequired={notRequired}>
        <EvaluationHeader
          unitNumber={evaluationThreeData.unit}
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
            {t("unitTwo.uppercase")}
          </h3>
          <div className="space-y-2">
            {bigKeys.map((letter, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg"
                style={{ background: "#f7ffd6" }}
              >
                <span className="font-bold w-8" style={{ color: "#004aad" }}>
                  {letter}
                </span>
                <EvaluationCheckbox
                  value={evaluationThree.upperCase[idx]}
                  onCheck={() => {
                    const newArr = [...evaluationThree.upperCase];
                    newArr[idx] = true;
                    setEvaluationThree((prev) => ({
                      ...prev,
                      upperCase: newArr,
                    }));
                    setHasChanges(true);
                  }}
                  onFail={() => {
                    const newArr = [...evaluationThree.upperCase];
                    newArr[idx] = false;
                    setEvaluationThree((prev) => ({
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
          comments={evaluationThree.comments}
          onChange={(value) => {
            setEvaluationThree((prev) => ({ ...prev, comments: value }));
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
