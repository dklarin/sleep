import { lighten, darken } from "polished";

/** we will derive all primary app colors from this color */
const primaryColor = "#1e5ae8";

/** we will derive all accent app colors from this color */
const accentColor = "#AA8439";

/**The color palette in use */
export const colorPalette = {
  primary55: lighten(0.45, primaryColor),
  primary60: lighten(0.4, primaryColor),
  primary70: lighten(0.3, primaryColor),
  primary80: lighten(0.2, primaryColor),
  primary100: primaryColor,
  primary120: darken(0.2, primaryColor),
  primary130: darken(0.3, primaryColor),
  primary140: darken(0.4, primaryColor),
  primary150: darken(0.5, primaryColor),
  accent55: lighten(0.45, accentColor),
  accent60: lighten(0.4, accentColor),
  accent70: lighten(0.3, accentColor),
  accent80: lighten(0.2, accentColor),
  accent100: accentColor,
  accent120: darken(0.2, accentColor),
  accent130: darken(0.3, accentColor),
  accent140: darken(0.4, accentColor),
  accent150: darken(0.5, accentColor)
};

/**The app theme in use */
export const light = {
  /**The color palette exposed, if you need to access specific color*/
  palette: colorPalette,
  /**Use in every component that requires user input to specify padding value */
  inputPadding: "0.5rem",
  /**Use in every input like component to specify border-radius*/
  borderRadius: "4px",
  /**Use in every input like component to specify border-color*/
  borderColor: colorPalette.primary80,
  /**Use in every input like component to specify border-color when hover*/
  borderHoverColor: colorPalette.primary100,
  /**Use in every input like component to specify border-color when focused*/
  borderFocusColor: colorPalette.primary100,
  /**Use in every input like component to specify box-shadow when focused*/
  borderFocusBoxShadow: `0 0 5px ${colorPalette.primary100}`,
  /**Use in every input like component to specify placeholder color*/
  placeholderColor: colorPalette.primary70,
  /**The default text color, should be inherited in components*/
  color: colorPalette.primary130,
  /**Use in every input like component to specify background-color*/
  inputBackgroundColor: "white",

  /**Toggle-switch is disabled */
  outerBackgroundColorDisabled: "white",
  innerBackgroundColorDisabled: colorPalette.primary60,

  /**Toggle-switch is off*/
  outerBackgroundColorOff: colorPalette.primary60,
  borderColorOff: colorPalette.primary55,

  /**Toggle-switch is on*/
  outerBackgroundColorOn: colorPalette.primary100,
  borderColorOn: colorPalette.primary100,

  /**Toggle-switch inside */
  innerBackgroundColor: colorPalette.primary70
};
