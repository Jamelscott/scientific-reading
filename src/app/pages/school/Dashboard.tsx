import { useEffect, useState, useMemo } from "react";
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
  Radar,
  RadarChart,
  PolarRadiusAxis,
  PolarAngleAxis,
  PolarGrid,
  Cell,
} from "recharts";
import { useTranslation } from "react-i18next";
import { Sidebar } from "../../components/Sidebar";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import {
  useClassStore,
  useStudentStore,
  useUnitsStore,
  useTeacherStore,
  useAuthStore,
} from "../../../stores";
import { schoolGradeBenchmarks } from "../const";
import { Grades } from "../../../../mockData/types";

export function SchoolDashboard() {
  const navigate = useNavigate();
  const { schoolId } = useParams();
  const { t } = useTranslation();
  const isLoading = useAuthStore((state) => state.isLoading);
  const teachers = useTeacherStore((state) => state.teachers);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"class" | "grade">("class");
  const students = useStudentStore((state) => state.students);
  const answers = useUnitsStore((state) => state.answers);
  const realClasses = useClassStore((state) => state.classes);
  const getClassPerformance = useClassStore(
    (state) => state.getClassPerformance,
  );
  const getClassYear = (classItem: unknown): number | null => {
    const maybeYear = (classItem as { year?: unknown }).year;
    if (typeof maybeYear === "number") {
      return maybeYear;
    }

    const maybeSchoolYear = (classItem as { schoolYear?: unknown }).schoolYear;
    if (typeof maybeSchoolYear === "string") {
      const startYear = Number(maybeSchoolYear.split("-")[0]);
      if (!Number.isNaN(startYear)) {
        return startYear;
      }
    }

    return null;
  };

  const availableYears = useMemo(() => {
    const years = Array.from(
      new Set(
        realClasses
          .map((classItem) => getClassYear(classItem))
          .filter((year): year is number => year !== null),
      ),
    );
    return years.sort((a, b) => b - a);
  }, [realClasses]);

  useEffect(() => {
    if (availableYears.length === 0) {
      setSelectedYear(null);
      return;
    }

    setSelectedYear((currentYear) => {
      if (currentYear !== null && availableYears.includes(currentYear)) {
        return currentYear;
      }
      return availableYears[0];
    });
  }, [availableYears]);

  const filteredRealClasses = useMemo(() => {
    if (selectedYear === null) {
      return realClasses;
    }
    return realClasses.filter(
      (classItem) => getClassYear(classItem) === selectedYear,
    );
  }, [realClasses, selectedYear]);

  const filteredClassIds = useMemo(
    () => new Set(filteredRealClasses.map((cls) => cls.id)),
    [filteredRealClasses],
  );

  const filteredStudents = useMemo(
    () => students.filter((student) => filteredClassIds.has(student.class_id)),
    [students, filteredClassIds],
  );

  const filteredTeachers = useMemo(() => {
    const classTeacherIds = new Set(
      filteredRealClasses.map((cls) => cls.teacher_id),
    );
    return (teachers ?? []).filter((teacher) =>
      classTeacherIds.has(teacher.id),
    );
  }, [teachers, filteredRealClasses]);

  const filteredAnswers = useMemo(() => {
    const studentIds = new Set(filteredStudents.map((student) => student.id));
    return answers.filter(
      (answer) =>
        filteredClassIds.has(answer.class_id) &&
        studentIds.has(answer.student_id),
    );
  }, [answers, filteredClassIds, filteredStudents]);

  const classBenchmarks = useMemo(() => {
    const gradeLevelMap: Record<Grades, keyof typeof schoolGradeBenchmarks> = {
      Maternelle: "kindergarden",
      Jardin: "seniorKindergarden",
      "1re année": "gradeOne",
      "2e année": "gradeTwo",
      "3e année": "gradeThree",
    };

    const results: Record<Grades, number | null> = {
      Maternelle: null,
      Jardin: null,
      "1re année": null,
      "2e année": null,
      "3e année": null,
    };

    const gradeGroups: Record<Grades, string[]> = {
      Maternelle: [],
      Jardin: [],
      "1re année": [],
      "2e année": [],
      "3e année": [],
    };

    filteredRealClasses.forEach((cls) => {
      gradeGroups[cls.grade].push(cls.id);
    });

    const uniqueAnswers = Object.values(
      filteredAnswers.reduce<Record<string, (typeof filteredAnswers)[number]>>(
        (acc, answer) => {
          const key = `${answer.student_id}::${answer.class_id}::${answer.unit_data_id}`;
          const current = acc[key];

          if (!current) {
            acc[key] = answer;
            return acc;
          }

          const currentUpdatedAt = current.updated_at ?? "";
          const nextUpdatedAt = answer.updated_at ?? "";
          const shouldReplace =
            nextUpdatedAt > currentUpdatedAt ||
            String(answer.id) > String(current.id);

          if (shouldReplace) {
            acc[key] = answer;
          }

          return acc;
        },
        {},
      ),
    );

    Object.entries(gradeGroups).forEach(([grade, classIds]) => {
      if (classIds.length === 0) {
        results[grade as Grades] = null;
        return;
      }

      const gradeStudents = filteredStudents.filter((student) =>
        classIds.includes(student.class_id),
      );

      if (gradeStudents.length === 0) {
        results[grade as Grades] = null;
        return;
      }

      const levelKey = gradeLevelMap[grade as Grades];
      const benchmarks = schoolGradeBenchmarks[levelKey];
      let onTrackOrBetter = 0;

      gradeStudents.forEach((student) => {
        const studentAnswers = uniqueAnswers.filter(
          (answer) =>
            answer.student_id === student.id &&
            classIds.includes(answer.class_id),
        );

        if (studentAnswers.length === 0) {
          return;
        }

        const successfulEvaluations = studentAnswers.filter(
          (evaluation) =>
            evaluation.status === "success" || evaluation.status === "adequate",
        ).length;

        if (successfulEvaluations >= benchmarks.onTrack) {
          onTrackOrBetter++;
        }
      });

      const percentage = (onTrackOrBetter / gradeStudents.length) * 100;
      results[grade as Grades] = Math.round(percentage);
    });

    return results;
  }, [filteredRealClasses, filteredStudents, filteredAnswers]);

  // Get real class performance data
  const allClassPerformance = useMemo(
    () => getClassPerformance(),
    [students, realClasses, answers],
  );

  const classes = useMemo(
    () => allClassPerformance.filter((cls) => filteredClassIds.has(cls.id)),
    [allClassPerformance, filteredClassIds],
  );

  // Transform classBenchmarks into chart data, keeping grades without data visible
  const gradeProgress = useMemo(() => {
    const getColor = (percentage: number) => {
      if (percentage >= 75) return "#3b82f6"; // Blue - good
      if (percentage >= 60) return "#fbbf24"; // Yellow - medium
      return "#ef4444"; // Red - needs attention
    };

    return Object.entries(classBenchmarks).map(([grade, achieved]) => ({
      grade,
      achieved,
      color: achieved === null ? "#94a3b8" : getColor(achieved),
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
    // Map grades to schoolGradeBenchmarks categories
    const gradeLevelMap: Record<Grades, keyof typeof schoolGradeBenchmarks> = {
      Maternelle: "kindergarden",
      Jardin: "seniorKindergarden",
      "1re année": "gradeOne",
      "2e année": "gradeTwo",
      "3e année": "gradeThree",
    };

    // Track class counts per grade for naming
    const gradeClassCounts: Record<string, number> = {};

    const atRiskStudents = filteredStudents
      .map((student) => {
        // Get student's class to determine grade
        const studentClass = filteredRealClasses.find(
          (cls) => student.class_id === cls.id,
        );

        if (!studentClass) return null;

        // Get grade benchmarks
        const levelKey = gradeLevelMap[studentClass.grade];
        const benchmarks = schoolGradeBenchmarks[levelKey];

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
        const teacher = filteredTeachers.find(
          (t) => t.id === studentClass.teacher_id,
        );
        const teacherName = teacher?.name || "Enseignant inconnu";

        // Generate class name with letter
        if (!gradeClassCounts[studentClass.grade]) {
          gradeClassCounts[studentClass.grade] = 0;
        }
        const _letterIndex = gradeClassCounts[studentClass.grade];
        gradeClassCounts[studentClass.grade]++;
        const className = `${studentClass.grade}`;

        return {
          id: student.id,
          name: student.name,
          className,
          grade: studentClass.grade,
          teacher: teacherName,
          teacherId: studentClass.teacher_id,
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
  }, [filteredStudents, filteredRealClasses, filteredTeachers]);

  const atRiskStudents = studentsInNeed.filter(
    (student) => student.status === "À risque",
  );
  const studentsToMonitor = studentsInNeed.filter(
    (student) => student.status === "À surveiller",
  );

  const calculateSchoolCompetencyScore = (atelierRange: string[]) => {
    const relevantAnswers = filteredAnswers.filter((answer) =>
      atelierRange.includes(String(answer.unit_data_id)),
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
    });

    if (countedAnswers === 0) return 0;

    return Math.round(totalScore / countedAnswers);
  };

  const schoolRadarData = [
    {
      axis: "1",
      color: "#38b6ff",
      subject: t("studentPage.reading"),
      score: calculateSchoolCompetencyScore(["1", "2", "3", "4", "5", "6"]),
    },
    {
      axis: "2",
      color: "#a3e635",
      subject: t("studentPage.writing"),
      score: calculateSchoolCompetencyScore(["7", "8", "9"]),
    },
    {
      axis: "3",
      color: "#ffde59",
      subject: t("studentPage.decoding"),
      score: calculateSchoolCompetencyScore(["10", "11"]),
    },
    {
      axis: "4",
      color: "#fb923c",
      subject: t("studentPage.fluency"),
      score: calculateSchoolCompetencyScore(["12", "13"]),
    },
    {
      axis: "5",
      color: "#ff5757",
      subject: t("studentPage.comprehension"),
      score: calculateSchoolCompetencyScore(["14", "15"]),
    },
  ];

  const radarAxisColorMap = schoolRadarData.reduce<Record<string, string>>(
    (acc, item) => {
      acc[item.axis] = item.color;
      return acc;
    },
    {},
  );

  const RadarNumberTick = ({ payload, x, y, cx, cy }: any) => {
    const dx = x - cx;
    const dy = y - cy;
    const length = Math.hypot(dx, dy) || 1;
    const offset = 16;
    const tx = x + (dx / length) * offset;
    const ty = y + (dy / length) * offset;
    const axisColor = radarAxisColorMap[String(payload.value)] || "#38b6ff";

    return (
      <g>
        <circle
          cx={tx}
          cy={ty}
          r={11}
          fill="#ffffff"
          stroke={axisColor}
          strokeWidth={2}
        />
        <text
          x={tx}
          y={ty}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={axisColor}
          fontSize={11}
          fontWeight={700}
        >
          {payload.value}
        </text>
      </g>
    );
  };

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

  const hasLoadedDashboardData =
    (teachers?.length ?? 0) > 0 ||
    students.length > 0 ||
    realClasses.length > 0 ||
    answers.length > 0;

  if (isLoading && !hasLoadedDashboardData) {
    return <LoadingSpinner fullScreen />;
  }

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
                value={selectedYear ?? ""}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-4 py-2.5 rounded-xl appearance-none pr-9 text-sm transition-shadow duration-200 hover:shadow-md"
                style={{
                  background: "#ffffff",
                  border: "1px solid #dff3ff",
                  color: "#004aad",
                }}
                aria-label={t("schoolBoard.dashboard.schoolYear")}
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {`${year}-${year + 1}`}
                  </option>
                ))}
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
              value: filteredStudents.length,
              icon: Users,
              bg: "#dff3ff",
              iconColor: "#004aad",
            },
            {
              label: t("common.classes"),
              value: filteredRealClasses.length,
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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          {/* Grade benchmarks */}
          <div
            className="rounded-2xl p-6 min-w-0"
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
                      {achieved === null ? "N/A" : `${achieved}%`}
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: "#f0f0f0" }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${achieved ?? 0}%`, background: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* School-wide Skills Radar */}
          <div
            className="rounded-2xl p-6"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <div className="flex flex-col lg:flex-row gap-4 lg:items-start h-full">
              <div
                className="lg:w-44 lg:flex-shrink-0 flex flex-col items-start h-full"
                style={{ color: "#004aad" }}
              >
                <h2
                  className="font-bold text-base mb-4"
                  style={{ color: "#004aad" }}
                >
                  {t("studentPage.skillsProfile")}
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-2 text-xs h-full">
                  {schoolRadarData.map((item) => (
                    <div key={item.axis} className="flex items-center gap-2">
                      <span
                        className="inline-flex w-6 h-6 items-center justify-center rounded-full text-[11px]"
                        style={{
                          background: "#ffffff",
                          color: item.color,
                          border: `2px solid ${item.color}`,
                        }}
                      >
                        {item.axis}
                      </span>
                      <span style={{ color: item.color }}>{item.subject}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full h-[220px] sm:h-[260px] lg:h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={schoolRadarData} outerRadius="58%">
                    <PolarGrid stroke="#dff3ff" />
                    <PolarAngleAxis dataKey="axis" tick={<RadarNumberTick />} />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fill: "#000000", fontSize: 10 }}
                    />
                    <Radar
                      name={t("studentPage.skillsProfile")}
                      dataKey="score"
                      stroke="#38b6ff"
                      fill="#38b6ff"
                      fillOpacity={0.5}
                    />
                    <Tooltip
                      formatter={(v: number) => [`${v}%`, t("school.onTrack")]}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
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
                  const gradeClassIds = new Set(
                    filteredRealClasses
                      .filter((cls) => cls.grade === grade)
                      .map((cls) => cls.id),
                  );
                  const gradeStudents = filteredStudents.filter((student) =>
                    gradeClassIds.has(student.class_id),
                  );

                  return (
                    <div
                      key={grade}
                      className={`pt-0 ${idx === 0 ? "rounded-tr-2xl pt-6" : ""} ${idx === Object.entries(classesByGrade).length - 1 ? "rounded-b-2xl" : ""}`}
                      style={{
                        background: "#ffffff",
                      }}
                    >
                      <div className="flex items-center justify-between mb-5 mt-2<">
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
                        <div className="text-right mr-4">
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
                        <hr className="my-6 mr-2" />
                      )}
                    </div>
                  );
                },
              )}
            </div>
          </div>
        )}
        {/* At Risk Students */}
        {atRiskStudents.length > 0 && (
          <div
            className="rounded-2xl p-6 mt-8"
            style={{ background: "#fff5f5", border: "2px solid #ff5757" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5" style={{ color: "#ff5757" }} />
              <h2 className="font-bold text-base" style={{ color: "#ff5757" }}>
                {t("school.atRisk")} ({atRiskStudents.length})
              </h2>
            </div>
            <div
              className="grid grid-cols-2 gap-3"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              {atRiskStudents.map((student) => (
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

        {/* Students To Monitor */}
        {studentsToMonitor.length > 0 && (
          <div
            className="rounded-2xl p-6 mt-8"
            style={{ background: "#fffaf0", border: "2px solid #fbbf24" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5" style={{ color: "#f59e0b" }} />
              <h2 className="font-bold text-base" style={{ color: "#d97706" }}>
                {t("school.studentsToMonitor")} ({studentsToMonitor.length})
              </h2>
            </div>
            <div
              className="grid grid-cols-2 gap-3"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              {studentsToMonitor.map((student) => (
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
                    border: "1px solid #fde68a",
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
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                      {t("school.toMonitor")}
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
