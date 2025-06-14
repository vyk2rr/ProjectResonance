import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PianoZap from "./PianoZap";
import { triggerAttackReleaseMock } from "../../../__mocks__/tone";

describe("PianoZap", () => {
  beforeEach(() => {
    render(<PianoZap />);
  });

  it("renders both buttons", () => {
    expect(screen.getByRole("button", { name: /zap with highlight/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /zap without highlighted keys/i })).toBeInTheDocument();
  });

  it("disables both buttons after clicking one", () => {
    const btn1 = screen.getByRole("button", { name: /zap with highlight/i });
    const btn2 = screen.getByRole("button", { name: /zap without highlighted keys/i });

    fireEvent.click(btn1);

    expect(btn1).toBeDisabled();
    expect(btn2).toBeDisabled();
  });

  it("When pressed highlights keys for a moment", () => {
    const btn1 = screen.getByRole("button", { name: /zap with highlight/i });
    const btn2 = screen.getByRole("button", { name: /zap with highlight/i });
    fireEvent.click(btn1);
    expect(btn1).toBeDisabled();
    expect(btn2).toBeDisabled();
    
    expect(triggerAttackReleaseMock).toHaveBeenCalledTimes(4);
  })


});