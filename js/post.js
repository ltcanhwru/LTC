/* ============================================================
   post.js — Trang đọc bài viết. Lấy slug từ địa chỉ (?p=...),
   tải file Markdown tương ứng rồi hiển thị.
   ============================================================ */
(function () {
  'use strict';

  var S = window.Site;
  var CFG = S.config;
  var MD = window.Markdown;

  var headEl = document.getElementById('articleHead');
  var bodyEl = document.getElementById('articleBody');
  var footEl = document.getElementById('articleFooter');

  /* Trang tĩnh trong bai/ ghi sẵn slug vào thẻ <body data-slug="...">;
     post.html thì lấy từ địa chỉ dạng post.html?p=ten-bai-viet. */
  function getSlug() {
    var fromBody = document.body && document.body.getAttribute('data-slug');
    if (fromBody) return fromBody;
    var params = new URLSearchParams(location.search);
    return params.get('p') || params.get('slug') || '';
  }

  function showError(title, detail) {
    headEl.innerHTML = '';
    bodyEl.innerHTML = '';
    footEl.innerHTML = '<div class="state-box"><h2>' + S.escapeHtml(title) + '</h2>' +
      '<p>' + detail + '</p>' +
      '<p><a href="index.html">← Về trang chủ</a></p></div>';
  }

  function renderHead(post, views) {
    var meta = [S.formatDate(post.date)];
    if (post.readingTime) meta.push(post.readingTime + ' phút đọc');
    if (views > 0) {
      meta.push('<span class="meta-views">' + S.icons.eye +
        window.Views.format(views) + ' lượt xem</span>');
    }
    if (post.author || (CFG.author && CFG.author.name)) {
      meta.unshift(S.escapeHtml(post.author || CFG.author.name));
    }

    headEl.innerHTML =
      '<a class="back-link" href="index.html">' + S.icons.arrowLeft + 'Tất cả bài viết</a>' +
      '<div class="post-meta">' + meta.filter(Boolean).join('<span class="dot">·</span>') + '</div>' +
      '<h1>' + S.escapeHtml(post.title) + '</h1>' +
      (post.excerpt ? '<p class="article-lead">' + S.escapeHtml(post.excerpt) + '</p>' : '') +
      (post.cover ? '<figure class="article-cover"><img src="' + S.escapeHtml(post.cover) +
        '" alt=""></figure>' : '');
  }

  function renderFooter(post) {
    var tags = (post.tags || []).map(function (t) {
      return '<a class="tag-pill" href="index.html?tag=' + encodeURIComponent(t) + '">' + S.escapeHtml(t) + '</a>';
    }).join('');

    footEl.innerHTML =
      (tags ? '<div class="post-card-tags">' + tags + '</div>' : '') +
      '<div class="share-group">' +
        '<span>Chia sẻ bài này</span>' +
        '<button class="icon-btn" id="copyLink" type="button" aria-label="Sao chép đường dẫn">' +
          S.icons.link +
        '</button>' +
      '</div>';

    var btn = document.getElementById('copyLink');
    if (btn) {
      btn.addEventListener('click', function () {
        var done = function () {
          var old = btn.innerHTML;
          btn.textContent = '✓';
          setTimeout(function () { btn.innerHTML = old; }, 1400);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(location.href).then(done, function () {});
        } else {
          // Trình duyệt cũ hoặc trang không chạy trên HTTPS
          var tmp = document.createElement('textarea');
          tmp.value = location.href;
          document.body.appendChild(tmp);
          tmp.select();
          try { document.execCommand('copy'); done(); } catch (e) { /* bỏ qua */ }
          document.body.removeChild(tmp);
        }
      });
    }
  }

  /* Chèn video chính của bài (nếu có) lên đầu nội dung */
  function leadVideo(post) {
    if (!post.video) return '';
    var id = MD.youtubeId(post.video) || post.video;
    if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return '';
    return '<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/' + id +
      '" title="' + S.escapeHtml(post.title) + '" loading="lazy" frameborder="0" ' +
      'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
      'allowfullscreen></iframe></div>';
  }

  /* ---------- Khởi động ---------- */
  S.mountChrome();

  var slug = getSlug();
  if (!slug) {
    showError('Thiếu tên bài viết',
      'Địa chỉ cần có dạng <code>post.html?p=ten-bai-viet</code>.');
    return;
  }

  S.loadPostIndex()
    .then(function (posts) {
      var post = posts.filter(function (p) { return p.slug === slug; })[0];
      if (!post) throw new Error('NOT_IN_INDEX');

      var file = 'posts/' + (post.file || post.slug + '.md');
      return fetch(file, { cache: 'no-cache' })
        .then(function (r) {
          if (!r.ok) throw new Error('Không mở được ' + file + ' (HTTP ' + r.status + ')');
          return r.text();
        })
        .then(function (md) { return { post: post, md: md, posts: posts }; });
    })
    .then(function (data) {
      var post = data.post;
      var md = data.md;

      // Bỏ dòng tiêu đề H1 đầu file (đã hiện ở phần đầu trang rồi)
      md = md.replace(/^\s*#\s+.*\n/, '');

      if (!post.readingTime) post.readingTime = S.readingTime(MD.toPlainText(md));

      // Tính lượt xem này rồi hiện luôn con số vừa cập nhật
      var views = window.Views ? window.Views.recordView(post.slug) : 0;

      renderHead(post, views);
      bodyEl.innerHTML = leadVideo(post) + MD.render(md);
      renderFooter(post);

      // Nhúng thẳng các biểu đồ .svg để chúng đổi màu theo giao diện
      S.inlineCharts(headEl);
      S.inlineCharts(bodyEl);

      // Cột dọc bên phải — cùng ô "Bài xem nhiều" như ở trang chủ
      var sidebar = document.getElementById('sidebar');
      if (sidebar) sidebar.innerHTML = S.buildSidebar(data.posts, '');

      // Gợi ý bài liên quan ở cuối bài. Bảng bài liên quan nằm ở
      // posts/related.json nên phải chờ tải xong mới dựng được.
      var relatedEl = document.getElementById('relatedPosts');
      if (relatedEl) {
        S.loadRelated().then(function () {
          var html = S.buildRelated(data.posts, post, 3);
          if (html) {
            relatedEl.innerHTML = html;
            relatedEl.hidden = false;
          }
        });
      }

      S.setMeta(
        post.title + ' — ' + CFG.title,
        post.excerpt || MD.toPlainText(md).slice(0, 160),
        post.cover
      );

      // Nhảy tới mục đúng nếu địa chỉ có #ten-muc
      if (location.hash) {
        var target = document.getElementById(location.hash.slice(1));
        if (target) target.scrollIntoView();
      }
    })
    .catch(function (err) {
      if (err.message === 'NOT_IN_INDEX') {
        showError('Không tìm thấy bài viết',
          'Bài <code>' + S.escapeHtml(slug) + '</code> chưa được khai báo trong ' +
          '<code>posts/posts.json</code>.');
      } else {
        showError('Không tải được bài viết',
          S.escapeHtml(err.message) +
          '<br><br>Nếu bạn mở file bằng cách nhấp đúp, hãy chạy <code>serve.ps1</code> ' +
          'rồi vào <code>http://localhost:8080</code>.');
      }
    });
})();
