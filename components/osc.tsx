import { useState } from "react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import Button from "@mui/material/Button";

export const Osc = () => {
  const [frequency, setFrequency] = useState("100");

  const handleChange = (event: SelectChangeEvent) => {
    setFrequency(event.target.value as string);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = {
      ipAddress: formData.get("ipAddress"),
      portNumber: formData.get("portNumber"),
      frequency,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    await fetch("/api/osc", options);
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Typography component="h1" variant="h5">
          OSC
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="ipAddress"
                required
                fullWidth
                id="ipAddress"
                label="IPアドレス"
                defaultValue="127.0.0.1"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="portNumber"
                required
                fullWidth
                id="portNumber"
                label="ポート番号"
                type="number"
                defaultValue={10000}
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label" required>
                  送信間隔
                </InputLabel>

                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={frequency}
                  label="Frequency"
                  onChange={handleChange}
                >
                  <MenuItem value={10}>10 ミリ秒</MenuItem>
                  <MenuItem value={100}>100 ミリ秒</MenuItem>
                  <MenuItem value={1000}>1秒</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            設定
          </Button>
        </Box>
      </Container>
    </>
  );
};
