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
  name: 'EAST COAST SSA CONFERENCE',
  // Rendered as two oversized display lines in the hero.
  wordmarkLines: ['EAST COAST', 'SSA CONFERENCE'],
  shortName: 'EC SSA',
  tagline: 'One weekend. Every East Coast sangat. One table.',
  // TODO: replace once the rotating host school is confirmed.
  hostSchool: 'Host School TBA',
  hostLine: 'Hosted by the Ivy League Sikh Student Associations',
  // TODO: confirm the exact weekend before launch.
  year: 2027,
  season: 'Spring 2027',
  dates: 'Fri 26 – Sat 27 February 2027',
  datePill: '26/27.02',
  arrivalNote: 'Friday arrival + evening program',
  venue: 'Venue TBA',
  city: 'Northeast Corridor, USA',
  // TODO: swap for the Luma / Google Form registration link.
  registerUrl: '#',
  instagramUrl: 'https://instagram.com',
  email: 'hello@eastcoastssa.org',
}

/**
 * Order of the page, and the menu overlay's link list. Each `id` must match a
 * section id on the page and a key in `frameLabels`.
 */
export const navSections = [
  { id: 'hero', label: 'Top' },
  { id: 'agenda', label: 'The Weekend' },
  { id: 'speakers', label: 'Speakers' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'partners', label: 'Partners' },
  { id: 'register', label: 'Register' },
  { id: 'faq', label: 'FAQ' },
  { id: 'gallery', label: 'Archive' },
]

/**
 * Labels for the bottom-right slot of the nav frame. The frame swaps these
 * as each section scrolls into view.
 */
export const frameLabels = {
  hero: 'Doors 6PM Fri',
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
 * `{ keyword, media }` — emphasised phrase; `media` shows above it on hover.
 *
 * To edit the copy, edit the strings. To move a thumbnail, move the `media` key
 * to a different segment. TODO: swap the placeholder thumbnails for real photos.
 */
export const agenda = {
  eyebrow: 'The weekend',
  segments: [
    { text: 'Two hundred students from every SSA between Boston and Washington arrive on a Friday night. By Saturday evening the same room has sat through ' },
    {
      keyword: 'kirtan',
      media: { src: placeholderImage('Kirtan', { width: 320, height: 200, bg: '#1b3a6b', fg: '#E5E5E5' }), alt: 'Students playing kirtan at a past conference' },
    },
    { text: ', argued about ' },
    {
      keyword: 'history',
      media: { src: placeholderImage('History', { width: 320, height: 200, bg: '#222222', fg: '#E5E5E5' }), alt: 'A panel discussion in session' },
    },
    { text: ', cooked and served ' },
    {
      keyword: 'langar',
      media: { src: placeholderImage('Langar', { width: 320, height: 200, bg: '#333333', fg: '#E5E5E5' }), alt: 'Langar being served in the dining hall' },
    },
    { text: ', and traded the specific problem of keeping a chapter alive on a campus of thirty Sikhs. That is the whole idea.' },
  ],
  cue: 'Meet the speakers',
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
    image: placeholderImage('Speaker 01', { width: 800, height: 1100, bg: '#111111', fg: '#E5E5E5' }),
  },
  {
    id: 'sp-2',
    name: 'Speaker Two',
    role: 'Civil Rights Attorney',
    org: 'Sikh Coalition',
    badge: 'S/',
    bio: 'Placeholder bio. Litigates religious accommodation cases and advises campus groups on advocacy.',
    image: placeholderImage('Speaker 02', { width: 800, height: 1100, bg: '#111111', fg: '#E5E5E5' }),
  },
  {
    id: 'sp-3',
    name: 'Speaker Three',
    role: 'Kirtani & Educator',
    org: 'Independent',
    badge: 'K/',
    bio: 'Placeholder bio. Teaches raag-based kirtan and runs an annual student intensive.',
    image: placeholderImage('Speaker 03', { width: 800, height: 1100, bg: '#111111', fg: '#E5E5E5' }),
  },
  {
    id: 'sp-4',
    name: 'Speaker Four',
    role: 'Founder',
    org: 'Seva Initiative',
    badge: 'F/',
    bio: 'Placeholder bio. Built a student-run mutual aid network across six campuses.',
    image: placeholderImage('Speaker 04', { width: 800, height: 1100, bg: '#111111', fg: '#E5E5E5' }),
  },
  {
    id: 'sp-5',
    name: 'Speaker Five',
    role: 'Physician',
    org: 'Yale School of Medicine',
    badge: 'D/',
    bio: 'Placeholder bio. Researches health equity in South Asian immigrant communities.',
    image: placeholderImage('Speaker 05', { width: 800, height: 1100, bg: '#111111', fg: '#E5E5E5' }),
  },
  {
    id: 'sp-6',
    name: 'Speaker Six',
    role: 'Documentary Filmmaker',
    org: 'Independent',
    badge: 'V/',
    bio: 'Placeholder bio. Films oral histories of gurdwaras across the Northeast.',
    image: placeholderImage('Speaker 06', { width: 800, height: 1100, bg: '#111111', fg: '#E5E5E5' }),
  },
]

