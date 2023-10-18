// Запуск игры
//
// - создать элемент и добавить его на страницу
// - создать на этом элементе игру с помощью `createGameOfLife` с размерами поля x / y
import "./css/style.css";
const { createGameOfLife } = require("./createGameOfLife");

const gameWrapper1 = document.createElement("div");
const gameWrapper2 = document.createElement("div");

document.body.appendChild(gameWrapper1);
document.body.appendChild(gameWrapper2);

createGameOfLife(5, 5, gameWrapper1);
createGameOfLife(10, 10, gameWrapper2);