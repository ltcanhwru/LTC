/* ============================================================
   home.js — Trang chủ: danh sách bài viết, tìm kiếm, lọc theo thẻ.
   ============================================================ */
(function () {
  'use strict';

  var S = window.Site;
  var CFG = S.config;

  var grid = document.getElementById('postGrid');
  var searchInput = document.getElementById('searchInput');
  var tagBar = document.getElementById('tagFilters');
  var moreWrap = document.getElementById('moreWrap');

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

  function cardMedia(post, featured) {
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
      return '<span class="tag-pill">' + S.escapeHtml(t) + '</span>';
    }).join('');

    var meta = [S.formatDate(post.date)];
    if (post.readingTime) meta.push(post.readingTime + ' phút đọc');

    return '<article class="post-card' + (featured ? ' is-featured' : '') + '">' +
      cardMedia(post, featured) +
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
            'Thử xoá bớt từ khoá hoặc chọn thẻ khác.') +
        '</div>';
      moreWrap.innerHTML = '';
      return;
    }

    // Bài mới nhất được làm nổi bật, nhưng chỉ khi không đang lọc
    var featuredFirst = !query && !activeTag;

    grid.innerHTML = list.slice(0, shown).map(function (p, i) {
      return cardHtml(p, featuredFirst && i === 0);
    }).join('');

    moreWrap.innerHTML = shown < list.length
      ? '<button class="tag-chip" id="loadMore" type="button">Xem thêm ' +
        (list.length - shown) + ' bài</button>'
      : '';

    var more = document.getElementById('loadMore');
    if (more) more.addEventListener('click', function () { render(false); });
  }

  function buildTagBar() {
    var counts = {};
    allPosts.forEach(function (p) {
      (p.tags || []).forEach(function (t) { counts[t] = (counts[t] || 0) + 1; });
    });
    var tags = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; });

    // Thẻ đến từ menu đầu trang có thể chưa có bài nào — vẫn hiện nút để người đọc thấy
    if (activeTag && tags.indexOf(activeTag) === -1) tags.push(activeTag);
    if (!tags.length) return;

    tagBar.innerHTML =
      '<button class="tag-chip' + (activeTag ? '' : ' is-active') + '" data-tag="" type="button">Tất cả</button>' +
      tags.map(function (t) {
        return '<button class="tag-chip' + (t === activeTag ? ' is-active' : '') +
          '" data-tag="' + S.escapeHtml(t) + '" type="button">' + S.escapeHtml(t) + '</button>';
      }).join('');

    tagBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.tag-chip');
      if (!btn) return;
      activeTag = btn.getAttribute('data-tag') || '';
      Array.prototype.forEach.call(tagBar.children, function (c) {
        c.classList.toggle('is-active', c === btn);
      });
      // Ghi thẻ đang lọc lên địa chỉ để chia sẻ được, và để menu đầu trang sáng đúng mục
      if (history.replaceState) {
        history.replaceState(null, '',
          activeTag ? 'index.html?tag=' + encodeURIComponent(activeTag) : 'index.html');
      }
      render(true);
    });
  }

  /* ---------- Khởi động ---------- */
  // Lọc sẵn theo thẻ nếu địa chỉ có dạng index.html?tag=Cổ phiếu
  activeTag = new URLSearchParams(location.search).get('tag') || '';

  S.mountChrome();
  S.setMeta(
    activeTag ? activeTag + ' — ' + CFG.title : CFG.title,
    CFG.description
  );

  // Đổ nội dung phần mở đầu từ config
  var hero = CFG.hero || {};
  var setText = function (id, val) {
    var el = document.getElementById(id);
    if (el && val) el.textContent = val;
  };
  setText('heroEyebrow', hero.eyebrow);
  setText('heroHeading', hero.heading);
  setText('heroIntro', hero.intro);

  searchInput.addEventListener('input', function () {
    query = searchInput.value.trim();
    render(true);
  });

  S.loadPostIndex()
    .then(function (posts) {
      allPosts = posts;
      buildTagBar();
      render(true);
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