export const schedule = {
  friday: {
    id: 'friday',
    label: 'Fri',
    dateLine: 'Friday 26 February',
    note: 'Arrival, check-in, and a short evening program.',
    items: [
      { time: '4:00 PM', title: 'Arrival & Check-In', location: 'Registration Desk', detail: 'Badges, welcome packets, housing assignments.' },
      { time: '6:30 PM', title: 'Langar', location: 'Dining Hall', detail: 'Open to all attendees and volunteers.' },
      { time: '8:00 PM', title: 'Rehras & Kirtan', location: 'Prayer Hall', detail: 'Student-led.' },
      { time: '9:00 PM', title: 'Opening Mixer', location: 'Common Room', detail: 'Meet the delegations. Low-key, no program.' },
    ],
  },
  saturday: {
    id: 'saturday',
    label: 'Sat',
    dateLine: 'Saturday 27 February',
    note: 'The full conference program.',
    items: [
      { time: '8:00 AM', title: 'Nitnem & Breakfast', location: 'Prayer Hall', detail: '' },
      { time: '9:30 AM', title: 'Opening Keynote', location: 'Main Auditorium', detail: 'Speaker TBA' },
      { time: '11:00 AM', title: 'Breakout Sessions I', location: 'Seminar Rooms', detail: 'Advocacy · History · Kirtan · Career' },
      { time: '12:30 PM', title: 'Langar', location: 'Dining Hall', detail: '' },
      { time: '2:00 PM', title: 'Panel: Sikhi on Campus', location: 'Main Auditorium', detail: 'SSA leads from across the Ivy League.' },
      { time: '3:30 PM', title: 'Breakout Sessions II', location: 'Seminar Rooms', detail: 'Workshops, hands-on.' },
      { time: '5:00 PM', title: 'Seva Project', location: 'Off-site', detail: 'Partnered with a local organization.' },
      { time: '7:00 PM', title: 'Closing Kirtan Darbar', location: 'Prayer Hall', detail: '' },
      { time: '9:00 PM', title: 'Closing Night', location: 'Common Room', detail: 'Send-off, photos, next year’s host announced.' },
    ],
  },
}

export const tiers = [
  {
    id: 'student',
    name: 'Student',
    price: 'Free',
    note: 'Any enrolled undergraduate or graduate student.',
    perks: ['Full Saturday program', 'Langar all weekend', 'Friday evening program'],
    featured: false,
  },
  {
    id: 'delegate',
    name: 'Delegate',
    price: '$25',
    note: 'Students traveling in with an SSA delegation.',
    perks: ['Everything in Student', 'Housing with a host chapter', 'Conference tote & print program'],
    featured: false,
  },
  {
    id: 'patron',
    name: 'Patron',
    price: '$150',
    note: 'Alumni and community supporters. Covers a student.',
    perks: ['Everything in Delegate', 'Reserved seating', 'Sponsors one student registration'],
    featured: true,
  },
]

