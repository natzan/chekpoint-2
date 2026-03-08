import "@/styles/globals.css";
import { ApolloProvider } from "@apollo/client/react";
import type { AppProps } from "next/app";
import client from "@/graphql/client";
import { ToastProvider } from "@/components/ui/toast";

function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </ApolloProvider>
  );
}

export default App;
