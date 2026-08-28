import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { SkillTagInput } from "./SkillTagInput";

function TagHarness() {
  const [tags, setTags] = useState<string[]>([]);
  return (
    <SkillTagInput
      id="technology-tags-test"
      label="Technology tags"
      skills={tags}
      onChange={setTags}
      suggestions={[]}
    />
  );
}

describe("SkillTagInput", () => {
  it("adds tags with comma or Enter and removes them with the accessible close button", () => {
    render(<TagHarness />);
    const input = screen.getByRole("textbox", { name: "Technology tags" });

    fireEvent.change(input, { target: { value: "React" } });
    fireEvent.keyDown(input, { key: "," });
    expect(screen.getByText("React")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "TypeScript" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByText("TypeScript")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "ลบทักษะ React" }));
    expect(screen.queryByText("React")).not.toBeInTheDocument();
  });
});
