# Tasks

## Task List

- [x] 1. Fix environment variable name and location
  - [x] 1.1 Verify `.env` at project root contains `VITE_OMDB_API_KEY=ee9c8db`
  - [x] 1.2 Remove or rename `netflix-clone/.env` so the misnamed `VITE_TMDB_API_KEY` key is no longer present
  - [x] 1.3 Confirm `src/utils/requests.js` uses `import.meta.env.VITE_OMDB_API_KEY` (no code change needed, verify only)

- [x] 2. Update Banner component with background image, buttons, and loading/error states
  - [x] 2.1 Add `loading` (initial: `true`) and `error` (initial: `null`) state variables to `Banner.jsx`
  - [x] 2.2 Wrap the `axios.get` call in `try/catch/finally`; set `loading=false` in `finally`, set `error` string on catch
  - [x] 2.3 Add background image logic: if `movie.Poster` is a valid non-"N/A" URL, set `backgroundImage` with a `linear-gradient` overlay and `url()`; otherwise fall back to `backgroundColor: "#111"`
  - [x] 2.4 Add `backgroundSize: "cover"` and `backgroundPosition: "center top"` to the header style when a poster is present
  - [x] 2.5 Add a "▶ Play" `<button>` and a "ℹ More Info" `<button>` below the movie title
  - [x] 2.6 Render a loading indicator (e.g., `<p>Loading...</p>`) when `loading` is `true`
  - [x] 2.7 Render an error message (e.g., `<p>Failed to load featured content.</p>`) when `error` is non-null
  - [x] 2.8 Ensure loading and error states are mutually exclusive with movie content rendering

- [x] 3. Fix Home page — remove on-mount search side effect
  - [x] 3.1 Delete the `useEffect(() => { handleSearch("avengers"); }, [])` block from `Home.jsx`
  - [x] 3.2 Remove the unused `useEffect` import if it is no longer used elsewhere in `Home.jsx`
  - [x] 3.3 Verify that on mount, `searchQuery` is `""` and the Banner + default rows are rendered

- [x] 4. Replace index.css with clean Netflix-themed stylesheet
  - [x] 4.1 Remove all existing content from `src/index.css`
  - [x] 4.2 Add a `*, *::before, *::after { box-sizing: border-box; }` reset rule
  - [x] 4.3 Add a single `body {}` rule with `margin: 0`, `background-color: #111`, `color: #fff`, `font-family: Arial, Helvetica, sans-serif`, and `min-height: 100vh`
  - [x] 4.4 Confirm no `display: flex`, `place-items`, `#646cff`, or light-mode media query remains in the file

- [x] 5. Style the Navbar component
  - [x] 5.1 Add `position: "sticky"` and `top: 0` to the Navbar container style
  - [x] 5.2 Add `zIndex: 100` to the Navbar container style
  - [x] 5.3 Change the background to `rgba(0, 0, 0, 0.85)` (dark semi-transparent)
  - [x] 5.4 Style the "NETFLIX" logo text with `color: "#e50914"` and `fontWeight: "bold"`

- [x] 6. Add loading and error states to Row component
  - [x] 6.1 Add `loading` (initial: `false`) and `error` (initial: `null`) state variables to `Row.jsx`
  - [x] 6.2 Set `loading=true` before the `axios.get` call and `loading=false` in a `finally` block
  - [x] 6.3 Set `error` to an error string in the `catch` block (e.g., `"Failed to load movies."`)
  - [x] 6.4 Render `<p>Loading...</p>` when `loading` is `true`
  - [x] 6.5 Render an error message paragraph when `error` is non-null
  - [x] 6.6 Ensure loading/error states only apply to the `fetchUrl` path, not the `propMovies` (search results) path

- [x] 7. Verify page title in index.html
  - [x] 7.1 Open `index.html` and confirm `<title>Netflix</title>` is present (already done — verify only, no change needed)

- [x] 8. Write property-based and unit tests
  - [x] 8.1 Install `fast-check` and `@testing-library/react` + `vitest` as dev dependencies if not already present
  - [x] 8.2 Write property test for Property 1: Banner background reflects poster availability — generate random movie objects with valid/invalid Poster values, assert correct style is applied
  - [x] 8.3 Write property test for Property 2: Loading/error/content states are mutually exclusive — generate random state combinations for Banner and Row, assert only one state is rendered at a time
  - [x] 8.4 Write property test for Property 3: Error state suppresses content — generate random non-empty error strings, assert error message rendered and movie content not rendered
  - [x] 8.5 Write property test for Property 4: Home search query controls visible content — generate random non-empty and empty query strings, assert correct components are shown/hidden
  - [x] 8.6 Write unit test: Banner renders gradient + poster URL in backgroundImage when Poster is valid
  - [x] 8.7 Write unit test: Banner renders backgroundColor fallback when Poster is "N/A"
  - [x] 8.8 Write unit test: Banner renders "Play" and "More Info" buttons when movie is loaded
  - [x] 8.9 Write unit test: Row renders "Loading..." when loading=true
  - [x] 8.10 Write unit test: Row renders error message when error is non-null
  - [x] 8.11 Write unit test: Home mounts with empty searchQuery and renders Banner
  - [x] 8.12 Write unit test: Home hides Banner when searchQuery is non-empty
  - [x] 8.13 Write unit test: Navbar has position sticky, zIndex >= 100, and red "NETFLIX" logo
  - [x] 8.14 Write unit test: index.css has exactly one body rule with correct properties and no Vite boilerplate
