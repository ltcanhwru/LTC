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

Muốn đổi tông màu: mở `css/style.css`, sửa dòng `--accent: #b8452e;` ở gần đầu file thành mã màu bạn thích. Có hai bảng màu — một cho chế độ sáng, một cho chế độ tối.

Muốn sửa trang giới thiệu: mở `about.html`, nội dung nằm giữa hai dòng đánh dấu `SỬA NỘI DUNG GIỚI THIỆU CỦA BẠN Ở ĐÂY`.

---

## 4. Đưa lên mạng miễn phí (GitHub Pages)

Làm một lần duy nhất, sau đó mỗi lần đăng bài chỉ cần 3 câu lệnh.

Địa chỉ đích: **https://ltcanh.github.io/LTC/**

### Lần đầu

Kho git ở máy đã được khởi tạo sẵn, đã commit, và đã trỏ remote về `https://github.com/ltcanh/LTC.git`. Chỉ còn 3 việc:

**a.** Vào [github.com/new](https://github.com/new) tạo repository mới:

- **Repository name**: `LTC` — viết hoa đúng như vậy, vì tên này nằm luôn trong đường link
- Chọn **Public** (Pages trên repo Private là tính năng trả phí)
- **Không tích** ô nào ở phần "Initialize this repository" — sẽ xung đột với commit đã có sẵn

**b.** Mở PowerShell tại thư mục này và đẩy code lên:

```bash
git push -u origin main
```

Lần đầu chạy, một cửa sổ trình duyệt sẽ tự bật lên — bấm *Sign in with your browser*. Đừng gõ mật khẩu vào cửa sổ dòng lệnh, GitHub đã bỏ cách đó từ 2021.

**c.** Vào repo trên GitHub → tab **Settings** → mục **Pages** ở cột trái → phần **Build and deployment**:

- Source: **Deploy from a branch**
- Branch: **main**, thư mục **/ (root)**
- Bấm **Save**

Đợi khoảng 1–2 phút, website sẽ chạy tại `https://ltcanh.github.io/LTC/`.

### Những lần sau, mỗi khi đăng bài mới

```bash
git add . ; git commit -m "Them bai moi" ; git push
```

Khoảng một phút sau bài mới sẽ xuất hiện trên mạng.

### Muốn dùng tên miền riêng?

Mua tên miền (khoảng 200–300k/năm), rồi vào **Settings → Pages → Custom domain** trên GitHub và làm theo hướng dẫn ở đó. Bản thân hosting vẫn miễn phí.

---

## 5. Cấu trúc thư mục

```
index.html          Trang chủ - danh sách bài viết
post.html           Trang đọc một bài (post.html?p=slug)
about.html          Trang giới thiệu - sửa nội dung trực tiếp trong file
404.html            Trang báo không tìm thấy

css/style.css       Toàn bộ giao diện. Đổi màu ở phần :root đầu file

js/config.js        <- File bạn sửa nhiều nhất: tên blog, mạng xã hội
js/markdown.js      Bộ chuyển Markdown sang HTML
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

## 6. Gặp trục trặc?

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
