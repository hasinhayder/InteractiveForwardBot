var q = require("./questions.js"),
  readline = require("readline"),
  sleep = require("sleep");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  }),
  i = 0,
  shouldgo = true,
  qstn = q.questions[i];

console.log(qstn.q);
rl.question();
rl.on("line", function(line) {
  shouldgo = true;
  var shouldProcessNo = true;
  line = line.trim().toLowerCase();
  var linked = false;

  //profanity check - let's say bye to the fucknuts
  linked = q.profanity.filter(function(n) {
    return line.indexOf(n) !== -1;
  });

  //this user is definitely a fucknut, say goodbye
  if (linked.length > 0) {
    var randomAnsIndex = Math.floor(Math.random() * q.profanityexit.length);
    sleep.sleep(1);
    console.log(q.profanityexit[randomAnsIndex]);
    process.exit();
  }

  //first check if the answer matches any link
  if (qstn.link) {
    linked = false;
    linked = qstn.link.filter(function(n) {
      return line.indexOf(n) !== -1;
    });
    if (linked.length > 0) {
      if (qstn.linkans) {
        console.log(qstn.linkans);
        shouldProcessNo = false;
      }
      sleep.sleep(1);
    }

  }

  //ok so if there was no match with a linked ans, maybe it's a negative reply?
  if (qstn.no && shouldProcessNo) {
    linked = false;
    linked = qstn.no.filter(function(n) {
      return line.indexOf(n) !== -1;
    });
    if (linked.length > 0) {
      if (qstn.noq) {
        qstn = qstn.noq;
        sleep.sleep(1);
        shouldgo = false; //link this noq question with the standard question loop
      } else if (qstn.linkans) {
        console.log(qstn.linkans);
        process.exit();
      } else
        process.exit();
    }
  }

  //noq was not linked. so let's go as usually
  if (shouldgo === true) {
    i++;
    if (i > q.questions.length) {
      process.exit();
    }
    qstn = q.questions[i];
  }

  if (qstn) {
    sleep.usleep(250000); //breath for a quarter second
    console.log(qstn.q);

    //if this a dead end, say good bye
    if (!qstn.no && !qstn.link) {
      process.exit();
    }
  } else {
    //no more questions, phew!
    process.exit();
  }
});
