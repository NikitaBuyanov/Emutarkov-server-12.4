process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; // ignore selfsigned ssl certificate

const fs = require('fs');
const zlib = require('zlib');
const https = require('https');
const should = require('chai').should();
const expect = require('chai').expect;

// Global config stuff
let settings = JSON.parse(readJson(__dirname + "/../../user/configs/server.json"));

const url = settings.ip;
const port = settings.port;
const gameVersion = '0.12.4.6269';

let integer = 0;
let accountID = 0;

describe('Client', function() {

  describe('/client/languages', function() {
    it('should retrieve languages', async function() {
      const path = '/client/languages';
      const data = '{"crc":0}';

      let res = await send(url, port, path, data);
      const jsonData = parseData(res);

      jsonData.err.should.equal(0);
    });
  });

  describe('/client/menu/locale/en', function() {
    it('should load menu en locale', async function() {
      const path = '/client/menu/locale/en';
      const data = '{"crc":0}';

      let res = await send(url, port, path, data);
      const jsonData = parseData(res);

      jsonData.err.should.equal(0);
    });
  });

  describe('/client/game/version/validate', function() {
    it('should validate game version', async function() {
      const path = '/client/game/version/validate';
      const data = `{"version":{"major":"${gameVersion}","minor":"live","game":"live","backend":"6","taxonomy":"341"},"develop":true}`;

      let res = await send(url, port, path, data);
      const jsonData = parseData(res);

      jsonData.err.should.equal(0);
    });
  });

  describe('/launcher/profile/register', function() {
    it('should create account', async function() {
      const path = '/launcher/profile/register';
      const data = '{"email" : "test@test.com", "password": "test", "edition": "eod" }';

      let res = await send(url, port, path, data);
      const body = zlib.inflateSync(res).toString();

      body.should.equal("OK");
    });
  });

  describe('/launcher/profile/login', function() {
    it('should login', async function() {
      const path = '/launcher/profile/login';
      const data = '{"email" : "test@test.com", "password": "test" }';

      let res = await send(url, port, path, data);
      const body = zlib.inflateSync(res);
      accountID = body.toString();
      let condition = accountID !== "FAILED";
      condition.should.equal(true);
    });
  });

  describe('/client/game/keepalive', function() {
    it('should keepalive', async function() {
      const path = '/client/game/keepalive';
      const data = '';

      let res = await send(url, port, path, data, accountID);
      const body = parseData(res);

      body.err.should.equal(0);
    });
  });

  describe('/client/items', function() {
    it('should get items', async function() {
      const path = '/client/items';
      const data = '{"crc":1074351527}';

      let res = await send(url, port, path, data, accountID);
      const jsonData = parseData(res);

      jsonData.err.should.equal(0);
    });
  });

  describe('/client/globals', function() {
    it('should load globals', async function() {
      const path = '/client/globals';
      const data = '{"crc":0}';

      let res = await send(url, port, path, data, accountID);
      const jsonData = parseData(res);

      jsonData.err.should.equal(0);
    });
  });

  describe('/client/game/profile/list', function() {
    it('should load a profile list', async function() {
      const path = '/client/game/profile/list';
      const data = '{}';

      let res = await send(url, port, path, data, accountID);
      const jsonData = parseData(res);

      jsonData.err.should.equal(0);
    });
  });

  describe('/client/locations', function() {
    it('should load locations', async function() {
      const path = '/client/locations';
      const data = '{"crc":850408639}';

      let res = await send(url, port, path, data, accountID);
      const jsonData = parseData(res);

      jsonData.err.should.equal(0);
    });
  });

  describe('/client/weather', function() {
    it('should load weather', async function() {
      const path = '/client/weather';
      const data = '{}';

      let res = await send(url, port, path, data, accountID);
      const jsonData = parseData(res);

      jsonData.err.should.equal(0);
    });
  });

  describe('/client/locale/en', function() {
    it('should load en locale', async function() {
      const path = '/client/locale/en';
      const data = '{"crc":2863236201}';

      let res = await send(url, port, path, data, accountID);
      const jsonData = parseData(res);

      jsonData.err.should.equal(0);
    });
  });

  describe('/client/game/profile/select', function() {
    it('should select game profile', async function() {
      const path = '/client/game/profile/select';
      const data = '{"uid":"5c71b934354682353958e984"}';

      let res = await send(url, port, path, data, accountID);
      const jsonData = parseData(res);

      jsonData.err.should.equal(0);
    });
  });

  describe('/client/profile/status', function() {
    it('should get profile status', async function() {
      const path = '/client/profile/status';
      const data = '';

      let res = await send(url, port, path, data, accountID);
      const jsonData = parseData(res);

      jsonData.err.should.equal(0);
    });
  });

  describe('/client/handbook/templates', function() {
    it('should load handbook templates', async function() {
      const path = '/client/handbook/templates';
      const data = '';

      let res = await send(url, port, path, data, accountID);
      const jsonData = parseData(res);

      jsonData.err.should.equal(0);
    });
  });

  describe('/client/quest/list', function() {
    it('should load quests', async function() {
      const path = '/client/quest/list';
      const data = '{"completed":true}';

      let res = await send(url, port, path, data, accountID);
      const jsonData = parseData(res);

      jsonData.err.should.equal(0);
    });
  });

  describe('/client/notifier/channel/create', function() {
    it('should create a notifier channel', async function() {
      const path = '/client/notifier/channel/create';
      const data = '';

      let res = await send(url, port, path, data, accountID);
      const jsonData = parseData(res);

      jsonData.err.should.equal(0);
    });
  });

  describe('/client/mail/dialog/list', function() {
    it('should get mail list', async function() {
      const path = '/client/mail/dialog/list';
      const data = '{"limit":30,"offset":0}';

      let res = await send(url, port, path, data, accountID);
      const jsonData = parseData(res);

      jsonData.err.should.equal(0);
    });
  });

  describe('/client/friend/list', function() {
    it('should get friend list', async function() {
      const path = '/client/friend/list';
      const data = '';

      let res = await send(url, port, path, data, accountID);
      const jsonData = parseData(res);

      jsonData.err.should.equal(0);
    });
  });

  describe('/client/friend/request/list/inbox', function() {
    it('should get all friend requests incoming', async function() {
      const path = '/client/friend/request/list/inbox';
      const data = '';

      let res = await send(url, port, path, data, accountID);
      const jsonData = parseData(res);

      jsonData.err.should.equal(0);
    });
  });

  describe('/client/friend/request/list/outbox', function() {
    it('should get all friend requests outgoing', async function() {
      const path = '/client/friend/request/list/outbox';
      const data = '';

      let res = await send(url, port, path, data, accountID);
      const jsonData = parseData(res);

      jsonData.err.should.equal(0);
    });
  });

  describe('/client/server/list', function() {
    it('should get the server list', async function() {
      const path = '/client/server/list';
      const data = '';

      let res = await send(url, port, path, data, accountID);
      const jsonData = parseData(res);

      jsonData.err.should.equal(0);
    });
  });

  // describe('/client/trading/api/getTradersList', function() {
  //   it('should get a list of traders', async function() {
  //     const path = '/client/trading/api/getTradersList';
  //     const data = '';

  //     let res = await send(url, port, path, data, 1);
  //     const jsonData = parseData(res);

  //     jsonData.err.should.equal(0);
  //   });
  // });

  // describe('/OfflineRaidSave', function() {
  //   it('should save offline raid data', async function() {
  //     const path = '/OfflineRaidSave';

  //     console.log(process.cwd());
  //     const data = readJson(`${process.cwd()}/dev/db/offlineRaidProfile.json`); // "../db/offlineRaidProfile.json");

  //     let res = await send(url, port, path, data, 1);
  //     const jsonData = parseData(res);

  //     jsonData.err.should.equal(0);
  //   });
  // });

});

