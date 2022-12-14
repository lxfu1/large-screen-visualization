import { Pie } from "@ant-design/plots";

const data = [
  {
    sex: "男",
    sold: 0.45,
  },
  {
    sex: "女",
    sold: 0.55,
  },
];

export const PieComponent = () => {
  const config = {
    appendPadding: 10,
    data,
    angleField: "sold",
    colorField: "sex",
    radius: 0.8,
    legend: false as const,
    label: {
      type: "inner",
      offset: "-50%",
      style: {
        fill: "#fff",
        fontSize: 18,
        textAlign: "center",
      },
    },
    pieStyle: ({ sex }: { sex: string }) => {
      if (sex === "男") {
        return {
          fill: "p(a)https://gw.alipayobjects.com/zos/antfincdn/FioHMFgIld/pie-wenli1.png",
        };
      }

      return {
        fill: "p(a)https://gw.alipayobjects.com/zos/antfincdn/Ye2DqRx%2627/pie-wenli2.png",
      };
    },
    tooltip: false,
    interactions: [
      {
        type: "element-single-selected",
      },
    ],
  };

  return <Pie {...config} />;
};
