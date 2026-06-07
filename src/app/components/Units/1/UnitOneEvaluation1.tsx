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
import type {
  Questions,
  StudentAnswers,
  NameSoundFlags,
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
  const classAnswers = evaluations(classId!);

  const classAnswersMap = useMemo(() => {
    const studentMap = new Map<string, Map<string, StudentAnswers>>();

    classAnswers.forEach((answer) => {
      const { student_id, unit_data_id } = answer;
      if (!studentMap.has(student_id)) {
        studentMap.set(student_id, new Map());
      }
      // Convert unit_data_id to string for consistent comparison
      studentMap.get(student_id)!.set(unit_data_id, answer);
    });

    return studentMap;
  }, [classAnswers]);

  const evaluationAnswersMap = classAnswersMap.get(studentId!);

  const singleAnswer = evaluationAnswersMap?.get(evaluationId!);

  const evaluationOneData = unitsData[0];

  const getKeys = (cat: any) =>
    cat && typeof cat === "object" && !Array.isArray(cat)
      ? Object.keys(cat)
      : [];

  const bigKeys = useMemo(() => {
    if (!evaluationOneData?.questions?.bigLetters) {
      console.warn("No bigLetters data in evaluationOneData");
      return [];
    }
    const keys = getKeys(evaluationOneData.questions.bigLetters);
    return keys;
  }, [evaluationOneData]);

  const buildEvaluationArray = (value: boolean | null): EvaluationArray =>
    new Array(bigKeys.length).fill(value);

  // State for Atelier 1 & 2 (check/X options)
  const [evaluationOne, setEvaluationOne] = useState<EvaluationOneState>({
    upperCaseName: buildEvaluationArray(null),
    upperCaseSound: buildEvaluationArray(null),
    comments: "",
  });

  useEffect(() => {
    if (!singleAnswer || !singleAnswer.answers) {
      return;
    }
    const ans: Questions = singleAnswer.answers;
    const big = ans.bigLetters as Record<string, NameSoundFlags> | undefined;
    const bigKeys = getKeys(evaluationOneData.questions.bigLetters);

    const mapToState = (
      letters: string[],
      obj: Record<string, NameSoundFlags> | undefined,
      field: "name" | "sound",
    ) =>
      letters.map((ltr) => {
        const key = ltr === ltr.toLowerCase() ? ltr.toUpperCase() : ltr;
        const val = obj?.[key]?.[field] ?? obj?.[ltr]?.[field];
        if (val === true) return true;
        if (val === false) return false;
        return null;
      });

    const upperCaseName = mapToState(bigKeys, big, "name");
    const upperCaseSound = mapToState(bigKeys, big, "sound");

    setEvaluationOne({
      upperCaseName,
      upperCaseSound,
      comments: singleAnswer.comment,
    });
    setNotRequired(!singleAnswer.required);
    setHasChanges(false);
  }, [singleAnswer, evaluationOneData]);

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
    const answers: Questions = {
      bigLetters: bigKeys.reduce(
        (acc, letter, idx) => {
          const nameVal = evaluationOne.upperCaseName[idx];
          const soundVal = evaluationOne.upperCaseSound[idx];
          acc[letter] = {
            name: nameVal === null ? undefined : nameVal,
            sound: soundVal === null ? undefined : soundVal,
          };
          return acc;
        },
        {} as Record<string, NameSoundFlags>,
      ),
    };

    updateAnswer(
      studentId!,
      classId!,
      evaluationId!,
      answers,
      evaluationOne.comments,
      !notRequired,
    );
    setHasChanges(false);
  };

  if (!evaluationOneData) {
    return (
      <div className="p-8 text-center">
        <p style={{ color: "#004aad" }}>Loading evaluation data...</p>
      </div>
    );
  }

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
