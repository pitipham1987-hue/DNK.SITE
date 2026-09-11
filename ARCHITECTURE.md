# DNK's House — Runtime Architecture (9.2026)

## Architecture Overview: Static Frontend + Serverless Backend

**DNK's House** is a **static landing page** (HTML5/CSS3/vanilla JS) for an AI Agents customer support service. No build step, no backend server. All runtime logic flows through:
- **Frontend**: Browser-rendered pages + vanilla JavaScript modules
- **Backend**: Supabase PostgreSQL + REST API + Google OAuth
- **Security**: Row-Level Security (RLS) at database layer enforces all access control

---

## Core Components (10 main)

### 1. **Browser Client**
- Hosts all rendered pages and DOM manipulation
- Loads CSS cascade: tokens → base → components → admin
- Executes JavaScript modules (main.js, contact.js, blog.js, admin.js)
- Stores contact form locally (localStorage) — no backend required
- Initiates OAuth redirect to Supabase Auth

### 2. **Public Pages (HTML)**
- **index.html**: Hero section, features grid, pricing, insights (3 blog posts), CTA
- **pages/about.html**: Company mission, team placeholder
- **pages/services.html**: Service details, benefits list
- **pages/contact.html**: Contact form (client-side validation, localStorage)
- **pages/blog.html**: Blog post detail view by slug (fetched from Supabase)

### 3. **Admin Dashboard**
- **admin/index.html**: Google OAuth login → role check (is_admin) → blog CRUD interface
- Single-page app: login view → dashboard → editor (transitions via JS)
- Create/edit posts: title, slug, excerpt, category, cover image (upload to Storage), Markdown content
- Soft-delete posts, filter active/trash

### 4. **CSS System**
- **tokens.css**: Design tokens (colors, spacing, typography scale, motion, shadows)
- **base.css**: Typography defaults, section layouts, container utilities
- **components.css**: Button styles, navbar (sticky), section backgrounds, card layouts, forms
- **admin.css**: Admin-specific styling (login, dashboard tabs, editor panels)

### 5. **JavaScript Modules (IIFE Pattern)**
- **main.js** (all pages): Scroll-reveal animations (IntersectionObserver), mobile nav toggle, sticky navbar
- **contact.js** (contact page only): Form validation (name, email, phone, message), localStorage logging
- **blog.js** (index + blog pages): Fetch & render blog posts, custom Markdown parser
- **admin.js** (admin page only): OAuth capture, role check, CRUD operations via Supabase REST

### 6. **Supabase Configuration**
- **supabase-config.js**: Project URL + public anon key (exposed in code — safe via RLS)
- Attached to `window.DNK_SUPABASE` global object (read by all JS modules)
- Never contains service_role key (kept on server only)

### 7. **Supabase Auth (Google OAuth)**
- Supabase manages OAuth flow (Google provider delegated)
- User logs in via Google at `/admin/` → redirects back with `#access_token=...&refresh_token=...`
- admin.js captures hash, verifies token, checks `profiles.role = 'admin'` via RLS

### 8. **Supabase REST API**
- All data queries routed through `/rest/v1/*` endpoints
- No custom backend — Supabase handles HTTP→PostgreSQL translation
- Public endpoint for blog reads (published posts only)
- Admin token required for blog CRUD (enforced by RLS)

### 9. **PostgreSQL Database (Supabase Managed)**
- **profiles** (1:1 with auth.users): id, role (admin|reader), display_name, created_at
- **categories**: id, name (unique), slug (regex validated), created_at
- **posts**: id, title, slug, excerpt, content (Markdown), cover_image_url, category_id, author_id, status (draft|published), published_at, deleted_at (soft delete), created_at, updated_at
- Index on (status, published_at desc) where deleted_at IS NULL for fast queries
- Triggers: auto-set updated_at on post update, auto-create profile on user signup

### 10. **Supabase Storage + RLS Policies**
- **post-images** bucket: Public read, admin-only write (image uploads)
- **RLS Policies**:
  - Public: Read categories + published/non-deleted posts
  - Admin (is_admin() check): Full CRUD on all tables + Storage
  - Users: See own profile row only
- All access controlled by database, not frontend token validation

---

## Main Processing Flow (Sequence)

