import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AnnouncementBar } from "@/components/layout/announcement-bar";

const announcements = ["הודעה ראשונה", "הודעה שנייה", "הודעה שלישית"];

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("AnnouncementBar", () => {
  it("keeps the continuous marquee for regular motion preferences", () => {
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { container } = render(<AnnouncementBar messages={announcements} />);

    expect(container.querySelector(".announcement-track")).toBeInTheDocument();
    expect(screen.queryByTestId("reduced-motion-announcement")).not.toBeInTheDocument();
  });

  it("rotates messages without sliding when reduced motion is enabled", () => {
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", () => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    render(<AnnouncementBar messages={announcements} />);

    expect(screen.getByTestId("reduced-motion-announcement")).toHaveTextContent("הודעה ראשונה");
    act(() => vi.advanceTimersByTime(4_000));
    expect(screen.getByTestId("reduced-motion-announcement")).toHaveTextContent("הודעה שנייה");
  });
});
