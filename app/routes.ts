import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/Home.tsx"),
  route("ukulele", "routes/UkulelePage.tsx"),
  route("ukulele-chords", "routes/UkuleleChordsHomePage.tsx"),
  route("piano-chord-cheatsheet ", "routes/PianoChordsCheatsheetPage.tsx"),
] satisfies RouteConfig;

