import { useMemo, useState, useEffect } from "react";
import UnitContainer from "../components/UnitContainer";
import UnitHeader from "../components/UnitHeader";
import { ConfirmationModal } from "../../ui/ConfirmationModal";
import { useUnitsStore } from "../../../../stores";
import { useTranslation } from "react-i18next";
import CommentsContainer from "../components/CommentsContainer";
import { EvaluationCheckbox } from "../../ui/EvaluationCheckbox";
import EvaluationHeader from "../components/EvaluationHeader";
import { useParams } from "react-router";
import { StudentAnswers, MockQuestions } from "../../../../../mockData/types";

type EvaluationArray = Array<boolean | null>;
type EvaluationThreeState = {
  rhyming: EvaluationArray;
  segmenting: EvaluationArray;
  syllableCounting: EvaluationArray;
  comments: string;
};

export function UnitOneEvaluationFive() {
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
  const evaluationFiveData = unitsData[4];

  const buildEvaluationArray = (value: boolean | null): EvaluationArray =>
    new Array(5).fill(value);

  const [evaluationFive, setEvaluationFive] = useState<EvaluationThreeState>({
    rhyming: buildEvaluationArray(null),
    segmenting: buildEvaluationArray(null),
    syllableCounting: buildEvaluationArray(null),
    comments: "",
  });

  useEffect(() => {
    if (!singleAnswer || !singleAnswer.answers) return;

    const ans: MockQuestions = singleAnswer.answers;
    // Support both saved format (rhyming/segmenting/syllableCounting) and template format (wordPairs/syllables/numOfSyllables)
    const rhymingData = (ans.rhyming || ans.wordPairs) as any;
    const segmentingData = (ans.segmenting || ans.syllables) as any;
    const syllableCountingData = (ans.syllableCounting ||
      ans.numOfSyllables) as any;

    const mapToArray = (obj: any, length: number) => {
      if (!obj) return new Array(length).fill(null);

      // If object has named keys (template format), convert to array by taking first N values
      const keys = Object.keys(obj);
      if (keys.length > 0 && !keys.every((k) => /^\d+$/.test(k))) {
        // Named keys format - take first length items
        return keys.slice(0, length).map((key) => {
          const val = obj[key];
          if (val === true) return true;
          if (val === false) return false;
          if (typeof val === "object" && val !== null && "correct" in val) {
            if (val.correct === true) return true;
            if (val.correct === false) return false;
          }
          return null;
        });
      }

      // Numeric keys format (saved answers)
      return Array.from({ length }, (_, i) => {
        const val = obj[i] ?? obj[i.toString()];
        if (val === true) return true;
        if (val === false) return false;
        if (typeof val === "object" && val !== null && "correct" in val) {
          if (val.correct === true) return true;
          if (val.correct === false) return false;
        }
        return null;
      });
    };

    setEvaluationFive({
      rhyming: mapToArray(rhymingData, 5),
      segmenting: mapToArray(segmentingData, 5),
      syllableCounting: mapToArray(syllableCountingData, 5),
      comments: singleAnswer.comment,
    });
    setNotRequired(!singleAnswer.required);
    setHasChanges(false);
  }, [singleAnswer]);

  const handleCheckAll = () => {
    setConfirmMessage(t("evaluation.confirmCheckAll"));
    setPendingAction(() => () => {
      setEvaluationFive((prev) => ({
        ...prev,
        rhyming: buildEvaluationArray(true),
        segmenting: buildEvaluationArray(true),
        syllableCounting: buildEvaluationArray(true),
      }));
      setHasChanges(true);
    });
    setShowConfirmModal(true);
  };

  const handleFailAll = () => {
    setConfirmMessage(t("evaluation.confirmFailAll"));
    setPendingAction(() => () => {
      setEvaluationFive((prev) => ({
        ...prev,
        rhyming: buildEvaluationArray(false),
        segmenting: buildEvaluationArray(false),
        syllableCounting: buildEvaluationArray(false),
      }));
      setHasChanges(true);
    });
    setShowConfirmModal(true);
  };

  const handleClearAll = () => {
    setConfirmMessage(t("evaluation.confirmClearAll"));
    setPendingAction(() => () => {
      setEvaluationFive((prev) => ({
        ...prev,
        rhyming: buildEvaluationArray(null),
        segmenting: buildEvaluationArray(null),
        syllableCounting: buildEvaluationArray(null),
        comments: "",
      }));
      setHasChanges(true);
    });
    setShowConfirmModal(true);
  };

  const handleNotRequired = () => {
    setEvaluationFive((prev) => ({
      ...prev,
      rhyming: buildEvaluationArray(null),
      segmenting: buildEvaluationArray(null),
      syllableCounting: buildEvaluationArray(null),
      comments: "",
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    const answers: any = {
      rhyming: evaluationFive.rhyming.reduce(
        (acc, val, idx) => {
          acc[idx] = val;
          return acc;
        },
        {} as Record<string, boolean | null>,
      ),
      segmenting: evaluationFive.segmenting.reduce(
        (acc, val, idx) => {
          acc[idx] = val;
          return acc;
        },
        {} as Record<string, boolean | null>,
      ),
      syllableCounting: evaluationFive.syllableCounting.reduce(
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
      evaluationFive.comments,
      !notRequired,
    );
    setHasChanges(false);
  };

  return (
    <>
      <UnitHeader
        title={evaluationFiveData.title}
        evaluationNumber={evaluationFiveData.evaluation}
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
            unitNumber={evaluationFiveData.unit}
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
              <strong>{t("unitThree.instructions.title")}</strong>{" "}
              {t("unitThree.instructions.body")}
            </p>
          </div>
          <div id="atelier3-content" className="space-y-6">
            {/* Rhyming table */}
            <div className="p-5 rounded-xl" style={{ background: "#dff3ff" }}>
              <h3
                className="text-base mb-4 font-bold"
                style={{ color: "#004aad" }}
              >
                {t("unitThree.rhyming.title")}
              </h3>
              <p className="text-sm mb-3" style={{ color: "#666" }}>
                {t("unitThree.rhyming.prompt")}
              </p>
              <table className="w-full" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#ffffff" }}>
                    <th
                      className="px-3 py-2 text-left text-sm"
                      style={{ color: "#004aad", border: "1px solid #dff3ff" }}
                    >
                      {t("unitThree.rhyming.labels.wordPair")}
                    </th>
                    <th
                      className="px-3 py-2 text-center text-sm"
                      style={{ color: "#004aad", border: "1px solid #dff3ff" }}
                    >
                      {t("unitThree.rhyming.labels.correctAnswer")}
                    </th>
                    <th
                      className="px-3 py-2 text-center text-sm"
                      style={{ color: "#004aad", border: "1px solid #dff3ff" }}
                    >
                      {t("unitThree.rhyming.labels.success")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { pair: "chat / rat", answer: "Oui" },
                    { pair: "fleur / table", answer: "Non" },
                    { pair: "bateau / chapeau", answer: "Oui" },
                    { pair: "pain / main", answer: "Oui" },
                    { pair: "lune / porte", answer: "Non" },
                  ].map((item, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #dff3ff" }}>
                      <td
                        className="px-3 py-2 font-medium"
                        style={{
                          color: "#004aad",
                          border: "1px solid #dff3ff",
                        }}
                      >
                        {item.pair}
                      </td>
                      <td
                        className="px-3 py-2 text-center text-sm"
                        style={{ color: "#666", border: "1px solid #dff3ff" }}
                      >
                        {item.answer}
                      </td>
                      <td
                        className="px-3 py-2 text-center"
                        style={{ border: "1px solid #dff3ff" }}
                      >
                        <EvaluationCheckbox
                          value={evaluationFive.rhyming[i]}
                          onCheck={() => {
                            const newArr = [...evaluationFive.rhyming];
                            newArr[i] = true;
                            setEvaluationFive((prev) => ({
                              ...prev,
                              rhyming: newArr,
                            }));
                            setHasChanges(true);
                          }}
                          onFail={() => {
                            const newArr = [...evaluationFive.rhyming];
                            newArr[i] = false;
                            setEvaluationFive((prev) => ({
                              ...prev,
                              rhyming: newArr,
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

            {/* Segmenting table */}
            <div className="p-5 rounded-xl" style={{ background: "#dff3ff" }}>
              <h3
                className="text-base mb-4 font-bold"
                style={{ color: "#004aad" }}
              >
                {t("unitThree.segmenting.title")}
              </h3>
              <p className="text-sm mb-3" style={{ color: "#666" }}>
                {t("unitThree.segmenting.prompt")}
              </p>
              <table className="w-full" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#ffffff" }}>
                    <th
                      className="px-3 py-2 text-left text-sm"
                      style={{ color: "#004aad", border: "1px solid #dff3ff" }}
                    >
                      {t("unitThree.segmenting.labels.segmentedWord")}
                    </th>
                    <th
                      className="px-3 py-2 text-center text-sm"
                      style={{ color: "#004aad", border: "1px solid #dff3ff" }}
                    >
                      {t("unitThree.segmenting.labels.fullWord")}
                    </th>
                    <th
                      className="px-3 py-2 text-center text-sm"
                      style={{ color: "#004aad", border: "1px solid #dff3ff" }}
                    >
                      {t("unitThree.segmenting.labels.success")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { segmented: "ma-man", full: "maman" },
                    { segmented: "ta-ble", full: "table" },
                    { segmented: "cha-peau", full: "chapeau" },
                    { segmented: "voi-ture", full: "voiture" },
                    { segmented: "ba-na-ne", full: "banane" },
                  ].map((item, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #dff3ff" }}>
                      <td
                        className="px-3 py-2 font-medium"
                        style={{
                          color: "#004aad",
                          border: "1px solid #dff3ff",
                        }}
                      >
                        {item.segmented}
                      </td>
                      <td
                        className="px-3 py-2 text-center"
                        style={{ color: "#666", border: "1px solid #dff3ff" }}
                      >
                        {item.full}
                      </td>
                      <td
                        className="px-3 py-2 text-center"
                        style={{ border: "1px solid #dff3ff" }}
                      >
                        <EvaluationCheckbox
                          value={evaluationFive.segmenting[i]}
                          onCheck={() => {
                            const newArr = [...evaluationFive.segmenting];
                            newArr[i] = true;
                            setEvaluationFive((prev) => ({
                              ...prev,
                              segmenting: newArr,
                            }));
                            setHasChanges(true);
                          }}
                          onFail={() => {
                            const newArr = [...evaluationFive.segmenting];
                            newArr[i] = false;
                            setEvaluationFive((prev) => ({
                              ...prev,
                              segmenting: newArr,
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

            {/* Syllable counting */}
            <div className="p-5 rounded-xl" style={{ background: "#dff3ff" }}>
              <h3
                className="text-base mb-4 font-bold"
                style={{ color: "#004aad" }}
              >
                {t("unitThree.syllableCounting.title")}
              </h3>
              <p className="text-sm mb-3" style={{ color: "#666" }}>
                {t("unitThree.syllableCounting.prompt")}
              </p>
              <table className="w-full" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#ffffff" }}>
                    <th
                      className="px-3 py-2 text-left text-sm"
                      style={{ color: "#004aad", border: "1px solid #dff3ff" }}
                    >
                      {t("unitThree.syllableCounting.labels.word")}
                    </th>
                    <th
                      className="px-3 py-2 text-center text-sm"
                      style={{ color: "#004aad", border: "1px solid #dff3ff" }}
                    >
                      {t("unitThree.syllableCounting.labels.syllableCount")}
                    </th>
                    <th
                      className="px-3 py-2 text-center text-sm"
                      style={{ color: "#004aad", border: "1px solid #dff3ff" }}
                    >
                      {t("unitThree.syllableCounting.labels.success")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { word: "chat", count: 1 },
                    { word: "livre", count: 1 },
                    { word: "éléphant", count: 3 },
                    { word: "chocolat", count: 3 },
                    { word: "papillon", count: 3 },
                  ].map((item, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #dff3ff" }}>
                      <td
                        className="px-3 py-2 font-medium"
                        style={{
                          color: "#004aad",
                          border: "1px solid #dff3ff",
                        }}
                      >
                        {item.word}
                      </td>
                      <td
                        className="px-3 py-2 text-center"
                        style={{ color: "#666", border: "1px solid #dff3ff" }}
                      >
                        {item.count}
                      </td>
                      <td
                        className="px-3 py-2 text-center"
                        style={{ border: "1px solid #dff3ff" }}
                      >
                        <EvaluationCheckbox
                          value={evaluationFive.syllableCounting[i]}
                          onCheck={() => {
                            const newArr = [...evaluationFive.syllableCounting];
                            newArr[i] = true;
                            setEvaluationFive((prev) => ({
                              ...prev,
                              syllableCounting: newArr,
                            }));
                            setHasChanges(true);
                          }}
                          onFail={() => {
                            const newArr = [...evaluationFive.syllableCounting];
                            newArr[i] = false;
                            setEvaluationFive((prev) => ({
                              ...prev,
                              syllableCounting: newArr,
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
            <CommentsContainer
              comments={evaluationFive.comments}
              onChange={(value) => {
                setEvaluationFive((prev) => ({ ...prev, comments: value }));
                setHasChanges(true);
              }}
            />
          </div>
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

export default UnitOneEvaluationFive;
