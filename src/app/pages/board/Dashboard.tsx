import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BarChart3,
  ChevronDown,
  School,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Sidebar } from "../../components/Sidebar";

const schoolData = [
  { name: "École Laurier", rate: 78 },
  { name: "École Saint-Jean", rate: 82 },
  { name: "École des Pins", rate: 75 },
  { name: "École Montcalm", rate: 85 },
  { name: "École Riverside", rate: 80 },
];

const performanceKeys = [
  {
    key: "schoolBoard.dashboard.performance.success",
    value: 68,
    color: "#c9e265",
  },
  {
    key: "schoolBoard.dashboard.performance.adequate",
    value: 22,
    color: "#ffde59",
  },
  {
    key: "schoolBoard.dashboard.performance.failure",
    value: 10,
    color: "#ff5757",
  },
];

export function BoardDashboard() {
  const { t } = useTranslation();
  const [selectedYear, setSelectedYear] = useState("2023-2024");

  const performanceData = performanceKeys.map((item) => ({
    ...item,
    name: t(item.key),
  }));

  return (
    <div
      className="h-screen flex overflow-hidden"
      style={{ background: "#dff3ff" }}
    >
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-12 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl" style={{ color: "#004aad" }}>
            {t("schoolBoard.dashboard.title")}
          </h1>
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-6 py-3 rounded-xl appearance-none pr-12"
              style={{
                background: "#ffffff",
                border: "1px solid #dff3ff",
                color: "#004aad",
              }}
            >
              <option value="2023-2024">
                2023-2024 {t("schoolBoard.dashboard.schoolYear")}
              </option>
              <option value="2022-2023">
                2022-2023 {t("schoolBoard.dashboard.schoolYear")}
              </option>
              <option value="2021-2022">
                2021-2022 {t("schoolBoard.dashboard.schoolYear")}
              </option>
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
              style={{ color: "#004aad" }}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-6 mb-8">
          <div
            className="rounded-2xl p-6 shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "#dff3ff" }}
            >
              <School className="w-6 h-6" style={{ color: "#004aad" }} />
            </div>
            <p className="text-sm mb-2" style={{ color: "#000000" }}>
              {t("schoolBoard.dashboard.numberOfSchools")}
            </p>
            <p className="text-3xl" style={{ color: "#004aad" }}>
              25
            </p>
          </div>

          <div
            className="rounded-2xl p-6 shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "#dff3ff" }}
            >
              <Users className="w-6 h-6" style={{ color: "#004aad" }} />
            </div>
            <p className="text-sm mb-2" style={{ color: "#000000" }}>
              {t("schoolBoard.dashboard.numberOfStudents")}
            </p>
            <p className="text-3xl" style={{ color: "#004aad" }}>
              3,245
            </p>
          </div>

          <div
            className="rounded-2xl p-6 shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "#c9e265" }}
            >
              <TrendingUp className="w-6 h-6" style={{ color: "#000000" }} />
            </div>
            <p className="text-sm mb-2" style={{ color: "#000000" }}>
              {t("schoolBoard.dashboard.successPercent")}
            </p>
            <p className="text-3xl" style={{ color: "#004aad" }}>
              68%
            </p>
          </div>

          <div
            className="rounded-2xl p-6 shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "#ffde59" }}
            >
              <BarChart3 className="w-6 h-6" style={{ color: "#000000" }} />
            </div>
            <p className="text-sm mb-2" style={{ color: "#000000" }}>
              {t("schoolBoard.dashboard.adequatePercent")}
            </p>
            <p className="text-3xl" style={{ color: "#004aad" }}>
              22%
            </p>
          </div>

          <div
            className="rounded-2xl p-6 shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "#ff5757" }}
            >
              <TrendingUp className="w-6 h-6" style={{ color: "#ffffff" }} />
            </div>
            <p className="text-sm mb-2" style={{ color: "#000000" }}>
              {t("schoolBoard.dashboard.failurePercent")}
            </p>
            <p className="text-3xl" style={{ color: "#004aad" }}>
              10%
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Bar Chart */}
          <div
            className="rounded-2xl p-6 shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <h2 className="text-xl mb-6" style={{ color: "#004aad" }}>
              {t("schoolBoard.dashboard.avgSuccessRateBySchool")}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={schoolData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dff3ff" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#000000", fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fill: "#000000" }} />
                <Tooltip />
                <Bar dataKey="rate" fill="#38b6ff" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div
            className="rounded-2xl p-6 shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <h2 className="text-xl mb-6" style={{ color: "#004aad" }}>
              {t("schoolBoard.dashboard.performanceDistribution")}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              {performanceData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ background: item.color }}
                  ></div>
                  <span style={{ color: "#000000" }}>
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div
          className="rounded-2xl p-6 shadow-lg"
          style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
        >
          <h2 className="text-xl mb-6" style={{ color: "#004aad" }}>
            {t("schoolBoard.dashboard.recentActivity")}
          </h2>
          <div className="space-y-4">
            {[
              {
                school: "École Laurier",
                action: t("schoolBoard.dashboard.activity.newEvaluation"),
                time: t("schoolBoard.dashboard.activity.hoursAgo", {
                  count: 2,
                }),
              },
              {
                school: "École Saint-Jean",
                action: t("schoolBoard.dashboard.activity.monthlyReport"),
                time: t("schoolBoard.dashboard.activity.hoursAgo", {
                  count: 5,
                }),
              },
              {
                school: "École Montcalm",
                action: t("schoolBoard.dashboard.activity.resultsUpdate"),
                time: t("schoolBoard.dashboard.activity.dayAgo", { count: 1 }),
              },
            ].map((activity, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-xl"
                style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
              >
                <div>
                  <p style={{ color: "#004aad" }}>{activity.school}</p>
                  <p className="text-sm" style={{ color: "#000000" }}>
                    {activity.action}
                  </p>
                </div>
                <p className="text-sm" style={{ color: "#000000" }}>
                  {activity.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
