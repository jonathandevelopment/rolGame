let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];
let stripes = 0;
let belt = "Blanco";
let belts = ["Blanco", "Azul", "Morado", "Marrón", "Negro"];
let beltCounter = 0;

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const stripesText = document.querySelector("#stripesText");
const beltText = document.querySelector("#beltText");
const weapons = [
  { name: 'stick', power: 5 },
  { name: 'dagger', power: 30 },
  { name: 'claw hammer', power: 50 },
  { name: 'sword', power: 100 }
];
const monsters = [
  {
    name: "Soto",
    level: 2,
    health: 15,
    belt: "Blanco"
  },
  {
    name: "Brayan",
    level: 8,
    health: 25,
    belt: "Azul"
  },
  {
    name: "dragon",
    level: 20,
    health: 300,
    belt: "Negro"
  }
]
const actions = [
  {
    name: "town square",
    "button text": ["Tienda", "Ir a la academia", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: "Estás en el centro de tu ciudad"
  },
  {
    name: "store",
    "button text": ["Incrementar 10 salud ($10)", "Buy weapon (30 gold)", "Ir al pueblo"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "Estás en la Tienda"
  },
  {
    name: "cave",
    "button text": ["Rollar con cinturon blanco", "Rollar con cinturon azul", "Ir al pueblo"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "Estás en la academia. Los roles van a empezar. Seleciona tu compañero."
  },
  {
    name: "fight",
    "button text": ["Atacar", "Meter en Guardia", "Tap out"],
    "button functions": [attack, dodge, goTown],
    text: "Estas luchando con tu compañero"
  },
  {
    name: "kill monster",
    "button text": ["Ir al pueblo", "Ir al pueblo", "easterEgg"],
    "button functions": [goTown, goTown, easterEgg],
    text: 'Felicidades has ganado el combate. Ganaste experiencia y un bonus $$$.'
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You die. &#x2620;"
  },
  { 
    name: "win", 
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"], 
    "button functions": [restart, restart, restart], 
    text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;" 
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Ir al pueblo?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
  }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(action) {
  monsterStats.style.display = "none";
  button1.innerText = action["button text"][0];
  button2.innerText = action["button text"][1];
  button3.innerText = action["button text"][2];
  button1.onclick = action["button functions"][0];
  button2.onclick = action["button functions"][1];
  button3.onclick = action["button functions"][2];
  text.innerHTML = action.text;
}

function goTown() {
  update(actions[0]);
}

function goStore() {
  update(actions[1]);
}

function goCave() {
  update(actions[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "$ insuficiente.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " In your inventory you have: " + inventory;
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "You sold a " + currentWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(actions[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText += " You miss.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " Your " + inventory.pop() + " breaks.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "You dodge the attack from the " + monsters[fighting].name;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;

  update(actions[4]);
  updateLevel();
}

function lose() {
  update(actions[5]);
}

function winGame() {
  update(actions[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(actions[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Right! You win 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Wrong! You lose 10 health!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}

const updateLevel = () => {
  const remainingStripes = xp % 16; // Calculate the remaining stripes after promotion
  stripes = Math.floor(remainingStripes / 4); // Adjust stripes based on remaining stripes
  stripesText.innerText = stripes;

  if (stripes === 0 && xp >= 16) { // Check if the player has obtained a total of 4 stripes and has enough XP
    const remainingBelts = Math.floor(xp / 16); // Calculate the remaining belts after promotion
    beltCounter = remainingBelts; // Adjust belt counter based on remaining belts

    if (beltCounter < belts.length) { // Check if there are more belt colors available
      beltText.innerText = belts[beltCounter];
      stripes = 0; // Reset stripes to 0 when promoted to a new belt
      stripesText.innerText = stripes;
    } else {
      // Handle case where player has reached the maximum belt color
      // For example, you can display a message indicating the player has reached the maximum level
      beltText.innerText = "Maximum level reached";
    }
  }
}




