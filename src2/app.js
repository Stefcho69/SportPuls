/* SportPulse — demo logic (no backend) */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const STORAGE_THEME = "sportpulse.theme";
const STORAGE_BOOKMARKS = "sportpulse.bookmarks";

const state = {
  filter: "all",
  query: "",
  sort: "latest",
  onlyBreaking: false,
  bookmarks: new Set(),
  featureId: null,
};

const DATA = {
  news: [
    {
      id: "n1",
      sport: "football",
      sportLabel: "Футбол",
      title: "Дербито завърши с драматичен обрат в последните минути",
      lead: "Два гола след 85-ата минута обърнаха развоя и взривиха трибуните.",
      timeISO: isoMinutesAgo(18),
      reads: 18420,
      breaking: true,
      body: [
        "В мач с високо темпо и много дуели, гостите поведоха още в началото, но домакините постепенно поеха контрол.",
        "Ключовата промяна дойде след двойна смяна, която изненада защитата и отвори пространства между линиите.",
        "В последните минути напрежението ескалира, а победният гол падна след рикошет и бърза реакция в наказателното поле.",
      ],
    },
    {
      id: "n2",
      sport: "basketball",
      sportLabel: "Баскетбол",
      title: "MVP представяне: 34 точки и решаваща тройка в края",
      lead: "Лидерът на отбора затвори мача със серия от точни стрелби под напрежение.",
      timeISO: isoMinutesAgo(52),
      reads: 10950,
      breaking: false,
      body: [
        "Срещата започна равностойно, но силната защита във втората четвърт донесе важна преднина.",
        "В решаващите моменти гардът пое отговорността и реализира ключови точки от дрибъл и от линията за наказателни.",
      ],
    },
    {
      id: "n3",
      sport: "tennis",
      sportLabel: "Тенис",
      title: "Фаворитът оцеля след мачбол и продължи напред",
      lead: "Един от най-добрите сервиси на сезона спаси мачбола и обърна инерцията.",
      timeISO: isoMinutesAgo(95),
      reads: 8350,
      breaking: false,
      body: [
        "Двубоят премина през резки смени на инициативата, а решаващи се оказаха ретурите във важните точки.",
        "След спасения мачбол, фаворитът повиши процента на първи сервис и изигра по-смело разиграванията.",
      ],
    },
    {
      id: "n4",
      sport: "motorsport",
      sportLabel: "Моторспорт",
      title: "Нов пакет подобрения донесе по-добро темпо в квалификацията",
      lead: "Инженерите оптимизираха аеродинамиката и балансът се усети веднага.",
      timeISO: isoMinutesAgo(140),
      reads: 6420,
      breaking: false,
      body: [
        "Отборът отчете по-добра стабилност в бързите завои и по-малко деградация на гумите.",
        "Пилотът отбеляза, че усещането при спиране е по-предвидимо, което позволява по-агресивни атаки на обиколка.",
      ],
    },
    {
      id: "n5",
      sport: "football",
      sportLabel: "Футбол",
      title: "Трансферен прозорец: кой идва и кой си тръгва (обзор)",
      lead: "Подреждаме най-интересните слухове и официални сделки в кратък списък.",
      timeISO: isoMinutesAgo(210),
      reads: 15100,
      breaking: false,
      body: [
        "Клубовете вече работят по позициите, които искат да подсилят, а агентите са по-активни от всякога.",
        "Тази година тенденцията е към по-кратки договори и бонуси, обвързани с представянето.",
      ],
    },
    {
      id: "n6",
      sport: "basketball",
      sportLabel: "Баскетбол",
      title: "Тактически анализ: защо зоната работи срещу бързи гардове",
      lead: "Един прост принцип и две корекции могат да спрат пик-н-рол машините.",
      timeISO: isoMinutesAgo(290),
      reads: 7200,
      breaking: false,
      body: [
        "Когато гардовете търсят смяна, зоната ги принуждава да вземат решения под натиск и намалява ъглите за пас.",
        "Ключът е в активните ръце по линиите и бързото затваряне към стрелците в ъглите.",
      ],
    },
    {
      id: "n7",
      sport: "tennis",
      sportLabel: "Тенис",
      title: "Времето обърка графика: програмата се мести за утре",
      lead: "Организаторите обявиха промени заради дъжд и влажност на корта.",
      timeISO: isoMinutesAgo(360),
      reads: 4100,
      breaking: true,
      body: [
        "Решението е взето след консултации със съдиите и медицинския екип.",
        "Очаква се по-плътна програма и по-къси паузи между мачовете на следващия ден.",
      ],
    },
    {
      id: "n8",
      sport: "motorsport",
      sportLabel: "Моторспорт",
      title: "Стратегия с едно спиране: рискът, който може да донесе подиум",
      lead: "Съчетание от деградация, трафик и тайминг за питстоп.",
      timeISO: isoMinutesAgo(420),
      reads: 5200,
      breaking: false,
      body: [
        "Отборите, които тръгват с по-твърда смес, могат да удължат първия стинт и да спечелят позиция при виртуална кола за сигурност.",
        "Но трафикът след спиране е решаващ — излизане сред по-бавни коли може да обезсмисли целия план.",
      ],
    },
    {
      id: "n9",
      sport: "football",
      sportLabel: "Футбол",
      title: "Треньорът: “Имаме нужда от повече контрол, не само емоция”",
      lead: "След серия от колебливи резултати фокусът е върху дисциплина и баланс.",
      timeISO: isoMinutesAgo(520),
      reads: 9800,
      breaking: false,
      body: [
        "Наставникът подчерта важността на спокойните решения и избягването на прибързани дълги топки.",
        "Следващите мачове ще покажат дали корекциите в средата на терена дават нужния контрол.",
      ],
    },
  ],
  highlights: [
    {
      title: "Тенденция: повече “млади капитани” в елита",
      desc: "Отбори залагат на лидери под 25, които движат темпото и отговорността.",
    },
    {
      title: "Данни: защо високата преса печели точки",
      desc: "Късите атаки след отнета топка стават все по-решаващи във важни мачове.",
    },
    {
      title: "Форма: сервирай по-умно, не по-силно",
      desc: "Позиционирането и вариацията носят повече лесни точки от чистата мощ.",
    },
    {
      title: "Писта: гумите са историята този уикенд",
      desc: "Малки разлики в температурата променят деградацията и стратегията.",
    },
  ],
  scores: [
    { competition: "Първа лига", match: "Левски – ЦСКА", score: "2:1", status: "FT" },
    { competition: "Евролига", match: "Барса – Реал", score: "88:84", status: "FT" },
    { competition: "ATP 500", match: "Иванов – Smith", score: "6:4 3:6 7:6", status: "FT" },
    { competition: "GP (пример)", match: "Quali — Top 3", score: "1. A / 2. B / 3. C", status: "Завърши" },
  ],
};

