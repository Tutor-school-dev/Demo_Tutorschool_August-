export const stats = [
  { value: 'AI-Powered', label: 'Tutor Matching' },
  { value: 'Personalized', label: 'Learning Plans' },
  { value: 'Verified', label: 'Expert Tutors' },
  { value: '< 24hr', label: 'Match Time' },
];

export const steps = [
  {
    num: '01',
    title: 'Tell us about your child',
    desc: 'Class, board, subjects, learning preferences — takes under 2 minutes.',
  },
  {
    num: '02',
    title: 'Get matched in 24 hours',
    desc: 'Our AI matches you with 3 verified tutors based on your needs.',
  },
  {
    num: '03',
    title: 'Free trial class',
    desc: 'Meet your tutor. No commitment. No advance payment. Decide after.',
  },
  {
    num: '04',
    title: 'Watch progress unfold',
    desc: 'Weekly reports, monthly assessments, real grade improvements.',
  },
];

export const features = [
  {
    title: '3-step tutor verification',
    desc: 'Every tutor is verified for academic credentials, teaching demo, and background — before they ever meet your child. We reject 71% of applicants.',
    tags: ['ID verified', 'Demo passed', 'Reference checked'],
    icon: 'ShieldCheck' as const,
  },
  {
    title: 'Result-driven plans',
    desc: 'Every student gets a custom 90-day study plan with weekly milestones — built for their board (CBSE / ICSE / State).',
    icon: 'Target' as const,
  },
  {
    title: 'Monthly progress reports',
    desc: 'Detailed parent reports — strengths, gaps, next focus areas. Delivered to WhatsApp.',
    icon: 'LineChart' as const,
  },
  {
    title: 'Flexible scheduling',
    desc: 'Weekday or weekend slots. Reschedule anytime. Online or at home — your choice.',
    icon: 'Calendar' as const,
  },
  {
    title: "Don't love it? Don't pay.",
    desc: 'Free first class. Switch tutors anytime in your first month — no questions asked.',
    icon: 'HeartHandshake' as const,
  },
];

export const testimonials: {
  subject: string;
  duration: string;
  before: number;
  after: number;
  quote: string;
  name: string;
  role: string;
  city: string;
  board: string;
  avatar: string;
}[] = [];

export const classes = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);
export const subjects = [
  'Math',
  'Science',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'Hindi',
  'Social Studies',
  'Other',
];

export const heroImage =
  'https://images.pexels.com/photos/18012459/pexels-photo-18012459.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940';
export const stepImage =
  'https://images.pexels.com/photos/6929182/pexels-photo-6929182.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940';
