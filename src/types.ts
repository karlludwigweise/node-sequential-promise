export type RunSequenceStep = () => Promise<boolean>;

export interface RunSequenceResult {
  success: boolean;
  started: number[];
  fulfilled: number[];
  error?: string | Error;
}
