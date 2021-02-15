import { RunSequenceError, RunSequenceResult, RunSequenceStep } from "./types";

/**
 * Runs Promises one after the other. Will stop and report, when a Promise fails.
 * @param steps - Array of functions, that return a Promise
 *
 * @link https://github.com/karlludwigweise/node-sequential-promises
 * @example
 * ```typescript
 * const success = () => Promise.resolve();
 * const result = await runSequence([success, success]);
 *
 * // Returns
 * {
 *  success: true,
 *  started: [0, 1],
 *  fulfilled: [0, 1],
 * }
 * ```
 */
export const runSequence = async (steps: RunSequenceStep[]): Promise<RunSequenceResult> => {
  if (steps.length === 0) {
    return Promise.resolve({ success: true, started: [], fulfilled: [] });
  }

  const started: number[] = [];
  const fulfilled: number[] = [];
  let success = false;
  let errorMessage;
  await steps
    .reduce(async (promise: Promise<void | RunSequenceError>, step, i) => {
      try {
        let isOk = false;
        const value = await promise
          .then((resp) => {
            isOk = true;
            return resp;
          })
          .catch((error) => {
            return error;
          });

        if (isOk && !value) {
          // Statistics
          started.push(i);
          if (i - 1 >= 0) {
            fulfilled.push(i - 1);
          }

          // Next Step
          return step();
        } else {
          return Promise.reject(value);
        }
      } catch (error) {
        return Promise.reject(error);
      }
    }, Promise.resolve())
    .then(() => {
      success = true;
    })
    .catch((error) => {
      errorMessage = error;
    });

  // Statistics
  if (success) {
    fulfilled.push(steps.length - 1);
  }

  let result = { success, started, fulfilled, errorMessage };
  if (errorMessage) {
    result = { ...result, errorMessage };
  }
  return Promise.resolve(result);
};
