# Requirements Document

## Introduction

This feature covers a set of polish and bug-fix improvements to an existing Netflix clone built with React + Vite using the OMDB API. The changes address broken environment variable wiring, missing UI elements (background image, buttons, loading/error states), an incorrect on-mount side effect that hides default content, leftover Vite boilerplate styles, a plain navbar, and a wrong page title.

## Glossary

- **App**: The Netflix clone React + Vite single-page application.
- **Banner**: The full-width hero component displayed at the top of the home page.
- **Row**: A horizontally-scrollable list of movie poster cards.
- **Navbar**: The top navigation bar component.
- **Home**: The main page component that composes Navbar, Banner, Rows, and SearchBar.
- **OMDB_API_KEY**: The environment variable `VITE_OMDB_API_KEY` used to authenticate requests to the OMDB API.
- **SearchBar**: The input component that triggers a movie search.
- **Poster**: The movie poster image URL returned by the OMDB API in the `Poster` field.

---

## Requirements

### Requirement 1: Correct Environment Variable Name and Location

**User Story:** As a developer, I want the OMDB API key environment variable to be correctly named and placed at the project root, so that Vite can inject it at build time and API requests succeed.

#### Acceptance Criteria

1. THE App SHALL read the OMDB API key from the environment variable named `VITE_OMDB_API_KEY`.
2. THE App SHALL load the `.env` file from the project root directory (the same level as `vite.config.js`).
3. WHEN `requests.js` constructs API URLs, THE App SHALL use `import.meta.env.VITE_OMDB_API_KEY` as the API key value.
4. IF the `.env` file is located inside a subdirectory, THEN THE App SHALL NOT load it (Vite only reads `.env` from the project root).

---

### Requirement 2: Banner Background Image and Action Buttons

**User Story:** As a viewer, I want the Banner to display a movie's poster as a full-width background image with a gradient overlay and action buttons, so that the home page looks like a real Netflix hero section.

#### Acceptance Criteria

1. WHEN a movie is fetched successfully, THE Banner SHALL set the `backgroundImage` CSS property on the header element to the movie's `Poster` URL.
2. THE Banner SHALL apply a CSS gradient overlay (e.g., `linear-gradient`) over the background image so that text remains readable.
3. THE Banner SHALL display a "Play" button and a "More Info" button below the movie title.
4. WHEN the movie's `Poster` value is `"N/A"` or absent, THE Banner SHALL fall back to a solid dark background color.
5. WHILE movie data is being fetched, THE Banner SHALL display a loading indicator (e.g., "Loading..." text).
6. IF the fetch request fails, THEN THE Banner SHALL display an error message (e.g., "Failed to load featured content.").

---

### Requirement 3: Home Page Default Content on Load

**User Story:** As a viewer, I want the home page to show the Banner and default movie rows on first load without triggering a search, so that I see curated content immediately.

#### Acceptance Criteria

1. WHEN the Home page mounts, THE Home SHALL NOT automatically invoke a search query.
2. WHEN the Home page mounts with no active search query, THE Home SHALL display the Banner component.
3. WHEN the Home page mounts with no active search query, THE Home SHALL display all default Row components (Trending, Marvel, Action, Comedy, Drama).
4. WHEN the user submits a search query via the SearchBar, THE Home SHALL display search results and hide the Banner and default rows.
5. WHEN the search query is cleared, THE Home SHALL restore the Banner and default rows.

---

### Requirement 4: Clean Netflix-Themed Global Stylesheet

**User Story:** As a developer, I want `index.css` to contain only Netflix-appropriate base styles without Vite boilerplate, so that the app has a consistent dark theme.

#### Acceptance Criteria

1. THE App SHALL apply a black (`#000` or `#111`) background color to the `body` element.
2. THE App SHALL apply white text color to the `body` element.
3. THE App SHALL NOT apply `display: flex` or `place-items: center` to the `body` element.
4. THE App SHALL NOT include Vite default styles such as the `#646cff` button hover color or the light-mode media query that overrides the dark theme.
5. THE App SHALL define exactly one `body {}` rule in `index.css`.
6. THE App SHALL use a Netflix-appropriate font stack (e.g., `Arial, Helvetica, sans-serif` or similar) in the global stylesheet.

---

### Requirement 5: Styled Sticky Navbar

**User Story:** As a viewer, I want the Navbar to display a styled Netflix logo and remain visible while scrolling, so that navigation is always accessible.

#### Acceptance Criteria

1. THE Navbar SHALL display the text "NETFLIX" styled in bold red (e.g., `#e50914`) as the logo.
2. THE Navbar SHALL use `position: sticky` and `top: 0` so it remains at the top of the viewport during scroll.
3. THE Navbar SHALL use a `z-index` of at least `100` so it renders above other page content.
4. THE Navbar SHALL have a dark or semi-transparent background so it is visually distinct from page content.

---

### Requirement 6: Loading and Error States in Row and Banner

**User Story:** As a viewer, I want to see a loading indicator while movie data is being fetched and an error message if the fetch fails, so that I understand the app's current state.

#### Acceptance Criteria

1. WHILE the Row component is fetching data from the API, THE Row SHALL display a loading indicator (e.g., "Loading..." text).
2. IF the Row fetch request fails, THEN THE Row SHALL display an error message (e.g., "Failed to load movies.").
3. WHILE the Banner component is fetching data from the API, THE Banner SHALL display a loading indicator.
4. IF the Banner fetch request fails, THEN THE Banner SHALL display an error message.
5. WHEN data has loaded successfully, THE Row SHALL hide the loading indicator and display the movie posters.
6. WHEN data has loaded successfully, THE Banner SHALL hide the loading indicator and display the featured movie.

---

### Requirement 7: Correct Page Title

**User Story:** As a viewer, I want the browser tab to display "Netflix" as the page title, so that the app is identifiable in the browser.

#### Acceptance Criteria

1. THE App SHALL set the HTML `<title>` element in `index.html` to `Netflix`.
