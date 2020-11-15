import * as commands from '../board/commands';

test('Reboot command', () => {
  expect(commands.reboot()).toBe('RB\r');
});

test('Reset command', () => {
  expect(commands.reset()).toBe('R\r');
});

test('Stepper and servo mode configure command', () => {
  const args = {
    parameter: 100,
    integer: 10000,
  };

  expect(commands.stepperAndServoModeConfigure(args)).toBe(
    `SC,${args.parameter},${args.integer}\r`,
  );
});

test('Set pen state command', () => {
  const args = {
    state: 1,
    duration: 100,
  };

  expect(commands.setPenState(args)).toBe(
    `SP,${args.state},${args.duration}\r`,
  );
});

test('Enable motors command', () => {
  const args = {
    enable1: 1,
    enable2: 1,
  };

  expect(commands.enableMotors(args)).toBe(
    `EM,${args.enable1},${args.enable2}\r`,
  );
});

test('Home move command', () => {
  const args = {
    stepRate: 100,
  };

  expect(commands.homeMove(args)).toBe(`HM,${args.stepRate}\r`);
});

test('Stepper move command', () => {
  const args = {
    duration: 10000,
    axisSteps1: 84398,
    axisSteps2: 384623,
  };

  expect(commands.stepperMove(args)).toBe(
    `SM,${args.duration},${args.axisSteps1},${args.axisSteps2}\r`,
  );
});

test('Low level move command', () => {
  const args = {
    rateTerm1: 63,
    axisSteps1: 12344,
    deltaR1: 573,
    rateTerm2: 44,
    axisSteps2: 7654,
    deltaR2: 458,
  };

  expect(commands.lowLevelMove(args)).toBe(
    `LM,${args.rateTerm1},${args.axisSteps1},${args.deltaR1},${args.rateTerm2},${args.axisSteps2},${args.deltaR2}\r`,
  );
});

test('Query motor command', () => {
  expect(commands.queryMotor()).toBe('QM\r');
});

test('General query command', () => {
  expect(commands.generalQuery()).toBe('QG\r');
});

test('Version command', () => {
  expect(commands.version()).toBe('V\r');
});
