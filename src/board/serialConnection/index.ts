import * as SerialPort from 'serialport';
import * as Readline from '@serialport/parser-readline';

export type CommandType = {
  command: string;
  resolve: any | undefined;
};

class SerialConnection {
  private port: SerialPort;
  private queue: CommandType[] = [];

  constructor(port: SerialPort) {
    if (!port) throw new Error('No serial port');
    this.port = port;

    const parser = this.port.pipe(new Readline({ delimiter: '\r\n' }));
    parser.on('data', async (data: string) => {
      const message = `${data}`.trim();
      const { resolve } = this.queue.shift() || {};
      if (resolve) resolve(message);
    });
  }

  async write(command: string): Promise<string> {
    const promise = new Promise<string>((resolve) => {
      this.queue.push({
        command,
        resolve,
      });
    });

    return new Promise<Promise<string>>((resolve, reject) => {
      this.port.write(command, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(promise);
        }
      });
    });
  }
}

export default SerialConnection;
