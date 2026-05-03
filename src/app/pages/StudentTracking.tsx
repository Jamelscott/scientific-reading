import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, FileText, Download, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  useClassStore,
  useEvaluationsStore,
  useStudentStore,
} from "../../stores";
import { AddStudentModal } from "../components/AddStudentModal";
import { EditEvaluationModal } from "../components/EditEvaluationModal";
import { EvaluationLegend } from "../components/EvaluationLegend";
import { Button } from "../components/ui/Button";

export function StudentTracking() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();
  const classes = useClassStore((state) => state.classes);
  const setActiveClass = useClassStore((state) => state.setActiveClass);

  // Parse classId from URL and set it as active
  const activeClassId = classId ? parseInt(classId, 10) : 1;

  // Update store when URL param changes
  useEffect(() => {
    if (activeClassId) {
      setActiveClass(activeClassId);
    }
  }, [activeClassId, setActiveClass]);

  const activeClass = classes.find((c) => c.id === activeClassId);

  const allStudents = useStudentStore((state) => state.students);
  const students = allStudents.filter((student) =>
    student.classIds.includes(activeClassId),
  );
  const allEvaluations = useEvaluationsStore((state) => state.evaluations);
  const evaluations = allEvaluations.filter((e) => e.classId === activeClassId);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showEditEvaluationModal, setShowEditEvaluationModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [selectedEvaluations, setSelectedEvaluations] = useState<
    ("success" | "adequate" | "needs-improvement" | null)[]
  >([]);

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

  const handleOpenEditModal = (
    studentId: number,
    studentName: string,
    evals: ("success" | "adequate" | "needs-improvement" | null)[],
  ) => {
    setSelectedStudent({ id: studentId, name: studentName });
    setSelectedEvaluations(evals);
    setShowEditEvaluationModal(true);
  };

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: "#dff3ff" }}
    >
      {/* Header */}
      <div
        className="p-6 border-b flex-shrink-0 shadow-sm z-11"
        style={{ background: "#ffffff", borderColor: "#dff3ff" }}
      >
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 mb-4 text-sm text-[#38b6ff] hover:text-[#2D92CC] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("studentTracking.backToDashboard")}
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl mb-2" style={{ color: "#004aad" }}>
                {activeClass?.name || "1re année Mme Gisèle"}
              </h1>
              <p className="text-lg" style={{ color: "#000000" }}>
                {t("studentTracking.studentsCount", {
                  count: activeClass?.studentCount || students.length,
                })}
              </p>
              <EvaluationLegend />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowAddStudentModal(true)}
                label="studentTracking.addStudent"
                leadingIcon={<Plus className="w-5 h-5" />}
                className="bg-[#38b6ff] text-white"
              />
              <Button
                onClick={() => {
                  /* TODO: wire enter results action */
                }}
                label="studentTracking.enterResults"
                leadingIcon={<FileText className="w-5 h-5" />}
                variant="primary"
              />
              <Button
                onClick={() => {
                  /* TODO: wire export PDF action */
                }}
                label="studentTracking.exportPdf"
                leadingIcon={<Download className="w-5 h-5" />}
                variant="secondary"
                className="text-[#004aad] border-[#dff3ff]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
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
                          handleOpenEditModal(
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
                                  handleOpenEditModal(
                                    student.id,
                                    student.name,
                                    studentEvaluations,
                                  )
                                }
                                className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto transition-all cursor-pointer"
                                style={{
                                  background: getStatusColor(status),
                                  color:
                                    status === "success"
                                      ? "#000000"
                                      : "#ffffff",
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

      <AddStudentModal
        isOpen={showAddStudentModal}
        onClose={() => setShowAddStudentModal(false)}
        classId={activeClassId}
      />

      {selectedStudent && (
        <EditEvaluationModal
          isOpen={showEditEvaluationModal}
          onClose={() => setShowEditEvaluationModal(false)}
          studentId={selectedStudent.id}
          studentName={selectedStudent.name}
          classId={activeClassId}
          currentEvaluations={selectedEvaluations}
        />
      )}
    </div>
  );
}
