import useADJStore from "../store/store";
import type { MeasurementId } from "../types/adj";
import type { MeasurementValue } from "../types/adj/api/packet-update.interface";

export function useMeasurementUpdate(measurementId: MeasurementId): MeasurementValue | undefined {
    return useADJStore((state) => state.metricsUpdates[measurementId]);
}
