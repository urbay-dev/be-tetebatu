# Backend Development Prompt — Website Layanan Wisata Desa Tetebatu

Act as a Senior Backend Engineer. Build a complete, maintainable REST API backend for a tourism service directory website focused on Desa Tetebatu, Lombok, Indonesia.

The backend must use:

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- Supabase PostgreSQL
- Supabase Storage
- Zod
- JWT authentication
- bcrypt
- Multer
- Helmet
- CORS
- Rate limiting
- Swagger / OpenAPI

Build working functionality, not just boilerplate. Inspect the existing repository before making changes. Preserve existing working code and conventions where practical.

---

## 1. Project Overview

The platform is a digital tourism directory and information hub for Desa Tetebatu. Visitors can discover:

1. Tourist Attractions
2. Accommodation
3. Restaurants
4. Coffee Shops
5. Tours & Activities
6. Car Driver
7. Local Motorcycle Taxi

Visitors can view service details, photos, facilities, features, prices, locations, opening hours, and provider contact information. They can contact providers directly through WhatsApp, phone, email, or other available channels.

### Important scope boundaries

This website is an information, promotion, directory, and direct-contact platform.

Do **not** implement:

- Online payments
- Checkout
- Shopping carts
- Automatic commissions
- Transaction processing
- Internal booking confirmation or availability management

Reservation means redirecting or connecting visitors to the service provider using contact links. Price negotiation, availability confirmation, reservation agreement, and payment happen outside the website.

Visitors do not need accounts. Only administrators and content managers authenticate.

---

## 2. Technology and Implementation Requirements

Use TypeScript throughout the application.

Use Prisma for all PostgreSQL database access. Use Supabase Storage for image files. Use Zod to validate request bodies, query parameters, route parameters, and relevant environment variables.

Use compatible stable package versions. Check compatibility between the installed Prisma version, its generator, and the database configuration. Do not mix Prisma version-specific configuration patterns.

Recommended dependencies:

- `express`
- `typescript`
- `tsx` or an equivalent TypeScript development runner
- `prisma`
- `@prisma/client` or the generated Prisma client package required by the selected Prisma version
- `@supabase/supabase-js`
- `zod`
- `jsonwebtoken`
- `bcrypt`
- `multer`
- `helmet`
- `cors`
- `express-rate-limit`
- `cookie-parser` if cookie authentication is used
- `swagger-ui-express`
- OpenAPI-compatible documentation tooling
- `pino` or `winston` for logging
- `vitest` or `jest`
- `supertest`

Avoid adding dependencies that do not provide clear value.

---

## 3. Simple Project Architecture

Keep the architecture simple and practical for a solo developer. Do not overengineer the project.

Use three main application layers:

- Routes
- Controllers
- Shared libraries and utilities

Use Prisma directly inside controllers for normal database operations. Do not create a repository layer for every module. Do not create a service layer for every CRUD operation unless business logic genuinely requires it.

### Required directory structure

