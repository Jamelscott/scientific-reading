interface EvaluationButtonProps {
  status: "success" | "adequate" | "needs-improvement" | null;
  onClick?: () => void;
  empty?: boolean;
}

export function EvaluationButton({
  status,
  onClick,
  empty,
}: EvaluationButtonProps) {
  const getStatusColor = (
    status: "success" | "adequate" | "needs-improvement" | null,
  ) => {
    if (status === "success") return "#c9e265";
    if (status === "adequate") return "#ffde59";
    if (status === "needs-improvement") return "#ff5757";
    return "#f8ffdb";
  };

  const getStatusText = (
    status: "success" | "adequate" | "needs-improvement" | null,
  ) => {
    if (status === "success") return "✓";
    if (status === "adequate") return "~";
    if (status === "needs-improvement") return "!";
    return "";
  };

  if (empty) {
    return (
      <button
        onClick={onClick}
        className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto transition-all hover:bg-gray-200 cursor-pointer"
        style={{
          background: "lightgrey",
          border: "1px dashed #cccccc",
        }}
      />
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-10 h-10 rounded-lg transition-all cursor-pointer"
      style={{
        background: getStatusColor(status),
        color: status === "success" ? "#000000" : "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        fontSize: "16px",
        fontWeight: "bold",
      }}
    >
      <span style={{ display: "block", marginTop: "-2px" }}>
        {getStatusText(status)}
      </span>
    </button>
  );
}
