/* ============================================================
   config.js — CẤU HÌNH WEBSITE
   Đây là file bạn sẽ sửa nhiều nhất. Đổi tên site, mô tả,
   thông tin cá nhân, mạng xã hội ở ngay bên dưới.
   ============================================================ */

window.SITE = {
  // Tên hiển thị trên thanh điều hướng và tab trình duyệt
  title: 'Chia sẻ góc nhìn cá nhân',

  // Chữ viết tắt trong ô vuông cạnh tên site (1–2 ký tự)
  initials: 'LTC',

  // Mô tả ngắn — dùng cho SEO và thẻ chia sẻ mạng xã hội
  description: 'Nơi tôi lưu lại những bài viết, vlog và phân tích cá nhân về công nghệ, cổ phiếu, sách vở và cuộc sống.',

  // Phần mở đầu trang chủ
  hero: {
    eyebrow: 'Blog cá nhân',
    heading: 'Viết để nghĩ rõ hơn',
    intro: 'Tôi ghi lại ở đây những gì mình đọc, xem, làm và rút ra được — dưới dạng bài viết dài, vlog và các bài phân tích.'
  },

  // Tác giả
  author: {
    name: 'Canhlt03',
    email: '',          // để trống nếu không muốn hiện
    bio: 'Một người thích viết và phân tích.'
  },

  // Mạng xã hội — để chuỗi rỗng thì mục đó tự ẩn đi
  social: {
    youtube: '',        // ví dụ: https://youtube.com/@kenh-cua-ban
    facebook: 'https://www.facebook.com/adam.coi',
    github: '',
    x: ''
  },

  // Ngôn ngữ trang (dùng cho thẻ <html lang>)
  lang: 'vi',

  // Số bài hiển thị mỗi lần bấm "Xem thêm" ở trang chủ
  pageSize: 9
};
