import React from "react";
import { Card } from "src/components/card";
import { state } from "src/models";
import {
  createCardBackgroundImage,
  createTitleBackgroundImage,
} from "src/utils";
import { Radar, WordCloud, Bar, RadialTree, Scatter, Pie } from "./components";
import styles from "./style.module.scss";

const sliderWidth = 300;

export const Home = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState(0);
  const [backgrounds, setBackgrounds] = React.useState<string[]>([]);
  const [titleBackgrounds, setTitleBackgrounds] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (containerRef.current) {
      const { clientHeight, clientWidth } = containerRef.current;
      state.sliderHeight = clientHeight;
      state.sliderWidth = sliderWidth;
      setHeight(clientHeight);
      setBackgrounds(
        createCardBackgroundImage(clientWidth, clientHeight, sliderWidth)
      );
      setTitleBackgrounds(createTitleBackgroundImage(sliderWidth));
    }
  }, [containerRef]);

  return (
    <div className={styles.container} ref={containerRef}>
      {height && (
        <React.Fragment>
          <div className={styles.left} style={{ width: sliderWidth }}>
            <Card
              title="散点图"
              cardImage={backgrounds[1]}
              titleImage={titleBackgrounds[0]}
              titleStyle={{
                marginTop: 6,
              }}
              style={{ height: height / 2 }}
            >
              <Scatter />
            </Card>
            <Card
              title="雷达图"
              cardImage={backgrounds[1]}
              titleImage={titleBackgrounds[0]}
              titleStyle={{
                marginTop: 6,
              }}
              style={{ height: height / 2 }}
            >
              <Radar />
            </Card>
          </div>
          <div className={styles.center}>
            <Card
              cardImage={backgrounds[2]}
              showTitle={false}
              style={{ height: height }}
              childrenStyle={{
                padding: "36px 12px",
              }}
            >
              <RadialTree />
            </Card>
          </div>
          <div className={styles.right} style={{ width: sliderWidth }}>
            <Card
              title="词云图"
              cardImage={backgrounds[3]}
              titleImage={titleBackgrounds[1]}
              style={{ height: height / 3 }}
            >
              <WordCloud />
            </Card>
            <Card
              title="条形图"
              cardImage={backgrounds[3]}
              titleImage={titleBackgrounds[1]}
              style={{ height: height / 3 }}
            >
              <Bar />
            </Card>
            <Card
              title="饼图"
              cardImage={backgrounds[3]}
              titleImage={titleBackgrounds[1]}
              style={{ height: height / 3 }}
            >
              <Pie />
            </Card>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};
