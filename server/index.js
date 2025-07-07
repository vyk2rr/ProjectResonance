import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useMatches, useActionData, useLoaderData, useParams, useRouteError, Meta, Links, ScrollRestoration, Scripts, Outlet, isRouteErrorResponse } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { createElement, forwardRef, useRef, useState, useEffect, useImperativeHandle } from "react";
import * as Tone from "tone";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function withComponentProps(Component) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      matches: useMatches()
    };
    return createElement(Component, props);
  };
}
function withErrorBoundaryProps(ErrorBoundary3) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      error: useRouteError()
    };
    return createElement(ErrorBoundary3, props);
  };
}
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
const SHARP_TO_FLAT_MAP = {
  "C#": "Db",
  "D#": "Eb",
  "F#": "Gb",
  "G#": "Ab",
  "A#": "Bb"
};
function generateNotes(octaves = 3, startOctave = 4) {
  const white = [];
  const black = [];
  for (let i = 0; i < octaves; i++) {
    const currentOctave = startOctave + i;
    white.push(...["C", "D", "E", "F", "G", "A", "B"].map((n) => `${n}${currentOctave}`));
    black.push(...["C#", "D#", "F#", "G#", "A#"].map((n) => `${n}${currentOctave}`));
  }
  white.push(`C${startOctave + octaves}`);
  return { white, black };
}
function getAlternativeNotation(note) {
  const match = note.match(/^([A-G]#)(\d)$/);
  if (match) {
    const [, noteName, octave] = match;
    const flat = SHARP_TO_FLAT_MAP[noteName];
    if (flat) {
      return `${flat}${octave}`;
    }
  }
  return "";
}
function getBlackKeyLeft(note, whiteNotes) {
  const blackToWhiteBefore = {
    "C#": "C",
    "D#": "D",
    "F#": "F",
    "G#": "G",
    "A#": "A"
  };
  const match = note.match(/^([A-G]#)(\d)$/);
  if (!match) return "0%";
  const [_, pitchClass, octave] = match;
  const whiteBefore = `${blackToWhiteBefore[pitchClass]}${octave}`;
  const whiteIndex = whiteNotes.indexOf(whiteBefore);
  if (whiteIndex === -1) return "0%";
  const whiteKeyWidth = 100 / whiteNotes.length;
  const left = (whiteIndex + 1) * whiteKeyWidth;
  return `${left}%`;
}
function getBlackKeyWidth(octaves) {
  if (octaves <= 1) return "7%";
  if (octaves === 2) return "4%";
  if (octaves === 3) return "3%";
  if (octaves === 4) return "2%";
  return "1.4%";
}
function createDefaultSynth() {
  const synth = new Tone.PolySynth(Tone.Synth, {
    volume: -8,
    envelope: {
      attack: 2e-3,
      // Ataque muy rápido para el golpe de martillo
      decay: 0.5,
      // Decay moderado
      sustain: 0.15,
      // Sustain bajo para simular las cuerdas del piano
      release: 1.5
      // Release largo para la resonancia natural
    },
    oscillator: {
      type: "sine"
      // Onda sinusoidal para un tono más puro
    }
  });
  const filter = new Tone.Filter({
    type: "lowpass",
    frequency: 5e3,
    // Frecuencia de corte alta para mantener brillo
    Q: 1
    // Resonancia suave
  });
  const compressor = new Tone.Compressor({
    threshold: -20,
    ratio: 3,
    attack: 3e-3,
    release: 0.25
  });
  const reverb = new Tone.Reverb({
    decay: 1.5,
    // Decay moderado
    wet: 0.2
    // Mezcla sutil
  }).toDestination();
  synth.chain(filter, compressor, reverb);
  return {
    triggerAttackRelease(note, duration) {
      synth.triggerAttackRelease(note, duration);
    },
    dispose() {
      synth.dispose();
      filter == null ? void 0 : filter.dispose();
      compressor == null ? void 0 : compressor.dispose();
      reverb == null ? void 0 : reverb.dispose();
    }
  };
}
const PianoBase = forwardRef(({
  createSynth,
  octave = 4,
  octaves = 3,
  highlightOnThePiano,
  sequenceToPlay,
  pianoObservable
}, ref) => {
  const synthRef = useRef(null);
  const [clickedNotes, setClickedNotes] = useState([]);
  const [highlightedKeysGroup1, setHighlightedKeysGroup1] = useState([]);
  const [highlightedKeysGroup2, setHighlightedKeysGroup2] = useState([]);
  const [highlightedKeysLegacy, setHighlightedKeysLegacy] = useState([]);
  const { white, black } = generateNotes(octaves, octave);
  const visualHighlightBufferMs = 50;
  useEffect(() => {
    const synth = createSynth ? createSynth() : createDefaultSynth();
    synthRef.current = synth;
    return () => {
      var _a;
      (_a = synthRef.current) == null ? void 0 : _a.dispose();
      synthRef.current = null;
    };
  }, [createSynth]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = performance.now();
      setClickedNotes((prev) => prev.filter((n) => n.releaseTime > now));
      setHighlightedKeysGroup1((prev) => prev.filter((k) => k.releaseTime > now));
      setHighlightedKeysGroup2((prev) => prev.filter((k) => k.releaseTime > now));
    }, 30);
    return () => clearInterval(intervalId);
  }, []);
  const playNote = function(note, synth, duration = "4n") {
    if (!synth) return Promise.resolve();
    synth.triggerAttackRelease(note, duration);
    const ms = Tone.Time(duration).toMilliseconds();
    return new Promise((res) => setTimeout(res, ms));
  };
  const playChordSimultaneous = async function(notes, synth, duration = "2n") {
    await Promise.all(notes.map((note) => playNote(note, synth, duration)));
  };
  useEffect(() => {
    if (highlightOnThePiano && highlightOnThePiano.length > 0 && synthRef.current) {
      playChordSimultaneous(highlightOnThePiano, synthRef.current);
      setHighlightedKeysLegacy(highlightOnThePiano);
    } else {
      setHighlightedKeysLegacy([]);
    }
  }, [highlightOnThePiano]);
  useEffect(() => {
    if (!(sequenceToPlay == null ? void 0 : sequenceToPlay.sequenceToPlay) || sequenceToPlay.sequenceToPlay.length === 0) return;
    let cancelled = false;
    const runSequence = async () => {
      await handlePlaySequenceWithHighlight(
        sequenceToPlay.sequenceToPlay,
        sequenceToPlay.highlightedKeys,
        () => cancelled
      );
    };
    runSequence();
    return () => {
      cancelled = true;
    };
  }, [sequenceToPlay]);
  async function playNoteWithHighlight(note, highlight = true, isCancelled, duration) {
    if (isCancelled == null ? void 0 : isCancelled()) return;
    if (highlight) setClickedNotes([{ note, releaseTime: performance.now() + 180 }]);
    await playNote(note, synthRef.current, duration);
    setClickedNotes([]);
  }
  const handlePlaySequenceWithHighlight = async (sequence, highlight, isCancelled) => {
    if (!sequence || sequence.length === 0) return;
    for (const chord of sequence) {
      for (const note of chord) {
        await playNoteWithHighlight(note, highlight, isCancelled);
      }
    }
    sequenceToPlay == null ? void 0 : sequenceToPlay.onSequenceEnd();
  };
  const triggerChordEvent = (event) => {
    if (!synthRef.current) return;
    const { pitches, duration, velocity, highlightGroup, scheduledPlayTime } = event;
    const noteToPlay = pitches[0];
    if (!noteToPlay) return;
    synthRef.current.triggerAttackRelease(noteToPlay, duration, scheduledPlayTime, velocity);
    pianoObservable == null ? void 0 : pianoObservable.notify({ type: "chordPlayed", chord: [noteToPlay] });
    const visualDurationMs = Tone.Time(duration).toMilliseconds() + visualHighlightBufferMs;
    const newHighlightEntry = {
      note: noteToPlay,
      releaseTime: performance.now() + visualDurationMs,
      highlightGroup
    };
    if (highlightGroup === 1) {
      setHighlightedKeysGroup1((prev) => [...prev, newHighlightEntry]);
    } else if (highlightGroup === 2) {
      setHighlightedKeysGroup2((prev) => [...prev, newHighlightEntry]);
    }
  };
  useImperativeHandle(ref, () => ({
    triggerChordEvent
  }));
  const isNoteClicked = (note) => clickedNotes.some((cn) => cn.note === note);
  const isNoteInGroup1 = (note) => highlightedKeysGroup1.some((hk) => hk.note === note);
  const isNoteInGroup2 = (note) => highlightedKeysGroup2.some((hk) => hk.note === note);
  const isNoteLegacy = (note) => highlightedKeysLegacy.includes(note);
  const handlePianoKeyClick = (note) => {
    setClickedNotes([{ note, releaseTime: performance.now() + 180 }]);
    playNote(note, synthRef.current);
    pianoObservable == null ? void 0 : pianoObservable.notify({ type: "notePlayed", note });
    setTimeout(() => setClickedNotes([]), 180);
  };
  return /* @__PURE__ */ jsx("div", { className: "piano-base", children: /* @__PURE__ */ jsxs("div", { className: "piano", children: [
    /* @__PURE__ */ jsx("div", { className: "white-keys", children: white.map((note) => {
      const clicked = isNoteClicked(note);
      const group1 = isNoteInGroup1(note);
      const group2 = isNoteInGroup2(note);
      const legacy = isNoteLegacy(note);
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: `
                  white-key
                  ${clicked || group1 || group2 || legacy ? "active-key" : ""}
                  ${group1 ? "highlight-group-1" : ""}
                  ${group2 ? "highlight-group-2" : ""}
                  ${legacy ? "highlight-legacy" : ""}
                `,
          "data-note": note,
          onClick: () => handlePianoKeyClick(note),
          children: (group1 || group2 || legacy || note.startsWith("C")) && /* @__PURE__ */ jsx("span", { className: "note-name", children: note })
        },
        note
      );
    }) }),
    /* @__PURE__ */ jsx("div", { className: "black-keys", children: black.map((noteString) => {
      const clicked = isNoteClicked(noteString);
      const group1 = isNoteInGroup1(noteString);
      const group2 = isNoteInGroup2(noteString);
      const legacy = isNoteLegacy(noteString);
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: `
                  black-key
                  ${clicked || group1 || group2 || legacy ? "active-key" : ""}
                  ${group1 ? "highlight-group-1" : ""}
                  ${group2 ? "highlight-group-2" : ""}
                  ${legacy ? "highlight-legacy" : ""}
                `,
          style: {
            pointerEvents: "all",
            left: getBlackKeyLeft(noteString, white),
            width: getBlackKeyWidth(octaves)
          },
          "data-note": noteString,
          onClick: () => handlePianoKeyClick(noteString),
          children: (group1 || group2 || legacy) && /* @__PURE__ */ jsx("span", { className: "note-name", children: /* @__PURE__ */ jsx("span", { className: "flat-notation", children: getAlternativeNotation(noteString) }) })
        },
        noteString
      );
    }) })
  ] }) });
});
function PianoEtherealStrings({ showDescription = false, ...props }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    showDescription ? /* @__PURE__ */ jsx("span", { children: "Piano etéreo con timbre de cuerdas suaves y ambiente envolvente" }) : null,
    /* @__PURE__ */ jsx(
      PianoBase,
      {
        ...props,
        createSynth: () => {
          const synth = new Tone.DuoSynth({
            vibratoAmount: 0.1,
            vibratoRate: 5,
            harmonicity: 1.2,
            voice0: {
              oscillator: { type: "triangle" },
              envelope: { attack: 5e-3, decay: 0.08, sustain: 0.15, release: 0.25 }
            },
            voice1: {
              oscillator: { type: "sine" },
              envelope: { attack: 5e-3, decay: 0.09, sustain: 0.1, release: 0.22 }
            }
          });
          const chorus = new Tone.Chorus(4, 2.5, 0.5).start();
          const reverb = new Tone.Reverb({ decay: 3, wet: 0.4 }).toDestination();
          synth.connect(chorus);
          chorus.connect(reverb);
          return synth;
        }
      }
    )
  ] });
}
function PianoQuartzEcho({ showDescription = false, ...props }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    showDescription ? /* @__PURE__ */ jsx("span", { children: "Piano tipo cuenco de cristal: etéreo y resonante" }) : null,
    /* @__PURE__ */ jsx(
      PianoBase,
      {
        ...props,
        createSynth: () => {
          const synth = new Tone.FMSynth({
            harmonicity: 8,
            modulationIndex: 2.5,
            oscillator: { type: "sine" },
            envelope: { attack: 1.2, decay: 0.2, sustain: 0.8, release: 4 },
            modulation: { type: "triangle" },
            modulationEnvelope: { attack: 0.5, decay: 0.1, sustain: 1, release: 2 }
          });
          const reverb = new Tone.Reverb({ decay: 8, wet: 0.8 }).toDestination();
          const chorus = new Tone.Chorus(0.8, 2.5, 0.2).start();
          synth.connect(chorus);
          chorus.connect(reverb);
          return synth;
        }
      }
    )
  ] });
}
function PianoDryLeaf({ showDescription = false, ...props }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    showDescription ? /* @__PURE__ */ jsx("span", { children: "Piano crujiente como pisando hojas secas en otoño" }) : null,
    /* @__PURE__ */ jsx(
      PianoBase,
      {
        ...props,
        createSynth: () => {
          const synth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "triangle" },
            envelope: { attack: 5e-3, decay: 0.18, sustain: 0.05, release: 0.5 }
          });
          const noise = new Tone.NoiseSynth({
            noise: { type: "white" },
            envelope: { attack: 1e-3, decay: 0.08, sustain: 0, release: 0.05 }
          });
          const gain = new Tone.Gain(0.25);
          synth.connect(gain);
          noise.connect(gain);
          const reverbInstance = new Tone.Reverb({ decay: 3.5, wet: 0.35 });
          gain.connect(reverbInstance);
          reverbInstance.toDestination();
          return {
            triggerAttackRelease(note, duration) {
              synth.triggerAttackRelease(note, duration);
              noise.volume.value = -10 + Math.random() * 6;
              noise.triggerAttackRelease(duration);
            },
            dispose() {
              synth.dispose();
              noise.dispose();
              gain.dispose();
              reverbInstance.dispose();
            }
          };
        }
      }
    )
  ] });
}
function PianoHu({ showDescription = false, ...props }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    showDescription ? /* @__PURE__ */ jsx("span", { children: 'Piano tipo "hu"' }) : null,
    /* @__PURE__ */ jsx(
      PianoBase,
      {
        ...props,
        createSynth: () => {
          const synth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "triangle" },
            envelope: { attack: 0.12, decay: 0.2, sustain: 0.5, release: 0.7 }
          });
          const filter = new Tone.Filter({
            type: "lowpass",
            frequency: 900,
            Q: 1.2
          });
          const chorus = new Tone.Chorus(2.5, 1.8, 0.5).start();
          const reverb = new Tone.Reverb({ decay: 2.5, wet: 0.4 }).toDestination();
          synth.chain(filter, chorus, reverb);
          return synth;
        }
      }
    )
  ] });
}
function PianoMetalicoLaser({ showDescription = false, ...props }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    showDescription ? /* @__PURE__ */ jsx("span", { children: "Piano metálico tipo laser" }) : null,
    /* @__PURE__ */ jsx(
      PianoBase,
      {
        ...props,
        createSynth: () => {
          const synth = new Tone.PolySynth(Tone.MonoSynth, {
            oscillator: {
              type: "square"
            },
            envelope: {
              attack: 0.01,
              decay: 0.2,
              sustain: 0,
              release: 0.3
            },
            filter: {
              Q: 6,
              type: "bandpass",
              frequency: 800
            },
            filterEnvelope: {
              attack: 0.01,
              decay: 0.1,
              sustain: 0.1,
              release: 0.2,
              baseFrequency: 500,
              octaves: 2.5
            }
          });
          const tremolo = new Tone.Tremolo({
            frequency: 2,
            depth: 0.75,
            spread: 180
          }).start();
          const compressor = new Tone.Compressor(-20, 3);
          const reverb = new Tone.Reverb({ decay: 1.2, wet: 0.3 }).toDestination();
          synth.chain(tremolo, compressor, reverb);
          return synth;
        }
      }
    )
  ] });
}
function PianoUkulele({ ...props }) {
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
    PianoBase,
    {
      ...props,
      createSynth: () => {
        return new Tone.PluckSynth({
          attackNoise: 1.2,
          // más percusivo
          dampening: 4e3,
          // más brillante
          resonance: 0.98
          // más sustain
        }).toDestination();
      }
    }
  ) });
}
function Welcome() {
  return /* @__PURE__ */ jsxs("main", { children: [
    /* @__PURE__ */ jsx("span", { children: "Piano base" }),
    /* @__PURE__ */ jsx(PianoBase, {}),
    /* @__PURE__ */ jsx("span", { children: "Piano ukulele" }),
    /* @__PURE__ */ jsx(PianoUkulele, {}),
    /* @__PURE__ */ jsx(PianoEtherealStrings, { showDescription: true }),
    /* @__PURE__ */ jsx(PianoQuartzEcho, { octaves: 5, showDescription: true }),
    /* @__PURE__ */ jsx(PianoDryLeaf, { showDescription: true }),
    /* @__PURE__ */ jsx(PianoHu, { showDescription: true }),
    /* @__PURE__ */ jsx(PianoMetalicoLaser, { showDescription: true })
  ] });
}
function meta$2({}) {
  return [{
    title: "New React Router App"
  }, {
    name: "description",
    content: "Welcome to React Router!"
  }];
}
const Home = withComponentProps(function Home2() {
  return /* @__PURE__ */ jsx(Welcome, {});
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Home,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
const fretboardNotes = {
  4: ["G4", "G#4", "A4", "A#4", "B4"],
  3: ["C4", "C#4", "D4", "D#4", "E4"],
  2: ["E4", "F4", "F#4", "G4", "G#4"],
  1: ["A4", "A#4", "B4", "C5", "C#5"]
};
function UkuleleFretboard({ markers = [], active = false }) {
  const fretCount = 5;
  const stringCount = 4;
  const marks = markers.map((note, i) => {
    var _a;
    const string = 4 - i;
    const fret = (_a = fretboardNotes[string]) == null ? void 0 : _a.indexOf(note);
    if (fret > 0) {
      return [string, fret];
    }
    return null;
  }).filter((mark) => mark !== null);
  return /* @__PURE__ */ jsxs("div", { className: "ukulele", children: [
    /* @__PURE__ */ jsx("div", { className: "fret-labels", children: Array.from({ length: fretCount }, (_, i) => /* @__PURE__ */ jsx("div", { className: "fret-label", children: i + 1 }, i)) }),
    /* @__PURE__ */ jsxs("div", { className: "strings", children: [
      Array.from({ length: stringCount }, (_, i) => /* @__PURE__ */ jsx("div", { className: `string string-${stringCount - i}` }, i)),
      Array.from({ length: fretCount }, (_, i) => /* @__PURE__ */ jsx(
        "div",
        {
          className: "fret-line",
          style: { top: `${i * (100 / fretCount)}%` }
        },
        i
      )),
      (marks ?? []).map(([humanString, fret], i) => {
        const string = 5 - humanString;
        return /* @__PURE__ */ jsx(
          "div",
          {
            className: `marker ${active ? "marker-active" : ""}`,
            style: {
              left: `${20 * string}%`,
              top: `${(fret - 0.5) * (100 / fretCount)}%`
            }
          },
          i
        );
      })
    ] })
  ] });
}
function Ukulele() {
  const synthRef = useRef(null);
  const [strumDelay, setStrumDelay] = useState(0.12);
  useEffect(() => {
    synthRef.current = new Tone.PluckSynth({
      attackNoise: 1.2,
      // más percusivo
      dampening: 4e3,
      // más brillante
      resonance: 0.98
      // más sustain
    }).toDestination();
    return () => {
      var _a;
      (_a = synthRef.current) == null ? void 0 : _a.dispose();
    };
  }, []);
  const pluckG = () => {
    var _a;
    if (!synthRef.current) return;
    (_a = synthRef.current) == null ? void 0 : _a.triggerAttack("G4");
  };
  const strumTheUkulele = () => {
    if (!synthRef.current) return;
    synthRef.current.triggerAttack("G4", "+0");
    synthRef.current.triggerAttack("C4", `+${strumDelay * 1}`);
    synthRef.current.triggerAttack("E4", `+${strumDelay * 2}`);
    synthRef.current.triggerAttack("A4", `+${strumDelay * 3}`);
  };
  const Cmaj = () => {
    if (!synthRef.current) return;
    synthRef.current.triggerAttack("G4", "+0");
    synthRef.current.triggerAttack("C4", `+${strumDelay * 1}`);
    synthRef.current.triggerAttack("E4", `+${strumDelay * 2}`);
    synthRef.current.triggerAttack("C5", `+${strumDelay * 3}`);
  };
  const Dmin = () => {
    if (!synthRef.current) return;
    synthRef.current.triggerAttack("A4", "+0");
    synthRef.current.triggerAttack("D4", `+${strumDelay * 1}`);
    synthRef.current.triggerAttack("F4", `+${strumDelay * 2}`);
    synthRef.current.triggerAttack("A4", `+${strumDelay * 3}`);
  };
  const Emin = () => {
    if (!synthRef.current) return;
    synthRef.current.triggerAttack("G4", "+0");
    synthRef.current.triggerAttack("E4", `+${strumDelay * 1}`);
    synthRef.current.triggerAttack("G4", `+${strumDelay * 2}`);
    synthRef.current.triggerAttack("B4", `+${strumDelay * 3}`);
  };
  const Fmaj = () => {
    if (!synthRef.current) return;
    synthRef.current.triggerAttack("G4", "+0");
    synthRef.current.triggerAttack("C4", `+${strumDelay * 1}`);
    synthRef.current.triggerAttack("F4", `+${strumDelay * 2}`);
    synthRef.current.triggerAttack("A4", `+${strumDelay * 3}`);
  };
  const Gmaj = () => {
    if (!synthRef.current) return;
    synthRef.current.triggerAttack("G4", "+0");
    synthRef.current.triggerAttack("D4", `+${strumDelay * 1}`);
    synthRef.current.triggerAttack("G4", `+${strumDelay * 2}`);
    synthRef.current.triggerAttack("B4", `+${strumDelay * 3}`);
  };
  const Amin = () => {
    if (!synthRef.current) return;
    synthRef.current.triggerAttack("A4", "+0");
    synthRef.current.triggerAttack("C4", `+${strumDelay * 1}`);
    synthRef.current.triggerAttack("E4", `+${strumDelay * 2}`);
    synthRef.current.triggerAttack("A4", `+${strumDelay * 3}`);
  };
  const Bdim = () => {
    if (!synthRef.current) return;
    synthRef.current.triggerAttack("B4", "+0");
    synthRef.current.triggerAttack("D4", `+${strumDelay * 1}`);
    synthRef.current.triggerAttack("F#4", `+${strumDelay * 2}`);
    synthRef.current.triggerAttack("B4", `+${strumDelay * 3}`);
  };
  const renderStrumSpeedSlider = () => /* @__PURE__ */ jsx("div", { style: { width: "200px" } });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("h1", { children: "Ukulele" }),
    /* @__PURE__ */ jsxs("div", { style: { width: "500px" }, children: [
      /* @__PURE__ */ jsxs("ul", { children: [
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", { onClick: pluckG, children: "Pluck G (G4)" }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", { onClick: strumTheUkulele, children: "Strum The Ukulele C6 (G4 → C4 → E4 → A4)" }) })
      ] }),
      renderStrumSpeedSlider()
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { width: "500px" }, children: [
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", { onClick: Cmaj, children: "play Cmaj (G4 → C4 → E4 → C)" }) }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", { onClick: Dmin, children: "play Dmin" }) }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", { onClick: Emin, children: "play Emin" }) }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", { onClick: Fmaj, children: "play Fmaj" }) }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", { onClick: Gmaj, children: "play Gmaj" }) }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", { onClick: Amin, children: "play Amin" }) }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", { onClick: Bdim, children: "play Bdim" }) })
    ] }),
    /* @__PURE__ */ jsx("div", { style: { width: "200px" }, children: /* @__PURE__ */ jsx(UkuleleFretboard, {}) }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(PianoUkulele, {}) })
  ] });
}
function meta$1({}) {
  return [{
    title: "Ukulele Synth Sound"
  }, {
    name: "description",
    content: "A button that plays a synthesized ukulele G4 string sound using Tone.js"
  }];
}
const UkulelePage = withComponentProps(function UkulelePage2() {
  return /* @__PURE__ */ jsx(Ukulele, {});
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: UkulelePage,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const chords = [
  { name: "C", markers: ["G4", "C4", "E4", "C5"] },
  { name: "Dm", markers: ["A4", "D4", "F4", "A4"] },
  { name: "Em", markers: ["G4", "E4", "G4", "B4"] },
  { name: "F", markers: ["A4", "C4", "F4", "A4"] },
  { name: "G", markers: ["G4", "D4", "G4", "B4"] },
  { name: "Am", markers: ["A4", "C4", "E4", "A4"] },
  { name: "Bdim", markers: ["B4", "D4", "F#4", "B4"] }
];
function UkuleleChordsList() {
  return /* @__PURE__ */ jsx("div", { className: "ukulele-chords-list", children: chords.map(({ name, markers }) => /* @__PURE__ */ jsxs("div", { className: "ukulele-chord", children: [
    /* @__PURE__ */ jsx("span", { className: "ukulele-fret-number", children: name }),
    /* @__PURE__ */ jsx(UkuleleFretboard, { markers })
  ] }, name)) });
}
function meta({}) {
  return [{
    title: "Ukulele Fretboard"
  }, {
    name: "description",
    content: "Chord diagrams for ukulele"
  }];
}
const UkuleleChordsHomePage = withComponentProps(function UkuleleChordsHomePage2() {
  return /* @__PURE__ */ jsx(UkuleleChordsList, {});
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: UkuleleChordsHomePage,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DH0aU_hX.js", "imports": ["/assets/chunk-DQRVZFIR-DT2EblYt.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-BwxIC_ss.js", "imports": ["/assets/chunk-DQRVZFIR-DT2EblYt.js", "/assets/with-props-BCSotfiv.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/Home": { "id": "routes/Home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/Home-DlS2fYf1.js", "imports": ["/assets/with-props-BCSotfiv.js", "/assets/chunk-DQRVZFIR-DT2EblYt.js", "/assets/PianoUkulele-C6WsTu_A.js"], "css": ["/assets/PianoUkulele-DqKcXmYE.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/UkulelePage": { "id": "routes/UkulelePage", "parentId": "root", "path": "ukulele", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/UkulelePage-CSaz7vLF.js", "imports": ["/assets/with-props-BCSotfiv.js", "/assets/chunk-DQRVZFIR-DT2EblYt.js", "/assets/PianoUkulele-C6WsTu_A.js", "/assets/UkuleleFretboard-BTi154HG.js"], "css": ["/assets/PianoUkulele-DqKcXmYE.css", "/assets/UkuleleFretboard-Y3ZlfvEh.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/UkuleleChordsHomePage": { "id": "routes/UkuleleChordsHomePage", "parentId": "root", "path": "ukulele-chords", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/UkuleleChordsHomePage-C5GZOxL5.js", "imports": ["/assets/with-props-BCSotfiv.js", "/assets/chunk-DQRVZFIR-DT2EblYt.js", "/assets/UkuleleFretboard-BTi154HG.js"], "css": ["/assets/UkuleleChordsHomePage-CUsTiq7X.css", "/assets/UkuleleFretboard-Y3ZlfvEh.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-16b301d9.js", "version": "16b301d9", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/Home": {
    id: "routes/Home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/UkulelePage": {
    id: "routes/UkulelePage",
    parentId: "root",
    path: "ukulele",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/UkuleleChordsHomePage": {
    id: "routes/UkuleleChordsHomePage",
    parentId: "root",
    path: "ukulele-chords",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
