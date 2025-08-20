import React from "react";
import styles from "./Gauge.module.scss";
import type { MeasurementId, NumericMeasurement } from "../../types/adj";
import { useMeasurementUpdate } from "../../hooks/useMeasurementUpdate";
import useADJStore from "../../store/store";

type GaugeProps = {
    measurementId: MeasurementId;
    size?: number;
    strokeWidth?: number;
};

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(n, b));

function toRad(deg: number) { return (Math.PI / 180) * deg; }

function buildArcPath(cx: number, cy: number, r: number, a0: number, a1: number) {
  const start = { x: cx + r * Math.cos(toRad(a0)), y: cy + r * Math.sin(toRad(a0)) };
  const end   = { x: cx + r * Math.cos(toRad(a1)), y: cy + r * Math.sin(toRad(a1)) };
  const large = a1 - a0 <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
}

function pointOnCircle(cx: number, cy: number, r: number, a: number) {
  return { x: cx + r * Math.cos(toRad(a)), y: cy + r * Math.sin(toRad(a)) };
}

export const Gauge: React.FC<GaugeProps> = ({
    measurementId,
    size = 300,
    strokeWidth = 28,
}) => {
    
    const value = useMeasurementUpdate(measurementId) as number;
    const measurementInfo = useADJStore((state) => state.measurements.get(measurementId));
    
    if (!measurementInfo) return null;
    
    const { name, displayUnits, safeRange } = measurementInfo as NumericMeasurement;
    
    const v = clamp(value || 0, safeRange[0], safeRange[1]);
    const t = (v - safeRange[0]) / Math.max(safeRange[1] - safeRange[0], 1);

    // Arco 270° con gap abajo-derecha
    const START = 135;
    const SWEEP = 270;
    const END = START + SWEEP;
    const CURR = START + SWEEP * t;

    const w = size, h = size;
    const cx = w / 2, cy = h / 2;
    const r = cx - strokeWidth * 1.5;

    const trackPath = buildArcPath(cx, cy, r, START, END);

    // Tercios (cada uno 90°)
    const thirds = [
        { from: START,       to: START + 90,  color: "#4caf50" }, // verde
        { from: START + 90,  to: START + 180, color: "#ffeb3b" }, // amarillo
        { from: START + 180, to: END,         color: "#f44336" }, // rojo
    ];

    // Anchura angular del "fade" en cada corte
    const BLEND_DEG = 30;

    // Cortes entre segmentos (ángulos absolutos)
    const cuts = [START + 90, START + 180];

    return (
        <div className={styles.gauge} style={{ width: size, height: size }}>
        <svg className={styles.svg} width={160} height={180} viewBox={`0 0 ${w} ${h}`}>
            <defs>
            {cuts.map((angle, i) => {
                const a0 = angle - BLEND_DEG / 2;
                const a1 = angle + BLEND_DEG / 2;
                const p0 = pointOnCircle(cx, cy, r, a0);
                const p1 = pointOnCircle(cx, cy, r, a1);
                const fromColor = i === 0 ? "#4caf50" : "#ffeb3b";
                const toColor   = i === 0 ? "#ffeb3b" : "#f44336";
                return (
                <linearGradient
                    key={i}
                    id={`blend-${i}`}
                    gradientUnits="userSpaceOnUse"
                    x1={p0.x} y1={p0.y}
                    x2={p1.x} y2={p1.y}
                >
                    <stop offset="0%" stopColor={fromColor} />
                    <stop offset="100%" stopColor={toColor} />
                </linearGradient>
                );
            })}
            </defs>

            <circle cx={cx} cy={cy} r={r + strokeWidth} className={styles.back} />
            <path
            d={trackPath}
            className={styles.track}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            />

            {thirds.map(({ from, to, color }, i) => {
            const hasPrevCut = i > 0;
            const hasNextCut = i < thirds.length - 1;
            const segStart = from + (hasPrevCut ? BLEND_DEG / 2 : 0);
            const segEndLimit = to - (hasNextCut ? BLEND_DEG / 2 : 0);
            const segEnd = Math.min(CURR, segEndLimit);
            if (segEnd <= segStart) return null;
            return (
                <path
                key={`solid-${i}`}
                d={buildArcPath(cx, cy, r, segStart, segEnd)}
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                fill="none"
                />
            );
            })}

            {cuts.map((angle, i) => {
            const a0 = angle - BLEND_DEG / 2;
            const a1 = angle + BLEND_DEG / 2;
            const end = Math.min(CURR, a1);
            if (end <= a0) return null;
            return (
                <path
                key={`fade-${i}`}
                d={buildArcPath(cx, cy, r, a0, end)}
                stroke={`url(#blend-${i})`}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                fill="none"
                />
            );
            })}

            {/* Interior + textos */}
            <circle cx={cx} cy={cy} r={r - strokeWidth * 2.1} className={styles.inner} />
            <g className={styles.labels} transform={`translate(${cx}, ${cy - 10})`}>
                <text className={styles.label} textAnchor="middle" y={-5}>
                    {name}
                </text>
                <text className={styles.valueText} textAnchor="middle" y={30}>
                    {Math.round(v)}
                </text>
                <text className={styles.unit} textAnchor="middle" y={60}>
                    {displayUnits}
                </text>
            </g>
        </svg>
        </div>
    );
};
