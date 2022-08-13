import http from "http";
import { createHistoryRouter } from "atomic-router";
import { createMemoryHistory } from "history";
import { allSettled, createEvent, fork } from "effector";

import { ApiControls, Method } from "../types";

type Props = {
  router: ReturnType<typeof createHistoryRouter>;
  controls: ApiControls;
  debug?: boolean;
};

export const createHttpServer = ({ router, controls, debug }: Props) => {
  const setMethod = createEvent<Method>();
  controls.$method.on(setMethod, (prev, next) => next);

  const server = http.createServer(async (req, res) => {
    if (debug) {
      console.log(req.method, req.url);
    }
    const history = createMemoryHistory();
    history.push(req.url);
    const scope = fork();
    await allSettled(setMethod, {
      scope,
      params: req.method,
    });
    await allSettled(router.setHistory, {
      scope,
      params: history,
    });
    if (debug) {
      console.log(scope.getState(controls.$response));
    }
  });
  return server;
};