// TODO: swap placeholders for real host-school and sponsor marks.
export const partners = {
  hosts: [
    { id: 'columbia', name: 'Columbia SSA', logo: placeholderImage('Columbia', { width: 320, height: 140, bg: '#E5E5E5', fg: '#111111' }) },
    { id: 'penn', name: 'Penn SSA', logo: placeholderImage('Penn', { width: 320, height: 140, bg: '#E5E5E5', fg: '#111111' }) },
    { id: 'cornell', name: 'Cornell SSA', logo: placeholderImage('Cornell', { width: 320, height: 140, bg: '#E5E5E5', fg: '#111111' }) },
    { id: 'princeton', name: 'Princeton SSA', logo: placeholderImage('Princeton', { width: 320, height: 140, bg: '#E5E5E5', fg: '#111111' }) },
    { id: 'yale', name: 'Yale SSA', logo: placeholderImage('Yale', { width: 320, height: 140, bg: '#E5E5E5', fg: '#111111' }) },
    { id: 'harvard', name: 'Harvard SSA', logo: placeholderImage('Harvard', { width: 320, height: 140, bg: '#E5E5E5', fg: '#111111' }) },
  ],
  sponsors: [
    { id: 'sponsor-1', name: 'Sponsor One', logo: placeholderImage('Sponsor 01', { width: 320, height: 140, bg: '#E5E5E5', fg: '#111111' }) },
    { id: 'sponsor-2', name: 'Sponsor Two', logo: placeholderImage('Sponsor 02', { width: 320, height: 140, bg: '#E5E5E5', fg: '#111111' }) },
    { id: 'sponsor-3', name: 'Sponsor Three', logo: placeholderImage('Sponsor 03', { width: 320, height: 140, bg: '#E5E5E5', fg: '#111111' }) },
    { id: 'sponsor-4', name: 'Sponsor Four', logo: placeholderImage('Sponsor 04', { width: 320, height: 140, bg: '#E5E5E5', fg: '#111111' }) },
  ],
}

export const faq = [
  {
    id: 'cost',
    q: 'What does it cost?',
    a: 'Student registration is free. Delegate and Patron tiers exist so that chapters and alumni can cover travel, housing and langar for students who need it.',
  },
  {
    id: 'travel',
    q: 'How do I get there?',
    a: 'The host campus sits on the Northeast Corridor line. Most delegations arrive Friday afternoon by train or bus. Travel stipends are available — note it on your registration.',
  },
  {
    id: 'langar',
    q: 'What about food and dietary needs?',
    a: 'Langar is served all weekend and is fully vegetarian. Flag allergies or other dietary needs on your registration form and the langar seva team will accommodate them.',
  },
  {
    id: 'prayer',
    q: 'Is there a prayer space?',
    a: 'Yes. A dedicated space is open the entire weekend for nitnem, simran and quiet time, separate from the main program rooms.',
  },
  {
    id: 'housing',
    q: 'Where do I stay Friday night?',
    a: 'Host-chapter students open their rooms to visiting delegates. Request housing on your registration form. A discounted hotel block is available for anyone who prefers it.',
  },
  {
    id: 'access',
    q: 'Is the venue accessible?',
    a: 'All program spaces are step-free and wheelchair accessible. Email us with any access need — mobility, sensory, interpretation — and we will arrange it in advance.',
  },
]

// TODO: swap for real photos from prior conferences.
export const gallery = [
  { id: 'g1', alt: 'Attendees in the main auditorium', src: placeholderImage('2026', { width: 800, height: 1000, bg: '#111111', fg: '#888888' }) },
  { id: 'g2', alt: 'Langar seva', src: placeholderImage('2026', { width: 800, height: 600, bg: '#111111', fg: '#888888' }) },
  { id: 'g3', alt: 'Kirtan darbar', src: placeholderImage('2025', { width: 800, height: 900, bg: '#111111', fg: '#888888' }) },
  { id: 'g4', alt: 'Breakout session', src: placeholderImage('2025', { width: 800, height: 700, bg: '#111111', fg: '#888888' }) },
  { id: 'g5', alt: 'Group photo on the quad', src: placeholderImage('2024', { width: 800, height: 1100, bg: '#111111', fg: '#888888' }) },
  { id: 'g6', alt: 'Evening mixer', src: placeholderImage('2024', { width: 800, height: 800, bg: '#111111', fg: '#888888' }) },
]
