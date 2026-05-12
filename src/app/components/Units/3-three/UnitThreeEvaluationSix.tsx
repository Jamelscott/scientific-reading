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
import {
  complexList,
  frequentWords,
  openClosedList,
} from "../../../pages/const";
import { StudentAnswers, MockQuestions } from "../../../../../mockData";

export function UnitThreeEvaluationSix() {
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
  const evaluationSixData = unitsData[5];

  const frequentList = frequentWords.slice(0, 5);

  type EvaluationState = {
    openClosed: Array<boolean | null>;
    complex: Array<boolean | null>;
    frequent: Array<boolean | null>;
    comments: string;
  };

  const buildEvaluationArray = (value: boolean | null, length: number) =>
    new Array(length).fill(value) as Array<boolean | null>;

  const [evaluationState, setEvaluationState] = useState<EvaluationState>({
    openClosed: buildEvaluationArray(null, openClosedList.length),
    complex: buildEvaluationArray(null, complexList.length),
    frequent: buildEvaluationArray(null, frequentList.length),
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
      openClosed: mapToArray(ans.openClosed, openClosedList.length),
      complex: mapToArray(ans.complex, complexList.length),
      frequent: mapToArray(ans.frequent, frequentList.length),
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
        openClosed: buildEvaluationArray(true, openClosedList.length),
        complex: buildEvaluationArray(true, complexList.length),
        frequent: buildEvaluationArray(true, frequentList.length),
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
        openClosed: buildEvaluationArray(false, openClosedList.length),
        complex: buildEvaluationArray(false, complexList.length),
        frequent: buildEvaluationArray(false, frequentList.length),
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
        openClosed: buildEvaluationArray(null, openClosedList.length),
        complex: buildEvaluationArray(null, complexList.length),
        frequent: buildEvaluationArray(null, frequentList.length),
        comments: "",
      }));
      setHasChanges(true);
    });
    setShowConfirmModal(true);
  };

  const handleNotRequired = () => {
    setEvaluationState((prev) => ({
      ...prev,
      openClosed: buildEvaluationArray(null, openClosedList.length),
      complex: buildEvaluationArray(null, complexList.length),
      frequent: buildEvaluationArray(null, frequentList.length),
      comments: "",
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    const answers: any = {
      openClosed: evaluationState.openClosed.reduce(
        (acc, val, idx) => {
          acc[idx] = val;
          return acc;
        },
        {} as Record<string, boolean | null>,
      ),
      complex: evaluationState.complex.reduce(
        (acc, val, idx) => {
          acc[idx] = val;
          return acc;
        },
        {} as Record<string, boolean | null>,
      ),
      frequent: evaluationState.frequent.reduce(
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
              {openClosedList.map((syl, i) => (
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
              {complexList.map((syl, i) => (
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
              {frequentList.map((word, i) => (
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
export default UnitThreeEvaluationSix;
