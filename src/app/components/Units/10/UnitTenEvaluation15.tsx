import { useMemo, useState, useEffect } from "react";
import { useUnitsStore } from "../../../../stores";
import EvaluationHeader from "../components/EvaluationHeader";
import UnitContainer from "../components/UnitContainer";
import UnitHeader from "../components/UnitHeader";
import { ConfirmationModal } from "../../ui/ConfirmationModal";
import { useTranslation } from "react-i18next";
import CommentsContainer from "../components/CommentsContainer";
import { EvaluationCheckbox } from "../../ui/EvaluationCheckbox";
import { useParams } from "react-router";
import type { Questions, StudentAnswers } from "../../../../../mockData/types";

export function UnitTenEvaluationFifteen() {
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
  const evaluationFifteenData = unitsData[14];

  const getKeys = (cat: any) =>
    cat && typeof cat === "object" && !Array.isArray(cat)
      ? Object.keys(cat)
      : [];

  const dataKeys = useMemo(
    () => getKeys(evaluationFifteenData.questions.data),
    [evaluationFifteenData.questions.data],
  );

  type EvaluationState = {
    readingFluency: Array<boolean | null>;
    comprehensionQuestions: Array<boolean | null>;
    comments: string;
  };

  const buildEvaluationArray = (value: boolean | null, length: number) =>
    new Array(length).fill(value) as Array<boolean | null>;

  const [evaluationState, setEvaluationState] = useState<EvaluationState>({
    readingFluency: buildEvaluationArray(null, 1),
    comprehensionQuestions: buildEvaluationArray(null, dataKeys.length),
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
      readingFluency: mapToArray(["fluency"], ans.readingFluency),
      comprehensionQuestions: mapToArray(dataKeys, ans.data),
      comments: singleAnswer.comment,
    });
    setNotRequired(!singleAnswer.required);
    setHasChanges(false);
  }, [singleAnswer, dataKeys]);

  const handleCheckAll = () => {
    setEvaluationState((prev) => ({
      ...prev,
      readingFluency: buildEvaluationArray(true, 1),
      comprehensionQuestions: buildEvaluationArray(true, dataKeys.length),
    }));
    setHasChanges(true);
  };

  const handleFailAll = () => {
    setEvaluationState((prev) => ({
      ...prev,
      readingFluency: buildEvaluationArray(false, 1),
      comprehensionQuestions: buildEvaluationArray(false, dataKeys.length),
    }));
    setHasChanges(true);
  };

  const handleClearAll = () => {
    setConfirmMessage(t("evaluation.confirmClearAll"));
    setPendingAction(() => () => {
      setEvaluationState((prev) => ({
        ...prev,
        readingFluency: buildEvaluationArray(null, 1),
        comprehensionQuestions: buildEvaluationArray(null, dataKeys.length),
        comments: "",
      }));
      setHasChanges(true);
    });
    setShowConfirmModal(true);
  };

  const handleNotRequired = () => {
    setEvaluationState((prev) => ({
      ...prev,
      readingFluency: buildEvaluationArray(null, 1),
      comprehensionQuestions: buildEvaluationArray(null, dataKeys.length),
      comments: "",
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    const answers: any = {
      readingFluency: evaluationState.readingFluency.reduce(
        (acc, val, idx) => {
          acc["fluency"] = val;
          return acc;
        },
        {} as Record<string, boolean | null>,
      ),
      data: dataKeys.reduce(
        (acc, key, idx) => {
          acc[key] = evaluationState.comprehensionQuestions[idx];
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
        title={evaluationFifteenData.title}
        evaluationNumber={evaluationFifteenData.evaluation}
        notRequired={notRequired}
        handleNotRequired={handleNotRequired}
        setNotRequired={setNotRequired}
        handleSave={handleSave}
        isSaveDisabled={!hasChanges}
        setIsSaveDisabled={setHasChanges}
      />
      <UnitContainer notRequired={notRequired}>
        <EvaluationHeader
          unitNumber={evaluationFifteenData.unit}
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
            <strong>{t("unitTen.instructions.title")}</strong>{" "}
            {t("unitTen.instructions.body")}
          </p>
        </div>

        <div id="atelier13-content" className="space-y-4">
          <div className="p-5 rounded-xl" style={{ background: "#dff3ff" }}>
            <h3
              className="text-base mb-3 font-bold"
              style={{ color: "#004aad" }}
            >
              Texte lu par l'élève (lecture autonome)
            </h3>
            <div
              className="p-4 rounded leading-relaxed"
              style={{ background: "#ffffff" }}
            >
              <p
                className="text-base"
                style={{ color: "#004aad", lineHeight: "1.8" }}
              >
                Mon chat s'appelle Minou. Il est noir et blanc avec de grands
                yeux verts. Minou aime dormir sur mon lit et jouer avec une
                balle rouge. Tous les matins, il boit du lait dans son bol bleu.
                C'est mon meilleur ami!
              </p>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-sm" style={{ color: "#666" }}>
                Fluidité de lecture
              </span>
              <EvaluationCheckbox
                value={evaluationState.readingFluency[0]}
                onCheck={() => {
                  const newArr = [...evaluationState.readingFluency];
                  newArr[0] = true;
                  setEvaluationState((prev) => ({
                    ...prev,
                    readingFluency: newArr,
                  }));
                  setHasChanges(true);
                }}
                onFail={() => {
                  const newArr = [...evaluationState.readingFluency];
                  newArr[0] = false;
                  setEvaluationState((prev) => ({
                    ...prev,
                    readingFluency: newArr,
                  }));
                  setHasChanges(true);
                }}
              />
            </div>
          </div>

          <div className="p-5 rounded-xl" style={{ background: "#f7ffd6" }}>
            <h3
              className="text-base mb-4 font-bold"
              style={{ color: "#004aad" }}
            >
              {t("unitTen.comprehension.title")}
            </h3>
            {dataKeys.map((item, i) => {
              const key = item;
              return (
                <div
                  key={i}
                  className="mb-3 p-3 rounded"
                  style={{ background: "#ffffff" }}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <span
                      className="text-sm flex-1"
                      style={{ color: "#004aad" }}
                    >
                      {key}
                    </span>
                    <EvaluationCheckbox
                      value={evaluationState.comprehensionQuestions[i]}
                      onCheck={() => {
                        const newArr = [
                          ...evaluationState.comprehensionQuestions,
                        ];
                        newArr[i] = true;
                        setEvaluationState((prev) => ({
                          ...prev,
                          comprehensionQuestions: newArr,
                        }));
                        setHasChanges(true);
                      }}
                      onFail={() => {
                        const newArr = [
                          ...evaluationState.comprehensionQuestions,
                        ];
                        newArr[i] = false;
                        setEvaluationState((prev) => ({
                          ...prev,
                          comprehensionQuestions: newArr,
                        }));
                        setHasChanges(true);
                      }}
                    />
                  </div>
                </div>
              );
            })}
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
export default UnitTenEvaluationFifteen;
