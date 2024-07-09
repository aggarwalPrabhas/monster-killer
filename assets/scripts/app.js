const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 18;
const HEAL_VALUE = 27;
const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";

const userEnteredValue = prompt("Choose max life of player and monster", "100");
let chosenMaxLife = parseInt(userEnteredValue);

if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
  chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBounsLife = true;

// Healthbar setter
adjustHealthBars(chosenMaxLife);

// Reset Game
function reset() {
  currentPlayerHealth = chosenMaxLife;
  currentMonsterHealth = chosenMaxLife;
  hasBounsLife = true;
  resetGame(chosenMaxLife);
}

// Attack handlers
function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;

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
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("Evil Prevail");
  } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    alert("ready for another round!");
  }

  // Reset game logic

  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}

function attackMonster(mode) {
  let maxDamage;
  if (mode === MODE_ATTACK) {
    maxDamage = ATTACK_VALUE;
  } else if (mode === MODE_STRONG_ATTACK) {
    maxDamage = STRONG_ATTACK_VALUE;
  }

  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
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
  endRound();
}

//event listeners

attackBtn.addEventListener("click", attackHander);
strongAttackBtn.addEventListener("click", strongAttackHander);
healBtn.addEventListener("click", healPlayerHandler);
