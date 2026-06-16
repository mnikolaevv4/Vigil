/* ============================================================
   Vigil — споделена логика
   - рендерира sidebar + topbar на всяка страница
   - помощни функции за таблици/списъци
   - работи при file:// (без fetch/ES modules)
   ============================================================ */

(function () {
  "use strict";

  var D = window.VIGIL_DATA || {};

  /* --- дефиниция на навигацията (единствен източник на истина) --- */
  var NAV = [
    { group: "Надзор" },
    { id: "index",     file: "index.html",                  ic: "▣", label: "Command Center" },
    { id: "cases",     file: "cases.html",                  ic: "◷", label: "Срокове & cases",  badge: { txt: "3", red: true } },
    { id: "signals",   file: "signals.html",                ic: "∿", label: "Signal review",    badge: { txt: "2" } },
    { id: "psur",      file: "psur.html",                   ic: "▥", label: "Периодични доклади", badge: { txt: "1" } },
    { group: "Документация" },
    { id: "psmf",      file: "psmf.html",                   ic: "▤", label: "PSMF" },
    { id: "sops",      file: "sops.html",                   ic: "≣", label: "SOP & обучения",   badge: { txt: "5" } },
    { id: "vendors",   file: "vendors.html",                ic: "⇄", label: "Vendor oversight" },
    { group: "Готовност" },
    { id: "audits",    file: "audits.html",                 ic: "◎", label: "Самоинспекции & CAPA", badge: { txt: "3", red: true } },
    { id: "inspect",   file: "inspection.html",             ic: "✦", label: "Inspection package" },
    { id: "assistant", file: "assistant.html",              ic: "✎", label: "QPPV Assistant" },
    { group: "Анализи" },
    { id: "analytics", file: "analytics.html",              ic: "▨", label: "Анализи" }
  ];

  var TITLES = {
    index:     ["Command Center", (D.org ? D.org.name + " · " + D.org.territory : "")],
    cases:     ["Срокове & cases", "Expedited reporting"],
    signals:   ["Signal review", "Benefit-risk overview"],
    psur:      ["Периодични доклади", "PSUR/PBRER · GVP Module VII"],
    psmf:      ["PSMF", "Pharmacovigilance System Master File"],
    sops:      ["SOP & обучения", "Document control"],
    vendors:   ["Vendor oversight", "Подизпълнители & SDEA"],
    audits:    ["Самоинспекции & CAPA", "GVP Module IV · вътрешен одит"],
    inspect:   ["Inspection package", "Готовност за инспекция"],
    assistant: ["QPPV Assistant", "Питай документите си"],
    analytics: ["Анализи", "KPI тенденции · 12 месеца"]
  };

  /* --- helpers --- */
  function el(html) { var t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; }
  function tag(o) { return o ? '<span class="tag-mini ' + o.cls + '">' + o.txt + "</span>" : ""; }
  function due(o) { return '<span class="due ' + o.cls + '">' + o.txt + "</span>"; }
  function whoCell(init, name) { return '<div class="who-cell"><span class="av">' + init + "</span>" + name + "</div>"; }

  /* --- sidebar --- */
  function renderSidebar(active) {
    var q = D.qppv || {};
    var nav = NAV.map(function (n) {
      if (n.group) return '<div class="group">' + n.group + "</div>";
      var badge = n.badge ? '<span class="badge' + (n.badge.red ? " red" : "") + '">' + n.badge.txt + "</span>" : "";
      return '<a href="' + n.file + '"' + (n.id === active ? ' class="active"' : "") +
             '><span class="ic">' + n.ic + "</span>" + n.label + badge + "</a>";
    }).join("");

    return '<aside class="side" id="side">' +
      '<div class="brand"><div class="mark"></div><div>' +
        '<div class="name">Vigil</div><div class="tag">QPPV Operating System</div>' +
      "</div></div>" +
      '<nav class="nav">' + nav + "</nav>" +
      '<div class="who"><div class="av">' + (q.initials || "") + "</div>" +
        '<div class="meta"><b>' + (q.name || "") + "</b><span>" +
        (q.role || "") + " · " + (D.org ? D.org.name : "") + "</span></div></div>" +
      "</aside>";
  }

  /* --- topbar --- */
  function renderTopbar(active) {
    var t = TITLES[active] || ["", ""];
    return '<header class="topbar">' +
      '<button class="menu-toggle" aria-label="Меню" onclick="document.getElementById(\'side\').classList.toggle(\'open\')">☰</button>' +
      "<h1>" + t[0] + '</h1><span class="crumb">' + t[1] + "</span>" +
      '<div class="spacer"></div>' +
      '<div class="search"><span>⌕</span><input placeholder="Търси SOP, продукт, vendor, случай…" aria-label="Търсене"></div>' +
      '<div class="pill-clock" id="clock">—</div>' +
      "</header>";
  }

  function wireSearch() {
    var inp = document.querySelector(".search input");
    if (!inp) return;
    inp.addEventListener("keydown", function (e) {
      if (e.key !== "Enter") return;
      var q = inp.value.trim();
      if (!q) return;
      if (window.UI) window.UI.toast('Търсене: "' + q + '"', "Демо · намерени 3 съвпадения в SOP, cases и PSMF", "info");
      inp.blur();
    });
  }

  function startClock() {
    var c = document.getElementById("clock");
    if (!c) return;
    function tick() {
      try {
        var s = new Date().toLocaleTimeString("bg-BG", { timeZone: "Europe/Sofia", hour: "2-digit", minute: "2-digit" });
        c.textContent = "Sofia · " + s;
      } catch (e) { c.textContent = new Date().toLocaleTimeString(); }
    }
    tick(); setInterval(tick, 30000);
  }

  /* ============================================================
     Публичен API: Vigil.mount(pageId) сглобява черупката,
     после връща контейнера за съдържание, който страницата пълни.
     ============================================================ */
  window.Vigil = {
    helpers: { tag: tag, due: due, whoCell: whoCell, el: el },
    data: D,

    mount: function (pageId) {
      var app = document.createElement("div");
      app.className = "app";
      app.innerHTML = renderSidebar(pageId) +
        '<div class="main">' + renderTopbar(pageId) +
        '<div class="content" id="content"></div></div>';
      document.body.appendChild(app);
      startClock();
      wireSearch();
      return document.getElementById("content");
    }
  };
})();
