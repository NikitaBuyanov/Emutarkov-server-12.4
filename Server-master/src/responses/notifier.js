"use strict";

function nullArrayResponse(url, info, sessionID) {
    return '{"err":0, "errmsg":null, "data":[]}';
}

function createNotifierChannel(url, info, sessionID) {
    return '{"err":0,"errmsg":null,"data":{"notifier":{"server":"' + server.getBackendUrl() + '/","channel_id":"testChannel","url":"' + server.getBackendUrl() + '/notifierServer/get/' + sessionID + '"},"notifierServer":"' + server.getBackendUrl() + '/notifierServer/get/' + sessionID + '"}}';
}

function notify(url, info, sessionID) {
    return "NOTIFY";
}

router.addStaticRoute("/client/notifier/channel/create", createNotifierChannel);
router.addDynamicRoute("/?last_id", notify);
router.addDynamicRoute("/notifierBase", nullArrayResponse);
router.addDynamicRoute("/notifierServer", notify);
router.addDynamicRoute("/push/notifier/get/", nullArrayResponse);