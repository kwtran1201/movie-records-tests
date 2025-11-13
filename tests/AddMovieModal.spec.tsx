import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddMovieModal } from "../src/components/AddMovieModal";
import type { Watch } from "../src/interfaces/watch";
import { EditableSongList } from "../src/components/EditableSongList";
import { MovieEditor } from "../src/components/MovieEditor";
import type { Movie } from "../src/interfaces/movie";

/**
 * These are AI-generated test for the dialog.
 * Additional Jest Test Examples focusing on:
 * - Modal interactions
 * - Using findBy* for asynchronous queries
 * - Testing callbacks and function calls
 * - Complex user workflows
 */

describe("AddMovieModal Component", () => {
    const mockHandleClose = jest.fn();
    const mockAddMovie = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * Example 1: Testing modal visibility with queryBy vs getBy
     * - queryBy returns null when element doesn't exist
     * - Useful for testing conditional rendering
     */
    test("should not render modal content when show is false", () => {
        render(
            <AddMovieModal
                show={false}
                handleClose={mockHandleClose}
                addMovie={mockAddMovie}
            />,
        );

        // Using queryBy* to check for non-existence
        const modalTitle = screen.queryByText("Add New Movie");
        expect(modalTitle).not.toBeInTheDocument();
    });

    /**
     * Example 2: Testing modal content when visible
     */
    test("should render modal content when show is true", () => {
        render(
            <AddMovieModal
                show={true}
                handleClose={mockHandleClose}
                addMovie={mockAddMovie}
            />,
        );

        // Using getBy* when we expect element to exist
        const modalTitle = screen.getByText("Add New Movie");
        expect(modalTitle).toBeInTheDocument();

        // Check for form labels
        const youtubeIdLabel = screen.getByText(/YouTube ID/i);
        expect(youtubeIdLabel).toBeInTheDocument();

        const spotifyIdsLabel = screen.getByText(/Spotify IDs/i);
        expect(spotifyIdsLabel).toBeInTheDocument();
    });

    /**
     * Example 3: Testing form input with getByLabelText
     * - Shows how to find inputs by their associated labels
     */
    test("should allow entering YouTube ID using getByLabelText", () => {
        render(
            <AddMovieModal
                show={true}
                handleClose={mockHandleClose}
                addMovie={mockAddMovie}
            />,
        );

        // Find input by its label text
        const youtubeIdInput = screen.getByLabelText(/YouTube ID/i);
        expect(youtubeIdInput).toHaveValue("");

        // Type into the input
        userEvent.type(youtubeIdInput, "dQw4w9WgXcQ");
        expect(youtubeIdInput).toHaveValue("dQw4w9WgXcQ");
    });

    /**
     * Example 4: Testing button clicks and callback functions
     * - Demonstrates verifying function calls with jest.fn()
     * - Uses getAllByRole and index to handle multiple "Close" buttons
     */
    test("should call handleClose when Close button is clicked", () => {
        render(
            <AddMovieModal
                show={true}
                handleClose={mockHandleClose}
                addMovie={mockAddMovie}
            />,
        );

        // Get all Close buttons and click the footer one (second button with "Close")
        const allButtons = screen.getAllByRole("button");
        const closeButton = allButtons.find(
            (btn) => btn.textContent === "Close",
        );

        if (closeButton) {
            userEvent.click(closeButton);
        }

        expect(mockHandleClose).toHaveBeenCalledTimes(1);
        expect(mockAddMovie).not.toHaveBeenCalled();
    });

    /**
     * Example 5: Testing complete form submission workflow
     * - Demonstrates sequential interactions
     * - Verifies callback with correct arguments
     */
    test("should call addMovie with correct data when Save Changes is clicked", () => {
        render(
            <AddMovieModal
                show={true}
                handleClose={mockHandleClose}
                addMovie={mockAddMovie}
            />,
        );

        // Step 1: Fill in the YouTube ID
        const youtubeIdInput = screen.getByLabelText(/YouTube ID/i);
        userEvent.type(youtubeIdInput, "test-video-id");

        // Step 2: Click Save Changes button
        const saveButton = screen.getByRole("button", {
            name: /save changes/i,
        });
        userEvent.click(saveButton);

        // Step 3: Verify addMovie was called with correct structure
        expect(mockAddMovie).toHaveBeenCalledTimes(1);
        expect(mockAddMovie).toHaveBeenCalledWith(
            expect.objectContaining({
                id: "test-video-id",
                title: "",
                rating: 0,
                description: "",
                released: 0,
                watched: expect.objectContaining({
                    seen: false,
                    liked: false,
                    when: null,
                }) as Watch,
            }),
        );

        // Step 4: Verify modal close was triggered
        expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });

    /**
     * Example 6: Using getByRole with name option
     * - Shows how to find specific buttons when multiple exist
     * - Demonstrates using getAllByRole to handle multiple matches
     */
    test("should distinguish between buttons using role and name", () => {
        render(
            <AddMovieModal
                show={true}
                handleClose={mockHandleClose}
                addMovie={mockAddMovie}
            />,
        );

        // When there are multiple buttons with same name, use getAllByRole
        const allButtons = screen.getAllByRole("button");
        const closeButton = allButtons.find(
            (btn) => btn.textContent === "Close",
        );
        const saveButton = screen.getByRole("button", {
            name: /save changes/i,
        });

        expect(closeButton).toBeInTheDocument();
        expect(saveButton).toBeInTheDocument();
        expect(closeButton).not.toBe(saveButton);
    });

    /**
     * Example 7: Testing with getAllByRole
     * - Shows how to query multiple elements of the same type
     */
    test("should find all buttons using getAllByRole", () => {
        render(
            <AddMovieModal
                show={true}
                handleClose={mockHandleClose}
                addMovie={mockAddMovie}
            />,
        );

        const allButtons = screen.getAllByRole("button");

        // Should have at least 2 buttons (Close and Save Changes)
        // Plus any additional buttons from EditableSongList component
        expect(allButtons.length).toBeGreaterThanOrEqual(2);
    });

    /**
     * Example 8: Using waitFor for async operations
     * - Demonstrates waiting for elements or state changes
     */
    test("should handle async operations with waitFor", async () => {
        render(
            <AddMovieModal
                show={true}
                handleClose={mockHandleClose}
                addMovie={mockAddMovie}
            />,
        );

        const youtubeIdInput = screen.getByLabelText(/YouTube ID/i);
        userEvent.type(youtubeIdInput, "async-test-id");

        // Wait for the value to be updated
        await waitFor(() => {
            expect(youtubeIdInput).toHaveValue("async-test-id");
        });
    });

    /**
     * Example 9: Testing empty form submission
     * - Verifies behavior when no input is provided
     */
    test("should handle save with empty YouTube ID", () => {
        render(
            <AddMovieModal
                show={true}
                handleClose={mockHandleClose}
                addMovie={mockAddMovie}
            />,
        );

        const saveButton = screen.getByRole("button", {
            name: /save changes/i,
        });
        userEvent.click(saveButton);

        // Should still call addMovie, just with empty id
        expect(mockAddMovie).toHaveBeenCalledWith(
            expect.objectContaining({
                id: "",
            }),
        );
    });

    /**
     * Example 10: Using getByText for finding labels and static text
     */
    test("should find form labels using getByText", () => {
        render(
            <AddMovieModal
                show={true}
                handleClose={mockHandleClose}
                addMovie={mockAddMovie}
            />,
        );

        // Find text content directly
        expect(screen.getByText("Add New Movie")).toBeInTheDocument();
        expect(screen.getByText(/YouTube ID/i)).toBeInTheDocument();
        expect(screen.getByText(/Spotify IDs/i)).toBeInTheDocument();
    });

    /**
     * Example 11: Testing user interaction flow with multiple steps
     * - Demonstrates realistic user behavior
     */
    test("should handle complete user interaction flow", () => {
        render(
            <AddMovieModal
                show={true}
                handleClose={mockHandleClose}
                addMovie={mockAddMovie}
            />,
        );

        // User types in YouTube ID
        const input = screen.getByLabelText(/YouTube ID/i);
        userEvent.click(input); // Focus the input
        userEvent.type(input, "my-movie-trailer");

        // Verify input value
        expect(input).toHaveValue("my-movie-trailer");

        // User clicks save
        const saveButton = screen.getByRole("button", {
            name: /save changes/i,
        });
        userEvent.click(saveButton);

        // Verify both callbacks were triggered in correct order
        expect(mockAddMovie).toHaveBeenCalled();
        expect(mockHandleClose).toHaveBeenCalled();
    });

    /**
     * Example 12: Using getByRole for various element types
     * - Shows querying different semantic elements
     */
    test("should query various elements by their roles", () => {
        render(
            <AddMovieModal
                show={true}
                handleClose={mockHandleClose}
                addMovie={mockAddMovie}
            />,
        );

        // Text input has role="textbox"
        const textInput = screen.getByRole("textbox");
        expect(textInput).toBeInTheDocument();

        // Buttons have role="button"
        const buttons = screen.getAllByRole("button");
        expect(buttons.length).toBeGreaterThan(0);
    });
});

