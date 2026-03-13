# Self-Hosted GitHub Actions Runner

Deployments run on a self-hosted GitHub Actions runner on a Raspberry Pi 5 instead of GitHub-hosted `ubuntu-latest`.

The runner setup lives in a separate repository:
**https://github.com/landsman/raspberry-pi/tree/main/github-runner**

## How it works

An ephemeral `supabase-runner` Docker container registers with GitHub, picks up one job, and exits. 
Docker Compose restarts it immediately so the next job has a clean environment. 
Nothing is installed on the Pi itself — only Docker is required.

## Workflow configuration

Jobs targeting this runner use:

```yaml
runs-on: [self-hosted, pi5]
```

## Security hardening

### What is already in place

- **Ephemeral containers** — every job gets a fresh container, no state or secrets leak between runs
- **`environment: production`** — GitHub holds secrets behind a required reviewer approval gate before releasing them to the job
- **`permissions: contents: read`** — `GITHUB_TOKEN` is restricted to read-only at the workflow level
- **No `docker.sock` mount** — the runner container cannot escape to the Pi host via the Docker daemon

### GitHub repository settings to keep configured

| Setting                      | Location                                            | Value                                          |
|------------------------------|-----------------------------------------------------|------------------------------------------------|
| Fork PR workflow approvals   | Settings → Actions → General                        | Require approval for all outside collaborators |
| Environment protection rule  | Settings → Environments → production                | Add yourself as required reviewer              |
| Default workflow permissions | Settings → Actions → General → Workflow permissions | Read repository contents only                  |

### Known remaining risks

- **Floating action tags** — `actions/checkout@v6` and `supabase/setup-cli@v1` resolve to whatever commit the tag points to at run time. If those repos were compromised, malicious code could run on the Pi. Pinning to full commit SHAs (e.g. `actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683`) eliminates this at the cost of manual update overhead.
- **Public repository** — GitHub warns that forks of public repos can open PRs that trigger workflows on self-hosted runners. The environment approval gate above mitigates this, but making the repo private removes the risk entirely.
