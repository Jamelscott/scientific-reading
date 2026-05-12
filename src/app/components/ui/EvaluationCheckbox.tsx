type EvaluationCheckboxProps = {
  value: boolean | null;
  onCheck: () => void;
  onFail: () => void;
};

export function EvaluationCheckbox({
  value,
  onCheck,
  onFail,
}: EvaluationCheckboxProps) {
  const displayValue = value === true ? "check" : value === false ? "x" : null;
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={onCheck}
        className="w-5 h-5 rounded flex items-center justify-center cursor-pointer transition-all"
        style={{
          border: `2px solid ${displayValue === "check" ? "#2e7d32" : "#ccc"}`,
          background: displayValue === "check" ? "#e8f5e9" : "#ffffff",
        }}
      >
        {displayValue === "check" && (
          <span style={{ color: "#2e7d32", fontSize: "12px" }}>✓</span>
        )}
      </button>
      <button
        onClick={onFail}
        className="w-5 h-5 rounded flex items-center justify-center cursor-pointer transition-all"
        style={{
          border: `2px solid ${displayValue === "x" ? "#d32f2f" : "#ccc"}`,
          background: displayValue === "x" ? "#ffebee" : "#ffffff",
        }}
      >
        {displayValue === "x" && (
          <span style={{ color: "#d32f2f", fontSize: "12px" }}>✗</span>
        )}
      </button>
    </div>
  );
}
