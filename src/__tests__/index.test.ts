import { runSequence } from "../index";
import { RunSequenceStep } from "../types";

const success: RunSequenceStep = () => Promise.resolve(true);
const failure: RunSequenceStep = () => Promise.reject("Something went wrong!");

test("should run through all successful promises", async () => {
  const expected = {
    success: true,
    started: [0, 1, 2],
    fulfilled: [0, 1, 2],
    error: undefined,
  };
  const received = await runSequence([success, success, success]);
  expect(received).toEqual(expected);
});

test("should stop with an error message", async () => {
  const expected = {
    success: false,
    started: [0, 1],
    fulfilled: [0],
    error: "Something went wrong!",
  };
  const received = await runSequence([success, failure, success]);
  expect(received).toEqual(expected);
});
