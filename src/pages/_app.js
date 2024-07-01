import Layout from "@/components/Layout";
import MessageProvider from "@/components/Message";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return <MessageProvider>
    <Layout>
    <Component {...pageProps} />
  </Layout>;
  </MessageProvider>
  
}
