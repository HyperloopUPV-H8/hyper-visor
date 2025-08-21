import { useMeasurementUpdate } from "../../hooks/useMeasurementUpdate";
import type { MeasurementId } from "../../types/adj";
import brakeOpen from "../../assets/brake_open.svg";
import brakeClosed from "../../assets/brake_closed.svg";
import styles from "./Brake.module.scss";

interface Props {
    measurementId: MeasurementId;
    rotation: number;
}

export const Brake: React.FC<Props> = ({ measurementId, rotation }) => {

    const value = useMeasurementUpdate(measurementId) as string;

    return (
        <div className={styles.brake}>
            { value === 'Not_braking' ? (
                <img 
                    src={brakeOpen} 
                    alt="Brake" 
                    style={{ transform: `rotate(${rotation}deg)` }}
                />
            ) : ( value === 'braking' ? (
                <img 
                    src={brakeClosed} 
                    alt="Brake" 
                    style={{ transform: `rotate(${rotation}deg)` }}
                />
            ) : (
                <div className={styles.disabled}>
                    <img 
                        src={brakeOpen}
                        alt="Brake disabled"
                        style={{ transform: `rotate(${rotation}deg)` }}
                    />
                </div>
            ) ) }
        </div>
    )
}
