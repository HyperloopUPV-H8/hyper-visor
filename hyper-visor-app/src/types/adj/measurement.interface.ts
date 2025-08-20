export interface Measurement {
    id: MeasurementId;
    name: MeasurementName;
    type: MeasurementType;
    podUnits: MeasurementPodUnits;
    displayUnits: MeasurementDisplayUnits;
}

export interface NumericMeasurement extends Measurement {
    safeRange: [number, number];
    warningRange: [number, number];
}

export interface EnumMeasurement extends Measurement {
    enumValues: string[];
}

export type MeasurementId = string;
export type MeasurementName = string;
export type MeasurementType =
    | 'uint8'
    | 'uint16'
    | 'uint32'
    | 'uint64'
    | 'int8'
    | 'int16'
    | 'int32'
    | 'int64'
    | 'float32'
    | 'float64'
    | 'string'
    | 'bool'
    | 'enum';
export type MeasurementPodUnits = string;
export type MeasurementDisplayUnits = string;