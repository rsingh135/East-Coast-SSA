/**
 * Single source of truth for every piece of copy on the site.
 * Next year's host committee edits this file — not the components.
 *
 * Placeholder values are marked TODO. Swap them, don't restructure them.
 */

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

// TODO: replace with the confirmed lineup. `image` accepts any URL.
export const speakers = [
  {
    id: 'sp-1',
    name: 'Speaker One',
    role: 'Author & Historian',
    org: 'Columbia University',
    badge: 'S/',
    bio: 'Placeholder bio. Writes on Sikh historiography and the diaspora archive, and teaches a seminar on memory and partition.',
    image: 'https://placehold.co/800x1100/111111/E5E5E5?text=Speaker+01',
  },
  {
    id: 'sp-2',
    name: 'Speaker Two',
    role: 'Civil Rights Attorney',
    org: 'Sikh Coalition',
    badge: 'S/',
    bio: 'Placeholder bio. Litigates religious accommodation cases and advises campus groups on advocacy.',
    image: 'https://placehold.co/800x1100/111111/E5E5E5?text=Speaker+02',
  },
  {
    id: 'sp-3',
    name: 'Speaker Three',
    role: 'Kirtani & Educator',
    org: 'Independent',
    badge: 'K/',
    bio: 'Placeholder bio. Teaches raag-based kirtan and runs an annual student intensive.',
    image: 'https://placehold.co/800x1100/111111/E5E5E5?text=Speaker+03',
  },
  {
    id: 'sp-4',
    name: 'Speaker Four',
    role: 'Founder',
    org: 'Seva Initiative',
    badge: 'F/',
    bio: 'Placeholder bio. Built a student-run mutual aid network across six campuses.',
    image: 'https://placehold.co/800x1100/111111/E5E5E5?text=Speaker+04',
  },
  {
    id: 'sp-5',
    name: 'Speaker Five',
    role: 'Physician',
    org: 'Yale School of Medicine',
    badge: 'D/',
    bio: 'Placeholder bio. Researches health equity in South Asian immigrant communities.',
    image: 'https://placehold.co/800x1100/111111/E5E5E5?text=Speaker+05',
  },
  {
    id: 'sp-6',
    name: 'Speaker Six',
    role: 'Documentary Filmmaker',
    org: 'Independent',
    badge: 'V/',
    bio: 'Placeholder bio. Films oral histories of gurdwaras across the Northeast.',
    image: 'https://placehold.co/800x1100/111111/E5E5E5?text=Speaker+06',
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
    { id: 'columbia', name: 'Columbia SSA', logo: 'https://placehold.co/320x140/E5E5E5/111111?text=Columbia' },
    { id: 'penn', name: 'Penn SSA', logo: 'https://placehold.co/320x140/E5E5E5/111111?text=Penn' },
    { id: 'cornell', name: 'Cornell SSA', logo: 'https://placehold.co/320x140/E5E5E5/111111?text=Cornell' },
    { id: 'princeton', name: 'Princeton SSA', logo: 'https://placehold.co/320x140/E5E5E5/111111?text=Princeton' },
    { id: 'yale', name: 'Yale SSA', logo: 'https://placehold.co/320x140/E5E5E5/111111?text=Yale' },
    { id: 'harvard', name: 'Harvard SSA', logo: 'https://placehold.co/320x140/E5E5E5/111111?text=Harvard' },
  ],
  sponsors: [
    { id: 'sponsor-1', name: 'Sponsor One', logo: 'https://placehold.co/320x140/E5E5E5/111111?text=Sponsor+01' },
    { id: 'sponsor-2', name: 'Sponsor Two', logo: 'https://placehold.co/320x140/E5E5E5/111111?text=Sponsor+02' },
    { id: 'sponsor-3', name: 'Sponsor Three', logo: 'https://placehold.co/320x140/E5E5E5/111111?text=Sponsor+03' },
    { id: 'sponsor-4', name: 'Sponsor Four', logo: 'https://placehold.co/320x140/E5E5E5/111111?text=Sponsor+04' },
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
  { id: 'g1', alt: 'Attendees in the main auditorium', src: 'https://placehold.co/800x1000/111111/888888?text=2026' },
  { id: 'g2', alt: 'Langar seva', src: 'https://placehold.co/800x600/111111/888888?text=2026' },
  { id: 'g3', alt: 'Kirtan darbar', src: 'https://placehold.co/800x900/111111/888888?text=2025' },
  { id: 'g4', alt: 'Breakout session', src: 'https://placehold.co/800x700/111111/888888?text=2025' },
  { id: 'g5', alt: 'Group photo on the quad', src: 'https://placehold.co/800x1100/111111/888888?text=2024' },
  { id: 'g6', alt: 'Evening mixer', src: 'https://placehold.co/800x800/111111/888888?text=2024' },
]
