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
type EvaluationTwoState = {
  lowerCaseName: EvaluationArray;
  lowerCaseSound: EvaluationArray;
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
      studentMap.get(student_id)!.set(String(unit_data_id), answer);
    });

    return studentMap;
  }, [classAnswers]);
  const evaluationAnswersMap = classAnswersMap.get(studentId!);
  const singleAnswer = evaluationAnswersMap?.get(evaluationId!);
  const evaluationTwoData = unitsData[1];

  const getKeys = (cat: any) =>
    cat && typeof cat === "object" && !Array.isArray(cat)
      ? Object.keys(cat)
      : [];

  const smallKeys = useMemo(() => {
    if (!evaluationTwoData?.questions?.smallLetters) {
      console.warn("No smallLetters data in evaluationTwoData");
      return [];
    }
    const keys = getKeys(evaluationTwoData.questions.smallLetters);
    return keys;
  }, [evaluationTwoData]);

  console.log(smallKeys);

  const buildEvaluationArray = (value: boolean | null): EvaluationArray =>
    new Array(smallKeys.length).fill(value);

  // State for Atelier 2 (check/X options for lowercase)
  const [evaluationTwo, setEvaluationTwo] = useState<EvaluationTwoState>({
    lowerCaseName: buildEvaluationArray(null),
    lowerCaseSound: buildEvaluationArray(null),
    comments: "",
  });

  useEffect(() => {
    if (!singleAnswer || !singleAnswer.answers) return;

    const ans: Questions = singleAnswer.answers;
    const small: Record<string, NameSoundFlags> =
      (ans.smallLetters as Record<string, NameSoundFlags>) || {};

    const smallKeysArray = getKeys(evaluationTwoData.questions.smallLetters);
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
    const lowerCaseName = mapToState(smallKeysArray, small, "name");
    const lowerCaseSound = mapToState(smallKeysArray, small, "sound");
    setEvaluationTwo({
      lowerCaseName,
      lowerCaseSound,
      comments: singleAnswer.comment,
    });
    setNotRequired(!singleAnswer.required);
    setHasChanges(false);
  }, [singleAnswer, evaluationTwoData]);

  const handleCheckAll = () => {
    setConfirmMessage(t("evaluation.confirmCheckAll"));
    setPendingAction(() => () => {
      setEvaluationTwo((prev) => ({
        ...prev,
        lowerCaseName: buildEvaluationArray(true),
        lowerCaseSound: buildEvaluationArray(true),
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
        lowerCaseName: buildEvaluationArray(false),
        lowerCaseSound: buildEvaluationArray(false),
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
        lowerCaseName: buildEvaluationArray(null),
        lowerCaseSound: buildEvaluationArray(null),
        comments: "",
      }));
      setHasChanges(true);
    });
    setShowConfirmModal(true);
  };

  const handleNotRequired = () => {
    setEvaluationTwo((prev) => ({
      ...prev,
      lowerCaseName: buildEvaluationArray(null),
      lowerCaseSound: buildEvaluationArray(null),
      comments: "",
    }));

    setHasChanges(true);
  };

  const handleSave = () => {
    const smallKeysArray = getKeys(evaluationTwoData.questions.smallLetters);
    const answers: Questions = {
      smallLetters: smallKeysArray.reduce(
        (acc, letter, idx) => {
          acc[letter] = {
            name: evaluationTwo.lowerCaseName[idx],
            sound: evaluationTwo.lowerCaseSound[idx],
          };
          return acc;
        },
        {} as Record<string, Record<string, boolean | null>>,
      ),
    };

    updateAnswer(
      studentId!,
      classId!,
      evaluationId!,
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
        <>
          <EvaluationHeader
            unitNumber={evaluationTwoData.unit}
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
            {/* Lowercase */}
            <div>
              <h3 className="text-lg mb-4" style={{ color: "#004aad" }}>
                {t("unitOne.lowercase")}
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
                  {smallKeys.map((letter, idx) => (
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
                          value={evaluationTwo.lowerCaseName[idx]}
                          onCheck={() => {
                            const newArr = [...evaluationTwo.lowerCaseName];
                            newArr[idx] = true;
                            setEvaluationTwo((prev) => ({
                              ...prev,
                              lowerCaseName: newArr,
                            }));
                            setHasChanges(true);
                          }}
                          onFail={() => {
                            const newArr = [...evaluationTwo.lowerCaseName];
                            newArr[idx] = false;
                            setEvaluationTwo((prev) => ({
                              ...prev,
                              lowerCaseName: newArr,
                            }));
                            setHasChanges(true);
                          }}
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <EvaluationCheckbox
                          value={evaluationTwo.lowerCaseSound[idx]}
                          onCheck={() => {
                            const newArr = [...evaluationTwo.lowerCaseSound];
                            newArr[idx] = true;
                            setEvaluationTwo((prev) => ({
                              ...prev,
                              lowerCaseSound: newArr,
                            }));
                            setHasChanges(true);
                          }}
                          onFail={() => {
                            const newArr = [...evaluationTwo.lowerCaseSound];
                            newArr[idx] = false;
                            setEvaluationTwo((prev) => ({
                              ...prev,
                              lowerCaseSound: newArr,
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
            comments={evaluationTwo.comments}
            onChange={(value) => {
              setEvaluationTwo((prev) => ({ ...prev, comments: value }));
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
export default UnitOneEvaluationTwo;
