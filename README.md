# rgb-agent

## A Node server that will send MQTT topics on belalf of a user.

### The API

The API exists to provide a way of controlling the LEDs on a device.
These device is running code that will subscirbe to MQTT events.

The API calls for the most part will emit MQTT events.
These calls will start and stop functions that will drive the LEDs "effects" or well as set their value.

The URL form consists of:

/device/actuator/property?key=value&key=value

The applicaation uses these end points:

/rgb/light/red?level=100
/rgb/light/green?level=100
/rgb/light/blue?level=100

Start or stop a process running on the server that will send messages to the device

/device/actuator/action-to-initiate/:type-of-action-to-initiate

/rgb/light/effect/glow
/rgb/light/effect/blink
