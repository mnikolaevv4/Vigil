/* ============================================================
   Vigil — демонстрационни данни
   Зареждат се като глобален обект (window.VIGIL_DATA), за да
   работят при отваряне с file:// без локален сървър.
   Всички данни са измислени.
   ============================================================ */

window.VIGIL_DATA = {

  org: { name: "Acme Pharma EOOD", territory: "EU/EEA" },

  qppv: { name: "Мария Димитрова", role: "EU QPPV", initials: "МД", deputy: "Н. Тодоров" },

  pulse: {
    score: 94,
    lines: [
      { t: "Reporting срокове", seg: "green", w: 97, v: "97%" },
      { t: "PSMF актуалност",   seg: "green", w: 100, v: "OK" },
      { t: "SOP ревюта",        seg: "amber", w: 82, v: "82%" },
      { t: "Обучения",          seg: "amber", w: 88, v: "88%" },
      { t: "Открити CAPA",      seg: "red",   w: 60, v: "3" }
    ]
  },

  kpis: [
    { lbl: "Просрочени case-ове", num: "3",  color: "var(--red)",   dot: "r", foot: "2 serious · 1 follow-up", tag: { cls: "t-red", txt: "критично" } },
    { lbl: "Срок до 7 дни",      num: "11", color: "var(--amber)", dot: "a", foot: "8 ICSR · 3 periodic",      tag: { cls: "t-amber", txt: "внимание" } },
    { lbl: "Активни продукти",   num: "24", color: "",             dot: "g", foot: "покрити от PSMF" },
    { lbl: "Дни до inspection",  num: "0",  color: "var(--green)", dot: "g", foot: "пакетът е готов сега" }
  ],

  attention: [
    { task: "ICSR #2026-0413 — serious, fatal", type: { cls: "t-red", txt: "15-дневен" },  who: "ИП", whoName: "И. Петров",    due: { cls: "over", txt: "−2 дни" } },
    { task: "ICSR #2026-0418 — serious",        type: { cls: "t-red", txt: "15-дневен" },  who: "ИП", whoName: "И. Петров",    due: { cls: "over", txt: "−1 ден" } },
    { task: "Follow-up #2026-0390",             type: { cls: "t-amber", txt: "follow-up" }, who: "КС", whoName: "К. Стоев",     due: { cls: "over", txt: "днес" } },
    { task: "PSUR — Продукт Cardiq",            type: { cls: "t-blue", txt: "periodic" },   who: "МД", whoName: "М. Димитрова", due: { cls: "soon", txt: "+4 дни" } },
    { task: "SOP-014 — годишно ревю",           type: { cls: "t-amber", txt: "SOP" },       who: "МД", whoName: "М. Димитрова", due: { cls: "soon", txt: "+6 дни" } }
  ],

  activity: [
    { act: true,  tt: "PSMF v14 одобрен и подписан",            td: "днес · 09:42 · М. Димитрова" },
    { act: false, tt: "Vendor одит — Lege CRO приключен",       td: "вчера · CAPA: 1 отворена" },
    { act: false, tt: "8 ICSR подадени към EudraVigilance",     td: "10 юни · всички в срок" },
    { act: false, tt: "SOP-022 публикуван, v3",                 td: "9 юни · 12 за обучение" }
  ],

  cases: [
    { id: "2026-0413", sev: { cls: "t-red",   txt: "фатален" },     rep: "15-дневен ICSR", src: "лекар",     who: "ИП", whoName: "И. Петров",    due: { cls: "over", txt: "−2 дни" },  status: { cls: "t-red",   txt: "просрочен" } },
    { id: "2026-0418", sev: { cls: "t-red",   txt: "serious" },     rep: "15-дневен ICSR", src: "пациент",   who: "ИП", whoName: "И. Петров",    due: { cls: "over", txt: "−1 ден" },  status: { cls: "t-red",   txt: "просрочен" } },
    { id: "2026-0390", sev: { cls: "t-amber", txt: "non-serious" }, rep: "follow-up",      src: "аптека",    who: "КС", whoName: "К. Стоев",     due: { cls: "over", txt: "днес" },    status: { cls: "t-amber", txt: "днес" } },
    { id: "2026-0421", sev: { cls: "t-red",   txt: "serious" },     rep: "15-дневен ICSR", src: "CRO",       who: "КС", whoName: "К. Стоев",     due: { cls: "soon", txt: "+3 дни" },  status: { cls: "t-blue",  txt: "в обработка" } },
    { id: "2026-0422", sev: { cls: "t-amber", txt: "non-serious" }, rep: "90-дневен",      src: "литература",who: "МД", whoName: "М. Димитрова", due: { cls: "ok",   txt: "+58 дни" }, status: { cls: "t-green", txt: "в график" } },
    { id: "2026-0423", sev: { cls: "t-amber", txt: "serious" },     rep: "15-дневен ICSR", src: "партньор",  who: "КС", whoName: "К. Стоев",     due: { cls: "soon", txt: "+5 дни" },  status: { cls: "t-blue",  txt: "в обработка" } },
    { id: "2026-0419", sev: { cls: "t-amber", txt: "non-serious" }, rep: "ICSR",           src: "пациент",   who: "ИП", whoName: "И. Петров",    due: { cls: "ok",   txt: "+12 дни" }, status: { cls: "t-green", txt: "QC ревю" } }
  ],

  signals: [
    { product: "Cardiq",   reaction: "Главоболие", trend: { cls: "over", txt: "↑ 40×" },   status: { cls: "t-amber", txt: "нов" } },
    { product: "Neuventa", reaction: "Безсъние",   trend: { cls: "soon", txt: "↑ 2.1×" },  status: { cls: "t-blue",  txt: "наблюдава се" } },
    { product: "Cardiq",   reaction: "Гадене",     trend: { cls: "ok",   txt: "→ стабилен" }, status: { cls: "t-green", txt: "затворен" } },
    { product: "Respira",  reaction: "Обрив",      trend: { cls: "ok",   txt: "→ стабилен" }, status: { cls: "t-green", txt: "затворен" } }
  ],

  annexes: [
    { code: "A", nm: "QPPV детайли",            sub: "Мария Димитрова · deputy: Н. Тодоров", w: 100, part: false, tag: { cls: "t-green", txt: "актуален" } },
    { code: "B", nm: "Организационна структура", sub: "3 отдела · 14 души",                  w: 100, part: false, tag: { cls: "t-green", txt: "актуален" } },
    { code: "C", nm: "Източници на safety данни", sub: "спонтанни, литература, CRO",          w: 100, part: false, tag: { cls: "t-green", txt: "актуален" } },
    { code: "D", nm: "Електронни системи",       sub: "safety DB, EudraVigilance",           w: 78,  part: true,  tag: { cls: "t-amber", txt: "ревизия" } },
    { code: "E", nm: "Quality система & SOP-и",   sub: "реферира 38 SOP",                     w: 100, part: false, tag: { cls: "t-green", txt: "актуален" } },
    { code: "F", nm: "Подизпълнители",           sub: "4 vendor договора",                   w: 100, part: false, tag: { cls: "t-green", txt: "актуален" } },
    { code: "G", nm: "Compliance мониторинг",     sub: "KPI · audit trail",                   w: 100, part: false, tag: { cls: "t-green", txt: "актуален" } },
    { code: "H", nm: "Документ logbook",         sub: "14 версии",                           w: 100, part: false, tag: { cls: "t-green", txt: "актуален" } },
    { code: "I", nm: "CAPA log",                 sub: "3 отворени",                          w: 64,  part: true,  tag: { cls: "t-amber", txt: "3 отворени" } }
  ],

  psmfVersions: [
    { act: true,  tt: "v14 — добавен vendor Lege CRO", td: "2026-06-11 · подписан" },
    { act: false, tt: "v13 — обновен анекс D",         td: "2026-04-02" },
    { act: false, tt: "v12 — нов продукт Respira",     td: "2025-12-18" },
    { act: false, tt: "v9 — годишно ревю",             td: "2025-03-03" }
  ],

  sops: [
    { code: "SOP-014", title: "Обработка на ICSR",   ver: "v6", due: { cls: "soon", txt: "+6 дни" },   status: { cls: "t-amber", txt: "за ревю" } },
    { code: "SOP-022", title: "Signal management",    ver: "v3", due: { cls: "ok",   txt: "+120 дни" }, status: { cls: "t-green", txt: "активен" } },
    { code: "SOP-007", title: "PSMF поддръжка",       ver: "v9", due: { cls: "ok",   txt: "+88 дни" },  status: { cls: "t-green", txt: "активен" } },
    { code: "SOP-031", title: "Vendor oversight",     ver: "v2", due: { cls: "over", txt: "−4 дни" },   status: { cls: "t-red",   txt: "просрочено ревю" } },
    { code: "SOP-019", title: "RMP & risk мин.",      ver: "v4", due: { cls: "ok",   txt: "+45 дни" },  status: { cls: "t-green", txt: "активен" } }
  ],

  training: [
    { who: "КС", whoName: "К. Стоев",     sop: "SOP-022 v3", due: { cls: "soon", txt: "+2 дни" }, status: { cls: "t-amber", txt: "чака" } },
    { who: "ИП", whoName: "И. Петров",    sop: "SOP-022 v3", due: { cls: "soon", txt: "+2 дни" }, status: { cls: "t-amber", txt: "чака" } },
    { who: "НТ", whoName: "Н. Тодоров",   sop: "SOP-014 v6", due: { cls: "ok",   txt: "+9 дни" }, status: { cls: "t-blue",  txt: "започнато" } },
    { who: "КС", whoName: "К. Стоев",     sop: "SOP-014 v6", due: { cls: "ok",   txt: "+9 дни" }, status: { cls: "t-gray",  txt: "не започнато" } },
    { who: "МД", whoName: "М. Димитрова", sop: "SOP-031 v2", due: { cls: "ok",   txt: "завършено" }, status: { cls: "t-green", txt: "✓ подписано" } }
  ],

  vendors: [
    { who: "LC", name: "Lege CRO",    svc: "Case processing",   sdea: "SDEA-04 ✓", audit: "2026-06-10", capa: { cls: "t-amber", txt: "1 отворена" },  kpi: { cls: "soon", txt: "92%" }, status: { cls: "t-blue",  txt: "активен" } },
    { who: "МС", name: "MedSafe BPO", svc: "Call center intake", sdea: "SDEA-02 ✓", audit: "2026-02-14", capa: { cls: "t-green", txt: "0" },          kpi: { cls: "ok",   txt: "98%" }, status: { cls: "t-green", txt: "активен" } },
    { who: "ЛМ", name: "LitMonitor",  svc: "Литература",         sdea: "SDEA-05 ✓", audit: "2025-11-30", capa: { cls: "t-green", txt: "0" },          kpi: { cls: "ok",   txt: "99%" }, status: { cls: "t-green", txt: "активен" } },
    { who: "PD", name: "PharmaDist",  svc: "Дистрибуция",        sdea: "SDEA-01",   audit: "2025-09-08", capa: { cls: "t-red",   txt: "2 отворени" }, kpi: { cls: "over", txt: "81%" }, status: { cls: "t-amber", txt: "одит дължим" } }
  ],

  inspectionPackage: [
    "PSMF v14 (PDF + анекси A–I)",
    "SOP matrix · 38 процедури",
    "Training matrix + e-signatures",
    "CAPA log · 3 отворени / 41 затворени",
    "Vendor list + SDEA договори",
    "Reporting compliance отчет (12 мес.)",
    "Signal tracking log",
    "Audit trail manifest (хешове)"
  ]
};
