import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { UnitContainer } from "../components/UnitContainer";
import CommentsContainer from "../components/CommentsContainer";
import UnitHeader from "../components/UnitHeader";
import { ConfirmationModal } from "../../ui/ConfirmationModal";
import { useUnitsStore } from "../../../../stores";
import { EvaluationCheckbox } from "../../ui/EvaluationCheckbox";
import EvaluationHeader from "../components/EvaluationHeader";
import { useParams } from "react-router";
import {
  MockEvalationQuestions,
  MockQuestions,
  StudentAnswers,
} from "../../../../../mockData/types";

type EvaluationArray = Array<boolean | null>;
type EvaluationOneState = {
  upperCaseName: EvaluationArray;
  upperCaseSound: EvaluationArray;
  comments: string;
};

export function UnitOneEvaluationOne() {
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
  const evaluationOneData = unitsData[0];

  const getKeys = (cat: any) =>
    cat && typeof cat === "object" && !Array.isArray(cat)
      ? Object.keys(cat)
      : [];

  const bigKeys = useMemo(
    () => getKeys(evaluationOneData.questions.bigLetters),
    [evaluationOneData.questions.bigLetters],
  );

  const buildEvaluationArray = (value: boolean | null): EvaluationArray =>
    new Array(getKeys(evaluationOneData.questions.bigLetters).length).fill(
      value,
    );

  // State for Atelier 1 & 2 (check/X options)
  const [evaluationOne, setEvaluationOne] = useState<EvaluationOneState>({
    upperCaseName: buildEvaluationArray(null),
    upperCaseSound: buildEvaluationArray(null),
    comments: "",
  });

  useEffect(() => {
    if (!singleAnswer || !singleAnswer.answers) return;

    const ans: MockQuestions = singleAnswer.answers;
    const big: MockEvalationQuestions =
      (ans.bigLetters as MockEvalationQuestions) || {};

    const bigKeys = getKeys(evaluationOneData.questions.bigLetters);

    const mapToState = (
      letters: string[],
      obj: MockEvalationQuestions | undefined,
      field: "name" | "sound",
    ) =>
      letters.map((ltr) => {
        const key = ltr === ltr.toLowerCase() ? ltr.toUpperCase() : ltr;
        const val = obj?.[key]?.[field] ?? obj?.[ltr]?.[field];
        if (val === true) return true;
        if (val === false) return false;
        return null;
      });

    setEvaluationOne({
      upperCaseName: mapToState(bigKeys, big, "name"),
      upperCaseSound: mapToState(bigKeys, big, "sound"),
      comments: singleAnswer.comment,
    });
    setNotRequired(!singleAnswer.required);
    setHasChanges(false);
  }, [singleAnswer]);

  const handleCheckAll = () => {
    setConfirmMessage(t("evaluation.confirmCheckAll"));
    setPendingAction(() => () => {
      setEvaluationOne((prev) => ({
        ...prev,
        upperCaseName: buildEvaluationArray(true),
        upperCaseSound: buildEvaluationArray(true),
      }));
      setHasChanges(true);
    });
    setShowConfirmModal(true);
  };

  const handleFailAll = () => {
    setConfirmMessage(t("evaluation.confirmFailAll"));
    setPendingAction(() => () => {
      setEvaluationOne((prev) => ({
        ...prev,
        upperCaseName: buildEvaluationArray(false),
        upperCaseSound: buildEvaluationArray(false),
        comments: evaluationOne.comments,
      }));
      setHasChanges(true);
    });
    setShowConfirmModal(true);
  };

  const handleClearAll = () => {
    setConfirmMessage(t("evaluation.confirmClearAll"));
    setPendingAction(() => () => {
      setEvaluationOne((prev) => ({
        ...prev,
        upperCaseName: buildEvaluationArray(null),
        upperCaseSound: buildEvaluationArray(null),
        comments: "",
      }));
      setHasChanges(true);
    });
    setShowConfirmModal(true);
  };

  const handleNotRequired = () => {
    setEvaluationOne((prev) => ({
      ...prev,
      upperCaseName: buildEvaluationArray(null),
      upperCaseSound: buildEvaluationArray(null),
      comments: "",
    }));

    setHasChanges(true);
  };

  const handleSave = () => {
    const bigKeys = getKeys(evaluationOneData.questions.bigLetters);
    const answers: MockQuestions = {
      bigLetters: bigKeys.reduce(
        (acc, letter, idx) => {
          acc[letter] = {
            name: evaluationOne.upperCaseName[idx],
            sound: evaluationOne.upperCaseSound[idx],
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
      evaluationOne.comments,
      !notRequired,
    );
    setHasChanges(false);
  };
  return (
    <>
      <UnitHeader
        title={evaluationOneData.title}
        evaluationNumber={evaluationOneData.evaluation}
        notRequired={notRequired}
        handleNotRequired={handleNotRequired}
        setNotRequired={setNotRequired}
        handleSave={handleSave}
        isSaveDisabled={!hasChanges}
        setIsSaveDisabled={setHasChanges}
      />
      <UnitContainer notRequired={notRequired}>
        <>
          <EvaluationHeader
            unitNumber={evaluationOneData.unit}
            handleCheckAll={handleCheckAll}
            handleFailAll={handleFailAll}
            handleClearAll={handleClearAll}
            evaluationId={evaluationId!}
          />
          <div
            className="mb-6 p-4 rounded-xl bg-[#fff9e6]"
            style={{ border: "1px solid #ffde59" }}
          >
            <p className="text-sm" style={{ color: "#004aad" }}>
              <strong>{t("unitOne.instructions.title")}</strong>{" "}
              {t("unitOne.instructions.body")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {/* Uppercase */}
            <div>
              <h3 className="text-lg mb-4" style={{ color: "#004aad" }}>
                {t("unitOne.uppercase")}
              </h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ background: "#38b6ff" }}>
                    <th
                      className="px-3 py-2 text-left text-sm"
                      style={{ color: "#ffffff" }}
                    >
                      {t("unitOne.labels.letter")}
                    </th>
                    <th
                      className="px-3 py-2 text-center text-sm"
                      style={{ color: "#ffffff" }}
                    >
                      {t("unitOne.labels.name")}
                    </th>
                    <th
                      className="px-3 py-2 text-center text-sm"
                      style={{ color: "#ffffff" }}
                    >
                      {t("unitOne.labels.sound")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bigKeys.map((letter, idx) => (
                    <tr
                      key={idx}
                      className="border-b"
                      style={{ borderColor: "#dff3ff" }}
                    >
                      <td
                        className="px-3 py-2 font-bold text-lg"
                        style={{ color: "#004aad" }}
                      >
                        {letter}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <EvaluationCheckbox
                          value={evaluationOne.upperCaseName[idx]}
                          onCheck={() => {
                            const newArr = [...evaluationOne.upperCaseName];
                            newArr[idx] = true;
                            setEvaluationOne((prev) => ({
                              ...prev,
                              upperCaseName: newArr,
                            }));
                            setHasChanges(true);
                          }}
                          onFail={() => {
                            const newArr = [...evaluationOne.upperCaseName];
                            newArr[idx] = false;
                            setEvaluationOne((prev) => ({
                              ...prev,
                              upperCaseName: newArr,
                            }));
                            setHasChanges(true);
                          }}
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <EvaluationCheckbox
                          value={evaluationOne.upperCaseSound[idx]}
                          onCheck={() => {
                            const newArr = [...evaluationOne.upperCaseSound];
                            newArr[idx] = true;
                            setEvaluationOne((prev) => ({
                              ...prev,
                              upperCaseSound: newArr,
                            }));
                            setHasChanges(true);
                          }}
                          onFail={() => {
                            const newArr = [...evaluationOne.upperCaseSound];
                            newArr[idx] = false;
                            setEvaluationOne((prev) => ({
                              ...prev,
                              upperCaseSound: newArr,
                            }));
                            setHasChanges(true);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <CommentsContainer
            comments={evaluationOne.comments}
            onChange={(value) => {
              setEvaluationOne((prev) => ({ ...prev, comments: value }));
              setHasChanges(true);
            }}
          />
        </>
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
export default UnitOneEvaluationOne;
