$ErrorActionPreference = 'Stop'
Push-Location $PSScriptRoot
try {
  if (-not (Test-Path -LiteralPath '.env') -or -not (Test-Path -LiteralPath 'secrets/owner_config')) {
    throw 'Run scripts/nas-configure.mjs from the repository root first.'
  }
  $composeArguments = @('compose')
  if ((Get-Item -LiteralPath 'secrets/tunnel_token').Length -gt 0) { $composeArguments += @('--profile', 'tunnel') }
  & docker @composeArguments config --quiet
  if ($LASTEXITCODE -ne 0) { throw 'Docker configuration validation failed.' }
  if ($env:DATACLOUD_NO_PULL -ne '1') {
    & docker @composeArguments pull
    if ($LASTEXITCODE -ne 0) { throw 'Docker image download failed.' }
  }
  & docker @composeArguments up -d --no-build --wait --wait-timeout 180
  if ($LASTEXITCODE -ne 0) { throw 'Docker services did not become ready.' }
  & docker @composeArguments ps
  if ($LASTEXITCODE -ne 0) { throw 'Docker status check failed.' }
} finally { Pop-Location }
