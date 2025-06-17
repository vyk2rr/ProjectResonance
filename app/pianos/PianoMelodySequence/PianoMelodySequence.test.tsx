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
  
});