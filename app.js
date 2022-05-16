const pokeURL = "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0";
const image = document.getElementById("pokemon-img");
const catchRate = document.getElementById("catch-rate");
const start = document.getElementById("start");
const wildPokemon = document.getElementById("wild-pokemon");
const pokeballs = document.getElementById("pokeballs");
const score = document.getElementById("score");
const run = document.getElementById("run");
const caught = document.getElementById("caught");
const cashIn = document.getElementById("cash-in");

const pokemonArray = [];
const rarities = [
  "Very Common",
  "Common",
  "Uncommon",
  "Rare",
  "Very Rare",
  "Mythic",
  "Legendary",
];

class Game {
  constructor(count, score) {
    this.count = count;
    this.score = score;
    this.caught = [...pokemonArray];
    this.currentPokemon;
    this.catchRate = 100;
    this.spawnBonus = 100;
    this.cashInValue = 1;
    this.cashInMultiplier = 1;
  }

  init() {
    this.count = 0;
    this.score = 0;
    this.catchRate = 100;
    this.spawnBonus = 100;
    this.cashInValue = 1;
    this.cashInMultiplier = 1;
    start.textContent = "Click to restart";
    pokeballs.textContent = `${this.count} Pokeballs thrown`;
    cashIn.textContent = `(click me to cash in ${this.cashInValue} as score!)`;
    score.textContent = `Your score is ${this.score}`;
    run.textContent = "Run away Safely!";
    spawnPokemonFromCategory();
    this.caught.forEach((pokemon) => (pokemon.count = 0));
    this.updateArray();
  }

  updateCount() {
    pokeballs.textContent = `${this.count} Pokeballs thrown`;
    cashIn.textContent = `(click me to cash in ${this.cashInValue} as score!)`;
    score.textContent = `Your score is ${this.score}`;
  }

  attemptCatch() {
    let rng = Math.floor(Math.random() * 100) + 1;
    this.calculateSuccess(this.currentPokemon, rng);
  }

  calculateSuccess(pokemon, rng) {
    if (pokemon.rarity === "Very Common") {
      let vCommonCR = this.catchRate / 10; //10
      catchRate.textContent = `V. Common ${vCommonCR.toFixed(2)}% Catch Rate`;
      this.calcSuccess(vCommonCR, rng, pokemon);
    } else if (pokemon.rarity === "Common") {
      let commonCR = this.catchRate / 15; //7.15
      catchRate.textContent = `Common ${commonCR.toFixed(2)}% Catch Rate`;
      this.calcSuccess(commonCR, rng, pokemon);
    } else if (pokemon.rarity === "Uncommon") {
      let uncommonCR = this.catchRate / 20; //5
      catchRate.textContent = `Uncommon ${uncommonCR.toFixed(2)}% Catch Rate`;
      this.calcSuccess(uncommonCR, rng, pokemon);
    } else if (pokemon.rarity === "Rare") {
      let rareCR = this.catchRate / 30; //3.33
      catchRate.textContent = `Rare ${rareCR.toFixed(2)}% Catch Rate`;
      this.calcSuccess(rareCR, rng, pokemon);
    } else if (pokemon.rarity === "Very Rare") {
      let vRareCR = this.catchRate / 40; //2.5
      catchRate.textContent = `Very Rare ${vRareCR.toFixed(2)}% Catch Rate`;
      this.calcSuccess(vRareCR, rng, pokemon);
    } else if (pokemon.rarity === "Mythic") {
      let mythicCR = this.catchRate / 58; //1.73
      catchRate.textContent = `Mythic ${mythicCR.toFixed(2)}% Catch Rate`;
      this.calcSuccess(mythicCR, rng, pokemon);
    } else if (pokemon.rarity === "Legendary") {
      let legendaryCR = this.catchRate / 80; //1.25
      catchRate.textContent = `Legendary ${legendaryCR.toFixed(2)}% Catch Rate`;
      this.calcSuccess(legendaryCR, rng, pokemon);
    }
  }

  calcSuccess(cr, rng, pokemon) {
    if (rng <= cr) {
      this.succesCatch(pokemon);
    } else {
      this.failedCatch(pokemon);
    }
  }

  succesCatch(pokemon) {
    this.count++;
    this.score = this.score + pokemon.value;
    pokemon.count++;
    console.log(pokemon);
    this.updateCount();
    this.updateArray();
    spawnPokemonFromCategory();
  }

