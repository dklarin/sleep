import React from "react";
import { TextInput } from "../../ui/textInput";

export type TProps = {
  value: String;
  name: String;
  width: String;
  defaultValue: String;
  onChange: (value: any) => any;
  onBlur: (value: any) => any;
};

export const TextInputPart = (props: TProps) => {
  const { value, defaultValue, name, onChange, onBlur, width } = props;

  return (
    <div className="box" style={{ marginTop: "23px" }}>
      <TextInput
        type="text"
        name={name}
        defaultValue={defaultValue}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        style={{ width: width }}
      />
    </div>
  );
};
