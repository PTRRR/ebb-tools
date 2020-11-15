import * as commands from './commands';
import { clamp, hex2bin } from './utils/math';

const MILLIMETER_IN_STEPS = 80;
const DEFAULT_EBB_CONFIG = {
  maxWidth: 420,
  maxHeight: 297,
  minStepsPerMillisecond: 0.07,
  maxStepsPerMillisecond: 15,
  servoRate: 40000,
  minServoHeight: 20000,
  maxServoHeight: 16000,
  drawingSpeed: 40,
  movingSpeed: 70,
  minDeltaPositionForDistinctLines: 2,
};

class Board {
  private config: any = {};
  private penIsDown: boolean = false;
  private position: [number, number] = [0, 0];
  private speed: number = 40;

  constructor(config: any) {
    this.config = config || DEFAULT_EBB_CONFIG;
  }

  setConfig(config: any) {
    this.config = config;
    const { minServoHeight, maxServoHeight, servoRate } = this.config;

    return [
      this.reset(),
      this.setServoMinHeight(minServoHeight),
      this.setServoMaxHeight(maxServoHeight),
      this.setServoRate(servoRate),
      this.raiseBrush(),
      this.disableStepperMotors(),
    ].join();
  }

  generalQuery() {
    return commands.generalQuery();
  }

  parseGeneralQueryResponse(status: string) {
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

  getVersion() {
    return commands.version();
  }

  reset() {
    return commands.reset();
  }

  setServoMinHeight(minHeight: number) {
    return commands.stepperAndServoModeConfigure({
      parameter: 4,
      integer: minHeight,
    });
  }

  setServoMaxHeight(maxHeight: number) {
    return commands.stepperAndServoModeConfigure({
      parameter: 5,
      integer: maxHeight,
    });
  }

  setServoRate(servoRate: number) {
    return commands.stepperAndServoModeConfigure({
      parameter: 10,
      integer: servoRate,
    });
  }

  enableStepperMotors() {
    return commands.enableMotors({
      enable1: 1,
      enable2: 1,
    });
  }

  disableStepperMotors() {
    return commands.enableMotors({
      enable1: 0,
      enable2: 0,
    });
  }

  lowerBrush() {
    const duration = this.penIsDown ? 0 : 150;
    this.penIsDown = true;

    return commands.setPenState({
      state: 0,
      duration,
    });
  }

  raiseBrush() {
    const duration = this.penIsDown ? 150 : 0;
    this.penIsDown = false;

    return commands.setPenState({
      state: 1,
      duration,
    });
  }

  home() {
    this.position = [0, 0];
    commands.homeMove({ stepRate: 10000 });
  }

  moveTo(targetX: number, targetY: number) {
    const [x, y] = this.position;
    this.position = [targetX, targetY];

    const {
      maxWidth,
      maxHeight,
      minStepsPerMillisecond,
      maxStepsPerMillisecond,
    } = this.config;

    targetX = clamp(targetX, 0, maxWidth * MILLIMETER_IN_STEPS);
    targetY = clamp(targetY, 0, maxHeight * MILLIMETER_IN_STEPS);
    this.position = [targetX, targetY];

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

    return commands.stepperMove(args);
  }
}

export default Board;
