import React from 'react';
import { render, act, fireEvent, waitFor } from '@testing-library/react';
import PianoMelodySequence from './PianoMelodySequence';
import { PianoObserver } from '../../PianoObserver/PianoObserver';

// Mock el componente PianoBase
jest.mock('../../PianoBase/PianoBase', () => {
  return function MockPianoBase() {
    return <div data-testid="piano-base" />;
  };
});

// Mock la instancia del observable
jest.mock('../../PianoObserver/PianoObserver', () => ({
  PianoObserver: jest.fn().mockImplementation(() => ({
    subscribe: jest.fn((callback) => {
      mockCallback = callback;
      return () => {};
    }),
    notify: jest.fn((event) => mockCallback(event))
  }))
}));

let mockCallback: (event: any) => void;

describe('PianoMelodySequence', () => {
  it('shows initial state', () => {
    const { getByText } = render(<PianoMelodySequence />);
    expect(getByText('B3, D4, F4, A4, C5')).toBeInTheDocument();
  });

  it('updates recent notes when piano key is played', () => {
    const { getByText } = render(<PianoMelodySequence />);
    
    act(() => {
      mockCallback({ type: 'notePlayed', note: 'C4' });
    });

    expect(getByText(/C4/)).toBeInTheDocument();
  });

  it('keeps only last 5 notes', () => {
    const { getByText } = render(<PianoMelodySequence />);
    
    act(() => {
      ['C4', 'D4', 'E4', 'F4', 'G4', 'A4'].forEach(note => {
        mockCallback({ type: 'notePlayed', note });
      });
    });

    expect(getByText(/A4, G4, F4, E4, D4/)).toBeInTheDocument();
  });

});