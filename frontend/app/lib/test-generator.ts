import { generateAptitude } from "./aptitude/generator";
import { generateTechnical } from "./technical/generator";

export async function generateMockTest(config) {
  const aptitudeQs = generateAptitude(config);
  const technicalQs = await generateTechnical(config);

  return [...aptitudeQs, ...technicalQs];
}
