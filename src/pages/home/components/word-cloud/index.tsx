import React from "react";
import { WordCloud } from "@ant-design/plots";
import { ThemeColor6 } from "src/constants";

export const WordCloudComponent = () => {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {
    fetch(
      "https://gw.alipayobjects.com/os/antvdemo/assets/data/antv-keywords.json"
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log("fetch data failed", error);
      });
  };
  const config = {
    data,
    wordField: "name",
    weightField: "value",
    colorField: "name",
    colors: ThemeColor6,
    wordStyle: {
      fontFamily: "Verdana",
      fontSize: [8, 32] as [number, number],
    },
  };

  return <WordCloud {...config} />;
};
