type ScoreStatus = "success" | "adequate" | "needs-improvement";

function scoreToStatus(score: number): ScoreStatus {
  if (score >= 85) return "success";
  if (score >= 70) return "adequate";
  return "needs-improvement";
}

function collectBooleans(input: unknown, out: Array<boolean | null>) {
  if (input === null) {
    out.push(null);
    return;
  }

  if (typeof input === "boolean") {
    out.push(input);
    return;
  }

  if (Array.isArray(input)) {
    input.forEach((v) => collectBooleans(v, out));
    return;
  }

  if (typeof input === "object" && input !== null) {
    for (const key of Object.keys(input as Record<string, unknown>)) {
      // @ts-ignore - dynamic access
      collectBooleans((input as any)[key], out);
    }
    return;
  }

  // ignore other types (numbers, strings, undefined)
}

export function getScoreFromEvaluations(values: unknown): ScoreStatus | null {
  const collected: Array<boolean | null> = [];
  collectBooleans(values, collected);

  if (collected.length === 0) return null;

  // If no item has been answered (all null or non-boolean), return null
  const hasAnswered = collected.some((v) => v === true || v === false);
  if (!hasAnswered) return null;

  const trueCount = collected.reduce((count, value) => (value === true ? count + 1 : count), 0);

  const averageScore = (trueCount / collected.length) * 100;
  return scoreToStatus(averageScore);
}

export default getScoreFromEvaluations;