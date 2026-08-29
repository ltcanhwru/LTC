# Blog cá nhân — hướng dẫn sử dụng

Một website tĩnh để đăng bài viết, vlog và phân tích cá nhân. Không cần cài Node.js, không cần database, không tốn tiền hosting.

**Trang đang chạy: <https://ltcanhwru.github.io/LTC/>**

---

## 1. Xem thử trên máy

Nhấp chuột phải vào file `serve.ps1` → **Run with PowerShell**. Trình duyệt sẽ tự mở ở địa chỉ `http://localhost:8080`. Bấm `Ctrl+C` trong cửa sổ đen để dừng.

Nếu Windows chặn không cho chạy script, mở PowerShell tại thư mục này rồi gõ:

```bash
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Nếu cổng 8080 bị chương trình khác chiếm, đổi sang cổng khác:

```bash
powershell -ExecutionPolicy Bypass -File serve.ps1 -Port 8081
```

> **Lưu ý quan trọng:** đừng mở website bằng cách nhấp đúp vào `index.html`. Trình duyệt sẽ chặn việc đọc file `.md` và `.json`, nên trang sẽ trống. Luôn xem qua `serve.ps1`.

---

## 2. Đăng một bài mới

Chỉ có hai việc phải làm.

**Bước 1 — Tạo file nội dung.** Thêm file `posts/ten-bai-viet.md`, viết bằng Markdown. Dòng đầu tiên là tiêu đề với một dấu `#`:

```markdown
# Tiêu đề bài viết của tôi

Đoạn mở đầu viết ở đây...
```

**Bước 2 — Khai báo bài viết.** Mở `posts/posts.json`, thêm một khối vào **đầu** danh sách (nhớ dấu phẩy ngăn cách giữa các khối):

```json
{
  "slug": "ten-bai-viet",
  "title": "Tiêu đề bài viết của tôi",
  "date": "2026-09-15",
  "excerpt": "Tóm tắt 1-2 câu hiện ở trang chủ.",
  "tags": ["Phân tích"],
  "cover": "",
  "video": "",
  "file": "ten-bai-viet.md"
}
```

Ý nghĩa từng ô:

| Ô | Bắt buộc | Giải thích |
|---|:--------:|------------|
| `slug` | có | Tên trên địa chỉ web. Chữ thường, không dấu, nối bằng gạch ngang. |
| `title` | có | Tiêu đề hiển thị. |
| `date` | có | Dạng `YYYY-MM-DD`. Bài mới nhất tự lên đầu. |
| `excerpt` | nên có | Tóm tắt ở thẻ bài viết và dòng dẫn đầu bài. |
| `tags` | không | Danh sách thẻ. Trang chủ tự dựng nút lọc từ đây. |
| `cover` | không | Ảnh bìa, ví dụ `posts/assets/anh.jpg`. |
| `video` | không | Link YouTube. Có ô này thì bài thành dạng **vlog**. |
| `file` | có | Tên file `.md` trong thư mục `posts/`. |
| `draft` | không | Đặt `true` để giấu bài chưa xong. |

Toàn bộ cú pháp Markdown được liệt kê trong bài mẫu **"Cách đăng bài lên trang này"** — mở website lên đọc là thấy.

### Nhúng video YouTube

- Video là **nội dung chính** của bài → điền link vào ô `"video"` trong `posts.json`. Video tự lên đầu bài, thẻ ngoài trang chủ tự lấy ảnh thumbnail kèm nhãn VLOG.
- Video chỉ **minh hoạ giữa bài** → dán link YouTube trên một dòng riêng trong file `.md`, hoặc viết `@youtube[MA_VIDEO]`.

### Chèn ảnh

Chép ảnh vào `posts/assets/` rồi viết trong bài:

```markdown
![Chú thích ảnh](posts/assets/ten-anh.jpg)
```

### Biểu đồ

