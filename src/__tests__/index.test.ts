import { runSequence } from "../index";
import { RunSequenceStep } from "../types";

const success: RunSequenceStep = () => Promise.resolve(true);
const failureSoft: RunSequenceStep = () => Promise.reject(false);
const failureHard: RunSequenceStep = () => Promise.reject("Something went wrong!");

test("should run through all successful promises", async () => {
  const expected = {
    success: true,
    started: [0, 1, 2],
    fulfilled: [0, 1, 2],
  };
  const received = await runSequence([success, success, success]);
  expect(received).toEqual(expected);
});

test("should stop with an error message, when rejected", async () => {
  const expected = {
    success: false,
    started: [0, 1],
    fulfilled: [0],
    errorMessage: "Something went wrong!",
  };
  const received = await runSequence([success, failureHard, success]);
  expect(received).toEqual(expected);
});

test("should stop without an error message, when false", async () => {
  const expected = {
    success: false,
    started: [0, 1],
    fulfilled: [0],
    errorMessage: false,
  };
  const received = await runSequence([success, failureSoft, success]);
  expect(received).toEqual(expected);
});
