interface CronProps {
  projectId: string;
  publishableKey: string;
  edgeFunctionFolderName: string;
  uniqueCronJobName: string;
  cronTabTiming: string;
  body?: object;
  headers?: object;
}

/**
 * Util to easily build type-safe cron syntax.
 */
export function buildCron(props: CronProps): string {
  const {
    projectId,
    publishableKey,
    edgeFunctionFolderName,
    uniqueCronJobName,
    cronTabTiming,
    body,
    headers,
  } = props;

  const finalHeaders = {
    ...{
      "Content-Type": "application/json",
      "Authorization": `Bearer ${publishableKey}`,
    },
    ...headers,
  };
  const finalBody = {
    ...{
      time: "', now(),'",
    },
    ...body,
  };
  return `
select
  cron.schedule(
    '${uniqueCronJobName}',
    '${cronTabTiming}',
    $$
    select
      net.http_post(
          url:='https://${projectId}.supabase.co/functions/v1/${edgeFunctionFolderName}',
          headers:='${JSON.stringify(finalHeaders)}'::jsonb,
          body:=concat('${JSON.stringify(finalBody)}')::jsonb
      ) as request_id;
    $$
  );
`;
}
