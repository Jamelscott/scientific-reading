import { useState } from "react";
import { useNavigate } from "react-router";
import {
  BookOpen,
  GraduationCap,
  Building2,
  School,
  ArrowRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../stores";
import { mockApiData, type User } from "../../../mockData";
import classroomPhoto from "../../../public/image-1.png";

const portals = [
  {
    id: "teacher",
    label: "Portail enseignant",
    description: "Suivre les élèves, accéder aux ressources et aux rapports",
    Icon: GraduationCap,
    route: "/teacher/dashboard",
    color: "#004aad",
    bg: "var(--portal-teacher-bg)",
    border: "var(--portal-teacher-border)",
  },
  {
    id: "school",
    label: "Portail école",
    description: "Vue d'ensemble des classes et des résultats par école",
    Icon: School,
    route: "/school/dashboard",
    color: "#004aad",
    bg: "var(--portal-school-bg)",
    border: "var(--portal-school-border)",
  },
  {
    id: "board",
    label: "Portail conseil scolaire",
    description: "Données agrégées et suivi à l'échelle du conseil",
    Icon: Building2,
    route: "/board/dashboard",
    color: "#004aad",
    bg: "var(--portal-board-bg)",
    border: "var(--portal-board-border)",
  },
];

export function LoginPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [selectedPortal, setSelectedPortal] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLanguageToggle = () => {
    const newLang = i18n.language === "en" ? "fr" : "en";
    i18n.changeLanguage(newLang);
  };
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const portal = portals.find((p) => p.id === selectedPortal);
    const user = mockApiData.users.find((u: User) => u.type === portal?.id);
    if (user) {
      login(user);
    }
    navigate(portal?.route ?? "/teacher-dashboard");
  };

  const activePortal = portals.find((p) => p.id === selectedPortal);

  return (
    <div className="min-h-screen flex">
      {/* Language Toggle */}
      <div className="fixed top-4 right-4 z-10">
        <button
          onClick={handleLanguageToggle}
          className="px-4 py-2 rounded-lg border transition-all flex items-center gap-2"
          style={{
            background: "#ffffff",
            borderColor: "#dff3ff",
            color: "#004aad",
          }}
        >
          <span className="font-semibold">
            {i18n.language === "en" ? "FR" : "EN"}
          </span>
        </button>
      </div>
      <div className="flex-1 relative overflow-hidden">
        <img
          src={classroomPhoto}
          alt="Enseignante en classe de maternelle faisant une leçon de phonétique en français"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,74,173,0.72) 0%, rgba(0,74,173,0.45) 50%, rgba(0,74,173,0.80) 100%)",
          }}
        />
        <div className="relative h-full flex flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <BookOpen className="w-9 h-9 text-white" />
            <h1 className="text-2xl font-semibold text-white">
              Lecture Scientifique
            </h1>
          </div>
          <div>
            <p className="text-white/80 text-sm mb-3 uppercase tracking-widest font-medium">
              {t("login.gradeRange")}
            </p>
            <h2 className="text-3xl font-bold text-white leading-snug mb-4">
              {t("login.tagline")}
            </h2>
            <p className="text-white/75 text-base max-w-sm">
              {t("login.description")}
            </p>
          </div>
        </div>
      </div>
      {/* Right Side */}
      <div className="flex-1 bg-white flex items-center justify-center p-12 relative">
        <div className="w-full max-w-md">
          {!selectedPortal ? (
            /* Portal selection */
            <>
              <div className="mb-10">
                <h2
                  className="text-3xl font-bold mb-2"
                  style={{ color: "#004aad" }}
                >
                  {t("login.welcome")}
                </h2>
                <p className="text-base" style={{ color: "#555" }}>
                  {t("login.choosePortal")}
                </p>
              </div>

              <div className="space-y-4">
                {portals.map(({ id, Icon, bg, border, color }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedPortal(id)}
                    className="w-full flex items-center gap-4 p-5 rounded-2xl text-left transition-all hover:shadow-md group"
                    style={{
                      background: bg,
                      border: `1.5px solid ${border}`,
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: color }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-base" style={{ color }}>
                        {id === "teacher"
                          ? t("login.teacherPortal")
                          : id === "school"
                            ? t("login.schoolPortal")
                            : t("login.boardPortal")}
                      </p>
                      <p className="text-sm mt-0.5" style={{ color: "#666" }}>
                        {id === "teacher"
                          ? t("login.teacherDesc")
                          : id === "school"
                            ? t("login.schoolDesc")
                            : t("login.boardDesc")}
                      </p>
                    </div>
                    <ArrowRight
                      className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity"
                      style={{ color }}
                    />
                  </button>
                ))}
              </div>
            </>
          ) : (
            /* Login form for selected portal */
            <>
              <button
                onClick={() => setSelectedPortal(null)}
                className="flex items-center gap-2 text-sm mb-8 hover:opacity-70 transition-opacity"
                style={{ color: "#004aad" }}
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                {t("login.changePortal")}
              </button>

              <div className="flex items-center gap-3 mb-8">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "#004aad" }}
                >
                  {activePortal && (
                    <activePortal.Icon className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <p
                    className="text-xs uppercase tracking-widest font-medium"
                    style={{ color: "#888" }}
                  >
                    {t("login.loginTitle")}
                  </p>
                  <h2
                    className="text-xl font-bold"
                    style={{ color: "#004aad" }}
                  >
                    {activePortal?.id === "teacher"
                      ? t("login.teacherPortal")
                      : activePortal?.id === "school"
                        ? t("login.schoolPortal")
                        : t("login.boardPortal")}
                  </h2>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#333" }}
                  >
                    {t("login.email")}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border"
                    style={{ background: "#f8ffdb", borderColor: "#dff3ff" }}
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#333" }}
                  >
                    {t("login.password")}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border"
                    style={{ background: "#f8ffdb", borderColor: "#dff3ff" }}
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex justify-end">
                  <a href="#" className="text-sm" style={{ color: "#38b6ff" }}>
                    {t("login.forgotPassword")}
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-semibold transition-all"
                  style={{ background: "#004aad", color: "#ffffff" }}
                >
                  {t("login.signIn")}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
