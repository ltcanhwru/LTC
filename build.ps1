# ============================================================
#  build.ps1 - Sinh trang tinh cho tung bai viet, kem sitemap
#
#  VI SAO CAN SCRIPT NAY
#  Toan bo noi dung website duoc JavaScript nap vao luc chay. Voi trinh duyet
#  thi khong sao, nhung cong cu tim kiem va o xem truoc khi chia se link
#  (Facebook, Zalo, Messenger) phan lon KHONG chay JavaScript - chung chi doc
#  HTML tho. Truoc khi co script nay, moi bai viet deu tra ve
#  <title>Dang tai...</title> va khong con gi khac.
#
#  SCRIPT NAY SINH RA
#    bai\<slug>.html  moi bai mot file, co san tieu de, mo ta, anh bia va cac
#                     the og: ngay trong HTML
#    sitemap.xml      danh sach dia chi de khai bao voi cong cu tim kiem
#    robots.txt       tro toi sitemap
#
#  CACH DUNG
#  Nhap chuot phai vao file nay > Run with PowerShell. Hoac mo PowerShell tai
#  thu muc nay va go:  .\build.ps1
#
#  CHAY LAI moi khi dang bai moi, hoac khi sua tieu de / mo ta / anh bia
#  trong posts.json - roi moi git push.
#
#  GHI CHU KY THUAT
#  Script co tinh khong dung ky tu tieng Viet nao trong ma nguon. PowerShell
#  5.1 doc file .ps1 theo bang ma he thong neu file khong co dau BOM, nen chu
#  co dau viet thang vao day rat de bi hong. Moi chuoi tieng Viet deu duoc doc
#  tu posts.json va config.js (dung -Encoding UTF8), khong viet cung o day.
# ============================================================

param(
    # Dia chi goc cua website tren mang. Doi tai day neu ban chuyen ten mien.
    [string]$BaseUrl = 'https://ltcanhwru.github.io/LTC'
)

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
if (-not $root) { $root = (Get-Location).Path }

$BaseUrl = $BaseUrl.TrimEnd('/')
$BaiDir  = Join-Path $root 'bai'
$EmDash  = [char]0x2014   # dau gach ngang dai, dung ngan tieu de bai voi ten site

# ---------- Tien ich ----------

# Ghi file UTF-8 khong kem BOM. Set-Content cua PowerShell 5.1 hay tu them BOM,
# ma BOM lam ban dau file XML, nen phai ghi tay bang .NET.
function Write-Utf8 {
    param([string]$Path, [string]$Text)
    $enc = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($Path, $Text, $enc)
}

# Thoat ky tu dac biet de nhet an toan vao HTML va XML
function Esc {
    param([string]$s)
    if ($null -eq $s) { return '' }
    return $s.Replace('&', '&amp;').Replace('<', '&lt;').Replace('>', '&gt;').Replace('"', '&quot;')
}

# Thay mot doan nam giua hai dau moc. Dung MatchEvaluator de ky tu $ trong
# tieu de bai khong bi PowerShell hieu nham thanh nhom bat trong regex.
function Replace-Block {
    param([string]$Html, [string]$Marker, [string]$New)
    $pattern = '(?s)<!-- ' + $Marker + ' -->.*?<!-- /' + $Marker + ' -->'
    return [regex]::Replace($Html, $pattern, { param($m) $New })
}

# ---------- Doc du lieu ----------

$jsonPath = Join-Path $root 'posts\posts.json'
$tplPath  = Join-Path $root 'post.html'
$cfgPath  = Join-Path $root 'js\config.js'

if (-not (Test-Path $jsonPath)) { throw "Khong tim thay $jsonPath" }
if (-not (Test-Path $tplPath))  { throw "Khong tim thay $tplPath" }

$posts = Get-Content -Raw -Encoding UTF8 $jsonPath | ConvertFrom-Json
$tpl   = Get-Content -Raw -Encoding UTF8 $tplPath

if ($tpl -notmatch '<!-- build:meta -->') {
    throw "post.html thieu dau moc <!-- build:meta -->. Xem lai phan dau file."
}

# Ten site lay tu dong title dau tien trong config.js, de khong phai khai bao
# hai noi. Trong config.js, title cua site nam truoc title cua cac cuon sach.
$siteName = 'Blog'
if (Test-Path $cfgPath) {
    $cfg = Get-Content -Raw -Encoding UTF8 $cfgPath
    $m = [regex]::Match($cfg, "title:\s*'([^']*)'")
    if ($m.Success) { $siteName = $m.Groups[1].Value }
}
$eSite = Esc $siteName

# Bo bai nhap va bai thieu slug, roi xep bai moi len truoc
$posts = @($posts | Where-Object { $_ -and $_.slug -and $_.draft -ne $true } |
           Sort-Object -Property date -Descending)

if ($posts.Count -eq 0) { throw "posts.json khong co bai nao de dung" }

# ---------- Don thu muc bai\ ----------
# Xoa het roi sinh lai, de bai da go khoi posts.json khong con file mo coi

if (Test-Path $BaiDir) {
    Remove-Item (Join-Path $BaiDir '*.html') -Force -ErrorAction SilentlyContinue
} else {
    New-Item -ItemType Directory -Path $BaiDir | Out-Null
}

# ---------- Sinh tung trang ----------

