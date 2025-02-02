/**
 * get last.fm username from request body post-request
 */
export async function getLastFmUser(req: Request) {
  const body = await req.json();
  return typeof body.lastFmUser === "string" ? body.lastFmUser : null;
}
