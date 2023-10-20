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
  htmlElement.innerHTML = `
  <div class="label-elements">
  <div class="input-wrapper">
    <label for="gameSpeed">Speed: </label>
    <input class="gameSpeed" type="range" min="100" max="2000" value="1000" step="100"/>
  </div>
  <div class="input-wrapper">
    <label for="sizeX">Size X: </label>
    <input class="sizeX" type="number" value="${sizeX}" min="3"/>
  </div>
  <div class="input-wrapper">
    <label for="sizeY">Size Y: </label>
    <input class="sizeY" type="number" value="${sizeY}" min="3"/>
  </div>
  <button class="resizeButton">Resize</button>
</div>
  <div class="field-wrapper"></div>
  <div class="field"><button class="startbutton">Start</button></div>`;

  const gameSpeedInput = htmlElement.querySelector(
    ".gameSpeed"
  ) as HTMLInputElement;
  const sizeXInput = htmlElement.querySelector(".sizeX") as HTMLInputElement;
  const sizeYInput = htmlElement.querySelector(".sizeY") as HTMLInputElement;
  const resizeButton = htmlElement.querySelector(".resizeButton");
  let gameSpeed = 1000;
  let field: number[][] = Array.from({ length: sizeY }).map(() =>
    Array.from({ length: sizeX }).map(() => 0)
  );
  const fieldWrapper = htmlElement.querySelector(
    ".field-wrapper"
  ) as HTMLElement;
  const button = htmlElement.querySelector(".startbutton");

  const cellClickHandler = (x: number, y: number): void => {
    field[y][x] = field[y][x] === 0 ? 1 : 0;
    drawField(fieldWrapper, field, cellClickHandler);
  };

  resizeButton!.addEventListener("click", () => {
    const newSizeX = parseInt(sizeXInput!.value, 10);
    const newSizeY = parseInt(sizeYInput!.value, 10);

    // Увеличиваем или уменьшаем размер поля
    if (newSizeX > field[0].length) {
      for (let i = 0; i < field.length; i++) {
        field[i].push(...new Array(newSizeX - field[i].length).fill(0));
      }
    } else if (newSizeX < field[0].length) {
      for (let i = 0; i < field.length; i++) {
        field[i] = field[i].slice(0, newSizeX);
      }
    }

    if (newSizeY > field.length) {
      const newRows = Array.from({ length: newSizeY - field.length }).map(() =>
        new Array(newSizeX).fill(0)
      );
      field.push(...newRows);
    } else if (newSizeY < field.length) {
      field = field.slice(0, newSizeY);
    }

    // Перерисовываем поле
    drawField(fieldWrapper, field, cellClickHandler);
  });

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

  function updateGame() {
    field = getNextState(field);
    if (fieldWrapper) {
      drawField(fieldWrapper, field, cellClickHandler);
    }
    if (!isAnyoneAlive(field)) {
      alert("Death on the block");
      stopGame();
    }
  }

  function startGame(): void {
    // При клике по кнопке старт
    // - поменять надпись на `Stop`
    gameIsRunning = true;
    button!.innerHTML = "Stop";
    // - запустить таймер для обновления поля
    timer = setInterval(updateGame, gameSpeed);
    // timer = setInterval(() => {
    //   field = getNextState(field);
    //   if (fieldWrapper) {
    //     drawField(fieldWrapper, field, cellClickHandler);
    //   }
    //   if (!isAnyoneAlive(field)) {
    //     alert("Death on the block");
    //     stopGame();
    //   }
    // }, 1000);
  }

  function handleSpeedChange() {
    gameSpeed = parseInt(gameSpeedInput.value, 10);

    if (gameIsRunning) {
      clearInterval(timer);
      timer = setInterval(updateGame, gameSpeed);
    }
  }

  button!.addEventListener("click", () => {
    if (!gameIsRunning) {
      startGame();
    } else {
      stopGame();
    }
  });

  gameSpeedInput.addEventListener("input", handleSpeedChange);
}
