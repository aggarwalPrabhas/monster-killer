const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 18;
const HEAL_VALUE = 27;

const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";

const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_HEAL_PLAYER = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";
const LOG_EVENT_NEW_GAME = "NEW_GAME";

const userEnteredValue = prompt("Choose max life of player and monster", "100");
let chosenMaxLife = parseInt(userEnteredValue);

if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
  chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBounsLife = true;
let battleLog = [];
let lastLogEntry;

// Healthbar setter
adjustHealthBars(chosenMaxLife);

// Reset Game
function reset() {
  currentPlayerHealth = chosenMaxLife;
  currentMonsterHealth = chosenMaxLife;
  hasBounsLife = true;
  writeToLog(
    LOG_EVENT_NEW_GAME,
    "NEW GAME STARTED",
    currentMonsterHealth,
    currentPlayerHealth
  );
  resetGame(chosenMaxLife);
}

// Attack handlers
function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;

  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  // bonus life logic
  if (currentPlayerHealth <= 0 && hasBounsLife) {
    hasBounsLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    alert("LIGHT OF GOOD shins on you my friend!!");
    setPlayerHealth(currentPlayerHealth);
  }

  // Who Wins alert logic

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You Won on Evil!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "PLAYER_WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("Evil Prevail");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "MONSTER_WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    alert("ready for another round!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "DRAW",
      currentMonsterHealth,
      currentPlayerHealth
    );
  }

  // Reset game logic

  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}

function attackMonster(mode) {
  const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  const event =
    mode === MODE_ATTACK
      ? LOG_EVENT_PLAYER_ATTACK
      : LOG_EVENT_PLAYER_STRONG_ATTACK;
  // if (mode === MODE_ATTACK) {
  //   maxDamage = ATTACK_VALUE;
  //   event = LOG_EVENT_PLAYER_ATTACK;
  // } else if (mode === MODE_STRONG_ATTACK) {
  //   maxDamage = STRONG_ATTACK_VALUE;
  //   event = LOG_EVENT_PLAYER_STRONG_ATTACK;
  // }

  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;

  writeToLog(event, damage, currentMonsterHealth, currentPlayerHealth);

  endRound();
}

function attackHander() {
  attackMonster(MODE_ATTACK);
}

function strongAttackHander() {
  attackMonster(MODE_STRONG_ATTACK);
}

//Heal player Function

function healPlayerHandler() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }

  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;

  writeToLog(
    LOG_EVENT_HEAL_PLAYER,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );

  endRound();
}

// log events

function writeToLog(ev, val, monsterHealt, playerHealth) {
  let logEntry = {
    event: ev,
    value: val,
    monsterHealt: monsterHealt,
    playerHealth: playerHealth,
  };

  switch (ev) {
    case LOG_EVENT_PLAYER_ATTACK:
      logEntry.target = "MONSTER";
      break;
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      logEntry.target = "MONSTER";
      break;
    case LOG_EVENT_MONSTER_ATTACK:
      logEntry.target = "PLAYER";
      break;
    case LOG_EVENT_HEAL_PLAYER:
      logEntry.target = "PLAYER";
      break;
  }

  // if (ev === LOG_EVENT_PLAYER_ATTACK) {
  //   logEntry.target = "MONSTER";
  // } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
  //   logEntry.target = "MONSTER";
  // } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
  //   logEntry.target = "PLAYER";
  // } else if (ev === LOG_EVENT_HEAL_PLAYER) {
  //   logEntry.target = "PLAYER";
  // }

  battleLog.push(logEntry);
}

function printLogHandler() {
  let i = 1;
  for (const log of battleLog) {
    if ((!lastLogEntry && lastLogEntry !== 1) || lastLogEntry < i) {
      console.log(`${i} log entry`);
      for (const key in log) {
        console.log(`${key} ==> ${log[key]}`);
      }
      lastLogEntry = i;
      console.log("---------------------------------------------");
      break;
    }
    i++;
  }
}

//event listeners

attackBtn.addEventListener("click", attackHander);
strongAttackBtn.addEventListener("click", strongAttackHander);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
