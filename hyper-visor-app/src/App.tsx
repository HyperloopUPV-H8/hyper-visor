import { useHyperloopSocketManager } from './hooks/useHyperloopSocketManager';
import { Header } from './layout'

function App() {

  const { readyState } = useHyperloopSocketManager();

  return (
    <>
      <Header />

      <hr style={{
        width: '80%',
        margin: '0 auto'
      }}/>
    </>
  )
}

export default App
