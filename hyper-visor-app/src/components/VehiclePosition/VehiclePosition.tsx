
import styles from './VehiclePosition.module.scss';

interface Props {
    position: number;
    totalDistanceTrack: number;
}

export const VehiclePosition = ({ position, totalDistanceTrack }: Props) => {
    const clampedPosition = Math.max(0, Math.min(totalDistanceTrack, position));
    const positionPercentage = (clampedPosition / totalDistanceTrack) * 100;
    const totalMeters = Array.from({ length: Math.floor(totalDistanceTrack / 10) + 1 }, (_, i) => Math.min(i * 10, totalDistanceTrack));

    return (
        <div className={styles.trackContainer}>
            <div className={styles.track}>
                <div 
                    className={styles.vehicle}
                    style={{ 
                        top: `${100 - positionPercentage}%`
                    }}
                />
                <div>
                {totalMeters.map((meter) => (
                    <div 
                        key={meter}
                        className={styles.distanceMarker}
                        style={{ top: `${100 - (meter / totalDistanceTrack) * 100}%` }}
                    >
                        <span className={styles.markerText}>{meter}m</span>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
}
