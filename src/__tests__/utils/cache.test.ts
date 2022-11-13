import { cache } from "src/utils";

describe("cache", () => {
  const primitivefn = jest.fn((a, b, c) => {
    return a + b + c;
  });
  const objectfn = jest.fn((a, b, c) => {
    return a.count + c.count;
  });

  const orderfn = jest.fn((a, b) => {
    return a.count + b.count;
  });

  const asyncfn = jest.fn(async (a, b) => {
    return new Promise((resolve) => {
      resolve(a + b);
    });
  });

  it("primitive", () => {
    const cacheFn = cache(primitivefn);
    const res1 = cacheFn(1, 2, 3);
    const res2 = cacheFn(1, 2, 3);
    expect(res1).toBe(res2);
    expect(primitivefn).toBeCalledTimes(1);
  });
  it("object", () => {
    const cacheFn = cache(objectfn);
    const obj1 = { count: 2 };
    const obj2 = { count: 2 };
    const res1 = cacheFn(obj1, 2, obj2);
    const res2 = cacheFn(obj1, 2, obj2);
    expect(res1).toBe(res2);
    expect(objectfn).toBeCalledTimes(1);
  });
  it("async", async () => {
    const cacheFn = cache(asyncfn);
    const res1 = await cacheFn(1, 2);
    const res2 = await cacheFn(1, 2);
    expect(res1).toBe(res2);
    expect(asyncfn).toBeCalledTimes(1);
  });
  it("params order", () => {
    const cacheFn = cache(orderfn);
    const obj1 = { count: 2 };
    const obj2 = { count: 2 };
    cacheFn(obj1, obj2);
    cacheFn(obj2, obj1);
    expect(orderfn).toBeCalledTimes(2);
  });
});
