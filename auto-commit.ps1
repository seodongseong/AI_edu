# DS Studio - 자동 커밋 및 푸시 스크립트
# 파일 변경을 감지하여 자동으로 커밋하고 푸시합니다

$repoPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$gitPath = Join-Path $repoPath ".git"

# Git 저장소인지 확인
if (-not (Test-Path $gitPath)) {
    Write-Host "오류: Git 저장소가 아닙니다." -ForegroundColor Red
    exit 1
}

# 변경사항 확인 함수
function Test-GitChanges {
    Set-Location $repoPath
    $status = git status --porcelain
    return $status -ne $null -and $status.Length -gt 0
}

# 커밋 및 푸시 함수
function Commit-AndPush {
    Set-Location $repoPath
    
    # 변경된 파일 목록 가져오기
    $changedFiles = git status --porcelain | ForEach-Object { ($_ -split '\s+')[1] }
    
    if ($changedFiles.Count -eq 0) {
        Write-Host "변경사항이 없습니다." -ForegroundColor Yellow
        return
    }
    
    # 모든 변경사항 스테이징
    git add .
    
    # 커밋 메시지 생성
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
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
        Write-Host "✗ 커밋 실패 (변경사항이 없거나 이미 커밋됨)" -ForegroundColor Yellow
    }
}

# 파일 감시 설정
Write-Host "파일 감시 시작... (Ctrl+C로 종료)" -ForegroundColor Green
Write-Host "저장소 경로: $repoPath" -ForegroundColor Gray

# FileSystemWatcher 생성
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $repoPath
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

# .git 폴더 제외
$watcher.Filter = "*.*"

# 변경 이벤트 핸들러
$action = {
    $path = $Event.SourceEventArgs.FullPath
    
    # .git 폴더나 자동 커밋 스크립트는 제외
    if ($path -like "*\.git\*" -or $path -like "*auto-commit.ps1") {
        return
    }
    
    Write-Host "`n파일 변경 감지: $path" -ForegroundColor Yellow
    
    # 짧은 딜레이 후 커밋 (여러 파일이 동시에 변경될 수 있음)
    Start-Sleep -Seconds 2
    
    # 중복 실행 방지
    if (-not $script:isCommitting) {
        $script:isCommitting = $true
        Commit-AndPush
        $script:isCommitting = $false
    }
}

# 이벤트 등록
Register-ObjectEvent -InputObject $watcher -EventName "Changed" -Action $action | Out-Null
Register-ObjectEvent -InputObject $watcher -EventName "Created" -Action $action | Out-Null
Register-ObjectEvent -InputObject $watcher -EventName "Deleted" -Action $action | Out-Null
Register-ObjectEvent -InputObject $watcher -EventName "Renamed" -Action $action | Out-Null

# 무한 대기
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    $watcher.EnableRaisingEvents = $false
    $watcher.Dispose()
    Write-Host "`n파일 감시 종료" -ForegroundColor Yellow
}


