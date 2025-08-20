import { Gauge } from './components';
import { VehiclePosition } from './components/VehiclePosition/VehiclePosition';
import { useHyperloopSocketManager } from './hooks/useHyperloopSocketManager';
import { Header } from './layout'
import styles from './App.module.scss'

function App() {

  const { readyState } = useHyperloopSocketManager();

  return (
    <>
      <Header />

      <hr style={{
        width: '90%',
        margin: '0 auto'
      }}/>

      <h2 className={styles.sectionTitle}>Position & Movement</h2>

      <div style={{
        padding: '40px',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <div>
          <VehiclePosition 
            totalDistanceTrack={50} 
            position={25} 
          />
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Gauge
            label="Speed"
            value={80}
            min={0}
            max={100}
            unit="Km/h"
            size={170}
            strokeWidth={18}
          />
          <Gauge
            label="Acceleration"
            value={80}
            min={0}
            max={100}
            unit="G"
            size={170}
            strokeWidth={18}
          />
        </div>
      </div>

      <h2 className={styles.sectionTitle}>Brakes</h2>

      <h2 className={styles.sectionTitle}>Levitation</h2>
    </>
  )
}

export default App
