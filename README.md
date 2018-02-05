
# RGB-IOT

A project that will employ a small Fog(mini-cloud) network. The system consists of:
An MQTT broker, NodeJS server and Arduinos with LEDs

### edge-N Arduino Device
    Currently I am using an Adafruit feather. The code being used can be found at git address:
    This device had 3 LEDs connecected to it: red, green, blue. each device is referred to as 
    'edge' and the designated number edge-1, edge-2, edge-3.

### MQTT broker
    Currently runs on and Intel Edison, the software it is using is called Mosquitto (link).

### rgb-agent
    The node server that proxies the users requests to the MQTT broker.

### rgb-agen A Node server that will 
 * Provide a web page with a user interface
 * Send MQTT topics on belalf of a user to an MQTT broker, 
 * Enables user control of the red, green and blue lights on an Arduino device.

### The cloud that the fog communicates with
    Eventually this fog will send messages up to the cloud. 
    There are a number of solutions out there to acheive this and it is WIP (work in progress)

## rgb-agent The API

The node server publishes a page in which a user has access to various user interface.
These various UI send messages to the same Node servers' API. 
This API is as follows:

POST
    /application/device/property/sub-property/value

Target a characteristic of a light on a device in the context of the application 'rgb'
    /rgb/edge-1/light/red/100

Target a characteristic of a fan on a particular device in the context of the application 'rgb'
    /regb/edge-1/fan/on

API calls for controlling distinct LEDs
    /rgb/light/red/VALUE [ 0 - 255 ]
    /rgb/light/green/VALUE [ 0 - 255 ]
    /rgb/light/blue/VALUE [ 0 - 255 ]

API paths for controlling the effects
    /rgb/effect/glow/VALUE [ on off]
    /rgb/effect/march/VALUE [ on off]


The API calls for the most part will emit MQTT events.
These calls will start and stop functions that will drive the LEDs "effects" as well as set their value.

### The MQTT topics and value ranges.

Once the Node server API is posted to, an MQTT call is made in the form:

'application-name:device-name:property-of-device:sub-property' -m value

Examples include:
    'rgb/edge-1/light/red' -m 0
    'rgb/edge-1/light/green' -m 100
    'rgb/edge-1/light/blue' -m 200


### The User interface and Client

Currently the UI consists of control for the disctict LEDs, red, green, blue 
and control to start and stop effects.






