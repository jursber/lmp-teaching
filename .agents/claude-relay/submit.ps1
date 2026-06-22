param(
    [Parameter(Mandatory = $true)]
    [string]$Prompt,

    [string]$Name = "task"
)

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$RelayRoot = $PSScriptRoot
$Inbox = Join-Path $RelayRoot "inbox"
New-Item -ItemType Directory -Force -Path $Inbox | Out-Null

$safeName = ($Name -replace "[^a-zA-Z0-9._-]", "-").Trim("-")
if (-not $safeName) {
    $safeName = "task"
}

$file = Join-Path $Inbox ("{0}-{1}.md" -f (Get-Date -Format "yyyyMMdd-HHmmss"), $safeName)
Set-Content -LiteralPath $file -Value $Prompt -Encoding UTF8
Write-Host $file
