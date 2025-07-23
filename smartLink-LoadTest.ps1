<#
.SYNOPSIS
SmartLink Traffic Pattern Simulator
.DESCRIPTION
Generates 3 traffic patterns for HPA testing without affecting Minikube's CPU
#>

function Start-Traffic {
    param (
        [int]$ThreadsPerPod,
        [int]$DurationMinutes
    )

    # Get all pods
    $pods = kubectl get pods -l app=smartlink -o name

    # Start CPU load
    foreach ($pod in $pods) {
        kubectl exec -it $pod -- sh -c "for i in {1..$ThreadsPerPod}; do while true; do openssl speed -multi 1 >/dev/null 2>&1 & done; done"
    }

    # Monitor
    $endTime = (Get-Date).AddMinutes($DurationMinutes)
    while ((Get-Date) -lt $endTime) {
        Clear-Host
        Write-Host "===== Traffic Pattern Active ($ThreadsPerPod threads/pod) =====" -ForegroundColor Cyan
        Write-Host "`n[ POD CPU USAGE ]" -ForegroundColor Yellow
        kubectl top pods
        Write-Host "`n[ HPA STATUS ]" -ForegroundColor Yellow
        kubectl get hpa
        Write-Host "`nRemaining: $([math]::Round(($endTime - (Get-Date)).TotalMinutes, 1)) minutes"
        Start-Sleep -Seconds 5
    }

    # Cleanup
    foreach ($pod in $pods) {
        kubectl exec -it $pod -- pkill openssl
    }
    Start-Sleep -Seconds 10  # Allow metrics to stabilize
}

function Show-Menu {
    Clear-Host
    Write-Host "===== SmartLink Traffic Simulator =====" -ForegroundColor Magenta
    Write-Host "1. Normal Traffic (No scaling)" -ForegroundColor Green
    Write-Host "   - 1 thread/pod (~10% CPU)"
    Write-Host "2. Small Spike (Scale to 2 pods)" -ForegroundColor Yellow
    Write-Host "   - 3 threads/pod (~30% CPU)"
    Write-Host "3. Heavy Traffic (Scale to 4-6 pods)" -ForegroundColor Red
    Write-Host "   - 6 threads/pod (~60% CPU)"
    Write-Host "4. Stop All Traffic" -ForegroundColor Gray
    Write-Host "Q. Quit`n"
}

# Main execution
while ($true) {
    Show-Menu
    $choice = Read-Host "Select pattern (1-4/Q)"

    switch ($choice) {
        '1' { Start-Traffic -ThreadsPerPod 1 -DurationMinutes 1 }
        '2' { Start-Traffic -ThreadsPerPod 3 -DurationMinutes 1 }
        '3' { Start-Traffic -ThreadsPerPod 6 -DurationMinutes 1 }
        '4' { 
            kubectl get pods -l app=smartlink -o name | ForEach-Object {
                kubectl exec -it $_ -- pkill openssl
            }
            Write-Host "All traffic stopped" -ForegroundColor Green
            Start-Sleep -Seconds 3
        }
        'Q' { exit }
        default { Write-Host "Invalid option" -ForegroundColor Red; Start-Sleep -Seconds 1 }
    }
}