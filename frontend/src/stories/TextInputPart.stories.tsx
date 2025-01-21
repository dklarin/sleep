import React from "react";
//import {ToggleSwitch, TProps} from "./ToggleSwitch";
import { TextInputPart, TProps } from "../ui/textInputPart";
//import { action } from "@storybook/addon-actions";
//import { storiesOf } from "@storybook/react";
import { Story, Meta } from "@storybook/react/types-6-0";

export default {
  title: "TextInputPart",
  component: TextInputPart,
  /*argTypes: {
    backgroundColor: { control: 'color' },
  },*/
} as Meta;

const Template: Story<TProps> = (args) => <TextInputPart {...args} />;

export const Value = Template.bind({});
Value.args = {
  value: "Vrijednost",
  //disabled: false,
};

/*export default storiesOf("Components|ToggleSwitch", module)
  .add("toggle switch off", () => (
    <ToggleSwitch
      value={false}
      disabled={false}
      onChange={action("switch clicked")}
    />
  ))
  .add("toggle switch on", () => (
    <ToggleSwitch
      value={true}
      disabled={false}
      onChange={action("switch clicked")}
    />
  ))
  .add("toggle switch disabled", () => (
    <ToggleSwitch value={false} disabled={true} onChange={action("disabled")} />
  ));*/
