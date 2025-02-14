"use client";

import {ListenedList} from "./tracks/listened-list.tsx";
import {ReactQuery} from "./lib/react-query.tsx";

function App() {
  return (
      <ReactQuery>
        <div className={'page'}>
            <h2>Last listened</h2>
            <div className={"tracks"}>
                <ListenedList />
            </div>
            <footer>
                <a href={'https://github.com/landsman/music'}>github.com/landsman/music</a>
            </footer>
        </div>
      </ReactQuery>
  )
}

export default App
