import { sum } from "../index";

test("sum must be right", () => {
  expect(sum(2, 5)).toBe(7);
});
