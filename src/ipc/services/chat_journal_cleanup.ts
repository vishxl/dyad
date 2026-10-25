import { rm } from "node:fs/promises";
import path from "node:path";
import { getUserDataPath } from "@/paths/paths";
import { deleteQuestionnaires } from "@/user_input/questionnaire_journal";
import {
  NextBillionError,
  NextBillionErrorKind,
} from "@/errors/nextbillion_error";

/** The caller fences and drains chat/input/handoff owners before cleanup.
 * Fail before deleting DB history so a filesystem failure remains retryable. */
export async function deleteChatJournals(chatId: number): Promise<void> {
  if (!Number.isSafeInteger(chatId) || chatId <= 0)
    throw new NextBillionError(
      "Invalid chat identity",
      NextBillionErrorKind.Validation,
    );
  const results = await Promise.allSettled([
    deleteQuestionnaires(chatId),
    ...["plan-handoffs", "claude-sessions"].flatMap((directory) =>
      [".json", ".json.tmp"].map((suffix) =>
        rm(path.join(getUserDataPath(), directory, `${chatId}${suffix}`), {
          force: true,
        }),
      ),
    ),
  ]);
  for (const result of results)
    if (result.status === "rejected") throw result.reason;
}
