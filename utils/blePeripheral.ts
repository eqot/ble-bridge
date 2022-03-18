import noble from "@abandonware/noble";

export class BlePeripheral {
  private static discoveredPeripherals: { [address: string]: any } = {};
  private static connectedPeripherals: { [address: string]: any } = {};

  static startScanning = (): void => {
    console.log("start scanning");

    BlePeripheral.discoveredPeripherals = {};

    if (noble.state === "poweredOn") {
      noble.startScanningAsync();
    } else {
      noble.on("stateChange", BlePeripheral.onStateChange);
    }

    noble.on("discover", BlePeripheral.onDiscover);
  };

  static stopScanning = (): void => {
    console.log("stop scanning");

    noble.stopScanningAsync();

    noble.removeListener("stateChange", BlePeripheral.onStateChange);
    noble.removeListener("discover", BlePeripheral.onDiscover);
  };

  static onStateChange = (state: string): void => {
    if (state === "poweredOn") {
      noble.startScanningAsync();
    } else {
      noble.stopScanningAsync();
    }
  };

  static getPeripherals = (): any => {
    const peripherals: any = {};

    for (const peripheral of Object.values(
      BlePeripheral.connectedPeripherals
    )) {
      peripherals[peripheral.address] = {
        address: peripheral.address,
        name: peripheral.advertisement?.localName,
        serviceUuids: peripheral.advertisement?.serviceUuids,
        rssi: peripheral.rssi,
        isConnected: peripheral.state === "connected",
      };
    }

    for (const peripheral of Object.values(
      BlePeripheral.discoveredPeripherals
    )) {
      peripherals[peripheral.address] = {
        address: peripheral.address,
        name: peripheral.advertisement?.localName,
        serviceUuids: peripheral.advertisement?.serviceUuids,
        rssi: peripheral.rssi,
        isConnected: peripheral.state === "connected",
      };
    }

    return peripherals;
  };

  static onDiscover = (peripheral: any): void => {
    // console.log(peripheral);
    if (peripheral && peripheral.connectable) {
      BlePeripheral.discoveredPeripherals[peripheral.address] = peripheral;
    }
  };

  static connect = (address: string): void => {
    const peripheral = BlePeripheral.discoveredPeripherals[address];
    if (!peripheral) {
      return;
    }

    peripheral.connect(() => BlePeripheral.onConnect(peripheral));
  };

  static onConnect = (peripheral: any) => {
    BlePeripheral.connectedPeripherals[peripheral.address] = peripheral;
    delete BlePeripheral.discoveredPeripherals[peripheral.address];

    peripheral.discoverAllServicesAndCharacteristics(
      (error: any, services: any[], characteristics: any[]) => {
        peripheral.characteristics = {};
        for (const characteristic of characteristics) {
          peripheral.characteristics[characteristic.uuid] = characteristic;
        }

        const idCharacteristic =
          peripheral.characteristics["10b201015b3b45719508cf3efcd7bbae"];

        idCharacteristic.on("data", (data: Buffer) => {
          const idType = data.readUInt8(0);
          switch (idType) {
            case 1: {
              const x = data.readUInt16LE(1);
              const y = data.readUInt16LE(3);
              const direction = data.readUInt16LE(5);
              // console.log(x, y, direction);

              peripheral.state = { isTouched: true, x, y, direction };

              break;
            }

            case 2: {
              break;
            }

            case 3:
            case 4: {
              peripheral.state.isTouched = false;

              break;
            }
          }

          console.log(BlePeripheral.getPeripherals());
        });
        idCharacteristic.subscribe();
      }
    );
  };

  static disconnect = (address: string): void => {
    const peripheral = BlePeripheral.connectedPeripherals[address];
    if (!peripheral) {
      return;
    }

    peripheral.disconnect();

    delete BlePeripheral.connectedPeripherals[address];
  };
}
