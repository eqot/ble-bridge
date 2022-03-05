class State {
  discoveredPeripherals: { [uuid: string]: any } = {};
  peripherals: any;
}

const state = new State();

export { state };
