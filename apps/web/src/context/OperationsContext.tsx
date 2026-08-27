import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  EventOperationsSnapshot,
  IntegrationHealthService,
  OperationsScope,
} from "@maskedmatch/contracts";

import {
  localOperationsGateway,
  OperationsGatewayError,
  type OperationsGateway,
} from "../services/operations-gateway";

const OperationsGatewayContext = createContext<OperationsGateway | null>(null);

export function OperationsProvider({
  children,
  gateway = localOperationsGateway,
}: PropsWithChildren<{ gateway?: OperationsGateway }>) {
  return (
    <OperationsGatewayContext.Provider value={gateway}>
      {children}
    </OperationsGatewayContext.Provider>
  );
}

export type OperationsResourceStatus = "loading" | "ready" | "error";
export type OperationsPendingAction = "pause" | "resume" | "broadcast" | "integration" | null;

interface EventOperationsResource {
  snapshot: EventOperationsSnapshot | null;
  status: OperationsResourceStatus;
  pendingAction: OperationsPendingAction;
  loadError: OperationsGatewayError | null;
  actionError: OperationsGatewayError | null;
  refresh: () => Promise<void>;
  clearActionError: () => void;
  pause: (reason: string, scope: OperationsScope) => Promise<boolean>;
  resume: (reason: string) => Promise<boolean>;
  broadcast: (message: string) => Promise<boolean>;
  recheckIntegration: (service: IntegrationHealthService) => Promise<boolean>;
}

function normalizeError(error: unknown): OperationsGatewayError {
  if (error instanceof OperationsGatewayError) return error;
  return new OperationsGatewayError(
    "STORAGE_UNAVAILABLE",
    error instanceof Error ? error.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
    true,
  );
}

function commandKey(): string {
  return crypto.randomUUID();
}

export function useEventOperations(eventId: string, actorId: string): EventOperationsResource {
  const gateway = useContext(OperationsGatewayContext);
  if (!gateway) throw new Error("useEventOperations must be used inside OperationsProvider");

  const [snapshot, setSnapshot] = useState<EventOperationsSnapshot | null>(null);
  const [status, setStatus] = useState<OperationsResourceStatus>("loading");
  const [pendingAction, setPendingAction] = useState<OperationsPendingAction>(null);
  const [loadError, setLoadError] = useState<OperationsGatewayError | null>(null);
  const [actionError, setActionError] = useState<OperationsGatewayError | null>(null);
  const requestVersion = useRef(0);

  const refresh = useCallback(async () => {
    const requestId = ++requestVersion.current;
    try {
      const next = await gateway.getEventOverview({ eventId, actorId });
      if (requestId !== requestVersion.current) return;
      setSnapshot(next);
      setLoadError(null);
      setStatus("ready");
    } catch (error) {
      if (requestId !== requestVersion.current) return;
      setLoadError(normalizeError(error));
      setStatus("error");
    }
  }, [actorId, eventId, gateway]);

  useEffect(() => {
    setSnapshot(null);
    setLoadError(null);
    setActionError(null);
    setStatus("loading");
    void refresh();
    return gateway.subscribe(eventId, () => void refresh());
  }, [eventId, gateway, refresh]);

  const execute = useCallback(
    async (
      action: Exclude<OperationsPendingAction, null>,
      command: (current: EventOperationsSnapshot) => Promise<EventOperationsSnapshot>,
    ) => {
      if (!snapshot || pendingAction) return false;
      setPendingAction(action);
      setActionError(null);
      try {
        const next = await command(snapshot);
        setSnapshot(next);
        setLoadError(null);
        setStatus("ready");
        return true;
      } catch (error) {
        const normalized = normalizeError(error);
        setActionError(normalized);
        if (normalized.code === "VERSION_CONFLICT") void refresh();
        return false;
      } finally {
        setPendingAction(null);
      }
    },
    [pendingAction, refresh, snapshot],
  );

  return useMemo(
    () => ({
      snapshot,
      status,
      pendingAction,
      loadError,
      actionError,
      refresh,
      clearActionError: () => setActionError(null),
      pause: (reason: string, scope: OperationsScope) =>
        execute("pause", (current) =>
          gateway.pauseEvent({
            eventId,
            actorId,
            reason,
            scope,
            expectedVersion: current.version,
            idempotencyKey: commandKey(),
          }),
        ),
      resume: (reason: string) =>
        execute("resume", (current) =>
          gateway.resumeEvent({
            eventId,
            actorId,
            reason,
            expectedVersion: current.version,
            idempotencyKey: commandKey(),
          }),
        ),
      broadcast: (message: string) =>
        execute("broadcast", (current) =>
          gateway.broadcastMessage({
            eventId,
            actorId,
            message,
            expectedVersion: current.version,
            idempotencyKey: commandKey(),
          }),
        ),
      recheckIntegration: (service: IntegrationHealthService) =>
        execute("integration", (current) =>
          gateway.recheckIntegration({
            eventId,
            actorId,
            service,
            expectedVersion: current.version,
            idempotencyKey: commandKey(),
          }),
        ),
    }),
    [
      actionError,
      actorId,
      eventId,
      execute,
      gateway,
      loadError,
      pendingAction,
      refresh,
      snapshot,
      status,
    ],
  );
}
