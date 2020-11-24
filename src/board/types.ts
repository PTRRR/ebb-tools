export type GeneralQueryResponse = {
  gpioPinRB5: number;
  gpioPinRB2: number;
  buttonPressed: number;
  penIsDown: number;
  commandExecuting: number;
  motor1Moving: number;
  motor2Moving: number;
  queueStatus: number;
};

export type ConfigType = {
  minStepsPerMillisecond: number;
  maxStepsPerMillisecond: number;
  servoRate: number;
  minServoHeight: number;
  maxServoHeight: number;
};
