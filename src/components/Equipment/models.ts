// Placeholder for the future Equipment module; for now only used to select test equipment
export interface Equipment {
  id: number;
  assetNumber: string;
  description: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  calibrationCertificate?: string;
  calibrationDate?: string; // YYYY/MM/DD
  calibrationDueDate?: string; // YYYY/MM/DD; absent for equipment not requiring calibration
}
