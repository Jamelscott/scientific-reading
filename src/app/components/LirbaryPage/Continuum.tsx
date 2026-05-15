import {
  BookOpen,
  Download,
  FileCheck,
  FileSearch,
  Gauge,
  Music,
  PenLine,
  Rocket,
  RotateCcw,
  Search,
  Target,
  Type,
  Volume2,
} from "lucide-react";
import { Button } from "../ui/Button";
import { exportContinuumToPdf } from "../utils/exportContinuumToPdf";
import { useTranslation } from "react-i18next";

export function Continuum() {
  const { t } = useTranslation();
  return (
    <div
      className="rounded-2xl p-8 shadow-lg mb-8"
      style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl" style={{ color: "#004aad" }}>
            {t("dashboard.welcome")}
          </h2>
          <p
            className="text-sm mt-1"
            style={{ color: "#004aad", opacity: 0.6 }}
          >
            {t("library.subtitle")}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => exportContinuumToPdf()}
          className="px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm transition-all"
          leadingIcon={<Download className="w-4 h-4" />}
          label="common.downloadPdf"
        />
      </div>
      {/* 10-unit scrollable track */}
      <div className="overflow-x-auto pb-3 -mx-2 px-2 mt-6">
        <div className="flex gap-3" style={{ minWidth: "max-content" }}>
          {[
            {
              num: 1,
              color: "#3b82f6",
              textColor: "#ffffff",
              Icon: Volume2,
              title: "Conscience phonologique et syllabes",
              desc: "Développer l'écoute des sons et la conscience des syllabes pour commencer à lire.",
              bullets: [
                "Sons à l'oral",
                "Rimes",
                "Segmentation et fusion",
                "Syllabes",
                "Fusion de syllabes",
                "Sons initiaux et finaux",
              ],
              lecons: 13,
            },
            {
              num: 2,
              color: "#38bdf8",
              textColor: "#000000",
              Icon: Rocket,
              title: "Décodage de base — Sons simples",
              desc: "Apprendre les correspondances lettres-sons les plus simples pour commencer à décoder les mots.",
              bullets: [
                "Voyelles à son court",
                "Association des syllabes",
                "Correspondance son-lettre",
                "Lecture de CV, VC, CVC",
              ],
              lecons: 8,
            },
            {
              num: 3,
              color: "#22d3ee",
              textColor: "#000000",
              Icon: BookOpen,
              title: "Syllabes et mots fréquents",
              desc: "Renforcer la lecture de syllabes complexes et de mots fréquents pour améliorer la fluidité.",
              bullets: [
                "Syllabes ouvertes et fermées",
                "Syllabes complexes (CVCc, CCVc)",
                "Mots fréquents (liste)",
                "Mots à haute fréquence",
              ],
              lecons: 8,
            },
            {
              num: 4,
              color: "#a3e635",
              textColor: "#000000",
              Icon: PenLine,
              title: "Phrases simples et textes courts",
              desc: "Lire des phrases simples et de courts textes avec fluidité et compréhension.",
              bullets: [
                "Phrases simples (sujet-verbe-objet)",
                "Signes graphiques",
                "Compréhension",
                "Textes courts",
              ],
              lecons: 8,
            },
            {
              num: 5,
              color: "#fbbf24",
              textColor: "#000000",
              Icon: Search,
              title: "Graphèmes complexes et digrammes",
              desc: "Décoder les mots complexes avec des graphèmes et digrammes fréquents.",
              bullets: [
                "Digrammes et trigrammes (gn, ch, ill, oi, eu…)",
                "au, eau, ou, ai, ei, oi…",
                "Fluidité et confiance",
                "Mots fréquents",
              ],
              lecons: 8,
            },
            {
              num: 6,
              color: "#fb923c",
              textColor: "#000000",
              Icon: Type,
              title: "Régularités orthographiques et morphologie",
              desc: "Reconnaître les régularités orthographiques et les patterns de mots courants.",
              bullets: [
                "Familles de mots (pas, passé, passer)",
                "Terminaisons (-tion, -sion)",
                "Préfixes et suffixes",
                "Pluriels",
              ],
              lecons: 8,
            },
            {
              num: 7,
              color: "#fb7185",
              textColor: "#000000",
              Icon: Music,
              title: "Rimes complexes et semi-voyelles",
              desc: "Maîtriser les rimes complexes et les semi-voyelles dans des textes variés.",
              bullets: [
                "-ille, -ouille, -aille",
                "Le son /j/ (y, il, ille)",
                "Triphtongues",
                "Lecture de textes graduels",
              ],
              lecons: 8,
            },
            {
              num: 8,
              color: "#a855f7",
              textColor: "#ffffff",
              Icon: Gauge,
              title: "Fluidité et expression",
              desc: "Lire avec fluidité, justesse et expression dans des textes plus longs.",
              bullets: [
                "Lecture répétée",
                "Lecture en tandem",
                "Enregistrement et écoute",
                "Textes variés",
              ],
              lecons: 8,
            },
            {
              num: 9,
              color: "#0ea5e9",
              textColor: "#ffffff",
              Icon: FileSearch,
              title: "Compréhension et inférence",
              desc: "Comprendre, analyser et faire des liens dans des textes courants et littéraires.",
              bullets: [
                "Idées principales et détails",
                "Inférence et déduction",
                "Vocabulaire en contexte",
                "Résumé",
                "Comparaison et évaluation",
              ],
              lecons: 8,
            },
            {
              num: 10,
              color: "#ef4444",
              textColor: "#ffffff",
              Icon: Target,
              title: "Stratégies approfondies",
              desc: "Utiliser des stratégies avancées pour s'autoévaluer et approfondir la compréhension.",
              bullets: [
                "Genres littéraires",
                "Autoévaluation",
                "Visualisation",
                "Vocabulaire en contexte",
                "Résumé",
                "Comparaison et évaluation",
              ],
              lecons: 8,
            },
          ].map(
            ({ num, color, textColor, Icon, title, desc, bullets, lecons }) => (
              <div
                key={num}
                className="flex flex-col rounded-2xl overflow-hidden"
                style={{
                  width: 200,
                  minWidth: 200,
                  border: `2px solid ${color}`,
                }}
              >
                {/* Colored header */}
                <div
                  className="flex flex-col items-center pt-5 pb-4 px-4 gap-2"
                  style={{ background: color }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                    style={{
                      background: "rgba(255,255,255,0.25)",
                      color: textColor,
                    }}
                  >
                    {num}
                  </div>
                  <Icon
                    className="w-6 h-6"
                    style={{ color: "rgba(255,255,255,0.9)" }}
                  />
                </div>

                {/* Card body */}
                <div
                  className="flex flex-col flex-1 p-4"
                  style={{ background: "#ffffff" }}
                >
                  <p
                    className="text-xs font-bold leading-snug mb-2"
                    style={{ color }}
                  >
                    {title}
                  </p>
                  <p
                    className="text-xs leading-relaxed mb-3"
                    style={{ color: "#555", opacity: 0.85 }}
                  >
                    {desc}
                  </p>
                  <ul className="flex-1 space-y-1 mb-4">
                    {bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-1.5 text-xs"
                        style={{ color: "#333" }}
                      >
                        <span
                          className="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: color }}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>

                  {/* Lesson count badge */}
                  <div
                    className="text-center text-xs font-bold py-1.5 rounded-lg"
                    style={{ background: color, color: textColor }}
                  >
                    {lecons} LEÇONS
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
      {/* Visual atelier bar */}
      <div className="mt-6">
        <p
          className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: "#004aad" }}
        >
          Ateliers associés
        </p>

        {/* Bar */}
        <div className="flex h-10 rounded-xl overflow-hidden w-full">
          {/* All units with their specific colors */}
          {[
            { n: 1, ateliers: 4, color: "#3b82f6", textColor: "#ffffff" },
            { n: 2, ateliers: 1, color: "#38bdf8", textColor: "#000000" },
            { n: 3, ateliers: 1, color: "#22d3ee", textColor: "#000000" },
            { n: 4, ateliers: 1, color: "#a3e635", textColor: "#000000" },
            { n: 5, ateliers: 1, color: "#fbbf24", textColor: "#000000" },
            { n: 6, ateliers: 1, color: "#fb923c", textColor: "#000000" },
            { n: 7, ateliers: 1, color: "#fb7185", textColor: "#000000" },
            { n: 8, ateliers: 1, color: "#a855f7", textColor: "#ffffff" },
            { n: 9, ateliers: 1, color: "#0ea5e9", textColor: "#ffffff" },
            { n: 10, ateliers: 1, color: "#ef4444", textColor: "#ffffff" },
          ].map(({ n, ateliers, color, textColor }) => (
            <div
              key={n}
              className="flex items-center justify-center text-xs font-bold border-r border-white/30"
              style={{
                flex: ateliers,
                background: color,
                color: textColor,
                minWidth: 0,
              }}
              title={`Unité ${n}`}
            >
              {n}
            </div>
          ))}
        </div>

        {/* Atelier labels below bar */}
        <div className="flex w-full mt-2">
          <div className="text-center" style={{ flex: 4 }}>
            <p className="text-xs" style={{ color: "#555" }}>
              Ateliers 1–4
            </p>
          </div>
          <div className="text-center" style={{ flex: 1 }}>
            <p className="text-xs" style={{ color: "#555" }}>
              A5
            </p>
          </div>
          <div className="text-center" style={{ flex: 1 }}>
            <p className="text-xs" style={{ color: "#555" }}>
              A6
            </p>
          </div>
          <div className="text-center" style={{ flex: 1 }}>
            <p className="text-xs" style={{ color: "#555" }}>
              A7
            </p>
          </div>
          <div className="text-center" style={{ flex: 1 }}>
            <p className="text-xs" style={{ color: "#555" }}>
              A8
            </p>
          </div>
          <div className="text-center" style={{ flex: 1 }}>
            <p className="text-xs" style={{ color: "#555" }}>
              A9
            </p>
          </div>
          <div className="text-center" style={{ flex: 1 }}>
            <p className="text-xs" style={{ color: "#555" }}>
              A10
            </p>
          </div>
          <div className="text-center" style={{ flex: 1 }}>
            <p className="text-xs" style={{ color: "#555" }}>
              A11
            </p>
          </div>
          <div className="text-center" style={{ flex: 1 }}>
            <p className="text-xs" style={{ color: "#555" }}>
              A12
            </p>
          </div>
          <div className="text-center" style={{ flex: 1 }}>
            <p className="text-xs" style={{ color: "#555" }}>
              A13
            </p>
          </div>
        </div>

        {/* Return note */}
        <p className="text-xs italic mt-3" style={{ color: "#555" }}>
          <RotateCcw
            className="w-3 h-3 inline mr-1 relative -top-px"
            style={{ color: "#004aad" }}
          />
          Les élèves peuvent revenir à des ateliers antérieurs au besoin jusqu'à
          la maîtrise.
        </p>
      </div>
    </div>
  );
}

export default Continuum;
