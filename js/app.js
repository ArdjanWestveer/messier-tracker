(function () {
  "use strict";

  const state = {
    status: "all",   // all | photographed | missing
    type: "all",
    sort: "catalog",
  };

  const grid = document.getElementById("object-grid");
  const typeSelect = document.getElementById("type-filter");
  const sortSelect = document.getElementById("sort-select");
  const statusFilters = document.getElementById("status-filters");

  init();

  function init() {
    populateTypeFilter();
    bindControls();
    bindDetailOverlay();
    render();
  }

  function populateTypeFilter() {
    const types = Array.from(new Set(MESSIER_DATA.map((o) => o.type))).sort();
    for (const t of types) {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t;
      typeSelect.appendChild(opt);
    }
  }

  function bindControls() {
    statusFilters.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-chip");
      if (!btn) return;
      state.status = btn.dataset.filter;
      [...statusFilters.children].forEach((c) => c.classList.toggle("is-active", c === btn));
      render();
    });

    typeSelect.addEventListener("change", () => {
      state.type = typeSelect.value;
      render();
    });

    sortSelect.addEventListener("change", () => {
      state.sort = sortSelect.value;
      render();
    });
  }

  function getFiltered() {
    let items = MESSIER_DATA.slice();

    if (state.status === "photographed") items = items.filter((o) => o.photographed);
    if (state.status === "missing") items = items.filter((o) => !o.photographed);
    if (state.type !== "all") items = items.filter((o) => o.type === state.type);

    switch (state.sort) {
      case "constellation":
        items.sort((a, b) => a.constellation.localeCompare(b.constellation) || a.id - b.id);
        break;
      case "status":
        items.sort((a, b) => (b.photographed - a.photographed) || a.id - b.id);
        break;
      default:
        items.sort((a, b) => a.id - b.id);
    }
    return items;
  }

  function render() {
    renderProgress();
    renderGrid();
  }

  function renderProgress() {
    const total = MESSIER_DATA.length;
    const done = MESSIER_DATA.filter((o) => o.photographed).length;
    document.getElementById("progress-count").textContent = done;
    document.getElementById("progress-fill").style.width = `${(done / total) * 100}%`;

    const note = document.getElementById("progress-note");
    const remaining = total - done;
    note.textContent =
      remaining === 0
        ? "The full catalogue, caught."
        : `${remaining} object${remaining === 1 ? "" : "s"} left to find a clear night for.`;
  }

  function renderGrid() {
    const items = getFiltered();
    grid.innerHTML = "";

    if (items.length === 0) {
      const empty = document.createElement("p");
      empty.style.color = "var(--star-dim)";
      empty.style.gridColumn = "1 / -1";
      empty.textContent = "Nothing matches that combination of filters.";
      grid.appendChild(empty);
      return;
    }

    for (const obj of items) {
      grid.appendChild(buildCard(obj));
    }
  }

  function buildCard(obj) {
    const card = document.createElement("button");
    card.className = "card";
    card.setAttribute("aria-label", `${obj.catalog}, ${obj.commonName || obj.type}`);

    const plate = document.createElement("div");
    plate.className = "card-plate" + (obj.photographed && obj.image ? "" : " is-missing");

    if (obj.photographed && obj.image) {
      const img = document.createElement("img");
      img.src = obj.image;
      img.alt = `${obj.catalog}${obj.commonName ? " — " + obj.commonName : ""}`;
      img.loading = "lazy";
      plate.appendChild(img);
    } else {
      const mark = document.createElement("span");
      mark.className = "placeholder-mark";
      mark.textContent = "not yet observed";
      plate.appendChild(mark);
    }

    const dot = document.createElement("span");
    dot.className = "card-status-dot" + (obj.photographed ? "" : " is-missing");
    plate.appendChild(dot);

    const catalogTag = document.createElement("span");
    catalogTag.className = "card-catalog";
    catalogTag.textContent = obj.catalog;
    plate.appendChild(catalogTag);

    const body = document.createElement("div");
    body.className = "card-body";

    const name = document.createElement("p");
    name.className = "card-name";
    name.textContent = obj.commonName || obj.type;

    const sub = document.createElement("p");
    sub.className = "card-sub";
    sub.textContent = `${obj.constellation} · ${obj.type}`;

    body.appendChild(name);
    body.appendChild(sub);

    card.appendChild(plate);
    card.appendChild(body);

    card.addEventListener("click", () => openDetail(obj));

    return card;
  }

  // ---------------------------------------------------------
  // Detail overlay
  // ---------------------------------------------------------
  let lastFocused = null;

  function bindDetailOverlay() {
    const overlay = document.getElementById("detail-overlay");
    document.getElementById("detail-close").addEventListener("click", closeDetail);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeDetail();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) closeDetail();
    });
  }

  function openDetail(obj) {
    lastFocused = document.activeElement;

    const media = document.getElementById("detail-media");
    media.innerHTML = "";
    if (obj.photographed && obj.image) {
      const img = document.createElement("img");
      img.src = obj.image;
      img.alt = `${obj.catalog}${obj.commonName ? " — " + obj.commonName : ""}`;
      media.appendChild(img);
    } else {
      const mark = document.createElement("span");
      mark.className = "placeholder-mark";
      mark.textContent = "No photo yet — one clear night away.";
      media.appendChild(mark);
    }

    document.getElementById("detail-plate").textContent = obj.catalog;
    document.getElementById("detail-title").textContent = obj.commonName || obj.type;

    document.getElementById("detail-meta").textContent =
      `${obj.type} in ${obj.constellation}`;

    const facts = document.getElementById("detail-facts");
    facts.innerHTML = "";
    addFact(facts, "Status", obj.photographed ? "Captured" : "Not yet captured");
    if (obj.datePhotographed) addFact(facts, "Date", obj.datePhotographed);
    if (obj.equipment) addFact(facts, "Equipment", obj.equipment);
    if (obj.exposure) addFact(facts, "Exposure", obj.exposure);

    const notes = document.getElementById("detail-notes");
    if (obj.notes) {
      notes.textContent = obj.notes;
      notes.classList.remove("is-empty");
    } else {
      notes.textContent = obj.photographed
        ? "No notes added for this one yet."
        : "Add a note in data/messier.json once you've caught this one.";
      notes.classList.add("is-empty");
    }

    const overlay = document.getElementById("detail-overlay");
    overlay.classList.add("is-open");
    document.getElementById("detail-close").focus();
  }

  function addFact(container, label, value) {
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value;
    container.appendChild(dt);
    container.appendChild(dd);
  }

  function closeDetail() {
    document.getElementById("detail-overlay").classList.remove("is-open");
    if (lastFocused) lastFocused.focus();
  }
})();
