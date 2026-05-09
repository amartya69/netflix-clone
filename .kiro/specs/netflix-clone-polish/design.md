# Design Document: netflix-clone-polish

## Overview

This document describes the technical design for a set of polish and bug-fix improvements to the existing Netflix clone (React + Vite, OMDB API). The changes are surgical: each fix targets a specific broken or missing piece without restructuring the overall component hierarchy.

**Summary of changes:**

| # | Area | Problem | Fix |
|---|------|---------|-----|
| 1 | Environment variable | Wrong name (`VITE_TMDB_API_KEY`) in wrong location (`netflix-clone/.env`) | Rename key, move file to project root |
| 2 | Banner | No background image, no action buttons, no loading/error states | Add `backgroundImage` style, gradient overlay, Play/More Info buttons, loading/error states |
| 3 | Home | `useEffect` forces a search on mount, hiding Banner and default rows | Remove the `useEffect` that calls `handleSearch("avengers")` |
| 4 | index.css | Duplicate `body` rules, Vite boilerplate styles | Replace with a single clean Netflix-themed stylesheet |
| 5 | Navbar | Plain unstyled div | Add sticky positioning, red logo, dark background |
| 6 | Row | No loading/error states | Add `loading` and `error` state variables |
| 7 | index.html | Title is "netflix-clone" | Already fixed (`<title>Netflix</title>`) — verify and leave |

---

## Architecture

The app is a standard Vite + React SPA. No architectural changes are required. The component tree remains:

```
App
└── Home
    ├── Navbar
    ├── SearchBar
    ├── Banner          (shown when no search query)
    ├── Row × 5         (shown when no search query)
    └── Row (search)    (shown when search query is active)
```

All data fetching happens inside individual components (`Banner`, `Row`) via `axios` using URL strings from `requests.js`. The `Home` component manages only the search state.

### Data Flow

```
.env (project root)
  └── VITE_OMDB_API_KEY
        └── requests.js (import.meta.env.VITE_OMDB_API_KEY)
              └── Banner.jsx  ──► axios.get(requests.fetchTrending)
              └── Row.jsx     ──► axios.get(fetchUrl)
              └── Home.jsx    ──► axios.get(requests.searchMovie(query))
```

---

## Components and Interfaces

### `requests.js`

No code changes needed — it already uses `import.meta.env.VITE_OMDB_API_KEY`. The fix is purely in the `.env` file.

**Current (broken):** `netflix-clone/.env` → `VITE_TMDB_API_KEY=ee9c8db`  
**Fixed:** `.env` (project root) → `VITE_OMDB_API_KEY=ee9c8db`

---

### `Banner.jsx`

**Props:** none  
**State:**

| State variable | Type | Purpose |
|---|---|---|
| `movie` | `object \| null` | The featured movie object from OMDB |
| `loading` | `boolean` | True while the fetch is in progress |
| `error` | `string \| null` | Error message if fetch fails |

**Render logic:**

```
if loading  → render loading indicator
if error    → render error message
if movie    → render header with backgroundImage, gradient, title, buttons
```

**Background image logic:**

```js
const hasPoster = movie?.Poster && movie.Poster !== "N/A";
const backgroundStyle = hasPoster
  ? {
      backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 40%, transparent),
                        url(${movie.Poster})`,
      backgroundSize: "cover",
      backgroundPosition: "center top",
    }
  : { backgroundColor: "#111" };
```

**Buttons:** "▶ Play" and "ℹ More Info" rendered as `<button>` elements below the title. No click handlers required by the requirements (visual only for this polish pass).

---

### `Navbar.jsx`

**Props:** none  
**State:** none

**Style changes:**

| Property | Value |
|---|---|
| `position` | `sticky` |
| `top` | `0` |
| `zIndex` | `100` |
| `background` | `rgba(0, 0, 0, 0.85)` |
| Logo color | `#e50914` (Netflix red) |
| Logo font-weight | `bold` |

---

### `Row.jsx`

**Props:** `{ title, fetchUrl, movies: propMovies }`  
**State additions:**

| State variable | Type | Purpose |
|---|---|---|
| `loading` | `boolean` | True while fetch is in progress |
| `error` | `string \| null` | Error message if fetch fails |

