/**
 * Single source of truth for every piece of copy on the site.
 * Next year's host committee edits this file — not the components.
 *
 * Placeholder values are marked TODO. Swap them, don't restructure them.
 * Images use `placeholderImage(...)`; replace a call with a URL string to drop
 * in the real photo.
 */
import { placeholderImage } from '../lib/placeholder'

export const event = {
  name: 'Sikh Ivy League Conference',
  shortName: 'SILC',
  tagline: 'One weekend. Every East Coast sangat. One table.',
  hostLine: 'Hosted by the Ivy League Sikh Student Associations',
  year: 2027,
  season: 'Spring 2027',
  // TODO: confirm the exact weekend, then add the days back here.
  dates: 'April 2027',
  datePill: 'April 2027',
  arrivalNote: 'Friday arrival + evening program',
  venue: 'Venue TBA',
  city: 'New York City',
  // Short form for tight metadata lines, e.g. under the hero date.
  cityShort: 'NYC',
  // TODO: swap for the Luma / Google Form registration link.
  registerUrl: '#',
  instagramUrl: 'https://www.instagram.com/sikh.ilc/',
  email: 'SILC@unitedsikhmovement.org',
  // Where sponsors and donors give. Used by the partners section and the FAQ.
  sponsorUrl: 'https://dvn.org/projects/sikh-ivy-league-conference-silc',
}

/**
 * Sections that wait on content. Flip one to `true` once its data below is real
 * and it appears on the page, in the menu and in the footer — no other edit.
 */
export const visibility = {
  // TODO: turn on once the lineup in `speakers` is confirmed.
  speakers: false,
  // TODO: turn on once `partners.sponsors` holds confirmed sponsors.
  sponsors: false,
}

/**
 * Order of the page, and the menu overlay's link list. Each `id` must match a
 * section id on the page and a key in `frameLabels`. Hidden sections drop out.
 */
const allNavSections = [
  { id: 'hero', label: 'Top' },
  { id: 'agenda', label: 'The Weekend' },
  { id: 'speakers', label: 'Speakers' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'partners', label: 'Partners' },
  { id: 'register', label: 'Register' },
  { id: 'faq', label: 'FAQ' },
  { id: 'gallery', label: 'Archive' },
]

export const navSections = allNavSections.filter((section) => visibility[section.id] !== false)

/**
 * Labels for the bottom-right slot of the nav frame. The frame swaps these
 * as each section scrolls into view.
 */
export const frameLabels = {
  hero: 'Check-in 4PM Fri',
  agenda: 'The Weekend',
  speakers: 'Speakers',
  schedule: 'Two Days',
  partners: 'Partners',
  register: 'Registration',
  faq: 'Questions',
  gallery: 'Archive',
}

/**
 * The opening statement, written as a sequence of segments so a few phrases can
 * carry a media thumbnail that appears on hover.
 *
 * `{ text }`  — plain copy.
 * `{ keyword }` — emphasised phrase.
 * `{ keyword, media }` — emphasised phrase that shows `media` above it on hover.
 *
 * To edit the copy, edit the strings. Thumbnails are off until real photos
 * arrive; to turn one on, add a key to the keyword, e.g.
 *   media: { src: '/photos/mentors.jpg', alt: 'Students talking with a mentor' }
 */
export const agenda = {
  eyebrow: 'The weekend',
  segments: [
    { text: 'Bringing together Sikh students from across the East Coast to grow as professionals and as a sangat. Over one weekend in New York City, delegations from every SSA meet working ' },
    { keyword: 'mentors' },
    { text: ', sharpen their ' },
    { keyword: 'careers' },
    { text: ', share ' },
    { keyword: 'langar' },
    { text: ', and leave with a network that lasts well past graduation.' },
  ],
  // The scroll cue points at the section after this one.
  cue: visibility.speakers ? { label: 'Meet the speakers', href: '#speakers' } : { label: 'See the schedule', href: '#schedule' },
}

