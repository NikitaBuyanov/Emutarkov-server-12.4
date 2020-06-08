"use strict";

function getInsuranceCost(url, info, sessionID) {
    return json.stringify({"err": 0, "errmsg": null, "data": insurance_f.cost(info, sessionID)});
}

router.addStaticRoute("/client/insurance/items/list/cost", getInsuranceCost);
item_f.itemServer.addRoute("Insure", insurance_f.insure);