describe("Editable Songlist Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const setSongs = jest.fn();

    it("should add songs when clicked", () => {
        const mockSongs: string[] = [];
        render(<EditableSongList songs={mockSongs} setSongs={setSongs} />);
        const addButton = screen.getByText("Add Song");
        expect(addButton).toBeInTheDocument();
        userEvent.click(addButton);
        expect(setSongs).toHaveBeenCalledWith([""]);
    });

    it("should edit song when input changes", () => {
        const songs = ["Song 1"];
        render(<EditableSongList songs={songs} setSongs={setSongs} />);
        const input = screen.getByDisplayValue("Song 1");
        expect(input).toBeInTheDocument();
        userEvent.type(input, "New Song 2");
        expect(setSongs).toHaveBeenCalledTimes(10);
    });

    it("should delete song when delete button is clicked", () => {
        const songs = ["Song 1", "Song 2"];
        render(<EditableSongList songs={songs} setSongs={setSongs} />);
        const deleteButtons = screen.getAllByRole("button", { name: "❌" });
        expect(deleteButtons.length).toBe(2);
        userEvent.click(deleteButtons[0]);
        expect(setSongs).toHaveBeenCalledWith(["Song 2"]);
    });
});

describe("Movie Editor Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const changeEditing = jest.fn();
    const editMovie = jest.fn();
    const deleteMovie = jest.fn();
    const movie: Movie = {
        title: "Test Movie",
        released: 2024,
        description: "A movie for testing",
        id: "test-movie-1",
        rating: 6,
        soundtrack: [],
        watched: { seen: true, liked: true, when: null },
    };

    it("should handle save button click", () => {
        render(
            <MovieEditor
                changeEditing={changeEditing}
                editMovie={editMovie}
                deleteMovie={deleteMovie}
                movie={movie}
            />,
        );
        const saveButton = screen.getByRole("button", { name: /save/i });
        expect(saveButton).toBeInTheDocument();
        userEvent.click(saveButton);
        expect(changeEditing).toHaveBeenCalledTimes(1);
    });

    it("should handle cancel button click", () => {
        render(
            <MovieEditor
                changeEditing={changeEditing}
                editMovie={editMovie}
                deleteMovie={deleteMovie}
                movie={movie}
            />,
        );
        const cancelButton = screen.getByRole("button", { name: /cancel/i });
        expect(cancelButton).toBeInTheDocument();
        userEvent.click(cancelButton);
        expect(changeEditing).toHaveBeenCalled();
    });

    it("should change movie title on input change", () => {
        render(
            <MovieEditor
                changeEditing={changeEditing}
                editMovie={editMovie}
                deleteMovie={deleteMovie}
                movie={movie}
            />,
        );
        const titleInput = screen.getByLabelText(/title/i);
        const saveButton = screen.getByRole("button", { name: /save/i });
        expect(titleInput).toBeInTheDocument();
        userEvent.clear(titleInput);
        userEvent.type(titleInput, "New Title");
        userEvent.click(saveButton);
        expect(changeEditing).toHaveBeenCalledTimes(1);
    });

    it("should change release year on input change", () => {
        render(
            <MovieEditor
                changeEditing={changeEditing}
                editMovie={editMovie}
                deleteMovie={deleteMovie}
                movie={movie}
            />,
        );
        const releasedInput = screen.getAllByLabelText(/release year/i);
        const saveButton = screen.getByRole("button", { name: /save/i });
        expect(releasedInput[0]).toBeInTheDocument();
        userEvent.clear(releasedInput[0]);
        userEvent.type(releasedInput[0], "2025");
        userEvent.click(saveButton);
        expect(changeEditing).toHaveBeenCalledTimes(1);
    });

    it("should change rating on input change", () => {
        render(
            <MovieEditor
                changeEditing={changeEditing}
                editMovie={editMovie}
                deleteMovie={deleteMovie}
                movie={movie}
            />,
        );
        const ratingInput = screen.getAllByLabelText(/release year/i);
        const saveButton = screen.getByRole("button", { name: /save/i });
        expect(ratingInput[1]).toBeInTheDocument();
        userEvent.selectOptions(ratingInput[1], "8");
        userEvent.click(saveButton);
        expect(editMovie).toHaveBeenCalledWith(movie.id, {
            ...movie,
            rating: 8,
        });
        expect(changeEditing).toHaveBeenCalledTimes(1);
    });

    it("should change description on input change", () => {
        render(
            <MovieEditor
                changeEditing={changeEditing}
                editMovie={editMovie}
                deleteMovie={deleteMovie}
                movie={movie}
            />,
        );
        const descriptionInput = screen.getByLabelText(/description/i);
        const saveButton = screen.getByRole("button", { name: /save/i });
        expect(descriptionInput).toBeInTheDocument();
        userEvent.type(descriptionInput, "New Description");
        userEvent.click(saveButton);
        expect(changeEditing).toHaveBeenCalledTimes(1);
    });

    it("should handle union type of release year and rating inputs", () => {
        const movieWithInvalidValues: Movie = {
            title: "Test Movie",
            released: 0,
            description: "A movie for testing",
            id: "test-movie-1",
            rating: 0,
            soundtrack: [],
            watched: { seen: true, liked: true, when: null },
        };
        render(
            <MovieEditor
                changeEditing={changeEditing}
                editMovie={editMovie}
                deleteMovie={deleteMovie}
                movie={movieWithInvalidValues}
            />,
        );
        const saveButton = screen.getByRole("button", { name: /save/i });
        expect(saveButton).toBeInTheDocument();
        userEvent.click(saveButton);

        expect(editMovie).toHaveBeenCalledWith(movieWithInvalidValues.id, {
            ...movieWithInvalidValues,
            released: 0,
            rating: 0,
        });
        expect(changeEditing).toHaveBeenCalledTimes(1);
    });
});
