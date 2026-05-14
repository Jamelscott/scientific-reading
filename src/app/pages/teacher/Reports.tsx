import { useTranslation } from "react-i18next";
import { useClassStore } from "../../../stores/useClassStore";
import { useStudentStore } from "../../../stores/useStudentStore";
import { useUnitsStore } from "../../../stores/useUnitsStore";
import { Initials } from "../../components/Initials";
import { NotificationDropdown } from "../../components/NotificationDropdown";
import { Sidebar } from "../../components/Sidebar";
import getScoreFromEvaluations from "../../utils/getScoreFromEvaluations";
import {
  BookOpen,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  LineChart as LineChartIcon,
  Download,
} from "lucide-react";
import { useState } from "react";

import {
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Line,
  LineChart,
} from "recharts";

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
  const classes = useClassStore((state) => state.classes);
  const students = useStudentStore((state) => state.students);
  const getAllAnswers = useUnitsStore((state) => state.getAllAnswers);
  const unitsData = useUnitsStore((state) => state.getUnitsData);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(
    classes.length > 0 ? classes[0].id : null,
  );

  // Calculate average score (0-100)
  const calculateAverageScore = () => {
    const classAnswers = getAllAnswers.filter(
      (answer) => answer.classId === selectedClassId,
    );

    if (classAnswers.length === 0)
      return { score: "0.0", label: "needs-improvement" as const };

    let total = 0;
    let count = 0;
    classAnswers.forEach((answer) => {
      const status = getScoreFromEvaluations(answer.answers);
      if (status) {
        total += scoreStatusToNumber(status);
        count++;
      }
    });
    const avg = count > 0 ? total / count : 0;
    let label: "success" | "adequate" | "needs-improvement" =
      "needs-improvement";
    if (avg >= 85) label = "success";
    else if (avg >= 70) label = "adequate";
    return { score: avg.toFixed(1), label };
  };

  // Calculate grade distribution percentages
  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const classStudentCount = selectedClass?.studentIds?.length || 0;

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
          ? ((successCount / submittedCount) * 100).toFixed(1)
          : "0",
      satisfactory:
        submittedCount > 0
          ? ((adequateCount / submittedCount) * 100).toFixed(1)
          : "0",
      failing:
        submittedCount > 0
          ? ((needsImprovementCount / submittedCount) * 100).toFixed(1)
          : "0",
      notSubmitted:
        expectedTotal > 0
          ? ((notSubmittedCount / expectedTotal) * 100).toFixed(1)
          : "0",
    };
  };

  const calculateStudentDistribution = () => {
    let successStudents = 0;
    let adequateStudents = 0;
    let needsImprovementStudents = 0;

    // Get students in the selected class
    const classStudentIds = new Set(selectedClass?.studentIds || []);

    if (classStudentIds.size === 0) {
      return [
        { name: "success", value: 0, color: "#c9e265" },
        { name: "adequate", value: 0, color: "#ffde59" },
        { name: "needs-improvement", value: 0, color: "#ff5757" },
      ];
    }

    // Calculate average progress for each student in the selected class
    classStudentIds.forEach((studentId) => {
      const studentAnswers = getAllAnswers.filter(
        (a) => a.studentId === studentId && a.classId === selectedClassId,
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
      { name: "success", value: successStudents, color: "#c9e265" },
      { name: "adequate", value: adequateStudents, color: "#ffde59" },
      {
        name: "needs-improvement",
        value: needsImprovementStudents,
        color: "#ff5757",
      },
    ];
  };

  // Calculate average score by class
  const calculateClassPerformance = () => {
    const classPerformance: Record<number, { total: number; count: number }> =
      {};
    classes.forEach((cls) => {
      classPerformance[cls.id] = { total: 0, count: 0 };
    });

    getAllAnswers.forEach((answer) => {
      const classId = answer.classId;
      if (classPerformance[classId]) {
        const status = getScoreFromEvaluations(answer.answers);
        if (status) {
          classPerformance[classId].total += scoreStatusToNumber(status);
          classPerformance[classId].count++;
        }
      }
    });

    return classes.map((cls) => {
      const { total, count } = classPerformance[cls.id];
      const avg = count > 0 ? total / count : 0;
      return {
        fullName: cls.name,
        name:
          cls.name.length > 15 ? cls.name.substring(0, 8) + "..." : cls.name,
        score: parseFloat(avg.toFixed(1)),
      };
    });
  };

  // Build classPerformanceData: counts students by class and their evaluation status
  const buildClassPerformanceData = () => {
    interface ClassPerf {
      name: string;
      success: number;
      adequate: number;
      atRisk: number;
    }
    const classPerfMap: Record<number, ClassPerf> = {};

    // Initialize each class
    classes.forEach((cls) => {
      classPerfMap[cls.id] = {
        name: cls.name,
        success: 0,
        adequate: 0,
        atRisk: 0,
      };
    });

    // Group students by class and count their statuses
    const studentStatusByClass: Record<
      number,
      Record<number, string | null>
    > = {};

    classes.forEach((cls) => {
      studentStatusByClass[cls.id] = {};
      (cls.studentIds || []).forEach((studentId) => {
        const studentAnswers = getAllAnswers.filter(
          (a) => a.studentId === studentId && a.classId === cls.id,
        );

        if (studentAnswers.length === 0) {
          studentStatusByClass[cls.id][studentId] = null;
          return;
        }

        let total = 0;
        let count = 0;
        studentAnswers.forEach((answer) => {
          const status = getScoreFromEvaluations(answer.answers);
          if (status) {
            total += scoreStatusToNumber(status);
            count++;
          }
        });

        if (count === 0) {
          studentStatusByClass[cls.id][studentId] = null;
          return;
        }

        const avg = total / count;
        if (avg >= 85) {
          studentStatusByClass[cls.id][studentId] = "success";
        } else if (avg >= 70) {
          studentStatusByClass[cls.id][studentId] = "adequate";
        } else {
          studentStatusByClass[cls.id][studentId] = "atRisk";
        }
      });
    });

    // Count statuses for each class
    classes.forEach((cls) => {
      const statusMap = studentStatusByClass[cls.id];
      Object.values(statusMap).forEach((status) => {
        if (status === "success") classPerfMap[cls.id].success++;
        else if (status === "adequate") classPerfMap[cls.id].adequate++;
        else if (status === "atRisk") classPerfMap[cls.id].atRisk++;
      });
    });

    return Object.values(classPerfMap);
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
            <div className="mt-4">
              <label className="text-sm mr-2" style={{ color: "#6b7280" }}>
                {t("reports.selectClass")}
              </label>
              <select
                value={selectedClassId ?? ""}
                onChange={(e) =>
                  setSelectedClassId(
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
                className="border px-2 py-1 rounded"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
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

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Class Performance Report */}
          <div
            className="rounded-2xl p-6 shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl" style={{ color: "#004aad" }}>
                Performance par plage d'ateliers
              </h2>
              <button
                className="p-2 rounded-xl transition-all"
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
                <Bar
                  key="success-bar"
                  dataKey="success"
                  stackId="a"
                  fill="#c9e265"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  key="adequate-bar"
                  dataKey="adequate"
                  stackId="a"
                  fill="#ffde59"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  key="atRisk-bar"
                  dataKey="atRisk"
                  stackId="a"
                  fill="#ff5757"
                  radius={[8, 8, 0, 0]}
                />
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
                Progression moyenne au fil du temps
              </h2>
              <button
                className="p-2 rounded-xl transition-all"
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

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Students */}
          <div
            className="p-6 rounded-2xl shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <p style={{ color: "#6b7280" }} className="text-sm mb-2">
              {t("reports.totalStudents")}
            </p>
            <p className="text-3xl font-semibold" style={{ color: "#004aad" }}>
              {classStudentCount}
            </p>
          </div>

          {/* Average Score */}
          <div
            className="p-6 rounded-2xl shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <p style={{ color: "#6b7280" }} className="text-sm mb-2">
              {t("reports.averageScore")}
            </p>
            <p className="text-3xl font-semibold" style={{ color: "#004aad" }}>
              {calculateAverageScore().score} / 100
            </p>
            <p style={{ color: "#6b7280" }} className="text-xs mt-2">
              {t(`reports.legend.${calculateAverageScore().label}`)}
            </p>
          </div>

          {/* Classes */}
          <div
            className="p-6 rounded-2xl shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <p style={{ color: "#6b7280" }} className="text-sm mb-2">
              {t("reports.classes")}
            </p>
            <p className="text-3xl font-semibold" style={{ color: "#004aad" }}>
              {classes.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