Các biểu đồ trong bài phân tích là file `.svg` tự vẽ, để trong `posts/assets/` và chèn bằng đúng cú pháp ảnh ở trên. Khi trang chạy, `site.js` thay thẻ `<img>` đó bằng SVG nhúng thẳng vào trang — nhờ vậy biểu đồ dùng chung bảng màu với giao diện và đổi màu ngay lúc bấm nút sáng/tối. Tải hỏng thì thẻ ảnh được giữ nguyên, biểu đồ vẫn hiện, chỉ là màu cố định theo file.

#### Khung file mẫu

Chép nguyên khối này thành `posts/assets/ten-bieu-do.svg` rồi vẽ vào giữa:

```svg
<svg class="cvi" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 420" width="880" height="420" role="img" aria-label="Mo ta ngan bang chu khong dau">
<style>.cvi text{font-family:Inter,"Segoe UI",Roboto,Arial,sans-serif;fill:var(--cv-tx,#15261a)}.cvi .t{font-size:17.5px;font-weight:650}.cvi .s{font-size:12.5px;fill:var(--cv-mu,#4b6551)}.cvi .v{font-size:12.5px;font-weight:650}.cvi .c{font-size:12.5px}.cvi .ax{font-size:11.5px;fill:var(--cv-mu,#4b6551)}.cvi .gl{stroke:var(--cv-gr,#dceed4);stroke-width:1}.cvi .bl{stroke:var(--cv-bd,#c8e2bd);stroke-width:1}.cvi .ln{stroke:var(--cv-mu,#4b6551);stroke-width:1.4;fill:none}.cvi .dl{stroke:var(--cv-n1,#a9bfb0);stroke-width:2}</style>
<rect x="0.5" y="0.5" width="879" height="419" rx="14" fill="var(--cv-bg,#f6fbf3)" stroke="var(--cv-bd,#c8e2bd)"/>
<text class="t" x="36" y="40">Tiêu đề biểu đồ</text>
<text class="s" x="36" y="62">Một câu nói rõ biểu đồ này cho thấy điều gì.</text>

<line class="gl" x1="110" y1="110" x2="836" y2="110"/><text class="ax" x="100" y="114" text-anchor="end">100</text>
<line class="bl" x1="110" y1="330" x2="836" y2="330"/><text class="ax" x="100" y="334" text-anchor="end">0</text>
<rect x="155" y="130" width="90" height="200" rx="2" fill="var(--cv-a1,#2e7d43)"/>
<text class="v" x="200" y="123" text-anchor="middle">91</text>
<text class="c" x="200" y="354" text-anchor="middle">Tên nhóm</text>

<text class="s" x="36" y="404">Ghi chú nguồn hoặc điều cần lưu ý khi đọc.</text>
</svg>
```

Bề ngang luôn để `880` — trang tự co cho vừa cột chữ. Chiều cao đổi tùy nội dung, nhưng phải sửa đồng thời **ba chỗ**: `viewBox`, thuộc tính `height` của thẻ `<svg>`, và `height` của thẻ `<rect>` khung (bằng chiều cao trừ 1).

#### Bảng màu

Không viết mã màu cứng. Dùng các biến dưới đây kèm màu dự phòng, dạng đầy đủ là `fill="var(--cv-a1,#2e7d43)"`. Màu dự phòng chỉ có tác dụng khi mở thẳng file `.svg`; khi nằm trong trang thì `css/style.css` quyết định.

| Biến | Dùng cho | Sáng | Tối |
|---|---|---|---|
| `--cv-bg` | nền khung biểu đồ | `#f6fbf3` | `#16241a` |
| `--cv-bd` | viền khung, đường trục gốc | `#c8e2bd` | `#2c4232` |
| `--cv-tx` | chữ chính | `#15261a` | `#e6f0e6` |
| `--cv-mu` | chữ phụ, ghi chú | `#4b6551` | `#a2b8a6` |
| `--cv-gr` | đường kẻ ngang mờ | `#dceed4` | `#26392c` |
| `--cv-a1` | cột hoặc đường nổi bật | `#2e7d43` | `#5fbf7d` |
| `--cv-a2` | cột nền để so sánh | `#9ecbaa` | `#356b4b` |
| `--cv-neg` | số đi lùi, cảnh báo | `#c0562f` | `#e2795a` |
| `--cv-wa` | biến số đáng chú ý | `#bf860f` | `#dda93f` |
| `--cv-n1` | trung tính, không nhấn | `#a9bfb0` | `#5a6f61` |

