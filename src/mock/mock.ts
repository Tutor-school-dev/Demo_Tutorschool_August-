export const stats = [
  { value: '10,000+', label: 'Students Guided' },
  { value: '30%', label: 'Avg. Score Improvement' },
  { value: '4.9/5', label: 'Parent Rating' },
  { value: '24hr', label: 'Tutor Match Time' },
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

export const testimonials = [
  {
    subject: 'Math',
    duration: '3 months',
    before: 65,
    after: 92,
    quote:
      "Aarav used to dread Math. Within 8 weeks of starting with Ms. Anjali from TutorSchool, his confidence transformed. The weekly reports helped us see exactly where he was improving.",
    name: 'Priya Sharma',
    role: 'Mother of Aarav, Class 10',
    city: 'Delhi',
    board: 'CBSE',
    avatar:
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
  },
  {
    subject: 'Science',
    duration: '4 months',
    before: 72,
    after: 89,
    quote:
      "What surprised us was how quickly TutorSchool matched us — within a day. The tutor came home, understood our daughter's learning style, and built her interest in Science from scratch.",
    name: 'Rajesh Kumar',
    role: 'Father of Ananya, Class 8',
    city: 'Bangalore',
    board: 'ICSE',
    avatar:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
  },
  {
    subject: 'Physics',
    duration: '6 months',
    before: 58,
    after: 95,
    quote:
      "Board prep stress was real. The tutor's structured approach and TutorSchool's progress tracking helped Vivaan score 95% — far beyond our expectations. Worth every rupee.",
    name: 'Meena Patel',
    role: 'Mother of Vivaan, Class 12',
    city: 'Mumbai',
    board: 'CBSE',
    avatar:
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80',
  },
];

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
