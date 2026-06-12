import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Users,
  Download,
  Calendar,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import { Sidebar } from "../../components/Sidebar";
import { NotificationDropdown } from "../../components/NotificationDropdown";
import { useStudentsByClass } from "../../../hooks/useApi";
import { useUnitsStore, computeScore } from "../../../stores/useUnitsStore";
import { useAuthStore } from "../../../stores/useAuthStore";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useTranslation } from "react-i18next";

export function EvaluationPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState("2025-2026");
  const { classId } = useParams<{ classId: string }>();

  const { data: students = [] } = useStudentsByClass(Number(classId));
  const { evaluations } = useUnitsStore();
  const currentUser = useAuthStore((state) => state.currentUser);

  // Filter evaluations for current class
  const classEvaluations = useMemo(() => {
    return evaluations.filter((e) =>
      students.some((s) => s.id === e.studentId),
    );
  }, [evaluations, students]);

  // Calculate student averages and stats
  const studentStats = useMemo(() => {
    return students.map((student) => {
      const studentEvals = classEvaluations.filter(
        (e) => e.studentId === student.id,
      );
      if (!studentEvals.length) return { ...student, average: 0, count: 0 };

      const totalScore = studentEvals.reduce(
        (sum, e) => sum + computeScore(e),
        0,
      );
      const average = Math.round((totalScore / studentEvals.length) * 100);

      return {
        ...student,
        average,
        count: studentEvals.length,
      };
    });
  }, [students, classEvaluations, computeScore]);

  // Calculate overall stats
  const totalStudents = students.length;
  const studentsWithData = studentStats.filter((s) => s.count > 0);
  const successRate =
    studentsWithData.length > 0
      ? Math.round(
          studentsWithData.reduce((sum, s) => sum + s.average, 0) /
            studentsWithData.length,
        )
      : 0;
  const totalWorkshops = classEvaluations.length;
  const studentsAtRisk = studentsWithData.filter((s) => s.average < 60).length;

  // Distribution data for pie chart
  const distributionData = useMemo(() => {
    const success = studentsWithData.filter((s) => s.average >= 80).length;
    const adequate = studentsWithData.filter(
      (s) => s.average >= 60 && s.average < 80,
    ).length;
    const atRisk = studentsWithData.filter((s) => s.average < 60).length;
    const total = studentsWithData.length || 1;

    return [
      {
        name: t("reports.legend.success"),
        value: Math.round((success / total) * 100),
        color: "#c9e265",
      },
      {
        name: t("reports.legend.adequate"),
        value: Math.round((adequate / total) * 100),
        color: "#ffde59",
      },
      {
        name: t("reports.legend.needsImprovement"),
        value: Math.round((atRisk / total) * 100),
        color: "#ff5757",
      },
    ];
  }, [studentsWithData, t]);

  // Performance by evaluation range
  const classPerformanceData = useMemo(() => {
    const ranges = [
      { name: t("reports.workshops1to9"), min: 1, max: 9 },
      { name: t("reports.workshops10to18"), min: 10, max: 18 },
      { name: t("reports.workshops19to27"), min: 19, max: 27 },
    ];

    return ranges.map((range) => {
      const rangeData = {
        name: range.name,
        success: 0,
        adequate: 0,
        atRisk: 0,
      };

      students.forEach((student) => {
        const rangeEvals = classEvaluations.filter(
          (e) =>
            e.studentId === student.id &&
            e.evaluationTemplateId >= range.min &&
            e.evaluationTemplateId <= range.max,
        );

        if (rangeEvals.length > 0) {
          const avgScore =
            rangeEvals.reduce((sum, e) => sum + computeScore(e), 0) /
            rangeEvals.length;
          const avgPercent = avgScore * 100;

          if (avgPercent >= 80) rangeData.success++;
          else if (avgPercent >= 60) rangeData.adequate++;
          else rangeData.atRisk++;
        }
      });

      return rangeData;
    });
  }, [students, classEvaluations, computeScore, t]);

  // Progress over time (by evaluation template ID ranges)
  const progressOverTime = useMemo(() => {
    const months = [
      { month: "Sept", min: 1, max: 5 },
      { month: "Oct", min: 6, max: 10 },
      { month: "Nov", min: 11, max: 15 },
      { month: "Dec", min: 16, max: 20 },
      { month: "Jan", min: 21, max: 25 },
      { month: "Fév", min: 26, max: 27 },
    ];

    return months
      .map((period) => {
        const periodEvals = classEvaluations.filter(
          (e) =>
            e.evaluationTemplateId >= period.min &&
            e.evaluationTemplateId <= period.max,
        );

        if (periodEvals.length === 0)
          return { month: period.month, average: 0 };

        const avgScore =
          periodEvals.reduce((sum, e) => sum + computeScore(e), 0) /
          periodEvals.length;
        return { month: period.month, average: Math.round(avgScore * 100) };
      })
      .filter((p) => p.average > 0);
  }, [classEvaluations, computeScore]);

  // Top students
  const topStudents = useMemo(() => {
    return [...studentsWithData]
      .sort((a, b) => b.average - a.average)
      .slice(0, 3)
      .map((s) => ({
        name: s.name,
        score: s.average,
        evaluations: s.count,
      }));
  }, [studentsWithData]);

  // Students needing support
  const studentsNeedingSupport = useMemo(() => {
    return studentsWithData
      .filter((s) => s.average < 60)
      .sort((a, b) => a.average - b.average)
      .map((s) => ({
        name: s.name,
        score: s.average,
        evaluations: s.count,
      }));
  }, [studentsWithData]);

  // Get user initials
  const userInitials = useMemo(() => {
    if (!currentUser?.name) return "";
    return currentUser.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [currentUser]);
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
              {t("reports.title")}
            </h1>
            <p className="text-lg" style={{ color: "#000000" }}>
              {t("reports.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-6 py-3 rounded-xl appearance-none pr-12"
                style={{
                  background: "#ffffff",
                  border: "1px solid #dff3ff",
                  color: "#004aad",
                }}
              >
                <option value="2025-2026">2025-2026</option>
                <option value="2024-2025">2024-2025</option>
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                style={{ color: "#004aad" }}
              />
            </div>
            <NotificationDropdown />
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "#38b6ff", color: "#ffffff" }}
            >
              {userInitials}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div
            className="rounded-2xl p-6 shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "#dff3ff" }}
              >
                <Users className="w-6 h-6" style={{ color: "#004aad" }} />
              </div>
            </div>
            <p className="text-sm mb-2" style={{ color: "#000000" }}>
              {t("reports.totalStudents")}
            </p>
            <p className="text-3xl" style={{ color: "#004aad" }}>
              {totalStudents}
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
                <TrendingUp className="w-6 h-6" style={{ color: "#000000" }} />
              </div>
            </div>
            <p className="text-sm mb-2" style={{ color: "#000000" }}>
              {t("reports.successRate")}
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
                style={{ background: "#ffde59" }}
              >
                <Calendar className="w-6 h-6" style={{ color: "#000000" }} />
              </div>
            </div>
            <p className="text-sm mb-2" style={{ color: "#000000" }}>
              {t("reports.workshopsCompleted")}
            </p>
            <p className="text-3xl" style={{ color: "#004aad" }}>
              {totalWorkshops}
            </p>
          </div>

          <div
            className="rounded-2xl p-6 shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "#ff5757" }}
              >
                <Users className="w-6 h-6" style={{ color: "#ffffff" }} />
              </div>
            </div>
            <p className="text-sm mb-2" style={{ color: "#000000" }}>
              {t("reports.studentsAtRisk")}
            </p>
            <p className="text-3xl" style={{ color: "#004aad" }}>
              {studentsAtRisk}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Performance by Evaluation Range */}
          <div
            className="rounded-2xl p-6 shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl" style={{ color: "#004aad" }}>
                {t("reports.performanceByRange")}
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
            {t("reports.gradeLevelBenchmarks")}
          </h2>

          <div className="grid grid-cols-4 gap-6 mb-8">
            <div
              className="p-6 rounded-xl text-center"
              style={{ background: "#dff3ff", border: "2px solid #38b6ff" }}
            >
              <p className="text-sm mb-2" style={{ color: "#000000" }}>
                {t("reports.endOfKindergarten")}
              </p>
              <p className="text-3xl mb-1" style={{ color: "#004aad" }}>
                2
              </p>
              <p className="text-xs" style={{ color: "#000000", opacity: 0.7 }}>
                {t("reports.workshops1to2")}
              </p>
            </div>

            <div
              className="p-6 rounded-xl text-center"
              style={{ background: "#dff3ff", border: "2px solid #38b6ff" }}
            >
              <p className="text-sm mb-2" style={{ color: "#000000" }}>
                {t("reports.endOfPreK")}
              </p>
              <p className="text-3xl mb-1" style={{ color: "#004aad" }}>
                17
              </p>
              <p className="text-xs" style={{ color: "#000000", opacity: 0.7 }}>
                {t("reports.foundationsComplete")}
              </p>
            </div>

            <div
              className="p-6 rounded-xl text-center"
              style={{ background: "#dff3ff", border: "2px solid #38b6ff" }}
            >
              <p className="text-sm mb-2" style={{ color: "#000000" }}>
                {t("reports.endOfGrade1")}
              </p>
              <p className="text-3xl mb-1" style={{ color: "#004aad" }}>
                22
              </p>
              <p className="text-xs" style={{ color: "#000000", opacity: 0.7 }}>
                {t("reports.decodingInProgress")}
              </p>
            </div>

            <div
              className="p-6 rounded-xl text-center"
              style={{ background: "#dff3ff", border: "2px solid #38b6ff" }}
            >
              <p className="text-sm mb-2" style={{ color: "#000000" }}>
                {t("reports.endOfGrade2")}
              </p>
              <p className="text-3xl mb-1" style={{ color: "#004aad" }}>
                27
              </p>
              <p className="text-xs" style={{ color: "#000000", opacity: 0.7 }}>
                {t("reports.fullMastery")}
              </p>
            </div>
          </div>

          {/* Class Performance Against Benchmark */}
          <div
            className="p-6 rounded-xl"
            style={{ background: "#f7ffd6", border: "1px solid #c9e265" }}
          >
            <h3 className="text-lg mb-4" style={{ color: "#004aad" }}>
              {t("reports.classPerformance")}
            </h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl mb-2" style={{ color: "#c9e265" }}>
                  {studentsWithData.filter((s) => s.average >= 80).length}
                </p>
                <p className="text-sm" style={{ color: "#000000" }}>
                  {t("reports.studentsOnTrack")}
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl mb-2" style={{ color: "#ffde59" }}>
                  {
                    studentsWithData.filter(
                      (s) => s.average >= 60 && s.average < 80,
                    ).length
                  }
                </p>
                <p className="text-sm" style={{ color: "#000000" }}>
                  {t("reports.studentsProgressing")}
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl mb-2" style={{ color: "#ff5757" }}>
                  {studentsAtRisk}
                </p>
                <p className="text-sm" style={{ color: "#000000" }}>
                  {t("reports.studentsNeedingSupport")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Distribution and Student Lists */}
        <div className="grid grid-cols-3 gap-6">
          {/* Distribution Chart */}
          <div
            className="rounded-2xl p-6 shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <h2 className="text-xl mb-6" style={{ color: "#004aad" }}>
              {t("reports.classDistribution")}
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {distributionData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ background: item.color }}
                    ></div>
                    <span className="text-sm" style={{ color: "#000000" }}>
                      {item.name}
                    </span>
                  </div>
                  <span style={{ color: "#004aad" }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div
            className="rounded-2xl p-6 shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <h2 className="text-xl mb-6" style={{ color: "#004aad" }}>
              {t("reports.topPerformers")}
            </h2>
            <div className="space-y-4">
              {topStudents.map((student, idx) => (
                <div
                  key={student.name}
                  className="p-4 rounded-xl"
                  style={{ background: "#dff3ff" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ color: "#004aad" }}>#{idx + 1}</span>
                    <span
                      className="px-3 py-1 rounded-lg text-sm"
                      style={{ background: "#c9e265", color: "#000000" }}
                    >
                      {student.score}%
                    </span>
                  </div>
                  <p style={{ color: "#000000" }}>{student.name}</p>
                  <p
                    className="text-sm"
                    style={{ color: "#000000", opacity: 0.7 }}
                  >
                    {student.evaluations} ateliers complétés
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Students Needing Support */}
          <div
            className="rounded-2xl p-6 shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <h2 className="text-xl mb-6" style={{ color: "#004aad" }}>
              {t("reports.studentsNeedingSupport")}
            </h2>
            <div className="space-y-4">
              {studentsNeedingSupport.map((student) => (
                <div
                  key={student.name}
                  className="p-4 rounded-xl"
                  style={{ background: "#fff5f5" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="px-3 py-1 rounded-lg text-sm"
                      style={{ background: "#ff5757", color: "#ffffff" }}
                    >
                      {student.score}%
                    </span>
                  </div>
                  <p style={{ color: "#000000" }}>{student.name}</p>
                  <p
                    className="text-sm"
                    style={{ color: "#000000", opacity: 0.7 }}
                  >
                    {t("reports.workshopsCount", {
                      count: student.evaluations,
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Individual Reporting Section */}
        <div className="mt-8">
          <div
            className="rounded-2xl p-6 shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <h2 className="text-xl mb-4" style={{ color: "#004aad" }}>
              {t("reports.individualReports")}
            </h2>
            <p className="text-sm mb-4" style={{ color: "#000000" }}>
              {t("reports.viewDetailedReport")}
            </p>
            <div className="grid grid-cols-4 gap-3">
              {students.map((student) => (
                <button
                  key={student.id}
                  onClick={() => navigate(`/student/${student.id}`)}
                  className="px-4 py-3 rounded-xl transition-all text-left hover:shadow-md"
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

        {/* Export Section */}
        <div className="mt-8">
          <div
            className="rounded-2xl p-6 shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <h2 className="text-xl mb-4" style={{ color: "#004aad" }}>
              {t("reports.exportReports")}
            </h2>
            <div className="flex gap-4">
              <button
                className="px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
                style={{
                  background: "#004aad",
                  color: "#ffffff",
                }}
              >
                <Download className="w-5 h-5" />
                {t("reports.fullReportPDF")}
              </button>
              <button
                className="px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
                style={{
                  background: "#ffffff",
                  border: "1px solid #dff3ff",
                  color: "#004aad",
                }}
              >
                <Download className="w-5 h-5" />
                {t("reports.dataExcel")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
