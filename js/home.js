/* ============================================================
   home.js — Trang chủ: danh sách bài viết, tìm kiếm, lọc theo chủ đề,
   và cột dọc bên phải.
   ============================================================ */
(function () {
  'use strict';

  var S = window.Site;
  var CFG = S.config;

  var grid = document.getElementById('postGrid');
  var moreWrap = document.getElementById('moreWrap');
  var sidebar = document.getElementById('sidebar');
  var searchInput;   // nằm trong thanh menu, lấy sau khi dựng header

  var allPosts = [];
  var activeTag = '';
  var query = '';
  var shown = 0;
  var pageSize = CFG.pageSize || 9;

  /* Bỏ dấu tiếng Việt để tìm kiếm dễ trúng hơn */
  function normalize(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd');
  }

  function matches(post) {
    if (activeTag && (post.tags || []).indexOf(activeTag) === -1) return false;
    if (!query) return true;
    var haystack = normalize(
      [post.title, post.excerpt, (post.tags || []).join(' ')].join(' ')
    );
    return normalize(query).split(/\s+/).every(function (w) {
      return haystack.indexOf(w) !== -1;
    });
  }

  function cardMedia(post) {
    var badge = post.video
      ? '<span class="badge-video">' + S.icons.play + 'VLOG</span>'
      : '';

    if (post.cover) {
      return '<div class="post-card-media">' +
        '<img src="' + S.escapeHtml(post.cover) + '" alt="" loading="lazy">' + badge +
        '</div>';
    }
    // Không có ảnh bìa: dùng ảnh thumbnail YouTube nếu bài có video
    if (post.video) {
      var id = window.Markdown.youtubeId(post.video) || post.video;
      if (/^[A-Za-z0-9_-]{11}$/.test(id)) {
        return '<div class="post-card-media">' +
          '<img src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg" alt="" loading="lazy">' + badge +
          '</div>';
      }
    }
    // Cuối cùng: ô màu với chữ cái đầu của tiêu đề
    return '<div class="post-card-media is-placeholder">' +
      S.escapeHtml((post.title || '?').trim().charAt(0).toUpperCase()) + badge +
      '</div>';
  }

  function cardHtml(post, featured) {
    var tags = (post.tags || []).slice(0, 3).map(function (t) {
      return '<a class="tag-pill" href="index.html?tag=' + encodeURIComponent(t) + '">' +
        S.escapeHtml(t) + '</a>';
    }).join('');

    var views = window.Views ? window.Views.getCount(post.slug) : 0;

    var meta = [S.formatDate(post.date)];
    if (post.readingTime) meta.push(post.readingTime + ' phút đọc');
    if (views > 0) meta.push(window.Views.format(views) + ' lượt xem');

    return '<article class="post-card' + (featured ? ' is-featured' : '') + '">' +
      cardMedia(post) +
      '<div class="post-card-body">' +
        '<div class="post-meta">' +
          meta.filter(Boolean).join('<span class="dot">·</span>') +
        '</div>' +
        '<h2><a href="post.html?p=' + encodeURIComponent(post.slug) + '">' +
          S.escapeHtml(post.title) + '</a></h2>' +
        '<p>' + S.escapeHtml(post.excerpt || '') + '</p>' +
        (tags ? '<div class="post-card-tags">' + tags + '</div>' : '') +
      '</div>' +
    '</article>';
  }

  function render(reset) {
    var list = allPosts.filter(matches);

    if (reset) shown = 0;
    shown = Math.min(list.length, shown + pageSize);

    if (!list.length) {
      grid.innerHTML = '<div class="empty-state">' +
        (activeTag && !query
          ? '<strong>Mục “' + S.escapeHtml(activeTag) + '” chưa có bài nào</strong>' +
            'Bài viết sẽ hiện ở đây khi bạn gắn thẻ <code>' + S.escapeHtml(activeTag) +
            '</code> cho nó trong <code>posts.json</code>.'
          : '<strong>Chưa có bài nào khớp</strong>' +
            'Thử xoá bớt từ khoá, hoặc chọn mục khác trên thanh menu.') +
        '</div>';
      moreWrap.innerHTML = '';
      return;
    }

    // Bài mới nhất được làm nổi bật, nhưng chỉ khi không lọc và không tìm kiếm
    var featuredFirst = !query && !activeTag;

    grid.innerHTML = list.slice(0, shown).map(function (p, i) {
      return cardHtml(p, featuredFirst && i === 0);
    }).join('');

    // Ảnh bìa dạng .svg được nhúng thẳng vào trang để đổi màu theo giao diện
    S.inlineCharts(grid);

    moreWrap.innerHTML = shown < list.length
      ? '<button class="tag-chip" id="loadMore" type="button">Xem thêm ' +
        (list.length - shown) + ' bài</button>'
      : '';

    var more = document.getElementById('loadMore');
    if (more) more.addEventListener('click', function () { render(false); });
  }

  /* Đổi phần mở đầu theo chủ đề đang xem */
  function renderHero() {
    var hero = CFG.hero || {};
    var setText = function (id, val) {
      var el = document.getElementById(id);
      if (el) el.textContent = val || '';
    };

    if (activeTag) {
      var count = allPosts.filter(function (p) {
        return (p.tags || []).indexOf(activeTag) !== -1;
      }).length;
      setText('heroEyebrow', 'Chủ đề');
      setText('heroHeading', activeTag);
      setText('heroIntro', count
        ? count + ' bài viết trong mục này.'
        : 'Mục này chưa có bài nào.');
    } else {
      setText('heroEyebrow', hero.eyebrow);
      setText('heroHeading', hero.heading);
      setText('heroIntro', hero.intro);
    }
  }

  /* ---------- Khởi động ---------- */
  // Lọc sẵn theo chủ đề nếu địa chỉ có dạng index.html?tag=Cổ phiếu
  activeTag = new URLSearchParams(location.search).get('tag') || '';

  S.mountChrome();
  S.setMeta(
    activeTag ? activeTag + ' — ' + CFG.title : CFG.title,
    CFG.description
  );

  // Ô tìm kiếm do site.js dựng ra cùng thanh menu, nên lấy sau mountChrome
  searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      query = searchInput.value.trim();
      render(true);
    });
  }

  S.loadPostIndex()
    .then(function (posts) {
      allPosts = posts;
      renderHero();
      render(true);
      if (sidebar) sidebar.innerHTML = S.buildSidebar(posts, activeTag);
    })
    .catch(function (err) {
      grid.innerHTML = '<div class="empty-state">' +
        '<strong>Không đọc được danh sách bài viết</strong>' +
        'Kiểm tra file <code>posts/posts.json</code>. Nếu bạn đang mở file trực tiếp bằng ' +
        'cách nhấp đúp vào <code>index.html</code>, hãy chạy <code>serve.ps1</code> ' +
        'rồi mở <code>http://localhost:8080</code> — trình duyệt chặn đọc file khi không qua máy chủ.' +
        '<br><br><small>' + S.escapeHtml(err.message) + '</small>' +
        '</div>';
      moreWrap.innerHTML = '';
    });
})();
