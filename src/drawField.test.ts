import { drawField } from "./drawField";

describe("drawField", () => {
  let onCellClick: jest.Mock;
  let el: HTMLElement;

  beforeEach(() => {
    onCellClick = jest.fn();
    el = document.createElement("div");
  });

  it("renders dead field 1x1", () => {
    drawField(el, [[0]], onCellClick);
    expect(el.querySelectorAll(".cell-alive, .cell-dead")).toHaveLength(1);
    expect(el.querySelectorAll(".cell-dead")).toHaveLength(1);
  });

  it("renders cell-dying field 1x1", () => {
    drawField(el, [[1]], onCellClick);
    expect(el.querySelectorAll(".cell-dying")).toHaveLength(1);
    expect(el.querySelectorAll(".cell-alive")).toHaveLength(0);
  });

  it("renders field mxn", () => {
    const field = [
      [0, 0, 0],
      [0, 0, 1],
      [1, 1, 0],
    ];
    drawField(el, field, onCellClick);
    expect(el.querySelectorAll(".cell-dying")).toHaveLength(2);
    expect(el.querySelectorAll(".cell-alive")).toHaveLength(1);
    expect(el.querySelectorAll(".cell-dead")).toHaveLength(6);
  });

  describe("onCellClick", () => {
    it("calls onCellClick on cell click", () => {
      const field = [
        [0, 0, 0],
        [0, 0, 1],
        [1, 1, 0],
      ];
      drawField(el, field, onCellClick);
      const cell1 = el.querySelector(
        ".cell-alive[data-x=\"1\"][data-y=\"2\"]"
      ) as HTMLElement;
      cell1.click();
      expect(onCellClick).toHaveBeenCalledWith(1, 2);

      const cell2 = el.querySelector(
        ".cell-dying[data-x=\"2\"][data-y=\"1\"]"
      ) as HTMLElement;
      cell2.click();
      expect(onCellClick).toHaveBeenCalledWith(2, 1);
    });

    it("calls onCellClick only once on multiple drawing", () => {
      const field = [
        [0, 0, 0],
        [0, 0, 1],
        [1, 1, 0],
      ];
      drawField(el, field, onCellClick);
      drawField(el, field, onCellClick);
      const cell1 = el.querySelector(
        ".cell-alive[data-x=\"1\"][data-y=\"2\"]"
      ) as HTMLElement;
      cell1.click();
      expect(onCellClick).toHaveBeenCalledWith(1, 2);
      expect(onCellClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("cell state visualization", () => {
    it("marks cells with < 2 live neighbours as dying", () => {
      drawField(
        el,
        [
          [1, 0],
          [0, 0],
        ],
        onCellClick
      );
      const dyingCell = el.querySelector(".cell-dying");
      expect(dyingCell).not.toBeNull();
    });

    it("marks cells with > 3 live neighbours as dying", () => {
      drawField(
        el,
        [
          [1, 1, 1],
          [1, 1, 0],
          [0, 0, 0],
        ],
        onCellClick
      );
      const dyingCell = el.querySelector(".cell-dying");
      expect(dyingCell).not.toBeNull();
    });

    it("doesn't mark cells with 2 or 3 live neighbours as dying", () => {
      drawField(
        el,
        [
          [1, 1],
          [1, 0],
        ],
        onCellClick
      );
      const dyingCell = el.querySelector(".cell-dying");
      expect(dyingCell).toBeNull();
    });
  });
});
