import React from 'react';
import './ukulele.css';

export default function UkuleleDiagram({ markers = [] }) {
  return (
    <div class="ukulele">
      <div class="fret-labels">
        <div class="fret-label">1</div>
        <div class="fret-label">2</div>
        <div class="fret-label">3</div>
        <div class="fret-label">4</div>
        <div class="fret-label">5</div>
      </div>
      <div class="strings">
        <div class="string string-4"></div>
        <div class="string string-3"></div>
        <div class="string string-2"></div>
        <div class="string string-1"></div>
      </div>
    </div>
  );
}