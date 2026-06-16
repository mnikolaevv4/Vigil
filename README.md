# Vigil — QPPV Operating System (демо)

Статичен, напълно интерактивен прототип на „operating system for the QPPV". Без build стъпка, без зависимости, без мрежови заявки — чист HTML/CSS/JS.

## Отваряне

**Вариант 1 — директно**
Кликни два пъти върху `index.html`. Навигацията и всички бутони работят.

**Вариант 2 — Live Server във VS Code (препоръчително)**
1. Инсталирай разширението **Live Server** (Ritwick Dey).
2. Десен бутон върху `index.html` → **Open with Live Server**.
3. `http://127.0.0.1:5500/` с авто-презареждане.

## Кои бутони какво правят (всичко е демо, in-memory)

| Страница | Действия |
|---|---|
| **Command Center** | KPI плочките водят към модулите · кликни pulse линия за статус · кликни ред „Изискват внимание" за детайл |
| **Срокове & cases** | „+ Нов case" отваря форма и добавя ред в таблицата · чипове филтрират (Просрочени / Под 7 дни / Serious) · кликни ред → drawer с „Маркирай подаден" и „Виж evidence" |
| **Signal review** | „Започни signal разследване" пуска прогрес и отваря досие · кликни сигнал → „Маркирай прегледан" |
| **PSMF** | „Генерирай PDF" симулира pipeline с прогрес · „История на версиите" отваря drawer · date picker + „Възстанови snapshot" реконструира версия по дата · кликни анекс за детайл |
| **SOP & обучения** | „+ Нов SOP" добавя ред · „Подпиши" в training matrix маркира e-signature · кликни SOP → „Маркирай ревю извършено" |
| **Vendor oversight** | „+ Vendor" добавя ред · кликни vendor → „Проведи одит" (обновява датата) и „Затвори CAPA" |
| **Inspection package** | „Generate EMA Inspection Package" — многостъпков прогрес + резултат · кликни артефакт за детайл · Ctrl+P за печат |
| **QPPV Assistant** | работещ чат с локална логика — питай „vendor", „просрочени" или „кой е QPPV" |
| **(всяка страница)** | търсачката в горния бар реагира на Enter |

## Важно за стейта

Стейтът е **in-memory** — живее докато страницата е отворена. Презареждане (F5) връща демо-данните към началото. Това е умишлено: при отваряне с `file://` браузърите блокират `localStorage`, а за демо чистото състояние при всяко отваряне е предимство. Нищо не се изпраща никъде.

## Структура

```
vigil/
├── index.html · cases.html · signals.html · psmf.html
├── sops.html · vendors.html · inspection.html · assistant.html
├── assets/
│   ├── css/app.css          дизайн система + UI компоненти (:root отгоре)
│   ├── js/app.js            навигация + search + рендер-помощници (Vigil.mount)
│   ├── js/ui.js             toast / modal / drawer / прогрес / store (window.UI)
│   └── data/demo-data.js    всички демо данни (window.VIGIL_DATA)
└── README.md
```

Ред на зареждане на всяка страница: `demo-data.js` → `ui.js` → `app.js` → inline скрипт на страницата.

## Чести промени

| Искам да… | Файл |
|---|---|
| сменя цвят/шрифт | `assets/css/app.css` (`:root`) |
| добавя/махна пункт от менюто | `NAV` в `assets/js/app.js` |
| сменя данни | масивите в `assets/data/demo-data.js` |
| добавя toast/modal някъде | `UI.toast(...)`, `UI.modal(...)`, `UI.drawer(...)` |

## Обхват

Демото съответства на **Фаза 1** (PV eQMS + Smart PSMF) — без ICSR safety database и без E2B gateway. Всички данни са измислени.

---

## Деплой (статичен хостинг, безплатно)

Сайтът е чист статичен — никакъв build. Репото вече е инициализирано с git на branch `main`.

### Вариант A — GitHub Pages (с авто-деплой)

```bash
# 1. Създай празно репо в github.com (без README/gitignore — вече имаме)
# 2. Свържи и push-ни:
git remote add origin https://github.com/<твоят-юзър>/vigil.git
git push -u origin main
```

После в GitHub: **Settings → Pages → Source: GitHub Actions**. Готовият workflow
(`.github/workflows/deploy.yml`) ще се изпълни автоматично и сайтът ще е на
`https://<твоят-юзър>.github.io/vigil/`. Всеки следващ `git push` го обновява.

> Алтернатива без Actions: Settings → Pages → Source: *Deploy from a branch* → `main` / root.
> `.nojekyll` гарантира, че файловете се сервират as-is.

### Вариант B — Netlify

Drag-and-drop на папката в app.netlify.com, или свържи репото — `netlify.toml`
вече казва на Netlify да публикува root директорията без build стъпка.

### Локално

Виж секцията „Отваряне" по-горе — двоен клик на `index.html` или Live Server.
