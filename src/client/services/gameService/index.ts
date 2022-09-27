import { Socket } from "socket.io-client";

interface ISettings {
  zoom?: number;
  sound?: number;
  tutorial?: number;
}

class GameService {
  public async updateSettings(socket: Socket, message: ISettings) {
    socket.emit("updateSettings", message);
  }

  public zoomUpdated = async (
    socket: Socket,
    listiner: (message: any) => void
  ) => {
    socket.on("zoomUpdated", listiner);
  };
}

export default new GameService();