#### Các lớp có sẵn

| Lớp | Dùng cho |
|---|---|
| `t` | tiêu đề biểu đồ |
| `s` | câu mô tả dưới tiêu đề, ghi chú cuối khung |
| `v` | con số trên cột, nhãn cần nổi |
| `c` | tên nhóm dưới trục ngang |
| `ax` | số trên trục, chú thích nhỏ |
| `gl` | đường kẻ ngang mờ |
| `bl` | đường trục gốc |
| `ln` | đường nối trong sơ đồ, dùng kèm mũi tên |
| `dl` | đoạn nối hai điểm trong biểu đồ quả tạ |

#### Quy ước toạ độ

Các biểu đồ hiện có đều theo cùng một bố cục: lề trái `36`, tiêu đề `y=40`, câu mô tả `y=62`, vùng vẽ từ khoảng `y=110` xuống đường gốc `y=330`, tên nhóm `y=354`, ghi chú cuối cách đáy khung khoảng `16`.

Đổi số liệu thành toạ độ theo một công thức duy nhất:

```
tỉ lệ = chiều cao vùng vẽ / giá trị lớn nhất trên trục
chiều cao cột = giá trị × tỉ lệ
y của đỉnh cột = y đường gốc − chiều cao cột
```

Ví dụ vùng vẽ cao 220 (từ `y=110` xuống `y=330`) cho trục tối đa 400 thì tỉ lệ là `0,55`. Cột giá trị 152 cao `83,6`, đỉnh nằm ở `y = 330 − 83,6 = 246,4`.

#### Ba điều cần tránh

- **Đừng khai báo `:root{...}` trong file SVG.** Khi nhúng vào trang, `:root` trỏ tới thẻ `<html>` nên nó sẽ đè lên bảng màu của cả site.
- **Đừng dùng `@media (prefers-color-scheme)`.** Nó dò cài đặt sáng/tối của máy, không dò nút sáng/tối trên trang — hai thứ này có thể ngược nhau.
- **Đừng đặt chữ đè lên nền màu đậm.** Màu nền đổi theo giao diện, nên chữ trắng đọc được ở chế độ này có thể mất hút ở chế độ kia. Đặt con số ở ngoài cột thì luôn an toàn.

#### Chú thích cho trình đọc màn hình

Câu chú thích lấy từ phần trong ngoặc vuông của cú pháp Markdown (`![...]`), không lấy từ `aria-label` trong file — nên hãy viết câu đó có dấu đầy đủ và mô tả đúng nội dung biểu đồ.

---

## 3. Đổi thông tin cá nhân

Mở `js/config.js` — tên blog, mô tả, tên bạn, email, link mạng xã hội đều nằm gọn trong đó. Sửa xong lưu lại là xong, không phải đụng tới file nào khác.

Muốn đổi tông màu: mở `css/style.css`, sửa dòng `--accent: #2e7d43;` ở gần đầu file thành mã màu bạn thích. Có hai bảng màu — một cho chế độ sáng, một cho chế độ tối.

Muốn sửa trang giới thiệu: mở `about.html`, nội dung nằm giữa hai dòng đánh dấu `SỬA NỘI DUNG GIỚI THIỆU CỦA BẠN Ở ĐÂY`.

### Thanh menu đầu trang

Cũng nằm trong `js/config.js`, ở mục `nav`. Mỗi dòng là một mục menu:

```js
nav: [
  { label: 'Trang chủ',  href: 'index.html' },   // mở thẳng một trang
  { label: 'Cổ phiếu',   tag: 'Cổ phiếu' },      // lọc trang chủ theo thẻ
  { label: 'Giới thiệu', href: 'about.html' }
]
```

- Mục dùng `tag` sẽ lọc danh sách bài theo thẻ đó. Chữ trong `tag` phải **trùng khớp từng ký tự** với thẻ bạn ghi ở `posts.json` — có dấu, đúng hoa thường. Ghi `"Cổ phiếu"` ở đây mà `posts.json` ghi `"Cổ Phiếu"` thì mục đó sẽ trống.
- Mục dùng `href` mở thẳng một trang.
- Thêm, bớt hay đổi thứ tự thì sửa ngay danh sách này, không phải đụng vào HTML.

