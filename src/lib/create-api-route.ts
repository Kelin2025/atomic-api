import { createRoute, RouteInstance, RouteParamsAndQuery } from "atomic-router";
import { attach, Effect, is } from "effector";

import { bindRouteApi } from "./bind-route";
import { ApiControls, Method } from "../types";

type Props<Params> = {
  route?: RouteInstance<Params>;
  controls: ApiControls;
  api: {
    [key in Method]?:
      | Effect<RouteParamsAndQuery<Params>, any>
      | ((params: RouteParamsAndQuery<Params>) => any);
  };
};

export const createApiRoute = <Params>(props: Props<Params>) => {
  const route = props.route || createRoute<Params>();

  type Api = typeof props["api"];

  const api: {
    [key in keyof Api]: Effect<RouteParamsAndQuery<Params>, any>;
  } = {};
  for (const method in props.api) {
    if (is.effect(props.api[method])) {
      api[method] = props.api[method];
    } else {
      api[method] = attach({
        effect: props.api[method],
      });
    }
  }

  bindRouteApi({
    route,
    controls: props.controls,
    api,
  });

  return {
    route,
    api,
  };
};
