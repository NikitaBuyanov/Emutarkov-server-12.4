"use strict";

function handleKeepAlive(url, info, sessionID) {
    keepAlive_f.main(sessionID);
    return json.stringify({"err": 0, "errmsg": null, "data": {"msg": "OK"}});
}

router.addStaticRoute("/client/game/keepalive", handleKeepAlive);