Một mục menu chưa có bài nào vẫn hiện ra, nhưng bấm vào sẽ báo "chưa có bài nào" — bình thường, cứ gắn thẻ cho bài viết là nó tự đầy lên.

### Sách tiêu biểu

Danh sách sách hiện ở cột phải **khi vào mục Sách**. Sửa ở mục `books` trong `js/config.js`:

```js
books: [
  {
    title: 'Nhà giả kim',
    author: 'Paulo Coelho',
    cover: 'posts/assets/bia-nha-gia-kim.jpg',  // để trống thì hiện ô chữ cái đầu
    note: 'Một câu vì sao bạn giới thiệu cuốn này.',
    link: 'post.html?p=doc-nha-gia-kim'         // để trống nếu chưa viết bài
  }
]
```

Ảnh bìa chép vào `posts/assets/` rồi ghi đường dẫn. Thêm bao nhiêu cuốn cũng được.

---

## 4. Đếm lượt xem — điều bạn cần biết

Số lượt xem hiện ở ba chỗ: đầu mỗi bài viết, trên thẻ bài ngoài trang chủ, và trong ô "Bài xem nhiều" ở cột phải.

**Nhưng con số đó chỉ là của riêng từng người đọc.**

Website này là web tĩnh — không có máy chủ, không có cơ sở dữ liệu, nên không có chỗ nào để cộng dồn lượt xem của tất cả mọi người. Bộ đếm lưu trong trình duyệt của từng người (localStorage), nên nó đếm số lần **chính người đó** mở bài viết. Bạn thấy "12 lượt xem" thì đó là bạn đã mở bài đó 12 lần; người khác vào sẽ thấy con số của riêng họ. Mỗi bài chỉ được cộng một lần trong mỗi phiên duyệt web, tải lại trang không cộng thêm.

### Muốn lượt xem thật của tất cả mọi người?

Cần một dịch vụ đếm bên ngoài. Vài lựa chọn miễn phí:

| Cách | Ưu | Nhược |
|---|---|---|
| **GoatCounter** | Miễn phí cho blog cá nhân, tôn trọng quyền riêng tư, không theo dõi người dùng | Phải đăng ký tài khoản |
| **Firebase / Supabase** | Số liệu hoàn toàn của bạn, gói free rộng rãi | Phải đăng ký, và khoá API nằm lộ trong mã nguồn công khai |
| **Dịch vụ đếm không cần đăng ký** | Gắn vào là chạy | Phụ thuộc bên thứ ba, có thể ngừng hoạt động bất kỳ lúc nào |

Khi chuyển sang cách nào, **chỉ cần sửa phần thân ba hàm** `getCount`, `recordView`, `getAll` trong `js/views.js`. Toàn bộ giao diện — ô xếp hạng, con số ở đầu bài, thẻ ngoài trang chủ — không phải sửa một dòng nào.

---

## 5. Đưa lên mạng miễn phí (GitHub Pages)

Làm một lần duy nhất, sau đó mỗi lần đăng bài chỉ cần 3 câu lệnh.

Địa chỉ đích: **https://ltcanhwru.github.io/LTC/**

### Thiết lập ban đầu — đã xong hết

- [x] Kho git khởi tạo, remote trỏ về `https://github.com/ltcanhwru/LTC.git`
- [x] Repo `LTC` tạo trên GitHub, để chế độ **Public**
- [x] Code đã đẩy lên nhánh `main`
- [x] GitHub Pages đã bật, trang đã sống

Không phải làm lại bước nào nữa. Từ giờ chỉ cần `git push` là bài mới lên mạng.

### Những lần sau, mỗi khi đăng bài mới

```bash
powershell -ExecutionPolicy Bypass -File build.ps1 ; git add . ; git commit -m "Them bai moi" ; git push
```

Khoảng một phút sau bài mới sẽ xuất hiện trên mạng.

