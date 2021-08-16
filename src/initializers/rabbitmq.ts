import { BrokerAsPromised, BrokerConfig, withDefaultConfig } from "rascal";
import { api, Initializer, log } from "actionhero";
import {
  roundPhaseCancelConsumer,
  roundPhaseEndConsumer,
} from "../modules/round/round.consumers";

/**
 * Initialize a RabbitMQ broker
 */
export class RabbitMQ extends Initializer {
  constructor() {
    super();
    this.name = "RabbitMQ";
    this.loadPriority = 600;
    this.startPriority = 1000;
    this.stopPriority = 10000;
  }

  override async initialize() {
    const port = process.env.RABBITMQ_PORT || 5672;
    const hostname = process.env.RABBITMQ_HOST || "localhost";
    const user = process.env.RABBITMQ_USER || "guest";
    const password = process.env.RABBITMQ_PASS || "guest";

    const definitions: BrokerConfig = {
      vhosts: {
        "/": {
          connection: {
            port,
            hostname,
            user,
            password,
          },
          exchanges: ["round"],
          queues: {
            "round.phase_cancel": {},
            "round.phase_cancel_delay": {
              options: {
                deadLetterExchange: "round",
                deadLetterRoutingKey: "round.phase.cancel",
                messageTtl: 60000, // 1 min
              },
            },

            "round.phase_end": {},
            "round.phase_end_delay": {
              options: {
                deadLetterExchange: "round",
                deadLetterRoutingKey: "round.phase.end",
                messageTtl: 300000, // 5 min,
              },
            },
          },
          bindings: [
            "round[round.phase.cancel] -> round.phase_cancel",
            "round[round.delay.phase_cancel] -> round.phase_cancel_delay",

            "round[round.phase.end] -> round.phase_end",
            "round[round.delay.phase_end] -> round.phase_end_delay",
          ],
          publications: {
            roundCancelPhase: {
              exchange: "round",
              routingKey: "round.delay.phase_end",
              confirm: true,
            },
            roundEndPhase: {
              exchange: "round",
              routingKey: "round.delay.phase_cancel",
              confirm: true,
            },
          },
        },
      },
    };

    const config = withDefaultConfig(definitions);

    const broker = await BrokerAsPromised.create(config);

    api.rabbitmq = broker;

    broker.on("error", (err, { vhost, connectionUrl }) => {
      log("Broker error", "error", { err, vhost, connectionUrl });
    });
  }

  /**
   * Start rabbitmq consumers
   */
  override async start() {
    const broker = api.rabbitmq as BrokerAsPromised;

    (await broker.subscribe("/round.phase_cancel"))
      .on("message", roundPhaseCancelConsumer)
      .on("error", (error) => {
        log("Subscription error", "error", { error });
      });

    (await broker.subscribe("/round.phase_end"))
      .on("message", roundPhaseEndConsumer)
      .on("error", (error) => {
        log("Subscription error", "error", { error });
      });
  }

  override async stop() {
    await api.rabbitmq.shutdown();
  }
}