**Render logic:**

```
if loading  → render "Loading..." text
if error    → render error message text
else        → render movie poster grid (existing logic)
```

The `loading` and `error` states only apply when fetching via `fetchUrl`. When `propMovies` is provided (search results), loading/error are not relevant.

---

### `Home.jsx`

**Change:** Remove the `useEffect` that calls `handleSearch("avengers")` on mount.

```jsx
// REMOVE this entire block:
useEffect(() => {
  handleSearch("avengers");
}, []);
```

No other changes to `Home.jsx`. The conditional rendering logic (`searchQuery ? searchResults : Banner + Rows`) is already correct.

---

### `index.css`

**Replace entirely** with a clean Netflix-themed stylesheet:

```css
*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  background-color: #111;
  color: #fff;
  font-family: Arial, Helvetica, sans-serif;
  min-height: 100vh;
}
```

No Vite boilerplate, no duplicate `body` rules, no `display: flex` on body, no `#646cff` colors, no light-mode media query.

---

### `index.html`

Already has `<title>Netflix</title>` — no change needed. Verify during implementation.

---

## Data Models

### OMDB Movie Object (relevant fields)

The OMDB API returns movie objects in the `Search` array. The fields used by this app:

```ts
interface OmdbMovie {
  imdbID: string;      // unique identifier, used as React key
  Title: string;       // movie title
  Year: string;        // release year
  Type: string;        // "movie" | "series" | "episode"
  Poster: string;      // URL to poster image, or "N/A"
}
```

### Component State Shapes

**Banner state:**
```ts
{
  movie: OmdbMovie | null,
  loading: boolean,       // initial: true
  error: string | null,   // initial: null
}
```

**Row state:**
```ts
{
  movies: OmdbMovie[],    // initial: []
  loading: boolean,       // initial: false (set to true before fetch)
  error: string | null,   // initial: null
  selectedMovie: OmdbMovie | null,
}
```

**Home state:**
```ts
{
  searchResults: OmdbMovie[],  // initial: []
  searchQuery: string,         // initial: ""
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Banner background reflects poster availability

*For any* movie object, if the `Poster` field is a non-"N/A" URL, the Banner header element's `backgroundImage` style SHALL contain that URL; if the `Poster` field is `"N/A"` or absent, the Banner SHALL use a solid dark `backgroundColor` instead.

**Validates: Requirements 2.1, 2.4**

---

### Property 2: Loading state transitions are mutually exclusive with content

*For any* component (Banner or Row), while `loading` is `true`, the component SHALL NOT render movie content; once `loading` becomes `false` and no error exists, the component SHALL render movie content and not the loading indicator.

**Validates: Requirements 2.5, 6.1, 6.3, 6.5, 6.6**

---

### Property 3: Error state suppresses content

*For any* component (Banner or Row), if `error` is a non-null string, the component SHALL render the error message and SHALL NOT render movie content or the loading indicator.

**Validates: Requirements 2.6, 6.2, 6.4**

---

### Property 4: Home search query controls visible content

*For any* search query string, if the query is non-empty the Home SHALL render the search Row and SHALL NOT render the Banner or default rows; if the query is empty the Home SHALL render the Banner and all default rows and SHALL NOT render the search Row.

**Validates: Requirements 3.2, 3.3, 3.4, 3.5**

---

### Property 5: CSS body rule uniqueness and correctness

*For any* parse of `index.css`, there SHALL be exactly one `body {}` rule, it SHALL declare `background-color` as `#000` or `#111`, it SHALL declare `color` as `#fff` or `white`, and it SHALL NOT declare `display: flex` or `place-items`.

**Validates: Requirements 4.1, 4.2, 4.3, 4.5**

---

## Error Handling

### Network / API Errors

Both `Banner` and `Row` wrap their `axios.get` calls in `try/catch`. On catch:
- Set `error` to a human-readable string.
- Set `loading` to `false`.
- Do not render movie content.

```jsx
try {
  setLoading(true);
  const res = await axios.get(fetchUrl);
  setMovies(res.data?.Search || []);
} catch (err) {
  setError("Failed to load movies.");
} finally {
  setLoading(false);
}
```

