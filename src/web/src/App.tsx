import {ListenedList} from "./tracks/listened-list.tsx";
import {QueryClientProvider} from "npm:@tanstack/react-query@5.66.0";
import {QueryClient} from "npm:@tanstack/query-core@5.66.0";

const queryClient = new QueryClient()

function App() {
  return (
      <QueryClientProvider client={queryClient}>
        <div className={'page'}>
            <h2>Last listened</h2>
            <div className={"tracks"}>
                <ListenedList />
            </div>
        </div>
      </QueryClientProvider>
  )
}

export default App
