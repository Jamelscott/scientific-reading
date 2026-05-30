import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { useClassStore } from "../../../stores/useClassStore";
import { useStudentStore } from "../../../stores/useStudentStore";
import { useUnitsStore } from "../../../stores/useUnitsStore";
import { Initials } from "../../components/Initials";
import { NotificationDropdown } from "../../components/NotificationDropdown";
import { Sidebar } from "../../components/Sidebar";
import getScoreFromEvaluations, {
  getPercentageFromEvaluations,
} from "../../utils/getScoreFromEvaluations";
import {
  BookOpen,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Download,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

import {
  BarChart,
  Bar,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Line,
  LineChart,
  PieChart,
} from "recharts";
import { gradeBenchmarks } from "../const";

function scoreStatusToNumber(
  status: "success" | "adequate" | "needs-improvement" | null,
): number {
  if (status === "success") return 85;
  if (status === "adequate") return 70;
  if (status === "needs-improvement") return 40;
  return 0;
}

export function ReportsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { teacherId } = useParams();
  const classes = useClassStore((state) => state.classes);
  const getAllAnswers = useUnitsStore((state) => state.answers);
  const unitsData = useUnitsStore((state) => state.unitsData);
  const students = useStudentStore((state) => state.students);
  const getStudentCountByClass = useStudentStore(
    (state) => state.getStudentCountByClass,
  );
  const [selectedClassId, setSelectedClassId] = useState<number | null>(
    classes.length > 0 ? classes[0].id : null,
  );
  const [expandedClassIds, setExpandedClassIds] = useState<Set<number>>(
    new Set(classes.map((c) => c.id)),
  );
  const toggleClassExpanded = (classId: number) => {
    setExpandedClassIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(classId)) {
        newSet.delete(classId);
      } else {
        newSet.add(classId);
      }
      return newSet;
    });
  };
  // Calculate grade distribution percentages
  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const classStudentCount = selectedClassId
    ? getStudentCountByClass(selectedClassId)
    : 0;

  const calculateGradeDistribution = () => {
    // Use unitsData to compute expected total evaluations (units x students in selected class)
    const unitCount = unitsData.length || 0;
    const expectedTotal = unitCount * classStudentCount;

    let successCount = 0;
    let adequateCount = 0;
    let needsImprovementCount = 0;
    // Count submitted (non-null) scores for the selected class only
    getAllAnswers
      .filter((answer) => answer.classId === selectedClassId)
      .forEach((answer) => {
        const status = getScoreFromEvaluations(answer.answers);
        if (status === "success") successCount++;
        else if (status === "adequate") adequateCount++;
        else if (status === "needs-improvement") needsImprovementCount++;
      });

    const submittedCount = successCount + adequateCount + needsImprovementCount;
    const notSubmittedCount = Math.max(0, expectedTotal - submittedCount);

    return {
      good:
        submittedCount > 0
          ? Math.round((successCount / submittedCount) * 100).toString()
          : "0",
      satisfactory:
        submittedCount > 0
          ? Math.round((adequateCount / submittedCount) * 100).toString()
          : "0",
      failing:
        submittedCount > 0
          ? Math.round((needsImprovementCount / submittedCount) * 100).toString()
          : "0",
      notSubmitted:
        expectedTotal > 0
          ? Math.round((notSubmittedCount / expectedTotal) * 100).toString()
          : "0",
    };
  };

  const calculateStudentDistribution = (
    classId: number | null = selectedClassId,
  ) => {
    let successStudents = 0;
    let adequateStudents = 0;
    let needsImprovementStudents = 0;

    // Get students in the specified class
    const classStudentIds = new Set(
      students.filter((s) => s.classIds.includes(classId!)).map((s) => s.id),
    );

    if (classStudentIds.size === 0) {
      return [
        { name: t("reports.legend.success"), value: 0, color: "#c9e265" },
        { name: t("reports.legend.adequate"), value: 0, color: "#ffde59" },
        {
          name: t("reports.legend.needsImprovement"),
          value: 0,
          color: "#ff5757",
        },
      ];
    }

    // Calculate average progress for each student in the specified class
    classStudentIds.forEach((studentId) => {
      const studentAnswers = getAllAnswers.filter(
        (a) => a.studentId === studentId && a.classId === classId,
      );

      // Only count students who have submitted evaluations
      let total = 0;
      let count = 0;
      studentAnswers.forEach((answer) => {
        const status = getScoreFromEvaluations(answer.answers);
        if (status) {
          total += scoreStatusToNumber(status);
          count++;
        }
      });

      // Skip students with no submitted evaluations
      if (count === 0) {
        return;
      }

      const avg = total / count;
      if (avg >= 85) successStudents++;
      else if (avg >= 70) adequateStudents++;
      else needsImprovementStudents++;
    });

    return [
      {
        name: t("reports.legend.success"),
        value: successStudents,
        color: "#c9e265",
      },
      {
        name: t("reports.legend.adequate"),
        value: adequateStudents,
        color: "#ffde59",
      },
      {
        name: t("reports.legend.needsImprovement"),
        value: needsImprovementStudents,
        color: "#ff5757",
      },
    ];
  };

  // Build classPerformanceData: produce three workshop-range items for the selected class
  // Each item contains percentages for success, adequate and failing (stacked bars)
  const buildClassPerformanceData = () => {
    const ranges: { name: string; units: number[] }[] = [
      { name: t("reports.workshopRanges.unit1"), units: [1, 2, 3, 4, 5, 6] },
      { name: t("reports.workshopRanges.unit2To5"), units: [7, 8, 9, 10, 11] },
      {
        name: t("reports.workshopRanges.unit6To10"),
        units: [12, 13, 14, 15],
      },
    ];

    const classId = selectedClassId ?? (classes[0] && classes[0].id) ?? null;
    if (!classId)
      return ranges.map((r) => ({
        name: r.name,
        success: 0,
        adequate: 0,
        failing: 0,
      }));

    return ranges.map((range) => {
      let successCount = 0;
      let adequateCount = 0;
      let failingCount = 0;
      let submittedCount = 0;

      getAllAnswers
        .filter(
          (a) => a.classId === classId && range.units.includes(a.unitDataId),
        )
        .forEach((a) => {
          const status = getScoreFromEvaluations(a.answers);
          if (status) {
            submittedCount++;
            if (status === "success") successCount++;
            else if (status === "adequate") adequateCount++;
            else if (status === "needs-improvement") failingCount++;
          }
        });

      if (submittedCount === 0)
        return { name: range.name, success: 0, adequate: 0, failing: 0 };

      const success = Math.round((successCount / submittedCount) * 100);
      const adequate = Math.round((adequateCount / submittedCount) * 100);
      const failing = Math.max(0, 100 - success - adequate);

      return { name: range.name, success, adequate, failing };
    });
  };

  // Build progressOverTime: average performance by month based on unit evaluations
  const buildProgressOverTime = () => {
    // Map months to unit/evaluation IDs (assuming sequential order)
    const monthMap: Record<number, string> = {
      1: "Sept",
      2: "Oct",
      3: "Nov",
      4: "Déc",
      5: "Jan",
      6: "Fév",
      7: "Mar",
      8: "Avr",
      9: "Mai",
      10: "Juin",
    };

    interface MonthProgress {
      month: string;
      total: number;
      count: number;
    }
    const progressMap: Record<string, MonthProgress> = {};

    // Initialize months
    Object.values(monthMap).forEach((month) => {
      progressMap[month] = { month, total: 0, count: 0 };
    });

    // Group answers by unit (evaluation) and calculate average
    const answersByUnit: Record<number, string[]> = {};

    getAllAnswers.forEach((answer) => {
      if (!answersByUnit[answer.unitDataId]) {
        answersByUnit[answer.unitDataId] = [];
      }
      const status = getScoreFromEvaluations(answer.answers);
      if (status) {
        answersByUnit[answer.unitDataId].push(status);
      }
    });

    // Calculate average for each unit and map to month
    Object.entries(answersByUnit).forEach(([unitDataIdStr, statuses]) => {
      const unitDataId = parseInt(unitDataIdStr);
      // Map unit ID to evaluation number to get month (1-10 units = Sept-Juin)
      const monthIndex = ((unitDataId - 1) % 10) + 1;
      const month = monthMap[monthIndex];

      if (month && statuses.length > 0) {
        const avg =
          statuses.reduce((sum, status) => {
            return sum + scoreStatusToNumber(status as any);
          }, 0) / statuses.length;

        progressMap[month].total += avg;
        progressMap[month].count += 1;
      }
    });

    // Convert to final format and calculate averages
    return Object.values(monthMap)
      .map((month) => {
        const data = progressMap[month];
        return {
          month,
          average: data.count > 0 ? Math.round(data.total / data.count) : 0,
        };
      })
      .filter(
        (item) =>
          item.average > 0 || Object.keys(progressMap).indexOf(item.month) <= 4,
      );
  };

  const classPerformanceData = buildClassPerformanceData();
  const progressOverTime = buildProgressOverTime();

  // Calculate average units completed per student in selected class
  const calculateAverageUnitsCompleted = () => {
    const classStudentIds = new Set(
      students
        .filter((s) => s.classIds.includes(selectedClassId!))
        .map((s) => s.id),
    );
    if (classStudentIds.size === 0) return 0;

    let totalUnits = 0;
    let studentCount = 0;

    classStudentIds.forEach((studentId) => {
      const studentAnswers = getAllAnswers.filter(
        (a) => a.studentId === studentId && a.classId === selectedClassId,
      );

      if (studentAnswers.length > 0) {
        // Count unique units this student has completed
        const uniqueUnits = new Set(studentAnswers.map((a) => a.unitDataId));
        totalUnits += uniqueUnits.size;
        studentCount++;
      }
    });

    return studentCount > 0 ? Math.round(totalUnits / studentCount) : 0;
  };

  // Get student performance level counts
  const getStudentLevelCounts = (classId: number | null = selectedClassId) => {
    const distribution = calculateStudentDistribution(classId);
    return {
      onTrack:
        distribution.find((d) => d.name === t("reports.legend.success"))
          ?.value || 0,
      progressing:
        distribution.find((d) => d.name === t("reports.legend.adequate"))
          ?.value || 0,
      needingSupport:
        distribution.find(
          (d) => d.name === t("reports.legend.needsImprovement"),
        )?.value || 0,
    };
  };

  // Calculate evaluation distribution for a class (for pie chart)
  const calculateClassEvaluationDistribution = (classId: number) => {
    let successCount = 0;
    let adequateCount = 0;
    let needsImprovementCount = 0;

    // Count submitted evaluations by status for this class
    getAllAnswers
      .filter((answer) => answer.classId === classId)
      .forEach((answer) => {
        const status = getScoreFromEvaluations(answer.answers);
        if (status === "success") successCount++;
        else if (status === "adequate") adequateCount++;
        else if (status === "needs-improvement") needsImprovementCount++;
      });

    const total = successCount + adequateCount + needsImprovementCount;

    if (total === 0) {
      return [
        { name: "En voie/acquis", value: 0, color: "#c9e265" },
        { name: "À surveiller", value: 0, color: "#ffde59" },
        { name: "À risque", value: 0, color: "#ff5757" },
      ];
    }

    return [
      {
        name: "En voie/acquis",
        value: Math.round((successCount / total) * 100),
        color: "#c9e265",
      },
      {
        name: "À surveiller",
        value: Math.round((adequateCount / total) * 100),
        color: "#ffde59",
      },
      {
        name: "À risque",
        value: Math.round((needsImprovementCount / total) * 100),
        color: "#ff5757",
      },
    ];
  };

  // Get top performing students for a class
  const getTopStudents = (classId: number) => {
    const students = useStudentStore.getState().students;
    const classStudentIds = students
      .filter((s) => s.classIds.includes(classId))
      .map((s) => s.id);

    const studentScores = classStudentIds
      .map((studentId) => {
        const student = students.find((s) => s.id === studentId);
        if (!student) return null;

        const studentAnswers = getAllAnswers.filter(
          (a) => a.studentId === studentId && a.classId === classId,
        );

        if (studentAnswers.length === 0) return null;

        let total = 0;
        let count = 0;
        studentAnswers.forEach((answer) => {
          const percentage = getPercentageFromEvaluations(answer.answers);
          if (percentage !== null) {
            total += percentage;
            count++;
          }
        });

        if (count === 0) return null;

        return {
          name: student.name,
          score: Math.round(total / count),
          evaluations: count,
        };
      })
      .filter((s) => s !== null) as Array<{
      name: string;
      score: number;
      evaluations: number;
    }>;

    return studentScores.sort((a, b) => b.score - a.score).slice(0, 3);
  };

  // Get students needing support for a class
  const getStudentsNeedingSupport = (classId: number) => {
    const students = useStudentStore.getState().students;
    const classStudentIds = students
      .filter((s) => s.classIds.includes(classId))
      .map((s) => s.id);

    const studentScores = classStudentIds
      .map((studentId) => {
        const student = students.find((s) => s.id === studentId);
        if (!student) return null;

        const studentAnswers = getAllAnswers.filter(
          (a) => a.studentId === studentId && a.classId === classId,
        );

        if (studentAnswers.length === 0) return null;

        let total = 0;
        let count = 0;
        studentAnswers.forEach((answer) => {
          const percentage = getPercentageFromEvaluations(answer.answers);
          if (percentage !== null) {
            total += percentage;
            count++;
          }
        });

        if (count === 0) return null;

        const avgScore = Math.round(total / count);
        // Only include students with scores below 70 (needs improvement threshold)
        if (avgScore >= 70) return null;

        return {
          name: student.name,
          score: avgScore,
          evaluations: count,
        };
      })
      .filter((s) => s !== null) as Array<{
      name: string;
      score: number;
      evaluations: number;
    }>;

    return studentScores.sort((a, b) => a.score - b.score).slice(0, 3);
  };

  return (
    <div
      className="h-screen flex overflow-hidden"
      style={{ background: "#dff3ff" }}
    >
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 p-12 overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <h1 className="text-3xl mb-2" style={{ color: "#004aad" }}>
              {t("nav.reports")}
            </h1>
            <p className="text-lg" style={{ color: "#000000" }}>
              {t("reports.subtitle")}
            </p>
            <div className="mt-6">
              <label
                className="text-sm mb-2 block font-medium"
                style={{ color: "#004aad" }}
              >
                {t("reports.selectClass")}
              </label>
              <div className="relative inline-block">
                <select
                  value={selectedClassId ?? ""}
                  onChange={(e) =>
                    setSelectedClassId(
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                  className="appearance-none px-6 py-3 pr-12 rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-all"
                  style={{
                    background: "#ffffff",
                    border: "2px solid #dff3ff",
                    color: "#004aad",
                    minWidth: "250px",
                  }}
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.grade}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                  style={{ color: "#004aad" }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <Initials size="sm" />
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          {/* Number of Classes */}
          <div
            className="p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <BookOpen className="w-8 h-8 mb-3" style={{ color: "#004aad" }} />
            <p style={{ color: "#6b7280" }} className="text-xs mb-2">
              {t("reports.metrics.numberOfClasses")}
            </p>
            <p className="text-2xl font-semibold" style={{ color: "#004aad" }}>
              {classes.length}
            </p>
          </div>

          {/* Number of Students */}
          <div
            className="p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <Users className="w-8 h-8 mb-3" style={{ color: "#004aad" }} />
            <p style={{ color: "#6b7280" }} className="text-xs mb-2">
              {t("reports.metrics.numberOfStudents")}
            </p>
            <p className="text-2xl font-semibold" style={{ color: "#004aad" }}>
              {classStudentCount}
            </p>
          </div>

          {/* Good Grades */}
          <div
            className="p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <CheckCircle
              className="w-8 h-8 mb-3"
              style={{ color: "#c9e265" }}
            />
            <p style={{ color: "#6b7280" }} className="text-xs mb-2">
              {t("reports.metrics.goodGrades")}
            </p>
            <p className="text-2xl font-semibold" style={{ color: "#c9e265" }}>
              {calculateGradeDistribution().good}%
            </p>
          </div>

          {/* Satisfactory Grades */}
          <div
            className="p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <TrendingUp className="w-8 h-8 mb-3" style={{ color: "#ffde59" }} />
            <p style={{ color: "#6b7280" }} className="text-xs mb-2">
              {t("reports.metrics.satisfactoryGrades")}
            </p>
            <p className="text-2xl font-semibold" style={{ color: "#ffde59" }}>
              {calculateGradeDistribution().satisfactory}%
            </p>
          </div>

          {/* Failing Grades */}
          <div
            className="p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <AlertCircle
              className="w-8 h-8 mb-3"
              style={{ color: "#ff5757" }}
            />
            <p style={{ color: "#6b7280" }} className="text-xs mb-2">
              {t("reports.metrics.failingGrades")}
            </p>
            <p className="text-2xl font-semibold" style={{ color: "#ff5757" }}>
              {calculateGradeDistribution().failing}%
            </p>
          </div>

          {/* Not Submitted */}
          <div
            className="p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <div
              className="w-8 h-8 mb-3 rounded-full"
              style={{ background: "#9e9e9e" }}
            />
            <p style={{ color: "#6b7280" }} className="text-xs mb-2">
              {t("reports.metrics.notSubmitted")}
            </p>
            <p className="text-2xl font-semibold" style={{ color: "#6b7280" }}>
              {calculateGradeDistribution().notSubmitted}%
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Performance by Evaluation Range */}
          <div
            className="rounded-2xl p-6 shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl" style={{ color: "#004aad" }}>
                {t("reports.classPerformance")}
              </h2>
              <button
                className="p-2 rounded-xl transition-all hover:shadow-md cursor-pointer"
                style={{ background: "#dff3ff" }}
              >
                <Download className="w-5 h-5" style={{ color: "#004aad" }} />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dff3ff" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#000000", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#000000" }} />
                <Tooltip />
                <Bar dataKey="success" stackId="a" fill="#c9e265" />
                <Bar dataKey="adequate" stackId="a" fill="#ffde59" />
                <Bar dataKey="failing" stackId="a" fill="#ff5757" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Progress Over Time */}
          <div
            className="rounded-2xl p-6 shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl" style={{ color: "#004aad" }}>
                {t("reports.progressOverTime")}
              </h2>
              <button
                className="p-2 rounded-xl transition-all hover:shadow-md cursor-pointer"
                style={{ background: "#dff3ff" }}
              >
                <Download className="w-5 h-5" style={{ color: "#004aad" }} />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dff3ff" />
                <XAxis dataKey="month" tick={{ fill: "#000000" }} />
                <YAxis tick={{ fill: "#000000" }} />
                <Tooltip />
                <Line
                  key="average-line"
                  type="monotone"
                  dataKey="average"
                  stroke="#38b6ff"
                  strokeWidth={3}
                  dot={{ fill: "#004aad", r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade-Level Benchmarks */}
        <div
          className="rounded-2xl p-8 shadow-lg mb-8"
          style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
        >
          <h2 className="text-2xl mb-6" style={{ color: "#004aad" }}>
            {t("reports.benchmarks.title")}
          </h2>

          <div className="grid grid-cols-4 gap-6 mb-8">
            <div
              className="p-6 rounded-xl text-center"
              style={{ background: "#dff3ff", border: "2px solid #38b6ff" }}
            >
              <p className="text-sm mb-2" style={{ color: "#000000" }}>
                {t("reports.benchmarks.kindergartenEnd")}
              </p>
              <p className="text-3xl mb-1" style={{ color: "#004aad" }}>
                {gradeBenchmarks["Maternelle"].expected}
              </p>
              <p className="text-xs" style={{ color: "#000000", opacity: 0.7 }}>
                {t("reports.benchmarks.unitInProgress")}
              </p>
            </div>

            <div
              className="p-6 rounded-xl text-center"
              style={{ background: "#dff3ff", border: "2px solid #38b6ff" }}
            >
              <p className="text-sm mb-2" style={{ color: "#000000" }}>
                {t("reports.benchmarks.classroomEnd")}
              </p>
              <p className="text-3xl mb-1" style={{ color: "#004aad" }}>
                {gradeBenchmarks["Jardin"].expected}
              </p>
              <p className="text-xs" style={{ color: "#000000", opacity: 0.7 }}>
                {t("reports.benchmarks.unitComplete")}
              </p>
            </div>

            <div
              className="p-6 rounded-xl text-center"
              style={{ background: "#dff3ff", border: "2px solid #38b6ff" }}
            >
              <p className="text-sm mb-2" style={{ color: "#000000" }}>
                {t("reports.benchmarks.firstGradeEnd")}
              </p>
              <p className="text-3xl mb-1" style={{ color: "#004aad" }}>
                {gradeBenchmarks["1re année"].expected}
              </p>
              <p className="text-xs" style={{ color: "#000000", opacity: 0.7 }}>
                {t("reports.benchmarks.unitsRange")}
              </p>
            </div>

            <div
              className="p-6 rounded-xl text-center"
              style={{ background: "#dff3ff", border: "2px solid #38b6ff" }}
            >
              <p className="text-sm mb-2" style={{ color: "#000000" }}>
                {t("reports.benchmarks.secondGradeEnd")}
              </p>
              <p className="text-3xl mb-1" style={{ color: "#004aad" }}>
                {gradeBenchmarks["2e année"].expected}
              </p>
              <p className="text-xs" style={{ color: "#000000", opacity: 0.7 }}>
                {t("reports.benchmarks.allUnits")}
              </p>
            </div>
          </div>

          {/* Class Performance Against Benchmark */}
          {selectedClassId && selectedClass && (
            <div className="flex flex-col gap-6">
              <div
                className="rounded-xl"
                style={{
                  background: "#eff9ff",
                  border: "1px solid #38b6ff",
                }}
              >
                <div className="p-6">
                  <h3 className="text-lg mb-6" style={{ color: "#004aad" }}>
                    {t("reports.classPerformanceTitle")} - {selectedClass.grade}
                  </h3>
                  <div className="flex flex-col gap-6">
                    <div
                      className="grid grid-cols-3 gap-6 rounded-2xl p-6 shadow-lg"
                      style={{
                        background: "#ffffff",
                        border: "1px solid #dff3ff",
                      }}
                    >
                      <div className="text-center">
                        <p
                          className="text-3xl mb-2"
                          style={{ color: "#c9e265" }}
                        >
                          {getStudentLevelCounts(selectedClassId).onTrack}
                        </p>
                        <p className="text-sm" style={{ color: "#000000" }}>
                          {t("reports.classPerformanceDetails.onTrack")}
                        </p>
                      </div>
                      <div className="text-center">
                        <p
                          className="text-3xl mb-2"
                          style={{ color: "#ffde59" }}
                        >
                          {getStudentLevelCounts(selectedClassId).progressing}
                        </p>
                        <p className="text-sm" style={{ color: "#000000" }}>
                          {t("reports.classPerformanceDetails.progressing")}
                        </p>
                      </div>
                      <div className="text-center">
                        <p
                          className="text-3xl mb-2"
                          style={{ color: "#ff5757" }}
                        >
                          {
                            getStudentLevelCounts(selectedClassId)
                              .needingSupport
                          }
                        </p>
                        <p className="text-sm" style={{ color: "#000000" }}>
                          {t("reports.classPerformanceDetails.needingSupport")}
                        </p>
                      </div>
                    </div>
                    <hr className="text-red" />
                    <div className="grid grid-cols-3 gap-6">
                      {/* Distribution Chart */}
                      <div
                        className="rounded-2xl p-6 shadow-lg"
                        style={{
                          background: "#ffffff",
                          border: "1px solid #dff3ff",
                        }}
                      >
                        <h2
                          className="text-xl mb-6"
                          style={{ color: "#004aad" }}
                        >
                          {t("reports.distribution")}
                        </h2>
                        {calculateStudentDistribution(selectedClassId).some(
                          (item) => item.value > 0,
                        ) ? (
                          <>
                            <ResponsiveContainer width="100%" height={250}>
                              <PieChart>
                                <Pie
                                  key="distribution-pie"
                                  data={calculateStudentDistribution(
                                    selectedClassId,
                                  )}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={90}
                                  paddingAngle={5}
                                  dataKey="value"
                                >
                                  {calculateStudentDistribution(
                                    selectedClassId,
                                  ).map((entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={entry.color}
                                    />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-2 mt-4">
                              {calculateStudentDistribution(
                                selectedClassId,
                              ).map((item) => (
                                <div
                                  key={item.name}
                                  className="flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-4 h-4 rounded"
                                      style={{ background: item.color }}
                                    ></div>
                                    <span
                                      className="text-sm"
                                      style={{ color: "#000000" }}
                                    >
                                      {item.name}
                                    </span>
                                  </div>
                                  <span style={{ color: "#004aad" }}>
                                    {item.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <p
                            className="text-sm text-center"
                            style={{
                              color: "#6b7280",
                              paddingTop: "100px",
                              paddingBottom: "100px",
                            }}
                          >
                            No data available
                          </p>
                        )}
                      </div>

                      {/* Top Performers */}
                      <div
                        className="rounded-2xl p-6 shadow-lg"
                        style={{
                          background: "#ffffff",
                          border: "1px solid #dff3ff",
                        }}
                      >
                        <h2
                          className="text-xl mb-6"
                          style={{ color: "#004aad" }}
                        >
                          {t("reports.topPerformers")}
                        </h2>
                        <div className="space-y-4">
                          {getTopStudents(selectedClassId).length > 0 ? (
                            getTopStudents(selectedClassId).map(
                              (student, idx) => (
                                <div
                                  key={student.name}
                                  className="p-4 rounded-xl"
                                  style={{ background: "#dff3ff" }}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span style={{ color: "#004aad" }}>
                                      #{idx + 1}
                                    </span>
                                    <span
                                      className="px-3 py-1 rounded-lg text-sm"
                                      style={{
                                        background: "#c9e265",
                                        color: "#000000",
                                      }}
                                    >
                                      {student.score}%
                                    </span>
                                  </div>
                                  <p style={{ color: "#000000" }}>
                                    {student.name}
                                  </p>
                                  <p
                                    className="text-sm"
                                    style={{ color: "#000000", opacity: 0.7 }}
                                  >
                                    {student.evaluations}{" "}
                                    {t("reports.workshopsCompleted")}
                                  </p>
                                </div>
                              ),
                            )
                          ) : (
                            <p
                              className="text-sm text-center"
                              style={{
                                color: "#6b7280",
                                paddingTop: "100px",
                                paddingBottom: "100px",
                              }}
                            >
                              No data available
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Students Needing Support */}
                      <div
                        className="rounded-2xl p-6 shadow-lg"
                        style={{
                          background: "#ffffff",
                          border: "1px solid #dff3ff",
                        }}
                      >
                        <h2
                          className="text-xl mb-6"
                          style={{ color: "#004aad" }}
                        >
                          {t("reports.needingSupport")}
                        </h2>
                        <div className="space-y-4">
                          {getStudentsNeedingSupport(selectedClassId).length >
                          0 ? (
                            getStudentsNeedingSupport(selectedClassId).map(
                              (student) => (
                                <div
                                  key={student.name}
                                  className="p-4 rounded-xl"
                                  style={{ background: "#fff5f5" }}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span
                                      className="px-3 py-1 rounded-lg text-sm"
                                      style={{
                                        background: "#ff5757",
                                        color: "#ffffff",
                                      }}
                                    >
                                      {student.score}%
                                    </span>
                                  </div>
                                  <p style={{ color: "#000000" }}>
                                    {student.name}
                                  </p>
                                  <p
                                    className="text-sm"
                                    style={{ color: "#000000", opacity: 0.7 }}
                                  >
                                    {student.evaluations}{" "}
                                    {t("reports.workshopsCompleted")}
                                  </p>
                                </div>
                              ),
                            )
                          ) : (
                            <p
                              className="text-sm text-center"
                              style={{
                                color: "#6b7280",
                                paddingTop: "100px",
                                paddingBottom: "100px",
                              }}
                            >
                              No students needing support
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Individual Reporting Section */}
        <div className="mt-8">
          <div
            className="rounded-2xl p-6 shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <h2 className="text-xl mb-4" style={{ color: "#004aad" }}>
              {t("reports.studentReports")}
            </h2>
            <p className="text-sm mb-4" style={{ color: "#000000" }}>
              {t("reports.studentReportsDescription")}
            </p>
            <div className="grid grid-cols-4 gap-3">
              {students
                .filter(
                  (s) =>
                    selectedClassId && s.classIds.includes(selectedClassId),
                )
                .map((student) => (
                  <button
                    key={student.id}
                    onClick={() => {
                      navigate(
                        `/teacher/${teacherId}/class/${selectedClassId}/student/${student.id}`,
                      );
                    }}
                    className="px-4 py-3 rounded-xl transition-all text-left hover:shadow-md hover:bg-[#38b6ff] hover:text-white group cursor-pointer"
                    style={{
                      background: "#dff3ff",
                      border: "1px solid #38b6ff",
                      color: "#004aad",
                    }}
                  >
                    {student.name}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
