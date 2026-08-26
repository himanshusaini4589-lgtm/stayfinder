<div align="center">

# 🏡 StayFinder

**An Airbnb-style full-stack listing & booking platform**

Built with Node.js, Express, MongoDB & EJS — geospatial search, cloud image hosting, and secure session-based auth.

![Node](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![EJS](https://img.shields.io/badge/View-EJS-B4CA65?logo=ejs&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue)

</div>

---

## 📌 Overview

StayFinder is a full-stack MVC web app where users can list properties, browse/search stays by category or keyword, view them on an interactive Mapbox map, book/review listings, and manage their own listings — all backed by MongoDB with 2dsphere geospatial indexing for location-aware queries.

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (≥ 18) |
| Framework | Express 5 |
| Database | MongoDB Atlas + Mongoose |
| Templating | EJS + `ejs-mate` (layouts) |
| Auth | Passport.js (Local Strategy) + `express-session` + `connect-mongo` |
| File Uploads | Multer + Cloudinary (`multer-storage-cloudinary`) |
| Geocoding / Maps | Mapbox SDK (forward geocoding) |
| Validation | Joi |
| Flash Messages | `connect-flash` |

---

## 🏗️ Architecture

```mermaid
flowchart TD
    Client["🌐 Browser (EJS Views)"] -->|HTTP Request| App["app.js — Express App"]

    App --> SessionMW["Session + Passport Middleware"]
    SessionMW --> Router{Router}

    Router -->|"/listings"| ListingR["Listing Routes"]
    Router -->|"/listings/:id/reviews"| ReviewR["Review Routes"]
    Router -->|"/"| UserR["User Routes (auth)"]

    ListingR --> ListingC["Listing Controller"]
    ReviewR --> ReviewC["Review Controller"]
    UserR --> UserC["User Controller"]

    ListingC -->|Geocode location| Mapbox["🗺️ Mapbox Geocoding API"]
    ListingC -->|Upload image| Cloudinary["☁️ Cloudinary"]
    ListingC --> DB[(MongoDB Atlas)]
    ReviewC --> DB
    UserC --> DB

    DB -->|2dsphere index| GeoQuery["Geospatial Queries"]
```

---

## 🗂️ Data Model

```mermaid
erDiagram
    USER ||--o{ LISTING : owns
    USER ||--o{ REVIEW : writes
    LISTING ||--o{ REVIEW : has

    USER {
        string email
        string username
        string hash
        string salt
    }
    LISTING {
        string title
        string description
        number price
        string location
        string country
        string category
        object image
        object geometry
        ObjectId owner
    }
    REVIEW {
        string comment
        number rating
        date createdAt
        ObjectId author
    }
```

**Listing categories:** Trending · Rooms · Iconic Cities · Beachfront · Mountains · Countryside · Islands · Lakefront · Castles

---

## 🔁 Request Lifecycle — Creating a Listing

```mermaid
sequenceDiagram
    actor U as User
    participant V as EJS Form
    participant M as Middleware (isLoggedIn, validateListing)
    participant C as Listing Controller
    participant GC as Mapbox Geocoding
    participant CD as Cloudinary
    participant DB as MongoDB

    U->>V: Fill listing form + image
    V->>M: POST /listings
    M->>M: Check auth + Joi validation
    M->>C: createNewListing()
    C->>GC: forwardGeocode(location)
    GC-->>C: coordinates
    C->>CD: upload(image)
    CD-->>C: url + filename
    C->>DB: save(newListing)
    DB-->>C: saved document
    C-->>U: redirect → /listings (flash: success)
```

---

## ✨ Features

- 🔍 **Search & filter** — keyword search (title/location/country) with regex-injection protection, plus category filters
- 🗺️ **Geospatial listings** — Mapbox forward geocoding stores real coordinates (`2dsphere`) per listing, rendered on an interactive map
- 🔐 **Authentication** — Passport Local Strategy, hashed + salted credentials, session persisted in MongoDB (`connect-mongo`)
- 🔁 **Redirect-after-login** — remembers the page a guest was trying to reach and sends them back post-login
- ☁️ **Image uploads** — Multer → Cloudinary pipeline with on-the-fly transformed thumbnails
- ⭐ **Reviews** — rating (1–5) + comment, cascade-deleted when a listing is removed
- 🛡️ **Authorization guards** — `isOwner` / `isReviewAuthor` middleware so only the creator can edit/delete their listing or review
- ✅ **Server-side validation** — Joi schemas on both listing and review payloads
- 🧯 **Centralized error handling** — custom `ExpressError` + `wrapAsync` to avoid repetitive try/catch, custom 404/500 views

---

## 🌐 Routes

| Method | Route | Purpose | Protected |
|---|---|---|---|
| `GET` | `/listings` | Index — search + category filter | — |
| `GET` | `/listings/new` | New listing form | ✅ login |
| `POST` | `/listings` | Create listing | ✅ login |
| `GET` | `/listings/:id` | Show listing | — |
| `GET` | `/listings/:id/edit` | Edit form | ✅ owner |
| `PUT` | `/listings/:id` | Update listing | ✅ owner |
| `DELETE` | `/listings/:id` | Delete listing | ✅ owner |
| `POST` | `/listings/:id/reviews` | Add review | ✅ login |
| `DELETE` | `/listings/:id/reviews/:reviewId` | Delete review | ✅ author |
| `GET/POST` | `/signup` | Register | — |
| `GET/POST` | `/login` | Login | — |
| `GET` | `/logout` | Logout | ✅ login |

---

## 📁 Project Structure

```
stayfinder/
├── app.js                  # Express app entry point
├── cloudConfig.js          # Cloudinary + Multer storage config
├── schema.js                # Joi validation schemas
├── middleware.js            # Auth guards, validation, ownership checks
├── controllers/
│   ├── listings.js
│   ├── review.js
│   └── user.js
├── models/
│   ├── listing.js           # Listing schema + geometry + cascade delete
│   ├── review.js
│   └── user.js               # passport-local-mongoose plugin
├── routes/
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── utils/
│   ├── ExpressError.js
│   └── wrapAsync.js
├── views/                    # EJS templates (layouts, listings, users)
├── public/                    # CSS, client JS, static images
└── init/                      # Seed script + sample data
```

---

## ⚙️ Setup & Installation

```bash
# 1. Clone
git clone https://github.com/himanshusaini4589-lgtm/stayfinder.git
cd stayfinder

# 2. Install dependencies
npm install

# 3. Configure environment variables (create a .env file)
ATLASDB_URL=your_mongodb_atlas_connection_string
SECRET_KEY=your_session_secret
MAP_TOKEN=your_mapbox_access_token
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# 4. (Optional) seed sample listings
node init/index.js

# 5. Run
npm start
# → Server runs on http://localhost:8080
```

---

## 🔐 Security Notes

- Passwords are never stored raw — handled via `passport-local-mongoose` (PBKDF2 hash + salt)
- Search input is regex-escaped before querying to prevent ReDoS / injection
- Session cookies are `httpOnly`, session store is DB-backed (survives server restarts)
- Ownership middleware (`isOwner`, `isReviewAuthor`) prevents unauthorized edits/deletes at the route level, not just the UI

---

## 🗺️ Roadmap

- [ ] Booking/date-availability system (calendar-based reservations)
- [ ] Payment integration
- [ ] Wishlist/favorites
- [ ] Host dashboard with analytics
- [ ] REST API layer for a decoupled frontend (React/Next.js)

---

## 📄 License

ISC

---

<div align="center">
Built by <a href="https://github.com/himanshusaini4589-lgtm">Himanshu Saini</a>
</div>
