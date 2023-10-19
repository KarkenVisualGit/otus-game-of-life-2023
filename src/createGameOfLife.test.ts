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
  });

  it("renders size inputs and resize button", () => {
    expect(htmlElement.querySelector(".sizeX")).not.toBeNull();
    expect(htmlElement.querySelector(".sizeY")).not.toBeNull();
    expect(htmlElement.querySelector(".resizeButton")).not.toBeNull();
  });

  it("increases the field size correctly", () => {
    const sizeXInput = htmlElement.querySelector(".sizeX") as HTMLInputElement;
    const sizeYInput = htmlElement.querySelector(".sizeY") as HTMLInputElement;
    const resizeButton = htmlElement.querySelector(".resizeButton") as HTMLButtonElement;

    sizeXInput.value = "7";
    sizeYInput.value = "6";
    resizeButton.click();

    const mockCalls = mockedDrawField.mock.calls;
    const lastFieldDrawn = mockCalls[mockCalls.length - 1][1];
    expect(lastFieldDrawn.length).toBe(6);  // Rows
    expect(lastFieldDrawn[0].length).toBe(7);  // Columns
  });

  it("decreases the field size correctly", () => {
    const sizeXInput = htmlElement.querySelector(".sizeX") as HTMLInputElement;
    const sizeYInput = htmlElement.querySelector(".sizeY") as HTMLInputElement;
    const resizeButton = htmlElement.querySelector(".resizeButton") as HTMLButtonElement;

    sizeXInput.value = "3";
    sizeYInput.value = "3";
    resizeButton.click();

    const mockCalls = mockedDrawField.mock.calls;
    const lastFieldDrawn = mockCalls[mockCalls.length - 1][1];
    expect(lastFieldDrawn.length).toBe(3);  // Rows
    expect(lastFieldDrawn[0].length).toBe(3);  // Columns
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
      const startbutton = element.querySelector(".startbutton") as HTMLButtonElement;
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
      let onCellClick = (x: number, y: number) => { };
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
      let onCellClick = (x: number, y: number) => { };
      mockedDrawField.mockImplementation((fieldEl, field, cellClickHandler) => {
        onCellClick = cellClickHandler;
        fieldEl.innerHTML = `drawField(${JSON.stringify(field)})`;
      });
      createGameOfLife(2, 2, element);
      onCellClick(0, 0);
      const startbutton = element.querySelector(".startbutton") as HTMLButtonElement;
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
      let onCellClick = (x: number, y: number) => { };
      mockedDrawField.mockImplementation((fieldEl, field, cellClickHandler) => {
        onCellClick = cellClickHandler;
        fieldEl.innerHTML = `drawField(${JSON.stringify(field)})`;
      });
      createGameOfLife(2, 2, element);
      onCellClick(0, 0);
      const startbutton = element.querySelector(".startbutton") as HTMLButtonElement;
      startbutton.click();
      await sleep(1000);
      expect(window.alert).toHaveBeenCalledWith("Death on the block");
      expect(startbutton.innerHTML).toBe("Start");
    });
  });
});
