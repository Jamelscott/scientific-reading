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
import { StudentAnswers, MockQuestions } from "../../../../../mockData";

type EvaluationArray = Array<boolean | null>;
type EvaluationFourState = {
  beginningSound: EvaluationArray;
  endingSound: EvaluationArray;
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
  const evaluationFourData = unitsData[3];

  const buildEvaluationArray = (value: boolean | null): EvaluationArray =>
    new Array(5).fill(value);

  const [evaluationFour, setEvaluationFour] = useState<EvaluationFourState>({
    beginningSound: buildEvaluationArray(null),
    endingSound: buildEvaluationArray(null),
    comments: "",
  });

  useEffect(() => {
    if (!singleAnswer || !singleAnswer.answers) return;

    const ans: MockQuestions = singleAnswer.answers;
    const beginningSoundData = ans.beginningSound as any;
    const endingSoundData = ans.endingSound as any;

    const mapToArray = (obj: any, length: number) => {
      if (!obj) return new Array(length).fill(null);
      return Array.from({ length }, (_, i) => {
        const val = obj[i];
        if (val === true) return true;
        if (val === false) return false;
        return null;
      });
    };

    setEvaluationFour({
      beginningSound: mapToArray(beginningSoundData, 5),
      endingSound: mapToArray(endingSoundData, 5),
      comments: singleAnswer.comment,
    });
    setNotRequired(!singleAnswer.required);
    setHasChanges(false);
  }, [singleAnswer]);

  const handleCheckAll = () => {
    setConfirmMessage(t("evaluation.confirmCheckAll"));
    setPendingAction(() => () => {
      setEvaluationFour((prev) => ({
        ...prev,
        beginningSound: buildEvaluationArray(true),
        endingSound: buildEvaluationArray(true),
      }));
      setHasChanges(true);
    });
    setShowConfirmModal(true);
  };

  const handleFailAll = () => {
    setConfirmMessage(t("evaluation.confirmFailAll"));
    setPendingAction(() => () => {
      setEvaluationFour((prev) => ({
        ...prev,
        beginningSound: buildEvaluationArray(false),
        endingSound: buildEvaluationArray(false),
      }));
      setHasChanges(true);
    });
    setShowConfirmModal(true);
  };

  const handleClearAll = () => {
    setConfirmMessage(t("evaluation.confirmClearAll"));
    setPendingAction(() => () => {
      setEvaluationFour((prev) => ({
        ...prev,
        beginningSound: buildEvaluationArray(null),
        endingSound: buildEvaluationArray(null),
        comments: "",
      }));
      setHasChanges(true);
    });
    setShowConfirmModal(true);
  };

  const handleNotRequired = () => {
    setEvaluationFour((prev) => ({
      ...prev,
      beginningSound: buildEvaluationArray(null),
      endingSound: buildEvaluationArray(null),
      comments: "",
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    const answers: any = {
      beginningSound: evaluationFour.beginningSound.reduce(
        (acc, val, idx) => {
          acc[idx] = val;
          return acc;
        },
        {} as Record<string, boolean | null>,
      ),
      endingSound: evaluationFour.endingSound.reduce(
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
            {[
              { word: "maison", sound: "/m/" },
              { word: "ballon", sound: "/b/" },
              { word: "soleil", sound: "/s/" },
              { word: "fenêtre", sound: "/f/" },
              { word: "chat", sound: "/ʃ/" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 mb-3"
              >
                <div>
                  <span
                    className="text-sm w-20 font-medium"
                    style={{ color: "#004aad" }}
                  >
                    {item.word}
                  </span>
                  <span
                    className="text-xs px-2 py-1 rounded"
                    style={{ background: "#f0f0f0", color: "#666" }}
                  >
                    {item.sound}
                  </span>
                </div>
                <EvaluationCheckbox
                  value={evaluationFour.beginningSound[i]}
                  onCheck={() => {
                    const newArr = [...evaluationFour.beginningSound];
                    newArr[i] = true;
                    setEvaluationFour((prev) => ({
                      ...prev,
                      beginningSound: newArr,
                    }));
                    setHasChanges(true);
                  }}
                  onFail={() => {
                    const newArr = [...evaluationFour.beginningSound];
                    newArr[i] = false;
                    setEvaluationFour((prev) => ({
                      ...prev,
                      beginningSound: newArr,
                    }));
                    setHasChanges(true);
                  }}
                />
              </div>
            ))}
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
            {[
              { word: "chat", sound: "/a/" },
              { word: "pomme", sound: "/m/" },
              { word: "souris", sound: "/i/" },
              { word: "sac", sound: "/k/" },
              { word: "fil", sound: "/l/" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 mb-3 justify-between"
              >
                <div>
                  <span
                    className="text-sm w-20 font-medium"
                    style={{ color: "#004aad" }}
                  >
                    {item.word}
                  </span>
                  <span
                    className="text-xs px-2 py-1 rounded"
                    style={{ background: "#f0f0f0", color: "#666" }}
                  >
                    {item.sound}
                  </span>
                </div>
                <EvaluationCheckbox
                  value={evaluationFour.endingSound[i]}
                  onCheck={() => {
                    const newArr = [...evaluationFour.endingSound];
                    newArr[i] = true;
                    setEvaluationFour((prev) => ({
                      ...prev,
                      endingSound: newArr,
                    }));
                    setHasChanges(true);
                  }}
                  onFail={() => {
                    const newArr = [...evaluationFour.endingSound];
                    newArr[i] = false;
                    setEvaluationFour((prev) => ({
                      ...prev,
                      endingSound: newArr,
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

export default UnitOneEvaluationFour;
