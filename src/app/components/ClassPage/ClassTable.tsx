import { useTranslation } from "react-i18next";
import { Student } from "../../../stores/useStudentStore";

interface Evaluation {
  studentId: number;
  classId: number;
  evaluations: ("success" | "adequate" | "needs-improvement" | null)[];
}

interface ClassTableProps {
  students: Student[];
  evaluations: Evaluation[];
  onStudentClick: (
    studentId: number,
    studentName: string,
    evals: ("success" | "adequate" | "needs-improvement" | null)[],
  ) => void;
}

export function ClassTable({
  students,
  evaluations,
  onStudentClick,
}: ClassTableProps) {
  const { t } = useTranslation();

  // Create a map of studentId -> evaluation for quick lookup
  const evaluationMap = new Map(
    evaluations.map((evaluation) => [evaluation.studentId, evaluation]),
  );

  const getStatusColor = (
    status: "success" | "adequate" | "needs-improvement" | null,
  ) => {
    if (status === "success") return "#c9e265";
    if (status === "adequate") return "#ffde59";
    if (status === "needs-improvement") return "#ff5757";
    return "#f8ffdb";
  };

  const getStatusText = (
    status: "success" | "adequate" | "needs-improvement" | null,
  ) => {
    if (status === "success") return "✓";
    if (status === "adequate") return "~";
    if (status === "needs-improvement") return "!";
    return "";
  };

  return (
    <div className="p-6 flex-1 overflow-y-auto">
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
                    className="px-6 py-4 text-left sticky left-0"
                    style={{ background: "#dff3ff", color: "#004aad" }}
                  >
                    {t("studentTracking.studentName")}
                  </th>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <th
                      key={num}
                      className="px-4 py-4 text-center"
                      style={{ color: "#004aad", minWidth: "80px" }}
                    >
                      {t("studentTracking.evaluation")} {num}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => {
                  const studentEvaluation = evaluationMap.get(student.id);
                  const studentEvaluations =
                    studentEvaluation?.evaluations || Array(10).fill(null);

                  return (
                    <tr
                      onClick={() =>
                        onStudentClick(
                          student.id,
                          student.name,
                          studentEvaluations,
                        )
                      }
                      key={student.id}
                      className={`cursor-pointer border-2 transition-all hover:outline-2 hover:outline-[#38b6ff] hover:relative hover:z-10`}
                      style={{ borderColor: "#dff3ff" }}
                    >
                      <td
                        className="px-6 py-4 sticky left-0"
                        style={{
                          background: idx % 2 === 0 ? "#ffffff" : "#dff3ff",
                          color: "#000000",
                        }}
                      >
                        {student.name}
                      </td>
                      {studentEvaluations.map((status, evalIdx) => (
                        <td
                          key={evalIdx}
                          className="px-4 py-4 text-center"
                          style={{
                            background: idx % 2 === 0 ? "#ffffff" : "#dff3ff",
                          }}
                        >
                          {status ? (
                            <button
                              onClick={() =>
                                onStudentClick(
                                  student.id,
                                  student.name,
                                  studentEvaluations,
                                )
                              }
                              className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto transition-all cursor-pointer"
                              style={{
                                background: getStatusColor(status),
                                color:
                                  status === "success" ? "#000000" : "#ffffff",
                              }}
                            >
                              {getStatusText(status)}
                            </button>
                          ) : (
                            <button
                              className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto transition-all hover:bg-gray-200 cursor-pointer"
                              style={{
                                background: "#f8ffdb",
                                border: "1px dashed #cccccc",
                              }}
                            ></button>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
