type Corner = "left-top" | "right-top" | "right-bottom" | "left-bottom";

type ICreate = {
  width?: number;
  height?: number;
  pathStyle?: object;
  corner?: Corner[];
  cornerOffset?: number;
  path?: (string | number)[][];
};

export const DefaultPathStyle = {
  lineWidth: 4,
  lineJoin: "round",
  strokeStyle: "#54BECC",
  shadowColor: "#54BECC",
  shadowBlur: 24,
};

export const createOffScreenPath = ({
  width = 300,
  height = 300,
  pathStyle = {},
  corner = ["left-top", "left-bottom"],
  cornerOffset = 20,
  path: customPath,
}: ICreate) => {
  let ctx: CanvasRenderingContext2D;
  let canvasBox: HTMLDivElement;
  const createOffScreenBox = () => {
    canvasBox = document.createElement("div");
    canvasBox.style.width = width + "px";
    canvasBox.style.height = height + "px";
    canvasBox.style.position = "absolute";
    canvasBox.style.zIndex = "-1";
    canvasBox.style.visibility = "hidden";
    document.body.appendChild(canvasBox);

    const canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.setAttribute("width", width + "px");
    canvas.setAttribute("height", height + "px");
    ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    canvasBox.appendChild(canvas);
  };

  const style = { ...DefaultPathStyle, ...pathStyle };

  const { lineWidth = 2 } = style;
  const getCornerPath = (
    corner: "left-top" | "right-top" | "right-bottom" | "left-bottom"
  ) => {
    switch (corner) {
      case "left-top":
        return [
          ["L", lineWidth, lineWidth + cornerOffset],
          ["L", lineWidth + cornerOffset, lineWidth],
        ];
      case "right-top":
        return [
          ["L", width - lineWidth - cornerOffset, lineWidth],
          ["L", width - lineWidth, lineWidth + cornerOffset],
        ];
      case "right-bottom":
        return [
          ["L", width - lineWidth, height - lineWidth - cornerOffset],
          ["L", width - lineWidth - cornerOffset, height - lineWidth],
        ];
      case "left-bottom":
        return [
          ["L", lineWidth + cornerOffset, height - lineWidth],
          ["L", lineWidth, height - lineWidth - cornerOffset],
        ];
      default:
        return [];
    }
  };

  // 构建 path，不要问为什么不使用形参，不想！
  const getPath = () => {
    let paths = [];
    if (corner.includes("left-top")) {
      paths.push(["M", lineWidth + cornerOffset, lineWidth]);
    } else {
      paths.push(["M", lineWidth, lineWidth]);
    }
    if (corner.includes("right-top")) {
      paths = paths.concat(getCornerPath("right-top"));
    } else {
      paths.push(["L", width - lineWidth, lineWidth]);
    }
    if (corner.includes("right-bottom")) {
      paths = paths.concat(getCornerPath("right-bottom"));
    } else {
      paths.push(["L", width - lineWidth, height - lineWidth]);
    }
    if (corner.includes("left-bottom")) {
      paths = paths.concat(getCornerPath("left-bottom"));
    } else {
      paths.push(["L", lineWidth, height - lineWidth]);
    }
    if (corner.includes("left-top")) {
      paths = paths.concat(getCornerPath("left-top"));
    }
    paths.push(["Z"]);
    return paths;
  };

  // 仅仅处理水平渐变，其它情况不考虑
  const createSpecialStyle = (
    key: "fillStyle" | "strokeStyle",
    style: string
  ) => {
    if (style.startsWith("l(0)")) {
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      style.split(" ").forEach((item) => {
        const [stop, color] = item.split(":");
        if (stop && color) {
          gradient.addColorStop(Number(stop), color);
        }
      });
      ctx[key] = gradient;
      return;
    }
    ctx[key] = style;
  };

  const createStyles = (styles: { [key: string]: string | number }) => {
    const specialKeys = ["fillStyle", "strokeStyle"];
    Object.keys(styles).forEach((key) => {
      if (specialKeys.includes(key)) {
        createSpecialStyle(
          key as "fillStyle" | "strokeStyle",
          styles[key] as string
        );
      } else {
        // @ts-ignore
        ctx[key] = styles[key];
      }
    });
  };

  const transformPath = (paths: (string | number)[][]) => {
    paths.forEach((item) => {
      const [type, x, y] = item as [string, number, number];
      if (type === "M") ctx.moveTo(x, y);
      if (type === "L") ctx.lineTo(x, y);
      if (type === "Z") ctx.closePath();
    });
  };

  const createPath = () => {
    const path: (string | number)[][] = customPath || getPath();
    if (!ctx) return;
    ctx.beginPath();
    createStyles(style);
    transformPath(path);
    ctx.stroke();
    ctx.closePath();
    // @ts-ignore
    if (style["fillStyle"]) {
      ctx.fill();
    }
  };

  const getBase64Data = () => {
    const base64Data = canvasBox.getElementsByTagName("canvas")[0].toDataURL();
    document.body.removeChild(canvasBox);
    return base64Data;
  };

  createOffScreenBox();
  createPath();
  return getBase64Data();
};

