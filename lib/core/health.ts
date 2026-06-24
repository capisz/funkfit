// Ported (trimmed) from elephit @elephit/core. Only the daily metrics shape is
// needed in the app; the provider abstraction is replaced by manual entry.
export type HealthMetricSource = 'manual' | 'healthkit' | 'activity-level';

export interface DailyHealthMetrics {
  date: string;
  weightKg?: number;
  activeEnergyKcal?: number;
  restingEnergyKcal?: number;
  steps?: number;
  distanceWalkingRunningKm?: number;
  exerciseMinutes?: number;
  source: HealthMetricSource;
  syncedAt?: string;
}
