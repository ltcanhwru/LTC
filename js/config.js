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

  // Các mục trên thanh menu đầu trang.
  // - Mục có "tag": bấm vào sẽ lọc trang chủ theo thẻ đó.
  //   Chữ trong "tag" phải TRÙNG KHỚP với thẻ bạn ghi ở posts.json (có dấu, đúng hoa thường).
  // - Mục có "href": mở thẳng một trang.
  // Muốn thêm/bớt/đổi thứ tự thì sửa ngay danh sách này.
  nav: [
    { label: 'Trang chủ',  href: 'index.html' },
    { label: 'Kiến thức',  tag: 'Kiến thức' },
    { label: 'Cổ phiếu',   tag: 'Cổ phiếu' },
    { label: 'Sách',       tag: 'Sách' },
    { label: 'Giới thiệu', href: 'about.html' }
  ],

  // Tác giả
  author: {
    name: 'Canhlt03',
    email: 'ltcanh.wru@gmail.com',   // để trống nếu không muốn hiện
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