### Missing / Invalid Poster

The `Poster` field from OMDB can be `"N/A"` or absent. Both `Banner` and `Row` handle this:
- **Banner:** falls back to `backgroundColor: "#111"` (no `backgroundImage`).
- **Row:** already uses a placeholder image URL for `"N/A"` posters.

### Missing API Key

If `VITE_OMDB_API_KEY` is undefined (e.g., `.env` not present), `requests.js` will construct URLs with `apikey=undefined`. The OMDB API will return an error response. This surfaces as a fetch error and is handled by the existing error state in `Banner` and `Row`. No special handling is needed beyond the existing error states.

---

## Testing Strategy

This feature is a set of React component fixes and CSS/config changes. The testable logic lives in:
1. **Pure rendering logic** — given a state shape, does the component render the right elements?
2. **State transition logic** — do loading/error/success states transition correctly?
3. **CSS rule validation** — does `index.css` conform to the requirements?

### Unit Tests (example-based)

These cover specific scenarios with concrete inputs:

- **Banner — poster present:** Given a movie with a valid `Poster` URL, the header's `style.backgroundImage` contains that URL.
- **Banner — poster absent:** Given a movie with `Poster: "N/A"`, the header uses `backgroundColor` fallback.
- **Banner — loading state:** While `loading=true`, renders "Loading..." and not the movie title.
- **Banner — error state:** While `error="Failed..."`, renders the error string and not the movie title.
- **Row — loading state:** While `loading=true`, renders "Loading..." and not any `<img>` elements.
- **Row — error state:** While `error="Failed..."`, renders the error string.
- **Home — no useEffect search:** On mount, `searchQuery` is `""` and Banner + default rows are visible.
- **Home — search hides default content:** After `handleSearch("batman")`, Banner is not rendered.
- **Home — clear search restores content:** After setting `searchQuery` back to `""`, Banner is rendered.
- **Navbar — sticky positioning:** The Navbar element has `position: sticky`, `top: 0`, `zIndex >= 100`.
- **Navbar — red logo:** The logo element has `color: #e50914` and `fontWeight: bold`.

### Property-Based Tests

Property-based testing is applicable here for the rendering logic that must hold across all valid inputs. The recommended library is **fast-check** (well-maintained, works with Vitest/Jest, TypeScript-friendly).

Each property test runs a minimum of **100 iterations**.

**Property 1 — Banner background reflects poster availability**
- Generate: random movie objects with `Poster` set to either a valid URL string or `"N/A"` or `undefined`
- Assert: `backgroundImage` contains the URL iff `Poster` is a valid non-"N/A" string; otherwise `backgroundColor` is used
- Tag: `Feature: netflix-clone-polish, Property 1: Banner background reflects poster availability`

**Property 2 — Loading/error states are mutually exclusive with content**
- Generate: random `{ loading, error, movie }` state combinations
- Assert: exactly one of {loading indicator, error message, movie content} is rendered at any time
- Tag: `Feature: netflix-clone-polish, Property 2: Loading state transitions are mutually exclusive with content`

**Property 3 — Error state suppresses content**
- Generate: random non-empty error strings with any movie object
- Assert: error message is rendered, movie content is not rendered
- Tag: `Feature: netflix-clone-polish, Property 3: Error state suppresses content`

**Property 4 — Home search query controls visible content**
- Generate: random search query strings (empty and non-empty)
- Assert: non-empty query → search Row visible, Banner hidden; empty query → Banner visible, search Row hidden
- Tag: `Feature: netflix-clone-polish, Property 4: Home search query controls visible content`

### Integration / Smoke Tests

- **API key wiring:** Start the dev server with `VITE_OMDB_API_KEY` set; verify that a real OMDB request returns HTTP 200 (manual smoke test, not automated).
- **Page title:** Open `index.html` in a browser; verify tab shows "Netflix" (already fixed, verify only).

### What is NOT tested with PBT

- CSS file content — validated by a single example-based test (parse the file, check rules)
- `index.html` title — single example check
- Navbar visual styling — example-based snapshot or DOM attribute check
