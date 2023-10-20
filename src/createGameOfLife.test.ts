/* eslint-disable no-param-reassign */
import { createGameOfLife } from "./createGameOfLife";
import { drawField } from "./drawField";

jest.mock("./drawField");
const mockedDrawField = drawField as jest.MockedFunction<typeof drawField>;

const sleep = (x: number) => new Promise((resolve) => setTimeout(resolve, x));

describe("Resizing functionality in createGameOfLife", () => {
  let htmlElement: HTMLElement;

  beforeEach(() => {
    htmlElement = document.createElement("div");
    createGameOfLife(5, 5, htmlElement);

    mockedDrawField.mockImplementation((fieldEl, field) => {
      console.log("drawField called with", field);
      fieldEl.innerHTML = `drawField(${JSON.stringify(field)})`;
    });
  });

  it("renders game speed input", () => {
    expect(htmlElement.querySelector(".gameSpeed")).not.toBeNull();
  });

  it("renders size inputs and resize button", () => {
    expect(htmlElement.querySelector(".sizeX")).not.toBeNull();
    expect(htmlElement.querySelector(".sizeY")).not.toBeNull();
    expect(htmlElement.querySelector(".resizeButton")).not.toBeNull();
  });

  it("increases the field size correctly", () => {
    const sizeXInput = htmlElement.querySelector(".sizeX") as HTMLInputElement;
    const sizeYInput = htmlElement.querySelector(".sizeY") as HTMLInputElement;
    const resizeButton = htmlElement.querySelector(
      ".resizeButton"
    ) as HTMLButtonElement;

    sizeXInput.value = "7";
    sizeYInput.value = "6";
    resizeButton.click();

    const mockCalls = mockedDrawField.mock.calls;
    const lastFieldDrawn = mockCalls[mockCalls.length - 1][1];
    expect(lastFieldDrawn).toHaveLength(6); // Rows
    expect(lastFieldDrawn[0]).toHaveLength(7); // Columns
  });

  it("decreases the field size correctly", () => {
    const sizeXInput = htmlElement.querySelector(".sizeX") as HTMLInputElement;
    const sizeYInput = htmlElement.querySelector(".sizeY") as HTMLInputElement;
    const resizeButton = htmlElement.querySelector(
      ".resizeButton"
    ) as HTMLButtonElement;

    sizeXInput.value = "3";
    sizeYInput.value = "3";
    resizeButton.click();

    const mockCalls = mockedDrawField.mock.calls;
    const lastFieldDrawn = mockCalls[mockCalls.length - 1][1];
    expect(lastFieldDrawn).toHaveLength(3); // Rows
    expect(lastFieldDrawn[0]).toHaveLength(3); // Columns
  });
});

describe("createGameOfLife", () => {
  let element: HTMLElement;
  const originalAlert = window.alert;
  beforeEach(() => {
    element = document.createElement("div");
    window.alert = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
    window.alert = originalAlert;
  });
  describe("UI", () => {
    it("creates Start button and field", () => {
      createGameOfLife(10, 10, element);
      expect(element.querySelector(".startbutton")).toBeTruthy();
      expect(element.querySelector(".startbutton")!.innerHTML).toBe("Start");
      expect(element.querySelector(".field-wrapper")).toBeTruthy();
    });
    it("changes button name on click", () => {
      createGameOfLife(10, 10, element);
      const startbutton = element.querySelector(
        ".startbutton"
      ) as HTMLButtonElement;
      expect(startbutton.innerHTML).toBe("Start");
      startbutton.click();
      expect(startbutton.innerHTML).toBe("Stop");
      startbutton.click();
      expect(startbutton.innerHTML).toBe("Start");
      startbutton.click();
      expect(startbutton.innerHTML).toBe("Stop");
    });
    it("draws field", () => {
      mockedDrawField.mockImplementation((fieldEl, field) => {
        fieldEl.innerHTML = `drawField(${JSON.stringify(field)})`;
      });
      createGameOfLife(2, 2, element);
      expect(element.querySelector(".field-wrapper")!.innerHTML).toBe(
        `drawField(${JSON.stringify([
          [0, 0],
          [0, 0],
        ])})`
      );
    });
    it("redraw field on interaction with it", () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let onCellClick = (x: number, y: number) => {};
      mockedDrawField.mockImplementation((fieldEl, field, cellClickHandler) => {
        onCellClick = cellClickHandler;
        fieldEl.innerHTML = `drawField(${JSON.stringify(field)})`;
      });
      createGameOfLife(2, 2, element);
      expect(element.querySelector(".field-wrapper")!.innerHTML).toBe(
        `drawField(${JSON.stringify([
          [0, 0],
          [0, 0],
        ])})`
      );
      onCellClick(0, 0);
      expect(element.querySelector(".field-wrapper")!.innerHTML).toBe(
        `drawField(${JSON.stringify([
          [1, 0],
          [0, 0],
        ])})`
      );
      onCellClick(0, 0);
      expect(element.querySelector(".field-wrapper")!.innerHTML).toBe(
        `drawField(${JSON.stringify([
          [0, 0],
          [0, 0],
        ])})`
      );
      onCellClick(0, 1);
      onCellClick(1, 1);
      expect(element.querySelector(".field-wrapper")!.innerHTML).toBe(
        `drawField(${JSON.stringify([
          [0, 0],
          [1, 1],
        ])})`
      );
    });
    it("on start it runs 1sec timer to update state", async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let onCellClick = (x: number, y: number) => {};
      mockedDrawField.mockImplementation((fieldEl, field, cellClickHandler) => {
        onCellClick = cellClickHandler;
        fieldEl.innerHTML = `drawField(${JSON.stringify(field)})`;
      });
      createGameOfLife(2, 2, element);
      onCellClick(0, 0);
      const startbutton = element.querySelector(
        ".startbutton"
      ) as HTMLButtonElement;
      startbutton.click();
      expect(element.querySelector(".field-wrapper")!.innerHTML).toBe(
        `drawField(${JSON.stringify([
          [1, 0],
          [0, 0],
        ])})`
      );
      await sleep(1000);
      expect(element.querySelector(".field-wrapper")!.innerHTML).toBe(
        `drawField(${JSON.stringify([
          [0, 0],
          [0, 0],
        ])})`
      );
    });
    it("stops game with alert, when none alive", async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let onCellClick = (x: number, y: number) => {};
      mockedDrawField.mockImplementation((fieldEl, field, cellClickHandler) => {
        onCellClick = cellClickHandler;
        fieldEl.innerHTML = `drawField(${JSON.stringify(field)})`;
      });
      createGameOfLife(2, 2, element);
      onCellClick(0, 0);
      const startbutton = element.querySelector(
        ".startbutton"
      ) as HTMLButtonElement;
      startbutton.click();
      await sleep(1000);
      expect(window.alert).toHaveBeenCalledWith("Death on the block");
      expect(startbutton.innerHTML).toBe("Start");
    });
  });
});

