import { createEvent, sample } from "effector";
import { chainRoute, RouteInstance } from "atomic-router";

import { ApiControls, Method } from "../types";

export const chainMethod = <Params>(config: {
  route: RouteInstance<Params>;
  method: Method;
  controls: ApiControls;
}) => {
  const opened = createEvent<any>();
  const passed = createEvent();
  const notPassed = createEvent();

  const $isMatchingMethod = config.controls.$method.map(
    (curMethod) => curMethod === config.method
  );

  sample({
    clock: opened,
    filter: $isMatchingMethod,
    target: passed,
  });

  sample({
    clock: opened,
    filter: $isMatchingMethod.map((isMatchingMethod) => !isMatchingMethod),
    target: notPassed,
  });

  return chainRoute({
    route: config.route,
    beforeOpen: opened,
    openOn: passed,
    cancelOn: notPassed,
  });
};
