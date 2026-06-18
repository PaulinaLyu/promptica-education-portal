import {
  ArticlePage,
  ArticlesPage,
  ExercisePlaygroundPage,
  NotFoundPage,
  UiPlaygroundPage,
} from "@pages";
import { ROUTE_NAMES, ROUTE_PATHS } from "@shared";
import { createRouter, createWebHistory } from "vue-router";
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from "vue-router";

const routes: readonly RouteRecordRaw[] = [
  {
    path: ROUTE_PATHS.home,
    name: ROUTE_NAMES.home,
    component: ArticlesPage,
  },
  {
    path: ROUTE_PATHS.article,
    name: ROUTE_NAMES.article,
    component: ArticlePage,
    props: (route: RouteLocationNormalizedLoaded) => ({
      articleId: String(route.params.id),
    }),
  },
  {
    path: ROUTE_PATHS.uiPlayground,
    name: ROUTE_NAMES.uiPlayground,
    component: UiPlaygroundPage,
  },
  {
    path: ROUTE_PATHS.exercisePlayground,
    name: ROUTE_NAMES.exercisePlayground,
    component: ExercisePlaygroundPage,
  },
  {
    path: ROUTE_PATHS.notFound,
    name: ROUTE_NAMES.notFound,
    component: NotFoundPage,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: ROUTE_PATHS.notFound,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
