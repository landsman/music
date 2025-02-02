/**
 * get last.fm username from request body post-request
 */
export async function getLastFmUser(req: Request, fallbackTo: string) {
  const body = await req.json();
  if (body === undefined || body === null) {
    throw new Error("Request missing request body");
  }
  return typeof body.lastFmUser === "string" ? body.lastFmUser : fallbackTo;
}
