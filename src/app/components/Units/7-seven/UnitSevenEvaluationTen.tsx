import { useMemo, useState, useEffect } from "react";
import { useUnitsStore } from "../../../../stores";
import EvaluationHeader from "../components/EvaluationHeader";
import UnitContainer from "../components/UnitContainer";
import UnitHeader from "../components/UnitHeader";
import { ConfirmationModal } from "../../ui/ConfirmationModal";
import { useTranslation } from "react-i18next";
import {
  evaluationTenPseudoWords,
  evaluationTenSentences,
} from "../../../pages/const";
import CommentsContainer from "../components/CommentsContainer";
import { EvaluationCheckbox } from "../../ui/EvaluationCheckbox";
import { useParams } from "react-router";
import { StudentAnswers, MockQuestions } from "../../../../../mockData";

export function UnitSevenEvaluationTen() {
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
  const evaluationTenData = unitsData[9];

  type EvaluationState = {
    sentenceFluency: Array<boolean | null>;
    sentencePunctuation: Array<boolean | null>;
    sentenceIntonation: Array<boolean | null>;
    pseudoWords: Array<boolean | null>;
    comments: string;
  };

  const buildEvaluationArray = (value: boolean | null, length: number) =>
    new Array(length).fill(value) as Array<boolean | null>;

  const [evaluationState, setEvaluationState] = useState<EvaluationState>({
    sentenceFluency: buildEvaluationArray(null, evaluationTenSentences.length),
    sentencePunctuation: buildEvaluationArray(
      null,
      evaluationTenSentences.length,
    ),
    sentenceIntonation: buildEvaluationArray(
      null,
      evaluationTenSentences.length,
    ),
    pseudoWords: buildEvaluationArray(null, evaluationTenPseudoWords.length),
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
      sentenceFluency: mapToArray(
        ans.sentenceFluency,
        evaluationTenSentences.length,
      ),
      sentencePunctuation: mapToArray(
        ans.sentencePunctuation,
        evaluationTenSentences.length,
      ),
      sentenceIntonation: mapToArray(
        ans.sentenceIntonation,
        evaluationTenSentences.length,
      ),
      pseudoWords: mapToArray(ans.pseudoWords, evaluationTenPseudoWords.length),
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
        sentenceFluency: buildEvaluationArray(
          true,
          evaluationTenSentences.length,
        ),
        sentencePunctuation: buildEvaluationArray(
          true,
          evaluationTenSentences.length,
        ),
        sentenceIntonation: buildEvaluationArray(
          true,
          evaluationTenSentences.length,
        ),
        pseudoWords: buildEvaluationArray(
          true,
          evaluationTenPseudoWords.length,
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
        sentenceFluency: buildEvaluationArray(
          false,
          evaluationTenSentences.length,
        ),
        sentencePunctuation: buildEvaluationArray(
          false,
          evaluationTenSentences.length,
        ),
        sentenceIntonation: buildEvaluationArray(
          false,
          evaluationTenSentences.length,
        ),
        pseudoWords: buildEvaluationArray(
          false,
          evaluationTenPseudoWords.length,
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
        sentenceFluency: buildEvaluationArray(
          null,
          evaluationTenSentences.length,
        ),
        sentencePunctuation: buildEvaluationArray(
          null,
          evaluationTenSentences.length,
        ),
        sentenceIntonation: buildEvaluationArray(
          null,
          evaluationTenSentences.length,
        ),
        pseudoWords: buildEvaluationArray(
          null,
          evaluationTenPseudoWords.length,
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
      sentenceFluency: buildEvaluationArray(
        null,
        evaluationTenSentences.length,
      ),
      sentencePunctuation: buildEvaluationArray(
        null,
        evaluationTenSentences.length,
      ),
      sentenceIntonation: buildEvaluationArray(
        null,
        evaluationTenSentences.length,
      ),
      pseudoWords: buildEvaluationArray(null, evaluationTenPseudoWords.length),
      comments: "",
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    const answers: any = {
      sentenceFluency: evaluationState.sentenceFluency.reduce(
        (acc, val, idx) => {
          acc[idx] = val;
          return acc;
        },
        {} as Record<string, boolean | null>,
      ),
      sentencePunctuation: evaluationState.sentencePunctuation.reduce(
        (acc, val, idx) => {
          acc[idx] = val;
          return acc;
        },
        {} as Record<string, boolean | null>,
      ),
      sentenceIntonation: evaluationState.sentenceIntonation.reduce(
        (acc, val, idx) => {
          acc[idx] = val;
          return acc;
        },
        {} as Record<string, boolean | null>,
      ),
      pseudoWords: evaluationState.pseudoWords.reduce(
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
        title={evaluationTenData.title}
        evaluationNumber={evaluationTenData.evaluation}
        notRequired={notRequired}
        handleNotRequired={handleNotRequired}
        setNotRequired={setNotRequired}
        handleSave={handleSave}
        isSaveDisabled={!hasChanges}
        setIsSaveDisabled={setHasChanges}
      />
      <UnitContainer notRequired={notRequired}>
        <EvaluationHeader
          unitNumber={evaluationTenData.unit}
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
            <strong>{t("unitSeven.instructions.title")}</strong>{" "}
            {t("unitSeven.instructions.body")}
          </p>
        </div>

        <div id="atelier10-content" className="space-y-6">
          <div className="p-5 rounded-xl" style={{ background: "#dff3ff" }}>
            <h3
              className="text-base mb-4 font-bold"
              style={{ color: "#004aad" }}
            >
              {t("unitSeven.sentenceReading.title")}
            </h3>
            <p className="text-sm mb-3" style={{ color: "#666" }}>
              {t("unitSeven.sentenceReading.prompt")}
            </p>
            {evaluationTenSentences.map((sentence, i) => (
              <div
                key={i}
                className="mb-4 p-4 rounded-lg"
                style={{ background: "#ffffff" }}
              >
                <p className="text-base mb-3" style={{ color: "#004aad" }}>
                  {sentence}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: "#666" }}>
                      Fluidité
                    </span>
                    <EvaluationCheckbox
                      value={evaluationState.sentenceFluency[i]}
                      onCheck={() => {
                        const newArr = [...evaluationState.sentenceFluency];
                        newArr[i] = true;
                        setEvaluationState((prev) => ({
                          ...prev,
                          sentenceFluency: newArr,
                        }));
                        setHasChanges(true);
                      }}
                      onFail={() => {
                        const newArr = [...evaluationState.sentenceFluency];
                        newArr[i] = false;
                        setEvaluationState((prev) => ({
                          ...prev,
                          sentenceFluency: newArr,
                        }));
                        setHasChanges(true);
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: "#666" }}>
                      Ponctuation
                    </span>
                    <EvaluationCheckbox
                      value={evaluationState.sentencePunctuation[i]}
                      onCheck={() => {
                        const newArr = [...evaluationState.sentencePunctuation];
                        newArr[i] = true;
                        setEvaluationState((prev) => ({
                          ...prev,
                          sentencePunctuation: newArr,
                        }));
                        setHasChanges(true);
                      }}
                      onFail={() => {
                        const newArr = [...evaluationState.sentencePunctuation];
                        newArr[i] = false;
                        setEvaluationState((prev) => ({
                          ...prev,
                          sentencePunctuation: newArr,
                        }));
                        setHasChanges(true);
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: "#666" }}>
                      Intonation
                    </span>
                    <EvaluationCheckbox
                      value={evaluationState.sentenceIntonation[i]}
                      onCheck={() => {
                        const newArr = [...evaluationState.sentenceIntonation];
                        newArr[i] = true;
                        setEvaluationState((prev) => ({
                          ...prev,
                          sentenceIntonation: newArr,
                        }));
                        setHasChanges(true);
                      }}
                      onFail={() => {
                        const newArr = [...evaluationState.sentenceIntonation];
                        newArr[i] = false;
                        setEvaluationState((prev) => ({
                          ...prev,
                          sentenceIntonation: newArr,
                        }));
                        setHasChanges(true);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-xl" style={{ background: "#f7ffd6" }}>
            <h3
              className="text-base mb-4 font-bold"
              style={{ color: "#004aad" }}
            >
              {t("unitSeven.pseudoWords.title")}
            </h3>
            <p className="text-sm mb-3" style={{ color: "#666" }}>
              {t("unitSeven.pseudoWords.prompt")}
            </p>
            <div className="grid grid-cols-5 gap-3">
              {evaluationTenPseudoWords.map((word, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg"
                  style={{ background: "#ffffff" }}
                >
                  <span
                    className="text-lg font-bold"
                    style={{ color: "#004aad" }}
                  >
                    {word}
                  </span>
                  <EvaluationCheckbox
                    value={evaluationState.pseudoWords[i]}
                    onCheck={() => {
                      const newArr = [...evaluationState.pseudoWords];
                      newArr[i] = true;
                      setEvaluationState((prev) => ({
                        ...prev,
                        pseudoWords: newArr,
                      }));
                      setHasChanges(true);
                    }}
                    onFail={() => {
                      const newArr = [...evaluationState.pseudoWords];
                      newArr[i] = false;
                      setEvaluationState((prev) => ({
                        ...prev,
                        pseudoWords: newArr,
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
export default UnitSevenEvaluationTen;
