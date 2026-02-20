import React from "react";

const LoadingSpinner = ({ size = 40, message = "Loading..." }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        padding: "60px 20px",
      }}
      className="animate-fadeIn"
    >
      <div
        style={{
          width: size,
          height: size,
          border: "3.5px solid var(--light-gray)",
          borderTopColor: "var(--green)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      {message && (
        <span
          style={{
            color: "var(--text-muted)",
            fontSize: "0.88rem",
            fontWeight: 500,
          }}
        >
          {message}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
