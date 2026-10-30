// Phi, the AI moving assistant of Phi Movers: names, limits and every word the chat panel shows.
// Shared by the browser panel and the /api/chat routes, so nothing secret belongs here.

import { BRAND } from '../site-facts';

export const AI_NAME = 'Phi';
export const AI_ROLE = 'AI Moving Assistant';

export const LIMITS = {
  photos: 4,
  messageChars: 2000,
  voiceSeconds: 90,
  liveSeconds: 600,
  savedMessages: 40,
} as const;

export type VoiceId = 'friendly' | 'smooth' | 'warm' | 'soft';

// Gemini prebuilt voices. Used for "Listen to this answer" and for Live Voice.
export const VOICES: { id: VoiceId; label: string; gemini: string }[] = [
  { id: 'friendly', label: 'Man · friendly', gemini: 'Achird' },
  { id: 'smooth', label: 'Man · smooth', gemini: 'Algieba' },
  { id: 'warm', label: 'Woman · warm', gemini: 'Sulafat' },
  { id: 'soft', label: 'Woman · soft', gemini: 'Achernar' },
];
export const DEFAULT_VOICE: VoiceId = 'friendly';

// Phi answers in English only, written and spoken. There is no language setting.
export type Settings = { voice: VoiceId; patient: boolean; memory: boolean };
export const DEFAULT_SETTINGS: Settings = { voice: DEFAULT_VOICE, patient: false, memory: true };

// The jobs a price can be worked out for, in the order the "Get a price" list shows them.
// Links are the real service pages (slugs from lib/data.ts).
export const JOBS = [
  { id: 'home', label: 'House or flat move', href: '/services/house-removals' },
  { id: 'man-van', label: 'Man and van', href: '/services/man-and-van' },
  { id: 'single', label: 'Single item or sofa', href: '/services/single-item-delivery' },
  { id: 'office', label: 'Office move', href: '/services/office-removals' },
  { id: 'student', label: 'Student move', href: '/services/student-moves' },
] as const;

export const SERVICES = [
  { label: 'House removals', href: '/services/house-removals' },
  { label: 'Flat removals', href: '/services/flat-removals' },
  { label: 'Studio moves', href: '/services/studio-moves' },
  { label: 'Man and van', href: '/services/man-and-van' },
  { label: 'Student moves', href: '/services/student-moves' },
  { label: 'Sofa delivery', href: '/services/sofa-delivery' },
  { label: 'Single item delivery', href: '/services/single-item-delivery' },
  { label: 'Office removals', href: '/services/office-removals' },
  { label: 'Full packing service', href: '/services/full-packing-service' },
  { label: 'Furniture assembly', href: '/services/furniture-assembly' },
  { label: 'Secure storage', href: '/services/secure-storage' },
] as const;

/** Where "Get a quote" goes (the quote form on the contact page). */
export const QUOTE_HREF = '/contact#quote';

