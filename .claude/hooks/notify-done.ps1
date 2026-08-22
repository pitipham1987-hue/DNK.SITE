Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$notify = New-Object System.Windows.Forms.NotifyIcon
$notify.Icon = [System.Drawing.SystemIcons]::Information
$notify.BalloonTipIcon = [System.Windows.Forms.ToolTipIcon]::Info
$notify.BalloonTipTitle = "Claude Code"
$notify.BalloonTipText = "Claude Code cần ông chủ kiểm tra"
$notify.Visible = $true
$notify.ShowBalloonTip(5000)

Start-Sleep -Seconds 3
$notify.Dispose()