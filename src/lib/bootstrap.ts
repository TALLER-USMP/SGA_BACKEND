import { MetadataStore } from "./metadatastore";
import { RouteDefinition } from "./decorators";
import { app } from "@azure/functions";

export function bootstrapApp(application: typeof app) {
  const controllers =
    Reflect.getMetadata("controller:class", MetadataStore) || [];
  for (const Controller of controllers) {
    const prefix = Reflect.getMetadata("controller:prefix", Controller);
    const controller = new Controller();
    const routes: RouteDefinition[] =
      Reflect.getMetadata("controller:routes", Controller) || [];

    for (const route of routes) {
      application.http(`${prefix}_${route.handlerKey}`, {
        methods: [route.method],
        route: `${prefix}${route.path}`,
        handler: controller[route.handlerKey].bind(controller),
      });
    }
  }
}
