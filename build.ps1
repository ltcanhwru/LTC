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

# Thoat chuoi de nhet vao JSON (dung cho khoi du lieu co cau truc JSON-LD)
function EscJson {
    param([string]$s)
    if ($null -eq $s) { return '' }
    return $s.Replace('\', '\\').Replace('"', '\"').Replace("`r", '').Replace("`n", ' ')
}

# Thay mot doan nam giua hai dau moc. Dung MatchEvaluator de ky tu $ trong
# tieu de bai khong bi PowerShell hieu nham thanh nhom bat trong regex.
function Replace-Block {
    param([string]$Html, [string]$Marker, [string]$New)
    $pattern = '(?s)<!-- ' + $Marker + ' -->.*?<!-- /' + $Marker + ' -->'
    return [regex]::Replace($Html, $pattern, { param($m) $New })
}

# Doi ngay dang 2026-08-27 sang dinh dang RFC-822 ma RSS doi hoi.
# Dung InvariantCulture de ten thu va thang luon la tieng Anh theo chuan.
function Rfc822 {
    param([string]$d)
    $dt = [datetime]::MinValue
    $inv = [Globalization.CultureInfo]::InvariantCulture
    if ([datetime]::TryParseExact($d, 'yyyy-MM-dd', $inv, [Globalization.DateTimeStyles]::None, [ref]$dt)) {
        return $dt.ToString('ddd, dd MMM yyyy HH:mm:ss', $inv) + ' +0700'
    }
    return ''
}

# ---------- Doi anh bia SVG sang PNG ----------
# Facebook, Zalo va X KHONG doc duoc anh dinh dang SVG trong o xem truoc khi
# chia se link. Nen moi anh bia can mot ban PNG di kem. Dung Chrome o che do
# headless de chup lai chinh file SVG do - khong phai cai them phan mem nao.
# Khong tim thay Chrome thi bo qua, the og:image se tro ve file SVG nhu cu.

function Find-Chrome {
    foreach ($p in @(
        "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
        "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
        "$env:LocalAppData\Google\Chrome\Application\chrome.exe",
        "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
        "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
    )) { if ($p -and (Test-Path $p)) { return $p } }
    return $null
}

# Doc be ngang va chieu cao tu thuoc tinh viewBox cua file SVG
function Get-SvgSize {
    param([string]$Path)
    $head = Get-Content -Raw -Encoding UTF8 $Path
    $m = [regex]::Match($head, 'viewBox="0 0 ([\d.]+) ([\d.]+)"')
    if ($m.Success) {
        return @([int][math]::Ceiling([double]$m.Groups[1].Value),
                 [int][math]::Ceiling([double]$m.Groups[2].Value))
    }
    return @(880, 430)
}

function Convert-SvgToPng {
    param([string]$Chrome, [string]$SvgPath)

    $pngPath = [System.IO.Path]::ChangeExtension($SvgPath, '.png')

    # Da co ban PNG moi hon file SVG thi khong chup lai, cho nhanh
    if ((Test-Path $pngPath) -and
        ((Get-Item $pngPath).LastWriteTime -ge (Get-Item $SvgPath).LastWriteTime)) {
        return $pngPath
    }

    $size = Get-SvgSize $SvgPath
    $chromeArgs = @(
        '--headless=new', '--disable-gpu', '--hide-scrollbars',
        '--force-device-scale-factor=1.5',
        "--screenshot=`"$pngPath`"",
        ("--window-size={0},{1}" -f $size[0], $size[1]),
        "`"$SvgPath`""
    )

    # Dung Start-Process chu khong goi thang: Chrome ghi tien trinh ra luong loi
    # chuan, ma PowerShell 5.1 coi moi dong o luong do la loi that va se dung
    # ca script vi ErrorActionPreference dang dat la Stop.
    $errLog = Join-Path $env:TEMP ('chrome-shot-{0}.log' -f [guid]::NewGuid())
    try {
        Start-Process -FilePath $Chrome -ArgumentList $chromeArgs -Wait -NoNewWindow `
                      -RedirectStandardError $errLog | Out-Null
    } catch {
        return $null
    } finally {
        Remove-Item $errLog -Force -ErrorAction SilentlyContinue
    }

    if (Test-Path $pngPath) { return $pngPath }
    return $null
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

# Ten tac gia, lay tu khoi author trong config.js
$authorName = $siteName
$siteDesc   = ''
if ($cfg) {
    $ma = [regex]::Match($cfg, "(?s)author:\s*\{.*?name:\s*'([^']*)'")
    if ($ma.Success) { $authorName = $ma.Groups[1].Value }
    $md = [regex]::Match($cfg, "description:\s*'([^']*)'")
    if ($md.Success) { $siteDesc = $md.Groups[1].Value }
}

# Chrome dung de doi anh bia SVG sang PNG (xem ghi chu o phan tien ich)
$chrome = Find-Chrome
if (-not $chrome) {
    Write-Host '  Khong tim thay Chrome/Edge: bo qua buoc tao anh PNG cho o xem truoc.'
}

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

    # Anh cho o xem truoc khi chia se link. Uu tien ban PNG: Facebook, Zalo va
    # X khong doc duoc SVG, de nguyen SVG thi o xem truoc khong co anh.
    $coverRel = ''
    if ($p.cover) {
        $coverRel = [string]$p.cover
        if ($chrome -and $coverRel.ToLower().EndsWith('.svg')) {
            $svgAbs = Join-Path $root ($coverRel -replace '/', '\')
            if (Test-Path $svgAbs) {
                if (Convert-SvgToPng $chrome $svgAbs) {
                    $coverRel = $coverRel -replace '\.svg$', '.png'
                }
            }
        }
    }

    if ($coverRel) {
        $imgUrl = Esc "$BaseUrl/$coverRel"
        $lines.Add("  <meta property=""og:image"" content=""$imgUrl"">")
        $lines.Add("  <meta property=""og:image:alt"" content=""$eTitle"">")
        $lines.Add('  <meta name="twitter:card" content="summary_large_image">')
    } else {
        $lines.Add('  <meta name="twitter:card" content="summary">')
    }
    $lines.Add("  <meta name=""twitter:title"" content=""$eTitle"">")
    $lines.Add("  <meta name=""twitter:description"" content=""$eExcerpt"">")
    if ($p.date) {
        $lines.Add("  <meta property=""article:published_time"" content=""$($p.date)"">")
    }
    $lines.Add("  <link rel=""alternate"" type=""application/rss+xml"" title=""$eSite"" href=""feed.xml"">")

    # Du lieu co cau truc: noi ro voi Google day la mot bai viet, co ngay dang
    # va tac gia. Day la dieu kien de bai du tu cach hien dang ket qua phong phu.
    $lines.Add('  <script type="application/ld+json">')
    $lines.Add('  {')
    $lines.Add('    "@context": "https://schema.org",')
    $lines.Add('    "@type": "BlogPosting",')
    $lines.Add('    "headline": "' + (EscJson ([string]$p.title)) + '",')
    $lines.Add('    "description": "' + (EscJson ([string]$p.excerpt)) + '",')
    if ($coverRel) { $lines.Add('    "image": "' + "$BaseUrl/$coverRel" + '",') }
    if ($p.date) {
        $lines.Add('    "datePublished": "' + $p.date + '",')
        $lines.Add('    "dateModified": "' + $p.date + '",')
    }
    $lines.Add('    "author": { "@type": "Person", "name": "' + (EscJson $authorName) + '" },')
    $lines.Add('    "publisher": { "@type": "Person", "name": "' + (EscJson $authorName) + '" },')
    $lines.Add('    "mainEntityOfPage": { "@type": "WebPage", "@id": "' + $url + '" },')
    $lines.Add('    "inLanguage": "vi-VN"')
    $lines.Add('  }')
    $lines.Add('  </script>')

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
    }

    # Du lieu co cau truc cho trang chu: khai bao day la mot blog, kem danh
    # sach bai moi nhat de Google hieu quan he giua trang chu va cac bai.
    if ($idx -match '<!-- build:jsonld -->') {
        $ld = New-Object System.Collections.Generic.List[string]
        $ld.Add('<!-- build:jsonld -->')
        $ld.Add('  <script type="application/ld+json">')
        $ld.Add('  {')
        $ld.Add('    "@context": "https://schema.org",')
        $ld.Add('    "@type": "Blog",')
        $ld.Add('    "name": "' + (EscJson $siteName) + '",')
        $ld.Add('    "description": "' + (EscJson $siteDesc) + '",')
        $ld.Add('    "url": "' + $BaseUrl + '/",')
        $ld.Add('    "inLanguage": "vi-VN",')
        $ld.Add('    "author": { "@type": "Person", "name": "' + (EscJson $authorName) + '" },')
        $ld.Add('    "blogPost": [')

        $newest10 = @($posts | Select-Object -First 10)
        for ($i = 0; $i -lt $newest10.Count; $i++) {
            $q = $newest10[$i]
            $comma = ','
            if ($i -eq $newest10.Count - 1) { $comma = '' }
            $ld.Add('      { "@type": "BlogPosting", "headline": "' + (EscJson ([string]$q.title)) +
                    '", "url": "' + "$BaseUrl/bai/$($q.slug).html" + '" }' + $comma)
        }

        $ld.Add('    ]')
        $ld.Add('  }')
        $ld.Add('  </script>')
        $ld.Add('  <!-- /build:jsonld -->')

        $idx = Replace-Block $idx 'build:jsonld' ($ld -join "`r`n")
    }

    Write-Utf8 $idxPath $idx
    Write-Host '  index.html (danh sach du phong + du lieu co cau truc)'
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

# ---------- feed.xml (RSS) ----------
# Them mot duong nua cho cong cu doc tin va cho ai muon theo doi bai moi.

$rs = New-Object System.Text.StringBuilder
[void]$rs.AppendLine('<?xml version="1.0" encoding="UTF-8"?>')
[void]$rs.AppendLine('<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">')
[void]$rs.AppendLine('<channel>')
[void]$rs.AppendLine("  <title>$eSite</title>")
[void]$rs.AppendLine("  <link>$BaseUrl/</link>")
[void]$rs.AppendLine("  <description>$(Esc $siteDesc)</description>")
[void]$rs.AppendLine('  <language>vi</language>')
[void]$rs.AppendLine("  <atom:link href=""$BaseUrl/feed.xml"" rel=""self"" type=""application/rss+xml"" />")

$built = Rfc822 ([string]$posts[0].date)
if ($built) { [void]$rs.AppendLine("  <lastBuildDate>$built</lastBuildDate>") }

foreach ($p in $posts) {
    $loc = "$BaseUrl/bai/$($p.slug).html"
    [void]$rs.AppendLine('  <item>')
    [void]$rs.AppendLine("    <title>$(Esc ([string]$p.title))</title>")
    [void]$rs.AppendLine("    <link>$loc</link>")
    [void]$rs.AppendLine("    <guid isPermaLink=""true"">$loc</guid>")
    $pub = Rfc822 ([string]$p.date)
    if ($pub) { [void]$rs.AppendLine("    <pubDate>$pub</pubDate>") }
    [void]$rs.AppendLine("    <description>$(Esc ([string]$p.excerpt))</description>")
    [void]$rs.AppendLine('  </item>')
}

[void]$rs.AppendLine('</channel>')
[void]$rs.AppendLine('</rss>')
Write-Utf8 (Join-Path $root 'feed.xml') $rs.ToString()

# ---------- Xong ----------

Write-Host ''
Write-Host ("Da sinh {0} trang bai viet, sitemap.xml va robots.txt." -f $posts.Count)
Write-Host ("Dia chi goc dang dung: {0}" -f $BaseUrl)
Write-Host 'Nho chay lai script nay moi khi dang bai moi, truoc khi git push.'