describe("Game speed control in createGameOfLife", () => {
  let htmlElement: HTMLElement;
  const originalAlert = window.alert;
  beforeEach(() => {
    htmlElement = document.createElement("div");
    window.alert = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
    window.alert = originalAlert;
  });

  it("changes game speed correctly", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let onCellClick = (x: number, y: number) => {};
    // Переопределение мок-функции drawField для получения функции onCellClick
    mockedDrawField.mockImplementation((fieldEl, field, cellClickHandler) => {
      onCellClick = cellClickHandler;
      fieldEl.innerHTML = `drawField(${JSON.stringify(field)})`;
    });

    createGameOfLife(2, 2, htmlElement);
    onCellClick(0, 0); // активация клетки перед началом игры

    const gameSpeedInput = htmlElement.querySelector(
      ".gameSpeed"
    ) as HTMLInputElement;
    const startbutton = htmlElement.querySelector(
      ".startbutton"
    ) as HTMLButtonElement;
    // Меняем скорость игры на 2000ms
    gameSpeedInput.value = "2000";
    const event = new Event("input", {
      bubbles: true,
      cancelable: true,
    });
    gameSpeedInput.dispatchEvent(event);
    startbutton.click();
    await sleep(1500);

    // Убедитесь, что в течение 1500ms состояние поля не изменилось
    expect(htmlElement.querySelector(".field-wrapper")!.innerHTML).toBe(
      `drawField(${JSON.stringify([
        [1, 0],
        [0, 0],
      ])})`
    );

    await sleep(1000);

    // После 2500ms (1500ms + 1000ms) состояние поля должно измениться
    expect(htmlElement.querySelector(".field-wrapper")!.innerHTML).toBe(
      `drawField(${JSON.stringify([
        [0, 0],
        [0, 0],
      ])})`
    );
  });
});

describe("createGameOfLife - Game Speed Change During Play", () => {
  let htmlElement: HTMLElement;
  let originalSetInterval: typeof setInterval;

  beforeEach(() => {
    originalSetInterval = global.setInterval;
    htmlElement = document.createElement("div");
    createGameOfLife(5, 5, htmlElement);
  });

  afterEach(() => {
    global.setInterval = originalSetInterval;
  });

  it("updates the game speed while the game is running", () => {
    const gameSpeedInput = htmlElement.querySelector(
      ".gameSpeed"
    ) as HTMLInputElement;
    const startbutton = htmlElement.querySelector(
      ".startbutton"
    ) as HTMLButtonElement;

    const mockSetInterval = jest.fn(originalSetInterval);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global.setInterval as any) = mockSetInterval;

    startbutton.click();

    gameSpeedInput.value = "1500";
    const event = new Event("input", {
      bubbles: true,
      cancelable: true,
    });
    gameSpeedInput.dispatchEvent(event);

    expect(mockSetInterval).toHaveBeenCalledTimes(2);
  });
});
