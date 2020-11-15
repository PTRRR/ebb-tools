type CommandType = {
  command: string;
  resolve: any;
};

class SerialConnection {
  private port: any;
  private queue: CommandType[] = [];

  constructor(port: any) {
    if (!port) throw new Error('Port is not defined');
    this.port = port;

    this.port.on('data', async (data: string) => {
      const message = `${data}`.trim();
      const { resolve } = this.queue.shift() || {};
      if (resolve) resolve(message);
    });
  }

  async waitFor(command: string, test: any) {
    let end = false;

    while (!end) {
      const response = await this.write(command);
      end = test(response);
    }

    return true;
  }

  async write(command: string) {
    const promise = new Promise((resolve) => {
      this.queue.push({
        command,
        resolve,
      });
    });

    await this.port.write(command);
    return promise;
  }
}

export default SerialConnection;