```
1. USER OPENS index.html
   ↓
2. BROWSER LOADS ASSETS
   • CSS: tokens.css → base.css → components.css
   • JS: supabase-config.js → main.js → blog.js
   ↓
3. CSS TOKENS APPLIED
   • Design system cascades: colors, spacing, typography, motion
   ↓
4. MAIN.JS INITIALIZES
   • IntersectionObserver: watch .reveal elements
   • Sticky navbar: add .is-scrolled class on scroll >8px
   • Mobile nav: bind burger toggle, auto-close on nav click
   ↓
5. BLOG.JS FETCHES INSIGHTS
   • GET /rest/v1/posts?status=eq.published&limit=3 (Supabase REST)
   • Render 3 recent posts in #insight-posts section
   • Custom Markdown parser (no library): convert content → HTML
   ↓
6. PAGE RENDERED + INTERACTIVE
   ↓
7. USER CLICKS LINK → pages/contact.html
   ↓
8. CONTACT.JS VALIDATES FORM
   • name (2+ chars), email (regex), phone (VN format), message (10+ chars)
   • On submit: log to localStorage as JSON array
   ↓
9. USER CLICKS BLOG CARD → pages/blog.html?slug=post-name
   ↓
10. BLOG.JS RENDERS DETAIL
    • GET /rest/v1/posts?slug=eq.post-name (Supabase REST, public query)
    • Parse Markdown, render full article in #blog-post
    ↓
11. USER LOGS INTO /admin/
    ↓
12. GOOGLE OAUTH REDIRECT
    • Supabase Auth intercepts → Google login screen → user consents
    • Redirect back to /admin/#access_token=...&refresh_token=...
    ↓
13. ADMIN.JS CHECKS ROLE
    • Parse hash, store token in memory
    • GET /auth/v1/user (Supabase, bearer token) → verify identity
    • GET /rest/v1/profiles?id=eq.USER_ID (Supabase REST, public query + RLS)
    • RLS policy checks: is_admin() = true?
    • If yes: load dashboard (list posts + categories)
    • If no: show "Access denied" message
    ↓
14. ADMIN CREATES/EDITS POST
    • POST /rest/v1/posts (admin.js sends JSON body + bearer token header)
    • RLS: is_admin() enforces permission on insert
    • Cover image: PUT /storage/v1/object/post-images/...
    • RLS: is_admin() enforces permission on upload
    ↓
15. DATABASE TRIGGERS FIRE
    • on_auth_user_created: new profile auto-created (role=reader)
    • set_updated_at(): post.updated_at auto-set to now()
    ↓
16. SOFT DELETE (optional)
    • PATCH /rest/v1/posts (set deleted_at=now())
    • Query excludes deleted: WHERE deleted_at IS NULL (enforced by RLS)
```

---

## External Dependencies (Trust Boundary)

### Outside Browser Boundary
1. **Google Fonts API**
   - Be Vietnam Pro font CDN (link in `<head>`)
   - Loaded via `https://fonts.googleapis.com/...`

2. **Google OAuth Provider**
   - Supabase delegates to Google for identity verification
   - User redirected to accounts.google.com, back to Supabase Auth

3. **Supabase Project**
   - REST endpoint: `https://<project>.supabase.co/rest/v1/`
   - Auth endpoint: `https://<project>.supabase.co/auth/v1/`
   - Storage endpoint: `https://<project>.supabase.co/storage/v1/`
   - Database: PostgreSQL (managed, not directly accessible from browser)
   - RLS enforces all security rules
   - Public anon key (`anonKey`) in code is safe — RLS is the gate keeper

### No Other External Calls
- No analytics, no CDN for assets (only Google Fonts)
- No backend API calls except Supabase REST
- No frameworks (React, Vue, etc.)

---

## Trust & Security Boundaries (3 zones)

### **Zone 1: Browser/Client**
- **Trust Level**: Untrusted — user can modify anything (DevTools, localStorage, DOM)
- **What lives here**: HTML, CSS, vanilla JS, localStorage contact log
- **What should NOT be here**: API keys, secrets, sensitive business logic
- **Boundary Rule**: Assume client is hostile; server verifies all input