// TODO: replace with the confirmed lineup. `image` accepts any URL.
export const speakers = [
  {
    id: 'sp-1',
    name: 'Speaker One',
    role: 'Author & Historian',
    org: 'Columbia University',
    badge: 'S/',
    bio: 'Placeholder bio. Writes on Sikh historiography and the diaspora archive, and teaches a seminar on memory and partition.',
    image: placeholderImage('Speaker 01', { width: 800, height: 1100, bg: '#2a3d27', fg: '#a3ad99' }),
  },
  {
    id: 'sp-2',
    name: 'Speaker Two',
    role: 'Civil Rights Attorney',
    org: 'Sikh Coalition',
    badge: 'S/',
    bio: 'Placeholder bio. Litigates religious accommodation cases and advises campus groups on advocacy.',
    image: placeholderImage('Speaker 02', { width: 800, height: 1100, bg: '#2a3d27', fg: '#a3ad99' }),
  },
  {
    id: 'sp-3',
    name: 'Speaker Three',
    role: 'Kirtani & Educator',
    org: 'Independent',
    badge: 'K/',
    bio: 'Placeholder bio. Teaches raag-based kirtan and runs an annual student intensive.',
    image: placeholderImage('Speaker 03', { width: 800, height: 1100, bg: '#2a3d27', fg: '#a3ad99' }),
  },
  {
    id: 'sp-4',
    name: 'Speaker Four',
    role: 'Founder',
    org: 'Seva Initiative',
    badge: 'F/',
    bio: 'Placeholder bio. Built a student-run mutual aid network across six campuses.',
    image: placeholderImage('Speaker 04', { width: 800, height: 1100, bg: '#2a3d27', fg: '#a3ad99' }),
  },
  {
    id: 'sp-5',
    name: 'Speaker Five',
    role: 'Physician',
    org: 'Yale School of Medicine',
    badge: 'D/',
    bio: 'Placeholder bio. Researches health equity in South Asian immigrant communities.',
    image: placeholderImage('Speaker 05', { width: 800, height: 1100, bg: '#2a3d27', fg: '#a3ad99' }),
  },
  {
    id: 'sp-6',
    name: 'Speaker Six',
    role: 'Documentary Filmmaker',
    org: 'Independent',
    badge: 'V/',
    bio: 'Placeholder bio. Films oral histories of gurdwaras across the Northeast.',
    image: placeholderImage('Speaker 06', { width: 800, height: 1100, bg: '#2a3d27', fg: '#a3ad99' }),
  },
]

export const schedule = {
  friday: {
    id: 'friday',
    label: 'Fri',
    dateLine: 'Friday',
    note: 'Arrival, check-in, and a short evening program.',
    items: [
      { time: '4:00 PM', title: 'Arrival & Check-In', location: 'Registration Desk', detail: 'Badges and welcome packets.' },
      { time: '6:30 PM', title: 'Langar', location: 'Dining Hall', detail: 'Open to all attendees and volunteers.' },
      { time: '8:00 PM', title: 'Rehras & Kirtan', location: 'Prayer Hall', detail: 'Student-led.' },
      { time: '9:00 PM', title: 'Opening Mixer', location: 'Common Room', detail: 'Meet the delegations. Low-key, no program.' },
    ],
  },
  saturday: {
    id: 'saturday',
    label: 'Sat',
    dateLine: 'Saturday',
    note: 'The full conference program.',
    items: [
      { time: '8:00 AM', title: 'Nitnem & Breakfast', location: 'Prayer Hall', detail: '' },
      { time: '9:30 AM', title: 'Opening Keynote', location: 'Main Auditorium', detail: 'Speaker TBA' },
      { time: '11:00 AM', title: 'Breakout Sessions I', location: 'Seminar Rooms', detail: 'Advocacy · History · Kirtan · Career' },
      { time: '12:30 PM', title: 'Langar', location: 'Dining Hall', detail: '' },
      { time: '2:00 PM', title: 'Panel: Sikhi on Campus', location: 'Main Auditorium', detail: 'SSA leads from across the Ivy League.' },
      { time: '3:30 PM', title: 'Breakout Sessions II', location: 'Seminar Rooms', detail: 'Workshops, hands-on.' },
      { time: '5:00 PM', title: 'Seva Project', location: 'Off-site', detail: 'Partnered with a local organization.' },
    ],
  },
}

/**
 * The registration call to action. There are no ticket tiers — registration is
 * a single free sign-up handled by an external form (`event.registerUrl`).
 *
 * `facts` renders as a metadata row under the button; add or remove entries
 * freely.
 */
export const registration = {
  eyebrow: 'Registration',
  headline: 'Come to the weekend',
  note: 'Free for any enrolled student. One form, two minutes — hotel and dietary needs are both requested on it.',
  ctaLabel: 'Register',
  // Shown in place of the button until `event.registerUrl` is a real link.
  pendingLabel: 'Registration coming soon',
  facts: [
    { id: 'when', label: 'When', value: 'April 2027' },
    { id: 'where', label: 'Where', value: 'New York City' },
    { id: 'cost', label: 'Cost', value: 'Free for students' },
    // TODO: confirm the closing date and the cap.
    { id: 'closes', label: 'Closes', value: 'TBA' },
  ],
}

