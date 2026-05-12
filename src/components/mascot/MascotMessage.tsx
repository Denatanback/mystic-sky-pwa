import { Mascot } from "./Mascot";
import type { MascotPose } from "./Mascot";
import "./mascot.css";

export function MascotMessage({ children, pose = "sitting" }: { children: React.ReactNode; pose?: MascotPose }) {
  return (
    <div className="mascot-message">
      <Mascot pose={pose} />
      <div className="mascot-bubble">
        {children}
      </div>
    </div>
  );
}
