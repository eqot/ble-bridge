FROM balenalib/rpi-raspbian

# install bluez related packages
RUN apt-get update && apt-get install -y \
    bluetooth \
    bluez \
    dbus \
    libbluetooth-dev \
    libudev-dev \
    nodejs \
    npm \
    build-essential

# setup and build application
WORKDIR /usr/src/app
COPY . .
RUN npm install && npm run build

# setup startup script
CMD ./entrypoint.sh


# docker build -t ble-bridge .
# docker run --net=host --privileged -it ble-bridge