`build.ps1` phải chạy **trước** `git add`, vì nó sinh ra trang tĩnh cho bài mới (xem mục 6). Nếu lỡ quên: `serve.ps1` tự chạy nó mỗi lần bạn xem thử, và `404.html` cũng có lưới an toàn đưa người đọc về đúng bài — nhưng công cụ tìm kiếm sẽ không thấy bài đó, nên vẫn nên chạy cho đúng.

### Muốn dùng tên miền riêng?

Mua tên miền (khoảng 200–300k/năm), rồi vào **Settings → Pages → Custom domain** trên GitHub và làm theo hướng dẫn ở đó. Bản thân hosting vẫn miễn phí.

---

## 6. Để người ta tìm được trang

Website này dựng nội dung bằng JavaScript. Trình duyệt thì không sao, nhưng **công cụ tìm kiếm và ô xem trước khi chia sẻ link phần lớn không chạy JavaScript** — chúng chỉ đọc HTML thô. Trước khi có `build.ps1`, mọi bài viết đều trả về `<title>Đang tải…</title>` và không còn gì khác: Google không có gì để lập chỉ mục, và link dán lên Facebook hay Zalo hiện ra chữ "Đang tải…".

### `build.ps1` giải quyết việc đó

Chạy `.\build.ps1`, script đọc `posts/posts.json` rồi sinh ra:

| Sinh ra | Nội dung |
|---|---|
| `bai/<slug>.html` | Mỗi bài một file, có sẵn tiêu đề, mô tả, ảnh bìa và thẻ `og:` ngay trong HTML |
| `posts/assets/<ten>.png` | Bản PNG của ảnh bìa, dùng cho ô xem trước khi chia sẻ link |
| `sitemap.xml` | Danh sách địa chỉ để khai báo với công cụ tìm kiếm |
| `robots.txt` | Trỏ tới sitemap |
| `feed.xml` | Nguồn RSS cho ai muốn theo dõi bài mới |
| Khối trong `index.html` | Danh sách bài dạng `<noscript>` và dữ liệu có cấu trúc |

### Vì sao ảnh bìa phải có bản PNG

Facebook, Zalo và X **không đọc được ảnh định dạng SVG** trong ô xem trước. Để nguyên `.svg` thì link chia sẻ chỉ hiện tiêu đề và tóm tắt, không có ảnh.

`build.ps1` tự giải quyết: nó gọi Chrome ở chế độ ẩn để chụp lại chính file SVG thành PNG, rồi trỏ `og:image` vào bản PNG đó. Không phải cài thêm phần mềm nào. Ảnh chỉ chụp lại khi file SVG mới hơn bản PNG, nên chạy lần hai rất nhanh. Máy không có Chrome hay Edge thì script bỏ qua bước này và `og:image` quay về dùng SVG như cũ.

### Dữ liệu có cấu trúc

Mỗi trang bài mang một khối `application/ld+json` kiểu `BlogPosting` — nói rõ với Google đây là bài viết, kèm tiêu đề, mô tả, ảnh, ngày đăng và tác giả. Trang chủ mang khối kiểu `Blog` liệt kê mười bài mới nhất. Tên tác giả và mô tả site lấy thẳng từ `js/config.js`, không phải khai báo lại.

Các file trong `bai/` chính là **địa chỉ công khai** của bài viết. Trang chủ, cột bên phải và mục "bài liên quan" đều tự trỏ vào đó. `post.html?p=ten-bai` vẫn chạy cho các link cũ, nhưng được đánh dấu `noindex` để không trùng nội dung với bản chính.

### Đừng quên chạy lại

Đăng bài mới mà quên chạy `build.ps1` thì bài đó không có file trong `bai/`. Có ba lớp đỡ:

1. `serve.ps1` tự chạy `build.ps1` mỗi lần bạn xem thử trên máy.
2. Lệnh đăng bài ở mục 5 đã có sẵn `build.ps1` ở đầu.
3. `404.html` nhận ra địa chỉ dạng `/bai/ten-bai.html` và tự đưa người đọc sang `post.html?p=ten-bai`, nên link vẫn không gãy.

