const mysql = require("mysql");
const crypto = require("crypto");
const fetch = require("cross-fetch");

const con = mysql.createConnection({
  host: "34.132.198.54",
  user: "root",
  password: "silence",
  database: "assemble_db"
});

// String -> [username, passwordHash, email, reputationPoints]
function getRandomUserRecord(surname) {
  const username = surname;
  const password = (surname + Math.random()).slice(0, 10);
  const hash = crypto.createHash("sha256").update(password).digest("hex");
  const email = `${username}@gmail.com`;
  const reputationPoints = Math.floor(Math.random() * 42);
  return [username, hash, email, reputationPoints];
}

// insert data into db
function insertMockUserData(surnamnePool) {
  for (let surname of surnamnePool) {
    const [username, passwordHash, email, reputationPoints] =
      getRandomUserRecord(surname);
    const sql = `
        INSERT INTO User (username, passwordHash, email, reputationPoints)
        VALUES ('${username}', '${passwordHash}', '${email}', ${reputationPoints})
`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  }
}

// return [Array String]
async function getRandomSurnames() {
  const res = await fetch("https://www.randomlists.com/data/names-male.json");
  const json = await res.json();
  return json.data;
}

// return [Array String String] (name and description)
function getRandomBoardGameInfos(count) {
  let infos = [];
  for (let i = 0; i < count; i += 1) {
    const name = "activity" + i;
    const description = name + " is a fun activity.";
    infos.push([name, description]);
  }
  return infos;
}

// [Array [Array String String]] -> Void
function insertMockActivityData(activityInfos) {
  for (const [name, description] of activityInfos) {
    const sql = `
        INSERT INTO Activity (name, description)
        VALUES (?, ?)
`;
    con.query(sql, [name, description], function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  }
}

// return [Array String Int String] (name, activity_id, description)
function getRandomEventInfos(count, activity_id_low, activity_id_high) {
  let infos = [];
  const activity_id_range = activity_id_high - activity_id_low + 1;
  for (let i = 0; i < count; i += 1) {
    const name = "event" + i;
    const activity_id =
      activity_id_low + Math.floor(Math.random() * activity_id_range);
    const description =
      name +
      " is a fun event. Here are some more details: Everybody loves Rhino.";
    infos.push([name, activity_id, description]);
  }
  return infos;
}

// [Array [Array String Int String]] -> Void
function insertMockEventData(eventInfos) {
  for (const [name, activity_id, description] of eventInfos) {
    const sql = `
        INSERT INTO Event (name, activity_id, description)
        VALUES (?, ?, ?)
`;

    con.query(sql, [name, activity_id, description], function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  }
}

async function getRandomMessages() {
  const msg = await fetch(
    "https://randomwordgenerator.com/json/sentences.json"
  );

  const jsonMsg = await msg.json();

  return jsonMsg.data;
}

function getRandomDateTime(startY, endY) {
  const year = Math.floor(Math.random() * (endY - startY + 1)) + startY;
  const month = Math.floor(Math.random() * 12) + 1;
  const maxDay = new Date(year, month, 0).getDate();
  const day = Math.floor(Math.random() * maxDay) + 1;

  const hour = Math.floor(Math.random() * 23) + 1;
  const minute = Math.floor(Math.random() * 59) + 1;
  const second = Math.floor(Math.random() * 59) + 1;

  return (
    year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second
  );
}

function getRandomContent(data) {
  const idx = Math.floor(Math.random() * data.length);
  return data[idx]["sentence"];
}

function getRandomMessagesInfo(count, messages) {
  let msgInfos = [];
  for (let i = 1; i <= count; i += 1) {
    const user_id = Math.floor(Math.random() * 1000) + 1004;
    const event_id = Math.floor(Math.random() * 1000) + 2;
    const post_time = getRandomDateTime(2021, 2021);
    const content = getRandomContent(messages);
    msgInfos.push([user_id, event_id, post_time, content]);
  }
  return msgInfos;
}

function insertMockMessageData(msgInfos) {
  for (const [user_id, event_id, post_time, content] of msgInfos) {
    const sql = `
        INSERT INTO EventMessage (user_id, event_id, post_time, content)
        VALUES (?, ?, ?, ?)
    `;

    con.query(
      sql,
      [user_id, event_id, post_time, content],
      function (err, result) {
        if (err) throw err;
        console.log(user_id + "; " + event_id);
      }
    );
  }
}

// return [Array Blob String] (images, description)
function getRandomBadgesInfo(count) {
  let badges = [];

  for (let i = 800; i < count; i += 1) {
    const images = "";
    const description = "Get Badge" + i + " by attending more events.";
    badges.push([images, description]);
  }
  return badges;
}

// [Array [Array Blob String]] -> Void
function insertMockBadgeData(badgeInfos) {
  for (const [images, description] of badgeInfos) {
    const sql = `
        INSERT INTO Badge (image, description)
        values (?, ?)
    `;
    con.query(sql, [images, description], function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  }
}

// [Array [Array Int Int]] -> Void
function insertMockHasBadgeData() {
  for (let i = 2; i < 1002; i += 1) {
    const sql = `
      INSERT INTO HasBadge (User_id, Badge_id)
      values (?, ?)
    `;
    con.query(sql, [i + 1002, i], function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  }
}

// `receiver_user_id` int(11) NOT NULL,
// `time` datetime NOT NULL,
// `content` varchar(1024) NOT NULL,

function getRandomPrivateMessagesInfo(count, messages) {
  let msgInfos = [];
  for (let i = 1; i <= count; i += 1) {
    const sender_id = Math.floor(Math.random() * 1000) + 1003;
    const receiver_id = Math.floor(Math.random() * 1000) + 1003;
    const time = getRandomDateTime(2021, 2021);
    const content = getRandomContent(messages);
    msgInfos.push([sender_id, receiver_id, time, content]);
  }
  return msgInfos;
}

function insertMockPrivateMessageData(msgInfos) {
  for (const [sender_user_id,receiver_user_id, time, content] of msgInfos) {
    const sql = `
        INSERT INTO PrivateMessage (sender_user_id,receiver_user_id, time, content)
        VALUES (?, ?, ?, ?)
    `;

    con.query(sql, [sender_user_id, receiver_user_id, time, content], function (err, result) {
      if (err) throw err;
      console.log(receiver_user_id);
    });
  }
}

async function main() {
  const messages = await getRandomMessages();
  const randomPrivateMessageInfo = getRandomPrivateMessagesInfo(1000, messages);
  insertMockPrivateMessageData(randomPrivateMessageInfo);
  // const messages = await getRandomMessages();
  // const randomMessageInfo = getRandomMessagesInfo(1000, messages);
  // insertMockMessageData(randomMessageInfo);
  // const randomSurnames = await getRandomSurnames();
  // insertMockUserData(randomSurnames);
  // const randomBoardGameInfos = getRandomBoardGameInfos(1000);
  // insertMockActivityData(randomBoardGameInfos);
  // const randomEventInfos = getRandomEventInfos(1000, 4, 1003);
  // insertMockEventData(randomEventInfos);
  // const randomBadges = getRandomBadgesInfo(1000);
  // insertMockBadgeData(randomBadges);
  // insertMockHasBadgeData();
}

main();
