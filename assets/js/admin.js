(() => {
  const config = window.DNK_SUPABASE;
  const sessionKey = "dnk_admin_session";
  const views = {
    login: document.querySelector("#login-view"),
    dashboard: document.querySelector("#dashboard-view"),
    editor: document.querySelector("#editor-view"),
  };
  const loginForm = document.querySelector("#login-form");
  const postForm = document.querySelector("#post-form");
  let session = readSession();
  let currentFilter = "active";
  let categories = [];
  let posts = [];

  function readSession() {
    try { return JSON.parse(localStorage.getItem(sessionKey)); } catch { return null; }
  }
  function authHeaders(extra = {}) {
    return { apikey: config.anonKey, Authorization: `Bearer ${session.access_token}`, ...extra };
  }
  async function request(path, options = {}, authenticated = true) {
    const headers = authenticated ? authHeaders(options.headers) : { apikey: config.anonKey, ...options.headers };
    const response = await fetch(`${config.url}${path}`, { ...options, headers });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || error.msg || "Không thể kết nối tới Supabase.");
    }
    return response.status === 204 ? null : response.json();
  }
  function show(view) {
    Object.entries(views).forEach(([name, element]) => { element.hidden = name !== view; });
  }
  function message(id, text, success = false) {
    const element = document.querySelector(id);
    element.textContent = text;
    element.classList.toggle("is-success", success);
  }
  function escapeHtml(value = "") {
    return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
  }
  function formatDate(value) {
    return value ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(new Date(value)) : "Chưa xuất bản";
  }
  function slugify(value) {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
  async function ensureAdmin() {
    if (!session?.access_token) return false;
    try {
      const user = await request("/auth/v1/user");
      const profile = await request(`/rest/v1/profiles?select=role&id=eq.${encodeURIComponent(user.id)}`);
      if (profile[0]?.role !== "admin") throw new Error("Tài khoản này không có quyền quản trị.");
      document.querySelector("#admin-email").textContent = user.email;
      return true;
    } catch (error) {
      localStorage.removeItem(sessionKey);
      session = null;
      message("#login-message", error.message);
      return false;
    }
  }
  async function loadCategories() {
    categories = await request("/rest/v1/categories?select=id,name&order=name.asc");
    const select = document.querySelector("#category-select");
    select.innerHTML = '<option value="">Chưa phân loại</option>' + categories.map((category) => `<option value="${category.id}">${escapeHtml(category.name)}</option>`).join("");
  }
  async function loadPosts() {
    message("#dashboard-message", "Đang tải bài viết…", true);
    const deleted = currentFilter === "trash" ? "not.is.null" : "is.null";
    posts = await request(`/rest/v1/posts?select=id,title,slug,status,published_at,deleted_at,category:categories(name)&deleted_at=${deleted}&order=updated_at.desc`);
    const list = document.querySelector("#post-list");
    list.innerHTML = posts.length ? posts.map((post) => `<article class="post-row"><div><h2>${escapeHtml(post.title)}</h2><p class="post-meta">${post.status === "published" ? "Đã xuất bản" : "Bản nháp"} · ${escapeHtml(post.category?.name || "Chưa phân loại")} · ${formatDate(post.published_at)}</p></div><div class="post-actions">${currentFilter === "trash" ? `<button data-action="restore" data-id="${post.id}">Khôi phục</button>` : `<button data-action="edit" data-id="${post.id}">Chỉnh sửa</button><button data-action="delete" data-id="${post.id}">Chuyển thùng rác</button>`}</div></article>`).join("") : "<p>Chưa có bài viết nào.</p>";
    message("#dashboard-message", "");
  }
  function fillEditor(post = null) {
    postForm.reset();
    document.querySelector("#editor-title").textContent = post ? "Chỉnh sửa bài viết" : "Bài viết mới";
    message("#editor-message", "");
    if (!post) return;
    postForm.elements.id.value = post.id;
    postForm.elements.title.value = post.title;
    postForm.elements.slug.value = post.slug;
    postForm.elements.excerpt.value = post.excerpt;
    postForm.elements.content.value = post.content;
    postForm.elements.category_id.value = post.category_id || "";
    document.querySelector("#cover-note").textContent = post.cover_image_url ? "Để trống nếu muốn giữ ảnh đại diện hiện tại." : "PNG, JPG hoặc WebP, tối đa 5 MB.";
  }
  async function openEditor(id) {
    if (!id) { fillEditor(); show("editor"); return; }
    const post = await request(`/rest/v1/posts?select=*&id=eq.${id}`);
    fillEditor(post[0]); show("editor");
  }
  async function uploadCover(file) {
    if (!file) return null;
    if (file.size > 5 * 1024 * 1024) throw new Error("Ảnh đại diện phải nhỏ hơn 5 MB.");
    const extension = file.name.split(".").pop().toLowerCase();
    const path = `${crypto.randomUUID()}.${extension}`;
    await request(`/storage/v1/object/post-images/${path}`, { method: "POST", headers: { "Content-Type": file.type, "x-upsert": "false" }, body: file });
    return `${config.url}/storage/v1/object/public/post-images/${path}`;
  }
  async function savePost(event) {
    event.preventDefault();
    const submitter = event.submitter;
    const data = new FormData(postForm);
    const status = submitter.value;
    const title = data.get("title").trim();
    const slug = slugify(data.get("slug"));
    if (!slug) { message("#editor-message", "Slug không hợp lệ."); return; }
    try {
      submitter.disabled = true;
      message("#editor-message", "Đang lưu…", true);
      const existingId = data.get("id");
      const existing = existingId ? (await request(`/rest/v1/posts?select=cover_image_url,published_at&id=eq.${existingId}`))[0] : null;
      const cover = await uploadCover(data.get("cover_image"));
      const payload = { title, slug, excerpt: data.get("excerpt").trim(), content: data.get("content").trim(), category_id: data.get("category_id") ? Number(data.get("category_id")) : null, status, cover_image_url: cover || existing?.cover_image_url || null };
      if (status === "published") payload.published_at = existing?.published_at || new Date().toISOString();
      if (existingId) await request(`/rest/v1/posts?id=eq.${existingId}`, { method: "PATCH", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify(payload) });
      else await request("/auth/v1/user").then((user) => request("/rest/v1/posts", { method: "POST", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify({ ...payload, author_id: user.id }) }));
      message("#editor-message", status === "published" ? "Đã xuất bản bài viết." : "Đã lưu bản nháp.", true);
      setTimeout(async () => { show("dashboard"); await loadPosts(); }, 500);
    } catch (error) { message("#editor-message", error.message); }
    finally { submitter.disabled = false; }
  }
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(loginForm);
    try {
      message("#login-message", "Đang đăng nhập…", true);
      session = await request("/auth/v1/token?grant_type=password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: data.get("email"), password: data.get("password") }) }, false);
      localStorage.setItem(sessionKey, JSON.stringify(session));
      if (await ensureAdmin()) { await loadCategories(); show("dashboard"); await loadPosts(); }
    } catch (error) { message("#login-message", error.message); }
  });
  document.querySelector("#logout-button").addEventListener("click", () => { localStorage.removeItem(sessionKey); session = null; show("login"); loginForm.reset(); });
  document.querySelector("#new-post-button").addEventListener("click", () => openEditor());
  document.querySelector("#back-button").addEventListener("click", async () => { show("dashboard"); await loadPosts(); });
  document.querySelector("#post-list").addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-action]"); if (!button) return;
    const { action, id } = button.dataset;
    try {
      if (action === "edit") return openEditor(id);
      await request(`/rest/v1/posts?id=eq.${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify({ deleted_at: action === "delete" ? new Date().toISOString() : null }) });
      await loadPosts();
    } catch (error) { message("#dashboard-message", error.message); }
  });
  document.querySelector(".admin-tabs").addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-filter]"); if (!button) return;
    currentFilter = button.dataset.filter;
    document.querySelectorAll(".admin-tabs button").forEach((tab) => tab.classList.toggle("is-active", tab === button));
    await loadPosts();
  });
  postForm.elements.title.addEventListener("input", () => { if (!postForm.elements.id.value) postForm.elements.slug.value = slugify(postForm.elements.title.value); });
  postForm.addEventListener("submit", savePost);
  (async () => { if (await ensureAdmin()) { await loadCategories(); show("dashboard"); await loadPosts(); } else show("login"); })();
})();
