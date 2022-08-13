# Atomic API

**WARNING: This is Work-In-Progress!**

Use [atomic-router](https://atomic-router.github.io) as your router for Node.js backend

## Install

```bash
npm install atomic-router atomic-api
```

## Usage

1. Create API controls

```tsx
// @/shared/api
import { createApiControls } from "atomic-api";

// Returns { $method, $response } stores
export const apiControls = createApiControls();
```

2. Create API route

```tsx
// @/routes/post
import { createApiRoute } from "atomic-api";

import { apiControls } from "@/shared/api";

export type PostParams = {
  postId: string;
};

export const post = createApiRoute({
  controls: apiControls,
  api: {
    GET: ({ params }) => {
      return {
        id: params.postId,
        title: "Some Post",
      };
    },
  },
});

// `createApiRoute` returns this
post.route; // Route created by atomic-router
post.api.GET; // Effect<RouteParamsAndQuery<PostParams>, ...>
```

3. Create a router

```tsx
// @/app/router
import { createHistoryRouter } from "atomic-router";

import { post } from "@/routes/post";

export const routes = [{ path: "/posts/:postId", route: post.route }];

export const router = createHistoryRouter({
  routes,
});
```

4. Create a server

```tsx
// @/app/server
import { createHttpServer } from "atomic-api";

import { router } from "@/app/router";
import { apiControls } from "@/shared/api";

export const server = createHttpServer({
  router,
  controls: apiControls,
});

server.listen(3002);
```

## How does it work?

1. `createHttpServer` starts a server (via `http.createServer`)
2. On each request:  
   2.1. Trigger `fork` and creates a new `scope`
   2.2. Store `req.method` in `apiControls.$method`
   2.3. Create `history` instance and pushes `req.url` to it
   2.4. Trigger `router.setHistory` with a passed `scope`
   2.5. Router opens matched route
   2.6. Check `apiControls.$method` and open matching sub-route (created by `chainRoute`)
   2.7. Trigger effect and wait until it's finished
   2.8. `effect.doneData` writes its response to `apiControls.$response`
   2.9. Trigger `res.send` with `apiControls.$response` data

## TODO:

- [ ] Actually send response
- [ ] Pass req/res instance to effects
- [ ] Redirects
