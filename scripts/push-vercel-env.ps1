# Push Phi Movers Firebase public env vars to Vercel (team-kurchu / phimovers)
# Run once from repo root:  powershell -File scripts/push-vercel-env.ps1
# Requires: npx vercel login + linked project

$ErrorActionPreference = "Stop"
$scope = "team-kurchu"

# Values are read from .env.local — never hardcode secrets in git.
$envFile = Join-Path $PSScriptRoot "..\.env.local"
if (-not (Test-Path $envFile)) { throw ".env.local not found" }

$map = @{}
Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*#' -or $_ -notmatch '=') { return }
  $k, $v = $_.Split('=', 2)
  $map[$k.Trim()] = $v.Trim()
}

$names = @(
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "NEXT_PUBLIC_ADMIN_EMAILS"
)

$targets = @("production", "preview", "development")

foreach ($name in $names) {
  if (-not $map.ContainsKey($name) -or -not $map[$name]) {
    Write-Warning "Missing $name in .env.local — skip"
    continue
  }
  foreach ($t in $targets) {
    Write-Host "→ $name [$t]"
    $map[$name] | & npx --yes vercel env add $name $t --scope $scope --force
  }
}

Write-Host "`nDone. Add FIREBASE_SERVICE_ACCOUNT_JSON manually in Vercel (JSON secret)."
Write-Host "Then redeploy: npx vercel --prod --scope $scope"
