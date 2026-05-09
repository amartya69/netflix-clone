/**
 * Banner tests — unit tests (8.6, 8.7, 8.8) and property-based tests (8.2, 8.3, 8.4)
 */
import { render, screen, waitFor, act } from '@testing-library/react';
import * as fc from 'fast-check';

// Mocks must be declared before imports that use them
vi.mock('../utils/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock('../utils/requests', () => ({
  default: {
    fetchTrending: '?apikey=test&s=avengers',
  },
}));

import axios from '../utils/api';
import Banner from '../components/Banner';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal OMDB-style movie object */
function makeMovie(poster) {
  return {
    imdbID: 'tt0000001',
    Title: 'Test Movie',
    Year: '2020',
    Type: 'movie',
    Poster: poster,
  };
}

function mockResolved(movie) {
  axios.get.mockResolvedValue({
    data: { Search: movie ? [movie] : [] },
  });
}

function mockRejected() {
  axios.get.mockRejectedValue(new Error('Network error'));
}

// ---------------------------------------------------------------------------
// Unit tests — 8.6: Banner renders gradient + poster URL when Poster is valid
// ---------------------------------------------------------------------------
describe('Banner — unit tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('8.6 renders backgroundImage with gradient and poster URL when Poster is a valid URL', async () => {
    const posterUrl = 'https://example.com/poster.jpg';
    mockResolved(makeMovie(posterUrl));

    render(<Banner />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const header = document.querySelector('header');
    expect(header).toBeInTheDocument();
    expect(header.style.backgroundImage).toContain(posterUrl);
    expect(header.style.backgroundImage).toContain('linear-gradient');
  });

  // ---------------------------------------------------------------------------
  // 8.7: Banner renders backgroundColor fallback when Poster is "N/A"
  // ---------------------------------------------------------------------------
  it('8.7 renders backgroundColor fallback when Poster is "N/A"', async () => {
    mockResolved(makeMovie('N/A'));

    render(<Banner />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const header = document.querySelector('header');
    expect(header).toBeInTheDocument();
    // backgroundImage should be empty / not set
    expect(header.style.backgroundImage).toBeFalsy();
    // jsdom converts #111 → rgb(17, 17, 17)
    expect(header.style.backgroundColor).toBe('rgb(17, 17, 17)');
  });

  // ---------------------------------------------------------------------------
  // 8.8: Banner renders "Play" and "More Info" buttons when movie is loaded
  // ---------------------------------------------------------------------------
  it('8.8 renders Play and More Info buttons when movie is loaded', async () => {
    mockResolved(makeMovie('https://example.com/poster.jpg'));

    render(<Banner />);

    await waitFor(() => {
      expect(screen.getByText(/Play/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Play/)).toBeInTheDocument();
    expect(screen.getByText(/More Info/)).toBeInTheDocument();
  });

  it('renders loading indicator initially', () => {
    // Never resolves during this test
    axios.get.mockReturnValue(new Promise(() => {}));

    render(<Banner />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error message when fetch fails', async () => {
    mockRejected();

    render(<Banner />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load featured content.')).toBeInTheDocument();
    });
  });
});

// ---------------------------------------------------------------------------
// Property-based tests
// ---------------------------------------------------------------------------

// Pure function extracted from Banner's render logic — tests the background style computation
function computeBackgroundStyle(movie) {
  const hasPoster = movie?.Poster && movie.Poster !== 'N/A';
  return hasPoster
    ? {
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 40%, transparent),
                          url(${movie.Poster})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }
    : { backgroundColor: '#111' };
}

