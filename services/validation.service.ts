import { validation, validationKeys } from "../client/src/validation";

export function checkValidation(
  validationKey: (typeof validationKeys)[number],
  value: string
) {
  if (
    value.length < validation[validationKey].min ||
    value.length > validation[validationKey].max
  ) {
    throw new Error(`Validation failed: ${validationKey} length`);
  }
  if (value !== value.replace(validation[validationKey].regex, "")) {
    throw new Error(`Validation failed: ${validationKey} regex`);
  }
}