/*
 *
 *  Helper Functions, used to make requests, etc
 *
 */

function parseData(data) {
  const body = zlib.inflateSync(data);
  return JSON.parse((body !== typeof "undefined" && body !== null && body !== "") ? body.toString() : '{}');
}

function send(url, _port = 443, path, data, session, type = "POST"){
  return new Promise ((resolve, reject) => {
    const options = { // options for https data it must stay like this
      hostname: url,
      port: _port,
      path: path,
      method: type,
      headers: {
        'User-Agent':			'UnityPlayer/2018.4.11f1 (UnityWebRequest/1.0, libcurl/7.52.0-DEV)',
        'Content-Type': 		'application/json',
        'Accept': 			'application/json',
        'App-Version': 		'EFT Client ' + gameVersion,
        'GClient-RequestId': 	integer,
      }
    };

    // Set our session if we've got one
    if (session) {
      options.headers['Cookie'] = `PHPSESSID=${session}`;
    }

    integer++; // add integer number to request counting requests and also making their stupid RequestId Counter

    zlib.deflate(data, function (err, buffer) { // this is kinda working
      const req = https.request(options, (res) => { // request https data with options above
        console.log("  ["+integer+"]"+((integer < 10)?" ":"")+"> [Response Status Code]: " + res.statusCode + " »»" + path);

        if(res.statusCode != 200){
          reject("No Response: " + res.statusCode);
        }

        let chunks = [];

        res.on('data', (d) => {
          chunks.push(d);
        });

        res.on('end', function(){
          resolve(Buffer.concat(chunks));
        });
      });

      // return error if error on request
      req.on('error', err => {
        reject(err);
      });

      req.write(buffer);
      req.end();
    });
  });
}

function readJson(file) { //read json file with deleting all tabulators and new lines
  return (fs.readFileSync(file, 'utf8')).replace(/[\r\n\t]/g, '').replace(/\s\s+/g, '');
}
