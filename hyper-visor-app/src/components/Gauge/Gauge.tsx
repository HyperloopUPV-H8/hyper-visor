import React from 'react';
import styles from './Gauge.module.scss';

type GaugeProps = {
    value: number;
    min?: number;
    max?: number;
    unit?: string;
    size?: string | number;
};

export const Gauge: React.FC<GaugeProps> = ({
    value,
    min = 0,
    max = 100,
    unit = 'km/h',
    size = '100%'
}) => {
    const viewBoxSize = 200;
    const strokeWidth = 20;
    const radius = (viewBoxSize - strokeWidth) / 2;
    const center = viewBoxSize / 2;
    
    // Calculamos el ángulo inicial y final en radianes (240 grados en total)
    const startAngle = (150) * (Math.PI / 180);  // Comenzamos en 150 grados (izquierda)
    const endAngle = (30) * (Math.PI / 180);     // Terminamos en 30 grados (derecha)
    
    // Calculamos los puntos de inicio y fin del arco
    const startX = center + radius * Math.cos(startAngle);
    const startY = center + radius * Math.sin(startAngle);
    const endX = center + radius * Math.cos(endAngle);
    const endY = center + radius * Math.sin(endAngle);
    
    // Calculamos la longitud total del arco (240 grados)
    const arcLength = radius * (240 * Math.PI / 180);
    const clampedValue = Math.min(Math.max(value, min), max);
    const percentage = (clampedValue - min) / (max - min);
    const dashArray = arcLength;
    const dashOffset = arcLength * (1 - percentage);

    // Construimos el path del arco (flag 1 1 para que vaya por arriba con arco largo)
    const arcPath = `M ${startX} ${startY} A ${radius} ${radius} 0 1 1 ${endX} ${endY}`;

    return (
        <div className={styles.gaugeContainer}>
            <svg 
                viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
                style={{
                    width: size,
                    maxWidth: '100%'
                }}
            >
                <defs>
                    <linearGradient id="gradient" gradientUnits="userSpaceOnUse" x1={startX} y1={startY} x2={endX} y2={endY}>
                        <stop offset="0%" stopColor="#4CAF50"/>
                        <stop offset="100%" stopColor="#f44336"/>
                    </linearGradient>
                </defs>
                <circle
                    cx={center}
                    cy={center}
                    r={radius + strokeWidth / 2}
                    className={styles.gaugeBackground}
                />
                <path
                    className={styles.backgroundPath}
                    d={arcPath}
                    fill="none"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
                <path
                    className={styles.valuePath}
                    d={arcPath}
                    fill="none"
                    strokeWidth={strokeWidth}
                    strokeDasharray={dashArray}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    stroke="url(#gradient)"
                />
                <text 
                    x={center} 
                    y={viewBoxSize / 2}
                    className={styles.gaugeText}
                >
                    {value} {unit}
                </text>
            </svg>
        </div>
    );
};

export default Gauge;
