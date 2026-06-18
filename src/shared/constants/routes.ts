export const ROUTE_NAMES = {
  home: "home",
  article: "article",
  uiPlayground: "ui-playground",
  exercisePlayground: "exercise-playground",
  notFound: "not-found",
} as const;

export const ROUTE_PATHS = {
  home: "/",
  article: "/articles/:id",
  uiPlayground: "/ui-playground",
  exercisePlayground: "/exercise-playground",
  notFound: "/404",
} as const;

export const buildArticlePath = (id: string): string => `/articles/${encodeURIComponent(id)}`;