init();

function init() {
  wireTheme();
  wireNav();
  wireSearchAndFilters();
  wireModalsAndActions();
  wireNewsletter();
  renderAll();
  updateKpis();
  $("#year").textContent = String(new Date().getFullYear());
}

function wireTheme() {
  const themeBtn = $("#themeBtn");
  const saved = localStorage.getItem(STORAGE_THEME);
  const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)")?.matches;
  const initial = saved || (prefersLight ? "light" : "dark");
  setTheme(initial);

  themeBtn?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    setTheme(next);
  });

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_THEME, theme);
    themeBtn?.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
  }
}

function wireNav() {
  const toggle = $(".nav__toggle");
  const menu = $("#navMenu");

  toggle?.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  $$(".nav__link").forEach((a) => {
    a.addEventListener("click", () => {
      menu?.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
      setActiveNav(a.getAttribute("href"));
    });
  });

  window.addEventListener("scroll", () => {
    // Light “scrollspy” using nearest section to top
    const anchors = $$(".nav__link").map((a) => a.getAttribute("href")).filter(Boolean);
    const ids = anchors.filter((h) => h.startsWith("#")).map((h) => h.slice(1));
    const pos = window.scrollY + 140;
    let best = null;
    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) continue;
      const top = el.offsetTop;
      if (top <= pos) best = `#${id}`;
    }
    if (best) setActiveNav(best);
  });

  $("#scrollTop")?.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function setActiveNav(hash) {
  if (!hash) return;
  $$(".nav__link").forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === hash));
}

