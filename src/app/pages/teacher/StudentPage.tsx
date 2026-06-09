import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  BarChart as BarChartIcon,
  Calendar,
  ChevronDown,
  Download,
  FileText,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import {
  useAuthStore,
  useClassStore,
  useStudentStore,
  useUnitsStore,
} from "../../../stores";
import { gradeBenchmarks } from "../const";
import { formatDate } from "../../components/utils/formatDate";
import {
  Bar,
  CartesianGrid,
  Radar,
  RadarChart,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  PolarRadiusAxis,
  YAxis,
  PolarAngleAxis,
  PolarGrid,
} from "recharts";
import { useTranslation } from "react-i18next";
import { exportStudentPageToPdf } from "../../components/utils/exportStudentPageToPdf";
import { Button } from "../../components/ui/Button";

const getStatusColor = (
  status: "success" | "adequate" | "needs-improvement" | "not-required" | null,
) => {
  if (status === "success") return "#c9e265";
  if (status === "adequate") return "#ffde59";
  if (status === "needs-improvement") return "#ff5757";
  if (status === "not-required") return "#b8a3d6";
  return "#d1d5db";
};

const getStatusText = (
  status: "success" | "adequate" | "needs-improvement" | "not-required" | null,
  t: any,
) => {
  if (status === "success") return t("studentPage.status.success");
  if (status === "adequate") return t("studentPage.status.adequate");
  if (status === "needs-improvement")
    return t("studentPage.status.needsImprovement");
  if (status === "not-required") return t("studentPage.status.notRequired");
  return t("studentPage.status.notEvaluated");
};