```text
tetebatu-backend/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── config/
│   │   └── env.ts
│   ├── lib/
│   │   ├── prisma.ts
│   │   └── supabase.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── error.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── category.routes.ts
│   │   ├── service.routes.ts
│   │   ├── area.routes.ts
│   │   ├── article.routes.ts
│   │   ├── homepage.routes.ts
│   │   ├── settings.routes.ts
│   │   └── dashboard.routes.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── category.controller.ts
│   │   ├── service.controller.ts
│   │   ├── area.controller.ts
│   │   ├── article.controller.ts
│   │   ├── homepage.controller.ts
│   │   ├── settings.controller.ts
│   │   └── dashboard.controller.ts
│   ├── utils/
│   │   ├── upload.ts
│   │   ├── slug.ts
│   │   └── response.ts
│   ├── app.ts
│   └── server.ts
├── tests/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

You may add a small number of files when genuinely needed, such as validation schemas or shared types. Keep them close to the relevant feature or in a shared folder. Do not create unnecessary nested folders.

### Architecture rules

1. Routes define endpoints and attach middleware.
2. Controllers handle request validation, business logic, and Prisma queries.
3. `src/lib` contains shared clients such as Prisma and Supabase.
4. `src/middleware` contains shared middleware.
5. `src/utils` contains reusable helpers.
6. Keep route and controller modules separated by domain.
7. Use centralized error handling.
8. Use Prisma transactions when multiple related database records must be updated consistently.
9. Keep controllers readable; extract a helper only when it meaningfully reduces duplication.
10. Do not create empty placeholder files or unnecessary abstractions.

---

## 4. Database Design

Use Supabase PostgreSQL as the database and Prisma ORM as the data access layer.

Implement a normalized schema with appropriate relations, constraints, indexes, timestamps, and deletion behavior.

The database must support the following models and concepts.

### User

Admin and content manager accounts.

Fields:

- `id`
- `name`
- `email` (unique)
- `password` (hashed)
- `role`
- `isActive`
- `createdAt`
- `updatedAt`

Roles:

- `SUPER_ADMIN`
- `ADMIN`
- `EDITOR`

### Area

Represents a location or area within the Tetebatu tourism directory.

Fields:

- `id`
- `name`
- `slug` (unique)
- `description`
- `services`
- `createdAt`
- `updatedAt`

### ServiceCategory

Categories must be database records, not a hardcoded enum, so admins can manage them.

Fields:

- `id`
- `name`
- `nameEn`
- `slug` (unique)
- `description`
- `descriptionEn`
- `icon`
- `image` or image storage reference
- `sortOrder`
- `isActive`
- `createdAt`
- `updatedAt`

### Service

Use one generic Service model for all seven service categories. Do not create separate tables for accommodation, restaurants, coffee shops, attractions, drivers, and other categories unless a concrete requirement proves it necessary.

Fields:

- `id`
- `name`
- `slug` (unique)
- `description`
- `descriptionEn`
- `shortDescription`
- `shortDescriptionEn`
- `categoryId`
- optional `areaId`
- `address`
- `latitude`
- `longitude`
- `googleMapsUrl`
- `directions`
- `directionsEn`
- `openingHours` (JSON, when appropriate)
- optional `vehicleType`
- optional `passengerCapacity`
- `status`
- `isFeatured`
- `isRecommended`
- `sortOrder`
- `metaTitle`
- `metaDescription`
- `publishedAt`
- `createdAt`
- `updatedAt`

Publish status:

- `DRAFT`
- `PUBLISHED`
- `ARCHIVED`

A service can have many images, contacts, facilities, features, and price entries.

### ServiceImage

Store image metadata and references, not image binary data.

Fields:

- `id`
- `serviceId`
- `bucket`
- `storagePath`
- `url`
- `alt`
- `altEn`
- `caption`
- `captionEn`
- `isPrimary`
- `sortOrder`
- `createdAt`

### ServiceContact

Fields:

- `id`
- `serviceId`
- `type`
- `label`
- `value`
- `isPrimary`
- `createdAt`
- `updatedAt`

Contact types:

- `WHATSAPP`
- `PHONE`
- `EMAIL`
- `WEBSITE`
- `INSTAGRAM`
- `FACEBOOK`
- `OTHER`

### ServiceFacility

Fields:

- `id`
- `serviceId`
- `name`
- `nameEn`
- `icon`
- `createdAt`

Use this for facilities such as Wi-Fi, breakfast, private bathroom, parking, and similar amenities.

### ServiceFeature

Fields:

- `id`
- `serviceId`
- `name`
- `nameEn`
- `description`
- `descriptionEn`
- `createdAt`

Use this for flexible information such as room types, menu highlights, tour activities, vehicle services, and package highlights.

### ServicePrice

Fields:

- `id`
- `serviceId`
- `label`
- `labelEn`
- `type`
- `minPrice`
- `maxPrice`
- `currency`
- `unit`
- `unitEn`
- `createdAt`
- `updatedAt`

Price types:

- `FIXED`
- `RANGE`
- `STARTING_FROM`
- `FREE`
- `CONTACT_FOR_PRICE`

Use a suitable decimal database type for prices. Do not use floating point for monetary values.

### Article

Fields:

- `id`
- `title`
- `titleEn`
- `slug` (unique)
- `excerpt`
- `excerptEn`
- `content`
- `contentEn`
- `coverImage` or image storage reference
- `type`
- `status`
- optional `authorId`
- `metaTitle`
- `metaDescription`
- `publishedAt`
- `createdAt`
- `updatedAt`

Article types:

- `ARTICLE`
- `GUIDE`
- `EVENT`
- `CULTURE`

### ArticleImage

Fields:

- `id`
- `articleId`
- `bucket`
- `storagePath`
- `url`
- `caption`
- `captionEn`
- `sortOrder`
- `createdAt`

### HomepageSection

Fields:

- `id`
- `key` (unique)
- `title`
- `titleEn`
- `subtitle`
- `subtitleEn`
- `content` (JSON)
- `sortOrder`
- `isActive`
- `createdAt`
- `updatedAt`

### SiteSetting

Fields:

- `id`
- `key` (unique)
- `value` (JSON)
- `createdAt`
- `updatedAt`

### Database design rules

- Use `onDelete: Cascade` for dependent records such as service images, contacts, facilities, features, prices, and article images.
- Prevent accidental deletion of categories that still have services, or require a safe reassignment strategy.
- Use unique slugs.
- Add indexes for common filtering and listing queries.
- Use `Decimal` for prices.
- Use JSON only for genuinely flexible structures such as opening hours and homepage content.
- Store bilingual content in separate Indonesian and English fields.
- Do not add visitor accounts or transactional booking models.
- Make sure the schema validates and the Prisma Client can be generated.

---

## 5. Supabase Database Configuration

Connect Prisma to Supabase PostgreSQL.

Create and document the required environment variables:

- `DATABASE_URL`
- `DIRECT_URL`

Use the appropriate Supabase connection string for the selected runtime and deployment environment.

If using Supabase connection pooling for application runtime, configure the pooled connection correctly. Use a direct database connection for migrations where required by the selected Prisma version and Supabase setup.

Do not hardcode credentials.

Create the Prisma schema, run validation, generate the client, and create migrations only when the database connection is configured and available. If it is not available, complete schema validation and clearly explain which database steps remain.

---

## 6. Supabase Storage

Use Supabase Storage for all public website images.

Bucket name:

`tetebatu-assets`

Suggested storage paths:

```text
services/
  accommodation/
  restaurants/
  attractions/
  activities/
  transportation/
