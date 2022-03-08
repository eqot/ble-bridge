import { CSSProperties, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

import { styled } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import RefreshIcon from "@mui/icons-material/Refresh";

import { Peripheral } from "./peripheral";

let socket: Socket;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#00a3bc",
    color: theme.palette.common.white,
  },
}));

export const Peripherals = (props: any) => {
  const [peripherals, setPeripherals] = useState({});

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/ble");

    socket = io();
    socket.on("connect", () => {
      startScanning();

      socket.on("rpc", (message) => {
        setPeripherals(message);
      });
    });
  };

  // console.log(peripherals);

  return (
    <Container component="main" maxWidth="lg">
      <Typography component="h1" variant="h5">
        Bluetooth
      </Typography>

      <Grid container justifyContent="flex-end">
        <Button variant="contained" onClick={startScanning}>
          <RefreshIcon /> 更新
        </Button>
      </Grid>

      <TableContainer sx={{ mx: "auto", width: "80%" }} component={Paper}>
        <Table stickyHeader aria-label="device table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">デバイス名</StyledTableCell>
              <StyledTableCell align="center">アドレス</StyledTableCell>
              <StyledTableCell align="center">RSSI</StyledTableCell>
              <StyledTableCell align="center">接続</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Object.values(peripherals).map((peripheral: any) => (
              <Peripheral
                peripheral={peripheral}
                socket={socket}
                key={peripheral.address}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

function sendMessage(message: any): void {
  if (!socket) {
    return;
  }

  socket.emit("rpc", JSON.stringify(message));
}

function startScanning(): void {
  sendMessage({ method: "startScanning" });
}
