import {ListenedList} from "./tracks/listened-list.tsx";

function App() {
  return (
    <>
        <div className='tracks'>
            <h2>Last listened</h2>
            <ListenedList />
        </div>
    </>
  )
}

export default App
