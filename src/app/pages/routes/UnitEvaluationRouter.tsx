import React, { Suspense } from "react";
import { useParams, Link } from "react-router";
import { UnitOneEvaluationOne } from "../../components/Units/1/UnitOneEvaluation1";
import { UnitOneEvaluationTwo } from "../../components/Units/1/UnitOneEvaluation2";
import { UnitOneEvaluationThree } from "../../components/Units/1/UnitOneEvaluation3";
import { UnitOneEvaluationFour } from "../../components/Units/1/UnitOneEvaluation4";
import { UnitOneEvaluationFive } from "../../components/Units/1/UnitOneEvaluation5";
import { UnitOneEvaluationSix } from "../../components/Units/1/UnitOneEvaluation6";
import { UnitTwoEvaluationSeven } from "../../components/Units/2/UnitTwoEvaluation7";
import { UnitThreeEvaluationEight } from "../../components/Units/3/UnitThreeEvaluation8";
import { UnitFourEvaluationNine } from "../../components/Units/4/UnitFourEvaluation9";
import { UnitFiveEvaluationTen } from "../../components/Units/5/UnitFiveEvaluation10";
import { UnitSixEvaluationEleven } from "../../components/Units/6/UnitSixEvaluation11";
import { UnitSevenEvaluationTwelve } from "../../components/Units/7/UnitSevenEvaluation12";
import { UnitEightEvaluationThirteen } from "../../components/Units/8/UnitEightEvaluation13";
import { UnitNineEvaluationFourteen } from "../../components/Units/9/UnitNineEvaluation14";
import { UnitTenEvaluationFifteen } from "../../components/Units/10/UnitTenEvaluation15";

// Future evaluations should export a named component (e.g. `export function EvaluationTwo() {}`)
// and live next to `EvalationOne.tsx` as `EvaluationTwo.tsx`. The lazy import below
// will attempt to load it when unitId === "2".
// const EvaluationTwo = lazy(() =>
//   import("./EvaluationTwo").then((m) => ({ default: m.EvaluationTwo })),
// );

const componentMap: Record<string, React.ComponentType<any>> = {
  "1": UnitOneEvaluationOne,
  "2": UnitOneEvaluationTwo,
  "3": UnitOneEvaluationThree,
  "4": UnitOneEvaluationFour,
  "5": UnitOneEvaluationFive,
  "6": UnitOneEvaluationSix,
  "7": UnitTwoEvaluationSeven,
  "8": UnitThreeEvaluationEight,
  "9": UnitFourEvaluationNine,
  "10": UnitFiveEvaluationTen,
  "11": UnitSixEvaluationEleven,
  "12": UnitSevenEvaluationTwelve,
  "13": UnitEightEvaluationThirteen,
  "14": UnitNineEvaluationFourteen,
  "15": UnitTenEvaluationFifteen,
};

export function UnitEvaluationRouter() {
  const params = useParams() as {
    classId: string;
    studentId: string;
    evaluationId: string;
  };
  const { evaluationId, classId, studentId } = params;

  if (!evaluationId) return <div className="p-6">Evaluation not specified</div>;

  const Comp = componentMap[evaluationId];
  if (!Comp) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold">Evaluation not implemented</h2>
        <p className="mt-2">
          Evaluation for student {studentId}'s evaluation {evaluationId} is not
          available yet.
        </p>
        <div className="mt-4">
          <Link
            to={`/teacher/class/${classId ?? ""}`}
            className="text-blue-600 underline"
          >
            Back to class
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="p-6">Loading evaluation…</div>}>
      <Comp />
    </Suspense>
  );
}

export default UnitEvaluationRouter;
