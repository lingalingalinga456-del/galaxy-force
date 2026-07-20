// Demo jobs for the Find Work page (PRD v1.0). Used when Supabase jobs are empty.

export const JOB_TYPES = ['One-time', 'Daily', 'Weekly', 'Emergency'];

const CLIENTS = [
  { name: 'Rafi Hossain', verified: true, area: 'Dhanmondi' },
  { name: 'Nasreen Begum', verified: true, area: 'Uttara' },
  { name: 'BuildRight Ltd', verified: true, area: 'Gulshan' },
  { name: 'Apu Dey', verified: false, area: 'Mirpur' },
  { name: 'Sultana Traders', verified: true, area: 'Banani' },
  { name: 'Karim Enterprise', verified: true, area: 'Mohakhali' },
  { name: 'Liton Miah', verified: false, area: 'Savar' },
  { name: 'Green Homes', verified: true, area: 'Dhanmondi' },
];

const TITLES = [
  ['Fix leaking kitchen tap', 'home-services', 'Plumber', 'One-time', 'fixed'],
  ['Install split AC unit', 'home-services', 'AC Repair', 'One-time', 'fixed'],
  ['Deep clean 3-bedroom apartment', 'home-services', 'House Cleaning', 'Weekly', 'fixed'],
  ['Emergency car breakdown tow', 'automotive-repair', 'Towing', 'Emergency', 'fixed'],
  ['Paint living room walls', 'skilled-trades', 'Painter', 'One-time', 'fixed'],
  ['Build a boundary wall', 'construction-renovation', 'Mason', 'One-time', 'fixed'],
  ['Replace car battery', 'automotive-repair', 'Battery Replacement', 'Emergency', 'fixed'],
  ['House shifting to new flat', 'transportation-moving', 'House Moving', 'One-time', 'fixed'],
  ['Install CCTV cameras (4)', 'security-safety', 'CCTV Installation', 'One-time', 'fixed'],
  ['Math tutor for SSC student', 'education-tutoring', 'Home Tutor', 'Weekly', 'hourly'],
  ['Office electrical wiring fix', 'skilled-trades', 'Electrician', 'One-time', 'fixed'],
  ['Wedding catering for 200 guests', 'hospitality-events', 'Catering', 'One-time', 'fixed'],
  ['Welding for gate repair', 'skilled-trades', 'Welder', 'One-time', 'fixed'],
  ['Carpenter for kitchen cabinets', 'skilled-trades', 'Carpenter', 'One-time', 'fixed'],
  ['Home nurse for elderly parent', 'healthcare-wellness', 'Home Nurse', 'Daily', 'hourly'],
  ['Gardening & lawn care', 'home-services', 'Gardening', 'Weekly', 'fixed'],
  ['Truck driver for goods delivery', 'transportation-moving', 'Truck Driver', 'Daily', 'hourly'],
  ['Account bookkeeping for shop', 'professional-services', 'Accountant', 'Weekly', 'hourly'],
  ['Pest control for restaurant', 'home-services', 'Pest Control', 'One-time', 'fixed'],
  ['Tile setting for bathroom', 'skilled-trades', 'Tile Setter', 'One-time', 'fixed'],
  ['Urgent locksmith for locked door', 'security-safety', 'Locksmith', 'Emergency', 'fixed'],
  ['Roof leak repair', 'construction-renovation', 'Roofing', 'One-time', 'fixed'],
  ['Event photographer for seminar', 'hospitality-events', 'Event Photographer', 'One-time', 'fixed'],
  ['Bike mechanic for servicing', 'automotive-repair', 'Bike Mechanic', 'One-time', 'fixed'],
  ['Yoga trainer home sessions', 'healthcare-wellness', 'Yoga Trainer', 'Weekly', 'hourly'],
  ['Hardware store restocking', 'retail-local-shops', 'Hardware Store', 'One-time', 'fixed'],
  ['Solar panel cleaning', 'home-services', 'Gardening', 'Weekly', 'fixed'],
  ['Plumbing for new bathroom', 'skilled-trades', 'Plumber', 'One-time', 'fixed'],
  ['Office IT setup & cabling', 'professional-services', 'Business Consultant', 'One-time', 'fixed'],
  ['Childcare helper needed', 'healthcare-wellness', 'Caregiver', 'Daily', 'hourly'],
  ['Generator repair urgent', 'skilled-trades', 'Welder', 'Emergency', 'fixed'],
];

export function buildDemoJobs(): any[] {
  return TITLES.map((t, i) => {
    const client = CLIENTS[i % CLIENTS.length];
    const [title, cat, sub, type, budgetType] = t as [string, string, string, string, string];
    const budget = budgetType === 'hourly'
      ? 300 + (i % 6) * 100
      : [1500, 3500, 8000, 1200, 6000, 25000, 2000, 9000, 15000, 2500, 4000, 80000, 3000, 18000, 1200, 1500, 2500, 5000, 3500, 5000, 1500, 7000, 12000, 800, 2500, 9000][i];
    const proposals = (i * 3) % 18;
    const ago = ['2h', '5h', '1d', '3h', '6h', '2d', '4h', '1d', '8h', '12h'][i % 10];
    const match = 70 + ((i * 7) % 29);
    return {
      id: `job-${i + 1}`,
      title,
      category: cat,
      subcategory: sub,
      clientName: client.name,
      clientVerified: client.verified,
      budgetType,
      budget,
      location: client.area,
      distanceKm: 1 + (i % 9),
      jobType: type,
      proposalsCount: proposals,
      postedAt: ago,
      matchScore: match,
      skills: [sub, 'Reliable', i % 2 ? 'Punctual' : 'Experienced'],
      experienceLevel: i % 3 === 0 ? 'entry' : i % 3 === 1 ? 'intermediate' : 'expert',
      workersNeeded: 1 + (i % 3),
      urgent: type === 'Emergency',
      description: `We need a reliable ${sub.toLowerCase()} in ${client.area}. ${title}. Please bring your own tools if required. Flexible timing, negotiation welcome for experienced professionals.`,
      timeline: type === 'Emergency' ? 'ASAP (within 2 hours)' : `${1 + (i % 5)} days`,
    };
  });
}
