# Moslistva - Пиломатериалы из лиственницы

## Быстрый старт

### Вариант 1: CDN (уже работает) ⚡
Просто откройте `index.html` в браузере - всё готово!

### Вариант 2: Локальный Tailwind CSS (рекомендуется)

1. **Установите зависимости:**
   ```bash
   npm install
   ```

2. **Соберите CSS файл:**
   ```bash
   npm run build
   ```

3. **Для разработки (автоматическая пересборка):**
   ```bash
   npm run dev
   ```

4. **Используйте `index-local.html`** вместо `index.html` (он использует локальный `style.css`)

## Структура проекта

```
moslistva/
├── index.html          # Версия с CDN (работает сразу)
├── index-local.html    # Версия с локальным CSS
├── style.css           # Скомпилированный Tailwind CSS (после npm run build)
├── src/
│   └── input.css       # Исходный файл с директивами Tailwind
├── tailwind.config.js  # Конфигурация Tailwind
├── package.json        # Зависимости проекта
└── script.js           # JavaScript функциональность
```

## Цвета проекта

- **Primary Green**: `#4CAF50` (навигация, кнопки, иконки)
- **Dark Green**: `#2D5D42` (футер)
- **Light Gray**: `#F5F5F5` (фон контента)

## Команды

- `npm run dev` - Запуск в режиме разработки (watch mode)
- `npm run build` - Сборка для продакшена (минифицированный CSS)
