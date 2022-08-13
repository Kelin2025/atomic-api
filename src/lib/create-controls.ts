import { createStore } from "effector";

import { Method } from "../types";

export const createApiControls = () => {
  return {
    $method: createStore<Method>("GET"),
    $response: createStore<any>(null),
  };
};
