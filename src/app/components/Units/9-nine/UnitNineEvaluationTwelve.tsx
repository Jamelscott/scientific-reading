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
import { evaluationTwelveComprehension } from "../../../pages/const";

export function UnitNineEvaluationTwelve() {
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
  const evaluationTwelveData = unitsData[11];

  type EvaluationState = {
    comprehensionQuestions: Array<boolean | null>;
    comments: string;
  };

  const buildEvaluationArray = (value: boolean | null, length: number) =>
    new Array(length).fill(value) as Array<boolean | null>;

  const [evaluationState, setEvaluationState] = useState<EvaluationState>({
    comprehensionQuestions: buildEvaluationArray(
      null,
      evaluationTwelveComprehension.length,
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
      comprehensionQuestions: mapToArray(
        ans.comprehensionQuestions,
        evaluationTwelveComprehension.length,
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
        comprehensionQuestions: buildEvaluationArray(
          true,
          evaluationTwelveComprehension.length,
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
        comprehensionQuestions: buildEvaluationArray(
          false,
          evaluationTwelveComprehension.length,
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
        comprehensionQuestions: buildEvaluationArray(
          null,
          evaluationTwelveComprehension.length,
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
      comprehensionQuestions: buildEvaluationArray(
        null,
        evaluationTwelveComprehension.length,
      ),
      comments: "",
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    const answers: any = {
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
        title={evaluationTwelveData.title}
        evaluationNumber={evaluationTwelveData.evaluation}
        notRequired={notRequired}
        handleNotRequired={handleNotRequired}
        setNotRequired={setNotRequired}
        handleSave={handleSave}
        isSaveDisabled={!hasChanges}
        setIsSaveDisabled={setHasChanges}
      />
      <UnitContainer notRequired={notRequired}>
        <EvaluationHeader
          unitNumber={evaluationTwelveData.unit}
          handleCheckAll={handleCheckAll}
          handleClearAll={handleClearAll}
          handleFailAll={handleFailAll}
        />
        <div
          className="mb-6 p-4 rounded-xl"
          style={{ background: "#fff9e6", border: "1px solid #ffde59" }}
        >
          <p className="text-sm" style={{ color: "#004aad" }}>
            <strong>{t("unitNine.instructions.title")}</strong>{" "}
            {t("unitNine.instructions.body")}
          </p>
        </div>

        <div id="atelier12-content" className="space-y-4">
          <div className="p-5 rounded-xl" style={{ background: "#dff3ff" }}>
            <h3
              className="text-base mb-3 font-bold"
              style={{ color: "#004aad" }}
            >
              Texte lu par l'enseignant(e)
            </h3>
            <p className="text-sm mb-3" style={{ color: "#666" }}>
              L'élève ferme les yeux et écoute attentivement pendant la lecture.
            </p>
            <div
              className="p-4 rounded leading-relaxed"
              style={{ background: "#ffffff" }}
            >
              <p className="text-sm mb-2" style={{ color: "#004aad" }}>
                C'est une belle journée d'été. Sophie et son frère Marc vont au
                parc avec leur chien Félix. Ils apportent un ballon rouge et un
                pique-nique. Au parc, ils jouent au ballon sur l'herbe verte.
                Félix court après le ballon et aboie joyeusement. Après le jeu,
                ils mangent des sandwichs et boivent du jus. Sophie et Marc sont
                très contents de leur journée au parc. Ils rentrent à la maison
                fatigués mais heureux.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl" style={{ background: "#f7ffd6" }}>
            <h3
              className="text-base mb-4 font-bold"
              style={{ color: "#004aad" }}
            >
              {t("unitNine.comprehension.title")}
            </h3>
            {evaluationTwelveComprehension.map((item, i) => (
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
export default UnitNineEvaluationTwelve;
