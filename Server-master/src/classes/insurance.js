"use strict";

class InsuranceServer {
    constructor() {
        this.insured = {};
        events.scheduledEventHandler.addEvent("insuranceReturn", this.processReturn.bind(this));
    }

    /* remove insurance from an item */
    remove(pmcData, body) {
        let toDo = [body];
        
        //Find the item and all of it's relates
        if (toDo[0] === undefined || toDo[0] === null || toDo[0] === "undefined") {
            logger.logError("item id is not valid");
            return;
        }
    
        let ids_toremove = itm_hf.findAndReturnChildren(pmcData, toDo[0]); // get all ids related to this item, +including this item itself

        for (let i in ids_toremove) { // remove one by one all related items and itself
            for (let a in pmcData.Inventory.items) {	// find correct item by id and delete it
                if (pmcData.Inventory.items[a]._id === ids_toremove[i]) {
                    for (let insurance in pmcData.InsuredItems) {
                        if (pmcData.InsuredItems[insurance].itemId == ids_toremove[i]) {
                            pmcData.InsuredItems.splice(insurance, 1);
                        }
                    }
                }
            }
        }
    }

    /* resets items to send on flush */
    resetSession(sessionID) {
        this.insured[sessionID] = {};
    }

    /* adds gear to store */
    addGearToSend(pmcData, insuredItem, actualItem, sessionID) {
        // Don't process insurance for melee weapon or secure container.
        if (actualItem.slotId === "Scabbard" || actualItem.slotId === "SecuredContainer") {
            return;
        }
	
	// Check if the insured item is INSIDE a secure container.
	// We don't process insurance for these items
	// TODO: Move this to helper and generify it to allow checking the entire parental tree
	for(let item of pmcData.Inventory.items) {
		if(item.slotId === "SecuredContainer") {
			if(actualItem.parentId === item._id) {
				return;
			} else {
				break;
			}
		}
	}

        // Mark root-level items for later.
        if (actualItem.parentId === pmcData.Inventory.equipment) {
            actualItem.slotId = "hideout";
        }

        this.insured[sessionID][insuredItem.tid] = this.insured[sessionID][insuredItem.tid] || [];
        this.insured[sessionID][insuredItem.tid].push(actualItem);
        this.remove(pmcData, insuredItem.itemId);
    }

    /* store lost pmc gear */
    storeLostGear(pmcData, offraidData, preRaidGear, sessionID) {
        // Build a hash table to reduce loops
        const preRaidGearHash = {};
        preRaidGear.forEach(i => preRaidGearHash[i._id] = i);

        // Build a hash of offRaidGear
        const offRaidGearHash = {};
        offraidData.profile.Inventory.items.forEach(i => offRaidGearHash[i._id] = i);

        for (let insuredItem of pmcData.InsuredItems) {
            if (preRaidGearHash[insuredItem.itemId]) {
                // This item exists in preRaidGear, meaning we brought it into the raid...
                // Check if we brought it out of the raid
                if (!offRaidGearHash[insuredItem.itemId]) {
                    // We didn't bring this item out! We must've lost it.
                    this.addGearToSend(pmcData, insuredItem, preRaidGearHash[insuredItem.itemId], sessionID);
                }
            }
        }
    }

    /* store insured items on pmc death */
    storeDeadGear(pmcData, sessionID) {
        for (let insuredItem of pmcData.InsuredItems) {
            for (let item of pmcData.Inventory.items) {
                if (insuredItem.itemId === item._id) {
                    this.addGearToSend(pmcData, insuredItem, item, sessionID);
                    break;
                }
            }
        }
    }

