# ============================================================
#  serve.ps1 - May chu xem thu tai cho
#
#  Trinh duyet chan viec doc file .md/.json khi ban mo index.html
#  bang cach nhap dup (giao thuc file://). Script nay dung mot may chu
#  nho ngay tren may ban de xem thu cho dung.
#
#  Cach dung: nhap chuot phai vao file nay > Run with PowerShell
#  Hoac mo PowerShell tai thu muc nay va go:  .\serve.ps1
#  Dung lai: bam Ctrl+C
# ============================================================

param(
    [int]$Port = 8080
)

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
if (-not $root) { $root = (Get-Location).Path }

$mime = @{
    '.html' = 'text/html; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.md'   = 'text/markdown; charset=utf-8'
    '.txt'  = 'text/plain; charset=utf-8'
    '.svg'  = 'image/svg+xml'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.gif'  = 'image/gif'
    '.webp' = 'image/webp'
    '.avif' = 'image/avif'
    '.ico'  = 'image/x-icon'
    '.woff' = 'font/woff'
    '.woff2'= 'font/woff2'
    '.mp4'  = 'video/mp4'
    '.webm' = 'video/webm'
    '.mp3'  = 'audio/mpeg'
    '.pdf'  = 'application/pdf'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")

try {
    $listener.Start()
}
catch {
    Write-Host ""
    Write-Host "  Khong mo duoc cong $Port." -ForegroundColor Red
    Write-Host "  Co the cong dang bi chuong trinh khac dung. Thu cong khac:" -ForegroundColor Yellow
    Write-Host "      .\serve.ps1 -Port 8081" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Chi tiet loi: $($_.Exception.Message)" -ForegroundColor DarkGray
    Write-Host ""
    Read-Host "  Bam Enter de dong"
    exit 1
}

Write-Host ""
Write-Host "  Website dang chay tai:  http://localhost:$Port" -ForegroundColor Green
Write-Host "  Thu muc goc:            $root" -ForegroundColor DarkGray
Write-Host "  Bam Ctrl+C de dung." -ForegroundColor DarkGray
Write-Host ""

# Tu mo trinh duyet
try { Start-Process "http://localhost:$Port/" } catch { }

try {
    while ($listener.IsListening) {
        $context  = $listener.GetContext()
        $request  = $context.Request
        $response = $context.Response

        # Duong dan yeu cau -> duong dan file tren dia
        $relative = [System.Uri]::UnescapeDataString($request.Url.AbsolutePath).TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($relative)) { $relative = 'index.html' }
        $relative = $relative -replace '/', '\'

        $full = Join-Path $root $relative

        # Chan truy cap ra ngoai thu muc goc
        $rootFull = [System.IO.Path]::GetFullPath($root)
        try { $fullResolved = [System.IO.Path]::GetFullPath($full) } catch { $fullResolved = $rootFull }

        if (-not $fullResolved.StartsWith($rootFull, [System.StringComparison]::OrdinalIgnoreCase)) {
            $response.StatusCode = 403
            $response.Close()
            continue
        }

        if ((Test-Path $fullResolved -PathType Container)) {
            $fullResolved = Join-Path $fullResolved 'index.html'
        }

        if (Test-Path $fullResolved -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($fullResolved).ToLower()
            $type = $mime[$ext]
            if (-not $type) { $type = 'application/octet-stream' }

            $bytes = [System.IO.File]::ReadAllBytes($fullResolved)
            $response.StatusCode = 200
            $response.ContentType = $type
            $response.Headers.Add('Cache-Control', 'no-store')
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            Write-Host ("  200  /" + $relative.Replace('\','/')) -ForegroundColor DarkGray
        }
        else {
            $body = [System.Text.Encoding]::UTF8.GetBytes(
                "<!doctype html><meta charset='utf-8'><title>404</title>" +
                "<body style='font-family:system-ui;padding:60px'>" +
                "<h1>404</h1><p>Khong tim thay: /" + $relative.Replace('\','/') + "</p>" +
                "<p><a href='/'>Ve trang chu</a></p>")
            $response.StatusCode = 404
            $response.ContentType = 'text/html; charset=utf-8'
            $response.ContentLength64 = $body.Length
            $response.OutputStream.Write($body, 0, $body.Length)
            Write-Host ("  404  /" + $relative.Replace('\','/')) -ForegroundColor DarkYellow
        }

        $response.Close()
    }
}
finally {
    $listener.Stop()
    $listener.Close()
    Write-Host ""
    Write-Host "  Da dung may chu." -ForegroundColor DarkGray
}
