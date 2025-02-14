"use client";

import {ReactQuery} from "./lib/react-query.tsx";
import {IndexView} from "./view/index-view.tsx";
import {Header} from "./ui/header.tsx";
import {Footer} from "./ui/footer.tsx";
import {Container} from "./ui/container.tsx";
import './ui/app.css'

function App() {
  return (
    <ReactQuery>
      <Container>
        <Header />
        <IndexView />
        <Footer />
      </Container>
    </ReactQuery>
  );
}

export default App;
