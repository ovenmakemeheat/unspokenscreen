import type { Route } from "next";

export const NAV_LINKS: [string, Route][] = [
  ["ปัญหา", "#problem" as Route],
  ["เสียงจากใจ", "#voices" as Route],
  ["ข้อมูล", "#data" as Route],
  ["กำแพงนิรนาม", "/wall"],
];
