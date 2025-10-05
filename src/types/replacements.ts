import type { ReactNode } from "react";

export type ReplacementKind = "icon" | "text" | "bar" | "iconText";

export const ReplacementKinds = {
  Icon: "icon" as ReplacementKind,
  Text: "text" as ReplacementKind,
  Bar: "bar" as ReplacementKind,
  IconText: "iconText" as ReplacementKind,
};

export interface BaseReplacement {
  type: ReplacementKind;
  label: string;
  tooltip?: string;
}

export interface IconReplacement extends BaseReplacement {
  type: "icon";
  element: ReactNode;
}

export interface TextReplacement extends BaseReplacement {
  type: "text";
}

export interface BarReplacement extends BaseReplacement {
  type: "bar";
}

export interface IconTextReplacement extends BaseReplacement {
    type: "iconText";
    element: ReactNode;
}

export type Replacement = IconReplacement | TextReplacement | BarReplacement | IconTextReplacement;
