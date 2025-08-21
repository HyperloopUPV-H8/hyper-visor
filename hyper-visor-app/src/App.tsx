import { Gauge } from './components';
import { VehiclePosition } from './components/VehiclePosition/VehiclePosition';
import { useHyperloopSocketManager } from './hooks/useHyperloopSocketManager';
import { Header } from './layout'
import styles from './App.module.scss'
import { Brake } from './components/Brake/Brake';

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
            measurementId="reference_speed"
            size={170}
            strokeWidth={18}
          />
          <Gauge
            measurementId="reference_speed"
            size={170}
            strokeWidth={18}
          />
        </div>
      </div>

      <h2 className={styles.sectionTitle}>Brakes</h2>
      
      <div className={styles.brakesContainer}>
        <div className={styles.brakesColumn}>
          <Brake
            measurementId="reed_1"
            rotation={0}
          />
          <Brake
            measurementId="reed_2"
            rotation={0}
          />
        </div>
        <div className={styles.brakesColumn}>
          <Brake
            measurementId="reed_3"
            rotation={180}
          />
          <Brake
            measurementId="reed_4"
            rotation={180}
          />
        </div>
      </div>
      
      <h2 className={styles.sectionTitle}>Levitation</h2>
    </>
  )
}

export default App
