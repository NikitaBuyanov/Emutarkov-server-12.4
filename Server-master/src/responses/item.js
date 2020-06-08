"use strict";

function handleRoutes(url, info, sessionID) {
    return item_f.itemServer.handleRoutes(info, sessionID);
}

function prices(url, info, sessionID)
{
	return json.stringify({"err": 0, "errmsg": null, "data": item_f.prices(info)});
}

router.addStaticRoute("/client/game/profile/items/moving", handleRoutes);
router.addStaticRoute("/client/items/prices", prices);
