# EBB Tools

EBB Tools is a lightweight `npm` module exposing simples methods for controlling the [EiBotBoard](http://www.schmalzhaus.com/EBB/)

You can find the documentation of this board [here](https://evil-mad.github.io/EggBot/ebb.html)

## Installation


This module is hosted on [npmjs.com](https://www.npmjs.com/search?q=ebb-tools)

You can install it directly in your project by running this command: `npm i ebb-tools`.

## Serial connection

A serial conneciton has to be created in order to communicate with the board. This module includes a little utility based on the [serialport](https://serialport.io/) npm package that provides a simple way to establish the connection.

Here is an example how you would find the right serial `path` and create a new `Board` instance to control an Axidraw for example:

```javascript

const EBB = require('ebb-tools');

const connect = async () => {
  // First list all connected devices
  const const list = await EBB.serialPort.getList();

  // Find the corresponding devices's serial path.
  const { path } = list.find((it) => it.vendorId === '04d8');

  // Create a serial port
  const port = await EBB.serialPort.getPort({ path });

  // Create a Board instance
  const board = new EBB.Board(port);
}

```

## Board

The `Board` class exposes simple motion commands to control the EiBotBoard.

### `Board.moveTo`

This command is used to move the X & Y axis

```javascript
await board.moveTo(1000, 1000);
```

### `Board.lowerBrush`

This command is used to lower the pen

```javascript
await board.lowerBrush();
```

### `Board.raiseBrush`

This command is used to raise the pen

```javascript
await board.raiseBrush();
```

### `Board.waitForEmptyQueue`

This command is used to wait the `FIFO` queue to be empty.

```javascript
await board.lowerBrush();
await board.moveTo(632, 928);
await board.moveTo(2164, 372);
await board.waitForEmptyQueue();
// Here the board stopped moving
```

### `Board.disableStepperMotors`

This command is used to disable stepper motors.

```javascript
await board.disableStepperMotors()
```

### `Board.enableStepperMotors`

This command is used to enable stepper motors.

```javascript
await board.enableStepperMotors()
```

### `Board.setConfig`

This command is used to modify the default config.

```javascript
await board.setConfig({
  minStepsPerMillisecond: 0.07,
  maxStepsPerMillisecond: 15,
  servoRate: 40000,
  minServoHeight: 19000,
  maxServoHeight: 14000,
})
```

## Issues

You might encounter build issues with this module on Windows. To solve this problem you have to install `windows-buid-tools` on your machine.

Run `npm install --global --production windows-build-tools` from an administrative PowerShell.
