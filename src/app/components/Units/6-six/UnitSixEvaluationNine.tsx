import { useMemo, useState, useEffect } from "react";
import { useUnitsStore } from "../../../../stores";
import EvaluationHeader from "../components/EvaluationHeader";
import UnitContainer from "../components/UnitContainer";
import UnitHeader from "../components/UnitHeader";
import { ConfirmationModal } from "../../ui/ConfirmationModal";
import { useTranslation } from "react-i18next";
import {
  evaluationNineWords,
  evaluationNineFamilies,
} from "../../../pages/const";
import { EvaluationCheckbox } from "../../ui/EvaluationCheckbox";
import CommentsContainer from "../components/CommentsContainer";
import { useParams } from "react-router";
import { StudentAnswers, MockQuestions } from "../../../../../mockData";

export function UnitSixEvaluationNine() {
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
  const evaluationNineData = unitsData[8];

  type EvaluationState = {
    wordFamilies: Array<boolean | null>;
    frequentEndings: Array<boolean | null>;
    frequentWords: Array<boolean | null>;
    comments: string;
  };

  const buildEvaluationArray = (value: boolean | null, length: number) =>
    new Array(length).fill(value) as Array<boolean | null>;

  const [evaluationState, setEvaluationState] = useState<EvaluationState>({
    wordFamilies: buildEvaluationArray(null, evaluationNineFamilies.length),
    frequentEndings: buildEvaluationArray(null, evaluationNineWords.length),
    frequentWords: buildEvaluationArray(null, 5),
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
      wordFamilies: mapToArray(ans.wordFamilies, evaluationNineFamilies.length),
      frequentEndings: mapToArray(
        ans.frequentEndings,
        evaluationNineWords.length,
      ),
      frequentWords: mapToArray(ans.frequentWords, 5),
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
        wordFamilies: buildEvaluationArray(true, evaluationNineFamilies.length),
        frequentEndings: buildEvaluationArray(true, evaluationNineWords.length),
        frequentWords: buildEvaluationArray(true, 5),
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
        wordFamilies: buildEvaluationArray(
          false,
          evaluationNineFamilies.length,
        ),
        frequentEndings: buildEvaluationArray(
          false,
          evaluationNineWords.length,
        ),
        frequentWords: buildEvaluationArray(false, 5),
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
        wordFamilies: buildEvaluationArray(null, evaluationNineFamilies.length),
        frequentEndings: buildEvaluationArray(null, evaluationNineWords.length),
        frequentWords: buildEvaluationArray(null, 5),
        comments: "",
      }));
      setHasChanges(true);
    });
    setShowConfirmModal(true);
  };

  const handleNotRequired = () => {
    setEvaluationState((prev) => ({
      ...prev,
      wordFamilies: buildEvaluationArray(null, evaluationNineFamilies.length),
      frequentEndings: buildEvaluationArray(null, evaluationNineWords.length),
      frequentWords: buildEvaluationArray(null, 5),
      comments: "",
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    const answers: any = {
      wordFamilies: evaluationState.wordFamilies.reduce(
        (acc, val, idx) => {
          acc[idx] = val;
          return acc;
        },
        {} as Record<string, boolean | null>,
      ),
      frequentEndings: evaluationState.frequentEndings.reduce(
        (acc, val, idx) => {
          acc[idx] = val;
          return acc;
        },
        {} as Record<string, boolean | null>,
      ),
      frequentWords: evaluationState.frequentWords.reduce(
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
            <strong>{t("unitSix.instructions.title")}</strong>{" "}
            {t("unitSix.instructions.body")}
          </p>
        </div>

        <div id="atelier9-content" className="space-y-6">
          <div className="p-5 rounded-xl" style={{ background: "#dff3ff" }}>
            <h3
              className="text-base mb-4 font-bold"
              style={{ color: "#004aad" }}
            >
              {t("unitSix.wordFamilies.title")}
            </h3>
            <p className="text-sm mb-3" style={{ color: "#666" }}>
              {t("unitSix.wordFamilies.prompt")}
            </p>
            {evaluationNineFamilies.map((family, i) => (
              <div
                key={i}
                className="flex items-center gap-3 mb-3 p-2 rounded"
                style={{ background: "#ffffff" }}
              >
                <span className="text-sm flex-1" style={{ color: "#004aad" }}>
                  {family.join(", ")}
                </span>
                <EvaluationCheckbox
                  value={evaluationState.wordFamilies[i]}
                  onCheck={() => {
                    const newArr = [...evaluationState.wordFamilies];
                    newArr[i] = true;
                    setEvaluationState((prev) => ({
                      ...prev,
                      wordFamilies: newArr,
                    }));
                    setHasChanges(true);
                  }}
                  onFail={() => {
                    const newArr = [...evaluationState.wordFamilies];
                    newArr[i] = false;
                    setEvaluationState((prev) => ({
                      ...prev,
                      wordFamilies: newArr,
                    }));
                    setHasChanges(true);
                  }}
                />
              </div>
            ))}
          </div>

          <div className="p-5 rounded-xl" style={{ background: "#dff3ff" }}>
            <h3
              className="text-base mb-4 font-bold"
              style={{ color: "#004aad" }}
            >
              {t("unitSix.frequentEndings.title")}
            </h3>
            <p className="text-sm mb-3" style={{ color: "#666" }}>
              {t("unitSix.frequentEndings.prompt")}
            </p>
            <div className="grid grid-cols-5 gap-3">
              {evaluationNineWords.map((word, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 p-2 rounded"
                  style={{ background: "#ffffff" }}
                >
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "#004aad" }}
                  >
                    {word}
                  </span>
                  <EvaluationCheckbox
                    value={evaluationState.frequentEndings[i]}
                    onCheck={() => {
                      const newArr = [...evaluationState.frequentEndings];
                      newArr[i] = true;
                      setEvaluationState((prev) => ({
                        ...prev,
                        frequentEndings: newArr,
                      }));
                      setHasChanges(true);
                    }}
                    onFail={() => {
                      const newArr = [...evaluationState.frequentEndings];
                      newArr[i] = false;
                      setEvaluationState((prev) => ({
                        ...prev,
                        frequentEndings: newArr,
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
              {t("unitSix.frequentWords.title")}
            </h3>
            <p className="text-sm mb-3" style={{ color: "#666" }}>
              {t("unitSix.frequentWords.prompt")}
            </p>
            <div className="grid grid-cols-5 gap-3">
              {evaluationNineWords.map((word, i) => (
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
                    value={evaluationState.frequentWords[i]}
                    onCheck={() => {
                      const newArr = [...evaluationState.frequentWords];
                      newArr[i] = true;
                      setEvaluationState((prev) => ({
                        ...prev,
                        frequentWords: newArr,
                      }));
                      setHasChanges(true);
                    }}
                    onFail={() => {
                      const newArr = [...evaluationState.frequentWords];
                      newArr[i] = false;
                      setEvaluationState((prev) => ({
                        ...prev,
                        frequentWords: newArr,
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
export default UnitSixEvaluationNine;
