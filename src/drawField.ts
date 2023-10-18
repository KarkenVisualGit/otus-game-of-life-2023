/**
 * отрисовка поля
 * @param field {number[][]} - состояние поля
 * @param htmlElement {HTMLElement} - элемент, в котором будет отрисовано поле
 * @param onCellClick {(x: number, y: number) => void}
 * @returns void
 */

export function drawField(htmlElement: Element, field, onCellClick: Function) {
  const rowIterator = (row: [], rowIndex: number) =>
    `<tr>${row
      .map((cell: number, columnIndex: number) => {
        if (cell === 1) {
          return `<td 
          data-x=${columnIndex}
          data-y=${rowIndex}
          class="cell-alive"></td>`;
        }
        return `<td 
        data-x=${columnIndex}
        data-y=${rowIndex}
        class="cell-dead"></td>`;
      })
      .join("")}</tr>`;

  const table = `<table border=1>${field.map(rowIterator).join("")}</table>`;

  // eslint-disable-next-line no-param-reassign
  htmlElement.innerHTML = table;

  htmlElement.querySelector("table")!.addEventListener("click", (ev) => {
    const clickedElement = ev.target;

    const x = clickedElement.getAttribute("data-x");

    const y = clickedElement.getAttribute("data-y");
    if (x >= 0 && y >= 0) {
      onCellClick(Number(x), Number(y));
    }
  });
}
