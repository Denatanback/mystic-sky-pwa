import { CelestialBackground } from "@/components/background/CelestialBackground";
import { BottomNav } from "@/components/app-shell/BottomNav";

type Props = {
  children: React.ReactNode;
  showNav?: boolean;
  contentClass?: string;
};

export function AppShell({ children, showNav = true, contentClass }: Props) {
  return (
    <main className="app-frame">
      <CelestialBackground />
      <div className={contentClass ?? "app-content"}>{children}</div>
      {showNav && <BottomNav />}
    </main>
  );
}
