import type { NextApiRequest, NextApiResponse } from "next";
import { Server, Socket } from "socket.io";
import noble from "@abandonware/noble";
import osc from "osc";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  // @ts-ignore
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    // @ts-ignore
    const io = new Server(res.socket.server);
    // @ts-ignore
    res.socket.server.io = io;

    const udpPort = new osc.UDPPort({
      localAddress: "0.0.0.0",
      localPort: 7001,
      metadata: true,
    });
    udpPort.on("message", function (oscMsg, timeTag, info) {
      console.log("An OSC message just arrived!", oscMsg);
      console.log("Remote info is: ", info);
    });
    udpPort.open();
    // @ts-ignore
    res.socket.server.udpPort = udpPort;

    io.on("connection", (socket) => {
      console.log("connected");

      socket.on("rpc", (requestJson) => {
        const request = JSON.parse(requestJson);

        switch (request.method) {
          case "startScanning":
            startScanning(socket);
            break;

          case "connect":
            connect(request.params, udpPort);
            break;

          case "disconnect":
            disconnect(request.params);
            break;
        }
      });
    });
  }

  res.end();
}

let discoveredPeripherals: { [address: string]: any } = {};
let connectedPeripherals: { [address: string]: any } = {};

function startScanning(socket: Socket): void {
  console.log("start scanning");

  discoveredPeripherals = {};

  if (noble.state === "poweredOn") {
    noble.startScanningAsync();
  } else {
    noble.on("stateChange", onStateChange);
  }

  noble.on("discover", onDiscover);

  setTimeout(() => {
    stopScanning();

    noble.removeListener("stateChange", onStateChange);
    noble.removeListener("discover", onDiscover);

    const peripherals: any = {};

    for (const peripheral of Object.values(connectedPeripherals)) {
      peripherals[peripheral.address] = {
        address: peripheral.address,
        name: peripheral.advertisement?.localName,
        serviceUuids: peripheral.advertisement?.serviceUuids,
        rssi: peripheral.rssi,
        isConnected: peripheral.state === "connected",
      };
    }

    for (const peripheral of Object.values(discoveredPeripherals)) {
      peripherals[peripheral.address] = {
        address: peripheral.address,
        name: peripheral.advertisement?.localName,
        serviceUuids: peripheral.advertisement?.serviceUuids,
        rssi: peripheral.rssi,
        isConnected: peripheral.state === "connected",
      };
    }

    // console.log(peripherals);

    socket.emit("rpc", peripherals);
  }, 1000);
}

function stopScanning(): void {
  console.log("stop scanning");

  noble.stopScanningAsync();
}

function onStateChange(state: string): void {
  if (state === "poweredOn") {
    noble.startScanningAsync();
  } else {
    noble.stopScanningAsync();
  }
}

function onDiscover(peripheral: any): void {
  if (peripheral && peripheral.connectable) {
    discoveredPeripherals[peripheral.address] = peripheral;
  }
}

function connect(params: any, udpPort: any): void {
  const peripheral = discoveredPeripherals[params.address];
  if (!peripheral) {
    return;
  }

  peripheral.connect(() => {
    connectedPeripherals[peripheral.address] = peripheral;
    delete discoveredPeripherals[params.address];

    peripheral.discoverAllServicesAndCharacteristics(
      (error: any, services: any[], characteristics: any[]) => {
        // console.log(characteristics);

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
        });
        idCharacteristic.subscribe();

        setInterval(() => {
          if (!peripheral.state) {
            return;
          }

          udpPort.send(
            {
              address: "/toio",
              args: [
                {
                  type: peripheral.state.isTouched ? "T" : "F",
                },
                {
                  type: "i",
                  value: peripheral.state.x,
                },
                {
                  type: "i",
                  value: peripheral.state.y,
                },
                {
                  type: "i",
                  value: peripheral.state.direction,
                },
              ],
            },
            "127.0.0.1",
            7000
          );
        }, 100);

        // console.log(peripheral);
      }
    );
  });
}

function disconnect(params: any): void {
  const peripheral = connectedPeripherals[params.address];
  if (!peripheral) {
    return;
  }

  peripheral.disconnect();

  delete connectedPeripherals[params.address];
}
