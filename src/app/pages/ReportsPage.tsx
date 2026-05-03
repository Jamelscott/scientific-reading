import { useTranslation } from "react-i18next";
import { NotificationDropdown } from "../components/NotificationDropdown";
import { Sidebar } from "../components/Sidebar";
import { Initials } from "../components/Initials";
import {
  BarChart3,
  PieChart,
  BookOpen,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useClassStore } from "../../stores";
import { useStudentStore } from "../../stores";
import { useEvaluationsStore } from "../../stores";
import { EvaluationButton } from "../components/ClassPage/EvaluationButton";
import {
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

export function ReportsPage() {
  const { t } = useTranslation();
  const classes = useClassStore((state) => state.classes);
  const students = useStudentStore((state) => state.students);
  const evaluations = useEvaluationsStore((state) => state.evaluations);

  // Calculate weighted average score and get status label
  // Weights: success = 3, adequate = 2, needs-improvement = 1
  const calculateAverageScore = () => {
    if (evaluations.length === 0)
      return { score: 0, label: "needsImprovement" };

    const weights = {
      success: 3,
      adequate: 2,
      "needs-improvement": 1,
    };

    let totalScore = 0;
    let totalEvaluations = 0;

    evaluations.forEach((evaluation) => {
      evaluation.evaluations.forEach((status) => {
        if (status && status !== null) {
          totalScore += weights[status as keyof typeof weights];
          totalEvaluations += 1;
        }
      });
    });

    const average = totalEvaluations > 0 ? totalScore / totalEvaluations : 0;

    let label: "success" | "adequate" | "needsImprovement" = "needsImprovement";
    if (average >= 2.5) {
      label = "success";
    } else if (average >= 1.5) {
      label = "adequate";
    }

    return {
      score: average.toFixed(2),
      label,
    };
  };

  // Calculate grade distribution percentages
  const calculateGradeDistribution = () => {
    if (evaluations.length === 0)
      return { good: 0, satisfactory: 0, failing: 0 };

    let goodCount = 0;
    let satisfactoryCount = 0;
    let failingCount = 0;
    let totalEvaluations = 0;

    evaluations.forEach((evaluation) => {
      evaluation.evaluations.forEach((status) => {
        if (status && status !== null) {
          if (status === "success") goodCount++;
          else if (status === "adequate") satisfactoryCount++;
          else failingCount++;
          totalEvaluations++;
        }
      });
    });

    return {
      good:
        totalEvaluations > 0
          ? ((goodCount / totalEvaluations) * 100).toFixed(1)
          : 0,
      satisfactory:
        totalEvaluations > 0
          ? ((satisfactoryCount / totalEvaluations) * 100).toFixed(1)
          : 0,
      failing:
        totalEvaluations > 0
          ? ((failingCount / totalEvaluations) * 100).toFixed(1)
          : 0,
    };
  };

  // Get unique student IDs
  const uniqueStudentCount = new Set(students.map((s) => s.id)).size;

  // Calculate student distribution by performance level
  const calculateStudentDistribution = () => {
    if (students.length === 0) return [];

    const weights = {
      success: 3,
      adequate: 2,
      "needs-improvement": 1,
    };

    let goodStudents = 0;
    let satisfactoryStudents = 0;
    let failingStudents = 0;

    // Calculate average score for each student
    students.forEach((student) => {
      const studentEvals = evaluations.filter(
        (e) => e.studentId === student.id,
      );
      let totalScore = 0;
      let totalCount = 0;

      studentEvals.forEach((evaluation) => {
        evaluation.evaluations.forEach((status) => {
          if (status && status !== null) {
            totalScore += weights[status as keyof typeof weights];
            totalCount++;
          }
        });
      });

      const average = totalCount > 0 ? totalScore / totalCount : 0;

      if (average >= 2.5) {
        goodStudents++;
      } else if (average >= 1.5) {
        satisfactoryStudents++;
      } else {
        failingStudents++;
      }
    });

    return [
      { name: "good", value: goodStudents, color: "#c9e265" },
      { name: "satisfactory", value: satisfactoryStudents, color: "#ffde59" },
      { name: "failing", value: failingStudents, color: "#ff5757" },
    ];
  };

  // Calculate average score by class
  const calculateClassPerformance = () => {
    const classPerformance: Record<
      number,
      {
        totalScore: number;
        total: number;
      }
    > = {};

    // Initialize counters for each class
    classes.forEach((cls) => {
      classPerformance[cls.id] = {
        totalScore: 0,
        total: 0,
      };
    });

    const weights = {
      success: 3,
      adequate: 2,
      "needs-improvement": 1,
    };

    // Count evaluations by class and calculate score
    evaluations.forEach((evaluation) => {
      const classId = evaluation.classId;
      if (classPerformance[classId]) {
        evaluation.evaluations.forEach((status) => {
          if (status && status !== null) {
            classPerformance[classId].totalScore +=
              weights[status as keyof typeof weights];
            classPerformance[classId].total++;
          }
        });
      }
    });

    // Convert to chart data
    return classes.map((cls) => {
      const performance = classPerformance[cls.id];
      const average =
        performance.total > 0 ? performance.totalScore / performance.total : 0;

      return {
        fullName: cls.name,
        name:
          cls.name.length > 15 ? cls.name.substring(0, 8) + "..." : cls.name,
        score: parseFloat(average.toFixed(2)),
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
            className="p-8 rounded-2xl shadow-lg flex flex-col"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6" style={{ color: "#004aad" }} />
              <h2
                className="text-xl font-semibold"
                style={{ color: "#004aad" }}
              >
                {t("reports.classPerformance")}
              </h2>
            </div>
            <div
              className="rounded-xl p-6 flex flex-col items-start"
              style={{
                background: "#f0f9ff",
                height: "450px",
                paddingRight: "100px",
              }}
            >
              {calculateClassPerformance().length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={calculateClassPerformance()}
                    layout="vertical"
                    barSize={20}
                    barCategoryGap="1%"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#dff3ff" />
                    <XAxis type="number" domain={[0, 3]} stroke="#004aad" />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="#004aad"
                      width={90}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#ffffff",
                        border: "1px solid #dff3ff",
                        borderRadius: "8px",
                        padding: "4px 8px",
                      }}
                      formatter={(value: number) => value.toFixed(2)}
                      labelFormatter={(label: string) => {
                        const data = calculateClassPerformance();
                        const item = data.find((d) => d.name === label);
                        return item?.fullName || label;
                      }}
                      cursor={{ fill: "rgba(0, 74, 173, 0.05)" }}
                    />
                    <Bar dataKey="score" name="Average Score">
                      {calculateClassPerformance().map((entry, index) => {
                        let color = "#ff5757"; // needs-improvement (< 1.5)
                        if (entry.score >= 2.5) {
                          color = "#c9e265"; // success
                        } else if (entry.score >= 1.5) {
                          color = "#ffde59"; // adequate
                        }
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p style={{ color: "#6b7280" }}>
                    {t("reports.chartPlaceholder")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Student Progress Report */}
          <div
            className="p-8 rounded-2xl shadow-lg flex flex-col"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <PieChart className="w-6 h-6" style={{ color: "#004aad" }} />
              <h2
                className="text-xl font-semibold"
                style={{ color: "#004aad" }}
              >
                {t("reports.studentProgress")}
              </h2>
            </div>
            <div
              className="rounded-xl p-6 flex"
              style={{
                background: "#f0f9ff",
                height: "400px",
                gap: "12px",
                flex: 1,
              }}
            >
              {calculateStudentDistribution().some((item) => item.value > 0) ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minWidth: "300px",
                    }}
                  >
                    <ResponsiveContainer width="100%" height={350}>
                      <RechartsPieChart>
                        <Pie
                          data={calculateStudentDistribution()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          innerRadius={60}
                          outerRadius={110}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {calculateStudentDistribution().map(
                            (entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ),
                          )}
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
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: "16px",
                    }}
                  >
                    {calculateStudentDistribution().map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div
                          style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "4px",
                            backgroundColor: item.color,
                          }}
                        />
                        <div>
                          <p style={{ color: "#004aad", fontWeight: "500" }}>
                            {t(`reports.legend.${item.name}`)}
                          </p>
                          <p style={{ color: "#6b7280", fontSize: "14px" }}>
                            {item.value} student{item.value !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full w-full">
                  <p style={{ color: "#6b7280" }}>
                    {t("reports.chartPlaceholder")}
                  </p>
                </div>
              )}
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
              {calculateAverageScore().score}
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
