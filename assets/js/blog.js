(() => {
  const config = window.DNK_SUPABASE;
  const headers = { apikey: config.anonKey };
  const api = (path) => fetch(`${config.url}${path}`, { headers }).then(async (response) => {
    if (!response.ok) throw new Error("Không thể tải bài viết.");
    return response.json();
  });
  const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
  const safeUrl = (url) => /^(https?:\/\/|\/)/i.test(url) ? url : "#";
  const date = (value) => new Intl.DateTimeFormat("vi-VN", { dateStyle: "long" }).format(new Date(value));
  function markdown(source) {
    const inline = (text) => escapeHtml(text).replace(/!\[([^\]]*)\]\(([^ )]+)\)/g, (_, alt, url) => `<img src="${safeUrl(url)}" alt="${alt}" loading="lazy">`).replace(/\[([^\]]+)\]\(([^ )]+)\)/g, (_, label, url) => `<a href="${safeUrl(url)}" rel="noopener noreferrer">${label}</a>`).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>");
    const lines = source.split("\n"); let html = ""; let list = false;
    lines.forEach((line) => { const heading = line.match(/^(#{1,3})\s+(.+)/); const item = line.match(/^[-*]\s+(.+)/); if (item) { if (!list) { html += "<ul>"; list = true; } html += `<li>${inline(item[1])}</li>`; return; } if (list) { html += "</ul>"; list = false; } if (heading) { const level = heading[1].length + 1; html += `<h${level}>${inline(heading[2])}</h${level}>`; } else if (line.trim()) html += `<p>${inline(line)}</p>`; });
    return html + (list ? "</ul>" : "");
  }
  function card(post) { const image = post.cover_image_url ? `<img class="insight-image" src="${safeUrl(post.cover_image_url)}" alt="" loading="lazy">` : ""; return `<article class="insight-card reveal is-visible">${image}<span class="tag">${escapeHtml(post.category?.name || "Góc nhìn")}</span><h3><a href="pages/blog.html?slug=${encodeURIComponent(post.slug)}">${escapeHtml(post.title)}</a></h3><p>${escapeHtml(post.excerpt)}</p><a class="link-arrow" href="pages/blog.html?slug=${encodeURIComponent(post.slug)}">Đọc bài viết →</a></article>`; }
  async function renderIndex() { const target = document.querySelector("#insight-posts"); if (!target) return; try { const posts = await api("/rest/v1/posts?select=title,slug,excerpt,cover_image_url,published_at,category:categories(name)&status=eq.published&deleted_at=is.null&order=published_at.desc&limit=3"); target.innerHTML = posts.length ? posts.map(card).join("") : "<p class=\"blog-empty\">Các bài viết mới sẽ sớm được cập nhật.</p>"; } catch { target.innerHTML = "<p class=\"blog-empty\">Chưa thể tải bài viết lúc này.</p>"; } }
  async function renderDetail() { const target = document.querySelector("#blog-post"); if (!target) return; const slug = new URLSearchParams(window.location.search).get("slug"); if (!slug) { target.innerHTML = "<h1>Không tìm thấy bài viết</h1>"; return; } try { const posts = await api(`/rest/v1/posts?select=title,excerpt,content,cover_image_url,published_at,category:categories(name)&slug=eq.${encodeURIComponent(slug)}&status=eq.published&deleted_at=is.null`); const post = posts[0]; if (!post) throw new Error(); document.title = `${post.title} | DNK's House`; target.innerHTML = `<p class="eyebrow">${escapeHtml(post.category?.name || "BLOG")}</p><h1>${escapeHtml(post.title)}</h1><p class="blog-date">${date(post.published_at)}</p>${post.cover_image_url ? `<img class="blog-cover" src="${safeUrl(post.cover_image_url)}" alt="" />` : ""}<div class="blog-body">${markdown(post.content)}</div>`; } catch { target.innerHTML = "<h1>Không tìm thấy bài viết</h1><p>Bài viết có thể đã được gỡ hoặc đường dẫn không chính xác.</p>"; } }
  renderIndex(); renderDetail();
})();
