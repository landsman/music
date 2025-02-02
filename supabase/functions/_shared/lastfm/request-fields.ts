/**
 * get last.fm username from request body post-request
 */
export async function getLastFmUser(req: Request, fallbackTo: string) {
  const body = await req.json();
  return typeof body.lastFmUser === "string" ? body.lastFmUser : fallbackTo;
}
