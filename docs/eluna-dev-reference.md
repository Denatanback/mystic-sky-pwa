# Eluna — Dev Reference

> Рабочий референс для разработки. Очищен от дизайн-комментариев и бизнес-обоснований.

---

## 1. Продукт

**Eluna** — PWA-приложение (эзотерика / астрология). Основная метафора: личное звездное небо пользователя. Разделы = созвездия, прогресс = прохождение узлов снизу вверх.

---

## 2. Платформа

- Web-first, PWA, mobile-first
- Адаптация под desktop
- Установка на главный экран (без App Store / Google Play на MVP)

**Требования:**
- Быстрая загрузка первого экрана
- Плавные анимации (Framer Motion)
- Touch-навигация
- Адаптивность
- Авторизация / регистрация
- Сохранение прогресса
- Paywall + подписка

---

## 3. Стек

### Frontend
- Next.js + React + TypeScript
- Tailwind CSS
- Framer Motion
- Zustand (стейт)
- SVG / Canvas / CSS-анимации для звездного неба
- PWA support

### Backend
- **Supabase** — auth, PostgreSQL, storage, RLS
  - Auth: magic link + опционально OAuth
  - Realtime при необходимости

### Астро-расчеты
- **MVP:** заглушки / моки через `AstrologyService` интерфейс
- **После MVP:** подключение библиотеки (Swiss Ephemeris / Astrologer.js) без изменения остального кода

```ts
// Интерфейс, который остается неизменным
interface AstrologyService {
  getSunSign(birthDate: string): string
  getMoonSign(birthDate: string, birthTime: string, birthPlace: string): string
  getAscendant(birthDate: string, birthTime: string, birthPlace: string): string
}
```

---

## 4. Визуальный стиль

- Темное звездное небо, мягкие градиенты
- Светящиеся созвездия, тонкие линии между звездами
- Mobile-first композиция

### Анимации

**Звездное небо:**
- Медленное мерцание звезд (разные размеры)
- Легкое движение фонового слоя
- Subtle parallax при наклоне телефона

**Созвездия:**
- Soft glow, активная подсветка
- Линии между узлами
- Zoom-in при выборе созвездия

**Узлы** — 5 состояний: `inactive`, `active`, `completed`, `locked`, `premium`
- Hover/tap glow
- Pulse для активного узла
- Fade-in для новых узлов
- Unlock animation

---

## 5. Экраны

### 5.1 Onboarding
Сбор данных → первый персональный результат → возможный paywall.

**Собираемые данные:**
- Имя, дата рождения, время рождения, место рождения, язык

**Флаги:** `onboarding_completed`, `subscriptionStatus`

---

### 5.2 Главная
- Центральный персонаж / аватар пользователя
- Входы в созвездия вокруг него
- Краткий персональный статус
- Быстрый вход в "Сегодняшний путь"
- Нижнее меню

---

### 5.3 Небо
- Карта всех созвездий
- Прогресс по каждому
- Zoom-in при выборе → переход в Глубокий путь

---

### 5.4 Глубокий путь
Экран конкретного созвездия. Визуально: прогрессия узлов снизу вверх, 1–2 ветки.

- Отображение узлов и связей
- Состояния: locked / available / active / completed / premium_locked
- Сохранение последней позиции пользователя
- Возврат к Небу

---

### 5.5 Экран узла
Self-discovery flow: вопросы → выборы → рефлексия → итоговая трактовка.

- Последовательность вопросов
- Типы ответов: одиночный выбор, множественный, текстовый ввод
- Прогресс внутри узла
- Сохранение ответов
- По завершении: открытие следующего узла + запись в журнал

---

### 5.6 Сегодняшний путь
Ежедневный экран. Обновляется раз в сутки.

- Послание дня + персональная интерпретация
- Один вопрос + небольшое действие
- Возможная карта дня
- Отметки "прочитано" / "откликнулось / не откликнулось"
- Сохранение в журнал

---

### 5.7 Журнал
Личный дневник инсайтов.

- Список: ответы пользователя, пройденные узлы, сохраненные карты, заметки
- Добавление личной заметки
- Удаление записи
- Фильтрация по категории (разделу)

---

### 5.8 МАК / Карты
- Карта дня, случайная карта, расклад 1–3 карт
- Вопрос перед вытягиванием
- Краткая интерпретация
- Сохранение в журнал

---

### 5.9 Профиль
- Редактирование: имя, дата / время / место рождения, язык
- Статус подписки, управление подпиской
- Прогресс, настройки уведомлений
- Выход, удаление аккаунта, сброс прогресса

---

### Нижнее меню
1. Главная
2. Небо
3. Сегодня
4. Карты
5. Журнал

Профиль — в верхнем углу или отдельной иконкой.

---

## 6. Разделы-созвездия

