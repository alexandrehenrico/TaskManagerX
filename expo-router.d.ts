import { ExpoRouter } from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/activities` | `/(tabs)/people` | `/(tabs)/settings` | `/activities` | `/details/activity/[id]` | `/details/person/[id]` | `/forms/activity` | `/forms/company` | `/forms/person` | `/people` | `/settings` | `/setup/company` | `/setup/welcome` | `/splash`;
      DynamicRoutes: `/details/activity/${ExpoRouter.SingleRoutePart<T>}` | `/details/person/${ExpoRouter.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/details/activity/[id]` | `/details/person/[id]`;
      IsTyped: true;
    }
  }
}