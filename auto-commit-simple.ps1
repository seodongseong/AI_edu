# 간단한 자동 커밋 및 푸시 스크립트
# 이 스크립트를 실행하면 현재 변경사항을 커밋하고 푸시합니다

$repoPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoPath

Write-Host "변경사항 확인 중..." -ForegroundColor Cyan

# 변경사항이 있는지 확인
$status = git status --porcelain
if (-not $status) {
    Write-Host "변경사항이 없습니다." -ForegroundColor Yellow
    exit 0
}

# 모든 변경사항 스테이징
Write-Host "변경사항 스테이징 중..." -ForegroundColor Cyan
git add .

# 커밋 메시지 생성
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$changedFiles = git diff --cached --name-only
$commitMessage = "Auto commit: $timestamp`n`n변경된 파일:`n$($changedFiles -join "`n")"

# 커밋
Write-Host "커밋 중..." -ForegroundColor Cyan
git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "푸시 중..." -ForegroundColor Cyan
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ 자동 커밋 및 푸시 완료!" -ForegroundColor Green
    } else {
        Write-Host "✗ 푸시 실패" -ForegroundColor Red
    }
} else {
    Write-Host "✗ 커밋 실패" -ForegroundColor Red
}


