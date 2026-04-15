# MoodFlow — Complete App Design Scripts
# Paste into: Plugins → Development → Open Console
# File: https://www.figma.com/design/KaCwQHTsXrLyYaryo34F81
# Run scripts in order. Each is self-contained.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCRIPT A — SHARED HELPERS (run this FIRST, then keep the tab open)
Defines all helper functions used by every screen script.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```js
// ── PASTE THIS FIRST — defines window.MF helpers ──────────────────────────
window.MF = {};

MF.rgb = (h) => {
  const n = parseInt(h.replace('#',''), 16);
  return { r:((n>>16)&255)/255, g:((n>>8)&255)/255, b:(n&255)/255 };
};

MF.C = {
  bg:       '#F9FAFB', white:    '#FFFFFF', brand:    '#0F766E',
  brandDk:  '#0A5255', brandLt:  '#CCECF0', brandXL:  '#F0FAFB',
  n100:     '#F3F4F6', n200:     '#E5E7EB', n300:     '#D1D5DB',
  n400:     '#9CA3AF', n500:     '#6B7280', n700:     '#374151',
  n800:     '#1F2937', n900:     '#111827',
  success:  '#059669', successLt:'#D1FAE5',
  warning:  '#D97706', warningLt:'#FEF3C7',
  danger:   '#DC2626', dangerLt: '#FEE2E2',
  info:     '#2563EB', infoLt:   '#DBEAFE',
  moodGreat:'#059669', moodGood: '#0F766E', moodOkay: '#D97706',
  moodLow:  '#DC2626', moodRough:'#7C3AED', moodRoughLt:'#EDE9FE',
};

// Load fonts once
MF.fonts = async () => {
  for (const style of ['Regular','Medium','Semi Bold','Bold']) {
    await figma.loadFontAsync({ family:'Inter', style });
  }
};

// Frame helper
MF.frame = (parent, name, x, y, w, h, fill, radius=0) => {
  const f = figma.createFrame();
  f.name = name; f.x = x; f.y = y; f.resize(w, h);
  f.cornerRadius = radius; f.clipsContent = true;
  f.fills = fill ? [{ type:'SOLID', color:MF.rgb(fill) }] : [];
  if (parent) parent.appendChild(f);
  return f;
};

// Rectangle helper
MF.rect = (parent, x, y, w, h, fill, radius=0, stroke=null, sw=1) => {
  const r = figma.createRectangle();
  r.x=x; r.y=y; r.resize(w,h); r.cornerRadius=radius;
  r.fills = fill ? [{ type:'SOLID', color:MF.rgb(fill) }] : [{type:'SOLID',color:{r:0,g:0,b:0},opacity:0}];
  if (stroke) { r.strokes=[{type:'SOLID',color:MF.rgb(stroke)}]; r.strokeWeight=sw; }
  if (parent) parent.appendChild(r);
  return r;
};

// Ellipse helper
MF.ellipse = (parent, x, y, w, h, fill, stroke=null, sw=1.5) => {
  const e = figma.createEllipse();
  e.x=x; e.y=y; e.resize(w,h);
  e.fills = fill ? [{ type:'SOLID', color:MF.rgb(fill) }] : [];
  if (stroke) { e.strokes=[{type:'SOLID',color:MF.rgb(stroke)}]; e.strokeWeight=sw; }
  if (parent) parent.appendChild(e);
  return e;
};

// Text helper
MF.text = (parent, str, x, y, size, style, color, align='LEFT') => {
  const t = figma.createText();
  t.x=x; t.y=y;
  t.fontName = { family:'Inter', style: style||'Regular' };
  t.fontSize = size||12;
  t.textAlignHorizontal = align;
  t.fills = [{ type:'SOLID', color: color ? MF.rgb(color) : MF.rgb(MF.C.n900) }];
  t.characters = str;
  if (parent) parent.appendChild(t);
  return t;
};

// Auto-layout frame (horizontal or vertical)
MF.auto = (parent, name, x, y, w, h, fill, dir='VERTICAL', gap=0, pad=0, radius=0, stroke=null, sw=1) => {
  const f = MF.frame(parent, name, x, y, w, h, fill, radius);
  f.layoutMode = dir; f.itemSpacing = gap;
  f.paddingTop=pad; f.paddingBottom=pad; f.paddingLeft=pad; f.paddingRight=pad;
  if (stroke) { f.strokes=[{type:'SOLID',color:MF.rgb(stroke)}]; f.strokeWeight=sw; }
  return f;
};

// Card shortcut
MF.card = (parent, name, x, y, w, h, fill=MF.C.white, radius=12) => {
  const f = MF.frame(parent, name, x, y, w, h, fill, radius);
  f.strokes = [{ type:'SOLID', color:MF.rgb(MF.C.n200) }]; f.strokeWeight=1;
  return f;
};

// Status bar (used on every screen)
MF.statusBar = (parent, y=44) => {
  MF.text(parent, '9:41', 20, y, 13, 'Semi Bold', MF.C.n900);
  MF.text(parent, '●●●', 310, y, 10, 'Medium', MF.C.n900);
};

// Divider line
MF.divider = (parent, x, y, w) => MF.rect(parent, x, y, w, 0.5, MF.C.n200);

// Pill / badge
MF.pill = (parent, name, x, y, w, h, bg, fg, label, fontSize=10) => {
  const f = MF.auto(parent, name, x, y, w, h, bg, 'HORIZONTAL', 0, 0, h/2);
  f.primaryAxisAlignItems='CENTER'; f.counterAxisAlignItems='CENTER';
  MF.text(f, label, 0, 0, fontSize, 'Medium', fg, 'CENTER');
  return f;
};

// Primary CTA button
MF.btnPrimary = (parent, label, x, y, w=343) => {
  const f = MF.auto(parent, `btn/${label}`, x, y, w, 52, MF.C.brand, 'HORIZONTAL', 0, 0, 14);
  f.primaryAxisAlignItems='CENTER'; f.counterAxisAlignItems='CENTER';
  MF.text(f, label, 0, 0, 16, 'Semi Bold', MF.C.white, 'CENTER');
  return f;
};

// Ghost/outline button
MF.btnGhost = (parent, label, x, y, w=343) => {
  const f = MF.auto(parent, `btn-ghost/${label}`, x, y, w, 48, MF.C.white, 'HORIZONTAL', 0, 0, 14);
  f.primaryAxisAlignItems='CENTER'; f.counterAxisAlignItems='CENTER';
  f.strokes=[{type:'SOLID',color:MF.rgb(MF.C.n300)}]; f.strokeWeight=1;
  MF.text(f, label, 0, 0, 15, 'Medium', MF.C.n700, 'CENTER');
  return f;
};

// iPhone 15 Pro frame wrapper (390×844)
MF.phone = (pageX, pageY, name) => {
  const outer = MF.frame(null, name, pageX, pageY, 390, 844, MF.C.bg, 44);
  figma.currentPage.appendChild(outer);
  return outer;
};

// Section label above a group of screens
MF.screenLabel = (str, x, y) => {
  MF.text(null, str, x, y, 11, 'Medium', MF.C.n500);
};

console.log('✅ MoodFlow helpers loaded — MF object ready');
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCRIPT B — SCREENS PAGE SETUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```js
(async () => {
  await MF.fonts();
  // Navigate to Screens page (index 2)
  const screensPage = figma.root.children.find(p => p.name.includes('Screens'))
                   || figma.root.children[2];
  await figma.setCurrentPageAsync(screensPage);
  // Clear old content
  screensPage.children.forEach(n => n.remove());
  console.log('✅ On Screens page, cleared. Ready to build.');
})();
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCRIPT 1 — SPLASH + WELCOME (S01, S02)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```js
(async () => {
  await MF.fonts();

  // ── S01 SPLASH ───────────────────────────────────────────────────────────
  MF.screenLabel('S01 · Splash', 60, 20);
  const splash = MF.phone(60, 40, 'S01/Splash');

  // Full brand centre
  MF.ellipse(splash, 171, 300, 48, 48, MF.C.brandLt, MF.C.brand, 1.5);
  MF.text(splash, 'M', 187, 314, 16, 'Bold', MF.C.brand, 'CENTER');
  MF.text(splash, 'MoodFlow', 128, 362, 24, 'Bold', MF.C.n900, 'CENTER');
  MF.text(splash, 'how are you, really?', 108, 394, 13, 'Regular', MF.C.n500, 'CENTER');

  // Progress bar
  MF.rect(splash, 135, 440, 120, 3, MF.C.n200, 2);
  MF.rect(splash, 135, 440, 54, 3, MF.C.brand, 2);
  MF.text(splash, 'setting up your space…', 118, 454, 11, 'Regular', MF.C.n400, 'CENTER');

  // ── S02 WELCOME ──────────────────────────────────────────────────────────
  MF.screenLabel('S02 · Welcome', 500, 20);
  const welcome = MF.phone(500, 40, 'S02/Welcome');

  // Logo top centre
  MF.ellipse(welcome, 171, 160, 48, 48, MF.C.brandLt, MF.C.brand, 1.5);
  MF.text(welcome, 'M', 187, 174, 16, 'Bold', MF.C.brand, 'CENTER');

  // Headline
  MF.text(welcome, 'understand how', 60, 232, 28, 'Bold', MF.C.n900);
  MF.text(welcome, 'you feel, hourly', 60, 266, 28, 'Bold', MF.C.n900);

  // Sub copy
  MF.text(welcome, '5-second check-ins. a playlist when', 40, 316, 14, 'Regular', MF.C.n500);
  MF.text(welcome, 'you dip. a weekly picture of your', 40, 336, 14, 'Regular', MF.C.n500);
  MF.text(welcome, 'emotional life.', 40, 356, 14, 'Regular', MF.C.n500);

  // CTAs
  MF.btnPrimary(welcome, 'get started', 24, 540);
  MF.btnGhost(welcome, 'sign in', 24, 600);

  // Privacy note
  MF.text(welcome, 'your data stays on your device first', 60, 664, 11, 'Regular', MF.C.n400, 'CENTER');

  figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
  console.log('✅ S01 Splash + S02 Welcome drawn');
})();
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCRIPT 2 — ONBOARDING SCHEDULE + ANCHOR MOODS (S03, S04)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```js
(async () => {
  await MF.fonts();

  // ── S03 SCHEDULE ─────────────────────────────────────────────────────────
  MF.screenLabel('S03 · Schedule Setup', 940, 20);
  const sched = MF.phone(940, 40, 'S03/Schedule');

  MF.statusBar(sched);

  // Step dots
  [0,1,2].forEach((i) => {
    MF.ellipse(sched, 24+i*16, 88, 8, 8, i===0 ? MF.C.n900 : MF.C.n300);
  });
  MF.text(sched, 'Step 1 of 3', 68, 86, 10, 'Regular', MF.C.n400);

  // Heading
  MF.text(sched, 'when do you wake up?', 24, 116, 22, 'Bold', MF.C.n900);
  MF.text(sched, "we'll only nudge you during your day", 24, 146, 13, 'Regular', MF.C.n500);

  // Time picker card
  const timeCard = MF.card(sched, 'TimeCard', 24, 178, 342, 96);
  MF.text(timeCard, 'wake time', 16, 16, 11, 'Regular', MF.C.n500);
  MF.text(timeCard, '7:00 AM', 240, 14, 17, 'Semi Bold', MF.C.n900);
  MF.divider(timeCard, 16, 47, 310);
  MF.text(timeCard, 'sleep time', 16, 58, 11, 'Regular', MF.C.n500);
  MF.text(timeCard, '11:00 PM', 234, 56, 17, 'Semi Bold', MF.C.n900);

  // Interval selector
  MF.text(sched, 'check-in every', 24, 294, 13, 'Semi Bold', MF.C.n800);
  const intervals = ['1h','2h','3h','custom'];
  intervals.forEach((lbl, i) => {
    const sel = i===1;
    const btn = MF.frame(sched, `interval/${lbl}`, 24+i*82, 316, 74, 40, sel ? MF.C.brandXL : MF.C.white, 10);
    btn.strokes=[{type:'SOLID',color:MF.rgb(sel ? MF.C.brand : MF.C.n200)}]; btn.strokeWeight= sel?1.5:1;
    MF.text(btn, lbl, sel?24:26, 12, 13, sel?'Semi Bold':'Regular', sel?MF.C.brand:MF.C.n700, 'CENTER');
  });

  MF.btnPrimary(sched, 'continue', 24, 768);

  // ── S04 ANCHOR MOODS ──────────────────────────────────────────────────────
  MF.screenLabel('S04 · Anchor Moods', 1380, 20);
  const anchors = MF.phone(1380, 40, 'S04/AnchorMoods');

  MF.statusBar(anchors);
  [0,1,2].forEach((i) => {
    MF.ellipse(anchors, 24+i*16, 88, 8, 8, i===1 ? MF.C.n900 : MF.C.n300);
  });
  MF.text(anchors, 'Step 2 of 3', 68, 86, 10, 'Regular', MF.C.n400);
  MF.text(anchors, 'which moods matter most?', 24, 116, 22, 'Bold', MF.C.n900);
  MF.text(anchors, 'pick exactly 3', 24, 148, 13, 'Regular', MF.C.n500);

  const moodOpts = [
    ['Happy',    true  ], ['Calm',      true  ],
    ['Energised',false ], ['Focused',   true  ],
    ['Resilient',false ], ['Rested',    false ],
    ['Content',  false ], ['Motivated', false ],
  ];

  moodOpts.forEach(([label, selected], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 24 + col * 175;
    const y = 182 + row * 84;
    const card = MF.card(anchors, `mood/${label}`, x, y, 159, 68, selected ? MF.C.brandXL : MF.C.white, 12);
    if (selected) { card.strokes=[{type:'SOLID',color:MF.rgb(MF.C.brand)}]; card.strokeWeight=1.5; }

    // Radio dot
    MF.ellipse(card, 12, 24, 14, 14, selected ? MF.C.brand : MF.C.white, selected ? MF.C.brand : MF.C.n300, selected?0:1.5);
    if (selected) MF.ellipse(card, 16, 28, 6, 6, MF.C.white);

    MF.text(card, label, 36, 22, 13, selected?'Semi Bold':'Regular', selected?MF.C.brand:MF.C.n800);
  });

  // Counter
  MF.text(anchors, '3 of 3 selected', 143, 538, 12, 'Medium', MF.C.brand, 'CENTER');
  MF.btnPrimary(anchors, 'continue', 24, 768);

  figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
  console.log('✅ S03 Schedule + S04 Anchor Moods drawn');
})();
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCRIPT 3 — PERMISSION + HOME (S05, S06)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```js
(async () => {
  await MF.fonts();

  // ── S05 NOTIFICATION PERMISSION ───────────────────────────────────────────
  MF.screenLabel('S05 · Permission', 1820, 20);
  const perm = MF.phone(1820, 40, 'S05/Permission');

  MF.statusBar(perm);
  [0,1,2].forEach((i) => {
    MF.ellipse(perm, 24+i*16, 88, 8, 8, i===2 ? MF.C.n900 : MF.C.n300);
  });
  MF.text(perm, 'Step 3 of 3', 68, 86, 10, 'Regular', MF.C.n400);

  // Bell icon circle
  MF.ellipse(perm, 155, 220, 80, 80, MF.C.brandXL, MF.C.brandLt, 1.5);
  // Bell shape (simplified as rect+arc suggestion)
  MF.rect(perm, 183, 245, 34, 26, MF.C.brand, 6);
  MF.rect(perm, 190, 271, 20, 6, MF.C.brand, 3);

  MF.text(perm, 'one last thing', 95, 326, 24, 'Bold', MF.C.n900, 'CENTER');
  MF.text(perm, 'MoodFlow sends quiet nudges during', 36, 366, 13, 'Regular', MF.C.n500, 'CENTER');
  MF.text(perm, 'your day. no spam — just check-ins', 36, 384, 13, 'Regular', MF.C.n500, 'CENTER');
  MF.text(perm, 'when you asked for them.', 104, 402, 13, 'Regular', MF.C.n500, 'CENTER');

  MF.btnPrimary(perm, 'allow notifications', 24, 540);
  MF.btnGhost(perm, 'not now', 24, 600);
  MF.text(perm, 'you can enable this later in settings', 60, 664, 11, 'Regular', MF.C.n400, 'CENTER');

  // ── S06 HOME ──────────────────────────────────────────────────────────────
  MF.screenLabel('S06 · Home', 2260, 20);
  const home = MF.phone(2260, 40, 'S06/Home');

  MF.statusBar(home);

  // Greeting row
  MF.text(home, 'good morning', 24, 80, 24, 'Bold', MF.C.n900);
  MF.text(home, 'Thursday, April 10', 24, 112, 13, 'Regular', MF.C.n500);

  // Avatar
  const av = MF.ellipse(home, 330, 76, 40, 40, MF.C.brandLt);
  MF.text(home, 'S', 345, 89, 14, 'Semi Bold', MF.C.brand, 'CENTER');

  // Sync ok badge
  MF.rect(home, 270, 116, 56, 18, MF.C.successLt, 9);
  MF.text(home, '● synced', 277, 120, 9, 'Medium', MF.C.success);

  // Intention card
  const ic = MF.card(home, 'IntentionCard', 24, 144, 342, 72, MF.C.white, 14);
  MF.text(ic, "today's intention", 16, 14, 10, 'Regular', MF.C.n500);
  MF.text(ic, 'feel focused', 16, 30, 17, 'Semi Bold', MF.C.n900);
  MF.ellipse(ic, 298, 22, 28, 28, MF.C.brandXL);
  MF.text(ic, '◎', 304, 26, 14, 'Regular', MF.C.brand);

  // Stats row
  const s1 = MF.card(home, 'Streak', 24, 232, 162, 76, MF.C.white, 12);
  MF.text(s1, 'streak', 14, 14, 10, 'Regular', MF.C.n500);
  MF.text(s1, '12 days', 14, 30, 20, 'Bold', MF.C.n900);
  MF.text(s1, 'personal best 18', 14, 56, 9, 'Regular', MF.C.n400);

  const s2 = MF.card(home, 'Today', 204, 232, 162, 76, MF.C.white, 12);
  MF.text(s2, 'today', 14, 14, 10, 'Regular', MF.C.n500);
  MF.text(s2, '3 checks', 14, 30, 20, 'Bold', MF.C.n900);
  MF.text(s2, 'goal: 5', 14, 56, 9, 'Regular', MF.C.n400);

  // Last check-in card
  const lc = MF.card(home, 'LastCheckin', 24, 324, 342, 100, MF.C.white, 14);
  MF.text(lc, 'last check-in', 16, 14, 10, 'Regular', MF.C.n500);
  MF.text(lc, '8:00 AM', 268, 14, 10, 'Regular', MF.C.n400);
  MF.text(lc, 'Good', 16, 34, 22, 'Bold', MF.C.n900);
  MF.rect(lc, 16, 62, 4, 22, MF.C.brand, 2);
  MF.pill(lc, 'tagWork', 28, 62, 44, 22, MF.C.successLt, MF.C.success, 'work');

  // Playlist suggestion card
  const ps = MF.card(home, 'PlaylistSuggestion', 24, 440, 342, 64, MF.C.brandXL, 12);
  ps.strokes=[{type:'SOLID',color:MF.rgb(MF.C.brandLt)}];
  MF.rect(ps, 16, 16, 32, 32, MF.C.brandLt, 6);
  MF.text(ps, '♪', 22, 17, 18, 'Regular', MF.C.brand);
  MF.text(ps, 'flow state', 60, 16, 12, 'Semi Bold', MF.C.brandDk);
  MF.text(ps, 'curated for focused intent', 60, 33, 10, 'Regular', MF.C.n500);
  MF.text(ps, 'open →', 284, 22, 11, 'Medium', MF.C.brand);

  // Check-in button (fixed bottom)
  MF.btnPrimary(home, 'check in now', 24, 768);

  figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
  console.log('✅ S05 Permission + S06 Home drawn');
})();
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCRIPT 4 — CHECK-IN MODAL + INTENTION MODAL (S07, S08)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```js
(async () => {
  await MF.fonts();

  // ── S07 CHECK-IN MODAL ────────────────────────────────────────────────────
  MF.screenLabel('S07 · Check-In Modal', 2700, 20);
  const ci = MF.phone(2700, 40, 'S07/CheckIn');

  // Dimmed background (home blurred behind)
  MF.rect(ci, 0, 0, 390, 844, MF.C.n900, 0).opacity = 0.45;

  // Bottom sheet
  const sheet = MF.frame(ci, 'BottomSheet', 0, 390, 390, 454, MF.C.white, 0);
  sheet.cornerRadius = 24; // top corners only hack: set all, then overdraw bottom
  sheet.topLeftRadius = 24; sheet.topRightRadius = 24;
  sheet.bottomLeftRadius = 0; sheet.bottomRightRadius = 0;

  // Drag handle
  MF.rect(sheet, 163, 12, 64, 4, MF.C.n300, 2);

  // Header
  MF.text(sheet, 'how are you feeling?', 80, 34, 17, 'Semi Bold', MF.C.n900, 'CENTER');
  MF.text(sheet, '9:00 AM · Thursday', 118, 58, 12, 'Regular', MF.C.n500, 'CENTER');

  // Mood grid (5 cells)
  const moodData = [
    ['rough', MF.C.moodRoughLt, MF.C.moodRough, false],
    ['low',   MF.C.dangerLt,   MF.C.danger,    false],
    ['okay',  MF.C.warningLt,  MF.C.warning,   false],
    ['good',  MF.C.successLt,  MF.C.success,   true ],
    ['great', MF.C.successLt,  MF.C.moodGreat, false],
  ];
  moodData.forEach(([label, bg, fg, sel], i) => {
    const cell = MF.frame(sheet, `mood/${label}`, 12+i*74, 84, 66, 72, sel?MF.C.brandXL:bg, 12);
    cell.strokes=[{type:'SOLID',color:MF.rgb(sel?MF.C.brand:bg)}]; cell.strokeWeight=sel?2:1;
    MF.ellipse(cell, 20, 10, 26, 26, sel?MF.C.brandLt:bg);
    MF.text(cell, '●', 27, 15, 12, 'Regular', sel?MF.C.brand:fg);
    MF.text(cell, label, 8, 50, 9, sel?'Semi Bold':'Regular', sel?MF.C.brand:MF.C.n600, 'CENTER');
  });

  // Tag pills
  MF.text(sheet, 'tag it', 16, 172, 11, 'Regular', MF.C.n500);
  MF.text(sheet, '(optional)', 55, 172, 11, 'Regular', MF.C.n400);
  const tags = [['work',true],['sleep',false],['food',false],['social',false],['exercise',false]];
  tags.forEach(([t, sel], i) => {
    const pill = MF.frame(sheet, `tag/${t}`, 16+i*68, 192, 60, 28, sel?MF.C.brandXL:MF.C.n100, 14);
    if (sel) { pill.strokes=[{type:'SOLID',color:MF.rgb(MF.C.brand)}]; pill.strokeWeight=1.5; }
    MF.text(pill, t, 8, 7, 10, sel?'Semi Bold':'Regular', sel?MF.C.brand:MF.C.n600, 'CENTER');
  });

  // Save button
  MF.btnPrimary(sheet, 'save', 16, 238);

  // Skip
  MF.text(sheet, 'skip', 172, 304, 13, 'Regular', MF.C.n400, 'CENTER');

  // ── S08 INTENTION MODAL ───────────────────────────────────────────────────
  MF.screenLabel('S08 · Intention Modal', 3140, 20);
  const im = MF.phone(3140, 40, 'S08/IntentionModal');

  MF.rect(im, 0, 0, 390, 844, MF.C.n900, 0).opacity = 0.45;

  const iSheet = MF.frame(im, 'BottomSheet', 0, 280, 390, 564, MF.C.white, 0);
  iSheet.topLeftRadius=24; iSheet.topRightRadius=24;

  MF.rect(iSheet, 163, 12, 64, 4, MF.C.n300, 2);
  MF.text(iSheet, 'set your tone for today', 66, 36, 17, 'Semi Bold', MF.C.n900, 'CENTER');
  MF.text(iSheet, 'Thursday, April 10', 122, 60, 12, 'Regular', MF.C.n500, 'CENTER');

  const intentions = [
    ['Energised','start with momentum', false],
    ['Calm',     'steady and present',  false],
    ['Focused',  'deep work, low noise',true ],
    ['Happy',    'light and open',      false],
    ['Resilient','whatever comes',      false],
  ];
  intentions.forEach(([label, desc, sel], i) => {
    const row = MF.card(iSheet, `intent/${label}`, 16, 90+i*76, 358, 64, sel?MF.C.brandXL:MF.C.white, 12);
    if (sel) { row.strokes=[{type:'SOLID',color:MF.rgb(MF.C.brand)}]; row.strokeWeight=1.5; }
    MF.ellipse(row, 12, 22, 18, 18, sel?MF.C.brand:MF.C.white, sel?MF.C.brand:MF.C.n300, sel?0:1.5);
    if (sel) MF.ellipse(row, 17, 27, 8, 8, MF.C.white);
    MF.text(row, label, 40, 12, 14, sel?'Semi Bold':'Medium', sel?MF.C.brand:MF.C.n900);
    MF.text(row, desc,  40, 32, 11, 'Regular', MF.C.n500);
  });

  MF.btnPrimary(iSheet, 'set intention', 16, 480);

  figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
  console.log('✅ S07 Check-In + S08 Intention drawn');
})();
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCRIPT 5 — MOOD SHIFT + BREATHING GUIDE (S09, S10)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```js
(async () => {
  await MF.fonts();

  // ── S09 MOOD SHIFT ────────────────────────────────────────────────────────
  MF.screenLabel('S09 · Mood Shift', 3580, 20);
  const ms = MF.phone(3580, 40, 'S09/MoodShift');

  MF.statusBar(ms);

  // Back nav
  MF.text(ms, '←  back', 24, 74, 13, 'Regular', MF.C.n500);

  // Mood echo
  MF.ellipse(ms, 155, 130, 80, 80, MF.C.dangerLt);
  MF.text(ms, '😔', 176, 152, 28, 'Regular', MF.C.danger, 'CENTER');

  MF.text(ms, 'want to shift this?', 80, 232, 22, 'Bold', MF.C.n900, 'CENTER');
  MF.text(ms, 'you logged  low  at 2:00 PM', 82, 262, 13, 'Regular', MF.C.n500, 'CENTER');
  // Highlight "low"
  MF.rect(ms, 152, 259, 26, 18, MF.C.dangerLt, 4);

  // Playlist card
  const pc = MF.card(ms, 'PlaylistOption', 24, 308, 342, 80, MF.C.white, 14);
  const pIcon = MF.frame(pc, 'musicIcon', 16, 16, 48, 48, MF.C.brandXL, 10);
  MF.text(pIcon, '♪', 14, 10, 22, 'Regular', MF.C.brand, 'CENTER');
  MF.text(pc, 'mood lift playlist', 80, 18, 14, 'Semi Bold', MF.C.n900);
  MF.text(pc, 'opens Spotify or YouTube Music', 80, 38, 11, 'Regular', MF.C.n500);
  MF.text(pc, '→', 310, 28, 16, 'Regular', MF.C.n400);

  // Breathing card
  const bc = MF.card(ms, 'BreathOption', 24, 404, 342, 80, MF.C.white, 14);
  const bIcon = MF.frame(bc, 'breathIcon', 16, 16, 48, 48, MF.C.infoLt, 10);
  MF.text(bIcon, '◯', 12, 8, 22, 'Regular', MF.C.info, 'CENTER');
  MF.text(bc, '2-min breathing', 80, 18, 14, 'Semi Bold', MF.C.n900);
  MF.text(bc, '4-7-8 guide, always offline', 80, 38, 11, 'Regular', MF.C.n500);
  MF.text(bc, '→', 310, 28, 16, 'Regular', MF.C.n400);

  MF.text(ms, 'maybe later', 155, 510, 13, 'Regular', MF.C.n400, 'CENTER');

  // ── S10 BREATHING GUIDE ───────────────────────────────────────────────────
  MF.screenLabel('S10 · Breathing Guide', 4020, 20);
  const br = MF.phone(4020, 40, 'S10/Breathe');

  MF.statusBar(br);
  MF.text(br, '← end early', 24, 74, 13, 'Regular', MF.C.n500);

  MF.text(br, 'BREATHE — 2 MIN', 120, 140, 11, 'Medium', MF.C.n400, 'CENTER');

  // Outer ring (large animated circle)
  MF.ellipse(br, 83, 180, 224, 224, MF.C.brandXL, MF.C.brandLt, 2);

  // Mid ring
  MF.ellipse(br, 115, 212, 160, 160, MF.C.white, MF.C.brand, 2);

  // Phase + number in centre
  MF.text(br, 'inhale', 154, 278, 17, 'Semi Bold', MF.C.n900, 'CENTER');
  MF.text(br, '4', 183, 300, 32, 'Bold', MF.C.brand, 'CENTER');

  // Guidance
  MF.text(br, 'breathe in slowly through your nose', 46, 432, 13, 'Regular', MF.C.n500, 'CENTER');

  // Phase dots row
  const phases = ['inhale','hold','exhale'];
  phases.forEach((p, i) => {
    MF.ellipse(br, 148+i*52, 470, 8, 8, i===0?MF.C.n900:MF.C.n300);
    MF.text(br, p, 134+i*52, 484, 9, 'Regular', MF.C.n400, 'CENTER');
  });

  // Progress bar
  MF.rect(br, 60, 516, 270, 3, MF.C.n200, 2);
  MF.rect(br, 60, 516, 54, 3, MF.C.brand, 2); // 20% fill

  // End early
  const endBtn = MF.frame(br, 'EndEarly', 120, 546, 150, 36, MF.C.white, 8);
  endBtn.strokes=[{type:'SOLID',color:MF.rgb(MF.C.n300)}]; endBtn.strokeWeight=1;
  MF.text(endBtn, 'end early', 30, 10, 12, 'Medium', MF.C.n600, 'CENTER');

  figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
  console.log('✅ S09 Mood Shift + S10 Breathing drawn');
})();
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCRIPT 6 — WEEKLY RECAP + SETTINGS (S11, S12)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```js
(async () => {
  await MF.fonts();

  // ── S11 WEEKLY RECAP ──────────────────────────────────────────────────────
  MF.screenLabel('S11 · Weekly Recap', 4460, 20);
  const rec = MF.phone(4460, 40, 'S11/Recap');

  MF.statusBar(rec);

  // Nav row
  MF.text(rec, 'week of Apr 7', 24, 76, 13, 'Regular', MF.C.n500);
  const shareBtn = MF.frame(rec, 'ShareBtn', 298, 68, 70, 32, MF.C.brandXL, 8);
  MF.text(shareBtn, 'share ↑', 10, 8, 11, 'Semi Bold', MF.C.brand);

  // Heading
  MF.text(rec, 'your week', 24, 118, 28, 'Bold', MF.C.n900);
  MF.text(rec, '7 check-ins  ·  5-day streak', 24, 152, 12, 'Regular', MF.C.n500);

  // Mood curve card
  const mc = MF.card(rec, 'MoodCurve', 24, 178, 342, 130, MF.C.white, 14);
  MF.text(mc, 'mood curve', 14, 12, 10, 'Regular', MF.C.n500);

  // Bar chart — 7 days
  const barData = [38, 28, 70, 52, 100, 35, 58];
  const days = ['M','T','W','T','F','S','S'];
  barData.forEach((h, i) => {
    const bH = Math.round(h * 0.65);
    MF.rect(mc, 18+i*46, 100-bH, 36, bH, i===4?MF.C.brand:MF.C.brandLt, 4);
    MF.text(mc, days[i], 28+i*46, 104, 9, 'Regular', MF.C.n400, 'CENTER');
  });

  // Stats row
  const st1 = MF.card(rec, 'PeakDay', 24, 324, 162, 72, MF.C.white, 12);
  MF.text(st1, 'peak day', 14, 12, 10, 'Regular', MF.C.n500);
  MF.text(st1, 'Friday', 14, 30, 17, 'Semi Bold', MF.C.n900);

  const st2 = MF.card(rec, 'TopTag', 204, 324, 162, 72, MF.C.white, 12);
  MF.text(st2, 'top tag', 14, 12, 10, 'Regular', MF.C.n500);
  MF.text(st2, 'Work', 14, 30, 17, 'Semi Bold', MF.C.n900);
  MF.pill(st2, 'tagPill', 14, 52, 40, 18, MF.C.successLt, MF.C.success, 'work', 9);

  // Average mood
  const avgCard = MF.card(rec, 'AvgMood', 24, 412, 342, 60, MF.C.white, 12);
  MF.text(avgCard, 'average mood', 14, 18, 12, 'Regular', MF.C.n500);
  MF.text(avgCard, 'Good', 262, 18, 14, 'Semi Bold', MF.C.n900);
  MF.rect(avgCard, 248, 16, 3, 20, MF.C.n200, 1);

  // Check-in count detail
  const ccCard = MF.card(rec, 'CheckinDetails', 24, 488, 342, 56, MF.C.n100, 12);
  ccCard.strokes=[]; // no border on n100 bg
  MF.text(ccCard, 'your best day was Friday with 3 check-ins', 14, 18, 11, 'Regular', MF.C.n600);

  // Share CTA (sticky bottom)
  MF.btnPrimary(rec, 'share this week', 24, 768);

  // ── S12 SETTINGS ──────────────────────────────────────────────────────────
  MF.screenLabel('S12 · Settings', 4900, 20);
  const set = MF.phone(4900, 40, 'S12/Settings');

  MF.statusBar(set);
  MF.text(set, '←', 24, 74, 17, 'Regular', MF.C.n700);
  MF.text(set, 'settings', 24, 100, 24, 'Bold', MF.C.n900);

  // Helper: setting section
  const settingSection = (label, rows, startY) => {
    MF.text(set, label, 24, startY, 10, 'Medium', MF.C.n500);
    const card = MF.card(set, `section/${label}`, 24, startY+18, 342, rows.length*52, MF.C.white, 14);
    rows.forEach(([key, value, danger], i) => {
      const textColor = danger ? MF.C.danger : MF.C.n900;
      const valColor  = danger ? MF.C.danger : MF.C.n500;
      MF.text(card, key, 16, 14+i*52, 13, 'Regular', textColor);
      if (value === 'TOGGLE') {
        // Toggle switch (on state)
        MF.rect(card, 294, 14+i*52, 34, 20, MF.C.brand, 10);
        MF.ellipse(card, 311, 17+i*52, 14, 14, MF.C.white);
      } else {
        MF.text(card, value, 310-value.length*5, 14+i*52, 12, 'Regular', valColor);
      }
      if (i < rows.length-1) MF.divider(card, 16, 52+i*52, 310);
    });
    return card;
  };

  settingSection('notifications', [
    ['wake time',  '7:00 AM', false],
    ['sleep time', '11:00 PM',false],
    ['interval',   'every 2h',false],
    ['notifications', 'TOGGLE', false],
  ], 142);

  settingSection('account', [
    ['export my data', '›',      false],
    ['dark mode',      'TOGGLE', false],
  ], 394);

  // Danger zone
  MF.text(set, 'danger zone', 24, 530, 10, 'Medium', MF.C.danger);
  const dz = MF.card(set, 'DangerZone', 24, 548, 342, 104, MF.C.white, 14);
  dz.strokes=[{type:'SOLID',color:MF.rgb(MF.C.dangerLt)}]; dz.strokeWeight=1.5;
  ['clear all data','delete account'].forEach((lbl, i) => {
    MF.text(dz, lbl, 16, 14+i*52, 13, 'Semi Bold', MF.C.danger);
    MF.text(dz, '›', 318, 14+i*52, 13, 'Regular', MF.C.danger);
    if (i===0) MF.divider(dz, 16, 52, 310);
  });

  MF.text(set, 'v1.0.0', 178, 786, 10, 'Regular', MF.C.n400, 'CENTER');

  figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
  console.log('✅ S11 Recap + S12 Settings drawn');
})();
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCRIPT 7 — EMPTY STATES ROW (all 12 screens, below main row)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```js
(async () => {
  await MF.fonts();
  // Y offset: main screens end ~884px. Empty states start at 960px.
  const ROW_Y = 960;

  MF.screenLabel('── Empty States ──', 60, ROW_Y - 20);

  // S06 Home — no check-ins yet
  const h = MF.phone(60, ROW_Y, 'S06/Home/Empty');
  MF.statusBar(h);
  MF.text(h, 'good morning', 24, 80, 24, 'Bold', MF.C.n900);
  MF.text(h, 'Thursday, April 10', 24, 112, 13, 'Regular', MF.C.n500);

  // Dashed intention card
  const diC = MF.frame(h, 'IntentionEmpty', 24, 144, 342, 72, MF.C.white, 14);
  diC.strokes=[{type:'SOLID',color:MF.rgb(MF.C.n200)}]; diC.strokeWeight=1;
  diC.dashPattern=[4,4];
  MF.text(diC, 'set your intention for today →', 62, 27, 12, 'Medium', MF.C.n500, 'CENTER');

  // Zero stat cards
  const es1 = MF.card(h, 'StreakEmpty', 24, 232, 162, 76, MF.C.white, 12);
  MF.text(es1,'streak',14,14,10,'Regular',MF.C.n500);
  MF.text(es1,'0',14,30,20,'Bold',MF.C.n400);

  const es2 = MF.card(h,'TodayEmpty',204,232,162,76,MF.C.white,12);
  MF.text(es2,'today',14,14,10,'Regular',MF.C.n500);
  MF.text(es2,'0',14,30,20,'Bold',MF.C.n400);

  // Empty last check-in
  const elc = MF.card(h,'LastEmpty',24,324,342,80,MF.C.n100,14);
  elc.strokes=[];
  MF.text(elc,'no check-ins yet today',82,30,13,'Regular',MF.C.n400,'CENTER');

  MF.btnPrimary(h,'check in now',24,768);

  // S07 Check-In — no mood selected
  const ci = MF.phone(500, ROW_Y, 'S07/CheckIn/Empty');
  MF.rect(ci,0,0,390,844,MF.C.n900,0).opacity=0.45;
  const esh = MF.frame(ci,'Sheet',0,390,390,454,MF.C.white,0);
  esh.topLeftRadius=24; esh.topRightRadius=24;
  MF.rect(esh,163,12,64,4,MF.C.n300,2);
  MF.text(esh,'how are you feeling?',80,34,17,'Semi Bold',MF.C.n900,'CENTER');
  ['rough','low','okay','good','great'].forEach((l,i) => {
    const c = MF.frame(esh,`m/${l}`,12+i*74,84,66,72,MF.C.n100,12);
    c.strokes=[{type:'SOLID',color:MF.rgb(MF.C.n200)}]; c.strokeWeight=1;
    MF.text(c,l,8,50,9,'Regular',MF.C.n400,'CENTER');
  });
  // Save button disabled
  const disBtn = MF.frame(esh,'SaveDisabled',16,238,358,52,MF.C.n200,14);
  MF.text(disBtn,'save',153,16,16,'Semi Bold',MF.C.n400,'CENTER');
  MF.text(esh,'select a mood to continue',80,306,11,'Regular',MF.C.n400,'CENTER');

  // S11 Recap — not yet generated
  const rp = MF.phone(940, ROW_Y, 'S11/Recap/Empty');
  MF.statusBar(rp);
  MF.text(rp,'your week',24,80,28,'Bold',MF.C.n900);
  MF.text(rp,'4 check-ins so far',24,114,13,'Regular',MF.C.n500);
  const epCard = MF.card(rp,'RecapPending',24,160,342,200,MF.C.n100,14);
  epCard.strokes=[];
  MF.ellipse(epCard,131,30,80,80,MF.C.n200);
  MF.text(epCard,'recap generates',68,126,13,'Regular',MF.C.n500,'CENTER');
  MF.text(epCard,'Sunday morning',76,146,13,'Regular',MF.C.n500,'CENTER');
  MF.text(epCard,'keep checking in',90,170,12,'Medium',MF.C.brand,'CENTER');

  figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
  console.log('✅ Empty states drawn');
})();
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCRIPT 8 — ERROR STATES ROW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```js
(async () => {
  await MF.fonts();
  const ROW_Y = 1880;

  MF.screenLabel('── Error States ──', 60, ROW_Y - 20);

  // S01 Splash — DB init failure
  const sp = MF.phone(60, ROW_Y, 'S01/Splash/Error');
  MF.ellipse(sp,155,200,80,80,MF.C.dangerLt);
  MF.text(sp,'!',188,222,28,'Bold',MF.C.danger,'CENTER');
  MF.text(sp,'something went wrong',70,310,17,'Semi Bold',MF.C.n900,'CENTER');
  MF.text(sp,"we couldn't load your local data.",44,340,13,'Regular',MF.C.n500,'CENTER');
  MF.text(sp,'this is rare.',140,358,13,'Regular',MF.C.n500,'CENTER');
  MF.btnPrimary(sp,'clear data and restart',24,680);
  MF.btnGhost(sp,'contact support',24,740);

  // S06 Home — sync error banner
  const home = MF.phone(500, ROW_Y, 'S06/Home/SyncError');
  MF.statusBar(home);
  MF.text(home,'good morning',24,80,24,'Bold',MF.C.n900);

  // Error banner
  const eb = MF.frame(home,'SyncBanner',24,112,342,44,MF.C.warningLt,10);
  eb.strokes=[{type:'SOLID',color:MF.rgb(MF.C.warning)}]; eb.strokeWeight=1;
  MF.rect(eb,16,14,4,16,MF.C.warning,2);
  MF.text(eb,'data saved locally — syncing when connected',28,14,10,'Medium',MF.C.warning);

  const ic2 = MF.card(home,'IntentionCard2',24,172,342,72,MF.C.white,14);
  MF.text(ic2,"today's intention",16,14,10,'Regular',MF.C.n500);
  MF.text(ic2,'feel focused',16,30,17,'Semi Bold',MF.C.n900);
  MF.btnPrimary(home,'check in now',24,768);

  // S07 Check-in — save failed (disk full)
  const ci = MF.phone(940, ROW_Y, 'S07/CheckIn/Error');
  MF.rect(ci,0,0,390,844,MF.C.n900,0).opacity=0.45;
  const esh = MF.frame(ci,'Sheet',0,390,390,454,MF.C.white,0);
  esh.topLeftRadius=24; esh.topRightRadius=24;
  MF.rect(esh,163,12,64,4,MF.C.n300,2);
  MF.text(esh,'how are you feeling?',80,34,17,'Semi Bold',MF.C.n900,'CENTER');

  // Error toast
  const toast = MF.frame(esh,'ErrorToast',16,80,358,44,MF.C.dangerLt,10);
  toast.strokes=[{type:'SOLID',color:MF.rgb(MF.C.danger)}]; toast.strokeWeight=1;
  MF.text(toast,"couldn't save — storage full",60,14,11,'Medium',MF.C.danger,'CENTER');

  // Mood grid still visible
  ['rough','low','okay','good','great'].forEach((l,i) => {
    const c = MF.frame(esh,`m/${l}`,12+i*74,140,66,72,MF.C.n100,12);
    c.strokes=[{type:'SOLID',color:MF.rgb(MF.C.n200)}]; c.strokeWeight=1;
    MF.text(c,l,8,50,9,'Regular',MF.C.n400,'CENTER');
  });

  MF.text(esh,'open settings to free up space',66,228,11,'Regular',MF.C.n400,'CENTER');

  // S12 Settings — export failed
  const set = MF.phone(1380, ROW_Y, 'S12/Settings/Error');
  MF.statusBar(set);
  MF.text(set,'settings',24,80,24,'Bold',MF.C.n900);

  const errBanner = MF.frame(set,'ExportError',24,130,342,52,MF.C.dangerLt,12);
  errBanner.strokes=[{type:'SOLID',color:MF.rgb(MF.C.danger)}]; errBanner.strokeWeight=1;
  MF.text(errBanner,'export failed — check your connection',14,10,11,'Medium',MF.C.danger);
  MF.text(errBanner,'and try again',14,26,11,'Regular',MF.C.danger);

  const retryBtn = MF.frame(set,'RetryBtn',24,198,342,44,MF.C.white,10);
  retryBtn.strokes=[{type:'SOLID',color:MF.rgb(MF.C.n300)}]; retryBtn.strokeWeight=1;
  MF.text(retryBtn,'retry export',121,13,13,'Medium',MF.C.n700,'CENTER');

  const dzErr = MF.card(set,'DeleteError',24,258,342,64,MF.C.white,12);
  MF.text(dzErr,"couldn't delete your account",14,12,12,'Regular',MF.C.danger);
  MF.text(dzErr,'email support@moodflow.app',14,30,11,'Regular',MF.C.n500);

  figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
  console.log('✅ Error states drawn');
})();
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCRIPT 9 — FLOW ANNOTATIONS (connectors between screens)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```js
(async () => {
  await MF.fonts();

  // Arrow + label between screens
  function flowArrow(x1, y, label) {
    // Arrow line
    const line = figma.createLine();
    line.x = x1; line.y = y;
    line.resize(46, 0);
    line.strokes = [{ type:'SOLID', color:MF.rgb('#0F766E') }];
    line.strokeWeight = 1.5;
    figma.currentPage.appendChild(line);

    // Arrow head
    const head = figma.createPolygon();
    head.x = x1+42; head.y = y-5;
    head.resize(10, 10);
    head.fills = [{ type:'SOLID', color:MF.rgb('#0F766E') }];
    head.rotation = -90;
    figma.currentPage.appendChild(head);

    // Label
    if (label) {
      const t = figma.createText();
      t.x = x1+2; t.y = y-16;
      t.fontName = { family:'Inter', style:'Regular' };
      t.fontSize = 9;
      t.fills = [{ type:'SOLID', color:MF.rgb('#6B7280') }];
      t.characters = label;
      figma.currentPage.appendChild(t);
    }
  }

  const midY = 40 + 422; // vertical centre of screens

  // Main flow arrows (between S01–S12 screens at 440px column spacing)
  const flows = [
    [450, midY,  'cold start'],
    [890, midY,  'get started'],
    [1330,midY,  'continue'],
    [1770,midY,  'continue'],
    [2210,midY,  'allow / skip'],
    [2650,midY,  'check in →'],
    [3090,midY,  'mood ≤2 →'],
    [3530,midY,  'breathe →'],
    // Recap is reached via notification, not linear
  ];

  flows.forEach(([x,y,lbl]) => flowArrow(x, y, lbl));

  // Recap & Settings branch labels
  MF.text(null,'Sunday notification →',4260,40+422,10,'Regular',MF.C.n400);
  MF.text(null,'avatar tap →',4700,40+422,10,'Regular',MF.C.n400);

  console.log('✅ Flow annotations drawn');
})();
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCRIPT 10 — FINAL: FIT ALL + TITLE FRAME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```js
(async () => {
  await MF.fonts();

  // Title banner above all screens
  MF.text(null, 'MoodFlow — Complete App Screens', 60, -60, 18, 'Semi Bold', MF.C.n900);
  MF.text(null, 'S01–S12  ·  12 screens  ·  default + empty + error states  ·  390×844 (iPhone 15 Pro)',
    60, -36, 11, 'Regular', MF.C.n500);

  // Row labels
  MF.text(null,'Default screens', 60, 8, 11, 'Bold', MF.C.n900);
  MF.text(null,'Empty states',    60, 928, 11, 'Bold', MF.C.n900);
  MF.text(null,'Error states',    60, 1848, 11, 'Bold', MF.C.n900);

  // Screen IDs below each phone
  const labels = [
    'S01 Splash','S02 Welcome','S03 Schedule','S04 Anchors',
    'S05 Permission','S06 Home','S07 Check-In','S08 Intention',
    'S09 Mood Shift','S10 Breathing','S11 Recap','S12 Settings',
  ];
  labels.forEach((lbl, i) => {
    MF.text(null, lbl, 60+i*440, 40+844+12, 10, 'Medium', MF.C.n500);
  });

  figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
  console.log('🎉 MoodFlow complete app design done!');
  console.log('   12 screens × 3 states = 36 frames on the Screens page.');
})();
```
