// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

Object.defineProperty(URL, "createObjectURL", {
  writable: true,
  value: jest.fn(),
});

class Worker {
  onmessage: () => void;
  url: string;
  constructor(stringUrl) {
    this.url = stringUrl;
    this.onmessage = () => {};
  }

  postMessage() {
    this.onmessage();
  }
  terminate() {}
  onmessageerror() {}
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent(): boolean {
    return true;
  }
  onerror() {}
}
window.Worker = Worker;
