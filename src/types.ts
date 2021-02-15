export type RunSequenceStep = () => Promise<void | RunSequenceError>;

export interface RunSequenceResult {
  success: boolean;
  started: number[];
  fulfilled: number[];
  error?: RunSequenceError;
}

export type RunSequenceError = string | Error;
