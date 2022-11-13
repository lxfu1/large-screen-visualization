import React from "react";
import { Scatter } from "@ant-design/plots";
import { ThemeColor6 } from "src/constants";

const StrokeStyle = {
  style: {
    stroke: "transparent",
  },
};

const AxisStyle = {
  line: StrokeStyle,
  grid: {
    line: StrokeStyle,
  },
  label: {
    style: {
      fill: "#fff",
    },
  },
};

export const ScatterComponent = () => {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {
    fetch(
      "https://gw.alipayobjects.com/os/antfincdn/t81X1wXdoj/scatter-data.json"
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log("fetch data failed", error);
      });
  };

  const config = {
    data,
    xField: "x",
    yField: "y",
    colorField: "genre",
    color: [
      `r(0.4, 0.3, 0.7) 0:#fff 1:#ed6dc6`,
      "r(0.4, 0.4, 0.7) 0:#fff 1:#c781fb",
    ],
    sizeField: "size",
    size: [4, 12] as [number, number],
    shape: "circle",
    limitInPlot: true,
    pointStyle: {
      lineWidth: 0,
    },
    yAxis: {
      nice: true,
      label: {
        style: {
          fill: "#fff",
        },
      },
    },
    xAxis: {
      grid: {
        line: StrokeStyle,
      },
      line: StrokeStyle,
      tickLine: null,
      label: {
        style: {
          fill: "#fff",
        },
      },
    },
    legend: false as const,
  };

  return <Scatter {...config} />;
};