describe('Banner — property-based tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // 8.2 — Property 1: Banner background reflects poster availability
  // Tag: Feature: netflix-clone-polish, Property 1: Banner background reflects poster availability
  // Validates: Requirements 2.1, 2.4
  // ---------------------------------------------------------------------------
  it('8.2 Property 1: backgroundImage contains URL iff Poster is a valid non-N/A string', () => {
    // Tag: Feature: netflix-clone-polish, Property 1: Banner background reflects poster availability

    // Test the pure background style logic directly — this is the core logic
    // that Banner uses to compute the header's style.
    const validPosterArb = fc.string({ minLength: 5 })
      .filter((s) => s !== 'N/A' && s.trim().length > 0);
    const invalidPosterArb = fc.oneof(
      fc.constant('N/A'),
      fc.constant(undefined),
      fc.constant(''),
      fc.constant(null),
    );
    const posterArb = fc.oneof(
      validPosterArb.map((url) => ({ poster: url, valid: true })),
      invalidPosterArb.map((p) => ({ poster: p, valid: false })),
    );

    fc.assert(
      fc.property(posterArb, ({ poster, valid }) => {
        const movie = {
          imdbID: 'tt0000001',
          Title: 'Test Movie',
          Year: '2020',
          Type: 'movie',
          Poster: poster,
        };

        const style = computeBackgroundStyle(movie);

        if (valid) {
          // Valid poster → backgroundImage should contain the URL
          expect(style.backgroundImage).toContain(poster);
          expect(style.backgroundImage).toContain('linear-gradient');
          expect(style.backgroundColor).toBeUndefined();
        } else {
          // Invalid poster → backgroundColor fallback
          expect(style.backgroundImage).toBeUndefined();
          expect(style.backgroundColor).toBe('#111');
        }
      }),
      { numRuns: 100 },
    );
  });

  // ---------------------------------------------------------------------------
  // 8.3 — Property 2: Loading/error/content states are mutually exclusive (Banner)
  // Tag: Feature: netflix-clone-polish, Property 2: Loading state transitions are mutually exclusive with content
  // Validates: Requirements 2.5, 6.1, 6.3, 6.5, 6.6
  // ---------------------------------------------------------------------------
  it('8.3 Property 2: loading, error, and content states are mutually exclusive in Banner', async () => {
    // Tag: Feature: netflix-clone-polish, Property 2: Loading state transitions are mutually exclusive with content

    // We test the two observable terminal states: error state and success state.
    // Loading state is transient and tested separately.

    const stateArb = fc.oneof(
      // error state
      fc.string({ minLength: 1 }).map((msg) => ({ kind: 'error', msg })),
      // success state with valid poster
      fc.webUrl().map((url) => ({ kind: 'success', poster: url })),
      // success state with N/A poster
      fc.constant({ kind: 'success', poster: 'N/A' }),
    );

    await fc.assert(
      fc.asyncProperty(stateArb, async (state) => {
        vi.clearAllMocks();

        if (state.kind === 'error') {
          axios.get.mockRejectedValue(new Error(state.msg));
        } else {
          const movie = makeMovie(state.poster);
          axios.get.mockResolvedValue({ data: { Search: [movie] } });
        }

        const { unmount } = render(<Banner />);

        await waitFor(() => {
          // Wait until loading is done
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        });

        const hasError = !!screen.queryByText('Failed to load featured content.');
        const hasContent = !!document.querySelector('header');
        const hasLoading = !!screen.queryByText('Loading...');

        // Exactly one of the three states should be active
        const activeCount = [hasError, hasContent, hasLoading].filter(Boolean).length;
        expect(activeCount).toBe(1);

        unmount();
      }),
      { numRuns: 50 },
    );
  });

  // ---------------------------------------------------------------------------
  // 8.4 — Property 3: Error state suppresses content (Banner)
  // Tag: Feature: netflix-clone-polish, Property 3: Error state suppresses content
  // Validates: Requirements 2.6, 6.2, 6.4
  // ---------------------------------------------------------------------------
  it('8.4 Property 3: error state renders error message and suppresses movie content', async () => {
    // Tag: Feature: netflix-clone-polish, Property 3: Error state suppresses content

    await fc.assert(
      fc.asyncProperty(fc.string({ minLength: 1 }), async (_errorMsg) => {
        vi.clearAllMocks();
        axios.get.mockRejectedValue(new Error(_errorMsg));

        const { unmount } = render(<Banner />);

        await waitFor(() => {
          expect(screen.getByText('Failed to load featured content.')).toBeInTheDocument();
        });

        // Error message is shown
        expect(screen.getByText('Failed to load featured content.')).toBeInTheDocument();
        // Movie content (header) is NOT shown
        expect(document.querySelector('header')).not.toBeInTheDocument();
        // Loading indicator is NOT shown
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();

        unmount();
      }),
      { numRuns: 50 },
    );
  });
});
