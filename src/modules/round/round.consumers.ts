import { AckOrNack } from "rascal";
import { action, log } from "actionhero";

/**
 *
 */
export async function roundPhaseEndConsumer(
  message,
  content,
  ackOrNack: AckOrNack
) {
  try {
    const round = await action.run("roundEnd", undefined, {
      id: content.round.id,
    });
    ackOrNack();
  } catch (e) {
    log("roundPhaseEndConsumer error", "error", { error: e });
    ackOrNack(e);
  }
}

/**
 *
 */
export async function roundPhaseCancelConsumer(
  message,
  content,
  ackOrNack: AckOrNack
) {
  try {
    const round = await action.run("roundCancelPhase", undefined, {
      gameId: content.round.gameId,
      id: content.round.id,
    });
    ackOrNack();
  } catch (e) {
    log("roundPhaseCancelConsumer error", "error", { error: e });
    ackOrNack(e);
  }
}
