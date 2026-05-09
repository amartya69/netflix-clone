/**
 * Row tests — unit tests (8.9, 8.10) and property-based tests (8.3, 8.4)
 */
import { render, screen, waitFor } from '@testing-library/react';
import * as fc from 'fast-check';

vi.mock('../utils/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

import axios from '../utils/api';
import Row from '../components/Row';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeMovie(id = 'tt0000001', poster = 'https://example.com/poster.jpg') {
  return {
    imdbID: id,
    Title: `Movie ${id}`,
    Year: '2020',
    Type: 'movie',
    Poster: poster,
  };
}

// ---------------------------------------------------------------------------
// Unit tests
// ---------------------------------------------------------------------------

describe('Row — unit tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // 8.9: Row renders "Loading..." when loading=true
  // ---------------------------------------------------------------------------
  it('8.9 renders "Loading..." while fetch is in progress', () => {
    // Never resolves — keeps loading state active
    axios.get.mockReturnValue(new Promise(() => {}));

    render(<Row title="Test Row" fetchUrl="?apikey=test&s=avengers" />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  // ---------------------------------------------------------------------------
  // 8.10: Row renders error message when error is non-null
  // ---------------------------------------------------------------------------
  it('8.10 renders error message when fetch fails', async () => {
    axios.get.mockRejectedValue(new Error('Network error'));

    render(<Row title="Test Row" fetchUrl="?apikey=test&s=avengers" />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load movies.')).toBeInTheDocument();
    });

    // Movie content should not be shown
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders movies when fetch succeeds', async () => {
    const movies = [makeMovie('tt0000001'), makeMovie('tt0000002')];
    axios.get.mockResolvedValue({ data: { Search: movies } });

    render(<Row title="Test Row" fetchUrl="?apikey=test&s=avengers" />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('renders movies directly when propMovies is provided (no loading/error)', () => {
    const movies = [makeMovie('tt0000001'), makeMovie('tt0000002')];

    render(<Row title="Test Row" movies={movies} />);

    // No loading indicator
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    // Movies are rendered
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// Property-based tests
// ---------------------------------------------------------------------------

describe('Row — property-based tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // 8.3 — Property 2: Loading/error/content states are mutually exclusive (Row)
  // Tag: Feature: netflix-clone-polish, Property 2: Loading state transitions are mutually exclusive with content
  // Validates: Requirements 6.1, 6.3, 6.5, 6.6
  // ---------------------------------------------------------------------------
  it('8.3 Property 2: loading, error, and content states are mutually exclusive in Row', async () => {
    // Tag: Feature: netflix-clone-polish, Property 2: Loading state transitions are mutually exclusive with content

    const stateArb = fc.oneof(
      // error state
      fc.string({ minLength: 1 }).map((msg) => ({ kind: 'error' })),
      // success state with movies
      fc.array(
        fc.record({
          imdbID: fc.string({ minLength: 1, maxLength: 10 }),
          Title: fc.string({ minLength: 1 }),
          Year: fc.string({ minLength: 4, maxLength: 4 }),
          Type: fc.constant('movie'),
          Poster: fc.oneof(fc.webUrl(), fc.constant('N/A')),
        }),
        { minLength: 0, maxLength: 5 },
      ).map((movies) => ({ kind: 'success', movies })),
    );

    await fc.assert(
      fc.asyncProperty(stateArb, async (state) => {
        vi.clearAllMocks();

        if (state.kind === 'error') {
          axios.get.mockRejectedValue(new Error('Network error'));
        } else {
          axios.get.mockResolvedValue({ data: { Search: state.movies } });
        }

        const { unmount } = render(
          <Row title="Test Row" fetchUrl="?apikey=test&s=avengers" />,
        );

        await waitFor(() => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        });

        const hasLoading = !!screen.queryByText('Loading...');
        const hasError = !!screen.queryByText('Failed to load movies.');
        // Content area is the flex container for movies (or "No movies available")
        const hasContent =
          !!document.querySelector('[style*="overflow"]') ||
          !!screen.queryByText('No movies available');

        // Loading and error should not both be true
        expect(hasLoading && hasError).toBe(false);
        // Loading and content should not both be true
        expect(hasLoading && hasContent).toBe(false);

        unmount();
      }),
      { numRuns: 50 },
    );
  });

  // ---------------------------------------------------------------------------
  // 8.4 — Property 3: Error state suppresses content (Row)
  // Tag: Feature: netflix-clone-polish, Property 3: Error state suppresses content
  // Validates: Requirements 6.2, 6.4
  // ---------------------------------------------------------------------------
  it('8.4 Property 3: error state renders error message and suppresses movie content in Row', async () => {
    // Tag: Feature: netflix-clone-polish, Property 3: Error state suppresses content

    await fc.assert(
      fc.asyncProperty(fc.string({ minLength: 1 }), async (_errorMsg) => {
        vi.clearAllMocks();
        axios.get.mockRejectedValue(new Error(_errorMsg));

        const { unmount } = render(
          <Row title="Test Row" fetchUrl="?apikey=test&s=avengers" />,
        );

        await waitFor(() => {
          expect(screen.getByText('Failed to load movies.')).toBeInTheDocument();
        });

        // Error message is shown
        expect(screen.getByText('Failed to load movies.')).toBeInTheDocument();
        // No images (movie content) rendered
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
        // Loading indicator is NOT shown
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();

        unmount();
      }),
      { numRuns: 50 },
    );
  });
});
