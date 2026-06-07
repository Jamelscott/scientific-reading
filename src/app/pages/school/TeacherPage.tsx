import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  ChevronDown,
  Download,
  Users,
  TrendingUp,
  GraduationCap,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import {
  Bar,
  CartesianGrid,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/Button";
import { getTeachersPerformance } from "../../../stores/storeHelpers";
import { useClassStore, useStudentStore } from "../../../stores";
import { schoolLevel } from "../const";

const GRADE_COLORS: Record<string, string> = {
  Maternelle: "#ff5757",
  Jardin: "#ffde59",
  "1re année": "#c9e265",
  "2e année": "#38b6ff",
  "3e année": "#b8a3d6",
};

export function TeacherPage() {
  const navigate = useNavigate();
  const { teacherId, schoolId } = useParams();
  const { t } = useTranslation();

  const teachersData = getTeachersPerformance();
  const teacher = teachersData.find((t) => t.id === teacherId);

  // Get actual class and student data from stores
  const allClasses = useClassStore((state) => state.classes);
  const allStudents = useStudentStore((state) => state.students);

  const [showTeacherDropdown, setShowTeacherDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowTeacherDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTeacherChange = (newTeacherId: string) => {
    setShowTeacherDropdown(false);
    if (schoolId) {
      navigate(`/school/${schoolId}/teacher/${newTeacherId}`);
    } else {
      navigate(`/board/teacher/${newTeacherId}`);
    }
  };

  if (!teacher) {
    return <div>Teacher not found</div>;
  }

  // Get teacher's actual classes
  const teacherClasses = allClasses.filter(
    (cls) => cls.teacherId === teacherId,
  );

  // Map grades to schoolLevel categories
  type Grades = "Maternelle" | "Jardin" | "1re année" | "2e année" | "3e année";
  const gradeLevelMap: Record<Grades, keyof typeof schoolLevel> = {
    Maternelle: "kindergarden",
    Jardin: "seniorKindergarden",
    "1re année": "gradeOne",
    "2e année": "gradeTwo",
    "3e année": "gradeTwo",
  };

  // Build detailed class data with performance metrics
  const detailedClasses = teacherClasses.map((cls) => {
    // Get students in this class
    const classStudents = allStudents.filter((student) =>
      student.classIds.includes(cls.id),
    );

    // Calculate class metrics
    let totalCompleted = 0;
    let totalSuccessful = 0;
    let studentsOnTrack = 0;

    classStudents.forEach((student) => {
      if (student.evaluations && student.evaluations.length > 0) {
        const completedEvaluations = student.evaluations.filter(
          (evaluation) =>
            evaluation.status !== null && evaluation.status !== undefined,
        ).length;
        totalCompleted += completedEvaluations;

        const successfulEvaluations = student.evaluations.filter(
          (evaluation) =>
            evaluation.status === "success" || evaluation.status === "adequate",
        ).length;
        totalSuccessful += successfulEvaluations;

        // Check if student is on track
        const levelKey = gradeLevelMap[cls.grade as Grades];
        const benchmarks = schoolLevel[levelKey];
        if (successfulEvaluations >= benchmarks.onTrack) {
          studentsOnTrack++;
        }
      }
    });

    const avgCompleted =
      classStudents.length > 0
        ? (totalCompleted / classStudents.length / 15) * 100
        : 0;
    const avgAtelier =
      classStudents.length > 0
        ? (totalSuccessful / classStudents.length / 15) * 100
        : 0;
    const enVoie =
      classStudents.length > 0
        ? (studentsOnTrack / classStudents.length) * 100
        : 0;
    const atRisk = 100 - enVoie;

    return {
      id: cls.id,
      name: cls.name,
      grade: cls.grade,
      studentCount: classStudents.length,
      avgCompleted,
      avgAtelier,
      enVoie,
      atRisk,
    };
  });

  // Prepare grade distribution data for pie chart
  const gradeDistribution = detailedClasses.reduce(
    (acc: Record<string, number>, cls) => {
      acc[cls.grade] = (acc[cls.grade] || 0) + cls.studentCount;
      return acc;
    },
    {},
  );

  const gradeData = Object.entries(gradeDistribution).map(([grade, count]) => ({
    name: grade,
    value: count,
    color: GRADE_COLORS[grade] || "#ddd",
  }));

  // Prepare class performance data for bar chart
  const classPerformanceData = detailedClasses.map((cls) => ({
    name: cls.name,
    completed: cls.avgCompleted,
    successful: cls.avgAtelier,
    onTrack: cls.enVoie,
    atRisk: cls.atRisk,
  }));

  // Calculate overall performance metrics
  const totalStudents = teacher.students;
  const avgCompletionRate = Math.round(teacher.avgCompleted);
  const avgSuccessRate = Math.round(teacher.avgAtelier);
  const onTrackPercentage = Math.round(teacher.enVoie);

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: "#dff3ff" }}
    >
      {/* Header */}
      <div
        className="p-6 border-b flex-shrink-0"
        style={{
          background: "#ffffff",
          borderColor: "#dff3ff",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() =>
              schoolId
                ? navigate(`/school/${schoolId}/academics`)
                : navigate(`/board/dashboard`)
            }
            className="flex items-center gap-2 mb-4 text-sm hover:font-bold transition-all cursor-pointer hover:shadow-md"
            style={{ color: "#38b6ff" }}
          >
            <ArrowLeft className="w-4 h-4" />
            {schoolId ? t("studentPage.backToAcademics") : "Back to Dashboard"}
          </button>

          <div className="flex items-center justify-between">
            <div>
              <div
                className="inline-block px-4 py-2 rounded-lg mb-3"
                style={{ background: "#004aad", color: "#ffffff" }}
              >
                <p className="text-sm">Teacher Profile</p>
              </div>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowTeacherDropdown(!showTeacherDropdown)}
                  className="flex items-center gap-2 text-3xl mb-2 hover:opacity-80 hover:shadow-md transition-all cursor-pointer"
                  style={{ color: "#004aad" }}
                >
                  {teacher.name}
                  <ChevronDown
                    className="w-6 h-6 transition-transform duration-200"
                    style={{
                      transform: showTeacherDropdown
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  />
                </button>

                {showTeacherDropdown && (
                  <div
                    className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border overflow-y-auto overflow-x-hidden z-50 min-w-[300px]"
                    style={{ borderColor: "#dff3ff", maxHeight: "280px" }}
                  >
                    {teachersData.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleTeacherChange(t.id)}
                        className="w-full px-4 py-3 text-left transition-all flex items-center justify-between group hover:bg-[#38b6ff] hover:scale-[1.02] hover:shadow-md cursor-pointer"
                        style={{
                          backgroundColor:
                            t.id === teacherId ? "#dff3ff" : "transparent",
                        }}
                      >
                        <span
                          className="group-hover:text-white transition-colors"
                          style={{ color: "#004aad" }}
                        >
                          {t.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-lg" style={{ color: "#000000" }}>
                {teacher.grades.join(", ")} • {teacher.numClasses}{" "}
                {teacher.numClasses === 1 ? "Class" : "Classes"}
              </p>
            </div>

            <Button
              variant="primary"
              onClick={() => {
                // TODO: Implement teacher PDF export
                console.log("Export teacher report");
              }}
              label="Export Report"
              leadingIcon={<Download className="w-5 h-5" />}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
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
                Total Students
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
                  style={{ background: "#dff3ff" }}
                >
                  <Calendar className="w-6 h-6" style={{ color: "#004aad" }} />
                </div>
              </div>
              <p className="text-sm mb-2" style={{ color: "#000000" }}>
                Avg. Completion
              </p>
              <p className="text-3xl" style={{ color: "#004aad" }}>
                {avgCompletionRate}%
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
                Avg. Success Rate
              </p>
              <p className="text-3xl" style={{ color: "#004aad" }}>
                {avgSuccessRate}%
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
                  <GraduationCap
                    className="w-6 h-6"
                    style={{ color: "#000000" }}
                  />
                </div>
              </div>
              <p className="text-sm mb-2" style={{ color: "#000000" }}>
                Students On Track
              </p>
              <p className="text-3xl" style={{ color: "#004aad" }}>
                {onTrackPercentage}%
              </p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Grade Distribution Pie Chart */}
            <div
              className="rounded-2xl p-6 shadow-lg"
              style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
            >
              <h2 className="text-xl mb-6" style={{ color: "#004aad" }}>
                Student Distribution by Grade
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={gradeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {gradeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Class Performance Bar Chart */}
            <div
              className="rounded-2xl p-6 shadow-lg"
              style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
            >
              <h2 className="text-xl mb-6" style={{ color: "#004aad" }}>
                Class Performance Overview
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={classPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dff3ff" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#000000", fontSize: 11 }}
                  />
                  <YAxis tick={{ fill: "#000000" }} domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="completed"
                    name="Avg Completed %"
                    fill="#38b6ff"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="successful"
                    name="Avg Success %"
                    fill="#c9e265"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="onTrack"
                    name="On Track %"
                    fill="#ffde59"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="atRisk"
                    name="At Risk %"
                    fill="#ff5757"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Classes List */}
          <div
            className="rounded-2xl p-8 shadow-lg mb-8"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <h2 className="text-2xl mb-6" style={{ color: "#004aad" }}>
              Classes
            </h2>

            <div className="space-y-4">
              {detailedClasses.map((cls) => (
                <button
                  key={cls.id}
                  className="w-full p-6 rounded-xl border hover:shadow-md transition-all cursor-pointer group text-left"
                  style={{ borderColor: "#dff3ff", background: "#ffffff" }}
                  onClick={() => {
                    if (schoolId) {
                      navigate(
                        `/school/${schoolId}/teacher/${teacherId}/class/${cls.id}`,
                      );
                    } else {
                      navigate(`/teacher/${teacherId}/class/${cls.id}`);
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f0f9ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#ffffff";
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className="px-3 py-1 rounded-lg text-sm font-medium"
                          style={{
                            background: GRADE_COLORS[cls.grade] || "#ddd",
                            color: "#000000",
                          }}
                        >
                          {cls.grade}
                        </span>
                        <h3
                          className="text-lg font-bold group-hover:underline"
                          style={{ color: "#004aad" }}
                        >
                          {cls.name}
                        </h3>
                        <ArrowUpRight
                          className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: "#38b6ff" }}
                        />
                      </div>
                      <p
                        className="text-sm"
                        style={{ color: "#000000", opacity: 0.7 }}
                      >
                        {cls.studentCount}{" "}
                        {cls.studentCount === 1 ? "student" : "students"}
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <div className="text-center">
                        <p className="text-xs mb-1" style={{ color: "#666" }}>
                          Completion
                        </p>
                        <p
                          className="text-xl font-bold"
                          style={{ color: "#004aad" }}
                        >
                          {Math.round(cls.avgCompleted)}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs mb-1" style={{ color: "#666" }}>
                          Success
                        </p>
                        <p
                          className="text-xl font-bold"
                          style={{ color: "#004aad" }}
                        >
                          {Math.round(cls.avgAtelier)}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs mb-1" style={{ color: "#666" }}>
                          On Track
                        </p>
                        <p
                          className="text-xl font-bold"
                          style={{ color: "#c9e265" }}
                        >
                          {Math.round(cls.enVoie)}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs mb-1" style={{ color: "#666" }}>
                          At Risk
                        </p>
                        <p
                          className="text-xl font-bold"
                          style={{ color: "#ff5757" }}
                        >
                          {Math.round(cls.atRisk)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
