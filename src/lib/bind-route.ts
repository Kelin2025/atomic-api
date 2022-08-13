import { Effect } from "effector";
import { chainRoute, RouteInstance, RouteParamsAndQuery } from "atomic-router";

import { Method } from "../types";
import { chainMethod } from "./chain-method";
import { createApiControls } from "./create-controls";

export const bindRouteApi = <Params>(config: {
  route: RouteInstance<Params>;
  api: {
    [key in Method]?: Effect<RouteParamsAndQuery<Params>, any>;
  };
  controls: ReturnType<typeof createApiControls>;
}) => {
  for (const method in config.api) {
    const apiRoute = chainMethod({
      route: config.route,
      method: method as Method,
      controls: config.controls,
    });
    chainRoute({
      route: apiRoute,
      beforeOpen: config.api[method],
    });
    config.controls.$response.on(
      config.api[method].doneData,
      (prev, next) => next
    );
  }
};
