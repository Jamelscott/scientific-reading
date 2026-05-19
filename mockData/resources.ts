import type { ResourceCategory } from "./types";

export const downloadableResources: ResourceCategory[] = [
  {
    id: 1,
    title: "Conscience phonologique",
    color: "#3b82f6",
    resources: [
      { id: 1, title: "Rimes", activities: [
        { id: 11, name: "Fiche Rimes", fileName: "/assets/resources/resource-1-a.pdf", description: "Fiche explicative sur les rimes." },
        { id: 12, name: "Exercices Rimes", fileName: "/assets/resources/resource-1-b.pdf", description: "Exercices pratiques sur les rimes." },
        { id: 13, name: "Corrigé Rimes", fileName: "/assets/resources/resource-1-c.pdf", description: "Corrigé des exercices de rimes." },
      ] },
      { id: 2, title: "Segmentations", activities: [
        { id: 21, name: "Fiche Segmentations", fileName: "/assets/resources/resource-2-a.pdf", description: "Fiche explicative sur la segmentation." },
        { id: 22, name: "Exercices Segmentations", fileName: "/assets/resources/resource-2-b.pdf", description: "Exercices pratiques sur la segmentation." },
        { id: 23, name: "Corrigé Segmentations", fileName: "/assets/resources/resource-2-c.pdf", description: "Corrigé des exercices de segmentation." },
      ] },
      { id: 3, title: "Fusions", activities: [
        { id: 31, name: "Fiche Fusions", fileName: "/assets/resources/resource-3-a.pdf", description: "Fiche explicative sur la fusion de sons." },
        { id: 32, name: "Exercices Fusions", fileName: "/assets/resources/resource-3-b.pdf", description: "Exercices pratiques sur les fusions." },
        { id: 33, name: "Corrigé Fusions", fileName: "/assets/resources/resource-3-c.pdf", description: "Corrigé des exercices de fusion." },
      ] },
      { id: 4, title: "Sons initiaux", activities: [
        { id: 41, name: "Fiche Sons initiaux", fileName: "/assets/resources/resource-4-a.pdf", description: "Fiche sur l'identification des sons initiaux." },
        { id: 42, name: "Exercices Sons initiaux", fileName: "/assets/resources/resource-4-b.pdf", description: "Exercices pratiques pour sons initiaux." },
        { id: 43, name: "Corrigé Sons initiaux", fileName: "/assets/resources/resource-4-c.pdf", description: "Corrigé des exercices de sons initiaux." },
      ] },
      { id: 5, title: "Sons finaux", activities: [
        { id: 51, name: "Fiche Sons finaux", fileName: "/assets/resources/resource-5-a.pdf", description: "Fiche sur l'identification des sons finaux." },
        { id: 52, name: "Exercices Sons finaux", fileName: "/assets/resources/resource-5-b.pdf", description: "Exercices pratiques pour sons finaux." },
        { id: 53, name: "Corrigé Sons finaux", fileName: "/assets/resources/resource-5-c.pdf", description: "Corrigé des exercices de sons finaux." },
      ] },
      { id: 6, title: "Syllabes", activities: [
        { id: 61, name: "Fiche Syllabes", fileName: "/assets/resources/resource-6-a.pdf", description: "Fiche explicative sur les syllabes." },
        { id: 62, name: "Exercices Syllabes", fileName: "/assets/resources/resource-6-b.pdf", description: "Exercices pratiques sur les syllabes." },
        { id: 63, name: "Corrigé Syllabes", fileName: "/assets/resources/resource-6-c.pdf", description: "Corrigé des exercices de syllabes." },
      ] },
      { id: 7, title: "Manipulation de phonèmes", activities: [
        { id: 71, name: "Fiche Manipulation", fileName: "/assets/resources/resource-7-a.pdf", description: "Fiche sur la manipulation de phonèmes." },
        { id: 72, name: "Exercices Manipulation", fileName: "/assets/resources/resource-7-b.pdf", description: "Exercices pratiques sur la manipulation de phonèmes." },
        { id: 73, name: "Corrigé Manipulation", fileName: "/assets/resources/resource-7-c.pdf", description: "Corrigé des exercices de manipulation." },
      ] },
      { id: 8, title: "Identification de sons", activities: [
        { id: 81, name: "Fiche Identification", fileName: "/assets/resources/resource-8-a.pdf", description: "Fiche sur l'identification des sons." },
        { id: 82, name: "Exercices Identification", fileName: "/assets/resources/resource-8-b.pdf", description: "Exercices pratiques pour l'identification des sons." },
        { id: 83, name: "Corrigé Identification", fileName: "/assets/resources/resource-8-c.pdf", description: "Corrigé des exercices d'identification." },
      ] },
      { id: 9, title: "Comptage de syllabes", activities: [
        { id: 91, name: "Fiche Comptage", fileName: "/assets/resources/resource-9-a.pdf", description: "Fiche expliquant le comptage de syllabes." },
        { id: 92, name: "Exercices Comptage", fileName: "/assets/resources/resource-9-b.pdf", description: "Exercices pratiques pour le comptage de syllabes." },
        { id: 93, name: "Corrigé Comptage", fileName: "/assets/resources/resource-9-c.pdf", description: "Corrigé des exercices de comptage." },
      ] },
    ],
  },
  {
    id: 2,
    title: "Connaissance alphabétique",
    color: "#38bdf8",
    resources: [
      { id: 10, title: "Voyelles", activities: [
        { id: 101, name: "Fiche Voyelles", fileName: "/assets/resources/resource-10-a.pdf", description: "Fiche sur les voyelles." },
        { id: 102, name: "Exercices Voyelles", fileName: "/assets/resources/resource-10-b.pdf", description: "Exercices pratiques sur les voyelles." },
        { id: 103, name: "Corrigé Voyelles", fileName: "/assets/resources/resource-10-c.pdf", description: "Corrigé des exercices sur les voyelles." },
      ] },
      { id: 11, title: "Consonnes", activities: [
        { id: 111, name: "Fiche Consonnes", fileName: "/assets/resources/resource-11-a.pdf", description: "Fiche sur les consonnes." },
        { id: 112, name: "Exercices Consonnes", fileName: "/assets/resources/resource-11-b.pdf", description: "Exercices pratiques sur les consonnes." },
        { id: 113, name: "Corrigé Consonnes", fileName: "/assets/resources/resource-11-c.pdf", description: "Corrigé des exercices sur les consonnes." },
      ] },
      { id: 12, title: "Lecture de CV", activities: [
        { id: 121, name: "Fiche Lecture CV", fileName: "/assets/resources/resource-12-a.pdf", description: "Fiche sur la lecture CV." },
        { id: 122, name: "Exercices Lecture CV", fileName: "/assets/resources/resource-12-b.pdf", description: "Exercices pratiques sur la lecture CV." },
        { id: 123, name: "Corrigé Lecture CV", fileName: "/assets/resources/resource-12-c.pdf", description: "Corrigé des exercices CV." },
      ] },
      { id: 13, title: "Lecture VC", activities: [
        { id: 131, name: "Fiche Lecture VC", fileName: "/assets/resources/resource-13-a.pdf", description: "Fiche sur la lecture VC." },
        { id: 132, name: "Exercices Lecture VC", fileName: "/assets/resources/resource-13-b.pdf", description: "Exercices pratiques sur la lecture VC." },
        { id: 133, name: "Corrigé Lecture VC", fileName: "/assets/resources/resource-13-c.pdf", description: "Corrigé des exercices VC." },
      ] },
      { id: 14, title: "Lecture CVC", activities: [
        { id: 141, name: "Fiche Lecture CVC", fileName: "/assets/resources/resource-14-a.pdf", description: "Fiche sur la lecture CVC." },
        { id: 142, name: "Exercices Lecture CVC", fileName: "/assets/resources/resource-14-b.pdf", description: "Exercices pratiques sur la lecture CVC." },
        { id: 143, name: "Corrigé Lecture CVC", fileName: "/assets/resources/resource-14-c.pdf", description: "Corrigé des exercices CVC." },
      ] },
      { id: 15, title: "Reconnaissance de lettres", activities: [
        { id: 151, name: "Fiche Reconnaissance", fileName: "/assets/resources/resource-15-a.pdf", description: "Fiche sur la reconnaissance de lettres." },
        { id: 152, name: "Exercices Reconnaissance", fileName: "/assets/resources/resource-15-b.pdf", description: "Exercices pratiques sur la reconnaissance de lettres." },
        { id: 153, name: "Corrigé Reconnaissance", fileName: "/assets/resources/resource-15-c.pdf", description: "Corrigé des exercices de reconnaissance." },
      ] },
    ],
  },
  {
    id: 3,
    title: "Décodage",
    color: "#fbbf24",
    resources: [
      { id: 16, title: "Syllabes ouvertes", activities: [
        { id: 161, name: "Fiche Syllabes ouvertes", fileName: "/assets/resources/resource-16-a.pdf", description: "Fiche sur les syllabes ouvertes." },
        { id: 162, name: "Exercices Syllabes ouvertes", fileName: "/assets/resources/resource-16-b.pdf", description: "Exercices pratiques sur les syllabes ouvertes." },
        { id: 163, name: "Corrigé Syllabes ouvertes", fileName: "/assets/resources/resource-16-c.pdf", description: "Corrigé des exercices sur les syllabes ouvertes." },
      ] },
      { id: 17, title: "Syllabes fermées", activities: [
        { id: 171, name: "Fiche Syllabes fermées", fileName: "/assets/resources/resource-17-a.pdf", description: "Fiche sur les syllabes fermées." },
        { id: 172, name: "Exercices Syllabes fermées", fileName: "/assets/resources/resource-17-b.pdf", description: "Exercices pratiques sur les syllabes fermées." },
        { id: 173, name: "Corrigé Syllabes fermées", fileName: "/assets/resources/resource-17-c.pdf", description: "Corrigé des exercices sur les syllabes fermées." },
      ] },
      { id: 18, title: "Mots fréquents", activities: [
        { id: 181, name: "Fiche Mots fréquents", fileName: "/assets/resources/resource-18-a.pdf", description: "Fiche sur les mots fréquents." },
        { id: 182, name: "Exercices Mots fréquents", fileName: "/assets/resources/resource-18-b.pdf", description: "Exercices pratiques sur les mots fréquents." },
        { id: 183, name: "Corrigé Mots fréquents", fileName: "/assets/resources/resource-18-c.pdf", description: "Corrigé des exercices sur les mots fréquents." },
      ] },
      { id: 19, title: "Les sons complexes", activities: [
        { id: 191, name: "Fiche Sons complexes", fileName: "/assets/resources/resource-19-a.pdf", description: "Fiche sur les sons complexes." },
        { id: 192, name: "Exercices Sons complexes", fileName: "/assets/resources/resource-19-b.pdf", description: "Exercices pratiques sur les sons complexes." },
        { id: 193, name: "Corrigé Sons complexes", fileName: "/assets/resources/resource-19-c.pdf", description: "Corrigé des exercices sur les sons complexes." },
      ] },
      { id: 20, title: "Familles de mots", activities: [
        { id: 201, name: "Fiche Familles", fileName: "/assets/resources/resource-20-a.pdf", description: "Fiche sur les familles de mots." },
        { id: 202, name: "Exercices Familles", fileName: "/assets/resources/resource-20-b.pdf", description: "Exercices pratiques sur les familles de mots." },
        { id: 203, name: "Corrigé Familles", fileName: "/assets/resources/resource-20-c.pdf", description: "Corrigé des exercices sur les familles de mots." },
      ] },
      { id: 21, title: "Sons muets", activities: [
        { id: 211, name: "Fiche Sons muets", fileName: "/assets/resources/resource-21-a.pdf", description: "Fiche sur les sons muets." },
        { id: 212, name: "Exercices Sons muets", fileName: "/assets/resources/resource-21-b.pdf", description: "Exercices pratiques sur les sons muets." },
        { id: 213, name: "Corrigé Sons muets", fileName: "/assets/resources/resource-21-c.pdf", description: "Corrigé des exercices sur les sons muets." },
      ] },
    ],
  },
  {
    id: 4,
    title: "Fluidité",
    color: "#a855f7",
    resources: [
      { id: 22, title: "Phrases simples", activities: [
        { id: 221, name: "Fiche Phrases simples", fileName: "/assets/resources/resource-22-a.pdf", description: "Fiche sur les phrases simples." },
        { id: 222, name: "Exercices Phrases simples", fileName: "/assets/resources/resource-22-b.pdf", description: "Exercices pratiques sur les phrases simples." },
        { id: 223, name: "Corrigé Phrases simples", fileName: "/assets/resources/resource-22-c.pdf", description: "Corrigé des exercices sur les phrases simples." },
      ] },
      { id: 23, title: "Phrases pyramides", activities: [
        { id: 231, name: "Fiche Pyramides", fileName: "/assets/resources/resource-23-a.pdf", description: "Fiche sur les phrases pyramides." },
        { id: 232, name: "Exercices Pyramides", fileName: "/assets/resources/resource-23-b.pdf", description: "Exercices pratiques sur les phrases pyramides." },
        { id: 233, name: "Corrigé Pyramides", fileName: "/assets/resources/resource-23-c.pdf", description: "Corrigé des exercices pyramides." },
      ] },
      { id: 24, title: "Lecture de textes", activities: [
        { id: 241, name: "Fiche Lecture textes", fileName: "/assets/resources/resource-24-a.pdf", description: "Fiche sur la lecture de textes." },
        { id: 242, name: "Exercices Lecture textes", fileName: "/assets/resources/resource-24-b.pdf", description: "Exercices pratiques sur la lecture de textes." },
        { id: 243, name: "Corrigé Lecture textes", fileName: "/assets/resources/resource-24-c.pdf", description: "Corrigé des exercices de lecture." },
      ] },
      { id: 25, title: "Pratique de fluidité", activities: [
        { id: 251, name: "Fiche Fluidité", fileName: "/assets/resources/resource-25-a.pdf", description: "Fiche sur la pratique de fluidité." },
        { id: 252, name: "Exercices Fluidité", fileName: "/assets/resources/resource-25-b.pdf", description: "Exercices pratiques de fluidité." },
        { id: 253, name: "Corrigé Fluidité", fileName: "/assets/resources/resource-25-c.pdf", description: "Corrigé des exercices de fluidité." },
      ] },
      { id: 26, title: "Lecture répétée", activities: [
        { id: 261, name: "Fiche Lecture répétée", fileName: "/assets/resources/resource-26-a.pdf", description: "Fiche sur la lecture répétée." },
        { id: 262, name: "Exercices Lecture répétée", fileName: "/assets/resources/resource-26-b.pdf", description: "Exercices pratiques de lecture répétée." },
        { id: 263, name: "Corrigé Lecture répétée", fileName: "/assets/resources/resource-26-c.pdf", description: "Corrigé des exercices de lecture répétée." },
      ] },
      { id: 27, title: "Lecture en tandem", activities: [
        { id: 271, name: "Fiche Lecture tandem", fileName: "/assets/resources/resource-27-a.pdf", description: "Fiche sur la lecture en tandem." },
        { id: 272, name: "Exercices Lecture tandem", fileName: "/assets/resources/resource-27-b.pdf", description: "Exercices pratiques pour la lecture en tandem." },
        { id: 273, name: "Corrigé Lecture tandem", fileName: "/assets/resources/resource-27-c.pdf", description: "Corrigé des exercices en tandem." },
      ] },
    ],
  },
  {
    id: 5,
    title: "Compréhension",
    color: "#0ea5e9",
    resources: [
      { id: 28, title: "Compréhension de texte", activities: [
        { id: 281, name: "Fiche Compréhension", fileName: "/assets/resources/resource-28-a.pdf", description: "Fiche sur la compréhension de texte." },
        { id: 282, name: "Exercices Compréhension", fileName: "/assets/resources/resource-28-b.pdf", description: "Exercices pratiques de compréhension." },
        { id: 283, name: "Corrigé Compréhension", fileName: "/assets/resources/resource-28-c.pdf", description: "Corrigé des exercices de compréhension." },
      ] },
      { id: 29, title: "Inférence", activities: [
        { id: 291, name: "Fiche Inférence", fileName: "/assets/resources/resource-29-a.pdf", description: "Fiche sur l'inférence." },
        { id: 292, name: "Exercices Inférence", fileName: "/assets/resources/resource-29-b.pdf", description: "Exercices pratiques sur l'inférence." },
        { id: 293, name: "Corrigé Inférence", fileName: "/assets/resources/resource-29-c.pdf", description: "Corrigé des exercices d'inférence." },
      ] },
      { id: 30, title: "Résumé", activities: [
        { id: 301, name: "Fiche Résumé", fileName: "/assets/resources/resource-30-a.pdf", description: "Fiche sur la rédaction de résumés." },
        { id: 302, name: "Exercices Résumé", fileName: "/assets/resources/resource-30-b.pdf", description: "Exercices pratiques sur le résumé." },
        { id: 303, name: "Corrigé Résumé", fileName: "/assets/resources/resource-30-c.pdf", description: "Corrigé des exercices de résumé." },
      ] },
      { id: 31, title: "Idées principales", activities: [
        { id: 311, name: "Fiche Idées principales", fileName: "/assets/resources/resource-31-a.pdf", description: "Fiche sur l'identification des idées principales." },
        { id: 312, name: "Exercices Idées principales", fileName: "/assets/resources/resource-31-b.pdf", description: "Exercices pratiques sur les idées principales." },
        { id: 313, name: "Corrigé Idées principales", fileName: "/assets/resources/resource-31-c.pdf", description: "Corrigé des exercices sur les idées principales." },
      ] },
      { id: 32, title: "Questions littérales", activities: [
        { id: 321, name: "Fiche Questions littérales", fileName: "/assets/resources/resource-32-a.pdf", description: "Fiche sur les questions littérales." },
        { id: 322, name: "Exercices Questions littérales", fileName: "/assets/resources/resource-32-b.pdf", description: "Exercices pratiques sur les questions littérales." },
        { id: 323, name: "Corrigé Questions littérales", fileName: "/assets/resources/resource-32-c.pdf", description: "Corrigé des exercices de questions littérales." },
      ] },
      { id: 33, title: "Prédictions", activities: [
        { id: 331, name: "Fiche Prédictions", fileName: "/assets/resources/resource-33-a.pdf", description: "Fiche sur les prédictions." },
        { id: 332, name: "Exercices Prédictions", fileName: "/assets/resources/resource-33-b.pdf", description: "Exercices pratiques sur les prédictions." },
        { id: 333, name: "Corrigé Prédictions", fileName: "/assets/resources/resource-33-c.pdf", description: "Corrigé des exercices de prédictions." },
      ] },
    ],
  },
];