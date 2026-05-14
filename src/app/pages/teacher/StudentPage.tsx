import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  BarChart as BarChartIcon,
  Calendar,
  Download,
  FileText,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { useAuthStore, useStudentStore, useUnitsStore } from "../../../stores";
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
) => {
  if (status === "success") return "En voie/acquis";
  if (status === "adequate") return "À surveiller";
  if (status === "needs-improvement") return "À risque";
  if (status === "not-required") return "Non requis";
  return "Non évalué";
};

export function StudentPage() {
  const navigate = useNavigate();
  const { studentId, teacherId } = useParams();
  const { t } = useTranslation();
  const unitData = useUnitsStore((state) => state.getUnitsData);
  const student = useStudentStore((state) => state.getStudentById(studentId!));
  const teacher = useAuthStore((state) => state.getCurrentUser());
  const studentAnswers = useUnitsStore((state) =>
    state.getAnswersByStudent(Number(studentId)!),
  );

  if (!student) {
    return <div>{t("studentPage.studentNotFound")}</div>;
  }
  console.log(studentAnswers);
  const completedCount = studentAnswers?.length;

  const currentBenchmark =
    gradeBenchmarks[student.grade as keyof typeof gradeBenchmarks] ||
    gradeBenchmarks["1re année"];
  const benchmarkProgress = Math.min(
    100,
    (completedCount / currentBenchmark.expected) * 100,
  );
  const isOnTrack = completedCount >= currentBenchmark.expected;
  const isAhead = completedCount > currentBenchmark.expected;

  const successCount = studentAnswers.filter(
    (e) => e.status === "success",
  ).length;
  const successRate = Math.round((successCount / completedCount) * 100);

  const radarData = [
    { subject: t("studentPage.reading"), score: 90 },
    { subject: t("studentPage.writing"), score: 85 },
    { subject: t("studentPage.comprehension"), score: 70 },
    { subject: t("studentPage.vocabulary"), score: 95 },
    { subject: t("studentPage.phonics"), score: 80 },
  ];

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: "#dff3ff" }}
    >
      {/* Header */}
      <div
        className="p-6 border-b flex-shrink-0"
        style={{ background: "#ffffff", borderColor: "#dff3ff" }}
      >
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(`/teacher/${teacherId}/class/1`)}
            className="flex items-center gap-2 mb-4 text-sm"
            style={{ color: "#38b6ff" }}
          >
            <ArrowLeft className="w-4 h-4" />
            {t("studentPage.backToClassList")}
          </button>

          <div className="flex items-center justify-between">
            <div>
              <div
                className="inline-block px-4 py-2 rounded-lg mb-3"
                style={{ background: "#004aad", color: "#ffffff" }}
              >
                <p className="text-sm">{t("studentPage.smlTitle")}</p>
              </div>
              <h1 className="text-3xl mb-2" style={{ color: "#004aad" }}>
                {student.name}
              </h1>
              <p className="text-lg" style={{ color: "#000000" }}>
                {student.grade} - {teacher?.name}
              </p>
            </div>

            <button
              className="px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
              style={{
                background: "#004aad",
                color: "#ffffff",
              }}
            >
              <Download className="w-5 h-5" />
              {t("studentPage.exportReport")}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
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
                  studentAnswers[studentAnswers.length - 1]?.lastModified,
                )}
              </p>
            </div>

            {/* Charts and Progress */}
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
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#000000", fontSize: 12 }}
                  />
                  {/* <PolarRadiusAxis
                    orientation="middle"
                    tick={{ fill: "#000000" }}
                    axisLine={false}
                  /> */}
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
            {/* Evaluations List */}
          </div>

          <div
            className="rounded-2xl p-8 shadow-lg mb-8"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <h2 className="text-2xl mb-6" style={{ color: "#004aad" }}>
              Historique des ateliers
            </h2>

            <div className="space-y-4">
              {studentAnswers.map((evaluation) => {
                const unit = unitData.find(
                  (u) => u.evaluation === evaluation.unitDataId,
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
                            Atelier {evaluation.unitDataId}
                          </span>
                          <h3 className="text-lg" style={{ color: "#004aad" }}>
                            {t(unit!.title)}
                          </h3>
                        </div>
                        <p
                          className="text-sm mb-2"
                          style={{ color: "#000000", opacity: 0.7 }}
                        >
                          Complété le{" "}
                          {evaluation.lastModified
                            ? formatDate(evaluation.lastModified)
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
                          {getStatusText(evaluation.status || null)}
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
                              Commentaire de l'enseignant(e)
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
