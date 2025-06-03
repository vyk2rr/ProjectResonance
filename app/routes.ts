import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/Home.tsx"),
  route("ukulele", "routes/UkulelePage.tsx"),
  route("ukulele_chords", "routes/UkuleleChordsHomePage.tsx"),
] satisfies RouteConfig;

