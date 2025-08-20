import { VehiclePosition } from './components/VehiclePosition/VehiclePosition';
import { useHyperloopSocketManager } from './hooks/useHyperloopSocketManager';
import { Header } from './layout'

function App() {

  const { readyState } = useHyperloopSocketManager();

  return (
    <>
      <Header />

      <hr style={{
        width: '90%',
        margin: '0 auto'
      }}/>

      <div style={{
        paddingTop: '40px'
      }}>

        <VehiclePosition 
          totalDistanceTrack={50} 
          position={25} 
        />
      </div>
    </>
  )
}

export default App
