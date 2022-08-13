import { Store } from "effector";

export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";

export type ApiControls = {
  $method: Store<Method>;
  $response: Store<any>;
};
