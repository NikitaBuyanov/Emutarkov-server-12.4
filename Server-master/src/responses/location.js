"use strict";

function getLocations(url, info, sessionID) {
    return location_f.locationServer.generateAll();
}

function getLocation(url, info, sessionID) {
    return "LOCATION";
}

router.addStaticRoute("/client/locations", getLocations);
router.addDynamicRoute("/api/location", getLocation);