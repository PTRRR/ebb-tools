# EBB Tools

EBB Tools is a lightweight `npm` module exposing simples methods for controlling the [EiBotBoard](http://www.schmalzhaus.com/EBB/)

It exposes two objects through which you can controll the connected board.

### Installation

---

This module is hosted on [npmjs.com](https://www.npmjs.com/search?q=ebb-tools)

You can install it directly in your project by running this command: `npm i ebb-tools`.

### Establishing a serial connection with the board

---

The connection with the board is established with the excellent [serialport](https://serialport.io/) npm package.

EBB Tools proposes a method to get all connected devices:

```javascript
EBB.serialPort.getList();
```

and a method to create a port from a serial path:

```javascript
EBB.serialPort.getPort({ path });
```

Here is an example how you would find the right serial path and create a new `Board` instance to control an Axidraw for example:

```javascript

const EBB = require('ebb-tools');

const connect = async () => {
  const const list = await EBB.serialPort.getList();
  const { path } = list.find((it) => it.vendorId === '04d8');
  const port = await EBB.serialPort.getPort({ path });
  const board = new EBB.Board(port);
}

```

### Board class

---

The Board class exposes simple motion commands
