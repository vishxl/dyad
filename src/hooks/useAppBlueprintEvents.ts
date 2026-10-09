import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { appBlueprintStateAtom } from "@/atoms/appBlueprintAtoms";
import {
  appBlueprintEventClient,
  appBlueprintClient,
  type AppBlueprintUpdatePayload,
  type AppBlueprintVisualsUpdatePayload,
  type AppBlueprintApprovedPayload,
  type AppBlueprintTimeoutPayload,
} from "@/ipc/types/app_blueprint";

/**
 * Hook to handle app blueprint IPC events.
 * Should be called at the app root level to listen for app blueprint events.
 */
export function useAppBlueprintEvents() {
  const setAppBlueprintState = useSetAtom(appBlueprintStateAtom);

  useEffect(() => {
    // Rehydrate blueprints that already exist in the main-process store. The
    // live events below only populate state from the moment of subscription,
    // so after a page reload every pending blueprint card would otherwise sit
    // empty ("Blueprint data is unavailable") until the agent re-emits one.
    // Only fill gaps — a live event may have arrived while this fetch was in
    // flight, and the fresher event data must win.
    void appBlueprintClient.getState().then((entries) => {
      if (!entries.length) return;
      setAppBlueprintState((prev) => {
        const nextPlans = new Map(prev.plansByChatId);
        const nextApproved = new Set(prev.approvedChatIds);
        for (const entry of entries) {
          if (!nextPlans.has(entry.chatId)) {
            nextPlans.set(entry.chatId, entry.data);
          }
          if (entry.approved) {
            nextApproved.add(entry.chatId);
          } else {
            nextApproved.delete(entry.chatId);
          }
        }
        return {
          ...prev,
          plansByChatId: nextPlans,
          approvedChatIds: nextApproved,
        };
      });
    });
  }, [setAppBlueprintState]);

  useEffect(() => {
    const unsubscribeUpdate = appBlueprintEventClient.onUpdate(
      (payload: AppBlueprintUpdatePayload) => {
        setAppBlueprintState((prev) => {
          const nextPlans = new Map(prev.plansByChatId);
          nextPlans.set(payload.chatId, payload.data);
          // A fresh blueprint update supersedes any prior timeout and
          // approval state for this chat — otherwise a regenerated
          // blueprint could stay stuck as "timed out" or remain in the
          // approved UI state even though main-process state was just
          // reset to `approved: false`.
          const nextTimedOut = new Set(prev.timedOutChatIds);
          nextTimedOut.delete(payload.chatId);
          const nextApproved = new Set(prev.approvedChatIds);
          nextApproved.delete(payload.chatId);
          return {
            ...prev,
            plansByChatId: nextPlans,
            timedOutChatIds: nextTimedOut,
            approvedChatIds: nextApproved,
          };
        });
      },
    );

    const unsubscribeVisualsUpdate = appBlueprintEventClient.onVisualsUpdate(
      (payload: AppBlueprintVisualsUpdatePayload) => {
        setAppBlueprintState((prev) => {
          const nextPlans = new Map(prev.plansByChatId);
          const existingPlan = nextPlans.get(payload.chatId);
          if (existingPlan) {
            nextPlans.set(payload.chatId, {
              ...existingPlan,
              visuals: payload.visuals,
            });
          }
          return {
            ...prev,
            plansByChatId: nextPlans,
          };
        });
      },
    );

    const unsubscribeApproved = appBlueprintEventClient.onApproved(
      (payload: AppBlueprintApprovedPayload) => {
        setAppBlueprintState((prev) => {
          const nextApproved = new Set(prev.approvedChatIds);
          nextApproved.add(payload.chatId);
          return {
            ...prev,
            approvedChatIds: nextApproved,
          };
        });
      },
    );

    const unsubscribeTimeout = appBlueprintEventClient.onTimeout(
      (payload: AppBlueprintTimeoutPayload) => {
        setAppBlueprintState((prev) => {
          const nextTimedOut = new Set(prev.timedOutChatIds);
          nextTimedOut.add(payload.chatId);
          return {
            ...prev,
            timedOutChatIds: nextTimedOut,
          };
        });
      },
    );

    return () => {
      unsubscribeUpdate();
      unsubscribeVisualsUpdate();
      unsubscribeApproved();
      unsubscribeTimeout();
    };
  }, [setAppBlueprintState]);
}
