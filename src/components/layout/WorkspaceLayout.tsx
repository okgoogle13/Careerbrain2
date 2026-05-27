import React from "react";

type Props = {
  children: React.ReactNode;
};

export function WorkspaceLayout({ children }: Props) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden w-full">
      {children}
    </div>
  );
}