### **Zone 2: HTTPS Transport**
- **Trust Level**: Encrypted but inspectable (user can see all requests/responses)
- **What crosses**: OAuth tokens, REST API calls, database mutations
- **Boundary Rule**: HTTPS prevents MITM; Supabase enforces CORS; no secrets in headers (they're in auth token only)

### **Zone 3: Supabase Backend (Enforced RLS)**
- **Trust Level**: Trusted — RLS policies and database integrity gates all access
- **What lives here**: PostgreSQL (profiles, categories, posts), Auth tokens, Storage (post-images)
- **Access Control**: `is_admin()` PL/pgSQL function checks JWT role claim
- **Boundary Rule**: All mutations validated by RLS — no exception, even if frontend token is valid but role is wrong
- **Service Role Key**: Kept offline, never in repository, never on client (used only in migrations or maintenance scripts)

```
┌─────────────────────────────────────┐
│  Zone 1: Browser                    │
│  (Untrusted client-side code)       │
│  - HTML pages, CSS, JavaScript      │
│  - localStorage (contact log only)  │
│  - Anon key (safe via RLS)          │
│  - OAuth token (in memory only)     │
└────────────────┬────────────────────┘
                 │ HTTPS (encrypted, inspectable)
┌────────────────▼────────────────────┐
│  Zone 3: Supabase (Trusted Backend) │
│  - RLS policies enforce access      │
│  - is_admin() function checks role  │
│  - PostgreSQL (profiles, posts)     │
│  - Storage (post-images, admin-only)│
│  - Service role key (offline)       │
└─────────────────────────────────────┘
```

---

## Admin Dashboard Workflow (Detailed)

1. **Login**: User visits /admin/ → clicks "Sign in with Google" → OAuth flow → returns to /admin/#access_token=...
2. **Auth Check**: admin.js parses hash, calls `/auth/v1/user` (bearer token) → gets user identity
3. **Role Verification**: admin.js calls `/rest/v1/profiles?id=eq.USER_ID` (public query, but RLS filters to own row)
   - If role='admin': load dashboard
   - If role='reader': show "Access denied"
4. **Dashboard View**:
   - GET /rest/v1/categories → select dropdown
   - GET /rest/v1/posts (no filter) → RLS returns only visible posts (depends on auth scope)
   - Filter UI: "Active" vs "Trash" (client-side toggle of deleted_at IS NULL)
5. **Create Post**:
   - User fills form: title, slug (auto-slugified), excerpt, category, cover image (upload), content (Markdown)
   - Click "Save": POST /rest/v1/posts (JSON body, Authorization: bearer TOKEN, Content-Type: application/json)
   - RLS checks: is_admin() must be true → insert allowed
   - On success: new post appears in dashboard
6. **Edit Post**:
   - Click "Edit" on post → populate form with existing values
   - Modify fields, click "Save": PATCH /rest/v1/posts (same flow as create)
   - RLS checks: is_admin() + post.author_id = current user (or is_admin can edit any)
7. **Publish/Draft Toggle**:
   - PATCH /rest/v1/posts (status='published', published_at=now()) or (status='draft', published_at=NULL)
   - On publish: post visible to public via blog.html
8. **Soft Delete**:
   - Click "Delete": PATCH /rest/v1/posts (deleted_at=now())
   - Post moves to "Trash" filter
9. **Restore from Trash**:
   - PATCH /rest/v1/posts (deleted_at=NULL)
   - Post returns to active list
10. **Logout**:
    - admin.js clears token from memory, redirects to /admin/ (unprotected URL, but unauthenticated)

---

## Deployment & Runtime Considerations

### Static Hosting
- Site served via HTTP server (Python `http.server 8000` locally, or Vercel/Netlify in production)
- No build step: serve HTML/CSS/JS as-is
- Asset paths: `index.html` uses `assets/...`, pages use `../assets/...`

### Environment Configuration
- Supabase URL + anon key in `supabase-config.js` (hardcoded, safe because RLS gates all access)
- No `.env` file needed (no build tool, no secret rotation via CI)

### CORS & Security Headers
- Supabase CORS allows requests from configured domains
- Add `Content-Security-Policy`, `X-Frame-Options` at HTTP server level (not in code)

### OAuth Redirect URLs
- Dev: `http://localhost:8000/admin/`
- Prod: `https://yourdomain.com/admin/`
- Both must be registered in Supabase Auth → URL Configuration

### Database Migrations
- Migrations live in `supabase/001_admin_blog.sql`
- Run once via Supabase Dashboard (SQL Editor) or CLI (`supabase db push`)
- Sets up tables, indexes, triggers, RLS policies, Storage bucket

---

## Performance Characteristics

| Operation | Latency | Bottleneck |
|-----------|---------|-----------|
| Page load (index.html) | ~1.5s (network) | Google Fonts CDN, Supabase REST (3 posts) |
| Blog post fetch (detail) | ~0.3s | Supabase REST single-row query |
| Admin login (OAuth) | ~3s | Google OAuth + Supabase Auth |
| Create post (with image) | ~2s | Supabase Storage upload + DB insert |
| Contact form (localStorage) | <10ms | Client-side only, no network |

---

## Summary: The Architecture Promise

- **No Backend to Run**: Supabase handles auth, database, storage.
- **No Build Step**: Ship HTML/CSS/JS as-is.
- **Security by RLS**: Trust the database, not the frontend.
- **Mobile-First**: Responsive design, scroll animations (IntersectionObserver), `prefers-reduced-motion` respected.
- **Fast & Simple**: Vanilla JS, ~10KB of code, ~50KB of CSS (unminified).
- **Admin-Protected**: Google OAuth + RLS enforces role checks at every database operation.

The key insight: **the browser never makes a decision**. It calls Supabase REST, sends a token, and the database RLS policy says "yes" or "no". No validation logic duplicates between frontend and backend — the source of truth is always PostgreSQL.
