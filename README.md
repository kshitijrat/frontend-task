```
# SmartFeed App

SmartFeed is a React/Next.js web application that allows users to browse content from multiple sources (News, Movies, Social Posts), save favorite items, and manage preferences like dark mode and feed categories. Favorites are **per-user** and persist across sessions.

---

## **Features**

- User authentication (signup/login/logout) with hashed passwords.
- Per-user favorites stored in localStorage.
- Fetch content dynamically:
  - News (via `/api/news`)
  - Movies (via `/api/movies`)
  - Social posts (via `/api/social`)
- Dark mode and category preferences.
- Responsive UI with Tailwind CSS.
- Animations with Framer Motion.
- Protected routes for authenticated users.
- Search and trending content features.
- Favorites page showing user-specific favorite items.

---

## **Tech Stack**

- **Frontend:** Next.js 13 (App Router), React
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Auth:** LocalStorage-based mock authentication (bcrypt for password hashing)
- **Icons:** React-Icons (Feather icons)
- **Data Persistence:** LocalStorage (per-user favorites)

---

## **Folder Structure**

```
````

---

## **Setup & Installation**

1. Clone the repository:
```bash
git clone <repo-url>
cd frontend-task
````

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open the app:

```
http://localhost:3000
```

---

## **Usage**

* **Sign Up / Login:** Use email/password to create or log in. Favorites are per user.
* **Browse Content:** Feed shows news, movies, and social posts.
* **Favorite Items:** Click the heart icon to save items. Favorites persist for your user only.
* **Favorites Page:** Click “Favorites” in Sidebar to see saved items.
* **Trending Page:** Click “Trending” in Sidebar to view **top 5 trending items** across all categories.
* **Preferences:** Toggle dark mode and manage categories from Sidebar or Settings.

/           -> Feed/Home
/trending   -> Trending Page (Top 5)
 /favorites -> Favorites Page
 /settings  -> User Preferences
 /login     -> Login/Signup Page


---

## **Key Notes**

* **Favorites per User:**
  Stored in `localStorage` under key `sf_favorites_{userEmail}`.

* **Authentication:**
  Mock authentication is local only. Passwords are hashed using bcrypt.

* **Content:**
  Feed items are refreshed via API routes. Favorites are preserved using per-user storage.

* **State Management:**
  Redux Toolkit is used for `auth`, `preferences`, and `content` slices.

---

---
```
