import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  global.fetch.mockReset();
});

test("displays matching movies returned by OMDb", () => {
  global.fetch.mockResolvedValue({
    json: () => Promise.resolve({
      Response: "True",
      Search: [
        {
          imdbID: "tt0133093",
          Title: "The Matrix",
          Year: "1999",
          Poster: "https://example.com/matrix.jpg",
        },
      ],
    }),
  });

  render(<App />);
  fireEvent.change(screen.getByLabelText("Search movie titles"), {
    target: { value: "The Matrix" },
  });
  fireEvent.click(screen.getByRole("button", { name: /search/i }));

  return screen.findByRole("heading", { name: "The Matrix" }).then((heading) => {
    expect(heading).toBeTruthy();
    expect(screen.getByText("1999")).toBeTruthy();
    expect(global.fetch).toHaveBeenCalledWith(
      "https://www.omdbapi.com/?apikey=99eb9fd1&s=The%20Matrix"
    );
  });
});

test("shows the required error for an invalid movie search", () => {
  global.fetch.mockResolvedValue({
    json: () => Promise.resolve({ Response: "False", Error: "Movie not found!" }),
  });

  render(<App />);
  fireEvent.change(screen.getByLabelText("Search movie titles"), {
    target: { value: "not a real movie" },
  });
  fireEvent.click(screen.getByRole("button", { name: /search/i }));

  return screen.findByRole("alert").then((error) => {
    expect(error.textContent).toBe("Invalid movie name. Please try again.");
    expect(error.className).toBe("error");
  });
});
