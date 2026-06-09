import { useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useUnitsStore } from "../../../stores/useUnitsStore";
import { EvaluationButton } from "./EvaluationButton";
import { Link, useNavigate, useParams } from "react-router";
import { EvaluationLegend } from "../EvaluationLegend";
import { Tooltip } from "../ui/Tooltip";
import getScoreFromEvaluations from "../../utils/getScoreFromEvaluations";
import { Student } from "../../../../mockData/types";

interface ClassTableProps {
  students: Student[];
  classId: string;
}

export function ClassTable({ students, classId }: ClassTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { teacherId, schoolId } = useParams();
  const getUnitsData = useUnitsStore((state) => state.unitsData);

  const getAnswersByEvaluation = useUnitsStore(
    (state) => state.getAnswersByEvaluation,
  );
  const evaluationsData = useMemo(() => getUnitsData, [getUnitsData]);
  const numberOfUnitOneEvaluations = useMemo(() => {
    return evaluationsData.filter((evalData) => evalData.unit === 1).length;
  }, [evaluationsData]);

  // Memoize navigation handler to prevent recreating on every render
  const handleEvaluationClick = useCallback(
    (studentId: string, evaluationId: string) => {
      const basePath = schoolId
        ? `/school/${schoolId}/teacher/${teacherId}/class/${classId}`
        : `/teacher/${teacherId}/class/${classId}`;
      navigate(`${basePath}/student/${studentId}/evaluation/${evaluationId}`);
    },
    [schoolId, teacherId, classId, navigate],
  );

  return (
    <div className="p-8 flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div
          className="rounded-2xl overflow-hidden shadow-lg"
          style={{ background: "#ffffff" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: "#dff3ff" }}>
                  <th
                    className="px-6 py-3 text-left sticky left-0"
                    style={{ background: "#dff3ff" }}
                  ></th>
                  <th
                    colSpan={numberOfUnitOneEvaluations}
                    className="px-2 py-3 text-center text-xs border-r"
                    style={{
                      background: "var(--unit-1-bg)",
                      color: "var(--unit-1-fg)",
                      borderColor: "#ffffff",
                    }}
                  >
                    {t("units.unit", { number: 1 })}
                  </th>
                  <th
                    colSpan={1}
                    className="px-2 py-3 text-center text-xs border-r"
                    style={{
                      background: "var(--unit-2-bg)",
                      color: "var(--unit-2-fg)",
                      borderColor: "#ffffff",
                    }}
                  >
                    {t("units.unit", { number: 2 })}
                  </th>
                  <th
                    colSpan={1}
                    className="px-2 py-3 text-center text-xs border-r"
                    style={{
                      background: "var(--unit-3-bg)",
                      color: "var(--unit-3-fg)",
                      borderColor: "#ffffff",
                    }}
                  >
                    {t("units.unit", { number: 3 })}
                  </th>
                  <th
                    colSpan={1}
                    className="px-2 py-3 text-center text-xs border-r"
                    style={{
                      background: "var(--unit-4-bg)",
                      color: "var(--unit-4-fg)",
                      borderColor: "#ffffff",
                    }}
                  >
                    {t("units.unit", { number: 4 })}
                  </th>
                  <th
                    colSpan={1}
                    className="px-2 py-3 text-center text-xs border-r"
                    style={{
                      background: "var(--unit-5-bg)",
                      color: "var(--unit-5-fg)",
                      borderColor: "#ffffff",
                    }}
                  >
                    {t("units.unit", { number: 5 })}
                  </th>
                  <th
                    colSpan={1}
                    className="px-2 py-3 text-center text-xs border-r"
                    style={{
                      background: "var(--unit-6-bg)",
                      color: "var(--unit-6-fg)",
                      borderColor: "#ffffff",
                    }}
                  >
                    {t("units.unit", { number: 6 })}
                  </th>
                  <th
                    colSpan={1}
                    className="px-2 py-3 text-center text-xs border-r"
                    style={{
                      background: "var(--unit-7-bg)",
                      color: "var(--unit-7-fg)",
                      borderColor: "#ffffff",
                    }}
                  >
                    {t("units.unit", { number: 7 })}
                  </th>
                  <th
                    colSpan={1}
                    className="px-2 py-3 text-center text-xs border-r"
                    style={{
                      background: "var(--unit-8-bg)",
                      color: "var(--unit-8-fg)",
                      borderColor: "#ffffff",
                    }}
                  >
                    {t("units.unit", { number: 8 })}
                  </th>
                  <th
                    colSpan={1}
                    className="px-2 py-3 text-center text-xs border-r"
                    style={{
                      background: "var(--unit-9-bg)",
                      color: "var(--unit-9-fg)",
                      borderColor: "#ffffff",
                    }}
                  >
                    {t("units.unit", { number: 9 })}
                  </th>
                  <th
                    colSpan={1}
                    className="px-2 py-3 text-center text-xs"
                    style={{
                      background: "var(--unit-10-bg)",
                      color: "var(--unit-10-fg)",
                    }}
                  >
                    {t("units.unit", { number: 10 })}
                  </th>
                </tr>
                {/* Atelier Number Headers */}
                <tr style={{ background: "#dff3ff" }}>
                  <th
                    className="px-6 py-4 text-left sticky left-0"
                    style={{ background: "#dff3ff", color: "#004aad" }}
                  >
                    {t("studentTracking.student")}
                  </th>
                  {evaluationsData.map((template, idx) => (
                    <th
                      key={template.id}
                      className="px-4 py-4 text-center group"
                      style={{
                        color: "#004aad",
                        minWidth: "60px",
                        borderRight: [4, 5, 6, 7, 8, 9, 10, 11, 12].includes(
                          Number(template.id),
                        )
                          ? "1px solid #ffffff"
                          : "none",
                      }}
                    >
                      <Tooltip
                        label={t(`${template.title}`)}
                        position={idx < 11 ? "bottom" : "bottom-right"}
                      >
                        {template.id}
                      </Tooltip>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => {
                  return (
                    <tr
                      key={student.id}
                      className="border-2 transition-all hover:outline-2 hover:outline-[#38b6ff] hover:relative hover:z-10"
                      style={{ borderColor: "#dff3ff" }}
                    >
                      <td
                        className="px-6 py-4 sticky left-0"
                        style={{
                          background: idx % 2 === 0 ? "#ffffff" : "#dff3ff",
                          color: "#000000",
                        }}
                      >
                        <Link
                          className="hover:underline text-blue-500"
                          to={
                            schoolId
                              ? `/school/${schoolId}/teacher/${teacherId}/class/${classId}/student/${student.id}`
                              : `/teacher/${teacherId}/class/${classId}/student/${student.id}`
                          }
                        >
                          {student.name}
                        </Link>
                      </td>
                      {evaluationsData.map((evaluation) => {
                        const singleAnswer = getAnswersByEvaluation(
                          evaluation.id,
                        ).find(
                          (answer) =>
                            answer.student_id === student.id &&
                            answer.class_id === classId,
                        );
                        return (
                          <td
                            key={evaluation.id}
                            className="px-4 py-4 text-center"
                            style={{
                              background: idx % 2 === 0 ? "#ffffff" : "#dff3ff",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <EvaluationButton
                                required={singleAnswer?.required ?? undefined}
                                status={singleAnswer?.status ?? null}
                                onClick={() =>
                                  handleEvaluationClick(
                                    student.id,
                                    evaluation.id,
                                  )
                                }
                                empty={
                                  !singleAnswer || singleAnswer.status === null
                                }
                              />
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <EvaluationLegend />
      </div>
    </div>
  );
}
