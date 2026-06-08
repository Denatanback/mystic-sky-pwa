// Node progress tracking (localStorage → future: DB)
const KEY = "eluna.nodeProgress";

export type NodeState = {
  status: "locked" | "started" | "completed";
  result?: Record<string, unknown>;  // quiz result, calculated value, etc.
  startedAt?: string;
  completedAt?: string;
  nextUnlockAt?: string;
};

type ProgressStore = Record<string, NodeState>; // key: "{discipline}:{nodeId}"

function load(): ProgressStore {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(KEY) ?? "{}"); } catch { return {}; }
}
function save(store: ProgressStore) {
  localStorage.setItem(KEY, JSON.stringify(store));
}

function keyFor(discipline: string, nodeId: number) {
  return `${discipline}:${nodeId}`;
}

function nextLocalCalendarDayIso() {
  const next = new Date();
  next.setDate(next.getDate() + 1);
  next.setHours(0, 0, 0, 0);
  return next.toISOString();
}

function isFuture(value?: string) {
  if (!value) return false;
  const time = new Date(value).getTime();
  return Number.isFinite(time) && time > Date.now();
}

export function getNodeState(discipline: string, nodeId: number): NodeState {
  return load()[keyFor(discipline, nodeId)] ?? { status: "locked" };
}

export function startNode(discipline: string, nodeId: number) {
  const store = load();
  const k = keyFor(discipline, nodeId);
  if (store[k]?.status === "completed") return; // never downgrade
  store[k] = { ...store[k], status: "started", startedAt: store[k]?.startedAt ?? new Date().toISOString() };
  save(store);
}

export function completeNode(discipline: string, nodeId: number, result?: Record<string, unknown>) {
  const store = load();
  const k = keyFor(discipline, nodeId);
  const existing = store[k];
  const alreadyCompleted = existing?.status === "completed";
  store[k] = {
    status: "completed",
    result,
    startedAt: existing?.startedAt,
    completedAt: existing?.completedAt ?? new Date().toISOString(),
    nextUnlockAt: existing?.nextUnlockAt,
  };

  const nextNodeId = nodeId + 1;
  const nextKey = keyFor(discipline, nextNodeId);
  const nextState = store[nextKey];
  if (!alreadyCompleted && nextNodeId <= 8 && nextState?.status !== "completed") {
    store[nextKey] = {
      ...nextState,
      status: nextState?.status === "started" ? "started" : "locked",
      nextUnlockAt: nextState?.nextUnlockAt ?? nextLocalCalendarDayIso(),
    };
  }
  save(store);
}

export function getNodeResult<T = Record<string, unknown>>(discipline: string, nodeId: number): T | undefined {
  return load()[`${discipline}:${nodeId}`]?.result as T | undefined;
}

export function isNodeLocked(discipline: string, nodeId: number): boolean {
  if (nodeId === 1) return false; // first node always open
  const state = getNodeState(discipline, nodeId);
  if (state.status === "completed") return false;
  if (isFuture(state.nextUnlockAt)) return true;
  const prev = getNodeState(discipline, nodeId - 1);
  return prev.status !== "completed";
}

export function isNodeCoolingDown(discipline: string, nodeId: number): boolean {
  if (nodeId === 1) return false;
  const state = getNodeState(discipline, nodeId);
  if (state.status === "completed") return false;
  const prev = getNodeState(discipline, nodeId - 1);
  return prev.status === "completed" && isFuture(state.nextUnlockAt);
}

export function getNodeCooldownUnlockAt(discipline: string, nodeId: number): string | null {
  return isNodeCoolingDown(discipline, nodeId) ? getNodeState(discipline, nodeId).nextUnlockAt ?? null : null;
}

export function getNodeProgressStatus(discipline: string, nodeId: number): "completed" | "available" | "cooldown" | "locked" {
  const state = getNodeState(discipline, nodeId);
  if (state.status === "completed") return "completed";
  if (nodeId === 1) return "available";
  const prev = getNodeState(discipline, nodeId - 1);
  if (prev.status !== "completed") return "locked";
  if (isFuture(state.nextUnlockAt)) return "cooldown";
  return "available";
}

/** Wipe all node progress — call on new account creation or sign-out */
export function clearProgress() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
