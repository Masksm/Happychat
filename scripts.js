(() => {
  const SAVE_KEY = "little-kingdom-save-v1";
  const initialState = {
    day: 1, gold: 10000, food: 500, wood: 500, stone: 500,
    population: 1000, territories: 1, army: 0,
    buildings: { farm: 0, barracks: 0, lumber: 0 },
    events: [{ title: "Your reign begins", detail: "You take charge of Greenvale.", day: 1 }]
  };
  let state = loadState();
  let toastTimer;

  const definitions = {
    farm: { name: "Farm", icon: "🌾", cost: { wood: 100, stone: 100, gold: 500 }, produces: "25 food/day" },
    barracks: { name: "Barracks", icon: "⚑", cost: { wood: 150, stone: 100, gold: 1000 }, produces: "Defense building" },
    lumber: { name: "Lumber camp", icon: "♣", cost: { food: 100, stone: 100, gold: 500 }, produces: "25 wood/day" }
  };

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
      if (saved && saved.buildings && Array.isArray(saved.events)) {
        return { ...structuredClone(initialState), ...saved, buildings: { ...initialState.buildings, ...saved.buildings } };
      }
    } catch (error) { console.warn("Could not load saved kingdom.", error); }
    return structuredClone(initialState);
  }

  function saveState() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }
    catch (error) { console.warn("Could not save kingdom progress.", error); }
  }

  function number(value) { return Math.floor(value).toLocaleString(); }

  function render() {
    ["gold", "food", "wood", "stone", "population", "army"].forEach(key => {
      document.getElementById(key).textContent = number(state[key]);
    });
    document.getElementById("day-label").textContent = "DAY " + state.day;
    document.getElementById("territories").textContent = state.territories + (state.territories === 1 ? " territory" : " territories");
    const total = Object.values(state.buildings).reduce((sum, count) => sum + count, 0);
    document.getElementById("building-count").textContent = total;
    document.getElementById("building-badge").textContent = total;
    renderBuildings();
    renderEvents();
    Object.entries(definitions).forEach(([key, building]) => {
      const button = document.getElementById("build-" + key);
      const affordable = Object.entries(building.cost).every(([resource, amount]) => state[resource] >= amount);
      button.disabled = !affordable;
      button.title = affordable ? "Build " + building.name : "Not enough resources";
      button.style.opacity = affordable ? "1" : ".48";
    });
    saveState();
  }

  function renderBuildings() {
    const list = document.getElementById("building-list");
    const built = Object.entries(state.buildings).filter(([, count]) => count > 0);
    if (!built.length) {
      list.className = "empty-state";
      list.innerHTML = "<span>⌂</span><b>Your land is untouched.</b><p>Build your first farm to get the kingdom moving.</p>";
      return;
    }
    list.className = "building-list";
    list.replaceChildren();
    built.forEach(([key, count]) => {
      const def = definitions[key];
      const item = document.createElement("div");
      item.className = "building-item";
      const icon = document.createElement("span"); icon.className = "building-emoji"; icon.textContent = def.icon;
      const info = document.createElement("div");
      const name = document.createElement("b"); name.textContent = def.name + (count > 1 ? "s" : "");
      const detail = document.createElement("small"); detail.textContent = def.produces;
      info.append(name, detail);
      const qty = document.createElement("strong"); qty.textContent = "× " + count;
      item.append(icon, info, qty); list.append(item);
    });
  }

  function renderEvents() {
    const list = document.getElementById("event-log");
    list.replaceChildren();
    state.events.slice(0, 5).forEach(event => {
      const li = document.createElement("li");
      const dot = document.createElement("span"); dot.className = "event-dot";
      const info = document.createElement("div");
      const title = document.createElement("b"); title.textContent = event.title;
      const detail = document.createElement("small"); detail.textContent = event.detail;
      info.append(title, detail);
      const time = document.createElement("time"); time.textContent = "Day " + event.day;
      li.append(dot, info, time); list.append(li);
    });
  }

  function record(title, detail) {
    state.events.unshift({ title, detail, day: state.day });
    state.events = state.events.slice(0, 12);
  }

  function notify(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message; toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
  }

  document.querySelectorAll("[data-gather]").forEach(button => {
    button.addEventListener("click", () => {
      const resource = button.dataset.gather;
      state[resource] += 50;
      const label = resource.charAt(0).toUpperCase() + resource.slice(1);
      record("Gathered " + label.toLowerCase(), "Your people collected 50 " + label.toLowerCase() + ".");
      render(); notify("+50 " + label);
    });
  });

  Object.entries(definitions).forEach(([key, def]) => {
    document.getElementById("build-" + key).addEventListener("click", () => {
      const canAfford = Object.entries(def.cost).every(([resource, amount]) => state[resource] >= amount);
      if (!canAfford) { notify("Not enough resources yet."); return; }
      Object.entries(def.cost).forEach(([resource, amount]) => state[resource] -= amount);
      state.buildings[key] += 1;
      if (key === "barracks") state.army += 25;
      record("Built " + def.name.toLowerCase(), "A new " + def.name.toLowerCase() + " joins your settlement.");
      render(); notify(def.name + " built successfully.");
    });
  });

  document.getElementById("next-day").addEventListener("click", () => {
    state.day += 1;
    const foodGain = state.buildings.farm * 25;
    const woodGain = state.buildings.lumber * 25;
    state.food += foodGain; state.wood += woodGain;
    let detail = [];
    if (foodGain) detail.push("+" + foodGain + " food");
    if (woodGain) detail.push("+" + woodGain + " wood");
    if (!detail.length) detail.push("No production yet. Build a farm or lumber camp.");
    record("Day " + state.day + " begins", detail.join(" · "));
    render(); notify("Day " + state.day + " begins");
  });

  document.getElementById("reset-game").addEventListener("click", () => {
    if (!window.confirm("Restart your kingdom? All saved progress for this game will be reset.")) return;
    state = structuredClone(initialState);
    render(); notify("A new reign begins.");
  });

  render();
})();