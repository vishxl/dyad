import React from "react";
import { CustomTagState } from "./stateTypes";
import { NextBillionDbProjectInfo } from "./NextBillionDbProjectInfo";

interface NextBillionNeonProjectInfoProps {
  node: {
    properties: {
      state?: CustomTagState;
    };
  };
  children: React.ReactNode;
}

export function NextBillionNeonProjectInfo(
  props: NextBillionNeonProjectInfoProps,
) {
  return <NextBillionDbProjectInfo provider="Neon" {...props} />;
}