articles/
categories/
homepage/
site/
```

These are object path prefixes; do not assume physical folders need to be created.

### Upload requirements

Implement backend image upload functionality:

1. Authenticate the admin.
2. Validate the uploaded file.
3. Allow JPEG, PNG, and WebP.
4. Set a configurable maximum file size, default 5 MB.
5. Generate a unique filename; do not trust the original filename.
6. Upload the file to `tetebatu-assets`.
7. Save the bucket, storage path, and public URL in PostgreSQL.
8. Return image metadata to the client.

Support:

- Single image upload.
- Multiple image upload.
- Delete image.
- Replace image.
- Reorder images.
- Set primary image.

Use Multer with memory storage or another safe approach that avoids unnecessary temporary files.

Use the Supabase service role key only on the backend. Never expose it to the frontend or return it in API responses.

### Storage consistency

Handle failures carefully:

- If upload fails, do not create a database image record.
- If database insertion fails after upload, attempt to remove the uploaded object.
- When deleting an image, handle the database and storage operations safely.
- When replacing an image, avoid deleting the old image before the new image and its database record are successfully established.
- Avoid orphaned files and broken image references.
- Log cleanup failures for later investigation.

For public image buckets, use public URLs. Do not store signed URLs as permanent public image references.

---

## 7. Authentication and Authorization

Implement authentication for admin users only.

### Endpoints

```http
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
POST   /api/v1/auth/change-password
```

Requirements:

- Hash passwords with bcrypt.
- Sign and verify JWTs securely.
- Validate credentials.
- Add login rate limiting.
- Reject inactive users.
- Never return password hashes.
- Implement role-based access control.

Permissions:

**SUPER_ADMIN**
- Full access.
- Manage admin users.
- Manage all content and settings.

**ADMIN**
- Manage categories.
- Manage areas.
- Manage services.
- Manage articles.
- Manage homepage.
- Manage images and settings.

**EDITOR**
- Manage permitted content.
- Cannot manage users or sensitive system settings.

Use secure HttpOnly cookies for browser-based admin authentication where appropriate. Configure `Secure`, `SameSite`, domain, and expiration according to the environment. If using cookies, implement a suitable CSRF protection strategy. If using bearer tokens instead, document the expected frontend handling.

Do not create public visitor authentication.

---

## 8. Public API

Use this API prefix:

`/api/v1`

Public endpoints must only return active categories and published content.

### Categories

```http
GET /api/v1/categories
GET /api/v1/categories/:slug
```

Requirements:

- Return active categories.
- Include service counts where useful.
- Support sorting by `sortOrder`.

### Services

```http
GET /api/v1/services
GET /api/v1/services/featured
GET /api/v1/services/recommended
GET /api/v1/services/:slug
```

Support query parameters:

```text
?page=1
&limit=12
&search=
&category=
&area=
&sort=name
&order=asc
```

Requirements:

- Pagination.
- Search by service name and relevant text fields.
- Filter by category.
- Filter by area.
- Sort by name, newest, featured, or recommended.
- Validate pagination and sorting inputs.
- Return only `PUBLISHED` services.
- Do not allow public requests to expose drafts or archived records.

Service detail should include:

- Category.
- Area.
- Images.
- Contacts.
- Facilities.
- Features.
- Prices.
- Location.
- Opening hours.

### Areas

```http
GET /api/v1/areas
GET /api/v1/areas/:slug
```

Return areas and relevant published service information.

### Articles

```http
GET /api/v1/articles
GET /api/v1/articles/:slug
GET /api/v1/articles/featured
```

Support:

- Pagination.
- Search.
- Article type filtering.
- Published content only.

### Homepage

```http
GET /api/v1/homepage
```

Return structured homepage data:

- Active homepage sections.
- Hero content.
- Active categories.
- Featured services.
- Recommended services.
- Featured attractions where applicable.
- Activities.
- Latest published articles.

Use `HomepageSection` and related database records. Avoid hardcoding all homepage content in the controller.

### Public settings

```http
GET /api/v1/settings/public
```

Return only explicitly public settings. Never return secrets or internal configuration.

---

## 9. Admin API

All admin endpoints must use authentication and appropriate role authorization.

### Categories

```http
GET    /api/v1/admin/categories
GET    /api/v1/admin/categories/:id
POST   /api/v1/admin/categories
PATCH  /api/v1/admin/categories/:id
DELETE /api/v1/admin/categories/:id
```

Implement CRUD, slug generation, duplicate slug handling, active status, sort order, and category image management.

Do not delete categories that still have services unless services are safely reassigned.

### Areas

```http
GET    /api/v1/admin/areas
GET    /api/v1/admin/areas/:id
POST   /api/v1/admin/areas
PATCH  /api/v1/admin/areas/:id
DELETE /api/v1/admin/areas/:id
```

Implement CRUD and unique slug validation.

### Services

```http
GET    /api/v1/admin/services
GET    /api/v1/admin/services/:id
POST   /api/v1/admin/services
PATCH  /api/v1/admin/services/:id
DELETE /api/v1/admin/services/:id
```

Implement:

- CRUD.
- Slug generation and uniqueness.
- Draft, published, and archived statuses.
- Featured and recommended flags.
- Category and area assignment.
- Address and coordinates.
- Google Maps URL.
- Opening hours.
- SEO metadata.
- Contacts.
- Facilities.
- Features.
- Prices.
- Image relations and ordering.

Create and update endpoints should support nested relational data where appropriate.

Use Prisma transactions for consistent database updates involving multiple related records.

Do not silently overwrite nested relations. Define and document whether omitted arrays are preserved and whether supplied arrays replace or incrementally update existing records.

### Articles

```http
GET    /api/v1/admin/articles
GET    /api/v1/admin/articles/:id
POST   /api/v1/admin/articles
PATCH  /api/v1/admin/articles/:id
DELETE /api/v1/admin/articles/:id
```

Implement:

- CRUD.
- Bilingual content.
- Unique slug.
- Article type.
- Draft, published, and archived statuses.
- Cover image.
- Article image gallery.
- SEO metadata.
- Author relation.
- Publish date.

### Homepage

```http
GET    /api/v1/admin/homepage
PATCH  /api/v1/admin/homepage
GET    /api/v1/admin/homepage/sections
POST   /api/v1/admin/homepage/sections
PATCH  /api/v1/admin/homepage/sections/:id
DELETE /api/v1/admin/homepage/sections/:id
```

Allow admins to manage homepage section content, visibility, and ordering.

### Image management

Implement authenticated upload and management endpoints for:

- Service images.
- Article images.
- Category images.
- Homepage images.
- Site images.

Support deletion, replacement, reordering, and primary image selection where relevant.

### Site settings

```http
GET   /api/v1/admin/settings
PATCH /api/v1/admin/settings
```

Validate allowed setting keys and prevent changes to protected environment configuration.

### Dashboard

```http
GET /api/v1/admin/dashboard
```

Return:

- Total services.
- Services grouped by category.
- Published services.
- Draft services.
- Featured services.
- Recommended services.
- Total articles.
- Published articles.
- Draft articles.
- Total categories.
- Total areas.

Use efficient Prisma aggregate and count queries.

---

## 10. Bilingual Content

The website supports:

- Indonesian (`id`)
- English (`en`)

Store both language versions in separate database fields.

Example:

```json
{
  "name": "Air Terjun Tetebatu",
  "description": "Deskripsi dalam Bahasa Indonesia",
  "descriptionEn": "Description in English"
}
```

The backend must return both language fields. The frontend is responsible for selecting which language to display.

Do not automatically translate content.

For fields that do not need translation, such as coordinates, prices, and contact values, store one value.

---

## 11. Validation and API Response Format

Use Zod to validate:

- Request bodies.
- Query parameters.
- Route parameters.
- File metadata.
- Environment variables.

Validate required fields, maximum lengths, email, URLs, coordinates, numeric prices, enums, pagination, and upload constraints.

Do not trust frontend input. Avoid mass assignment by explicitly selecting allowed fields.

Use a consistent response format.

### Success response

```json
{
  "success": true,
  "message": "Services retrieved successfully",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 0,
    "totalPages": 0
  }
}
```

### Error response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

Implement centralized error handling for:

- Validation errors.
- Authentication errors.
- Authorization errors.
- Not found errors.
- Duplicate records.
- Prisma errors.
- Supabase Storage errors.
- Unexpected internal errors.

Never expose stack traces, credentials, or internal secrets in production responses.

---

## 12. Security and Reliability

Implement:

- Helmet.
- Configured CORS allowlist.
- Rate limiting.
- Zod validation.
- JWT verification.
- Role authorization.
- bcrypt password hashing.
- Secure cookie configuration if cookies are used.
- Request logging.
- Environment validation.
- File upload validation.
- Safe error responses.
- Protection against mass assignment.
- Safe handling of Prisma and Supabase errors.

Additional requirements:

- Restrict CORS to configured frontend origins.
- Do not use wildcard CORS with credentialed requests.
- Do not expose Supabase service role credentials.
- Do not log passwords, tokens, or secrets.
- Set reasonable request body size limits.
- Handle graceful shutdown and close Prisma connections.
- Add a health endpoint.

Health endpoint:

```http
GET /api/health
```

Return application status without exposing sensitive infrastructure information.

---

## 13. Seed Data

Create an idempotent `prisma/seed.ts`.

Seed these seven categories:

1. Tourist Attractions
2. Accommodation
3. Restaurants
4. Coffee Shops
5. Tours & Activities
6. Car Driver
7. Local Motorcycle Taxi

Also seed:

- Initial areas where appropriate.
- Default homepage sections.
- Default public site settings.
- Initial administrator from environment variables.

Use `upsert` or another safe strategy so running the seed multiple times does not create duplicates.

Do not hardcode admin credentials in source code. Require the initial admin details through environment variables.

---

## 14. API Documentation

Implement Swagger/OpenAPI documentation.

Expose the documentation at:

```text
/api/docs
```

Document:

- Public endpoints.
- Admin endpoints.
- Authentication requirements.
- Roles and permissions.
- Request bodies.
- Query parameters.
- File upload requirements.
- Success responses.
- Error responses.

Keep documentation updated when endpoints change.

---

## 15. Testing

Use Vitest or Jest with Supertest.

Write practical tests for critical functionality:

- Login.
- Authentication middleware.
- Role authorization.
- Category CRUD.
- Service CRUD.
- Published-content filtering.
- Pagination.
- Search.
- Image upload validation.
- Article CRUD.
- Dashboard statistics.
- Validation errors.
- Not found responses.

Mock external Supabase Storage operations in automated tests. Do not require real production credentials for ordinary unit and integration tests.

---

## 16. Environment Variables

Create `.env.example`:

```env
NODE_ENV=development
PORT=5000

