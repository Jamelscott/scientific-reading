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
import type { Questions, StudentAnswers } from "../../../../../mockData/types";

export function UnitThreeEvaluationEight() {
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
  const evaluationEightData = unitsData[7];

  const getKeys = (cat: any) =>
    cat && typeof cat === "object" && !Array.isArray(cat)
      ? Object.keys(cat)
      : [];

  const frequentWordsKeys = useMemo(
    () => getKeys(evaluationEightData.questions.frequentWords),
    [evaluationEightData.questions.frequentWords],
  );

  const openClosedListKeys = useMemo(
    () => getKeys(evaluationEightData.questions.openClosedList),
    [evaluationEightData.questions.openClosedList],
  );

  const complexListKeys = useMemo(
    () => getKeys(evaluationEightData.questions.complexList),
    [evaluationEightData.questions.complexList],
  );

  type EvaluationState = {
    openClosed: Array<boolean | null>;
    complex: Array<boolean | null>;
    frequent: Array<boolean | null>;
    comments: string;
  };

  const buildEvaluationArray = (value: boolean | null, length: number) =>
    new Array(length).fill(value) as Array<boolean | null>;

  const [evaluationState, setEvaluationState] = useState<EvaluationState>({
    openClosed: buildEvaluationArray(null, openClosedListKeys.length),
    complex: buildEvaluationArray(null, complexListKeys.length),
    frequent: buildEvaluationArray(null, frequentWordsKeys.length),
    comments: "",
  });

  useEffect(() => {
    if (!singleAnswer || !singleAnswer.answers) return;
    const ans: Questions = singleAnswer.answers as any;

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
      openClosed: mapToArray(openClosedListKeys, ans.openClosedList),
      complex: mapToArray(complexListKeys, ans.complexList),
      frequent: mapToArray(frequentWordsKeys, ans.frequentWords),
      comments: singleAnswer.comment,
    });
    setNotRequired(!singleAnswer.required);
    setHasChanges(false);
  }, [singleAnswer, frequentWordsKeys, openClosedListKeys, complexListKeys]);

  const handleCheckAll = () => {
    setConfirmMessage(t("evaluation.confirmCheckAll"));
    setPendingAction(() => () => {
      setEvaluationState((prev) => ({
        ...prev,
        openClosed: buildEvaluationArray(true, openClosedListKeys.length),
        complex: buildEvaluationArray(true, complexListKeys.length),
        frequent: buildEvaluationArray(true, frequentWordsKeys.length),
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
        openClosed: buildEvaluationArray(false, openClosedListKeys.length),
        complex: buildEvaluationArray(false, complexListKeys.length),
        frequent: buildEvaluationArray(false, frequentWordsKeys.length),
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
        openClosed: buildEvaluationArray(null, openClosedListKeys.length),
        complex: buildEvaluationArray(null, complexListKeys.length),
        frequent: buildEvaluationArray(null, frequentWordsKeys.length),
        comments: "",
      }));
      setHasChanges(true);
    });
    setShowConfirmModal(true);
  };

  const handleNotRequired = () => {
    setEvaluationState((prev) => ({
      ...prev,
      openClosed: buildEvaluationArray(null, openClosedListKeys.length),
      complex: buildEvaluationArray(null, complexListKeys.length),
      frequent: buildEvaluationArray(null, frequentWordsKeys.length),
      comments: "",
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    const answers: any = {
      openClosedList: openClosedListKeys.reduce(
        (acc, syl, idx) => {
          acc[syl] = evaluationState.openClosed[idx];
          return acc;
        },
        {} as Record<string, boolean | null>,
      ),
      complexList: complexListKeys.reduce(
        (acc, syl, idx) => {
          acc[syl] = evaluationState.complex[idx];
          return acc;
        },
        {} as Record<string, boolean | null>,
      ),
      frequentWords: frequentWordsKeys.reduce(
        (acc, word, idx) => {
          acc[word] = evaluationState.frequent[idx];
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
      evaluationState.comments,
      !notRequired,
    );
    setHasChanges(false);
  };

  return (
    <>
      <UnitHeader
        title={evaluationEightData.title}
        evaluationNumber={evaluationEightData.evaluation}
        notRequired={notRequired}
        handleNotRequired={handleNotRequired}
        setNotRequired={setNotRequired}
        handleSave={handleSave}
        isSaveDisabled={!hasChanges}
        setIsSaveDisabled={setHasChanges}
      />
      <UnitContainer notRequired={notRequired}>
        <EvaluationHeader
          unitNumber={evaluationEightData.unit}
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
            <strong>{t("unitThreeEval.instructions.title")}</strong>{" "}
            {t("unitThreeEval.instructions.body")}
          </p>
        </div>

        <div id="atelier6-content" className="space-y-6">
          <div className="p-5 rounded-xl" style={{ background: "#dff3ff" }}>
            <h3
              className="text-base mb-4 font-bold"
              style={{ color: "#004aad" }}
            >
              {t("unitThreeEval.openClosedSyllables.title")}
            </h3>
            <p className="text-sm mb-3" style={{ color: "#666" }}>
              {t("unitThreeEval.openClosedSyllables.prompt")}
            </p>
            <div className="grid grid-cols-5 gap-3">
              {openClosedListKeys.map((syl, i) => (
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
                    value={evaluationState.openClosed[i]}
                    onCheck={() => {
                      const newArr = [...evaluationState.openClosed];
                      newArr[i] = true;
                      setEvaluationState((prev) => ({
                        ...prev,
                        openClosed: newArr,
                      }));
                      setHasChanges(true);
                    }}
                    onFail={() => {
                      const newArr = [...evaluationState.openClosed];
                      newArr[i] = false;
                      setEvaluationState((prev) => ({
                        ...prev,
                        openClosed: newArr,
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
              {t("unitThreeEval.complexSyllables.title")}
            </h3>
            <p className="text-sm mb-3" style={{ color: "#666" }}>
              {t("unitThreeEval.complexSyllables.prompt")}
            </p>
            <div className="grid grid-cols-5 gap-3">
              {complexListKeys.map((syl, i) => (
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
                    value={evaluationState.complex[i]}
                    onCheck={() => {
                      const newArr = [...evaluationState.complex];
                      newArr[i] = true;
                      setEvaluationState((prev) => ({
                        ...prev,
                        complex: newArr,
                      }));
                      setHasChanges(true);
                    }}
                    onFail={() => {
                      const newArr = [...evaluationState.complex];
                      newArr[i] = false;
                      setEvaluationState((prev) => ({
                        ...prev,
                        complex: newArr,
                      }));
                      setHasChanges(true);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-xl" style={{ background: "#f7ffd6" }}>
            <h3
              className="text-base mb-4 font-bold"
              style={{ color: "#004aad" }}
            >
              {t("unitThreeEval.frequentWords.title")}
            </h3>
            <p className="text-sm mb-3" style={{ color: "#666" }}>
              {t("unitThreeEval.frequentWords.prompt")}
            </p>
            <div className="grid grid-cols-5 gap-3">
              {frequentWordsKeys.map((word, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg"
                  style={{ background: "#ffffff" }}
                >
                  <span
                    className="text-lg font-semibold"
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
export default UnitThreeEvaluationEight;