Dù vậy công cụ tìm kiếm sẽ không thấy bài chưa sinh trang, nên vẫn nên chạy cho đúng.

### Đổi tên miền thì sửa ở đâu

Địa chỉ gốc nằm ở dòng `$BaseUrl` đầu `build.ps1`, và ở thẻ `canonical` với `og:url` trong `index.html`. Sửa hai chỗ đó rồi chạy lại script.

### Việc còn phải làm bằng tay

Khai báo trang với Google: vào [Google Search Console](https://search.google.com/search-console), thêm địa chỉ `https://ltcanhwru.github.io/LTC/`, rồi nộp `sitemap.xml`. Đây là việc cần tài khoản Google của bạn nên không tự động hoá được.

> **Đừng xoá file `google12bd5a5e25c3dc1c.html` ở thư mục gốc.** Đó là giấy xác minh quyền sở hữu do Google cấp. Google kiểm tra lại định kỳ, xoá đi là trang mất tư cách đã xác minh và toàn bộ số liệu trong Search Console biến mất. File này không liên quan gì tới nội dung trang, cứ để yên đó.

---

## 7. Cấu trúc thư mục

```
index.html          Trang chủ - danh sách bài viết
post.html           Trang đọc một bài (post.html?p=slug)
about.html          Trang giới thiệu - sửa nội dung trực tiếp trong file
404.html            Trang báo không tìm thấy (kèm lưới an toàn cho /bai/)
sitemap.xml         <- build.ps1 sinh ra. Khai báo với công cụ tìm kiếm
robots.txt          <- build.ps1 sinh ra
feed.xml            <- build.ps1 sinh ra. Nguồn RSS

css/style.css       Toàn bộ giao diện. Đổi màu ở phần :root đầu file
                    (gồm cả bảng màu --cv-* dùng cho biểu đồ)

js/config.js        <- File bạn sửa nhiều nhất: tên blog, mạng xã hội
js/markdown.js      Bộ chuyển Markdown sang HTML
js/views.js         Bộ đếm lượt xem (đọc mục 4 để hiểu con số)
js/site.js          Header, footer, nút sáng/tối, nhúng biểu đồ SVG
js/home.js          Logic trang chủ: tìm kiếm, lọc thẻ, xem thêm
js/post.js          Logic trang bài viết

posts/posts.json    <- Danh mục bài viết. Thêm bài mới là sửa file này
posts/*.md          Nội dung từng bài viết
posts/assets/       Ảnh và biểu đồ .svg dùng trong bài
                    (kèm bản .png do build.ps1 chụp, để chia sẻ link)

bai/                <- build.ps1 sinh ra. Trang tĩnh của từng bài viết,
                    đây mới là địa chỉ công khai. Đừng sửa tay.

build.ps1           Sinh trang tĩnh + sitemap. Chạy trước mỗi lần push
serve.ps1           Máy chủ xem thử tại chỗ (tự chạy build.ps1)
.nojekyll           Báo GitHub Pages phục vụ file nguyên trạng
```

---

## 8. Gặp trục trặc?

**Trang chủ trống, báo "Không đọc được danh sách bài viết"**
Bạn đang mở bằng `file://`. Chạy `serve.ps1` rồi vào `http://localhost:8080`.

**Thêm bài mà không thấy hiện**
Kiểm tra `posts/posts.json` có đúng cú pháp JSON không — thường là thiếu dấu phẩy giữa hai khối, hoặc thừa dấu phẩy ở khối cuối. Dán nội dung file vào [jsonlint.com](https://jsonlint.com) để kiểm tra.

**Bấm vào bài báo "Không tìm thấy bài viết"**
Giá trị `slug` trong `posts.json` không khớp, hoặc `file` trỏ tới tên file `.md` không tồn tại.

**Sửa xong mà trình duyệt vẫn hiện nội dung cũ**
Bấm `Ctrl+F5` để tải lại và bỏ qua bộ nhớ đệm.

**Chữ tiếng Việt bị lỗi thành ký tự lạ**
File `.md` phải lưu ở định dạng **UTF-8**. Trong Notepad, khi lưu chọn Encoding là `UTF-8`.
