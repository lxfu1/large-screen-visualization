import { Bar } from "@ant-design/plots";
import { useSnapshot } from "valtio";
import { state } from "src/models";
import { ThemeColor6 } from "src/constants";
import { useEffect, useState } from "react";

const getData = () => {
  return new Array(4).fill("").map((_, index) => ({
    type: "Technology" + index,
    value: Math.ceil(Math.random() * 100),
  }));
};

export const BarComponent = () => {
  const snap = useSnapshot(state);
  const [data, setData] = useState(getData());

  useEffect(() => {
    if (snap.selected) setData(getData());
  }, [snap.selected]);

  const config = {
    data,
    xField: "value",
    yField: "type",
    color: ThemeColor6,
    seriesField: "type",
    xAxis: {
      grid: {
        line: false as any,
      },
      label: {
        style: {
          fill: "#fff",
        },
      },
    },
    yAxis: {
      line: null,
      tickLine: null,
      label: {
        style: {
          fill: "#fff",
        },
      },
    },
    legend: false as false,
  };
  return <Bar {...config} />;
};
