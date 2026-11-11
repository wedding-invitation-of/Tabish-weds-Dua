ROYAL ENGAGEMENT INVITATION — how to use
=========================================
Open index.html (double-click) — no install, no terminal.

EDIT EVERYTHING IN ONE PLACE: the CONFIG object at the top of script.js
  names, initials, date/time, venue, address, Google Maps link,
  WhatsApp number, families, story milestones, gallery photos.

PHOTOS
  Put images in assets/ and list them in CONFIG.gallery (src: 'assets/photo1.jpg').
  Portrait 3:4 JPGs around 900x1200 px work best (keep each under ~250 KB).
  Story photos: CONFIG.story[n].photo.   Couple portrait: CONFIG.couple.couplePhoto.

FONTS
  Pinyon Script, Cinzel and Cormorant Garamond load from Google Fonts (needs internet).
  For fully offline use, download them and add @font-face rules at the top of style.css.

TIPS
  index.html?open  skips the door screen while you are editing.
  Share the whole folder (zipped) or host it on any static host (Netlify, GitHub Pages)
  to send the link on WhatsApp.
