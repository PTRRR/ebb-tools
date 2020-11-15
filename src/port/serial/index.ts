import * as SerialPort from 'serialport';

type SerialPortOptions = {
  path?: string;
};

export const getList = () => {
  return SerialPort.list();
};

export const getPort = async (options: SerialPortOptions) => {
  const { path } = options;

  return new Promise((resolve, reject) => {
    if (!path) {
      reject(new Error('No path is defined'));
      return null;
    }

    const port = new SerialPort(path);

    port.on('error', (error: any) => {
      reject(error);
    });

    port.on('open', () => {
      resolve(port);
    });
  });
};
