import { generateMockTest } from "./lib/test-generator";
import { db } from "./lib/db";

export async function POST(req: Request) {
  const config = await req.json();

  const questions = await generateMockTest(config);

  const testId = crypto.randomUUID();

  await db.insertTest(testId, config, questions);

  return Response.json({ testId });
}
