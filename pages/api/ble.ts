import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";

import { BlePeripheral } from "../../utils/blePeripheral";

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

    // @ts-ignore
    res.socket.server.BlePeripheral = BlePeripheral;

    io.on("connection", (socket) => {
      console.log("connected");

      socket.on("rpc", (requestJson) => {
        const request = JSON.parse(requestJson);

        switch (request.method) {
          case "startScanning":
            BlePeripheral.startScanning();

            setTimeout(() => {
              BlePeripheral.stopScanning();

              const peripherals = BlePeripheral.getPeripherals();

              socket.emit("rpc", peripherals);
            }, 1000);

            break;

          case "connect":
            BlePeripheral.connect(request.params.address);
            break;

          case "disconnect":
            BlePeripheral.disconnect(request.params.address);
            break;
        }
      });
    });
  }

  res.end();
}
