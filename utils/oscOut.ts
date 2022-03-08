export class OscOut {
  private ipAddress: string;
  private portNumber: number;
  private frequency: number;

  private timer: any;

  constructor(ipAddress: string, portNumber: number, frequency: number) {
    this.ipAddress = ipAddress;
    this.portNumber = portNumber;
    this.frequency = frequency;

    this.activate();
  }

  activate(): void {
    this.timer = setInterval(() => {
      console.log("tick");
    }, this.frequency);
  }

  deactivate(): void {
    clearInterval(this.timer);
  }
}
