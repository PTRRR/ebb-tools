import SerialConnection from '../serialConnection';
import app from './app';

class Server {
  private serialConnection: typeof SerialConnection;

  constructor(serialConnection: typeof SerialConnection) {
    this.serialConnection = serialConnection;
  }

  start(port: number, callback: any | undefined) {
    app.listen(port, callback || (() => null));
  }
}

export { Server };
