# Игра Жизнь &middot;

[![codecov](https://codecov.io/gh/KarkenVisualGit/otus-game-of-life-2023/graph/badge.svg?token=BWwgkWTL8k)](https://codecov.io/gh/KarkenVisualGit/otus-game-of-life-2023/tree/otus-game-of-life)

> Данное приложение создано в рамках учебного задания по реализации "Игры Жизнь" на языке Typescript

## Структура проекта

- index.ts - входная точка проекта для главной страницы, здесь мы подключаем стили из файла style.css и создаем две таблицы игрового поля размерами 5 на 5 и 10 на 10

## Описание работы

Реализован автостоп игры, когда все клетки умерли. Реализован механизм изменения размеров поля, в т.ч. на лету. Реализован механизм изменения скорости игры. Реализована подсветка клеток, которые, являясь живыми, должны умереть в следующем поколении (мертвые - белый цвет, живые - зеленый, обреченные на смерть - синий)

- createGameOfLife: Модуль реализует методы создания и изменения размеров игрового поля, возможность по нажатию кнопки resize менять размеры полей, по нажатию кнопки запускать и останавливать игру, добавлена возможность регулировать скорость игры с помощью регулятора range.
- drawField: Данный модуль отрисовывает поле с ячейками и предоставляет возможность помечать живые клетки.
- getCellState: Модуль для получения состояния клетки.
- getNewCellState: Модуль для определения состояния живой и мертвой клетки в зависимости от количества соседей.
- getNextState: Модуль определяет последующее состояние клетки.
- getNumOfAliveNeighbours: Модуль определяет кол-во живых соседей.
- isAnyoneAlive: Модуль определяет есть ли живые клетки.

## Развернуть проект

1.Клонировать репозиторий

```shell

gh repo clone KarkenVisualGit/otus-game-of-life-2023

```

2.Установить зависимости

```shell

npm install

```

3.Запустить локальный сервер

```shell

npm run start
```
