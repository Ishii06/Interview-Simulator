import { templates } from "./templates";

export function generateAptitude(config) {
  return templates
    .filter(t => t.difficulty === config.difficulty)
    .slice(0, config.aptitudeCount)
    .map(t => t.generate());
}
