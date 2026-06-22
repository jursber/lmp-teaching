param(
    [string]$WorkDir = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
)

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$RelayRoot = $PSScriptRoot
$Inbox = Join-Path $RelayRoot "inbox"
$Processing = Join-Path $RelayRoot "processing"
$Done = Join-Path $RelayRoot "done"
$Failed = Join-Path $RelayRoot "failed"
$Logs = Join-Path $RelayRoot "logs"

foreach ($dir in @($Inbox, $Processing, $Done, $Failed, $Logs)) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

function Write-Banner {
    Clear-Host
    Write-Host "===============================================" -ForegroundColor DarkCyan
    Write-Host " Claude Relay Console" -ForegroundColor Cyan
    Write-Host " WorkDir : $WorkDir" -ForegroundColor Gray
    Write-Host " Inbox   : $Inbox" -ForegroundColor Gray
    Write-Host " Logs    : $Logs" -ForegroundColor Gray
    Write-Host " Press Ctrl+C to stop." -ForegroundColor DarkGray
    Write-Host "===============================================" -ForegroundColor DarkCyan
    Write-Host ""
}

function Invoke-ClaudeTask {
    param(
        [string]$TaskFile
    )

    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $name = [IO.Path]::GetFileNameWithoutExtension($TaskFile)
    $processingFile = Join-Path $Processing "$timestamp-$name.md"
    $logFile = Join-Path $Logs "$timestamp-$name.log"

    Move-Item -LiteralPath $TaskFile -Destination $processingFile -Force
    $prompt = Get-Content -LiteralPath $processingFile -Raw -Encoding UTF8

    Write-Host ""
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Running task: $([IO.Path]::GetFileName($processingFile))" -ForegroundColor Yellow
    Write-Host "Log: $logFile" -ForegroundColor DarkGray
    Write-Host "-----------------------------------------------" -ForegroundColor DarkGray

    Push-Location $WorkDir
    try {
        $args = @("-p", "--permission-mode", "acceptEdits", "--model", "claude-sonnet-4-20250514", $prompt)

        & claude @args 2>&1 | Tee-Object -FilePath $logFile
        $exit = $LASTEXITCODE

        if ($exit -eq 0) {
            Move-Item -LiteralPath $processingFile -Destination (Join-Path $Done ([IO.Path]::GetFileName($processingFile))) -Force
            Write-Host "-----------------------------------------------" -ForegroundColor DarkGray
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Task completed." -ForegroundColor Green
        } else {
            Move-Item -LiteralPath $processingFile -Destination (Join-Path $Failed ([IO.Path]::GetFileName($processingFile))) -Force
            Write-Host "-----------------------------------------------" -ForegroundColor DarkGray
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Task failed. Exit code: $exit" -ForegroundColor Red
        }
    } catch {
        $_ | Out-String | Tee-Object -FilePath $logFile -Append
        if (Test-Path -LiteralPath $processingFile) {
            Move-Item -LiteralPath $processingFile -Destination (Join-Path $Failed ([IO.Path]::GetFileName($processingFile))) -Force
        }
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Task crashed: $($_.Exception.Message)" -ForegroundColor Red
    } finally {
        Pop-Location
    }
}

Write-Banner

while ($true) {
    $task = Get-ChildItem -LiteralPath $Inbox -Filter "*.md" -File |
        Sort-Object LastWriteTime |
        Select-Object -First 1

    if ($task) {
        Invoke-ClaudeTask -TaskFile $task.FullName
        Write-Host ""
        Write-Host "Waiting for next task..." -ForegroundColor DarkGray
    } else {
        Start-Sleep -Seconds 2
    }
}
