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
import { StudentAnswers, MockQuestions } from "../../../../../mockData";
import { evaluationThirteenComprehension } from "../../../pages/const";

export function UnitTenEvaluationThirteen() {
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
  const evaluationThirteenData = unitsData[12];

  type EvaluationState = {
    readingFluency: Array<boolean | null>;
    comprehensionQuestions: Array<boolean | null>;
    comments: string;
  };

  const buildEvaluationArray = (value: boolean | null, length: number) =>
    new Array(length).fill(value) as Array<boolean | null>;

  const [evaluationState, setEvaluationState] = useState<EvaluationState>({
    readingFluency: buildEvaluationArray(null, 1),
    comprehensionQuestions: buildEvaluationArray(
      null,
      evaluationThirteenComprehension.length,
    ),
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
      readingFluency: mapToArray(ans.readingFluency, 1),
      comprehensionQuestions: mapToArray(
        ans.comprehensionQuestions,
        evaluationThirteenComprehension.length,
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
        readingFluency: buildEvaluationArray(true, 1),
        comprehensionQuestions: buildEvaluationArray(
          true,
          evaluationThirteenComprehension.length,
        ),
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
        readingFluency: buildEvaluationArray(false, 1),
        comprehensionQuestions: buildEvaluationArray(
          false,
          evaluationThirteenComprehension.length,
        ),
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
        readingFluency: buildEvaluationArray(null, 1),
        comprehensionQuestions: buildEvaluationArray(
          null,
          evaluationThirteenComprehension.length,
        ),
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
      comprehensionQuestions: buildEvaluationArray(
        null,
        evaluationThirteenComprehension.length,
      ),
      comments: "",
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    const answers: any = {
      readingFluency: evaluationState.readingFluency.reduce(
        (acc, val, idx) => {
          acc[idx] = val;
          return acc;
        },
        {} as Record<string, boolean | null>,
      ),
      comprehensionQuestions: evaluationState.comprehensionQuestions.reduce(
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
        title={evaluationThirteenData.title}
        evaluationNumber={evaluationThirteenData.evaluation}
        notRequired={notRequired}
        handleNotRequired={handleNotRequired}
        setNotRequired={setNotRequired}
        handleSave={handleSave}
        isSaveDisabled={!hasChanges}
        setIsSaveDisabled={setHasChanges}
      />
      <UnitContainer notRequired={notRequired}>
        <EvaluationHeader
          unitNumber={evaluationThirteenData.unit}
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
            {evaluationThirteenComprehension.map((item, i) => (
              <div
                key={i}
                className="mb-3 p-3 rounded"
                style={{ background: "#ffffff" }}
              >
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-sm flex-1" style={{ color: "#004aad" }}>
                    {item.q}
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
                <p className="text-xs italic pl-3" style={{ color: "#2e7d32" }}>
                  [Réponse: {item.a}]
                </p>
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
export default UnitTenEvaluationThirteen;
