import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Users,
  School,
  Filter,
  X,
  UserCircle,
  ArrowUpRight,
  Search,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Sidebar } from "../../components/Sidebar";
import { Tooltip } from "../../components/ui/Tooltip";
import {
  getStudentsForAcademics,
  getTeachersPerformance,
} from "../../../stores/storeHelpers";

type ViewMode = "students" | "teachers";
type SortField =
  | "name"
  | "grade"
  | "atelier"
  | "enVoie"
  | "teacher"
  | "avgAtelier"
  | "students";
type SortDirection = "asc" | "desc";

interface FilterState {
  grades: string[];
  teachers: string[];
  atelierRange: [number, number];
  enVoieOnly: boolean;
  enRiskOnly: boolean;
  searchQuery: string;
}

export function Academics() {
  const navigate = useNavigate();
  const { schoolId } = useParams();
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>("teachers");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [showFilters, setShowFilters] = useState(false);

  // Get data from stores via helper functions
  const studentsData = getStudentsForAcademics();
  console.log(studentsData);
  const teachersData = getTeachersPerformance();

  const [filters, setFilters] = useState<FilterState>({
    grades: [],
    teachers: [],
    atelierRange: [0, 15],
    enVoieOnly: false,
    enRiskOnly: false,
    searchQuery: "",
  });

  const grades = ["Maternelle", "Jardin", "1re année", "2e année", "3e année"];
  const allTeachers = useMemo(
    () => teachersData.map((t: { name: string }) => t.name),
    [teachersData],
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

  // Filter and sort logic
  const filteredAndSortedData = useMemo(() => {
    let data: any[] =
      viewMode === "students" ? [...studentsData] : [...teachersData];
    // Apply search filter
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      data = data.filter((item) => item.name.toLowerCase().includes(query));
    }
    // Apply filters
    if (filters.grades.length > 0) {
      if (viewMode === "students") {
        data = data.filter((item) => filters.grades.includes(item.grade));
      } else {
        // For teachers, check if they teach any of the filtered grades
        data = data.filter((item) =>
          item.grades.some((grade: string) => filters.grades.includes(grade)),
        );
      }
    }

    if (viewMode === "students") {
      if (filters.teachers.length > 0) {
        data = data.filter((item) => filters.teachers.includes(item.teacher));
      }
      data = data.filter(
        (item) =>
          item.atelier >= filters.atelierRange[0] &&
          item.atelier <= filters.atelierRange[1],
      );
      if (filters.enVoieOnly) {
        data = data.filter((item) => item.enVoie);
      }
      if (filters.enRiskOnly) {
        data = data.filter((item) => !item.enVoie);
      }
    }
    // Note: atelierRange filter not applied to teachers since avgAtelier is now a percentage

    // Apply sorting
    data.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === "enVoie" && viewMode === "teachers") {
        // For teachers, sort by enVoie percentage
        aVal = a.enVoie;
        bVal = b.enVoie;
      } else if (sortField === "atelier" && viewMode === "teachers") {
        // For teachers, use avgAtelier
        aVal = a.avgAtelier;
        bVal = b.avgAtelier;
      }

      if (typeof aVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    });

    return data;
  }, [viewMode, filters, sortField, sortDirection]);

  const activeFiltersCount =
    filters.grades.length +
    filters.teachers.length +
    (filters.enVoieOnly ? 1 : 0) +
    (filters.enRiskOnly ? 1 : 0) +
    (filters.atelierRange[0] !== 0 || filters.atelierRange[1] !== 15 ? 1 : 0) +
    (filters.searchQuery.trim() ? 1 : 0);

  const clearFilters = () => {
    setFilters({
      grades: [],
      teachers: [],
      atelierRange: [0, 15],
      enVoieOnly: false,
      enRiskOnly: false,
      searchQuery: "",
    });
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div
      className="h-screen flex overflow-hidden"
      style={{ background: "#dff3ff" }}
    >
      <Sidebar />

      {/* Main */}
      <div className="flex-1 overflow-y-auto p-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <School className="w-5 h-5" style={{ color: "#004aad" }} />
              <span
                className="text-sm font-medium"
                style={{ color: "#004aad" }}
              >
                {t("academics.schoolName")}
              </span>
            </div>
            <h1 className="text-3xl font-bold" style={{ color: "#004aad" }}>
              {t("nav.academics")}
            </h1>
            <p className="text-sm mt-1" style={{ color: "#666" }}>
              {t("academics.subtitle")}
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("teachers")}
                className="px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 font-medium hover:shadow-md cursor-pointer"
                style={{
                  background: viewMode === "teachers" ? "#004aad" : "#dff3ff",
                  color: viewMode === "teachers" ? "#ffffff" : "#004aad",
                }}
              >
                <UserCircle className="w-4 h-4" />
                {t("academics.viewMode.teachers")} ({teachersData.length})
              </button>
              <button
                onClick={() => setViewMode("students")}
                className="px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 font-medium hover:shadow-md cursor-pointer"
                style={{
                  background: viewMode === "students" ? "#004aad" : "#dff3ff",
                  color: viewMode === "students" ? "#ffffff" : "#004aad",
                }}
              >
                <Users className="w-4 h-4" />
                {t("academics.viewMode.students")} ({studentsData.length})
              </button>
            </div>
            <div className="flex-1 max-w-md relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "#888" }}
              />
              <input
                type="text"
                placeholder={
                  viewMode === "students"
                    ? t("academics.search.student")
                    : t("academics.search.teacher")
                }
                value={filters.searchQuery}
                onChange={(e) =>
                  setFilters({ ...filters, searchQuery: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
                style={{
                  background: "#f9fafb",
                  border: "1px solid #dff3ff",
                  color: "#004aad",
                }}
              />
              {filters.searchQuery && (
                <button
                  onClick={() => setFilters({ ...filters, searchQuery: "" })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center hover:opacity-70 hover:shadow-md transition-all cursor-pointer"
                  style={{ background: "#dff3ff" }}
                >
                  <X className="w-3 h-3" style={{ color: "#004aad" }} />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 hover:shadow-md cursor-pointer"
              style={{
                background: activeFiltersCount > 0 ? "#38b6ff" : "#dff3ff",
                color: activeFiltersCount > 0 ? "#ffffff" : "#004aad",
              }}
            >
              <Filter className="w-4 h-4" />
              {t("academics.filters.title")}{" "}
              {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div
            className="rounded-2xl p-6 mb-6"
            style={{ background: "#ffffff", border: "2px solid #38b6ff" }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-base" style={{ color: "#004aad" }}>
                {t("academics.filters.advancedFilters")}
              </h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 hover:shadow-md transition-all cursor-pointer"
                  style={{ background: "#ff5757", color: "#ffffff" }}
                >
                  <X className="w-3 h-3" />
                  {t("academics.filters.clearAll")}
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Grade Filter */}
              <div>
                <label
                  className="block text-xs font-semibold mb-2"
                  style={{ color: "#666" }}
                >
                  {t("academics.filters.gradeLevel")}
                </label>
                <div className="space-y-2">
                  {grades.map((grade) => (
                    <label
                      key={grade}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.grades.includes(grade)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({
                              ...filters,
                              grades: [...filters.grades, grade],
                            });
                          } else {
                            setFilters({
                              ...filters,
                              grades: filters.grades.filter((g) => g !== grade),
                            });
                          }
                        }}
                        className="w-4 h-4 rounded"
                        style={{ accentColor: "#004aad" }}
                      />
                      <span className="text-sm" style={{ color: "#333" }}>
                        {grade}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Teacher Filter (students only) */}
              {viewMode === "students" && (
                <div>
                  <label
                    className="block text-xs font-semibold mb-2"
                    style={{ color: "#666" }}
                  >
                    {t("academics.filters.teacher")}
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {allTeachers.map((teacher: string) => (
                      <label
                        key={teacher}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.teachers.includes(teacher)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({
                                ...filters,
                                teachers: [...filters.teachers, teacher],
                              });
                            } else {
                              setFilters({
                                ...filters,
                                teachers: filters.teachers.filter(
                                  (t) => t !== teacher,
                                ),
                              });
                            }
                          }}
                          className="w-4 h-4 rounded"
                          style={{ accentColor: "#004aad" }}
                        />
                        <span className="text-sm" style={{ color: "#333" }}>
                          {teacher}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Atelier Range */}
              <div>
                <label
                  className="block text-xs font-semibold mb-2"
                  style={{ color: "#666" }}
                >
                  {viewMode === "students"
                    ? t("academics.filters.currentWorkshop")
                    : t("academics.filters.averageWorkshop")}
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs" style={{ color: "#888" }}>
                      {t("academics.filters.min")}: {filters.atelierRange[0]}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      value={filters.atelierRange[0]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          atelierRange: [
                            parseInt(e.target.value),
                            filters.atelierRange[1],
                          ],
                        })
                      }
                      className="w-full"
                      style={{ accentColor: "#004aad" }}
                    />
                  </div>
                  <div>
                    <label className="text-xs" style={{ color: "#888" }}>
                      {t("academics.filters.max")}: {filters.atelierRange[1]}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      value={filters.atelierRange[1]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          atelierRange: [
                            filters.atelierRange[0],
                            parseInt(e.target.value),
                          ],
                        })
                      }
                      className="w-full"
                      style={{ accentColor: "#004aad" }}
                    />
                  </div>
                </div>
              </div>

              {/* En Voie Only (students) */}
              {viewMode === "students" && (
                <div>
                  <label
                    className="block text-xs font-semibold mb-2"
                    style={{ color: "#666" }}
                  >
                    {t("academics.filters.status")}
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.enVoieOnly}
                      onChange={(e) =>
                        setFilters({ ...filters, enVoieOnly: e.target.checked })
                      }
                      className="w-4 h-4 rounded"
                      style={{ accentColor: "#004aad" }}
                    />
                    <span className="text-sm" style={{ color: "#333" }}>
                      {t("academics.filters.onTrackOnly")}
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.enRiskOnly}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          enRiskOnly: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded"
                      style={{ accentColor: "#004aad" }}
                    />
                    <span className="text-sm" style={{ color: "#333" }}>
                      {t("academics.filters.atRiskOnly")}
                    </span>
                  </label>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
        >
          {/* Table Header */}
          <div
            className="p-5 border-b"
            style={{ borderColor: "#dff3ff", background: "#f7ffd6" }}
          >
            <p className="text-sm font-semibold" style={{ color: "#004aad" }}>
              {filteredAndSortedData.length}{" "}
              {filteredAndSortedData.length !== 1
                ? t("academics.results.results")
                : t("academics.results.result")}
            </p>
          </div>

          {/* Sort Controls */}
          <div
            className="p-4 border-b flex gap-2"
            style={{ borderColor: "#dff3ff", background: "#f9fafb" }}
          >
            <span
              className="text-xs font-semibold self-center"
              style={{ color: "#666" }}
            >
              {t("academics.sort.sortBy")}
            </span>
            {viewMode === "students" ? (
              <>
                <button
                  onClick={() => toggleSort("name")}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:shadow-md cursor-pointer"
                  style={{
                    background: sortField === "name" ? "#004aad" : "#dff3ff",
                    color: sortField === "name" ? "#ffffff" : "#004aad",
                  }}
                >
                  {t("academics.sort.name")}{" "}
                  {sortField === "name" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </button>
                <button
                  onClick={() => toggleSort("grade")}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:shadow-md cursor-pointer"
                  style={{
                    background: sortField === "grade" ? "#004aad" : "#dff3ff",
                    color: sortField === "grade" ? "#ffffff" : "#004aad",
                  }}
                >
                  {t("academics.sort.grade")}{" "}
                  {sortField === "grade" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </button>
                <button
                  onClick={() => toggleSort("atelier")}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:shadow-md cursor-pointer"
                  style={{
                    background: sortField === "atelier" ? "#004aad" : "#dff3ff",
                    color: sortField === "atelier" ? "#ffffff" : "#004aad",
                  }}
                >
                  {t("academics.sort.workshop")}{" "}
                  {sortField === "atelier" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </button>
                <button
                  onClick={() => toggleSort("teacher")}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:shadow-md cursor-pointer"
                  style={{
                    background: sortField === "teacher" ? "#004aad" : "#dff3ff",
                    color: sortField === "teacher" ? "#ffffff" : "#004aad",
                  }}
                >
                  {t("academics.sort.teacher")}{" "}
                  {sortField === "teacher" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => toggleSort("name")}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                  style={{
                    background: sortField === "name" ? "#004aad" : "#dff3ff",
                    color: sortField === "name" ? "#ffffff" : "#004aad",
                  }}
                >
                  {t("academics.sort.name")}{" "}
                  {sortField === "name" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </button>
                <button
                  onClick={() => toggleSort("grade")}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                  style={{
                    background: sortField === "grade" ? "#004aad" : "#dff3ff",
                    color: sortField === "grade" ? "#ffffff" : "#004aad",
                  }}
                >
                  {t("academics.sort.grade")}{" "}
                  {sortField === "grade" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </button>
                <button
                  onClick={() => toggleSort("students")}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:shadow-md cursor-pointer"
                  style={{
                    background:
                      sortField === "students" ? "#004aad" : "#dff3ff",
                    color: sortField === "students" ? "#ffffff" : "#004aad",
                  }}
                >
                  {t("academics.sort.students")}{" "}
                  {sortField === "students" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </button>
                <button
                  onClick={() => toggleSort("enVoie")}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:shadow-md cursor-pointer"
                  style={{
                    background: sortField === "enVoie" ? "#004aad" : "#dff3ff",
                    color: sortField === "enVoie" ? "#ffffff" : "#004aad",
                  }}
                >
                  {t("academics.sort.onTrack")}{" "}
                  {sortField === "enVoie" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </button>
              </>
            )}
          </div>

          {/* List */}
          <div className="divide-y" style={{ borderColor: "#dff3ff" }}>
            {filteredAndSortedData.length === 0 ? (
              <div className="p-12 text-center">
                <Filter
                  className="w-12 h-12 mx-auto mb-3 opacity-30"
                  style={{ color: "#004aad" }}
                />
                <p className="font-semibold mb-1" style={{ color: "#004aad" }}>
                  {t("academics.results.noResults")}
                </p>
                <p className="text-sm" style={{ color: "#666" }}>
                  {t("academics.results.adjustFilters")}
                </p>
              </div>
            ) : viewMode === "students" ? (
              filteredAndSortedData.map((student: any) => (
                <button
                  key={student.id}
                  onClick={() =>
                    navigate(
                      `/school/${schoolId}/teacher/${student.teacherId}/class/${student.classId}/student/${student.id}`,
                    )
                  }
                  className="w-full p-5 flex items-center justify-between transition-all text-left group cursor-pointer hover:shadow-md"
                  style={{ background: "#ffffff" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f0f9ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#ffffff";
                  }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ background: "#dff3ff", color: "#004aad" }}
                    >
                      {student.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-semibold text-sm mb-0.5 group-hover:underline"
                        style={{ color: "#004aad" }}
                      >
                        {student.name}
                      </p>
                      <p className="text-xs" style={{ color: "#666" }}>
                        {student.className} • {student.teacher}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center" style={{ width: "100px" }}>
                      <p className="text-xs mb-1" style={{ color: "#888" }}>
                        {t("academics.labels.grade")}
                      </p>
                      <div className="flex justify-center">
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ background: "#dff3ff", color: "#004aad" }}
                        >
                          {student.grade}
                        </span>
                      </div>
                    </div>
                    <div className="text-center" style={{ width: "80px" }}>
                      <p className="text-xs mb-1" style={{ color: "#888" }}>
                        {t("academics.labels.workshop")}
                      </p>
                      <div className="flex justify-center">
                        <span
                          className="text-xs px-2 py-1 rounded-full font-semibold"
                          style={{
                            background: getAtelierColor(student.atelier),
                            color: "#ffffff",
                          }}
                        >
                          A{student.atelier}
                        </span>
                      </div>
                    </div>
                    <div className="text-center" style={{ width: "100px" }}>
                      <p className="text-xs mb-1" style={{ color: "#888" }}>
                        {t("academics.labels.status")}
                      </p>
                      <div className="flex justify-center">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${student.enVoie ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {student.enVoie
                            ? t("academics.status.onTrack")
                            : t("academics.status.atRisk")}
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight
                      className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform opacity-60 group-hover:opacity-100"
                      style={{ color: "#38b6ff" }}
                    />
                  </div>
                </button>
              ))
            ) : (
              filteredAndSortedData.map((teacher: any) => (
                <div
                  key={teacher.id}
                  className="p-5 flex items-center justify-between hover:bg-opacity-50 transition-all"
                  style={{ background: "#ffffff" }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ background: "#004aad", color: "#ffffff" }}
                    >
                      {teacher.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .filter(
                          (_: any, i: number, a: any[]) =>
                            i === 0 || i === a.length - 1,
                        )
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-semibold text-base mb-0.5"
                        style={{ color: "#004aad" }}
                      >
                        {teacher.name}
                      </p>
                      <p className="text-xs" style={{ color: "#666" }}>
                        {teacher.classes.join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <Tooltip
                        label={t("academics.tooltips.classes")}
                        position="top"
                      >
                        <p className="text-xs mb-1" style={{ color: "#888" }}>
                          {t("academics.labels.classes")}
                        </p>
                      </Tooltip>
                      <p
                        className="text-lg font-bold"
                        style={{ color: "orange" }}
                      >
                        {teacher.numClasses}
                      </p>
                    </div>
                    <div className="text-center">
                      <Tooltip
                        label={t("academics.tooltips.students")}
                        position="top"
                      >
                        <p className="text-xs mb-1" style={{ color: "#888" }}>
                          {t("academics.labels.students")}
                        </p>
                      </Tooltip>
                      <p
                        className="text-lg font-bold"
                        style={{ color: "#004aad" }}
                      >
                        {teacher.students}
                      </p>
                    </div>
                    <div className="text-center">
                      <Tooltip
                        label={t("academics.tooltips.avgCompleted")}
                        position="top"
                      >
                        <p className="text-xs mb-1" style={{ color: "#888" }}>
                          {t("academics.labels.avgCompleted")}
                        </p>
                      </Tooltip>
                      <p
                        className="text-lg font-bold"
                        style={{ color: "#6366f1" }}
                      >
                        {teacher.avgCompleted.toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-center">
                      <Tooltip
                        label={t("academics.tooltips.avgSuccessful")}
                        position="top"
                      >
                        <p className="text-xs mb-1" style={{ color: "#888" }}>
                          {t("academics.labels.avgSuccessful")}
                        </p>
                      </Tooltip>
                      <p
                        className="text-lg font-bold"
                        style={{ color: "#38b6ff" }}
                      >
                        {teacher.avgAtelier.toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-center">
                      <Tooltip
                        label={t("academics.tooltips.onTrack")}
                        position="top"
                      >
                        <p className="text-xs mb-1" style={{ color: "#888" }}>
                          {t("academics.labels.onTrack")}
                        </p>
                      </Tooltip>
                      <p
                        className="text-lg font-bold"
                        style={{
                          color:
                            teacher.enVoie >= 75
                              ? "#22c55e"
                              : teacher.enVoie >= 65
                                ? "#f59e0b"
                                : "#ff5757",
                        }}
                      >
                        {teacher.enVoie}%
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
