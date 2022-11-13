import { proxy } from "valtio";
import { NodeConfig } from "@ant-design/graphs";

type IState = {
  sliderWidth: number;
  sliderHeight: number;
  selected: NodeConfig | null;
};

export const state: IState = proxy({
  sliderWidth: 0,
  sliderHeight: 0,
  selected: null,
});