  failedCatch(pokemon) {
    this.count++;
    this.updateCount();
  }

  runAwaySafely() {
    spawnPokemonFromCategory();
  }

  updateArray() {
    this.caught = [...pokemonArray];

    emptyNode(caught);

    for (let i = 0; i < this.caught.length; i++) {
      createPokemonDOM(this.caught[i]);
    }
  }

  updateCashInValue() {
    this.cashInValue = this.count * this.cashInMultiplier;
    cashIn.textContent = `(click me to cash in ${this.cashInValue.toFixed(
      2
    )} as score!) * 1/${this.cashInMultiplier} ratio`;
  }

  cashInPokeballs() {
    this.score = this.score + this.cashInValue;
    this.cashInValue = 0;
    this.count = 0;

    pokeballs.textContent = `${this.count} Pokeballs thrown`;
    cashIn.textContent = `(click me to cash in ${this.cashInValue} as score!)`;
    score.textContent = `Your score is ${this.score}`;
  }
}

async function getPokemons(url) {
  const data = await fetch(url);
  const response = await data.json();

  for (let i = 0; i < response.results.length; i++) {
    await processPokemon(response.results[i].url);
  }
}

async function processPokemon(url) {
  const data = await fetch(url);
  const response = await data.json();

  pokemonArray.push(pokemonFactory(response));
}

function pokemonFactory(response) {
  return {
    id: response.id,
    name: response.name,
    sprite: response.sprites.front_default,
    rarity: rarityCalculator(response.id),
    value: valueCalculator(response.id),
    count: 0,
  };
}

function rarityCalculator(id) {
  if (id > 149) {
    return "Legendary";
  } else if (id > 141 && id < 150) {
    return "Mythic";
  } else if (id > 128 && id < 142) {
    return "Very Rare";
  } else if (id > 101 && id < 129) {
    return "Rare";
  } else if (id > 80 && id < 102) {
    return "Uncommon";
  } else if (id > 60 && id < 81) {
    return "Common";
  } else {
    return "Very Common";
  }
}

function valueCalculator(id) {
  if (id > 149) {
    return 12000;
  } else if (id > 141 && id < 150) {
    return 6000;
  } else if (id > 128 && id < 142) {
    return 3000;
  } else if (id > 101 && id < 129) {
    return 2000;
  } else if (id > 80 && id < 102) {
    return 1000;
  } else if (id > 60 && id < 81) {
    return 500;
  } else {
    return 250;
  }
}

function spawnPokemon(rarity) {
  let chosenPokemons = pokemonArray.filter(
    (pokemon) => pokemon.rarity === rarity
  );
  let rng = Math.floor(Math.random() * chosenPokemons.length);

  wildPokemon.textContent = `A wild ${chosenPokemons[rng].name} appeared!`;
  image.src = chosenPokemons[rng].sprite;
  game.currentPokemon = chosenPokemons[rng];
}

function spawnPokemonFromCategory() {
  let random = Math.floor(Math.random() * game.spawnBonus) + 1;

  if (random >= 63 && random <= 100) {
    spawnPokemon("Very Common");
  } else if (random >= 36 && random < 63) {
    spawnPokemon("Common");
  } else if (random >= 19 && random < 36) {
    spawnPokemon("Uncommon");
  } else if (random >= 9 && random < 19) {
    spawnPokemon("Rare");
  } else if (random >= 4 && random < 9) {
    spawnPokemon("Very Rare");
  } else if (random >= 2 && random < 4) {
    spawnPokemon("Mythic");
  } else if (random === 1) spawnPokemon("Legendary");
}

function createPokemonDOM(pokemon) {
  const div = document.createElement("div");
  const p = document.createElement("p");
  const img = document.createElement("img");

  img.src = pokemon.sprite;
  div.appendChild(img);

  p.textContent = pokemon.count;
  div.appendChild(p);

  div.className = "pokemon";
  caught.appendChild(div);
}

function emptyNode(parent) {
  while (parent.firstChild) {
    parent.firstChild.remove();
  }
}

const game = new Game(0, 0);

start.addEventListener("click", () => {
  game.init();
  //  spawnPokemonFromCategory();
});

image.addEventListener("click", () => {
  game.attemptCatch();
  game.updateCashInValue();
});

run.addEventListener("click", () => {
  game.runAwaySafely();
});

cashIn.addEventListener("click", () => {
  game.cashInPokeballs();
});

getPokemons(pokeURL);