foreach ($p in $posts) {
    $slug     = [string]$p.slug
    $eTitle   = Esc ([string]$p.title)
    $eExcerpt = Esc ([string]$p.excerpt)
    $url      = "$BaseUrl/bai/$slug.html"

    # Cac the doc duoc ma khong can chay JavaScript.
    # <base href="../"> cho phep moi duong dan tuong doi trong trang (css, js,
    # posts/...) van tinh tu thu muc goc, du file nay nam trong bai\.
    $lines = New-Object System.Collections.Generic.List[string]
    $lines.Add('  <base href="../">')
    $lines.Add("  <title>$eTitle $EmDash $eSite</title>")
    $lines.Add("  <meta name=""description"" content=""$eExcerpt"">")
    $lines.Add("  <link rel=""canonical"" href=""$url"">")
    $lines.Add('  <meta property="og:type" content="article">')
    $lines.Add("  <meta property=""og:site_name"" content=""$eSite"">")
    $lines.Add('  <meta property="og:locale" content="vi_VN">')
    $lines.Add("  <meta property=""og:title"" content=""$eTitle"">")
    $lines.Add("  <meta property=""og:description"" content=""$eExcerpt"">")
    $lines.Add("  <meta property=""og:url"" content=""$url"">")

    if ($p.cover) {
        $img = Esc "$BaseUrl/$($p.cover)"
        $lines.Add("  <meta property=""og:image"" content=""$img"">")
        $lines.Add('  <meta name="twitter:card" content="summary_large_image">')
    } else {
        $lines.Add('  <meta name="twitter:card" content="summary">')
    }
    $lines.Add("  <meta name=""twitter:title"" content=""$eTitle"">")
    $lines.Add("  <meta name=""twitter:description"" content=""$eExcerpt"">")
    if ($p.date) {
        $lines.Add("  <meta property=""article:published_time"" content=""$($p.date)"">")
    }

    $html = Replace-Block $tpl 'build:meta' ($lines -join "`r`n")

    # Ghi slug vao the body de post.js biet phai tai bai nao
    $html = $html.Replace('<body>', "<body data-slug=""$slug"">")

    # Tieu de va doan dan that, thay cho dong chu "Dang tai bai viet".
    # post.js se ve lai khoi nay khi chay xong, nen ban tinh o day chi phuc vu
    # cong cu chi doc HTML tho.
    $head = "<h1>$eTitle</h1>"
    if ($eExcerpt) { $head += "`r`n        <p class=""article-lead"">$eExcerpt</p>" }
    $html = Replace-Block $html 'build:head' $head

    Write-Utf8 (Join-Path $BaiDir "$slug.html") $html
    Write-Host ("  bai\{0}.html" -f $slug)
}

# ---------- Danh sach du phong tren trang chu ----------
# Trang chu dung JavaScript de dung cac the bai viet, nen trong HTML tho khong
# co lien ket nao tro toi bai. Khoi <noscript> nay cho cong cu tim kiem mot
# duong di tu trang chu vao tung bai. Nguoi doc binh thuong khong thay no.

$idxPath = Join-Path $root 'index.html'
if (Test-Path $idxPath) {
    $idx = Get-Content -Raw -Encoding UTF8 $idxPath

    if ($idx -match '<!-- build:list -->') {
        $ul = New-Object System.Collections.Generic.List[string]
        $ul.Add('<!-- build:list -->')
        $ul.Add('          <noscript>')
        $ul.Add('            <ul class="post-list-fallback">')
        foreach ($p in $posts) {
            $t = Esc ([string]$p.title)
            $e = Esc ([string]$p.excerpt)
            $ul.Add("              <li><a href=""bai/$($p.slug).html"">$t</a> $e</li>")
        }
        $ul.Add('            </ul>')
        $ul.Add('          </noscript>')
        $ul.Add('          <!-- /build:list -->')

        $idx = Replace-Block $idx 'build:list' ($ul -join "`r`n")
        Write-Utf8 $idxPath $idx
        Write-Host '  index.html (danh sach du phong)'
    }
}

# ---------- sitemap.xml ----------

$sm = New-Object System.Text.StringBuilder
[void]$sm.AppendLine('<?xml version="1.0" encoding="UTF-8"?>')
[void]$sm.AppendLine('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

$newest = [string]$posts[0].date
[void]$sm.AppendLine("  <url><loc>$BaseUrl/</loc><lastmod>$newest</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>")
[void]$sm.AppendLine("  <url><loc>$BaseUrl/about.html</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>")

foreach ($p in $posts) {
    $loc = "$BaseUrl/bai/$($p.slug).html"
    $lastmod = ''
    if ($p.date) { $lastmod = "<lastmod>$($p.date)</lastmod>" }
    [void]$sm.AppendLine("  <url><loc>$loc</loc>$lastmod<changefreq>monthly</changefreq><priority>0.8</priority></url>")
}

[void]$sm.AppendLine('</urlset>')
Write-Utf8 (Join-Path $root 'sitemap.xml') $sm.ToString()

# ---------- robots.txt ----------

$robots = "User-agent: *`r`nAllow: /`r`n`r`nSitemap: $BaseUrl/sitemap.xml`r`n"
Write-Utf8 (Join-Path $root 'robots.txt') $robots

# ---------- Xong ----------

Write-Host ''
Write-Host ("Da sinh {0} trang bai viet, sitemap.xml va robots.txt." -f $posts.Count)
Write-Host ("Dia chi goc dang dung: {0}" -f $BaseUrl)
Write-Host 'Nho chay lai script nay moi khi dang bai moi, truoc khi git push.'
