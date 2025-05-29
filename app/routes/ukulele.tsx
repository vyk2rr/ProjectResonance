import type { Route } from "./+types/home";
import Ukulele from "../ukulele/ukulele";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "aaaa" },
    { name: "description", content: "aaaaaa" },
  ];
}

export default function UkulelePage() {
  return <Ukulele />;
}
