/* ============================================================
   site.js — Phần dùng chung cho mọi trang:
   dựng header/footer, chuyển sáng/tối, và vài hàm tiện ích.
   ============================================================ */
(function (global) {
  'use strict';

  var CFG = global.SITE || {};

  /* ---------- Chế độ sáng / tối ---------- */
  var THEME_KEY = 'blog-theme';

  function readStoredTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }
  function storeTheme(v) {
    try { localStorage.setItem(THEME_KEY, v); } catch (e) { /* chế độ riêng tư: bỏ qua */ }
  }
  function systemPrefersDark() {
    return global.matchMedia && global.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }
  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }
  function toggleTheme() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    storeTheme(next);
  }
  // Áp dụng ngay để tránh nhấp nháy khi tải trang
  applyTheme(readStoredTheme() || (systemPrefersDark() ? 'dark' : 'light'));

  /* ---------- Tiện ích ---------- */
  var MONTHS = ['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6',
                'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'];

  function parseDate(s) {
    var m = String(s || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }

  function formatDate(s) {
    var d = parseDate(s);
    if (!d) return '';
    return d.getDate() + ' ' + MONTHS[d.getMonth()] + ', ' + d.getFullYear();
  }

  // Ước lượng thời gian đọc: ~200 từ mỗi phút
  function readingTime(text) {
    var words = String(text || '').trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ---------- Biểu tượng SVG ---------- */
  var ICONS = {
    sun: '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>'
  };

  /* ---------- Dựng header ---------- */
  /* Trang và thẻ đang xem — dùng để tô đậm mục menu tương ứng */
  function currentPage() {
    var file = location.pathname.split('/').pop();
    return file || 'index.html';
  }
  function currentTag() {
    return new URLSearchParams(location.search).get('tag') || '';
  }

  function buildHeader() {
    var links = (CFG.nav || []).slice();

    // Kênh YouTube tự thêm vào cuối nếu có khai báo trong config
    if (CFG.social && CFG.social.youtube) {
      links.push({ label: 'Kênh YouTube', href: CFG.social.youtube, external: true });
    }

    var page = currentPage();
    var tag = currentTag();

    var linksHtml = links.map(function (l) {
      var href, active;

      if (l.tag) {
        href = 'index.html?tag=' + encodeURIComponent(l.tag);
        active = (page === 'index.html' && tag === l.tag);
      } else {
        href = l.href;
        // "Trang chủ" chỉ sáng khi đang ở trang chủ và không lọc theo thẻ nào
        active = (page === l.href) && (page !== 'index.html' || !tag);
      }

      return '<a href="' + href + '"' +
        (l.external ? ' target="_blank" rel="noopener noreferrer"' : '') +
        (active ? ' class="is-active"' : '') +
        '>' + escapeHtml(l.label) + '</a>';
    }).join('');

    return '' +
      '<header class="site-header">' +
        '<div class="wrap wrap-wide nav">' +
          '<a class="brand" href="index.html">' +
            '<span class="brand-mark">' + escapeHtml(CFG.initials || 'B') + '</span>' +
            '<span>' + escapeHtml(CFG.title || 'Blog') + '</span>' +
          '</a>' +
          '<nav class="nav-links" id="navLinks">' + linksHtml +
            // Ô tìm kiếm nằm ngay sau mục cuối của menu.
            // Trên điện thoại nó nằm gọn trong menu thu gọn.
            '<label class="search-field">' +
              '<span class="visually-hidden">Tìm bài viết</span>' +
              ICONS.search +
              '<input type="search" id="searchInput" placeholder="Tìm bài viết…" autocomplete="off">' +
            '</label>' +
          '</nav>' +
          '<button class="icon-btn" id="themeToggle" type="button" aria-label="Đổi giao diện sáng/tối">' +
            ICONS.sun + ICONS.moon +
          '</button>' +
          '<button class="icon-btn nav-toggle" id="navToggle" type="button" aria-label="Mở menu" aria-expanded="false">' +
            ICONS.menu +
          '</button>' +
        '</div>' +
      '</header>';
  }

  /* ---------- Dựng footer ---------- */
  function buildFooter() {
    var s = CFG.social || {};
    var items = [];
    if (s.youtube)  items.push('<a href="' + s.youtube + '" target="_blank" rel="noopener noreferrer">YouTube</a>');
    if (s.facebook) items.push('<a href="' + s.facebook + '" target="_blank" rel="noopener noreferrer">Facebook</a>');
    if (s.github)   items.push('<a href="' + s.github + '" target="_blank" rel="noopener noreferrer">GitHub</a>');
    if (s.x)        items.push('<a href="' + s.x + '" target="_blank" rel="noopener noreferrer">X</a>');
    if (CFG.author && CFG.author.email) {
      items.push('<a href="mailto:' + CFG.author.email + '">' + escapeHtml(CFG.author.email) + '</a>');
    }

    return '' +
      '<footer class="site-footer">' +
        '<div class="wrap wrap-wide footer-inner">' +
          '<span>© ' + new Date().getFullYear() + ' ' + escapeHtml(CFG.title || '') + '</span>' +
          (items.length ? '<nav class="footer-links">' + items.join('') + '</nav>' : '') +
        '</div>' +
      '</footer>';
  }

  /* ---------- Cột dọc bên phải ---------- */

  /* Ô "Bài xem nhiều" — xếp hạng theo lượt xem, kèm số đếm */
  function buildPopularWidget(posts) {
    if (!global.Views || !posts || !posts.length) return '';

    var top = global.Views.rank(posts, CFG.popularCount || 5);

    var items = top.map(function (entry, i) {
      var p = entry.post;
      return '<li class="rank-item">' +
        '<span class="rank-num">' + (i + 1) + '</span>' +
        '<span class="rank-body">' +
          '<a href="post.html?p=' + encodeURIComponent(p.slug) + '">' + escapeHtml(p.title) + '</a>' +
          '<span class="rank-views">' + ICONS.eye +
            global.Views.format(entry.views) + ' lượt xem' +
          '</span>' +
        '</span>' +
      '</li>';
    }).join('');

    return '<section class="widget">' +
      '<h3>Bài xem nhiều</h3>' +
      '<ol class="rank-list">' + items + '</ol>' +
      '<p class="widget-note">Đếm theo số lần mở bài trên trình duyệt của bạn.</p>' +
    '</section>';
  }

  /* Ô "Sách tiêu biểu" — lấy từ danh sách books trong config.js */
  function buildBooksWidget() {
    var books = CFG.books || [];
    if (!books.length) return '';

    var items = books.map(function (b) {
      var cover = b.cover
        ? '<img class="book-cover" src="' + escapeHtml(b.cover) + '" alt="" loading="lazy">'
        : '<span class="book-cover is-placeholder">' +
            escapeHtml((b.title || '?').trim().charAt(0).toUpperCase()) + '</span>';

      var title = b.link
        ? '<a href="' + escapeHtml(b.link) + '">' + escapeHtml(b.title) + '</a>'
        : escapeHtml(b.title);

      return '<li class="book">' + cover +
        '<span class="book-body">' +
          '<span class="book-title">' + title + '</span>' +
          (b.author ? '<span class="book-author">' + escapeHtml(b.author) + '</span>' : '') +
          (b.note ? '<span class="book-note">' + escapeHtml(b.note) + '</span>' : '') +
        '</span>' +
      '</li>';
    }).join('');

    return '<section class="widget">' +
      '<h3>Sách tiêu biểu</h3>' +
      '<ul class="book-list">' + items + '</ul>' +
    '</section>';
  }

  /* ---------- Bài liên quan ----------
     Cách chọn: bài nào trùng nhiều thẻ nhất thì đứng trước.
     Bằng điểm nhau thì bài mới hơn thắng. Không có bài nào trùng thẻ
     thì lấy tạm mấy bài mới nhất, để cuối bài không bị trống trơn. */
  function pickRelated(posts, current, limit) {
    limit = limit || 3;
    var myTags = (current.tags || []);

    var scored = posts
      .filter(function (p) { return p.slug !== current.slug; })
      .map(function (p) {
        var shared = (p.tags || []).filter(function (t) {
          return myTags.indexOf(t) !== -1;
        });
        return { post: p, score: shared.length, sharedTag: shared[0] || (p.tags || [])[0] || '' };
      })
      .sort(function (a, b) {
        if (b.score !== a.score) return b.score - a.score;
        return String(b.post.date).localeCompare(String(a.post.date));
      });

    return scored.slice(0, limit);
  }

  function buildRelated(posts, current, limit) {
    var picks = pickRelated(posts, current, limit);
    if (!picks.length) return '';

    var cards = picks.map(function (entry) {
      var p = entry.post;
      var views = global.Views ? global.Views.getCount(p.slug) : 0;

      var meta = [formatDate(p.date)];
      if (views > 0) meta.push(global.Views.format(views) + ' lượt xem');

      return '<article class="related-card">' +
        (entry.sharedTag ? '<span class="related-tag">' + escapeHtml(entry.sharedTag) + '</span>' : '') +
        '<h3><a href="post.html?p=' + encodeURIComponent(p.slug) + '">' +
          escapeHtml(p.title) + '</a></h3>' +
        (p.excerpt ? '<p>' + escapeHtml(p.excerpt) + '</p>' : '') +
        '<span class="related-meta">' + meta.join(' · ') + '</span>' +
      '</article>';
    }).join('');

    return '<h2>Bài liên quan</h2><div class="related-grid">' + cards + '</div>';
  }

  /* Ghép cột phải. Vào mục "Sách" thì ô sách hiện lên trên cùng. */
  function buildSidebar(posts, activeTag) {
    var parts = [];
    if (activeTag === 'Sách') parts.push(buildBooksWidget());
    parts.push(buildPopularWidget(posts));
    return parts.filter(Boolean).join('');
  }

  /* ---------- Gắn header/footer + sự kiện ---------- */
  function mountChrome() {
    var head = document.getElementById('siteHeader');
    var foot = document.getElementById('siteFooter');
    if (head) head.outerHTML = buildHeader();
    if (foot) foot.outerHTML = buildFooter();

    var toggle = document.getElementById('themeToggle');
    if (toggle) toggle.addEventListener('click', toggleTheme);

    var navBtn = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');
    if (navBtn && navLinks) {
      navBtn.addEventListener('click', function () {
        var open = navLinks.classList.toggle('is-open');
        navBtn.setAttribute('aria-expanded', String(open));
      });
    }

    // Theo dõi thay đổi giao diện hệ thống khi người dùng chưa chọn thủ công
    if (global.matchMedia && !readStoredTheme()) {
      var mq = global.matchMedia('(prefers-color-scheme: dark)');
      var onChange = function (e) { applyTheme(e.matches ? 'dark' : 'light'); };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  }

  /* ---------- Tải chỉ mục bài viết ---------- */
  function loadPostIndex() {
    return fetch('posts/posts.json', { cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (list) {
        return (Array.isArray(list) ? list : [])
          .filter(function (p) { return p && p.slug && p.draft !== true; })
          .sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
      });
  }

  /* ---------- Đặt tiêu đề + thẻ meta ---------- */
  function setMeta(title, description, image) {
    document.title = title;
    var set = function (attr, key, val) {
      if (!val) return;
      var el = document.head.querySelector('meta[' + attr + '="' + key + '"]');
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', val);
    };
    set('name', 'description', description);
    set('property', 'og:title', title);
    set('property', 'og:description', description);
    set('property', 'og:type', 'article');
    set('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    if (image) {
      set('property', 'og:image', new URL(image, location.href).href);
    }
  }

  /* ---------- Biểu đồ SVG ----------
     Đổi thẻ <img src="...svg"> thành SVG nhúng thẳng vào trang. Khi nằm trong
     trang, biểu đồ dùng chung các biến màu --cv-* của style.css nên đổi màu
     ngay lúc bấm nút sáng/tối. Tải hỏng, hay trình duyệt quá cũ, thì thẻ ảnh
     được giữ nguyên — biểu đồ vẫn hiện, chỉ là màu cố định theo file. */
  var svgText = {};   // nhớ nội dung đã tải: mỗi file chỉ tải một lần
  var svgSeq = 0;     // số thứ tự để các id bên trong không đụng nhau

  /* Nhiều biểu đồ trên cùng một trang có thể trùng id (đầu mũi tên, gradient…),
     mà id trùng thì trình duyệt chỉ dùng cái đầu tiên. Thêm số vào sau mỗi id. */
  function renameSvgIds(svg, seq) {
    var ids = [];
    Array.prototype.forEach.call(svg.querySelectorAll('[id]'), function (el) {
      ids.push(el.getAttribute('id'));
    });
    if (!ids.length) return;

    var inner = svg.innerHTML;
    ids.forEach(function (id) {
      inner = inner.split('url(#' + id + ')').join('url(#' + id + '-' + seq + ')');
    });
    svg.innerHTML = inner;

    Array.prototype.forEach.call(svg.querySelectorAll('[id]'), function (el) {
      el.setAttribute('id', el.getAttribute('id') + '-' + seq);
    });
  }

  function inlineCharts(root) {
    if (!root || !global.fetch || !global.DOMParser) return;

    Array.prototype.forEach.call(root.querySelectorAll('img[src$=".svg"]'), function (img) {
      var src = img.getAttribute('src');
      if (!src) return;

      if (!svgText[src]) {
        svgText[src] = fetch(src).then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.text();
        });
      }

      svgText[src].then(function (txt) {
        var doc = new DOMParser().parseFromString(txt, 'image/svg+xml');
        if (doc.querySelector('parsererror')) return;

        var svg = doc.documentElement;
        if (!svg || String(svg.nodeName).toLowerCase() !== 'svg') return;
        svg = document.importNode(svg, true);

        // Bỏ bề ngang cố định trong file để CSS quyết định kích thước
        svg.removeAttribute('width');
        svg.removeAttribute('height');
        if (img.alt) svg.setAttribute('aria-label', img.alt);

        renameSvgIds(svg, ++svgSeq);

        var host = img.parentNode;
        if (!host) return;
        host.replaceChild(svg, img);
        host.classList.add('chart-host');
      }).catch(function () { /* giữ nguyên thẻ ảnh */ });
    });
  }

  global.Site = {
    config: CFG,
    icons: ICONS,
    buildSidebar: buildSidebar,
    buildRelated: buildRelated,
    mountChrome: mountChrome,
    loadPostIndex: loadPostIndex,
    formatDate: formatDate,
    parseDate: parseDate,
    readingTime: readingTime,
    escapeHtml: escapeHtml,
    setMeta: setMeta,
    inlineCharts: inlineCharts
  };
})(window);
