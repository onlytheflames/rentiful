"use client";

import StoreProvider from "@/state/redux";
import { Authenticator } from "@aws-amplify/ui-react";
import { ReactNode } from "react";
import Auth from "./(auth)/authProvider";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <StoreProvider>
      {/* The Auth component needs to be inside Authenticator.Provider because
      it's using react context. When we want to use authenticator aspect inside
      our authProvider, for example if we want to grab user from
      useAuthenticator: */}

      {/* const {user} = useAuthenticator((context) => [context.user]) */}

      {/* useAuthenticator needs a parent component of Authenticator.Provider for us to use */}

      {/* https://ui.docs.amplify.aws/react/connected-components/authenticator/advanced#authenticator-provider */}

      <Authenticator.Provider>
        <Auth>{children}</Auth>
      </Authenticator.Provider>
    </StoreProvider>
  );
};
``;
export default Providers;
