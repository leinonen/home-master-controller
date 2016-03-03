# Proper REST API with HATEOAS hypermedia links

## devices

GET  /api/devices                     - get all devices

GET  /api/devices/:type               - get devices for given type

GET  /api/devices/:type/:id           - get a single device

POST /api/devices/:type/:id/control   - control this device

## groups

GET  /api/groups                      - get all the groups

GET  /api/groups/create               - return empty template object?

POST /api/groups                      - post filled in template object ?

GET  /api/groups/:id                  - get a single group

GET  /api/groups/:id/status           - get the status of this group (on if any device is on)

GET  /api/groups/:id/devices          - get devices in this group

POST /api/groups/:id/control          - control devices in this group

## sensors

GET  /api/sensors                     - get all sensors

GET  /api/sensors/:id                 - get single sensor


## schedules

GET  /api/schedules                   - get all schedules

GET  /api/schedules/:id               - get single schedule

GET  /api/schedules/:id/devices       - get devices for this schedule


