"use strict";

function createProfile(url, info, sessionID) {
    profile_f.profileServer.createProfile(info, sessionID);
    return json.stringify({"err": 0, "errmsg": null, "data": {"uid": "pmc" + sessionID}});
}

function getProfileData(url, info, sessionID) {
    return json.stringify({"err": 0, "errmsg": null, "data": profile_f.profileServer.getCompleteProfile(sessionID)});
}

function regenerateScav(url, info, sessionID) {
    return json.stringify({"err": 0, "errmsg": null, "data": [profile_f.profileServer.generateScav(sessionID)]});
}

function changeVoice(url, info, sessionID) {
    profile_f.profileServer.changeVoice(info, sessionID);
    return '{"err": 0, "errmsg": null, "data": null}';
}

function changeNickname(url, info, sessionID) {
    return profile_f.profileServer.changeNickname(info, sessionID);
}

function getReservedNickname(url, info, sessionID) {
    return json.stringify({"err": 0, "errmsg": null, "data": account_f.accountServer.getReservedNickname(sessionID)});
}

function validateNickname(url, info, sessionID) {
    // todo: validate nickname properly
    return '{"err": 0, "errmsg": null, "data": {"status": "ok"}}';
}

router.addStaticRoute("/client/game/profile/create", createProfile);
router.addStaticRoute("/client/game/profile/list", getProfileData);
router.addStaticRoute("/client/game/profile/savage/regenerate", regenerateScav);
router.addStaticRoute("/client/game/profile/voice/change", changeVoice);
router.addStaticRoute("/client/game/profile/nickname/change", changeNickname);
router.addStaticRoute("/client/game/profile/nickname/reserved", getReservedNickname);
router.addStaticRoute("/client/game/profile/nickname/validate", validateNickname);