function wireSearchAndFilters() {
  const searchInput = $("#searchInput");
  const clearBtn = $("#clearSearchBtn");
  const sortSelect = $("#sortSelect");
  const onlyBreaking = $("#onlyBreaking");
  const resetBtn = $("#resetFiltersBtn");

  $$(".chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter || "all";
      state.filter = filter;
      $$(".chip").forEach((b) => b.classList.toggle("is-selected", b === btn));
      renderNews();
      updateKpis();
    });
  });

  searchInput?.addEventListener("input", () => {
    state.query = searchInput.value.trim();
    renderNews();
    updateKpis();
  });

  clearBtn?.addEventListener("click", () => {
    state.query = "";
    if (searchInput) searchInput.value = "";
    renderNews();
    updateKpis();
    searchInput?.focus();
  });

  sortSelect?.addEventListener("change", () => {
    state.sort = sortSelect.value;
    renderNews();
  });

  onlyBreaking?.addEventListener("change", () => {
    state.onlyBreaking = !!onlyBreaking.checked;
    renderNews();
    updateKpis();
  });

  resetBtn?.addEventListener("click", () => {
    state.filter = "all";
    state.query = "";
    state.sort = "latest";
    state.onlyBreaking = false;
    if (searchInput) searchInput.value = "";
    if (sortSelect) sortSelect.value = "latest";
    if (onlyBreaking) onlyBreaking.checked = false;
    $$(".chip").forEach((b) => b.classList.toggle("is-selected", b.dataset.filter === "all"));
    renderNews();
    updateKpis();
  });
}

function wireModalsAndActions() {
  loadBookmarks();
  updateBookmarksUi();

  $("#bookmarksBtn")?.addEventListener("click", () => openBookmarksModal());
  $("#clearBookmarksBtn")?.addEventListener("click", () => {
    state.bookmarks = new Set();
    persistBookmarks();
    updateBookmarksUi();
    renderNews(); // update save buttons
    renderBookmarksModalBody();
  });

  // Feature actions
  $("#featureReadBtn")?.addEventListener("click", () => {
    const item = DATA.news.find((n) => n.id === state.featureId) || DATA.news[0];
    openArticleModal(item);
  });
  $("#featureSaveBtn")?.addEventListener("click", () => {
    const item = DATA.news.find((n) => n.id === state.featureId) || DATA.news[0];
    toggleBookmark(item.id);
    updateBookmarksUi();
    renderNews();
    renderFeatureCard();
  });

  // Modal save button
  $("#modalSaveBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    const id = $("#articleModal")?.dataset.articleId;
    if (!id) return;
    toggleBookmark(id);
    updateBookmarksUi();
    renderNews();
    renderBookmarksModalBody();
    renderFeatureCard();
    updateModalSaveButton(id);
  });

  // Close nav menu when clicking outside (mobile)
  document.addEventListener("click", (e) => {
    const menu = $("#navMenu");
    const toggle = $(".nav__toggle");
    if (!menu || !toggle) return;
    if (!menu.classList.contains("is-open")) return;
    const t = e.target;
    if (!(t instanceof Element)) return;
    if (menu.contains(t) || toggle.contains(t)) return;
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  });
}

function wireNewsletter() {
  const form = $("#newsletterForm");
  const email = $("#emailInput");
  const note = $("#newsletterNote");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = (email?.value || "").trim();
    if (!note) return;
    note.className = "formNote";

    if (!isEmail(val)) {
      note.textContent = "Моля въведи валиден имейл адрес.";
      note.classList.add("is-bad");
      email?.focus();
      return;
    }

    note.textContent = "Готово! Демо абонаментът е потвърден.";
    note.classList.add("is-ok");
    if (email) email.value = "";
  });
}

function renderAll() {
  renderFeatureCard();
  renderNews();
  renderHighlights();
  renderScores();
}

function renderFeatureCard() {
  // pick "best" feature: breaking first, then by reads
  const pick = [...DATA.news]
    .sort((a, b) => Number(b.breaking) - Number(a.breaking) || b.reads - a.reads)[0];

  state.featureId = pick?.id ?? null;

  $("#featureTag").textContent = pick?.breaking ? "Breaking" : "Акцент";
  $("#featureTime").textContent = formatRelativeTime(pick?.timeISO);
  $("#featureTitle").textContent = pick?.title ?? "—";
  $("#featureDesc").textContent = pick?.lead ?? "—";

  const saveBtn = $("#featureSaveBtn");
  if (saveBtn && pick) {
    const saved = state.bookmarks.has(pick.id);
    saveBtn.textContent = saved ? "Запазено" : "Запази";
  }
}

