import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import TaskCard from "./TaskCard";
import { mockItems } from "../test/mock-data";

describe("TaskCard", () => {
  const defaultProps = {
    item: mockItems.simple,
    onDelete: vi.fn(),
    onEdit: vi.fn(),
    onDragStart: vi.fn(),
  };

  it("renders task name", () => {
    render(<TaskCard {...defaultProps} />);
    expect(screen.getByText(mockItems.simple.name)).toBeInTheDocument();
  });

  it("renders task description when provided", () => {
    render(<TaskCard {...defaultProps} item={mockItems.withDescription} />);
    expect(
      screen.getByText(mockItems.withDescription.description),
    ).toBeInTheDocument();
  });

  it("does not render description when empty", () => {
    const itemWithoutDesc = { ...mockItems.simple, description: "" };
    render(<TaskCard {...defaultProps} item={itemWithoutDesc} />);

    // Only the name should be visible
    expect(screen.getByText(itemWithoutDesc.name)).toBeInTheDocument();
    const taskCard = screen.getByTestId(`task-${itemWithoutDesc.id}`);
    expect(taskCard.querySelectorAll("p").length).toBe(0);
  });

  it("renders tags when present", () => {
    render(<TaskCard {...defaultProps} item={mockItems.withTags} />);

    mockItems.withTags.tags.forEach((tag) => {
      expect(screen.getByText(tag.name)).toBeInTheDocument();
    });
  });

  it("does not render tags section when no tags", () => {
    render(<TaskCard {...defaultProps} item={mockItems.simple} />);

    const taskCard = screen.getByTestId(`task-${mockItems.simple.id}`);
    const tagContainer = taskCard.querySelector(".flex.flex-wrap.gap-1\\.5");
    expect(tagContainer).not.toBeInTheDocument();
  });

  it("renders delete button", () => {
    render(<TaskCard {...defaultProps} />);
    expect(
      screen.getByTestId(`delete-task-${mockItems.simple.id}`),
    ).toBeInTheDocument();
  });

  it("renders edit button", () => {
    render(<TaskCard {...defaultProps} />);
    expect(
      screen.getByTestId(`edit-task-${mockItems.simple.id}`),
    ).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    render(<TaskCard {...defaultProps} onEdit={onEdit} />);

    const editButton = screen.getByTestId(`edit-task-${mockItems.simple.id}`);
    await user.click(editButton);

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(mockItems.simple);
  });

  it("calls onDelete when delete button is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(<TaskCard {...defaultProps} onDelete={onDelete} />);

    const deleteButton = screen.getByTestId(
      `delete-task-${mockItems.simple.id}`,
    );
    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(mockItems.simple.id);
  });

  it("is draggable", () => {
    render(<TaskCard {...defaultProps} />);
    const taskCard = screen.getByTestId(`task-${mockItems.simple.id}`);
    expect(taskCard).toHaveAttribute("draggable", "true");
  });

  it("calls onDragStart when drag starts", () => {
    const onDragStart = vi.fn();
    render(<TaskCard {...defaultProps} onDragStart={onDragStart} />);

    const taskCard = screen.getByTestId(`task-${mockItems.simple.id}`);
    const dragEvent = new Event("dragstart", { bubbles: true });

    taskCard.dispatchEvent(dragEvent);

    expect(onDragStart).toHaveBeenCalledTimes(1);
    expect(onDragStart).toHaveBeenCalledWith(
      expect.any(Object),
      mockItems.simple,
    );
  });

  it("has correct styling classes", () => {
    render(<TaskCard {...defaultProps} />);
    const taskCard = screen.getByTestId(`task-${mockItems.simple.id}`);

    expect(taskCard).toHaveClass("group");
    expect(taskCard).toHaveClass("rounded-lg");
    expect(taskCard).toHaveClass("cursor-grab");
  });

  it("renders expiration date when provided", () => {
    const itemWithExpiration = {
      ...mockItems.simple,
      expiration_date: "2099-12-31",
    };
    render(<TaskCard {...defaultProps} item={itemWithExpiration} />);

    const expirationEl = screen.getByTestId(
      `expiration-date-${itemWithExpiration.id}`,
    );
    expect(expirationEl).toBeInTheDocument();
  });

  it("does not render expiration date when not provided", () => {
    render(<TaskCard {...defaultProps} item={mockItems.simple} />);

    expect(
      screen.queryByTestId(`expiration-date-${mockItems.simple.id}`),
    ).not.toBeInTheDocument();
  });

  it("shows expiration date in red when overdue", () => {
    const overdueItem = {
      ...mockItems.simple,
      expiration_date: "2000-01-01",
    };
    render(<TaskCard {...defaultProps} item={overdueItem} />);

    const expirationEl = screen.getByTestId(
      `expiration-date-${overdueItem.id}`,
    );
    expect(expirationEl).toHaveClass("text-red-600");
  });

  it("shows expiration date in orange when between 24 and 72 hours", () => {
    const now = new Date();
    const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const dateStr = in48h.toISOString().split("T")[0];
    const orangeItem = { ...mockItems.simple, expiration_date: dateStr };
    render(<TaskCard {...defaultProps} item={orangeItem} />);

    const expirationEl = screen.getByTestId(
      `expiration-date-${orangeItem.id}`,
    );
    expect(expirationEl).toHaveClass("text-orange-500");
  });

  it("shows expiration date in default color when more than 72 hours away", () => {
    const now = new Date();
    const in96h = new Date(now.getTime() + 96 * 60 * 60 * 1000);
    const dateStr = in96h.toISOString().split("T")[0];
    const defaultItem = { ...mockItems.simple, expiration_date: dateStr };
    render(<TaskCard {...defaultProps} item={defaultItem} />);

    const expirationEl = screen.getByTestId(
      `expiration-date-${defaultItem.id}`,
    );
    expect(expirationEl).toHaveClass("text-slate-500");
  });
});
