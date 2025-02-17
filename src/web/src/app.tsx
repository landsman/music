"use client";

import { Toaster } from "react-hot-toast";
import { ReactQuery } from "./lib/react-query.tsx";
import { IndexView } from "./view/index-view.tsx";
import { Footer } from "./ui/footer.tsx";
import { Container } from "./ui/container.tsx";
import "./ui/app.css";

function App() {
  return (
    <ReactQuery>
      <Container>
        <IndexView />
        <Footer />
        <Toaster />
      </Container>
    </ReactQuery>
  );
}

export default App;
