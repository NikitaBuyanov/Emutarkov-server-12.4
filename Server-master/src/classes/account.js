"use strict";

/**
* AccountServer class maintains list of accounts in memory. All account information should be 
* loaded during server init.
*/
class AccountServer {
    constructor() {
        this.accounts = {};
    }

    initialize() {
        this.accounts = json.parse(json.read(db.user.configs.accounts));
    }

    saveToDisk() {
        json.write(db.user.configs.accounts, this.accounts);
    }

    find(sessionID) {
        for (let accountId in this.accounts) {
            let account = this.accounts[accountId];

            if (account.id === sessionID) {
                return account;
            }
        }

        return undefined;
    }

    isWiped(sessionID) {
        return this.accounts[sessionID].wipe;
    }

    setWipe(sessionID, state) {
        this.accounts[sessionID].wipe = state;
    }

    login(info) {
        for (let accountId in this.accounts) {
            let account = this.accounts[accountId];

            if (info.email === account.email && info.password === account.password) {
				return accountId;
            }
        }

        return "";
    }

    register(info) {
        for (let accountId in this.accounts) {
            if (info.email === this.accounts[accountId].email) {
				return accountId;
            }
        }
        
        let accountId = utility.generateNewAccountId();

        this.accounts[accountId] = {
            "id": accountId,
            "nickname": "",
            "email": info.email,
            "password": info.password,
            "wipe": true,
            "edition": info.edition
        }
        
        this.saveToDisk();
        return "";
    }
    
    remove(info) {
        let accountId = this.login(info);  

        if (accountId !== "") {
            delete this.accounts[accountId];
            utility.removeDir("user/profiles/" + accountId + "/");
            this.saveToDisk();
        }

        return accountId;
    }

    changeEmail(info) {
        let accountId = this.login(info);

        if (accountId !== "") {
            this.accounts[accountId].email = info.change;
            this.saveToDisk();
        }

        return accountId;
    }

    changePassword(info) {
        let accountId = this.login(info);  

        if (accountId !== "") {
            this.accounts[accountId].password = info.change;
            this.saveToDisk();
        }

        return accountId;
    }

    wipe(info) {
        let accountId = this.login(info);  

        if (accountId !== "") {
            this.accounts[accountId].edition = info.edition;
            this.setWipe(accountId, true);
            this.saveToDisk();
        }

        return accountId;
    }

    getReservedNickname(sessionID) {
        return this.accounts[sessionID].nickname;
    }
}

function getPath(sessionID) {
    return "user/profiles/" + sessionID + "/";
}

module.exports.accountServer = new AccountServer();
module.exports.getPath = getPath;
