/* eslint-disable no-param-reassign */

import { drawField } from "./drawField";
import { getNextState } from "./getNextState";
import { isAnyoneAlive } from "./isAnyoneAlive";

/**
 * Создание игры Жизнь
 * @param sizeX {number} - число колонок
 * @param sizeY {number} - число строк
 * @param htmlElement {HTMLElement} - элемент, в котором будет отрисована игра
 * @returns void
 */
export function createGameOfLife(
  sizeX: number,
  sizeY: number,
  htmlElement: HTMLElement
): void {
  let gameIsRunning = false;
  let timer: ReturnType<typeof setInterval>;

  // Создать блок для поля
  // Создать кнопку управления игрой
  htmlElement.innerHTML =
    "<div class=\"field-wrapper\"></div><div class=\"field\"><button>Start</button></div>";
  const fieldWrapper = htmlElement.querySelector(
    ".field-wrapper"
  ) as HTMLElement;
  const button = htmlElement.querySelector("button");

  if (!fieldWrapper || !button) {
    throw new Error("Failed to select necessary DOM elements.");
  }
  // Создать поле заданного размера
  let field: number[][] = Array.from({ length: sizeY }).map(() =>
    Array.from({ length: sizeX }).map(() => 0)
  );

  const cellClickHandler = (x: number, y: number): void => {
    field[y][x] = field[y][x] === 0 ? 1 : 0;
    drawField(fieldWrapper, field, cellClickHandler);
  };

  // Отрисовать поле заданного размера
  drawField(fieldWrapper, field, cellClickHandler);
  // При клике по ячейке поля
  // - поменять его состояние
  // - перерисовать поле
  function stopGame(): void {
    gameIsRunning = false;
    button!.innerHTML = "Start";
    // При клике на кнопке `Stop` остановить таймер
    if (timer) {
      clearInterval(timer);
    }
  }
  function startGame(): void {
    // При клике по кнопке старт
    // - поменять надпись на `Stop`
    gameIsRunning = true;
    button!.innerHTML = "Stop";
    // - запустить таймер для обновления поля
    timer = setInterval(() => {
      // В таймере обновления поля
      // - посчитать новое состояние поля
      // - отрисовать новое состояние поля
      // - проверить, что есть живые клетки
      // - если живых клеток нет
      //    - остановить таймер
      //    - вывести сообщение
      field = getNextState(field);
      if (fieldWrapper) {
        drawField(fieldWrapper, field, cellClickHandler);
      }
      if (!isAnyoneAlive(field)) {
        alert("Death on the block");
        stopGame();
      }
    }, 1000);
  }

  button!.addEventListener("click", () => {
    if (!gameIsRunning) {
      startGame();
    } else {
      stopGame();
    }
  });
}
