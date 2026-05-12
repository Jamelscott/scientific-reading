import { useTranslation } from "react-i18next";
import { useClassStore } from "../../../stores/useClassStore";
import { useStudentStore } from "../../../stores/useStudentStore";
import { useUnitsStore } from "../../../stores/useUnitsStore";
import { Initials } from "../../components/Initials";
import { NotificationDropdown } from "../../components/NotificationDropdown";
import { Sidebar } from "../../components/Sidebar";
import {
  BookOpen,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

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
} from "recharts";

export function ReportsPage() {
  const { t } = useTranslation();
  const classes = useClassStore((state) => state.classes);
  const students = useStudentStore((state) => state.students);
  const evaluations = useUnitsStore((state) => state.evaluations);

  // Calculate average score (0-100)
  const calculateAverageScore = () => {
    let total = 0;
    let count = 0;
    evaluations.forEach((evaluation) => {
      evaluation.responses.forEach((score) => {
        if (score !== null) {
          total += score;
          count++;
        }
      });
    });
    const avg = count > 0 ? total / count : 0;
    let label: "success" | "adequate" | "needsImprovement" = "needsImprovement";
    if (avg >= 75) label = "success";
    else if (avg >= 50) label = "adequate";
    return { score: avg.toFixed(1), label };
  };

  // Calculate grade distribution percentages
  const calculateGradeDistribution = () => {
    let goodCount = 0;
    let satisfactoryCount = 0;
    let failingCount = 0;
    let total = 0;
    evaluations.forEach((evaluation) => {
      evaluation.evaluations.forEach((score) => {
        if (score !== null) {
          if (score >= 75) goodCount++;
          else if (score >= 50) satisfactoryCount++;
          else failingCount++;
          total++;
        }
      });
    });
    return {
      good: total > 0 ? ((goodCount / total) * 100).toFixed(1) : 0,
      satisfactory:
        total > 0 ? ((satisfactoryCount / total) * 100).toFixed(1) : 0,
      failing: total > 0 ? ((failingCount / total) * 100).toFixed(1) : 0,
    };
  };

  // Get unique student IDs
  const uniqueStudentCount = new Set(students.map((s) => s.id)).size;

  // Calculate student distribution by performance level
  const calculateStudentDistribution = () => {
    let goodStudents = 0;
    let satisfactoryStudents = 0;
    let failingStudents = 0;

    students.forEach((student) => {
      const studentEvals = evaluations.filter(
        (e) => e.studentId === student.id,
      );
      let total = 0;
      let count = 0;
      studentEvals.forEach((evaluation) => {
        evaluation.evaluations.forEach((score) => {
          if (score !== null) {
            total += score;
            count++;
          }
        });
      });
      const avg = count > 0 ? total / count : 0;
      if (avg >= 75) goodStudents++;
      else if (avg >= 50) satisfactoryStudents++;
      else failingStudents++;
    });

    return [
      { name: "success", value: goodStudents, color: "#c9e265" },
      { name: "adequate", value: satisfactoryStudents, color: "#ffde59" },
      { name: "needsImprovement", value: failingStudents, color: "#ff5757" },
    ];
  };

  // Calculate average score by class
  const calculateClassPerformance = () => {
    const classPerformance: Record<number, { total: number; count: number }> =
      {};
    classes.forEach((cls) => {
      classPerformance[cls.id] = { total: 0, count: 0 };
    });

    evaluations.forEach((evaluation) => {
      const classId = evaluation.classId;
      if (classPerformance[classId]) {
        evaluation.evaluations.forEach((score) => {
          if (score !== null) {
            classPerformance[classId].total += score;
            classPerformance[classId].count++;
          }
        });
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
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <Initials size="sm" />
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
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
              {uniqueStudentCount}
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
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Class Performance Report */}
          <div
            className="rounded-2xl p-6 shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <h2 className="text-xl mb-6" style={{ color: "#004aad" }}>
              {t("reports.classPerformance")}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              {calculateClassPerformance().length > 0 ? (
                <BarChart data={calculateClassPerformance()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dff3ff" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#000000", fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fill: "#000000" }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      background: "#ffffff",
                      border: "1px solid #dff3ff",
                      borderRadius: "8px",
                      padding: "4px 8px",
                    }}
                    formatter={(value: number) => `${value}`}
                    labelFormatter={(label: string) => {
                      const data = calculateClassPerformance();
                      const item = data.find((d) => d.name === label);
                      return item?.fullName || label;
                    }}
                  />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                    {calculateClassPerformance().map((entry, index) => {
                      let color = "#ff5757";
                      if (entry.score >= 75) color = "#c9e265";
                      else if (entry.score >= 50) color = "#ffde59";
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              ) : (
                <BarChart data={[]}>
                  <text x="50%" y="50%" textAnchor="middle" fill="#6b7280">
                    {t("reports.chartPlaceholder")}
                  </text>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Student Progress Report */}
          <div
            className="rounded-2xl p-6 shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <h2 className="text-xl mb-6" style={{ color: "#004aad" }}>
              {t("reports.studentProgress")}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={calculateStudentDistribution()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {calculateStudentDistribution().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid #dff3ff",
                    borderRadius: "8px",
                    padding: "4px 8px",
                  }}
                  formatter={(value: number) =>
                    `${value} student${value !== 1 ? "s" : ""}`
                  }
                />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              {calculateStudentDistribution().map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ background: item.color }}
                  />
                  <span style={{ color: "#000000" }}>
                    {t(`reports.legend.${item.name}`)} ({item.value})
                  </span>
                </div>
              ))}
            </div>
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
              {students.length}
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
