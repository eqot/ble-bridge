import { useState } from "react";

import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Switch from "@mui/material/Switch";

export const Peripheral = (props: any) => {
  const [isConnected, setConnected] = useState(props.peripheral.isConnected);

  const onConnectionChange = () => {
    if (!isConnected) {
      setConnected(true);

      const request = {
        method: "connect",
        params: {
          address: props.peripheral.address,
        },
      };
      props.socket.emit("rpc", JSON.stringify(request));
    } else {
      setConnected(false);

      const request = {
        method: "disconnect",
        params: {
          address: props.peripheral.address,
        },
      };
      props.socket.emit("rpc", JSON.stringify(request));
    }
  };

  return (
    <TableRow key={props.peripheral.address}>
      <TableCell>{props.peripheral.name}</TableCell>
      <TableCell align="center">{props.peripheral.address}</TableCell>
      <TableCell align="center">{props.peripheral.rssi}</TableCell>
      <TableCell align="center">
        <Switch checked={isConnected} onChange={onConnectionChange}></Switch>
      </TableCell>
    </TableRow>
  );
};
