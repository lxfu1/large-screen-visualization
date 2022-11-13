import React from "react";
import { Radar } from "@ant-design/plots";
import { ThemeColor6 } from "src/constants";

const data = [
  { item: "Design", user: "a", score: 70 },
  { item: "Design", user: "b", score: 30 },
  { item: "Marketing", user: "a", score: 50 },
  { item: "Marketing", user: "b", score: 60 },
  { item: "Users", user: "a", score: 40 },
  { item: "Users", user: "b", score: 50 },
  { item: "Test", user: "a", score: 60 },
  { item: "Test", user: "b", score: 70 },
  { item: "Support", user: "a", score: 30 },
  { item: "Support", user: "b", score: 40 },
  { item: "Sales", user: "a", score: 60 },
  { item: "Sales", user: "b", score: 40 },
  { item: "UX", user: "a", score: 50 },
  { item: "UX", user: "b", score: 60 },
];

export const RadarComponent = () => {
  const config = {
    data,
    xField: "item",
    yField: "score",
    seriesField: "user",
    meta: {
      score: {
        alias: "分数",
        min: 0,
        max: 80,
      },
    },
    area: {
      color: ThemeColor6,
    },
    xAxis: {
      label: {
        style: {
          fill: "#fff",
        },
      },
      line: null,
      tickLine: null,
      grid: {
        line: {
          style: {
            lineDash: null,
          },
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fill: "#fff",
        },
      },
    },
    // 开启辅助点
    point: {
      size: 2,
    },
    legend: false as false,
  };

  return <Radar {...config} />;
};
