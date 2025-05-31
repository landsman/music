# Deno Outdated Workflow

This reusable GitHub Actions workflow checks for outdated Deno dependencies in a specified directory and outputs the results.

## Usage

You can use this workflow in your own workflows by calling it as follows:

```yaml
jobs:
  check-outdated:
    steps:
      - uses: actions/checkout@v4

      - name: Check outdated dependencies
        id: outdated
        uses: ./.github/workflows/deno-outdated/action.yml
        with:
          working-directory: path/to/your/deno/project

      # Use the output from the reusable workflow
      - name: Display result
        run: |
          echo "Outdated dependencies result:"
          echo "${{ steps.outdated.outputs.result }}"
```

## Inputs

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `working-directory` | Directory where to run the deno outdated check | Yes | N/A |

## Outputs

| Name | Description |
|------|-------------|
| `result` | Result of the outdated check formatted as a code block |

## Example

see test-web.yml

## How it works

The workflow:

1. Sets up Deno v2.x
2. Changes to the specified working directory
3. Runs the `deno-outdated.sh` script to check for outdated dependencies
4. Outputs the results as a formatted code block

The script removes ANSI color codes from the output and formats it as a code block for better readability in GitHub comments.
