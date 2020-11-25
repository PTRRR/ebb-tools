import * as SerialPort from 'serialport';
import SerialConnection from './serialConnection';
import { GeneralQueryResponse, ConfigType } from './types';
import * as commands from './commands';
import { hex2bin } from './utils/math';

const DEFAULT_EBB_CONFIG: ConfigType = {
  minStepsPerMillisecond: 0.07,
  maxStepsPerMillisecond: 15,
  servoRate: 40000,
  minServoHeight: 19000,
  maxServoHeight: 14000,
};

class Board {
  private connection: SerialConnection;
  private config: any = {};
  private penIsDown: boolean = false;
  private position: [number, number] = [0, 0];
  private speed: number = 50;

  constructor(port: SerialPort, config: ConfigType) {
    this.connection = new SerialConnection(port);
    this.setConfig(config || DEFAULT_EBB_CONFIG);
  }

  setSpeed(speed: number) {
    this.speed = speed;
  }

  setConfig(config: ConfigType) {
    this.config = config;
    const { minServoHeight, maxServoHeight, servoRate } = this.config;

    this.reset();
    this.setServoMinHeight(minServoHeight);
    this.setServoMaxHeight(maxServoHeight);
    this.setServoRate(servoRate);
    this.disableStepperMotors();
  }

  parseGeneralQueryResponse(status: string): GeneralQueryResponse {
    const binary = hex2bin(status);
    const bits = binary.split('').map((it: string) => parseInt(it, 10));

    const [
      gpioPinRB5,
      gpioPinRB2,
      buttonPressed,
      penIsDown,
      commandExecuting,
      motor1Moving,
      motor2Moving,
      queueStatus,
    ] = bits;

    return {
      gpioPinRB5,
      gpioPinRB2,
      buttonPressed,
      penIsDown,
      commandExecuting,
      motor1Moving,
      motor2Moving,
      queueStatus,
    };
  }

  wait(timeout: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  }

  async waitForEmptyQueue() {
    let empty = false;

    while (!empty) {
      const response = await this.generalQuery();
      const { commandExecuting, queueStatus } = this.parseGeneralQueryResponse(
        response,
      );

      if (commandExecuting === 0 && queueStatus === 0) empty = true;
    }

    return true;
  }

  generalQuery() {
    return this.connection.write(commands.generalQuery());
  }

  getVersion() {
    return this.connection.write(commands.version());
  }

  reset() {
    return this.connection.write(commands.reset());
  }

  setServoMinHeight(minHeight: number) {
    return this.connection.write(
      commands.stepperAndServoModeConfigure({
        parameter: 4,
        integer: minHeight,
      }),
    );
  }

  setServoMaxHeight(maxHeight: number) {
    return this.connection.write(
      commands.stepperAndServoModeConfigure({
        parameter: 5,
        integer: maxHeight,
      }),
    );
  }

  setServoRate(servoRate: number) {
    return this.connection.write(
      commands.stepperAndServoModeConfigure({
        parameter: 10,
        integer: servoRate,
      }),
    );
  }

  enableStepperMotors() {
    return this.connection.write(
      commands.enableMotors({
        enable1: 1,
        enable2: 1,
      }),
    );
  }

  disableStepperMotors() {
    return this.connection.write(
      commands.enableMotors({
        enable1: 0,
        enable2: 0,
      }),
    );
  }

  lowerBrush() {
    const duration = this.penIsDown ? 0 : 150;
    this.penIsDown = true;

    return this.connection.write(
      commands.setPenState({
        state: 0,
        duration,
      }),
    );
  }

  raiseBrush() {
    const duration = this.penIsDown ? 150 : 0;
    this.penIsDown = false;

    return this.connection.write(
      commands.setPenState({
        state: 1,
        duration,
      }),
    );
  }

  home() {
    return this.connection.write(commands.homeMove({ stepRate: 10000 }));
  }

  moveTo(targetX: number, targetY: number) {
    const [x, y] = this.position;
    this.position = [targetX, targetY];
    const { minStepsPerMillisecond, maxStepsPerMillisecond } = this.config;

    const { amountX, amountY } = commands.getAmountSteps(
      x,
      y,
      targetX,
      targetY,
    );

    const duration = commands.getDuration(
      this.speed,
      minStepsPerMillisecond,
      maxStepsPerMillisecond,
      amountX,
      amountY,
    );

    const args = {
      duration,
      axisSteps1: amountX,
      axisSteps2: amountY,
    };

    return this.connection.write(commands.stepperMove(args));
  }
}

export default Board;