    /* sends stored insured items as message */
    sendInsuredItems(pmcData, sessionID) {
        for (let traderId in this.insured[sessionID]) {
            let trader = trader_f.traderServer.getTrader(traderId);
            let dialogueTemplates = json.parse(json.read(db.dialogues[traderId]));
            let messageContent = {
                "templateId": dialogueTemplates.insuranceStart[utility.getRandomInt(0, dialogueTemplates.insuranceStart.length - 1)],
                "type": dialogue_f.getMessageTypeValue("npcTrader")
            };
    
            dialogue_f.dialogueServer.addDialogueMessage(traderId, messageContent, sessionID);
        
            messageContent = {
                "templateId": dialogueTemplates.insuranceFound[utility.getRandomInt(0, dialogueTemplates.insuranceFound.length - 1)],
                "type": dialogue_f.getMessageTypeValue("insuranceReturn"),
                "maxStorageTime": trader.data.insurance.max_storage_time * 3600,
                "systemData": {
                    "date": utility.getDate(),
                    "time": utility.getTime(),
                    "location": pmcData.Info.EntryPoint
                }
            };
    
            events.scheduledEventHandler.addToSchedule({
                "type": "insuranceReturn",
                "sessionId": sessionID,
                "scheduledTime": Date.now() + utility.getRandomInt(trader.data.insurance.min_return_hour * 3600, trader.data.insurance.max_return_hour * 3600) * 1000,
                "data": {
                    "traderId": traderId,
                    "messageContent": messageContent,
                    "items": this.insured[sessionID][traderId]
                }
            });
        }

        this.resetSession(sessionID);
    }

    processReturn(event) {
        // Inject a little bit of a surprise by failing the insurance from time to time ;)
        if (utility.getRandomInt(0, 99) >= gameplayConfig.trading.insureReturnChance) {
            let insuranceFailedTemplates = json.parse(json.read(db.dialogues[event.data.traderId])).insuranceFailed;
            event.data.messageContent.templateId = insuranceFailedTemplates[utility.getRandomInt(0, insuranceFailedTemplates.length)];
            event.data.items = [];
        }
    
        dialogue_f.dialogueServer.addDialogueMessage(event.data.traderId, event.data.messageContent, event.sessionId, event.data.items);
    }
}

// TODO: Move to helper functions
function getItemPrice(_tpl) {
	let price = 0;
	if(_tpl in db.templates.items) {
		let template = json.parse(json.read(db.templates.items[_tpl]));
		price = template.Price;
	} else {
		let item = json.parse(json.read(db.items[_tpl]));
		price = item._props.CreditsPrice;
	}
	
	return price;
}

/* calculates insurance cost */
function cost(info, sessionID) {
    let output = {};
    let pmcData = profile_f.profileServer.getPmcProfile(sessionID);

    for (let trader of info.traders) {
        let items = {};

        for (let key of info.items) {
            for (let item of pmcData.Inventory.items) {
                if (item._id === key) {
                    items[item._tpl] = Math.round(getItemPrice(item._tpl) * gameplayConfig.trading.insureMultiplier);
                    break;
                }
            }
        }

        output[trader] = items;
    }

    return output;
}

/* add insurance to an item */
function insure(pmcData, body, sessionID) {
    let itemsToPay = [];

    // get the price of all items
    for (let key of body.items) {
        for (let item of pmcData.Inventory.items) {
            if (item._id === key) {
                itemsToPay.push({
                    "id": item._id,
                    "count": Math.round(getItemPrice(item._tpl) * gameplayConfig.trading.insureMultiplier)
                });
                break;
            }
        }
    }

    // pay the item	to profile
    if (!itm_hf.payMoney(pmcData, {"scheme_items": itemsToPay, "tid": body.tid}, sessionID)) {
        logger.LogError("no money found");
        return "";
    }

    // add items to InsuredItems list once money has been paid
    for (let key of body.items) {
        for (let item of pmcData.Inventory.items) {
            if (item._id === key) {
                pmcData.InsuredItems.push({
                    "tid": body.tid,
                    "itemId": item._id
                });
                break;
            }
        }
    }

    return item_f.itemServer.getOutput();
}

module.exports.insuranceServer = new InsuranceServer();
module.exports.cost = cost;
module.exports.insure = insure;
