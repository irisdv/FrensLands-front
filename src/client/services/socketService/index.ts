import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

class SocketService {
  public socket: Socket | null = null;

  public connect(
    url: string,
    account: string
  ): Promise<Socket<DefaultEventsMap, DefaultEventsMap>> {
    return new Promise((rs, rj) => {

      this.socket = io("http://localhost:8008/");

      console.log("socket", this.socket);

      if (!this.socket) return rj;

      this.socket.on("connect", () => {
        console.log("connected event", this.socket);
        rs(this.socket as Socket);
        this.socket?.emit("account", account);
      });

      // in case of connection error
      this.socket.on("connect_error", (err) => {
        console.log("Connection error: ", err);
        rj(err);
      });
    });
  }

  public disconnect(): void {
    this.socket?.disconnect();
  }
}

// use new to export only one single instance of the class
export default new SocketService();