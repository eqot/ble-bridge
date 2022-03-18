import type { NextApiRequest, NextApiResponse } from "next";

import { OscOut } from "../../utils/oscOut";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { ipAddress, portNumber, frequency } = req.body;
  // console.log(ipAddress, portNumber, frequency);

  // @ts-ignore
  if (res.socket.server.oscOut) {
    console.log("des");
    // @ts-ignore
    res.socket.server.oscOut.deactivate();
    // @ts-ignore
    delete res.socket.server.oscOut;
  }

  const oscOut = new OscOut(
    ipAddress,
    portNumber,
    frequency,
    // @ts-ignore
    res.socket.server.BlePeripheral
  );

  // @ts-ignore
  res.socket.server.oscOut = oscOut;

  res.end();
}
