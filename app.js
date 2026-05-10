const state = {
  documents: [],
  query: "",
  topic: "todas",
  type: "todos"
};

const els = {
  search: document.querySelector("#searchInput"),
  topic: document.querySelector("#topicFilter"),
  type: document.querySelector("#typeFilter"),
  clear: document.querySelector("#clearButton"),
  grid: document.querySelector("#documentGrid"),
  empty: document.querySelector("#emptyState"),
  resultCount: document.querySelector("#resultCount"),
  totalCount: document.querySelector("#totalCount"),
  topicCount: document.querySelector("#topicCount"),
  updatedAt: document.querySelector("#updatedAt")
};

const normalize = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const formatDate = (value) => {
  if (!value) return "-";
  const [year, month, day] = value.split("-");
  return `${day}-${month}-${year}`;
};

const uniqueSorted = (items) => [...new Set(items)].sort((a, b) => a.localeCompare(b, "es"));

const searchableText = (doc) =>
  normalize([
    doc.id,
    doc.titulo,
    doc.tematica,
    doc.tipo,
    doc.descripcion,
    doc.version,
    ...(doc.palabrasClave || [])
  ].join(" "));

function populateFilters() {
  uniqueSorted(state.documents.map((doc) => doc.tematica)).forEach((topic) => {
    const option = document.createElement("option");
    option.value = topic;
    option.textContent = topic;
    els.topic.append(option);
  });

  uniqueSorted(state.documents.map((doc) => doc.tipo)).forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    els.type.append(option);
  });
}

function updateSummary() {
  const dates = state.documents.map((doc) => doc.fecha).sort();
  els.totalCount.textContent = state.documents.length;
  els.topicCount.textContent = uniqueSorted(state.documents.map((doc) => doc.tematica)).length;
  els.updatedAt.textContent = formatDate(dates.at(-1));
}

function renderCards(documents) {
  els.grid.innerHTML = "";

  documents.forEach((doc) => {
    const card = document.createElement("article");
    card.className = "doc-card";
    card.innerHTML = `
      <div class="doc-meta">
        <span class="chip">${doc.tematica}</span>
        <span class="chip alt">${doc.tipo}</span>
      </div>
      <h3>${doc.titulo}</h3>
      <p>${doc.descripcion}</p>
      <div class="doc-foot">
        <span><strong>Version:</strong> ${doc.version}</span>
        <span><strong>Fecha:</strong> ${formatDate(doc.fecha)}</span>
        <span><strong>ID:</strong> ${doc.id}</span>
        <span><strong>Estado:</strong> ${doc.estado}</span>
      </div>
      <div class="doc-actions">
        <a href="${doc.archivo}">Abrir ficha</a>
        <a href="${doc.archivo}" target="_blank" rel="noopener">Nueva pesta&ntilde;a</a>
      </div>
    `;
    els.grid.append(card);
  });
}

function applyFilters() {
  const filtered = state.documents.filter((doc) => {
    const matchesQuery = !state.query || searchableText(doc).includes(normalize(state.query));
    const matchesTopic = state.topic === "todas" || doc.tematica === state.topic;
    const matchesType = state.type === "todos" || doc.tipo === state.type;
    return matchesQuery && matchesTopic && matchesType;
  });

  renderCards(filtered);
  els.empty.hidden = filtered.length > 0;
  els.resultCount.textContent = `${filtered.length} de ${state.documents.length} documentos`;
}

function bindEvents() {
  els.search.addEventListener("input", (event) => {
    state.query = event.target.value;
    applyFilters();
  });

  els.topic.addEventListener("change", (event) => {
    state.topic = event.target.value;
    applyFilters();
  });

  els.type.addEventListener("change", (event) => {
    state.type = event.target.value;
    applyFilters();
  });

  els.clear.addEventListener("click", () => {
    state.query = "";
    state.topic = "todas";
    state.type = "todos";
    els.search.value = "";
    els.topic.value = "todas";
    els.type.value = "todos";
    applyFilters();
    els.search.focus();
  });
}

async function init() {
  try {
    const response = await fetch("documents.json", { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudo cargar documents.json");
    state.documents = await response.json();
    populateFilters();
    updateSummary();
    bindEvents();
    applyFilters();
  } catch (error) {
    els.resultCount.textContent = "No fue posible cargar el repositorio.";
    els.empty.hidden = false;
    els.empty.querySelector("p").textContent = error.message;
  }
}

init();
