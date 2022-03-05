FROM balenalib/rpi-raspbian

# install bluez related packages
RUN apt-get update && apt-get install -y \
    bluetooth \
    bluez \
    dbus \
    libbluetooth-dev \
    libudev-dev \
    git \
    nodejs \
    npm \
    build-essential

# setup and build application
WORKDIR /usr/src/app
RUN git clone https://github.com/eqot/ble-bridge.git

WORKDIR /usr/src/app/ble-bridge
RUN npm install && npm run build

# setup startup script
CMD ./entrypoint.sh


# docker build -t ble-bridge .
# docker run --net=host --privileged -it ble-bridge