/**
 * Host chapters and sponsors.
 *
 * A host entry carries no `logo` by default and renders as a wordmark set in
 * the site's own display face. That is deliberate: a university's shield and
 * logotype are registered trademarks, licensed per-use by each school's
 * trademark office, and a chapter is not the university. Naming a school in
 * type is fair; shipping its mark without a licence is not.
 *
 * To use a real mark once a school has cleared it: drop the file in
 * `public/logos/` and add `logo: '/logos/<file>.svg'` to that entry. Sponsors
 * take the same key — a sponsor supplying its logo is granting the licence.
 */
export const partners = {
  // All eight Ivy League chapters. `wordmark` is the short name for the card;
  // `name` stays the full chapter name for screen readers and alt text.
  hosts: [
    { id: 'brown', name: 'Brown SSA', wordmark: 'Brown' },
    { id: 'columbia', name: 'Columbia SSA', wordmark: 'Columbia' },
    { id: 'cornell', name: 'Cornell SSA', wordmark: 'Cornell' },
    { id: 'dartmouth', name: 'Dartmouth SSA', wordmark: 'Dartmouth' },
    { id: 'harvard', name: 'Harvard SSA', wordmark: 'Harvard' },
    { id: 'penn', name: 'Penn SSA', wordmark: 'Penn' },
    { id: 'princeton', name: 'Princeton SSA', wordmark: 'Princeton' },
    { id: 'yale', name: 'Yale SSA', wordmark: 'Yale' },
  ],
  // TODO: replace with confirmed sponsors and the marks they supply.
  sponsors: [
    { id: 'sponsor-1', name: 'Sponsor One', logo: placeholderImage('Sponsor 01', { width: 320, height: 140, bg: 'none', fg: '#a3ad99' }) },
    { id: 'sponsor-2', name: 'Sponsor Two', logo: placeholderImage('Sponsor 02', { width: 320, height: 140, bg: 'none', fg: '#a3ad99' }) },
    { id: 'sponsor-3', name: 'Sponsor Three', logo: placeholderImage('Sponsor 03', { width: 320, height: 140, bg: 'none', fg: '#a3ad99' }) },
    { id: 'sponsor-4', name: 'Sponsor Four', logo: placeholderImage('Sponsor 04', { width: 320, height: 140, bg: 'none', fg: '#a3ad99' }) },
  ],
}

export const faq = [
  {
    id: 'cost',
    q: 'What does it cost?',
    a: 'Nothing. Registration is free for every student.',
  },
  {
    id: 'sponsor',
    q: 'How can I sponsor or donate?',
    a: 'Sponsors and donors keep the conference free for students. Every contribution goes toward the venue, langar and programming.',
    link: { label: 'Support SILC', href: event.sponsorUrl },
  },
  {
    id: 'travel',
    q: 'How do I get there?',
    a: 'The conference is in New York City, an easy train or bus ride from anywhere on the East Coast. Most delegations arrive Friday afternoon.',
  },
  {
    id: 'langar',
    q: 'What about food and dietary needs?',
    a: 'Langar is served all weekend and is fully vegetarian. Flag allergies or other dietary needs on your registration form and the langar seva team will accommodate them.',
  },
  {
    id: 'housing',
    q: 'Where do I stay Friday night?',
    a: 'Once your registration is approved, we will email you details on how to join our hotel block.',
  },
  {
    id: 'access',
    q: 'Is the venue accessible?',
    a: 'All program spaces are step-free and wheelchair accessible. Email us with any access need — mobility, sensory, interpretation — and we will arrange it in advance.',
  },
]

/**
 * Photographs from previous years, in `public/archive/`. Resized, re-encoded
 * and stripped of EXIF before being committed — camera files carry GPS and
 * serial numbers, and these are photographs of identifiable people.
 *
 * `alt` describes what is in the frame, for anyone who cannot see it. `width`
 * and `height` are the file's real pixel dimensions: they are what lets the
 * browser reserve the right space before a lazily-loaded photo arrives, so the
 * page does not jump as the archive fills in.
 *
 * Add more entries freely; the section lays them out in drifting columns and
 * balances the column count against how many there are.
 */
export const gallery = [
  { id: 'g1', alt: 'A full room of students seated for the opening session', src: '/archive/full-room.jpg', width: 1400, height: 933 },
  { id: 'g2', alt: 'Five panellists seated in front of a photo wall, one speaking into a microphone', src: '/archive/panel-discussion.jpg', width: 1400, height: 933 },
  { id: 'g3', alt: 'A student in a suit and turban addressing the room with a microphone', src: '/archive/student-speaker.jpg', width: 933, height: 1400 },
  { id: 'g4', alt: 'A wide view of the panel, with the audience seated opposite', src: '/archive/panel-wide.jpg', width: 1400, height: 933 },
]
