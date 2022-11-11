import { state } from "./models";
import { useEffect, useRef } from "react";
import "./million.css";

// 节点数量
const Count = 5000000;

export const Graph = () => {
  const containerRefs = useRef<HTMLDivElement>(null);
  const refs = useRef<HTMLCanvasElement>(null);
  const ctxRefs = useRef<CanvasRenderingContext2D>();

  const createNode = (width: number, height: number) => {
    return () => {
      state.count++;
      const ctx = ctxRefs.current;
      if (!ctx) return;
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = 4;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
      ctx.strokeStyle = "#f58773";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.closePath();
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
      ctxRefs.current = refs.current.getContext(
        "2d"
      ) as CanvasRenderingContext2D;

      const tasks: Function[] = [];
      for (let i = 0; i < Count; i++) {
        tasks.push(createNode(clientWidth, clientHeight));
      }
      schduler(tasks);
    }
  }, []);

  return (
    <div className="container" ref={containerRefs}>
      <canvas ref={refs} />
    </div>
  );
};
