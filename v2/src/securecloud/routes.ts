export const secureCloudRoutes = {
  home: "/",
  datasets: "/datasets",
  keys: "/keys",
  encrypt: "/encrypt",
  send: "/send",
  compute: "/compute",
  result: "/result",
} as const;

export type SecureCloudRoute = (typeof secureCloudRoutes)[keyof typeof secureCloudRoutes];
