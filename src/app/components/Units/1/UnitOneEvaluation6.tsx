import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useUnitsStore } from "../../../../stores";
import { UnitContainer } from "../components/UnitContainer";
import CommentsContainer from "../components/CommentsContainer";
import UnitHeader from "../components/UnitHeader";
import { ConfirmationModal } from "../../ui/ConfirmationModal";
import { EvaluationCheckbox } from "../../ui/EvaluationCheckbox";
import EvaluationHeader from "../components/EvaluationHeader";
import { useParams } from "react-router";
import type { Questions, StudentAnswers } from "../../../../../mockData/types";

type EvaluationArray = Array<boolean | null>;
type EvaluationFourState = {
  beginningSound: EvaluationArray;
  endingSound: EvaluationArray;
  comments: string;
};

export function UnitOneEvaluationSix() {
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
      studentMap.get(student_id)!.set(unit_data_id, answer);
    });

    return studentMap;
  }, [classAnswers]);
  const evaluationAnswersMap = classAnswersMap.get(studentId!);
  const singleAnswer = evaluationAnswersMap?.get(evaluationId!);
  const evaluationSixData = unitsData[5];

  const getKeys = (cat: any) =>
    cat && typeof cat === "object" && !Array.isArray(cat)
      ? Object.keys(cat)
      : [];

  const startOfWordKeys = useMemo(
    () => getKeys(evaluationSixData.questions.startOfWord),
    [evaluationSixData.questions.startOfWord],
  );

  const endOfWordKeys = useMemo(
    () => getKeys(evaluationSixData.questions.endOfWord),
    [evaluationSixData.questions.endOfWord],
  );

  const buildEvaluationArray = (
    value: boolean | null,
    length: number,
  ): EvaluationArray => new Array(length).fill(value);

  const [evaluationSix, setEvaluationSix] = useState<EvaluationFourState>({
    beginningSound: buildEvaluationArray(null, startOfWordKeys.length),
    endingSound: buildEvaluationArray(null, endOfWordKeys.length),
    comments: "",
  });

  useEffect(() => {
    if (!singleAnswer || !singleAnswer.answers) return;

    const ans: Questions = singleAnswer.answers;
    const startOfWordData = ans.startOfWord as any;
    const endOfWordData = ans.endOfWord as any;

    const mapToArray = (keys: string[], obj: any) => {
      if (!obj) return new Array(keys.length).fill(null);
      return keys.map((key) => {
        const val = obj[key];
        // Handle direct boolean values (from saved answers)
        if (val === true) return true;
        if (val === false) return false;
        // Handle object format (from templates with sound + correct)
        if (typeof val === "object" && val !== null && "correct" in val) {
          if (val.correct === true) return true;
          if (val.correct === false) return false;
        }
        return null;
      });
    };

    setEvaluationSix({
      beginningSound: mapToArray(startOfWordKeys, startOfWordData),
      endingSound: mapToArray(endOfWordKeys, endOfWordData),
      comments: singleAnswer.comment,
    });
    setNotRequired(!singleAnswer.required);
    setHasChanges(false);
  }, [singleAnswer, startOfWordKeys, endOfWordKeys]);

  const handleCheckAll = () => {
    setConfirmMessage(t("evaluation.confirmCheckAll"));
    setPendingAction(() => () => {
      setEvaluationSix((prev) => ({
        ...prev,
        beginningSound: buildEvaluationArray(true, startOfWordKeys.length),
        endingSound: buildEvaluationArray(true, endOfWordKeys.length),
      }));
      setHasChanges(true);
    });
    setShowConfirmModal(true);
  };

  const handleFailAll = () => {
    setConfirmMessage(t("evaluation.confirmFailAll"));
    setPendingAction(() => () => {
      setEvaluationSix((prev) => ({
        ...prev,
        beginningSound: buildEvaluationArray(false, startOfWordKeys.length),
        endingSound: buildEvaluationArray(false, endOfWordKeys.length),
      }));
      setHasChanges(true);
    });
    setShowConfirmModal(true);
  };

  const handleClearAll = () => {
    setConfirmMessage(t("evaluation.confirmClearAll"));
    setPendingAction(() => () => {
      setEvaluationSix((prev) => ({
        ...prev,
        beginningSound: buildEvaluationArray(null, startOfWordKeys.length),
        endingSound: buildEvaluationArray(null, endOfWordKeys.length),
        comments: "",
      }));
      setHasChanges(true);
    });
    setShowConfirmModal(true);
  };

  const handleNotRequired = () => {
    setEvaluationSix((prev) => ({
      ...prev,
      beginningSound: buildEvaluationArray(null, startOfWordKeys.length),
      endingSound: buildEvaluationArray(null, endOfWordKeys.length),
      comments: "",
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    const answers: any = {
      startOfWord: startOfWordKeys.reduce(
        (acc, word, idx) => {
          acc[word] = evaluationSix.beginningSound[idx];
          return acc;
        },
        {} as Record<string, boolean | null>,
      ),
      endOfWord: endOfWordKeys.reduce(
        (acc, word, idx) => {
          acc[word] = evaluationSix.endingSound[idx];
          return acc;
        },
        {} as Record<string, boolean | null>,
      ),
    };

    updateAnswer(
      studentId!,
      classId!,
      evaluationId!,
      answers,
      evaluationSix.comments,
      !notRequired,
    );
    setHasChanges(false);
  };
  return (
    <>
      <UnitHeader
        title={evaluationSixData.title}
        evaluationNumber={evaluationSixData.evaluation}
        notRequired={notRequired}
        handleNotRequired={handleNotRequired}
        setNotRequired={setNotRequired}
        handleSave={handleSave}
        isSaveDisabled={!hasChanges}
        setIsSaveDisabled={setHasChanges}
      />
      <UnitContainer notRequired={notRequired}>
        <EvaluationHeader
          unitNumber={evaluationSixData.unit}
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

        <div id="atelier4-content" className="grid grid-cols-2 gap-6">
          <div className="p-5 rounded-xl" style={{ background: "#dff3ff" }}>
            <div className="flex justify-between">
              <h3
                className="text-base mb-4 font-bold"
                style={{ color: "#004aad" }}
              >
                {t("unitFour.beginningSound.title")}
              </h3>
              <span>{t("unitFour.beginningSound.successLabel")}</span>
            </div>
            {startOfWordKeys.map((word, i) => {
              const item = (evaluationSixData.questions.startOfWord as any)?.[
                word
              ];
              return (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 mb-3"
                >
                  <div>
                    <span
                      className="text-sm w-20 font-medium"
                      style={{ color: "#004aad" }}
                    >
                      {word}
                    </span>
                    <span
                      className="text-xs px-2 py-1 rounded"
                      style={{ background: "#f0f0f0", color: "#666" }}
                    >
                      {item?.sound}
                    </span>
                  </div>
                  <EvaluationCheckbox
                    value={evaluationSix.beginningSound[i]}
                    onCheck={() => {
                      const newArr = [...evaluationSix.beginningSound];
                      newArr[i] = true;
                      setEvaluationSix((prev) => ({
                        ...prev,
                        beginningSound: newArr,
                      }));
                      setHasChanges(true);
                    }}
                    onFail={() => {
                      const newArr = [...evaluationSix.beginningSound];
                      newArr[i] = false;
                      setEvaluationSix((prev) => ({
                        ...prev,
                        beginningSound: newArr,
                      }));
                      setHasChanges(true);
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div className="p-5 rounded-xl" style={{ background: "#dff3ff" }}>
            <div className="flex justify-between">
              <h3
                className="text-base mb-4 font-bold"
                style={{ color: "#004aad" }}
              >
                {t("unitFour.endingSound.title")}
              </h3>
              <span>{t("unitFour.endingSound.successLabel")}</span>
            </div>
            {endOfWordKeys.map((word, i) => {
              const item = (evaluationSixData.questions.endOfWord as any)?.[
                word
              ];
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 mb-3 justify-between"
                >
                  <div>
                    <span
                      className="text-sm w-20 font-medium"
                      style={{ color: "#004aad" }}
                    >
                      {word}
                    </span>
                    <span
                      className="text-xs px-2 py-1 rounded"
                      style={{ background: "#f0f0f0", color: "#666" }}
                    >
                      {item?.sound}
                    </span>
                  </div>
                  <EvaluationCheckbox
                    value={evaluationSix.endingSound[i]}
                    onCheck={() => {
                      const newArr = [...evaluationSix.endingSound];
                      newArr[i] = true;
                      setEvaluationSix((prev) => ({
                        ...prev,
                        endingSound: newArr,
                      }));
                      setHasChanges(true);
                    }}
                    onFail={() => {
                      const newArr = [...evaluationSix.endingSound];
                      newArr[i] = false;
                      setEvaluationSix((prev) => ({
                        ...prev,
                        endingSound: newArr,
                      }));
                      setHasChanges(true);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <CommentsContainer
          comments={evaluationSix.comments}
          onChange={(value) => {
            setEvaluationSix((prev) => ({ ...prev, comments: value }));
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

export default UnitOneEvaluationSix;
