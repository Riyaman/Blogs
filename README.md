# Inkwell

Inkwell is a focused publishing workspace built with React, Vite, Tailwind CSS, and Appwrite. It keeps the writing flow deliberately small: discover published stories, manage a personal library, create drafts, and publish finished work.

## Application structure

- `src/appwrite/` — Appwrite authentication and content/storage access. UI components never call the SDK directly.
- `src/components/` — shared layout, form primitives, feedback states, and content cards.
- `src/pages/` — route-level screens for discovery, library, authentication, editor, and story detail.
- `src/store/` — session state only. Server content is fetched at the route that owns it.
- `src/conf/` — client-safe environment configuration.

## Local setup

```bash
npm install
cp .env.sample .env
npm run dev
```

Required variables:

```env
VITE_APPWRITE_URL="https://<region>.cloud.appwrite.io/v1"
VITE_APPWRITE_PROJECT_ID="..."
VITE_APPWRITE_DATABASE_ID="..."
VITE_APPWRITE_COLLECTION_ID="..."
VITE_APPWRITE_BUCKET_ID="..."
VITE_TINYMCE_API_KEY="..." # optional; use your own cloud key in production
```

## Appwrite model and security

The existing collection remains compatible with this application. It needs these attributes:

| Attribute | Type | Purpose |
| --- | --- | --- |
| `title` | string | Story title |
| `content` | string | Rich-text content |
| `featuredImage` | string | Appwrite Storage file ID |
| `status` | string | `active` for published, `inactive` for draft |
| `userId` | string | Author account ID |

Add indexes for `status`, `userId`, and `status + $createdAt` to keep list queries fast as content grows.

Configure permissions in Appwrite — client checks are only a UX safeguard, not security:

- Collection: public/visitor **read** only for published content if the product is public; authenticated authors need create access.
- Documents: authors should have update/delete permission only on their own documents. Use Appwrite document security or a server-side function to enforce this.
- Storage bucket/files: grant image **read** to the same audience as the related post. The missing-image issue occurs when the document is readable but its file is not.
- Do not place Appwrite API keys or any server secret in a `VITE_` variable. Browser environment variables are public by design.

## Verification

```bash
npm run build
npm run lint
```
