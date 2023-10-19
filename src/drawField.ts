/**
 * отрисовка поля
 * @param field {number[][]} - состояние поля
 * @param htmlElement {HTMLElement} - элемент, в котором будет отрисовано поле
 * @param onCellClick {(x: number, y: number) => void}
 * @returns void
 */

export function drawField(
  htmlElement: HTMLElement,
  field: number[][],
  onCellClick: (x: number, y: number) => void
): void {
  const rowIterator = (row: number[], rowIndex: number) =>
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

  const table = `<table border=2>${field.map(rowIterator).join("")}</table>`;

  // eslint-disable-next-line no-param-reassign
  htmlElement.innerHTML = table;

  htmlElement.querySelector("table")!.addEventListener("click", (ev) => {
    const clickedElement = ev.target as HTMLElement;

    const x = clickedElement.getAttribute("data-x");

    const y = clickedElement.getAttribute("data-y");
    if (x && y) {
      onCellClick(Number(x), Number(y));
    }
  });
}
