"use client";

import { Toaster } from "react-hot-toast";
import { ReactQuery } from "./lib/react-query.tsx";
import { IndexView } from "./view/index-view.tsx";
import { Footer } from "./ui/footer.tsx";
import { Container } from "./ui/container.tsx";
import { LinguiProvider } from "./i18n/lingui-provider.tsx";
import "./ui/app.css";

function App() {
  return (
    <LinguiProvider>
      <ReactQuery>
        <Container>
          <IndexView />
          <Footer />
          <Toaster />
        </Container>
      </ReactQuery>
    </LinguiProvider>
  );
}

export default App;
