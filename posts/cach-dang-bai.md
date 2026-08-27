# Cách đăng bài lên trang này

Mỗi bài viết là **một file `.md`** nằm trong thư mục `posts/`, cộng thêm **một dòng khai báo** trong file `posts/posts.json`. Chỉ vậy thôi — không cần cài đặt gì, không cần build.

## Ba bước để có bài mới

1. Tạo file `posts/ten-bai-viet.md` rồi viết nội dung.
2. Mở `posts/posts.json`, thêm một khối mô tả bài viết đó vào **đầu danh sách**.
3. Lưu lại và tải trang. Xong.

Khối khai báo trong `posts.json` trông như thế này:

```json
{
  "slug": "ten-bai-viet",
  "title": "Tiêu đề hiển thị trên trang chủ",
  "date": "2026-08-27",
  "excerpt": "Đoạn tóm tắt 1-2 câu, hiện ở thẻ bài viết.",
  "tags": ["Phân tích", "Công nghệ"],
  "cover": "posts/assets/anh-bia.jpg",
  "video": "",
  "file": "ten-bai-viet.md"
}
```

Trong đó `slug` là phần xuất hiện trên địa chỉ web, nên chỉ dùng chữ thường không dấu và dấu gạch ngang. `cover` và `video` để trống nếu không có. Muốn giấu một bài chưa viết xong, thêm `"draft": true` — bài sẽ biến mất khỏi trang chủ.

---

## Cú pháp viết bài

### Chữ và nhấn mạnh

Viết bình thường, cách nhau một dòng trống là sang đoạn mới. Bạn có thể làm **chữ đậm**, *chữ nghiêng*, ***vừa đậm vừa nghiêng***, ~~gạch bỏ~~, ==tô sáng== và `chữ dạng mã`.

### Tiêu đề mục

Dùng dấu `#`. Một dấu là tiêu đề bài (đã có sẵn ở đầu file), hai dấu `##` là mục lớn, ba dấu `###` là mục nhỏ.

### Danh sách

- Gạch đầu dòng dùng dấu `-`
- Muốn lồng vào trong thì thụt lề hai dấu cách
  - Như dòng này
- Danh sách đánh số thì dùng `1.`, `2.`

Có thể làm cả danh sách việc cần làm:

- [x] Dựng xong website
- [ ] Viết bài đầu tiên
- [ ] Chia sẻ cho bạn bè

### Trích dẫn

> Câu nào muốn tách ra cho nổi bật thì đặt dấu `>` ở đầu dòng.
> Nhiều dòng liên tiếp sẽ gộp thành một khối.

### Ảnh

Chép ảnh vào thư mục `posts/assets/` rồi chèn bằng cú pháp:

`![Chú thích ảnh](posts/assets/ten-anh.jpg)`

### Nhúng video

Đây là phần quan trọng nhất với các bài vlog. Có hai cách, cách nào cũng được:

- Dán **link YouTube trên một dòng riêng** — hệ thống tự nhận ra và biến thành khung video.
- Hoặc viết `@youtube[MA_VIDEO]`, trong đó mã video là đoạn 11 ký tự trong link.

Ví dụ, dán nguyên dòng này vào bài:

https://www.youtube.com/watch?v=aqz-KE-bpKQ

Nếu video là **nội dung chính** của bài, đừng dán vào giữa bài — hãy điền link vào ô `"video"` trong `posts.json`. Khi đó video sẽ tự nằm ngay đầu bài, và thẻ bài viết ngoài trang chủ cũng tự lấy ảnh thumbnail của video kèm nhãn VLOG.

### Bảng

| Cột trái | Căn giữa | Căn phải |
|----------|:--------:|---------:|
| Nội dung | Nội dung | 1.234    |
| Nội dung | Nội dung | 5.678    |

### Khối mã

Bọc đoạn mã giữa hai dòng ba dấu huyền, ghi tên ngôn ngữ ở dòng mở:

```python
def chao(ten):
    return f"Xin chào, {ten}!"
```

### Đường kẻ ngang

Ba dấu gạch ngang `---` trên một dòng riêng sẽ tạo đường kẻ phân cách như bạn thấy ở trên.

---

## Vài mẹo nhỏ

Muốn đổi tên blog, màu sắc, mạng xã hội thì mở `js/config.js` — mọi thứ nằm gọn trong đó. Muốn đổi tông màu chủ đạo thì mở `css/style.css`, sửa biến `--accent` ở đầu file.

Còn khi đã viết xong và muốn đưa lên mạng cho mọi người xem, đọc phần hướng dẫn trong file `README.md`.