export const T = {
  open: `Ask ${AI_NAME}`,
  subtitle: `Your ${AI_ROLE}`,
  badge: 'AI',
  status: { online: 'Online', connecting: 'Connecting…', offline: 'You are offline', unavailable: 'Unavailable right now' },
  hello: `Hi, I’m ${AI_NAME}, your AI moving assistant.`,
  welcome: 'How can I help with your move?',
  tryAsking: 'Or try asking',
  starters: ['What does a 1-bed flat move cost?', 'Which van do I need for a 2-bed?', 'Which areas do you cover?'],
  actions: {
    quote: 'Get a price', quoteHint: 'A guide price for your move',
    book: 'Get a quote', bookHint: 'Send us your details',
    services: 'Explore services', servicesHint: 'Everything we do',
    photo: 'Send a photo', photoHint: 'I’ll tell you what fits',
    quoteTitle: 'What are you moving?',
    servicesTitle: 'Our services. Choose one to hear about it.',
    quoteAsk: 'I need a price for this: {service}',
    aboutAsk: 'Tell me about this service: {service}',
    back: 'Back',
    allServices: 'See all services',
  },
  photoQuestion: 'Here is a photo. What size of move is this, and what would it cost?',
  photosQuestion: 'Here are {count} photos. What size of move is this, and what would it cost?',
  photoLimit: 'You can add up to {count} photos to one question.',
  placeholder: `Ask ${AI_NAME} anything…`,
  photoPlaceholder: 'Add a question (optional)',
  dropHere: 'Drop the photo here',
  addPhoto: 'Add photos',
  removePhoto: 'Remove the photo',
  photoFailed: 'That photo could not be read. Please try a JPG or PNG.',
  retry: 'Try again',
  send: 'Send',
  restart: 'New chat',
  close: 'Close the assistant',
  settings: 'Your chat',
  helpful: 'Helpful',
  notHelpful: 'Not helpful',
  thanks: 'Thanks for telling us',
  copy: 'Copy the answer',
  copied: 'Copied',
  typing: `${AI_NAME} is typing…`,
  slow: 'Still working on your answer…',
  latest: 'Go to the latest message',
  lookingAtPhoto: 'Looking at your photo…',
  footnote: `${AI_NAME} can make mistakes. Your price is confirmed with you before we start.`,
  footnoteLink: 'Get a quote',
  repliesLabel: 'Quick answers',
  errors: {
    notConfigured: 'The assistant is not available right now. You can get a quote online, or call {phone}.',
    signIn: 'Your chat session ended. Please send your message again.',
    busy: 'That was a lot of questions in a short time. Please wait a few minutes and try again.',
    invalid: 'That message could not be sent. Please try again.',
    slow: 'The answer took too long. Please try again.',
    unavailable: 'I’m unavailable right now. Please try again in a moment, or call {phone}.',
    empty: 'I could not prepare an answer. Please ask in another way.',
    offline: 'You seem to be offline. Check your connection and try again.',
    refused: 'I can’t help with that one. For anything about your move, ask away, or call {phone}.',
  },
  voice: {
    start: 'Speak your question',
    send: 'Send the voice message',
    cancel: 'Delete the recording',
    asking: 'Allow the microphone to start…',
    listening: 'Recording',
    sending: 'Writing out your voice message…',
    note: 'Voice message',
    quiet: 'No sound is coming from your microphone. Check it is not muted, or choose another one in Settings.',
    privacy: 'What you say is written out and saved with your conversation. The sound itself is not kept.',
    errors: {
      denied: 'The microphone is blocked for this site. Allow it in your browser settings, or type your question.',
      noMicrophone: 'No microphone was found. Please type your question.',
      unsupported: 'This browser cannot record. Please type your question.',
      noSpeech: 'I could not make out any words. Please record it again.',
      noSound: 'Your microphone sent no sound. Check it is not muted and the right one is chosen, then try again.',
      tooShort: 'That was too short. Press the microphone, say your question, then press Send.',
      tooLong: 'That recording was too long. Please keep it under a minute and a half.',
      busy: 'That was a lot of recordings in a short time. Please type your question, or try again in a few minutes.',
      unavailable: 'I could not write that out just now. Please try again, or type your question.',
      notConfigured: 'Voice is not switched on yet. Please type your question.',
    },
  },
  live: {
    start: 'Start Live Voice',
    end: 'End Live Voice',
    stop: 'End',
    title: 'Live Voice',
    connecting: 'Connecting…',
    listening: 'Listening. Just speak.',
    hearing: 'I’m listening…',
    thinking: 'One moment…',
    speaking: 'Speaking. Talk over me to interrupt.',
    ended: 'Live Voice has ended. Press its button to start again.',
    unavailable: 'Live Voice could not connect just now. Please try again, or type your question.',
    privacy: 'What is said in Live Voice is written down and saved with your conversation. The sound is not kept.',
  },
  speak: { play: 'Listen to this answer', stop: 'Stop reading', loading: 'Preparing the audio…', failed: 'The audio could not be played just now.' },
  quote: {
    title: 'Your guide price',
    estimate: 'A guide price based on our hourly rates. We confirm a fixed quote with you before the move.',
    onCall: 'This move is quoted individually by our team.',
    rowJob: 'Move', rowSize: 'Size', rowVan: 'Van and crew', rowHours: 'Time booked', rowFrom: 'From', rowTo: 'To', rowDay: 'Day', rowTime: 'Start',
    van: 'Van and crew',
    hours: 'Hours',
    fewer: 'Fewer: {what}',
    more: 'More: {what}',
    open: 'You choose when requesting',
    failed: 'The price could not be updated. Please try again.',
    book: 'Get a quote',
    fullForm: 'Open the full quote form',
    extras: 'Extras such as evening starts, heavy items and mileage beyond 10 miles are on our pricing page.',
    extrasLink: 'See pricing',
  },
  checkout: {
    title: 'Get a quote for this move',
    lead: 'A few last details so our team can confirm your fixed quote. Nothing to pay now.',
    address: 'Address',
    from: 'Collection address',
    to: 'Delivery address',
    postcode: 'Postcode',
    line: 'House or flat number and street',
    day: 'Preferred day (optional)',
    time: 'Preferred start (optional)',
    name: 'Your name',
    phone: 'Mobile number',
    email: 'Email (optional)',
    notes: 'Anything we should know? (optional)',
    consentBefore: 'I agree to the',
    terms: 'terms',
    consentAnd: 'and',
    privacy: 'privacy notice',
    send: 'Send quote request',
    sending: 'Sending…',
    back: 'Back to the price',
    booked: 'Quote request {reference} is saved. Our team will contact you to confirm your fixed quote, usually within about one working hour.',
    track: 'See it in your account',
    check: 'Some details need another look. They are marked below.',
    errors: {
      failed: 'The request could not be sent just now. Please try again, or call {phone}.',
      busy: 'Too many requests were sent from this connection. Please wait a few minutes, or call {phone}.',
      required: 'Please fill this in.',
      phone: 'Please enter a phone number we can call.',
      email: 'That does not look like an email address.',
      postcode: 'Please enter a postcode.',
      consent: 'Please tick to agree.',
    },
  },
  gate: {
    invite: `Ask ${AI_NAME} anything.`,
    checking: 'One moment…',
  },
  account: {
    tabSettings: 'Settings',
    tabChats: 'Conversations',
    thisDevice: 'Your chats are kept for this browser only, with no sign-in needed.',
    past: 'Earlier conversations',
    noPast: 'No earlier conversations yet.',
    questions: '{count} questions',
    oneQuestion: '1 question',
    download: 'Download this conversation',
    voice: 'Voice',
    voiceHelp: `The voice ${AI_NAME} reads answers in and speaks with in Live Voice. Press one to hear it.`,
    voiceSample: `Hi, I’m ${AI_NAME}. Tell me what you are moving and I’ll work out a guide price.`,
    patient: 'Give me more time to speak',
    patientHelp: `In Live Voice, ${AI_NAME} waits a little longer before answering, so a pause while you think is not taken as the end.`,
    microphone: 'Microphone',
    microphoneDefault: 'Default microphone',
    memory: 'Remember my earlier chats',
    memoryOn: `${AI_NAME} keeps short notes on what you asked before, so you do not have to explain again. Turning this off deletes the notes.`,
    memoryOff: `${AI_NAME} starts fresh every time. Your saved conversations are still in the list.`,
    erase: 'Delete my chat data',
    eraseConfirm: 'Delete your conversations and notes from our records? This cannot be undone.',
    eraseYes: 'Yes, delete everything',
    cancel: 'Cancel',
    back: 'Back to the chat',
    resumed: 'Welcome back. This is where you left off.',
    opened: 'An earlier conversation. Carry on from here.',
    failed: 'That could not be done just now. Please try again.',
    transcriptHeading: `Conversation with ${AI_NAME}, ${BRAND}`,
    you: 'You',
    spoken: 'spoken',
  },
  memory: {
    back: 'Welcome back.',
    lastTime: 'Last time we talked about: {topic}.',
    resume: 'Carry on',
    resumeAsk: 'I’d like to carry on from our last conversation.',
  },
} as const;

/** Fills {name} style placeholders. */
export function tf(text: string, values: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (m, k: string) => (k in values ? String(values[k]) : m));
}

export const isEmail = (v: string) => /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,24}$/i.test(v.trim());