export function StudentPage() {
  const navigate = useNavigate();
  const { studentId, teacherId, classId, schoolId } = useParams();
  const { t } = useTranslation();
  const unitData = useUnitsStore((state) => state.unitsData);
  const student = useStudentStore((state) => state.getStudentById(studentId!));
  const allStudents = useStudentStore((state) => state.students);
  const classes = useClassStore((state) => state.classes);
  const currentClass = classes.find((c) => c.id === classId!);
  const classStudents = allStudents.filter((s) =>
    s.class_id.includes(classId!),
  );
  const teacher = useAuthStore((state) => state.getCurrentUser());
  const allAnswers = useUnitsStore((state) => state.answers);
  const studentAnswers = useMemo(() => {
    return allAnswers.filter((answer) => answer.student_id === studentId);
  }, [allAnswers, studentId]);

  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowStudentDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStudentChange = useCallback(
    (newStudentId: string) => {
      setShowStudentDropdown(false);
      navigate(
        `/teacher/${teacherId}/class/${classId}/student/${newStudentId}`,
      );
    },
    [teacherId, classId, navigate],
  );

  if (!student) {
    return <div>{t("studentPage.studentNotFound")}</div>;
  }
  const completedCount = studentAnswers?.length;

  const studentGrade = currentClass?.grade || "1re année";
  const currentBenchmark =
    gradeBenchmarks[studentGrade as keyof typeof gradeBenchmarks];
  console.log(gradeBenchmarks);
  const benchmarkProgress = Math.min(
    100,
    (completedCount / currentBenchmark.expected) * 100,
  );
  const isOnTrack = completedCount >= currentBenchmark.expected;
  const isAhead = completedCount > currentBenchmark.expected;

  const successCount = studentAnswers.filter(
    (e) => e.status === "success",
  ).length;
  const successRate =
    completedCount > 0 ? Math.round((successCount / completedCount) * 100) : 0;

  // Calculate competency scores from student evaluations
  const calculateCompetencyScore = (atelierRange: string[]) => {
    const relevantAnswers = studentAnswers.filter((answer) =>
      atelierRange.includes(answer.unit_data_id),
    );

    if (relevantAnswers.length === 0) return 0;

    let totalScore = 0;
    let countedAnswers = 0;

    relevantAnswers.forEach((answer) => {
      if (answer.status === "success") {
        totalScore += 100;
        countedAnswers++;
      } else if (answer.status === "adequate") {
        totalScore += 70;
        countedAnswers++;
      } else if (answer.status === "needs-improvement") {
        totalScore += 40;
        countedAnswers++;
      }
      // not evaluated/not required = not counted at all
    });

    if (countedAnswers === 0) return 0;

    return Math.round(totalScore / countedAnswers);
  };

  const radarData = [
    {
      subject: t("studentPage.reading"),
      score: calculateCompetencyScore(["1", "2", "3", "4", "5", "6"]),
    },
    {
      subject: t("studentPage.writing"),
      score: calculateCompetencyScore(["7", "8", "9"]),
    },
    {
      subject: t("studentPage.decoding"),
      score: calculateCompetencyScore(["10", "11"]),
    },
    {
      subject: t("studentPage.fluency"),
      score: calculateCompetencyScore(["12", "13"]),
    },
    {
      subject: t("studentPage.comprehension"),
      score: calculateCompetencyScore(["14", "15"]),
    },
  ];

  const CustomTick = ({ payload, x, y, textAnchor }: any) => {
    if (payload.value === t("studentPage.reading")) {
      return (
        <g>
          <text
            x={x}
            y={y}
            textAnchor={textAnchor}
            fill="#000000"
            fontSize={12}
            fontWeight="bold"
          >
            <tspan x={x} dy="-1em" style={{ paddingBottom: "10px" }}>
              {t("studentPage.alphabeticKnowledge")}
            </tspan>
          </text>
        </g>
      );
    }
    return (
      <g>
        <text
          x={x}
          y={y}
          textAnchor={textAnchor}
          fill="#000000"
          fontSize={12}
          fontWeight="bold"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: "#dff3ff" }}
    >
      {/* Header */}
      <div
        id="student-page-header"
        className="p-6 border-b flex-shrink-0"
        style={{
          background: "#ffffff",
          borderColor: "#dff3ff",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() =>
              schoolId
                ? navigate(`/school/${schoolId}/academics`)
                : navigate(`/teacher/${teacherId}/class/${classId}`)
            }
            className="flex items-center gap-2 mb-4 text-sm hover:font-bold transition-all cursor-pointer"
            style={{ color: "#38b6ff" }}
          >
            <ArrowLeft className="w-4 h-4" />
            {schoolId
              ? t("studentPage.backToAcademics")
              : t("studentPage.backToClassList")}
          </button>

          <div className="flex items-center justify-between">
            <div>
              <div
                className="inline-block px-4 py-2 rounded-lg mb-3"
                style={{ background: "#004aad", color: "#ffffff" }}
              >
                <p className="text-sm">{t("studentPage.smlTitle")}</p>
              </div>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowStudentDropdown(!showStudentDropdown)}
                  className="flex items-center gap-2 text-3xl mb-2 hover:opacity-80 hover:font-bold transition-all cursor-pointer"
                  style={{ color: "#004aad" }}
                >
                  {student.name}
                  <ChevronDown
                    className="w-6 h-6 transition-transform duration-200"
                    style={{
                      transform: showStudentDropdown
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  />
                </button>

                {showStudentDropdown && (
                  <div
                    className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border overflow-y-auto overflow-x-hidden z-50 min-w-[300px]"
                    style={{ borderColor: "#dff3ff", maxHeight: "280px" }}
                  >
                    {classStudents.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => handleStudentChange(s.id)}
                        className="w-full px-4 py-3 text-left transition-all flex items-center justify-between group hover:bg-[#38b6ff] hover:scale-[1.02] hover:shadow-md cursor-pointer"
                        style={{
                          backgroundColor:
                            s.id === studentId ? "#dff3ff" : "transparent",
                        }}
                      >
                        <span
                          className="group-hover:text-white transition-colors"
                          style={{ color: "#004aad" }}
                        >
                          {s.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-lg" style={{ color: "#000000" }}>
                {studentGrade} - {teacher?.name}
              </p>
            </div>

            <Button
              variant="primary"
              onClick={() =>
                exportStudentPageToPdf(student.name, teacher?.name || "")
              }
              label={t("studentPage.exportReport")}
              leadingIcon={<Download className="w-5 h-5" />}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        id="student-page-main-content"
        className="flex-1 p-6 overflow-y-auto"
      >
        <div className="max-w-7xl mx-auto">
          {/* Grade-Level Benchmark */}
          <div
            className="rounded-2xl p-6 shadow-lg mb-8"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl mb-2" style={{ color: "#004aad" }}>
                  {t("studentPage.benchmarkTitle")}
                </h2>
                <p className="text-sm" style={{ color: "#000000" }}>
                  {t("studentPage.expectedWorkshops", {
                    label: currentBenchmark.label,
                    count: currentBenchmark.expected,
                  })}
                </p>
              </div>
              <div
                className="px-6 py-3 rounded-xl"
                style={{
                  background: isOnTrack
                    ? "#c9e265"
                    : isAhead
                      ? "#38b6ff"
                      : "#ffde59",
                  color: isOnTrack || isAhead ? "#000000" : "#000000",
                }}
              >
                <span className="text-lg">
                  {isAhead
                    ? t("studentPage.ahead")
                    : isOnTrack
                      ? t("studentPage.onTrack")
                      : t("studentPage.needsSupport")}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div
                className="w-full h-8 rounded-xl overflow-hidden"
                style={{ background: "#dff3ff" }}
              >
                <div
                  className="h-full transition-all duration-500 flex items-center justify-end pr-3"
                  style={{
                    width: `${benchmarkProgress}%`,
                    background: isOnTrack
                      ? "#c9e265"
                      : isAhead
                        ? "#38b6ff"
                        : "#ffde59",
                  }}
                >
                  <span style={{ color: "#000000" }}>
                    {completedCount}/{currentBenchmark.expected}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div
              className="rounded-2xl p-6 shadow-lg"
              style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: "#dff3ff" }}
                >
                  <FileText className="w-6 h-6" style={{ color: "#004aad" }} />
                </div>
              </div>
              <p className="text-sm mb-2" style={{ color: "#000000" }}>
                {t("studentPage.workshopsCompleted")}
              </p>
              <p className="text-3xl" style={{ color: "#004aad" }}>
                {completedCount}/{unitData.length}
              </p>
            </div>

            <div
              className="rounded-2xl p-6 shadow-lg"
              style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: "#c9e265" }}
                >
                  <TrendingUp
                    className="w-6 h-6"
                    style={{ color: "#000000" }}
                  />
                </div>
              </div>
              <p className="text-sm mb-2" style={{ color: "#000000" }}>
                {t("studentPage.successRate")}
              </p>
              <p className="text-3xl" style={{ color: "#004aad" }}>
                {successRate}%
              </p>
            </div>

            <div
              className="rounded-2xl p-6 shadow-lg"
              style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: "#dff3ff" }}
                >
                  <Calendar className="w-6 h-6" style={{ color: "#004aad" }} />
                </div>
              </div>
              <p className="text-sm mb-2" style={{ color: "#000000" }}>
                {t("studentPage.lastWorkshop")}
              </p>
              <p className="text-lg" style={{ color: "#004aad" }}>
                {formatDate(
                  studentAnswers[studentAnswers.length - 1]?.updated_at,
                )}
              </p>
            </div>
          </div>

          {/* Charts Grid - Full Width */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Performance Radar */}
            <div
              className="rounded-2xl p-6 shadow-lg"
              style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
            >
              <h2 className="text-xl mb-6" style={{ color: "#004aad" }}>
                {t("studentPage.skillsProfile")}
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#dff3ff" />
                  <PolarAngleAxis dataKey="subject" tick={<CustomTick />} />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{
                      fill: "#000000",
                      fontSize: 11,
                    }}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#38b6ff"
                    fill="#38b6ff"
                    fillOpacity={0.5}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Status Distribution */}
            <div
              className="rounded-2xl p-6 shadow-lg"
              style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
            >
              <h2 className="text-xl mb-6" style={{ color: "#004aad" }}>
                {t("studentPage.resultsDistribution")}
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    {
                      name: t("studentPage.results"),
                      success: successCount,
                      adequate: studentAnswers.filter(
                        (e) => e.status === "adequate",
                      ).length,
                      atRisk: studentAnswers.filter(
                        (e) => e.status === "needs-improvement",
                      ).length,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#dff3ff" />
                  <XAxis dataKey="name" tick={{ fill: "#000000" }} />
                  <YAxis tick={{ fill: "#000000" }} />
                  <Tooltip />
                  <Bar
                    dataKey="success"
                    stackId="a"
                    fill="#c9e265"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="adequate"
                    stackId="a"
                    fill="#ffde59"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="atRisk"
                    stackId="a"
                    fill="#ff5757"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Evaluations List */}
          <div
            className="rounded-2xl p-8 shadow-lg mb-8"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <h2 className="text-2xl mb-6" style={{ color: "#004aad" }}>
              {t("studentPage.workshopHistory")}
            </h2>

            <div className="space-y-4">
              {studentAnswers.map((evaluation) => {
                const unit = unitData.find(
                  (u) =>
                    Number(u.evaluation) === Number(evaluation.unit_data_id),
                );
                return (
                  <div
                    key={evaluation.id}
                    className="p-6 rounded-xl border"
                    style={{ borderColor: "#dff3ff" }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className="px-3 py-1 rounded-lg text-sm"
                            style={{
                              background: "#004aad",
                              color: "#ffffff",
                            }}
                          >
                            {t("studentPage.workshop")}{" "}
                            {evaluation.unit_data_id}
                          </span>
                          <h3 className="text-lg" style={{ color: "#004aad" }}>
                            {t(unit!.title)}
                          </h3>
                        </div>
                        <p
                          className="text-sm mb-2"
                          style={{ color: "#000000", opacity: 0.7 }}
                        >
                          {t("studentPage.completedOn")}{" "}
                          {evaluation.updated_at
                            ? formatDate(evaluation.updated_at)
                            : "N/A"}
                        </p>
                      </div>

                      <div
                        className="px-4 py-2 rounded-xl flex items-center gap-2"
                        style={{
                          background: getStatusColor(
                            evaluation!.status || null,
                          ),
                        }}
                      >
                        <span
                          style={{
                            color:
                              evaluation.status === "success"
                                ? "#000000"
                                : "#ffffff",
                          }}
                        >
                          {getStatusText(evaluation.status || null, t)}
                        </span>
                      </div>
                    </div>

                    {evaluation.comment && (
                      <div
                        className="mt-4 p-4 rounded-xl"
                        style={{ background: "#dff3ff" }}
                      >
                        <div className="flex items-start gap-2">
                          <MessageSquare
                            className="w-5 h-5 flex-shrink-0 mt-0.5"
                            style={{ color: "#004aad" }}
                          />
                          <div className="flex-1">
                            <p
                              className="text-sm mb-1"
                              style={{ color: "#004aad" }}
                            >
                              {t("studentPage.teacherComment")}
                            </p>
                            <p style={{ color: "#000000" }}>
                              {evaluation.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
