"use strict";

function sendLocation(sessionID, req, resp, body) {
    server.sendTextJson(resp, location_f.locationServer.get(req.url.replace("/api/location/", "")));
}

server.addRespondCallback("LOCATION", sendLocation);