DATABASE_URL=
DIRECT_URL=

SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_BUCKET=tetebatu-assets

JWT_SECRET=
JWT_EXPIRES_IN=1d

ADMIN_NAME=
ADMIN_EMAIL=
ADMIN_PASSWORD=

FRONTEND_URL=
```

Validate required environment variables at application startup using Zod.

Never commit `.env`. Add `.env` and other secret files to `.gitignore`.

Document how to obtain Supabase database connection strings and Storage credentials.

---

## 17. Development Phases

Build the backend incrementally. Do not generate the entire application in one unreviewed code dump.

### Phase 1 — Foundation

- Inspect repository.
- Initialize Node.js and TypeScript if needed.
- Install dependencies.
- Configure Express.
- Configure environment validation.
- Configure Prisma client.
- Configure Supabase client.
- Implement centralized error handling.
- Implement logging.
- Implement health endpoint.

### Phase 2 — Database

- Implement complete Prisma schema.
- Validate schema.
- Generate Prisma Client.
- Configure Supabase PostgreSQL.
- Create migration when database connection is available.
- Implement seed script.

### Phase 3 — Authentication

- Login.
- Logout.
- Current admin profile.
- Change password.
- JWT verification.
- Role authorization.
- Secure authentication configuration.

### Phase 4 — Categories and Areas

- CRUD categories.
- CRUD areas.
- Slug generation.
- Validation.
- Sorting and active status.

### Phase 5 — Services

- CRUD services.
- Nested relational data.
- Contacts.
- Facilities.
- Features.
- Prices.
- Search.
- Pagination.
- Filtering.
- Sorting.
- Featured and recommended listings.
- Publishing workflow.

### Phase 6 — Supabase Storage

- Upload validation.
- Single and multiple uploads.
- Delete images.
- Replace images.
- Reorder images.
- Primary image management.
- Database metadata consistency.

### Phase 7 — Articles

- CRUD articles.
- Bilingual content.
- Article types.
- Publishing workflow.
- Cover images.
- Article gallery.

### Phase 8 — Homepage and Settings

- Homepage content.
- Dynamic sections.
- Public settings.
- Admin settings.
- Featured content configuration.

### Phase 9 — Dashboard

- Overview statistics.
- Service statistics.
- Category statistics.
- Article statistics.

### Phase 10 — Documentation and Testing

- Swagger/OpenAPI.
- Endpoint documentation.
- Authentication tests.
- CRUD tests.
- Validation tests.
- Error handling tests.

### Phase 11 — Finalization

- Complete README.
- Environment setup instructions.
- Migration and seed instructions.
- Development commands.
- Deployment instructions.
- Production readiness checklist.

---

## 18. Rules for the AI Coding Agent

1. Inspect the existing repository before creating or modifying files.
2. Preserve existing working code.
3. Follow the simple directory structure defined above.
4. Use TypeScript throughout the backend.
5. Use Prisma for all database queries.
6. Use Supabase PostgreSQL as the database.
7. Use Supabase Storage for images.
8. Never store image binary files in PostgreSQL.
9. Do not implement payment or transactional booking features.
10. Do not add visitor authentication.
11. Do not create unnecessary abstractions or nested folders.
12. Never hardcode credentials.
13. Never expose Supabase service role credentials.
14. Validate all incoming user input.
15. Ensure public APIs only return published content.
16. Protect all admin APIs.
17. Use transactions when updating multiple related database records.
18. Handle image storage and database consistency.
19. Make the API suitable for integration with a Next.js or React frontend.
20. Do not leave TODOs for core functionality.
21. Do not claim features are complete without implementing and verifying them.
22. Run relevant checks after each phase.
23. Fix errors before proceeding.
24. Keep a concise progress summary.
25. Do not proceed to the next phase unless explicitly requested.

---

## 19. First Task — Start Phase 1

Start by inspecting the current repository.

Before implementation, briefly report:

- Current directory structure.
- Existing dependencies.
- Existing code and configuration.
- What needs to be initialized or adjusted.

Then implement Phase 1 completely.

Verify:

- TypeScript compilation.
- Application startup.
- Health endpoint response.
- Environment validation.
- Prisma client initialization where database configuration permits.

Do not merely explain what should be done. Actually create and implement the required files.

When Phase 1 is complete, report:

1. Files created or modified.
2. Dependencies installed.
3. Features implemented.
4. Commands to run the backend.
5. Verification and test results.
6. Any external configuration still required.

Stop after Phase 1 and wait for approval before starting Phase 2.

The final goal is a clean, maintainable, secure, and practical REST API backend for the Tetebatu tourism platform.
