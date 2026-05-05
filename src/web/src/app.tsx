"use client";

import { Toaster } from "react-hot-toast";
import { ReactQuery } from "./lib/react-query.tsx";
import { IndexView } from "./ui/view/index/index-view.tsx";
import { Footer } from "./ui/layout/footer/footer.tsx";
import { Container } from "./ui/container.tsx";
import { LinguiProvider } from "./i18n/lingui-provider.tsx";
import { appConfig } from "./config/app-config.ts";
import "./ui/app.css";

function App() {
  return (
    <LinguiProvider>
      <ReactQuery>
        <Container>
          <IndexView />
          <Footer gitHubUrl={appConfig.githubUrl} />
          <Toaster />
        </Container>
      </ReactQuery>
    </LinguiProvider>
  );
}

export default App;
