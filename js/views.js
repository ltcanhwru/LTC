/* ============================================================
   views.js — Đếm lượt xem bài viết.

   QUAN TRỌNG — hãy đọc để hiểu con số bạn đang thấy:
   Website này là web tĩnh, không có máy chủ và không có cơ sở dữ liệu,
   nên KHÔNG có chỗ nào để cộng dồn lượt xem của tất cả mọi người.
   Bộ đếm dưới đây lưu trong trình duyệt của TỪNG người đọc
   (localStorage), nên nó đếm số lần CHÍNH NGƯỜI ĐÓ mở bài viết.
   Mỗi người thấy một con số khác nhau; số của bạn không phải tổng
   lượt xem toàn site.

   Muốn con số là lượt xem THẬT của tất cả mọi người thì cần một dịch vụ
   đếm bên ngoài. Xem mục "Đếm lượt xem" trong README.md — chỉ cần thay
   phần thân ba hàm getCount / recordView / getAll bên dưới, phần giao
   diện không phải sửa gì.
   ============================================================ */
(function (global) {
  'use strict';

  var KEY = 'blog-views';        // nơi lưu số đếm
  var SESSION_KEY = 'blog-seen'; // chống cộng nhiều lần khi tải lại trang

  function readStore(key) {
    try {
      var raw = (key === SESSION_KEY ? sessionStorage : localStorage).getItem(key);
      var obj = raw ? JSON.parse(raw) : {};
      return (obj && typeof obj === 'object') ? obj : {};
    } catch (e) {
      return {};   // chế độ riêng tư, hoặc trình duyệt chặn lưu trữ
    }
  }

  function writeStore(key, obj) {
    try {
      (key === SESSION_KEY ? sessionStorage : localStorage).setItem(key, JSON.stringify(obj));
    } catch (e) { /* hết dung lượng hoặc bị chặn — bỏ qua, không làm hỏng trang */ }
  }

  /* Lấy số lượt xem của một bài */
  function getCount(slug) {
    var n = readStore(KEY)[slug];
    return typeof n === 'number' && isFinite(n) && n > 0 ? n : 0;
  }

  /* Lấy toàn bộ bảng đếm */
  function getAll() {
    return readStore(KEY);
  }

  /* Ghi nhận một lượt xem. Mỗi phiên duyệt web chỉ tính một lần cho mỗi bài. */
  function recordView(slug) {
    if (!slug) return 0;

    var seen = readStore(SESSION_KEY);
    if (seen[slug]) return getCount(slug);   // đã tính trong phiên này rồi

    seen[slug] = 1;
    writeStore(SESSION_KEY, seen);

    var all = readStore(KEY);
    all[slug] = (all[slug] || 0) + 1;
    writeStore(KEY, all);
    return all[slug];
  }

  /* 1234 -> "1,2k"  |  2500000 -> "2,5tr"  (dấu phẩy thập phân kiểu Việt Nam) */
  function format(n) {
    n = Number(n) || 0;
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '').replace('.', ',') + 'tr';
    if (n >= 1000)    return (n / 1000).toFixed(1).replace(/\.0$/, '').replace('.', ',') + 'k';
    return String(n);
  }

  /* Sắp xếp danh sách bài theo lượt xem giảm dần.
     Bài bằng điểm nhau thì bài mới hơn đứng trước. */
  function rank(posts, limit) {
    var all = getAll();
    return posts
      .map(function (p) {
        return { post: p, views: (typeof all[p.slug] === 'number' ? all[p.slug] : 0) };
      })
      .sort(function (a, b) {
        if (b.views !== a.views) return b.views - a.views;
        return String(b.post.date).localeCompare(String(a.post.date));
      })
      .slice(0, limit || 5);
  }

  global.Views = {
    getCount: getCount,
    getAll: getAll,
    recordView: recordView,
    format: format,
    rank: rank
  };
})(window);
