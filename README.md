# Eluna — Mystic Sky PWA

Персональное астрологическое приложение. Ежедневные прогнозы, карта неба, звёздный путь, МАК-карты, журнал наблюдений.

**Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, PWA

---

## Быстрый старт

### Установка зависимостей

```bash
npm install
```

### Разработка

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

### Продакшн-сборка

```bash
npm run build
npm run start
```

### Проверка типов

```bash
npm run type-check
```

### Линтер

```bash
npm run lint
```

---

## Структура проекта

```
src/
  app/              # Next.js App Router — все страницы
    welcome/        # Стартовый экран
    login/          # Вход
    register/       # Регистрация (4 шага)
    home/           # Главная
    sky/            # Карта неба (созвездие путей)
    today/          # Текущий путь
      star-way/     # Карта звёздного пути
      node/         # Узел с вопросами
    cards/          # МАК-карты
    journal/        # Журнал наблюдений
    profile/        # Профиль пользователя
  components/
    app-shell/      # BottomNav, StarField
  lib/              # mockAuth, routes
  styles/           # design-tokens.css
public/
  assets/           # Изображения, иконки
```

---

## Переменные окружения

Supabase опционален. Без `.env.local` проект продолжает работать через mock-авторизацию в `localStorage`.

Для Supabase создайте `.env.local` на основе `.env.local.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Реальные значения берутся в Supabase Project Settings → API.

Нельзя добавлять `service_role` key во frontend.

---

## Демо-авторизация

Если Supabase env-переменные не заданы, проект использует mock-авторизацию через `localStorage`.
Если env-переменные заданы, вход/регистрация работают через Supabase Auth.

Подробная инструкция:

`SUPABASE_SETUP.md`

---

## Деплой

Проект готов к деплою на [Vercel](https://vercel.com):

```bash
npx vercel
```

Или на любой сервер с Node.js 18+:

```bash
npm install
npm run build
npm run start   # запускает на порту 3000
```