| # | Раздел | Ключевой функционал |
|---|--------|---------------------|
| 1 | Astrology | Солнечный знак, лунный знак, асцендент, трактовки, daily astrology |
| 2 | Numerology | Число жизненного пути, личные циклы, матрица судьбы |
| 3 | Human Design | Тип, стратегия, авторитет, профиль, центры |
| 4 | Past Life | Онбординг-квиз → архетип → паттерн → эмоциональная трактовка |
| 5 | Spiritual Practices | Короткие практики 1–3 мин: дыхание, визуализация, body-awareness |
| 6 | Soulmate | Квиз → архетип партнера → совместимость → emotional pattern |

> **Практики**: формулировать как body-awareness / attention practice / visualization / grounding. Никаких медицинских или гарантированных мистических эффектов.

---

## 7. Прогрессия узлов

**Состояния узла:** `locked` → `available` → `active` → `completed` / `premium_locked`

**Узел открывается после:**
- Прохождения предыдущего узла
- Завершения daily-action
- Оплаты (если premium-узел)
- Достижения нужного уровня прогресса

---

## 8. Paywall

**Логика:** сначала ценность → потом paywall.

**Точки показа:**
- После onboarding-результата
- После teaser в Past Life / Soulmate
- Перед полным раскрытием результата
- Перед premium-узлами / расширенной трактовкой / дополнительными раскладами карт

**Бесплатно:**
- Базовый onboarding
- Часть неба
- Первый daily insight
- Ограниченное количество узлов
- Базовый журнал
- Одна карта / базовый draw

**Premium:**
- Полные трактовки
- Расширенные пути и premium-узлы
- Больше daily-контента
- Soulmate / Past Life полный результат
- Дополнительные карты
- Расширенный журнал + история
- Персональные рекомендации

---

## 9. Данные

### User
```ts
User {
  id: string
  email: string
  name?: string
  birthDate?: string
  birthTime?: string
  birthPlace?: string
  language: string
  subscriptionStatus: "free" | "trial" | "premium" | "expired"
  onboardingCompleted: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Section
```ts
Section {
  id: string
  slug: string
  title: string
  subtitle: string
  color: string
  icon: string
  order: number
  enabled: boolean
}
```

### Node
```ts
Node {
  id: string
  sectionId: string
  title: string
  subtitle?: string
  x: number
  y: number
  parentNodeIds: string[]
  status?: "locked" | "available" | "active" | "completed" | "premium_locked"
  premium: boolean
  contentId: string
}
```

### Answer
```ts
Answer {
  id: string
  userId: string
  nodeId: string
  questionId: string
  value: string | string[]
  createdAt: Date
}
```

### JournalEntry
```ts
JournalEntry {
  id: string
  userId: string
  type: "node_result" | "daily" | "card" | "note"
  sectionId?: string
  nodeId?: string
  title: string
  body: string
  userNote?: string
  createdAt: Date
}
```

### DailyInsight
```ts
DailyInsight {
  id: string
  userId: string
  date: string
  title: string
  body: string
  sectionId?: string
  cardId?: string
  completed: boolean
}
```

### ContentItem
```ts
ContentItem {
  id: string
  type: "question" | "result" | "daily" | "card" | "practice" | "paywall_teaser"
  sectionId?: string
  nodeId?: string
  title: string
  body: string
  options?: ContentOption[]
  tags?: string[]
  premium: boolean
}
```

---

## 10. База данных (Supabase / PostgreSQL)

Таблицы:
- `users`
- `profiles`
- `sections`
- `nodes`
- `node_progress`
- `answers`
- `journal_entries`
- `cards`
- `daily_insights`
- `subscriptions`
- `paywall_events`

---

## 11. Контент

**Структура закладывается сейчас, наполнение — постепенно.**

Везде нужны placeholder-заглушки с реалистичным текстом (не "Lorem ipsum").

Типы контента:
- `onboarding_questions`
- `node_questions` + `node_results`
- `daily_insights`
- `card_interpretations`
- `paywall_teasers`
- `practice_instructions`
- `journal_prompts`

**Требования к тексту:** мистический, образный, без AI-тона, без медицинских обещаний, без жестких утверждений о будущем.

---

## 12. MVP Scope

### Обязательно
PWA, onboarding, главная, небо, глубокий путь, экран узла, сегодняшний путь, журнал, МАК, профиль, базовый paywall, сохранение прогресса, 6 созвездий.

### Можно упростить
- Реальные астро-расчеты (заглушки)
- Глубокую генерацию контента
- Полноценные premium-механики
- Сложные расклады карт
- Desktop-оптимизацию

### Не добавлять в MVP
Соцсеть, чаты, AI-компаньон, сложные 3D-сцены, маркетплейс.

---

## 13. Порядок разработки

**Этап 1 — Core UI**
Layout, звездное небо, нижнее меню, главная, экран неба, глубокий путь, базовые узлы.

**Этап 2 — User Flow**
Onboarding, профиль, ответы на вопросы, прогресс узлов, журнал.

**Этап 3 — Content**
Контент разделов, daily insight, карты, практики, soulmate, past life.

**Этап 4 — Monetization**
Paywall, trial, subscription status, premium locks, purchase events.

**Этап 5 — Alpha / MVP Test**
Аналитика: onboarding completion, section clicks, paywall conversion, retention по daily.