function renderNews() {
  const grid = $("#newsGrid");
  const empty = $("#emptyState");
  if (!grid) return;

  const items = getVisibleNews();

  grid.innerHTML = items.map(renderNewsCard).join("");
  if (empty) empty.hidden = items.length > 0;

  // Wire card actions
  $$(".card", grid).forEach((card) => {
    const id = card.getAttribute("data-id");
    const readBtn = $(".js-read", card);
    const saveBtn = $(".js-save", card);
    if (!id) return;
    const item = DATA.news.find((n) => n.id === id);
    if (!item) return;

    readBtn?.addEventListener("click", () => openArticleModal(item));
    saveBtn?.addEventListener("click", () => {
      toggleBookmark(id);
      updateBookmarksUi();
      renderNews();
      renderBookmarksModalBody();
      renderFeatureCard();
    });
  });
}

function renderHighlights() {
  const host = $("#highlightsList");
  if (!host) return;
  host.innerHTML = DATA.highlights
    .map(
      (h) => `
      <article class="highlight">
        <h3 class="highlight__title">${escapeHtml(h.title)}</h3>
        <p class="highlight__desc">${escapeHtml(h.desc)}</p>
      </article>
    `
    )
    .join("");
}

function renderScores() {
  const host = $("#scoresTable");
  if (!host) return;
  host.innerHTML = [
    `<div class="row row--head" role="row">
      <div class="cell" role="columnheader">Турнир/Лига</div>
      <div class="cell" role="columnheader">Среща</div>
      <div class="cell" role="columnheader">Резултат</div>
      <div class="cell" role="columnheader">Статус</div>
    </div>`,
    ...DATA.scores.map(
      (s) => `
      <div class="row" role="row">
        <div class="cell" role="cell">${escapeHtml(s.competition)}</div>
        <div class="cell" role="cell">${escapeHtml(s.match)}</div>
        <div class="cell cell--score" role="cell">${escapeHtml(s.score)}</div>
        <div class="cell" role="cell">${escapeHtml(s.status)}</div>
      </div>
    `
    ),
  ].join("");
}

function updateKpis() {
  const visible = getVisibleNews();
  $("#kpiCount").textContent = String(visible.length);
  $("#kpiBookmarks").textContent = String(state.bookmarks.size);
  $("#kpiUpdated").textContent = new Date().toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" });
}

function getVisibleNews() {
  const q = state.query.toLowerCase();

  let list = DATA.news.filter((n) => {
    if (state.filter !== "all" && n.sport !== state.filter) return false;
    if (state.onlyBreaking && !n.breaking) return false;
    if (!q) return true;
    return (
      n.title.toLowerCase().includes(q) ||
      n.lead.toLowerCase().includes(q) ||
      n.sportLabel.toLowerCase().includes(q)
    );
  });

  if (state.sort === "popular") {
    list = list.sort((a, b) => b.reads - a.reads);
  } else {
    list = list.sort((a, b) => new Date(b.timeISO).getTime() - new Date(a.timeISO).getTime());
  }

  return list;
}

function renderNewsCard(n) {
  const badge = n.breaking
    ? `<span class="badge badge--breaking">Breaking</span>`
    : `<span class="badge">${escapeHtml(n.sportLabel)}</span>`;
  const saved = state.bookmarks.has(n.id);

  return `
    <article class="card" data-id="${escapeHtml(n.id)}">
      <div class="card__top">
        <div class="card__meta">
          ${badge}
          <span class="muted">${escapeHtml(formatRelativeTime(n.timeISO))}</span>
        </div>
        <span class="muted" title="Прочитания">${formatReads(n.reads)}</span>
      </div>
      <h3 class="card__title">${escapeHtml(n.title)}</h3>
      <p class="card__lead">${escapeHtml(n.lead)}</p>
      <div class="card__bottom">
        <div class="mini">
          <span>•</span>
          <span>${escapeHtml(n.sportLabel)}</span>
        </div>
        <div class="card__actions">
          <button class="smallBtn js-read" type="button">Прочети</button>
          <button class="smallBtn js-save" type="button">${saved ? "Запазено" : "Запази"}</button>
        </div>
      </div>
    </article>
  `;
}

