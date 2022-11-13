import { useEffect, useRef } from "react";
import { cache } from "src/utils";
import styles from "./style.module.scss";

const NodeMargin = 20;
export const Background = () => {
  const containerRefs = useRef<HTMLDivElement>(null);
  const refs = useRef<HTMLCanvasElement>(null);
  const animateRefs = useRef<HTMLCanvasElement>(null);

  const createCircle = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    r: number,
    fill: string,
    shadowBlur: number
  ) => {
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = fill;
    ctx.shadowColor = fill;
    ctx.shadowBlur = shadowBlur;
    ctx.fill();
    ctx.closePath();
  };

  const createNode = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    highLight = false
  ) => {
    return () => {
      const color = highLight ? "#6a7787" : "#657589";
      createCircle(ctx, x, y, highLight ? 3 : 1, color, highLight ? 20 : 3);
    };
  };

  const schduler = (tasks: Function[]) => {
    const DEFAULT_RUNTIME = 16;
    const { port1, port2 } = new MessageChannel();
    let isAbort = false;

    const promise: Promise<any> = new Promise((resolve, reject) => {
      const runner = () => {
        const preTime = performance.now();
        if (isAbort) {
          return reject();
        }
        do {
          if (tasks.length === 0) {
            return resolve([]);
          }
          const task = tasks.shift();
          task?.();
        } while (performance.now() - preTime < DEFAULT_RUNTIME);
        port2.postMessage("");
      };
      port1.onmessage = () => {
        runner();
      };
    });
    // @ts-ignore
    promise.abort = () => {
      isAbort = true;
    };
    port2.postMessage("");
    return promise;
  };

  useEffect(() => {
    if (refs.current && containerRefs.current) {
      const { clientWidth, clientHeight } = containerRefs.current;
      refs.current.width = clientWidth;
      refs.current.height = clientHeight;
      const ctx = refs.current.getContext("2d") as CanvasRenderingContext2D;

      const tasks: Function[] = [];
      const HCount = Math.ceil(clientWidth / NodeMargin);
      const VCount = Math.ceil(clientHeight / NodeMargin);
      for (let i = 0; i < HCount; i++) {
        for (let j = 0; j < VCount; j++) {
          tasks.push(
            createNode(
              ctx,
              i * NodeMargin,
              j * NodeMargin,
              i % 10 === 0 && j % 8 === 0
            )
          );
        }
      }
      schduler(tasks);
      createAnimateCircle(clientWidth, clientHeight);
    }
  }, []);

  /** 不考虑顺时针、逆时针等情况，默认顺时针 */
  const getPathPoint = (x: number, y: number, r: number) => {
    const angleCount = Math.PI * 2;

    return (p: number) => {
      if (p > 1 || p < 0) {
        throw new Error("The value range of is [0, 1].");
      }
      const degree = angleCount * p;
      return {
        x: x + Math.cos(degree) * r,
        y: y + Math.sin(degree) * r,
      };
    };
  };

  const createAnimateCircle = (w: number, h: number) => {
    if (animateRefs.current) {
      const rectW = Math.round((Math.min(w, h) * 3) / 4);
      const circleR = 3;
      const clearR = rectW + circleR * 2;
      const r = rectW / 2;
      // 圆的绘制点会在中心位置
      const getPoint = getPathPoint(r + circleR, r + circleR, r);
      // 使用缓存函数，当 p 相同时，不会二次调用 getPoint 方法
      const cacheGetPoint = cache(getPoint);
      animateRefs.current.width = clearR;
      animateRefs.current.height = clearR;
      const aCtx = animateRefs.current.getContext(
        "2d"
      ) as CanvasRenderingContext2D;
      let p = 0;
      const animate = () => {
        if (p >= 1) p = 0;
        const { x, y } = cacheGetPoint(p);
        aCtx.clearRect(0, 0, 2 * clearR, 2 * clearR);
        createCircle(aCtx, x, y, circleR, "#fff", 6);
        p += 0.001;
        requestAnimationFrame(animate);
      };
      animate();
    }
  };

  return (
    <div className={styles.container} ref={containerRefs}>
      <canvas ref={refs} className={styles.point} />
      <canvas ref={animateRefs} className={styles.animate} />
    </div>
  );
};
