import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { UnitContainer } from "../components/UnitContainer";
import CommentsContainer from "../components/CommentsContainer";
import UnitHeader from "../components/UnitHeader";
import { ConfirmationModal } from "../../ui/ConfirmationModal";
import { useUnitsStore } from "../../../../stores";
import { EvaluationCheckbox } from "../../ui/EvaluationCheckbox";
import EvaluationHeader from "../components/EvaluationHeader";
import { alphabetLower, alphabetUpper } from "../../../pages/const";
import { useParams } from "react-router";
import {
  StudentAnswers,
  MockQuestions,
  MockEvalationQuestions,
} from "../../../../../mockData";

type EvaluationArray = Array<boolean | null>;
type EvaluationTwoState = {
  upperCase: EvaluationArray;
  lowerCase: EvaluationArray;
  comments: string;
};

export function UnitOneEvaluationTwo() {
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
  const evaluationTwoData = unitsData[1];

  const buildEvaluationArray = (value: boolean | null): EvaluationArray =>
    new Array(Object.keys(evaluationTwoData.questions.bigLetters).length).fill(
      value,
    );

  const [evaluationTwo, setEvaluationTwo] = useState<EvaluationTwoState>({
    upperCase: buildEvaluationArray(null),
    lowerCase: buildEvaluationArray(null),
    comments: "",
  });

  useEffect(() => {
    if (!singleAnswer || !singleAnswer.answers) return;

    const ans: MockQuestions = singleAnswer.answers;
    const big: MockEvalationQuestions =
      (ans.bigLetters as MockEvalationQuestions) || {};
    const small: MockEvalationQuestions =
      (ans.smallLetters as MockEvalationQuestions) || {};

    const mapToState = (
      letters: string[],
      obj: MockEvalationQuestions | undefined,
    ) =>
      letters.map((ltr) => {
        const key = ltr === ltr.toLowerCase() ? ltr.toUpperCase() : ltr;
        const val = obj?.[key]?.recognition ?? obj?.[ltr]?.recognition;
        if (val === true) return true;
        if (val === false) return false;
        return null;
      });

    setEvaluationTwo({
      upperCase: mapToState(alphabetUpper, big),
      lowerCase: mapToState(alphabetLower, small),
      comments: singleAnswer.comment,
    });
    setNotRequired(!singleAnswer.required);
    setHasChanges(false);
  }, [singleAnswer]);

  const handleCheckAll = () => {
    setConfirmMessage(t("evaluation.confirmCheckAll"));
    setPendingAction(() => () => {
      setEvaluationTwo((prev) => ({
        ...prev,
        upperCase: buildEvaluationArray(true),
        lowerCase: buildEvaluationArray(true),
      }));
      setHasChanges(true);
    });
    setShowConfirmModal(true);
  };

  const handleFailAll = () => {
    setConfirmMessage(t("evaluation.confirmFailAll"));
    setPendingAction(() => () => {
      setEvaluationTwo((prev) => ({
        ...prev,
        upperCase: buildEvaluationArray(false),
        lowerCase: buildEvaluationArray(false),
      }));
      setHasChanges(true);
    });
    setShowConfirmModal(true);
  };

  const handleClearAll = () => {
    setConfirmMessage(t("evaluation.confirmClearAll"));
    setPendingAction(() => () => {
      setEvaluationTwo((prev) => ({
        ...prev,
        upperCase: buildEvaluationArray(null),
        lowerCase: buildEvaluationArray(null),
        comments: "",
      }));
      setHasChanges(true);
    });
    setShowConfirmModal(true);
  };

  const handleNotRequired = () => {
    setEvaluationTwo((prev) => ({
      ...prev,
      upperCase: buildEvaluationArray(null),
      lowerCase: buildEvaluationArray(null),
      comments: "",
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    const answers: MockQuestions = {
      bigLetters: alphabetUpper.reduce(
        (acc, letter, idx) => {
          acc[letter] = {
            recognition: evaluationTwo.upperCase[idx],
          };
          return acc;
        },
        {} as Record<string, Record<string, boolean | null>>,
      ),
      smallLetters: alphabetLower.reduce(
        (acc, letter, idx) => {
          const key = letter.toUpperCase();
          acc[key] = {
            recognition: evaluationTwo.lowerCase[idx],
          };
          return acc;
        },
        {} as Record<string, Record<string, boolean | null>>,
      ),
    };

    updateAnswer(
      Number(studentId),
      Number(classId),
      Number(evaluationId),
      answers,
      evaluationTwo.comments,
      !notRequired,
    );
    setHasChanges(false);
  };

  return (
    <>
      <UnitHeader
        title={evaluationTwoData.title}
        evaluationNumber={evaluationTwoData.evaluation}
        notRequired={notRequired}
        handleNotRequired={handleNotRequired}
        setNotRequired={setNotRequired}
        handleSave={handleSave}
        isSaveDisabled={!hasChanges}
        setIsSaveDisabled={setHasChanges}
      />
      <UnitContainer notRequired={notRequired}>
        <EvaluationHeader
          unitNumber={evaluationTwoData.unit}
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

        <div className="grid grid-cols-2 gap-6">
          {/* Uppercase */}
          <div>
            <h3 className="text-lg mb-4" style={{ color: "#004aad" }}>
              {t("unitTwo.uppercase")}
            </h3>
            <div className="space-y-2">
              {alphabetUpper.map((letter, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg"
                  style={{ background: "#f7ffd6" }}
                >
                  <span className="font-bold w-8" style={{ color: "#004aad" }}>
                    {letter}
                  </span>
                  <EvaluationCheckbox
                    value={evaluationTwo.upperCase[idx]}
                    onCheck={() => {
                      const newArr = [...evaluationTwo.upperCase];
                      newArr[idx] = true;
                      setEvaluationTwo((prev) => ({
                        ...prev,
                        upperCase: newArr,
                      }));
                      setHasChanges(true);
                    }}
                    onFail={() => {
                      const newArr = [...evaluationTwo.upperCase];
                      newArr[idx] = false;
                      setEvaluationTwo((prev) => ({
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

          {/* Lowercase */}
          <div>
            <h3 className="text-lg mb-4" style={{ color: "#004aad" }}>
              {t("unitTwo.lowercase")}
            </h3>
            <div className="space-y-2">
              {alphabetLower.map((letter, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg"
                  style={{ background: "#f7ffd6" }}
                >
                  <span className="font-bold w-8" style={{ color: "#004aad" }}>
                    {letter}
                  </span>
                  <EvaluationCheckbox
                    value={evaluationTwo.lowerCase[idx]}
                    onCheck={() => {
                      const newArr = [...evaluationTwo.lowerCase];
                      newArr[idx] = true;
                      setEvaluationTwo((prev) => ({
                        ...prev,
                        lowerCase: newArr,
                      }));
                      setHasChanges(true);
                    }}
                    onFail={() => {
                      const newArr = [...evaluationTwo.lowerCase];
                      newArr[idx] = false;
                      setEvaluationTwo((prev) => ({
                        ...prev,
                        lowerCase: newArr,
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
          comments={evaluationTwo.comments}
          onChange={(value) => {
            setEvaluationTwo((prev) => ({ ...prev, comments: value }));
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