function openArticleModal(item) {
  const dlg = $("#articleModal");
  if (!dlg || !("showModal" in dlg)) return;

  dlg.dataset.articleId = item.id;
  $("#modalTag").textContent = item.breaking ? "Breaking" : item.sportLabel;
  $("#modalTime").textContent = formatRelativeTime(item.timeISO);
  $("#modalReads").textContent = `${formatReads(item.reads)} прочитания`;
  $("#modalTitle").textContent = item.title;
  $("#modalLead").textContent = item.lead;
  $("#modalBody").innerHTML = item.body.map((p) => `<p>${escapeHtml(p)}</p>`).join("");

  updateModalSaveButton(item.id);
  dlg.showModal();
}

function updateModalSaveButton(id) {
  const btn = $("#modalSaveBtn");
  if (!btn) return;
  btn.textContent = state.bookmarks.has(id) ? "Запазено" : "Запази";
}

function openBookmarksModal() {
  const dlg = $("#bookmarksModal");
  if (!dlg || !("showModal" in dlg)) return;
  renderBookmarksModalBody();
  dlg.showModal();
}

function renderBookmarksModalBody() {
  const host = $("#bookmarksList");
  const meta = $("#bookmarksMeta");
  if (!host) return;

  const items = DATA.news.filter((n) => state.bookmarks.has(n.id));
  if (meta) meta.textContent = items.length ? `${items.length} запазени` : "няма запазени";

  if (!items.length) {
    host.innerHTML = `<p class="muted">Още нямаш любими. Натисни “Запази” на статия.</p>`;
    return;
  }

  host.innerHTML = items
    .sort((a, b) => new Date(b.timeISO).getTime() - new Date(a.timeISO).getTime())
    .map(
      (n) => `
      <div class="card" style="grid-column: span 12; margin-bottom: 12px;" data-id="${escapeHtml(n.id)}">
        <div class="card__top">
          <div class="card__meta">
            <span class="badge">${escapeHtml(n.sportLabel)}</span>
            <span class="muted">${escapeHtml(formatRelativeTime(n.timeISO))}</span>
          </div>
          <span class="muted">${formatReads(n.reads)}</span>
        </div>
        <h3 class="card__title">${escapeHtml(n.title)}</h3>
        <p class="card__lead">${escapeHtml(n.lead)}</p>
        <div class="card__bottom">
          <div class="mini"><span>•</span><span>${escapeHtml(n.sportLabel)}</span></div>
          <div class="card__actions">
            <button class="smallBtn js-open" type="button">Прочети</button>
            <button class="smallBtn js-remove" type="button">Премахни</button>
          </div>
        </div>
      </div>
    `
    )
    .join("");

  // wire
  $$(".js-open", host).forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest("[data-id]");
      const id = card?.getAttribute("data-id");
      const item = DATA.news.find((n) => n.id === id);
      if (item) openArticleModal(item);
    });
  });
  $$(".js-remove", host).forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest("[data-id]");
      const id = card?.getAttribute("data-id");
      if (!id) return;
      toggleBookmark(id);
      updateBookmarksUi();
      renderBookmarksModalBody();
      renderNews();
      renderFeatureCard();
    });
  });
}

function toggleBookmark(id) {
  if (state.bookmarks.has(id)) state.bookmarks.delete(id);
  else state.bookmarks.add(id);
  persistBookmarks();
}

function updateBookmarksUi() {
  $("#bookmarksCount").textContent = String(state.bookmarks.size);
  $("#kpiBookmarks").textContent = String(state.bookmarks.size);
}

function loadBookmarks() {
  try {
    const raw = localStorage.getItem(STORAGE_BOOKMARKS);
    if (!raw) return;
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) state.bookmarks = new Set(arr.filter((x) => typeof x === "string"));
  } catch {
    // ignore
  }
}

function persistBookmarks() {
  localStorage.setItem(STORAGE_BOOKMARKS, JSON.stringify([...state.bookmarks]));
}

function isoMinutesAgo(mins) {
  const d = new Date(Date.now() - mins * 60_000);
  return d.toISOString();
}

function formatRelativeTime(iso) {
  if (!iso) return "—";
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.max(0, Math.round(ms / 60_000));
  if (m < 1) return "току-що";
  if (m < 60) return `${m} мин`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} ч`;
  const d = Math.round(h / 24);
  return `${d} д`;
}

function formatReads(n) {
  if (n >= 1000) return `${Math.round(n / 100) / 10}k`;
  return String(n);
}

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

