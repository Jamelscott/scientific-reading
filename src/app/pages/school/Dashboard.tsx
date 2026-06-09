import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import {
  BookOpen,
  BarChart3,
  Users,
  School,
  LogOut,
  TrendingUp,
  ChevronDown,
  Settings,
  Download,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from "recharts";
import { useTranslation } from "react-i18next";
import { Sidebar } from "../../components/Sidebar";
import {
  useClassStore,
  useStudentStore,
  useTeacherStore,
} from "../../../stores";
import { schoolLevel } from "../const";
import { Grades } from "../../../../mockData/types";

const trendData = [
  { month: "Sept", taux: 58 },
  { month: "Oct", taux: 63 },
  { month: "Nov", taux: 67 },
  { month: "Déc", taux: 70 },
  { month: "Jan", taux: 73 },
  { month: "Fév", taux: 75 },
  { month: "Mars", taux: 76 },
];

export function SchoolDashboard() {
  const navigate = useNavigate();
  const { schoolId } = useParams();
  const { t } = useTranslation();
  const teachers = useTeacherStore((state) => state.teachers);
  const [year, setYear] = useState("2025-2026");
  const [viewMode, setViewMode] = useState<"class" | "grade">("class");
  const students = useStudentStore((state) => state.students);
  const realClasses = useClassStore((state) => state.classes);
  const getClassBenchmarks = useClassStore((state) => state.getClassBenchmarks);
  const getClassPerformance = useClassStore(
    (state) => state.getClassPerformance,
  );

  const classBenchmarks = useMemo(
    () => getClassBenchmarks(),
    [students, realClasses],
  );

  // Get real class performance data
  const classes = useMemo(() => getClassPerformance(), [students, realClasses]);

  // Transform classBenchmarks into chart data, filtering out null values
  const gradeProgress = useMemo(() => {
    const getColor = (percentage: number) => {
      if (percentage >= 75) return "#3b82f6"; // Blue - good
      if (percentage >= 60) return "#fbbf24"; // Yellow - medium
      return "#ef4444"; // Red - needs attention
    };

    return Object.entries(classBenchmarks)
      .filter(([_, value]) => value !== null) // Only show grades with data
      .map(([grade, achieved]) => ({
        grade,
        achieved: achieved as number,
        color: getColor(achieved as number),
      }));
  }, [classBenchmarks]);

  // Calculate school-wide average onTrack percentage from all grades
  const avgEnVoie = useMemo(() => {
    const validGrades = Object.values(classBenchmarks).filter(
      (value) => value !== null,
    ) as number[];

    if (validGrades.length === 0) return 0;

    const sum = validGrades.reduce((acc, val) => acc + val, 0);
    return Math.round(sum / validGrades.length);
  }, [classBenchmarks]);

  // Students most in need (À risque or À surveiller)
  const studentsInNeed = useMemo(() => {
    // Map grades to schoolLevel categories
    const gradeLevelMap: Record<Grades, keyof typeof schoolLevel> = {
      Maternelle: "kindergarden",
      Jardin: "seniorKindergarden",
      "1re année": "gradeOne",
      "2e année": "gradeTwo",
      "3e année": "gradeTwo",
    };

    // Track class counts per grade for naming
    const gradeClassCounts: Record<string, number> = {};

    const atRiskStudents = students
      .map((student) => {
        // Get student's class to determine grade
        const studentClass = realClasses.find((cls) =>
          student.classIds.includes(cls.id),
        );

        if (!studentClass) return null;

        // Get grade benchmarks
        const levelKey = gradeLevelMap[studentClass.grade];
        const benchmarks = schoolLevel[levelKey];

        // Count successful evaluations
        const successfulEvaluations =
          student.evaluations?.filter(
            (evaluation) =>
              evaluation.status === "success" ||
              evaluation.status === "adequate",
          ).length || 0;

        // Determine status
        let status: "À risque" | "À surveiller" | null = null;
        if (successfulEvaluations < benchmarks.needsSupport) {
          status = "À risque";
        } else if (successfulEvaluations < benchmarks.onTrack) {
          status = "À surveiller";
        }

        // Only include students who need attention
        if (!status) return null;

        // Get teacher name
        const teacher = teachers?.find((t) => t.id === studentClass.teacherId);
        const teacherName = teacher?.name || "Enseignant inconnu";

        // Generate class name with letter
        if (!gradeClassCounts[studentClass.grade]) {
          gradeClassCounts[studentClass.grade] = 0;
        }
        const letterIndex = gradeClassCounts[studentClass.grade];
        gradeClassCounts[studentClass.grade]++;
        const className = `${studentClass.grade}`;

        return {
          id: student.id,
          name: student.name,
          className,
          grade: studentClass.grade,
          teacher: teacherName,
          teacherId: studentClass.teacherId,
          classId: studentClass.id,
          atelier: successfulEvaluations,
          status,
        };
      })
      .filter((student) => student !== null)
      .sort((a, b) => {
        if (!a || !b) return 0;
        // Sort by status (À risque first), then by atelier (lower first)
        if (a.status === "À risque" && b.status !== "À risque") return -1;
        if (a.status !== "À risque" && b.status === "À risque") return 1;
        return a.atelier - b.atelier;
      });

    return atRiskStudents as Array<{
      id: string;
      name: string;
      className: string;
      grade: string;
      teacher: string;
      teacherId: string;
      classId: string;
      atelier: number;
      status: "À risque" | "À surveiller";
    }>;
  }, [students, realClasses, teachers]);

  // Group classes by grade for grade view
  const classesByGrade = classes.reduce(
    (acc, cls) => {
      if (!acc[cls.grade]) acc[cls.grade] = [];
      acc[cls.grade].push(cls);
      return acc;
    },
    {} as Record<string, typeof classes>,
  );

  const getAtelierColor = (atelier: number) => {
    if (atelier <= 4) return "#3b82f6";
    if (atelier === 5) return "#38bdf8";
    if (atelier === 6) return "#22d3ee";
    if (atelier === 7) return "#a3e635";
    if (atelier === 8) return "#fbbf24";
    if (atelier === 9) return "#fb923c";
    if (atelier === 10) return "#fb7185";
    if (atelier === 11) return "#a855f7";
    if (atelier === 12) return "#0ea5e9";
    if (atelier === 13) return "#ef4444";
    return "#004aad";
  };

  return (
    <div
      className="h-screen flex overflow-hizdden"
      style={{ background: "#dff3ff" }}
    >
      <Sidebar />
      {/* Main */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <School className="w-5 h-5" style={{ color: "#004aad" }} />
              <span
                className="text-sm font-medium"
                style={{ color: "#004aad" }}
              >
                {t("school.schoolName")}
              </span>
            </div>
            <h1 className="text-3xl font-bold" style={{ color: "#004aad" }}>
              {t("school.title")}
            </h1>
            <p className="text-sm mt-1" style={{ color: "#666" }}>
              {t("school.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="px-4 py-2.5 rounded-xl appearance-none pr-9 text-sm"
                style={{
                  background: "#ffffff",
                  border: "1px solid #dff3ff",
                  color: "#004aad",
                }}
              >
                <option value="2025-2026">2025–2026</option>
                <option value="2024-2025">2024–2025</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "#004aad" }}
              />
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              label: t("school.enrolledStudents"),
              value: students.length,
              icon: Users,
              bg: "#dff3ff",
              iconColor: "#004aad",
            },
            {
              label: t("common.classes"),
              value: realClasses.length,
              icon: School,
              bg: "#dff3ff",
              iconColor: "#004aad",
            },
            {
              label: t("school.onTrackAvg"),
              value: `${avgEnVoie}%`,
              icon: TrendingUp,
              bg: "#c9e265",
              iconColor: "#1a4a00",
            },
          ].map(({ label, value, icon: Icon, bg, iconColor }) => (
            <div
              key={label}
              className="rounded-2xl p-5"
              style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: bg }}
              >
                <Icon className="w-5 h-5" style={{ color: iconColor }} />
              </div>
              <p className="text-xs mb-1" style={{ color: "#666" }}>
                {label}
              </p>
              <p className="text-2xl font-bold" style={{ color: "#004aad" }}>
                {value}
              </p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Grade benchmarks */}
          <div
            className="rounded-2xl p-6"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-base" style={{ color: "#004aad" }}>
                {t("school.gradeBenchmarks")}
              </h2>
              <button
                className="px-3 py-1.5 rounded-lg text-xs hover:shadow-md transition-all cursor-pointer"
                style={{ background: "#38b6ff", color: "#ffffff" }}
              >
                <Download className="w-3 h-3 inline mr-1" />
                {t("common.export")}
              </button>
            </div>
            <div className="space-y-4">
              {gradeProgress.map(({ grade, achieved, color }) => (
                <div key={grade}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#333" }}
                    >
                      {grade}
                    </span>
                    <span className="text-sm font-bold" style={{ color }}>
                      {achieved}%
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: "#f0f0f0" }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${achieved}%`, background: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trend line */}
          <div
            className="rounded-2xl p-6"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <h2
              className="font-bold text-base mb-5"
              style={{ color: "#004aad" }}
            >
              {t("school.progressionYear")}
            </h2>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#888" }} />
                <YAxis
                  domain={[50, 85]}
                  tick={{ fontSize: 11, fill: "#888" }}
                  unit="%"
                />
                <Tooltip
                  formatter={(v: number) => [`${v}%`, t("school.onTrack")]}
                />
                <Line
                  type="monotone"
                  dataKey="taux"
                  stroke="#004aad"
                  strokeWidth={2.5}
                  dot={{ fill: "#004aad", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* View Toggle */}
        <div
          className="rounded-t-2xl p-5 w-fit"
          style={{ background: "#ffffff" }}
        >
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("class")}
              className="px-4 py-2 rounded-xl text-sm transition-all hover:shadow-md cursor-pointer"
              style={{
                background: viewMode === "class" ? "#004aad" : "#dff3ff",
                color: viewMode === "class" ? "#ffffff" : "#004aad",
              }}
            >
              {t("school.viewByClass")}
            </button>
            <button
              onClick={() => setViewMode("grade")}
              className="px-4 py-2 rounded-xl text-sm transition-all hover:shadow-md cursor-pointer"
              style={{
                background: viewMode === "grade" ? "#004aad" : "#dff3ff",
                color: viewMode === "grade" ? "#ffffff" : "#004aad",
              }}
            >
              {t("school.viewByGrade")}
            </button>
          </div>
        </div>

        {/* Per Class View */}
        {viewMode === "class" && (
          <div
            className="rounded-b-2xl rounded-tr-2xl p-6"
            style={{
              background: "#ffffff",
            }}
          >
            <div
              className="grid grid-cols-2 gap-4"
              style={{
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              {classes.map((cls, idx) => {
                const perfColor =
                  cls.enVoie >= 75
                    ? "#22c55e"
                    : cls.enVoie >= 65
                      ? "#f59e0b"
                      : "#ff5757";
                const perfBg =
                  cls.enVoie >= 75
                    ? "#f0fdf4"
                    : cls.enVoie >= 65
                      ? "#fffbeb"
                      : "#fff5f5";
                const delta = cls.enVoie - avgEnVoie;
                const initials = cls.teacher
                  .split(" ")
                  .map((w) => w[0])
                  .filter((_, i, a) => i === 0 || i === a.length - 1)
                  .join("")
                  .toUpperCase();
                return (
                  <button
                    key={cls.id}
                    onClick={() =>
                      navigate(
                        `/school/${schoolId}/teacher/${cls.teacherId}/class/${cls.id}`,
                      )
                    }
                    className="text-left rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 group cursor-pointer"
                    style={{
                      background: "#F5F5F5",
                      border: "1px solid #dff3ff",
                    }}
                  >
                    <div className="p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 pr-3">
                          <h3
                            className="font-bold text-2xl! leading-tight truncate"
                            style={{ color: "#004aad" }}
                          >
                            {cls.grade}
                          </h3>
                        </div>
                        <div
                          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: "#004aad", color: "#ffffff" }}
                        >
                          {initials}
                        </div>
                      </div>

                      <p
                        className="text-xs mb-4 truncate"
                        style={{ color: "#888" }}
                      >
                        {cls.teacher}
                      </p>

                      {/* Stats */}
                      <div className="flex items-end justify-between mb-3">
                        <div>
                          <p
                            className="text-xs mb-0.5"
                            style={{ color: "#aaa" }}
                          >
                            {t("school.students")}
                          </p>
                          <p
                            className="text-2xl font-bold leading-none"
                            style={{ color: "#004aad" }}
                          >
                            {cls.students}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className="text-xs mb-0.5"
                            style={{ color: "#aaa" }}
                          >
                            {t("school.onTrack")}
                          </p>
                          <p
                            className="text-2xl font-bold leading-none"
                            style={{ color: perfColor }}
                          >
                            {cls.enVoie}%
                          </p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div
                        className="h-2 rounded-full overflow-hidden mb-3"
                        style={{
                          background: "#eef2f7",
                          border: `1px solid ${perfColor}`,
                        }}
                      >
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${cls.enVoie}%`,
                            background: perfColor,
                          }}
                        />
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <span
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium"
                          style={{ background: perfBg, color: perfColor }}
                        >
                          {delta >= 0 ? "+" : ""}
                          {delta}% {t("school.vsAverage")}
                        </span>
                        <ArrowUpRight
                          className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                          style={{ color: "#38b6ff" }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Per Grade View */}
        {viewMode === "grade" && (
          <div
            className="rounded-b-2xl rounded-tr-2xl p-6"
            style={{
              background: "#ffffff",
            }}
          >
            <div
              style={{
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              {Object.entries(classesByGrade).map(
                ([grade, gradeClasses], idx) => {
                  const gradeAvg = Math.round(
                    gradeClasses.reduce((sum, cls) => sum + cls.enVoie, 0) /
                      gradeClasses.length,
                  );
                  const gradeStudents = students.filter((student) =>
                    student.classIds.some((classId) =>
                      realClasses.find(
                        (cls) => cls.id === classId && cls.grade === grade,
                      ),
                    ),
                  );

                  return (
                    <div
                      key={grade}
                      className={`pt-0 ${idx === 0 ? "rounded-tr-2xl pt-6" : ""} ${idx === Object.entries(classesByGrade).length - 1 ? "rounded-b-2xl" : ""}`}
                      style={{
                        background: "#ffffff",
                      }}
                    >
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <h2
                            className="font-bold text-lg"
                            style={{ color: "#004aad" }}
                          >
                            {grade}
                          </h2>
                          <p className="text-sm" style={{ color: "#666" }}>
                            {gradeClasses.length} {t("school.classes")} •{" "}
                            {gradeStudents.length}{" "}
                            {t("school.studentsLowercase")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs" style={{ color: "#888" }}>
                            {t("school.averageOnTrack")}
                          </p>
                          <p
                            className="text-2xl font-bold"
                            style={{
                              color:
                                gradeAvg >= 75
                                  ? "#2e7d32"
                                  : gradeAvg >= 65
                                    ? "#d97706"
                                    : "#dc2626",
                            }}
                          >
                            {gradeAvg}%
                          </p>
                        </div>
                      </div>
                      {/* Classes in this grade */}
                      <div className="flex gap-3 overflow-x-auto">
                        {gradeClasses.map((cls) => (
                          <button
                            key={cls.id}
                            onClick={() =>
                              navigate(
                                `/school/${schoolId}/teacher/${cls.teacherId}/class/${cls.id}`,
                              )
                            }
                            className="p-4 rounded-xl text-left hover:shadow-md transition-all flex-shrink-0 mb-4 cursor-pointer"
                            style={{
                              background: "#dff3ff",
                              border: "1px solid #38b6ff",
                              minWidth: "300px",
                            }}
                          >
                            <p
                              className="font-semibold text-sm mb-1"
                              style={{ color: "#004aad" }}
                            >
                              {cls.grade}
                            </p>
                            <p
                              className="text-xs mb-2"
                              style={{ color: "#666" }}
                            >
                              {cls.teacher}
                            </p>
                            <p
                              className="text-lg font-bold"
                              style={{
                                color:
                                  cls.enVoie >= 75
                                    ? "#2e7d32"
                                    : cls.enVoie >= 65
                                      ? "#d97706"
                                      : "#dc2626",
                              }}
                            >
                              {cls.enVoie}%
                            </p>
                          </button>
                        ))}
                      </div>
                      {idx < Object.entries(classesByGrade).length - 1 && (
                        <hr className="mt-6" />
                      )}
                    </div>
                  );
                },
              )}
            </div>
          </div>
        )}
        {/* Students Most in Need */}
        {studentsInNeed.length > 0 && (
          <div
            className="rounded-2xl p-6 mt-8"
            style={{ background: "#fff5f5", border: "2px solid #ff5757" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5" style={{ color: "#ff5757" }} />
              <h2 className="font-bold text-base" style={{ color: "#ff5757" }}>
                {t("school.studentsToMonitor")} ({studentsInNeed.length})
              </h2>
            </div>
            <div
              className="grid grid-cols-2 gap-3"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              {studentsInNeed.map((student) => (
                <button
                  key={student.id}
                  onClick={() =>
                    navigate(
                      `/school/${schoolId}/teacher/${student.teacherId}/class/${student.classId}/student/${student.id}`,
                    )
                  }
                  className="p-4 rounded-xl flex items-center justify-between text-left hover:shadow-md transition-all cursor-pointer"
                  style={{
                    background: "#ffffff",
                    border: "1px solid #ffcccc",
                  }}
                >
                  <div className="flex-1">
                    <p
                      className="font-semibold text-sm mb-1"
                      style={{ color: "#004aad" }}
                    >
                      {student.name}
                    </p>
                    <p className="text-xs" style={{ color: "#666" }}>
                      {student.className} • {student.teacher}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        background: getAtelierColor(student.atelier),
                        color: "#ffffff",
                      }}
                    >
                      A{student.atelier}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        student.status === "À risque"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {student.status === "À risque"
                        ? t("school.atRisk")
                        : t("school.toMonitor")}
                    </span>
                    <ArrowUpRight
                      className="w-4 h-4"
                      style={{ color: "#38b6ff" }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
