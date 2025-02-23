"use client";

import { Toaster } from "@/components/ui/sonner";
import { store } from "@/redux/store";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Provider } from "react-redux";

const ClientWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Provider store={store}>
        <Toaster richColors={true} closeButton={true} position="top-right" />
        <SessionProvider>{children}</SessionProvider>
      </Provider>
    </div>
  );
};

export default ClientWrapper;
