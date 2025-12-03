# Figma Socket 실행 스크립트
# Bun 경로 설정
$bunPath = "$env:USERPROFILE\.bun\bin\bun.exe"

# Bun이 설치되어 있는지 확인
if (Test-Path $bunPath) {
    Write-Host "Bun을 찾았습니다: $bunPath" -ForegroundColor Green
    
    # cursor-talk-to-figma-socket 실행 시도
    Write-Host "cursor-talk-to-figma-socket 실행 중..." -ForegroundColor Yellow
    & $bunPath x cursor-talk-to-figma-socket
    
    # 위 명령어가 실패하면 cursor-talk-to-figma-mcp 시도
    if ($LASTEXITCODE -ne 0) {
        Write-Host "cursor-talk-to-figma-socket을 찾을 수 없습니다. cursor-talk-to-figma-mcp를 시도합니다..." -ForegroundColor Yellow
        & $bunPath x cursor-talk-to-figma-mcp@latest socket
    }
} else {
    Write-Host "Bun을 찾을 수 없습니다. 설치가 필요합니다." -ForegroundColor Red
    Write-Host "다음 명령어로 Bun을 설치하세요: powershell -c `"irm bun.sh/install.ps1 | iex`"" -ForegroundColor Yellow
}


