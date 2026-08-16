# Игра с гоблинами 🧌

[![Build and Deploy to GitHub Pages](https://github.com/Alexandr-VA/events_goblins_game/actions/workflows/deploy.yml/badge.svg)](https://github.com/Alexandr-VA/events_goblins_game/actions/workflows/deploy.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-brightgreen)](https://Alexandr-VA.github.io/events_goblins_game/)

## Описание

"Игра с гоблинами". Гоблин появляется на поле с ячейками 4х4. Нужно успеть прихлопнуть гоблина молотком пока он не спрятался. Если не успеть или промахнуться 5 раз - ты проиграл!

## Демо

[Ссылка на игру](https://Alexandr-VA.github.io/events_goblins_game/)

## Правила игры

- 🎯 Гоблин появляется в случайной клетке на 1 секунду
- 🔨 Нужно кликнуть по гоблину, чтобы получить +1 балл
- ❌ Если пропустить 5 появлений гоблинов - игра заканчивается
- ❌ Если кликнуть мимо гоблина - засчитывается промах
- 🎮 Курсор в виде молотка

## Установка и запуск

```bash
# Установка зависимостей
yarn install

# Запуск в режиме разработки
yarn start

# Сборка проекта
yarn build

# Запуск тестов
yarn test

# Проверка покрытия тестами
yarn coverage
