import React, { useEffect } from "react";
import { state } from "src/models";
import { RadialTreeGraph, IGraph, NodeConfig, Node } from "@ant-design/graphs";

const data = {
  id: "Modeling Methods",
  children: [
    {
      id: "Classification",
      children: [
        { id: "Logistic regression", value: "Logistic regression" },
        {
          id: "Linear discriminant analysis",
          value: "Linear discriminant analysis",
        },
        { id: "Rules", value: "Rules" },
        { id: "Decision trees", value: "Decision trees" },
        { id: "Naive Bayes", value: "Naive Bayes" },
        { id: "K nearest neighbor", value: "K nearest neighbor" },
        {
          id: "Probabilistic neural network",
          value: "Probabilistic neural network",
        },
        { id: "Support vector machine", value: "Support vector machine" },
      ],
      value: "Classification",
    },
    {
      id: "Consensus",
      children: [
        {
          id: "Models diversity",
          children: [
            {
              id: "Different initializations",
              value: "Different initializations",
            },
            {
              id: "Different parameter choices",
              value: "Different parameter choices",
            },
            {
              id: "Different architectures",
              value: "Different architectures",
            },
            {
              id: "Different modeling methods",
              value: "Different modeling methods",
            },
            {
              id: "Different training sets",
              value: "Different training sets",
            },
            { id: "Different feature sets", value: "Different feature sets" },
          ],
          value: "Models diversity",
        },
        {
          id: "Methods",
          children: [
            { id: "Classifier selection", value: "Classifier selection" },
            { id: "Classifier fusion", value: "Classifier fusion" },
          ],
          value: "Methods",
        },
        {
          id: "Common",
          children: [
            { id: "Bagging", value: "Bagging" },
            { id: "Boosting", value: "Boosting" },
            { id: "AdaBoost", value: "AdaBoost" },
          ],
          value: "Common",
        },
      ],
      value: "Consensus",
    },
    {
      id: "Regression",
      children: [
        {
          id: "Multiple linear regression",
          value: "Multiple linear regression",
        },
        { id: "Partial least squares", value: "Partial least squares" },
        {
          id: "Multi-layer feedforward neural network",
          value: "Multi-layer feedforward neural network",
        },
        {
          id: "General regression neural network",
          value: "General regression neural network",
        },
        {
          id: "Support vector regression",
          value: "Support vector regression",
        },
      ],
      value: "Regression",
    },
  ],
  value: "Modeling Methods",
};
const themeColor = "#ed6dc6";

export const RadialTree = () => {
  const graphRef = React.useRef<IGraph>();

  const bindEvents = () => {
    const graph = graphRef.current as IGraph;
    const resetState = () => {
      const nodes = graph.getNodes();
      nodes.forEach((node) => {
        graph.setItemState(node, "selected", false);
      });
    };
    graph?.on("node:click", (e) => {
      resetState();
      graph.setItemState(e.item as Node, "selected", true);
      state.selected = e.item?.getModel() as NodeConfig;
    });
    graph?.on("click", (e) => {
      resetState();
    });
  };

  useEffect(() => {
    if (graphRef.current) bindEvents();
  }, [graphRef]);

  const config = {
    data,
    style: {
      background: "transparent",
    },
    nodeCfg: {
      size: 30,
      type: "circle",
      labelCfg: {
        position: "bottom",
        style: {
          fill: "#fff",
        },
      },
      style: {
        fill: themeColor,
        stroke: themeColor,
        lineWidth: 1,
        strokeOpacity: 0.45,
        shadowColor: themeColor,
        shadowBlur: 25,
      },
      nodeStateStyles: {
        hover: {
          stroke: themeColor,
          lineWidth: 2,
          strokeOpacity: 1,
        },
        selected: {
          fill: "#feaa4a",
        },
      },
    },
    edgeCfg: {
      style: {
        stroke: themeColor,
        shadowColor: themeColor,
        shadowBlur: 20,
      },
      endArrow: {
        type: "triangle",
        fill: themeColor,
        d: 15,
        size: 8,
      },
      edgeStateStyles: {
        hover: {
          stroke: themeColor,
          lineWidth: 2,
        },
      },
    },
    behaviors: ["drag-canvas", "drag-node"],
    onReady: (graph: IGraph) => {
      graph.fitCenter();
      graph.fitView();
      graph.setItemState(
        graph.findById("Modeling Methods") as Node,
        "selected",
        true
      );
      graphRef.current = graph;
    },
  };

  return <RadialTreeGraph {...config} />;
};
