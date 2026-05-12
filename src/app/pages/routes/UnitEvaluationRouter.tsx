import React, { Suspense } from "react";
import { useParams, Link } from "react-router";
import { UnitOneEvaluationOne } from "../../components/Units/1-one/UnitOneEvaluationOne";
import { UnitOneEvaluationTwo } from "../../components/Units/1-one/UnitOneEvaluationTwo";
import { UnitOneEvaluationThree } from "../../components/Units/1-one/UnitOneEvaluationThree";
import { UnitOneEvaluationFour } from "../../components/Units/1-one/UnitOneEvaluationFour";
import { UnitTwoEvaluationFive } from "../../components/Units/2-two/UnitTwoEvaluationFive";
import { UnitThreeEvaluationSix } from "../../components/Units/3-three/UnitThreeEvaluationSix";
import { UnitFourEvaluationSeven } from "../../components/Units/4-four/UnitFourEvaluationSeven";
import { UnitFiveEvaluationEight } from "../../components/Units/5-five/UnitFiveEvaluationEight";
import { UnitSixEvaluationNine } from "../../components/Units/6-six/UnitSixEvaluationNine";
import { UnitSevenEvaluationTen } from "../../components/Units/7-seven/UnitSevenEvaluationTen";
import { UnitEightEvaluationEleven } from "../../components/Units/8-eight/UnitEightEvaluationEleven";
import { UnitNineEvaluationTwelve } from "../../components/Units/9-nine/UnitNineEvaluationTwelve";
import { UnitTenEvaluationThirteen } from "../../components/Units/10-ten/UnitTenEvaluationThirteen";

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
  "5": UnitTwoEvaluationFive,
  "6": UnitThreeEvaluationSix,
  "7": UnitFourEvaluationSeven,
  "8": UnitFiveEvaluationEight,
  "9": UnitSixEvaluationNine,
  "10": UnitSevenEvaluationTen,
  "11": UnitEightEvaluationEleven,
  "12": UnitNineEvaluationTwelve,
  "13": UnitTenEvaluationThirteen,
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
