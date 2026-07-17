# Loonary — A Moonlit Digital Blog

A full-stack blog built with **Next.js 16**, **Neon Postgres**, **Drizzle ORM v2**, and **Tailwind CSS v4**.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Database | Neon Postgres (serverless) |
| ORM | Drizzle ORM v2 (`drizzle-orm/neon-http`) |
| Styling | Tailwind CSS v4 + Vanilla CSS |
| Validation | Zod v4 (`safeParse` in every Server Action) |
| Linting | Biome |

---

## Features

- [x] **Create & Read Posts:** A public blog list with individual post pages and tag filtering.
- [x] **Interactive Comments:** Readers can leave comments on posts using smooth form submissions.
- [x] **Moderation System:** Password-protected admin dashboard to approve or hide reader comments.
- [x] **Admin Area:** Secure route for authors to write and publish new blog posts.
- [x] **Optimized Performance:** Built with Next.js 16 App Router using Server Components, Skeleton loading states, and robust Zod validation.
- [x] **Progressive Enhancement:** Forms use `useActionState` and Server Actions for snappy, interactive UX.

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/KCTulang/my-blog.git
cd my-blog
pnpm install
```

### 2. Database Setup

Create a free database at [neon.tech](https://neon.tech), then copy your connection string.

```bash
# Create .env.local with your Neon connection string
cp .env.local.example .env.local
```

Edit `.env.local`:
```
DATABASE_URL="postgresql://..."
ADMIN_PASSWORD="your-secret-password"
```

### 3. Run Migrations

SQL migration files are committed in the `drizzle/` folder. Apply them with:

```bash
pnpm drizzle-kit migrate
```

> **Note:** If `drizzle-kit migrate` hangs (Neon HTTP vs pg driver issue), run the manual apply script:
> ```bash
> pnpm tsx lib/db/apply-migration.ts
> ```

### 4. Seed the Database

Inserts 3 sample blog posts with tags and 2 pre-approved comments:

```bash
pnpm tsx lib/db/seed.ts
```

The seed is idempotent — re-running it won't create duplicates.

### 5. Run Locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Admin Pages

| URL | Description |
|---|---|
| `/admin/new` | Create a new blog post (password-protected) |
| `/admin/comments` | Approve / unapprove reader comments |

The `ADMIN_PASSWORD` env variable is used for both admin pages.

---

## Project Structure

```
app/
  blog/
    page.tsx          # Blog list — async Server Component, tag filtering
    loading.tsx       # Skeleton for blog list
    [slug]/
      page.tsx        # Post detail + comments (approved only)
      loading.tsx     # Skeleton for post page
  admin/
    new/page.tsx      # New post form
    comments/page.tsx # Comment moderation

components/
  CommentForm.tsx     # "use client" — useActionState + useFormStatus
  NewPostForm.tsx     # "use client" — useActionState + useFormStatus
  ModerateButton.tsx  # "use client" — useActionState + useFormStatus

lib/
  actions.ts          # Server Actions: addComment, createPost, toggleCommentApproval
  db/
    index.ts          # Drizzle + Neon connection
    schema.ts         # posts + comments tables with relations
    seed.ts           # 3 sample posts + 2 approved comments

drizzle/              # Committed SQL migration files (drizzle-kit generate)
```

---

## Key Constraints Met

- [x] **Drizzle ORM v2** (`drizzle-orm/neon-http`) — no raw SQL strings
- [x] **Server Actions** with `"use server"` — no `fetch()` POST from Client Components
- [x] **Zod `safeParse()`** in every Server Action
- [x] **`revalidatePath()`** called after every mutation
- [x] **`useActionState()`** for all forms — no `useState(loading)`
- [x] **`DATABASE_URL` in `.env.local`** — never committed
- [x] **SQL migration files in `drizzle/`** — `drizzle-kit generate` + manual apply

## Quality Checks

```bash
pnpm biome check .    # zero errors
pnpm tsc --noEmit     # zero type errors
pnpm build            # successful production build
```
