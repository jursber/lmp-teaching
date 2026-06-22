# Claude Relay

This folder contains a small visible relay console for running Claude CLI tasks from this workspace.

## Start

From `E:\Codes\LMP`:

```powershell
Start-Process powershell -ArgumentList '-NoExit','-ExecutionPolicy','Bypass','-File','.agents\claude-relay\relay.ps1' -WorkingDirectory 'E:\Codes\LMP'
```

## Submit A Task

```powershell
.\.agents\claude-relay\submit.ps1 -Name "fix-review-items" -Prompt "Your Claude task prompt here"
```

The visible relay window watches `inbox/`, runs `claude -p` for each task, and writes output to `logs/`.

## Notes

- This relay is for local collaboration only.
- It does not store API keys.
- Stop it with `Ctrl+C` in the relay window.
