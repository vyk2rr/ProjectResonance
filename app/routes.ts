import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("ukulele", "routes/ukulele.tsx"),
  route("ukulele_chords", "routes/ukulele_chords.tsx"),
] satisfies RouteConfig;

