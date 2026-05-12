import { useState } from "react";
import { useNavigate } from "react-router";
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
} from "lucide-react";
import { LangToggle } from "../components/LangToggle";
import { useLanguage } from "../i18n";
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

const classes = [
  {
    id: 1,
    name: "Maternelle A",
    grade: "Maternelle",
    students: 22,
    enVoie: 91,
  },
  {
    id: 2,
    name: "Maternelle B",
    grade: "Maternelle",
    students: 21,
    enVoie: 86,
  },
  { id: 3, name: "Jardin A", grade: "Jardin", students: 24, enVoie: 79 },
  { id: 4, name: "Jardin B", grade: "Jardin", students: 23, enVoie: 74 },
  { id: 5, name: "1re année A", grade: "1re année", students: 25, enVoie: 72 },
  { id: 6, name: "1re année B", grade: "1re année", students: 24, enVoie: 67 },
  { id: 7, name: "2e année A", grade: "2e année", students: 26, enVoie: 77 },
  { id: 8, name: "2e année B", grade: "2e année", students: 25, enVoie: 68 },
];

const gradeProgress = [
  { grade: "Maternelle", achieved: 88, color: "#29b6f6" },
  { grade: "Jardin", achieved: 76, color: "#2e7d32" },
  { grade: "1re année", achieved: 70, color: "#d97706" },
  { grade: "2e année", achieved: 73, color: "#7c3aed" },
];

const trendData = [
  { month: "Sept", taux: 58 },
  { month: "Oct", taux: 63 },
  { month: "Nov", taux: 67 },
  { month: "Déc", taux: 70 },
  { month: "Jan", taux: 73 },
  { month: "Fév", taux: 75 },
  { month: "Mars", taux: 76 },
];

export function SchoolReportsPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [year, setYear] = useState("2025-2026");

  const menuItems = [
    { icon: Users, label: t("common.classes"), active: false, path: "/school" },
    {
      icon: BarChart3,
      label: t("nav.reports"),
      active: true,
      path: "/school/reports",
    },
    {
      icon: Settings,
      label: t("nav.settings"),
      active: false,
      path: "/school/settings",
    },
  ];

  const totalStudents = classes.reduce((s, c) => s + c.students, 0);
  const avgEnVoie = Math.round(
    classes.reduce((s, c) => s + c.enVoie, 0) / classes.length,
  );

  return (
    <div
      className="h-screen flex overflow-hidden"
      style={{ background: "#dff3ff" }}
    >
      {/* Sidebar */}
      <div
        className="w-64 p-6 flex flex-col overflow-y-auto"
        style={{ background: "#ffffff", borderRight: "1px solid #dff3ff" }}
      >
        <div className="flex items-center gap-3 mb-10">
          <BookOpen className="w-8 h-8" style={{ color: "#004aad" }} />
          <div>
            <h1
              className="text-base font-bold leading-tight"
              style={{ color: "#004aad" }}
            >
              Lecture Scientifique
            </h1>
            <p
              className="text-xs mt-0.5 px-2 py-0.5 rounded-full inline-block"
              style={{ background: "#dff3ff", color: "#004aad" }}
            >
              {t("school.portal")}
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map(({ icon: Icon, label, active, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm"
              style={{
                background: active ? "#dff3ff" : "transparent",
                color: active ? "#004aad" : "#444",
                fontWeight: active ? 600 : 400,
              }}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        <LangToggle />
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm"
          style={{ color: "#ff5757" }}
        >
          <LogOut className="w-4 h-4" />
          {t("common.logout")}
        </button>
      </div>

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
                École Laurier-Trudeau
              </span>
            </div>
            <h1 className="text-3xl font-bold" style={{ color: "#004aad" }}>
              Rapports et analyses
            </h1>
            <p className="text-sm mt-1" style={{ color: "#666" }}>
              Vue détaillée des performances de l'école
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
              value: totalStudents,
              icon: Users,
              bg: "#dff3ff",
              iconColor: "#004aad",
            },
            {
              label: t("common.classes"),
              value: classes.length,
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
                className="px-3 py-1.5 rounded-lg text-xs"
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
                <Tooltip formatter={(v: number) => [`${v}%`, "En voie"]} />
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

        {/* Classes performance */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-base" style={{ color: "#004aad" }}>
              Performance par classe
            </h2>
            <button
              className="px-3 py-1.5 rounded-lg text-xs"
              style={{ background: "#38b6ff", color: "#ffffff" }}
            >
              <Download className="w-3 h-3 inline mr-1" />
              {t("common.export")}
            </button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={classes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "#888" }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "#888" }}
                unit="%"
              />
              <Tooltip formatter={(v: number) => [`${v}%`, "En voie"]} />
              <Bar dataKey="enVoie" radius={[8, 8, 0, 0]}>
                {classes.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={
                      entry.enVoie >= 80
                        ? "#c9e265"
                        : entry.enVoie >= 70
                          ? "#38b6ff"
                          : "#ff5757"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
