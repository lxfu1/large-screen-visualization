import { render, screen } from "@testing-library/react";
import App from "src/app";

test("renders header", () => {
  render(<App />);
  const linkElement = screen.getByText(/Ant Design Charts/i);
  expect(linkElement).toBeInTheDocument();
});