export const createCardBackgroundImage = (
  w: number,
  h: number,
  sliderWidth: number
) => {
  const centerWith = w - sliderWidth * 2;
  const { lineWidth } = DefaultPathStyle;
  const centerOffset = 80;
  const centerDy = 40;
  const res: string[] = [
    // left
    createOffScreenPath({
      width: sliderWidth,
      height: h / 2,
    }),
    createOffScreenPath({
      width: sliderWidth,
      height: h / 2,
    }),
    // center
    createOffScreenPath({
      width: centerWith,
      height: h,
      corner: ["left-top", "right-top", "right-bottom", "left-bottom"],
      path: [
        ["M", lineWidth, lineWidth],
        ["L", lineWidth + centerOffset, lineWidth],
        ["L", lineWidth + centerOffset + centerDy, lineWidth + centerDy],
        [
          "L",
          centerWith - lineWidth - centerOffset - centerDy,
          lineWidth + centerDy,
        ],
        ["L", centerWith - lineWidth - centerOffset, lineWidth],
        ["L", centerWith - lineWidth, lineWidth],
        ["L", centerWith - lineWidth, h - lineWidth],
        ["L", centerWith - lineWidth - centerOffset, h - lineWidth],
        [
          "L",
          centerWith - lineWidth - centerOffset - centerDy,
          h - lineWidth - centerDy,
        ],
        ["L", lineWidth + centerOffset + centerDy, h - lineWidth - centerDy],
        ["L", lineWidth + centerOffset, h - lineWidth],
        ["L", lineWidth, h - lineWidth],
        ["Z"],
      ],
    }),
    // right
    createOffScreenPath({
      width: sliderWidth,
      height: h / 3,
      corner: ["right-top", "right-bottom"],
    }),
    createOffScreenPath({
      width: sliderWidth,
      height: h / 3,
      corner: ["right-top", "right-bottom"],
    }),
    createOffScreenPath({
      width: sliderWidth,
      height: h / 3,
      corner: ["right-top", "right-bottom"],
    }),
  ];

  return res;
};

export const createTitleBackgroundImage = (sliderWidth: number) => {
  const cardTitleStyle = {
    width: sliderWidth - 32 - 24, // card padding + title padding
    height: 32,
    cornerOffset: 16,
    pathStyle: {
      lineWidth: 0,
      shadowBlur: 0,
      // 沿用 @antv/g 语法
      fillStyle: "l(0) 0:#1c55ec 0.5:#9ad7ed 1:rgba(255,255,255,0)",
      strokeStyle: "l(0) 0:#1c55ec 0.5:#9ad7ed 1:rgba(255,255,255,0)",
    },
  };
  return [
    // left
    createOffScreenPath({
      corner: ["left-top"],
      ...cardTitleStyle,
    }),
    // right
    createOffScreenPath({
      corner: ["right-top"],
      ...cardTitleStyle,
    }),
  ];
};
