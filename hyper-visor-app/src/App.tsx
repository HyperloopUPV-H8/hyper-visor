import { Gauge } from './components'

function App() {

  return (
    <>
      <div style={{
        width: '25%'
      }}>
        <Gauge value={75} max={100} />
      </div>
    </>
  )
}

export default App
