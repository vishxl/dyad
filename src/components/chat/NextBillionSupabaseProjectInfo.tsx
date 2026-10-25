import React from "react";
import { CustomTagState } from "./stateTypes";
import { NextBillionDbProjectInfo } from "./NextBillionDbProjectInfo";

interface NextBillionSupabaseProjectInfoProps {
  node: {
    properties: {
      state?: CustomTagState;
    };
  };
  children: React.ReactNode;
}

export function NextBillionSupabaseProjectInfo(
  props: NextBillionSupabaseProjectInfoProps,
) {
  return <NextBillionDbProjectInfo provider="Supabase" {...props} />;
}
