import { skyPaths } from "@/data/paths";

export function SkyMiniProgress() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "6px", textAlign: "center" }}>
      {skyPaths.map((path) => (
        <div key={path.id}>
          <div
            style={{
              width: 36, height: 36,
              borderRadius: "50%",
              border: `1px solid ${path.color}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 6px",
              fontSize: 14,
              color: path.color,
              background: "rgba(0,0,0,0.25)",
              boxShadow: `0 0 8px ${path.color}44`,
            }}
          >
            {path.icon}
          </div>
          <div className="progress-track" style={{ marginBottom: 4 }}>
            <div className="progress-fill" style={{ width: `${path.progress}%`, background: path.color }} />
          </div>
          <p style={{ fontSize: 9, lineHeight: 1.2, color: "#c8b48a", marginTop: 2 }}>
            {path.shortTitle}
          </p>
        </div>
      ))}
    </div>
  );
}
