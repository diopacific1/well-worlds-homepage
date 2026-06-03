export type TickerData = {
  code: string;
  trade_price: number;
  signed_change_rate: number;
  acc_trade_price_24h: number;
  change: "RISE" | "EVEN" | "FALL";
};

type Subscriber = (data: TickerData) => void;
type StatusSubscriber = (
  status: "CONNECTED" | "RECONNECTING" | "DISCONNECTED",
) => void;

class UpbitSocket {
  private ws: WebSocket | null = null;
  private subscribers: Set<Subscriber> = new Set();
  private statusSubscribers: Set<StatusSubscriber> = new Set();
  private codes: string[] = [
    "KRW-BTC",
    "KRW-ETH",
    "KRW-XRP",
    "KRW-SOL",
    "KRW-DOGE",
  ];
  private reconnectTimer: NodeJS.Timeout | null = null;
  private pingTimer: NodeJS.Timeout | null = null;
  private disconnectTimer: NodeJS.Timeout | null = null;
  private connectionCount = 0;
  public status: "CONNECTED" | "RECONNECTING" | "DISCONNECTED" = "DISCONNECTED";
  private intentionToClose = false;

  private updateStatus(
    newStatus: "CONNECTED" | "RECONNECTING" | "DISCONNECTED",
  ) {
    if (this.status === newStatus) return;
    this.status = newStatus;
    this.statusSubscribers.forEach((sub) => sub(newStatus));
  }

  public connect() {
    this.connectionCount++;
    this.intentionToClose = false;

    if (this.disconnectTimer) {
      clearTimeout(this.disconnectTimer);
      this.disconnectTimer = null;
    }

    if (
      this.ws &&
      (this.ws.readyState === WebSocket.OPEN ||
        this.ws.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    this.updateStatus("RECONNECTING");
    this.ws = new WebSocket("wss://api.upbit.com/websocket/v1");
    this.ws.binaryType = "blob";

    this.ws.onopen = () => {
      this.updateStatus("CONNECTED");
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }

      const msg = JSON.stringify([
        { ticket: "crypto-dashboard-" + Date.now() },
        { type: "ticker", codes: this.codes },
      ]);
      this.ws?.send(msg);
    };

    this.ws.onmessage = async (event) => {
      try {
        let text: string;
        if (event.data instanceof Blob) {
          text = await event.data.text();
        } else {
          text = event.data;
        }

        const data = JSON.parse(text);
        if (data.type === "ticker") {
          const ticker: TickerData = {
            code: data.code,
            trade_price: data.trade_price,
            signed_change_rate: data.signed_change_rate,
            acc_trade_price_24h: data.acc_trade_price_24h,
            change: data.change,
          };
          this.subscribers.forEach((sub) => sub(ticker));
        }
      } catch (err) {
        // Silently ignore ping/pong parse errors
      }
    };

    this.ws.onclose = () => {
      this.updateStatus("DISCONNECTED");
      this.ws = null;

      if (this.pingTimer) {
        clearInterval(this.pingTimer);
        this.pingTimer = null;
      }

      if (!this.intentionToClose && this.connectionCount > 0) {
        this.reconnectTimer = setTimeout(() => {
          this.connect(); // re-attempt
        }, 3000);
      }
    };

    this.ws.onerror = (error) => {
      console.error("Upbit WebSocket error:", error);
      this.ws?.close();
    };
  }

  public disconnect() {
    this.connectionCount = Math.max(0, this.connectionCount - 1);

    if (this.connectionCount === 0) {
      // Delay the actual disconnect by 2.5 seconds to survive React StrictMode double mounts
      if (this.disconnectTimer) clearTimeout(this.disconnectTimer);

      this.disconnectTimer = setTimeout(() => {
        this.intentionToClose = true;
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
        if (this.pingTimer) {
          clearInterval(this.pingTimer);
          this.pingTimer = null;
        }
        if (this.ws) {
          this.ws.close();
          this.ws = null;
        }
      }, 2500);
    }
  }

  public subscribe(callback: Subscriber) {
    this.subscribers.add(callback);
  }

  public unsubscribe(callback: Subscriber) {
    this.subscribers.delete(callback);
  }

  public subscribeStatus(callback: StatusSubscriber) {
    this.statusSubscribers.add(callback);
  }

  public unsubscribeStatus(callback: StatusSubscriber) {
    this.statusSubscribers.delete(callback);
  }
}

export const upbitSocket = new UpbitSocket();
