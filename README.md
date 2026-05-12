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

На данный момент проект не использует внешние API и не требует `.env` файлов.

Если в будущем потребуется — создайте `.env.local` на основе `.env.example`.

---

## Демо-авторизация

Проект использует mock-авторизацию через `localStorage`. Реального бэкенда нет.
При регистрации/входе данные сохраняются только в браузере.

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
