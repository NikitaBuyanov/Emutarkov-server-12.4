"use strict";

function searchRagfair(url, info, sessionID) {
    return json.stringify({"err": 0, "errmsg": null, "data": ragfair_f.getOffers(info)});
}

function itemMarKetPrice(url, info, sessionID)
{
	return json.stringify({"err": 0, "errmsg": null, "data": ragfair_f.itemMarKetPrice(info)});
}

router.addStaticRoute("/client/ragfair/search", searchRagfair);
router.addStaticRoute("/client/ragfair/find", searchRagfair);
router.addStaticRoute("/client/ragfair/itemMarketPrice", itemMarKetPrice);
item_f.itemServer.addRoute("RagFairAddOffer", ragfair_f.ragFairAddOffer);