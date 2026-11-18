"use client";

import dynamic from "next/dynamic";

const DemoPanel = dynamic(() => import("./DemoPanel").then((m) => m.DemoPanel), { ssr: false });

export function DemoPanelLoader() {
  return <DemoPanel />;
}
