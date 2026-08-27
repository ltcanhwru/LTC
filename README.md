# Blog cá nhân — hướng dẫn sử dụng

Một website tĩnh để đăng bài viết, vlog và phân tích cá nhân. Không cần cài Node.js, không cần database, không tốn tiền hosting.

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
git add . ; git commit -m "Them bai moi" ; git push
```

Khoảng một phút sau bài mới sẽ xuất hiện trên mạng.

### Muốn dùng tên miền riêng?

Mua tên miền (khoảng 200–300k/năm), rồi vào **Settings → Pages → Custom domain** trên GitHub và làm theo hướng dẫn ở đó. Bản thân hosting vẫn miễn phí.

---

## 6. Cấu trúc thư mục

```
index.html          Trang chủ - danh sách bài viết
post.html           Trang đọc một bài (post.html?p=slug)
about.html          Trang giới thiệu - sửa nội dung trực tiếp trong file
404.html            Trang báo không tìm thấy

css/style.css       Toàn bộ giao diện. Đổi màu ở phần :root đầu file

js/config.js        <- File bạn sửa nhiều nhất: tên blog, mạng xã hội
js/markdown.js      Bộ chuyển Markdown sang HTML
js/views.js         Bộ đếm lượt xem (đọc mục 4 để hiểu con số)
js/site.js          Header, footer, nút sáng/tối, hàm dùng chung
js/home.js          Logic trang chủ: tìm kiếm, lọc thẻ, xem thêm
js/post.js          Logic trang bài viết

posts/posts.json    <- Danh mục bài viết. Thêm bài mới là sửa file này
posts/*.md          Nội dung từng bài viết
posts/assets/       Ảnh dùng trong bài

serve.ps1           Máy chủ xem thử tại chỗ
.nojekyll           Báo GitHub Pages phục vụ file nguyên trạng
```

---

## 7. Gặp trục trặc?

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
