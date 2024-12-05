import { ReactNode } from "react";
import { ComponentsProvider } from "./components";
import { SellerProvider } from "./sellers";
import { LogsProvider } from "./logs";

interface IChildrenReact {
  children: ReactNode;
}

export function Providers({ children }: IChildrenReact) {
  return (
    <ComponentsProvider>
      <LogsProvider>
        <SellerProvider>{children}</SellerProvider>
      </LogsProvider>
    </ComponentsProvider>
  );
}
