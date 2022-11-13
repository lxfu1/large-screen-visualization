interface CacheNode {
  /**
   * 节点状态
   *  - 0：未执行
   *  - 1：已执行
   *  - 2：出错
   */
  s: 0 | 1 | 2;
  // 缓存值
  v: unknown;
  // 特殊类型（object,fn），使用 weakMap 存储，避免内存泄露
  o: WeakMap<Function | object, CacheNode> | null;
  // 基本类型
  p: Map<Function | object, CacheNode> | null;
}

const cacheContainer = new WeakMap<Function, CacheNode>();

export const cache = (fn: Function): Function => {
  const UNTERMINATED = 0;
  const TERMINATED = 1;
  const ERRORED = 2;

  const createCacheNode = (): CacheNode => {
    return {
      s: UNTERMINATED,
      v: undefined,
      o: null,
      p: null,
    };
  };

  return function () {
    let cacheNode = cacheContainer.get(fn);
    if (!cacheNode) {
      cacheNode = createCacheNode();
      cacheContainer.set(fn, cacheNode);
    }
    for (let i = 0; i < arguments.length; i++) {
      const arg = arguments[i];
      // 使用 weakMap 存储，避免内存泄露
      if (
        typeof arg === "function" ||
        (typeof arg === "object" && arg !== null)
      ) {
        let objectCache: CacheNode["o"] = cacheNode.o;
        if (objectCache === null) {
          objectCache = cacheNode.o = new WeakMap();
        }
        let objectNode = objectCache.get(arg);
        if (objectNode === undefined) {
          cacheNode = createCacheNode();
          objectCache.set(arg, cacheNode);
        } else {
          cacheNode = objectNode;
        }
      } else {
        let primitiveCache: CacheNode["p"] = cacheNode.p;
        if (primitiveCache === null) {
          primitiveCache = cacheNode.p = new Map();
        }
        let primitiveNode = primitiveCache.get(arg);
        if (primitiveNode === undefined) {
          cacheNode = createCacheNode();
          primitiveCache.set(arg, cacheNode);
        } else {
          cacheNode = primitiveNode;
        }
      }
    }
    if (cacheNode.s === TERMINATED) return cacheNode.v;
    if (cacheNode.s === ERRORED) {
      throw cacheNode.v;
    }
    try {
      const res = fn.apply(null, arguments as any);
      cacheNode.v = res;
      cacheNode.s = TERMINATED;
      return res;
    } catch (err) {
      cacheNode.v = err;
      cacheNode.s = ERRORED;
      throw err;
    }
  };
};
