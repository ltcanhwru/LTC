/* markdown.js — chuyển Markdown -> HTML. Tự viết, không phụ thuộc thư viện ngoài.
   Hỗ trợ: heading, đậm/nghiêng/gạch, link, ảnh, danh sách, trích dẫn, code block,
   bảng, đường kẻ ngang, nhúng YouTube.
   Nhúng video: đặt link YouTube trên một dòng riêng, hoặc viết @youtube[MA_VIDEO]. */
(function (global) {
  'use strict';

  var NUL = String.fromCharCode(0); // ky tu canh giu, tam giau code span

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function youtubeId(url) {
    var m = String(url).match(
      /(?:youtube\.com\/(?:watch\?(?:[^&\s]*&)*v=|embed\/|live\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
    );
    return m ? m[1] : null;
  }

  function embedYoutube(id) {
    return '<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/' + id +
      '" title="Video YouTube" loading="lazy" frameborder="0" ' +
      'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
      'allowfullscreen></iframe></div>';
  }

  /* ---------- Inline (trong một dòng) ---------- */
  function inline(text) {
    var codes = [];
    text = String(text).replace(/`([^`]+)`/g, function (_, c) {
      codes.push(c);
      return NUL + 'C' + (codes.length - 1) + NUL;
    });

    text = escapeHtml(text);

    // Ảnh: ![alt](url "title")
    text = text.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+&quot;([^&]*)&quot;)?\)/g, function (_, alt, src, title) {
      return '<img src="' + src + '" alt="' + alt + '"' + (title ? ' title="' + title + '"' : '') + ' loading="lazy">';
    });

    // Link: [text](url "title")
    text = text.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+&quot;([^&]*)&quot;)?\)/g, function (_, label, href, title) {
      var ext = /^https?:\/\//.test(href) ? ' target="_blank" rel="noopener noreferrer"' : '';
      return '<a href="' + href + '"' + (title ? ' title="' + title + '"' : '') + ext + '>' + label + '</a>';
    });

    // Link trần chưa được bọc thẻ
    text = text.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, function (m, pre, url) {
      return pre + '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + url + '</a>';
    });

    // Nhấn mạnh
    text = text.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/(^|[^*\w])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    text = text.replace(/(^|[^_\w])_([^_\n]+)_/g, '$1<em>$2</em>');
    text = text.replace(/~~([^~]+)~~/g, '<del>$1</del>');
    text = text.replace(/==([^=]+)==/g, '<mark>$1</mark>');

    // Xuống dòng cứng (2 dấu cách cuối dòng)
    text = text.replace(/ {2,}\n/g, '<br>\n');

    // Trả code span về
    text = text.replace(new RegExp(NUL + 'C(\\d+)' + NUL, 'g'), function (_, i) {
      return '<code>' + escapeHtml(codes[+i]) + '</code>';
    });

    return text;
  }

  function slugifyHeading(s) {
    return String(s)
      .toLowerCase()
      .normalize('NFD')
      .replace(new RegExp("[\u0300-\u036f]", "g"), "")
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }

  /* ---------- Khối ---------- */
  function render(md) {
    var src = String(md == null ? '' : md).replace(/\r\n?/g, '\n');
    var lines = src.split('\n');
    var out = [];
    var i = 0;

    function isBlank(s) { return /^\s*$/.test(s); }

    while (i < lines.length) {
      var line = lines[i];

      if (isBlank(line)) { i++; continue; }

      // Code block
      var fence = line.match(/^\s*```+\s*([\w+#-]*)\s*$/);
      if (fence) {
        var lang = fence[1] || '';
        var buf = [];
        i++;
        while (i < lines.length && !/^\s*```+\s*$/.test(lines[i])) { buf.push(lines[i]); i++; }
        i++;
        out.push('<pre class="code-block"' + (lang ? ' data-lang="' + escapeHtml(lang) + '"' : '') +
          '><code>' + escapeHtml(buf.join('\n')) + '</code></pre>');
        continue;
      }

      // Đường kẻ ngang
      if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { out.push('<hr>'); i++; continue; }

      // Heading
      var h = line.match(/^\s*(#{1,6})\s+(.*)$/);
      if (h) {
        var lvl = h[1].length;
        var txt = h[2].replace(/\s+#+\s*$/, '');
        out.push('<h' + lvl + ' id="' + slugifyHeading(txt) + '">' + inline(txt) + '</h' + lvl + '>');
        i++;
        continue;
      }

      // Nhúng YouTube
      var yt = line.match(/^\s*@youtube\[([A-Za-z0-9_-]{11})\]\s*$/);
      if (yt) { out.push(embedYoutube(yt[1])); i++; continue; }
      if (/^\s*https?:\/\/\S+\s*$/.test(line)) {
        var vid = youtubeId(line.trim());
        if (vid) { out.push(embedYoutube(vid)); i++; continue; }
      }

      // Trích dẫn
      if (/^\s*>\s?/.test(line)) {
        var qbuf = [];
        while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
          qbuf.push(lines[i].replace(/^\s*>\s?/, ''));
          i++;
        }
        out.push('<blockquote>' + render(qbuf.join('\n')) + '</blockquote>');
        continue;
      }

      // Bảng
      if (/\|/.test(line) && i + 1 < lines.length &&
          /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(lines[i + 1]) && /-/.test(lines[i + 1])) {
        var splitRow = function (r) {
          return r.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(function (c) { return c.trim(); });
        };
        var head = splitRow(line);
        var aligns = splitRow(lines[i + 1]).map(function (c) {
          if (/^:.*:$/.test(c)) return 'center';
          if (/:$/.test(c)) return 'right';
          if (/^:/.test(c)) return 'left';
          return '';
        });
        i += 2;
        var body = [];
        while (i < lines.length && /\|/.test(lines[i]) && !isBlank(lines[i])) { body.push(splitRow(lines[i])); i++; }
        var th = head.map(function (c, k) {
          return '<th' + (aligns[k] ? ' style="text-align:' + aligns[k] + '"' : '') + '>' + inline(c) + '</th>';
        }).join('');
        var tb = body.map(function (row) {
          return '<tr>' + row.map(function (c, k) {
            return '<td' + (aligns[k] ? ' style="text-align:' + aligns[k] + '"' : '') + '>' + inline(c) + '</td>';
          }).join('') + '</tr>';
        }).join('');
        out.push('<div class="table-wrap"><table><thead><tr>' + th + '</tr></thead><tbody>' + tb + '</tbody></table></div>');
        continue;
      }

      // Danh sách
      if (/^\s*([-*+]|\d+[.)])\s+/.test(line)) {
        var listLines = [];
        while (i < lines.length && !isBlank(lines[i]) &&
               (/^\s*([-*+]|\d+[.)])\s+/.test(lines[i]) || /^\s{2,}\S/.test(lines[i]))) {
          listLines.push(lines[i]);
          i++;
        }
        out.push(buildList(listLines));
        continue;
      }

      // HTML thô
      if (/^\s*<[a-zA-Z!/]/.test(line)) {
        var hbuf = [];
        while (i < lines.length && !isBlank(lines[i])) { hbuf.push(lines[i]); i++; }
        out.push(hbuf.join('\n'));
        continue;
      }

      // Đoạn văn
      var pbuf = [];
      while (i < lines.length && !isBlank(lines[i]) &&
        !/^\s*(#{1,6}\s|>|```|([-*+]|\d+[.)])\s|<[a-zA-Z!/])/.test(lines[i]) &&
        !/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(lines[i])) {
        pbuf.push(lines[i]);
        i++;
      }
      if (pbuf.length) out.push('<p>' + inline(pbuf.join('\n')) + '</p>');
      else i++;
    }

    return out.join('\n');
  }

  /* Dựng danh sách (hỗ trợ lồng theo thụt lề) */
  function buildList(listLines) {
    var items = [];
    listLines.forEach(function (l) {
      var m = l.match(/^(\s*)([-*+]|\d+[.)])\s+(.*)$/);
      if (m) {
        items.push({
          indent: m[1].replace(/\t/g, '    ').length,
          ordered: /\d/.test(m[2]),
          text: m[3]
        });
      } else if (items.length) {
        items[items.length - 1].text += '\n' + l.trim();
      }
    });
    if (!items.length) return '';

    var pos = 0;
    function build(indent) {
      var ordered = items[pos].ordered;
      var html = '<' + (ordered ? 'ol' : 'ul') + '>';
      while (pos < items.length && items[pos].indent >= indent) {
        if (items[pos].indent > indent) {
          html = html.replace(/<\/li>$/, '') + build(items[pos].indent) + '</li>';
          continue;
        }
        var body = inline(items[pos].text).replace(/^\[([ xX])\]\s*/, function (_, c) {
          return '<input type="checkbox" disabled' + (/[xX]/.test(c) ? ' checked' : '') + '> ';
        });
        html += '<li>' + body + '</li>';
        pos++;
      }
      return html + '</' + (ordered ? 'ol' : 'ul') + '>';
    }
    return build(items[0].indent);
  }

  /* Markdown -> văn bản thuần (dùng cho tóm tắt, meta description) */
  function toPlainText(md) {
    return String(md == null ? '' : md)
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/@youtube\[[^\]]*\]/g, ' ')
      .replace(/^\s*>\s?/gm, '')
      .replace(/^\s*#{1,6}\s+/gm, '')
      .replace(/[*_`~#|]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  global.Markdown = {
    render: render,
    toPlainText: toPlainText,
    youtubeId: youtubeId,
    escapeHtml: escapeHtml
  };
})(window);
