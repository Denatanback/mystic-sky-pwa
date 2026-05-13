// Node progress tracking (localStorage → future: DB)
const KEY = "eluna.nodeProgress";

export type NodeState = {
  status: "locked" | "started" | "completed";
  result?: Record<string, unknown>;  // quiz result, calculated value, etc.
  startedAt?: string;
  completedAt?: string;
};

type ProgressStore = Record<string, NodeState>; // key: "{discipline}:{nodeId}"

function load(): ProgressStore {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(KEY) ?? "{}"); } catch { return {}; }
}
function save(store: ProgressStore) {
  localStorage.setItem(KEY, JSON.stringify(store));
}

export function getNodeState(discipline: string, nodeId: number): NodeState {
  return load()[`${discipline}:${nodeId}`] ?? { status: "locked" };
}

export function startNode(discipline: string, nodeId: number) {
  const store = load();
  const k = `${discipline}:${nodeId}`;
  if (store[k]?.status === "completed") return; // never downgrade
  store[k] = { ...store[k], status: "started", startedAt: store[k]?.startedAt ?? new Date().toISOString() };
  save(store);
}

export function completeNode(discipline: string, nodeId: number, result?: Record<string, unknown>) {
  const store = load();
  const k = `${discipline}:${nodeId}`;
  store[k] = { status: "completed", result, startedAt: store[k]?.startedAt, completedAt: new Date().toISOString() };
  save(store);
}

export function getNodeResult<T = Record<string, unknown>>(discipline: string, nodeId: number): T | undefined {
  return load()[`${discipline}:${nodeId}`]?.result as T | undefined;
}

export function isNodeLocked(discipline: string, nodeId: number): boolean {
  if (nodeId === 1) return false; // first node always open
  const prev = getNodeState(discipline, nodeId - 1);
  return prev.status !== "completed";
}

/** Wipe all node progress — call on new account creation or sign-out */
export function clearProgress() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
