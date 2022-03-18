// @ts-ignore
import osc from "osc";

export class OscOut {
  private ipAddress: string;
  private portNumber: number;
  private frequency: number;
  private BlePeripheral: any;

  private udpPort: any;

  private timer: any;

  constructor(
    ipAddress: string,
    portNumber: number,
    frequency: number,
    BlePeripheral: any
  ) {
    this.ipAddress = ipAddress;
    this.portNumber = portNumber;
    this.frequency = frequency;
    this.BlePeripheral = BlePeripheral;

    this.udpPort = new osc.UDPPort({
      localAddress: "0.0.0.0",
      localPort: 10001,
      metadata: true,
    });
    this.udpPort.on(
      "message",
      function (oscMsg: string, timeTag: string, info: any) {
        console.log("An OSC message just arrived!", oscMsg);
        console.log("Remote info is: ", info);
      }
    );
    this.udpPort.open();

    this.activate();
  }

  activate(): void {
    this.timer = setInterval(() => {
      console.log("OSC out");

      // @ts-ignore
      const peripherals = this.BlePeripheral.getPeripherals();
      console.log(peripherals);

      // if (!peripheral.state) {
      //   return;
      // }

      /*
      this.udpPort.send(
        {
          address: "/toio",
          args: [
            {
              // type: peripheral.state.isTouched ? "T" : "F",
            },
            {
              type: "i",
              // value: peripheral.state.x,
            },
            {
              type: "i",
              // value: peripheral.state.y,
            },
            {
              type: "i",
              // value: peripheral.state.direction,
            },
          ],
        },
        this.ipAddress,
        this.portNumber
      );
      */
    }, this.frequency);
  }

  deactivate(): void {
    clearInterval(this.timer);
  }
}
