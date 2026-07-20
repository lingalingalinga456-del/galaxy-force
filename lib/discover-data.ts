// Demo data for the Discover Workforce page (v2.1). Used as fallback/seed when
// the Supabase tables are empty so the marketplace always looks populated.

export const IMG = {
  electrician: 'https://images.unsplash.com/photo-1545259741-2ea3a54f4cfe?auto=format&fit=crop&w=400&q=70',
  mechanic: 'https://images.unsplash.com/photo-1486262715619-67e5e4db6392?auto=format&fit=crop&w=400&q=70',
  tutor: 'https://images.unsplash.com/photo-1503676260728-1c00da0949d1?auto=format&fit=crop&w=400&q=70',
  cleaner: 'https://images.unsplash.com/photo-1581578731548-c2763647dc21?auto=format&fit=crop&w=400&q=70',
  driver: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=70',
  construction: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=400&q=70',
  plumber: 'https://images.unsplash.com/photo-1607472586893-2b1cc3fa5b4e?auto=format&fit=crop&w=400&q=70',
  painter: 'https://images.unsplash.com/photo-1562259929-b4e1b4c668a5?auto=format&fit=crop&w=400&q=70',
  ac: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=70',
  security: 'https://images.unsplash.com/photo-1556156653-e5a7676c6cc2?auto=format&fit=crop&w=400&q=70',
  chef: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=70',
  tailor: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=70',
  gardener: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=400&q=70',
  welder: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&w=400&q=70',
  shop: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=400&q=70',
  hardware: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=400&q=70',
  autoparts: 'https://images.unsplash.com/photo-1486262715619-67e5e4db6392?auto=format&fit=crop&w=400&q=70',
};

export const TRADES = [
  'skilled-trades','home-services','automotive','construction','repair-maintenance','transportation','security',
  'professional-services','education','healthcare','digital-services','business-services','hospitality','agriculture',
  'manufacturing','beauty-wellness','event-services','retail',
];

export const SITUATIONS = [
  { slug: 'emergency-repairs', label: 'Emergency Repairs', q: 'emergency electrical repair', icon: '🚨' },
  { slug: 'moving-house', label: 'Moving House', q: 'need a truck and movers', icon: '📦' },
  { slug: 'wedding-services', label: 'Wedding Services', q: 'wedding decorator and photographer', icon: '💍' },
  { slug: 'home-renovation', label: 'Home Renovation', q: 'painter and mason for renovation', icon: '🏠' },
  { slug: 'office-setup', label: 'Office Setup', q: 'office cleaning and IT setup', icon: '🏢' },
  { slug: 'vehicle-breakdown', label: 'Vehicle Breakdown', q: 'car mechanic and towing', icon: '🚗' },
  { slug: 'house-cleaning', label: 'House Cleaning', q: 'home deep cleaning', icon: '🧹' },
  { slug: 'ac-installation', label: 'AC Installation', q: 'split AC installation', icon: '❄️' },
  { slug: 'exam-prep', label: 'Exam Preparation', q: 'math tutor for exam', icon: '📚' },
  { slug: 'business-startup', label: 'Business Startup', q: 'accountant and lawyer for business', icon: '🚀' },
];

const FIRST = ['Rahim','Karim','Sara','Monir','Faisal','Tanvir','Nadia','Sohel','Rina','Jamal','Sumon','Apu','Farzana','Rony','Liton','Shila','Babul','Tania','Kamal','Ruma'];
const LAST = ['Ahmed','Hossain','Begum','Khan','Rana','Islam','Akter','Sheikh','Mia','Chowdhury','Rahman','Sultana'];
const ROLES: Record<string,string> = {
  'skilled-trades':'Electrician', 'home-services':'Home Cleaner', 'automotive':'Mechanic', 'construction':'Construction Worker',
  'repair-maintenance':'Repair Technician', 'transportation':'Driver', 'security':'Security Guard', 'professional-services':'Consultant',
  'education':'Tutor', 'healthcare':'Nurse', 'digital-services':'Web Developer', 'business-services':'Accountant',
  'hospitality':'Chef', 'agriculture':'Farmer', 'manufacturing':'Factory Worker', 'beauty-wellness':'Beautician',
  'event-services':'Event Helper', 'retail':'Sales Assistant',
};
const PHOTO: Record<string,string> = {
  'skilled-trades':IMG.electrician,'home-services':IMG.cleaner,'automotive':IMG.mechanic,'construction':IMG.construction,
  'repair-maintenance':IMG.plumber,'transportation':IMG.driver,'security':IMG.security,'professional-services':IMG.tutor,
  'education':IMG.tutor,'healthcare':IMG.chef,'digital-services':IMG.hardware,'business-services':IMG.tutor,
  'hospitality':IMG.chef,'agriculture':IMG.gardener,'manufacturing':IMG.welder,'beauty-wellness':IMG.tailor,
  'event-services':IMG.painter,'retail':IMG.shop,
};
const LOCATIONS = ['Dhanmondi','Uttara','Gulshan','Banani','Mirpur','Mohakhali','Savar','Gazipur','Chittagong','Sylhet'];
const STATUS = ['available','emergency_only','appointment','busy'];

export function buildDemoWorkers(): any[] {
  const out: any[] = [];
  let n = 0;
  for (const trade of TRADES) {
    for (let i = 0; i < 5; i++) {
      n++;
      const name = `${FIRST[n % FIRST.length]} ${LAST[(n * 3) % LAST.length]}`;
      const score = (3.8 + ((n * 7) % 12) / 10).toFixed(1);
      const st = STATUS[(n) % STATUS.length];
      out.push({
        id: `d-${trade}-${i}`,
        username: `worker-${trade}-${i}`,
        name,
        role: ROLES[trade],
        category: trade,
        photo: PHOTO[trade],
        score,
        verified: n % 4 !== 0,
        rate: 300 + ((n * 13) % 12) * 50,
        jobs: 40 + ((n * 11) % 380),
        distance: 1 + (n % 9),
        availability: st === 'available' ? 'Available' : st === 'emergency_only' ? 'Emergency' : st === 'appointment' ? 'By Appt' : 'Busy',
        match: 70 + (n % 28),
        skills: [ROLES[trade], 'Reliable', 'Punctual'],
      });
    }
  }
  return out;
}

export function buildDemoTeams(): any[] {
  const cats = ['Moving','Painting','Electrical','Plumbing','Construction','Cleaning','AC','Catering','Security','Gardening','Welding','Tutoring','Events','Tailoring','Driving','Cooking','IT','Repair'];
  return cats.map((c, i) => ({
    id: `team-${i + 1}`,
    name: `${['Dhaka','Elite','Pro','Swift','Prime','Royal','Star','Metro','City','National','United','Apex','Top','Bright','Golden','Silver','Master','Quick'][i]} ${c} ${['Crew','Team','Collective','Group','Squad'][i % 5]}`,
    leaderName: `${FIRST[i % FIRST.length]} ${LAST[(i * 5) % LAST.length]}`,
    memberCount: 3 + (i % 7),
    rating: (4.4 + (i % 6) / 10).toFixed(1),
    location: LOCATIONS[i % LOCATIONS.length],
    category: c,
    photo: i % 2 === 0 ? IMG.construction : IMG.painter,
  }));
}

export function buildDemoShops(): any[] {
  const names = ['Dhanmondi Hardware Mart','Uttara Auto Parts','Gulshan Building Supply','Banani Paint House','Mirpur Plumbing World','Mohakhali Repair Center','Savar Tools & Co','Chittagong Electricals','Sylhet Garden Store','Metro AC Solutions'];
  const cats = ['Hardware','Automotive','Construction','Painting','Plumbing','Repair','Tools','Electricals','Garden','AC'];
  return names.map((nm, i) => ({
    id: `shop-${i + 1}`,
    name: nm,
    category: cats[i],
    location: LOCATIONS[i % LOCATIONS.length],
    score: (4.4 + (i % 6) / 10).toFixed(1),
    products: 6 + (i % 5),
    banner: i % 2 === 0 ? IMG.hardware : IMG.shop,
  }));
}

export function buildDemoProducts(): any[] {
  const base = [
    ['Cordless Drill 18V', 'hardware', 3200, IMG.hardware],
    ['Brake Pads Set', 'automotive', 1450, IMG.autoparts],
    ['Cement 50kg Bag', 'construction', 540, IMG.shop],
    ['Exterior Paint 4L', 'painting', 2100, IMG.shop],
    ['PVC Pipe 1 inch', 'plumbing', 180, IMG.plumber],
    ['Socket Wrench Kit', 'hardware', 1850, IMG.hardware],
    ['Engine Oil 4L', 'automotive', 2600, IMG.autoparts],
    ['Tile Adhesive 20kg', 'construction', 720, IMG.shop],
    ['LED Work Light', 'repair', 950, IMG.shop],
    ['Paint Roller Set', 'painting', 420, IMG.shop],
    ['Copper Wire 10m', 'construction', 650, IMG.hardware],
    ['Car Battery 60Ah', 'automotive', 5200, IMG.autoparts],
  ];
  const out: any[] = [];
  for (let s = 0; s < 10; s++) {
    base.forEach((b, j) => out.push({
      id: `prod-${s}-${j}`,
      name: b[0],
      shop: buildDemoShops()[s]?.name || 'Shop',
      category: b[1],
      price: b[2],
      stock: j % 5 === 0 ? 'Low stock' : 'In stock',
      image: b[3],
    }));
  }
  return out;
}

export function buildLeadScrapeLeads(): any[] {
  const roles = ['Generator Repair', 'Sofa Upholstery', 'CCTV Installation', 'Solar Panel Fix', 'Water Tank Clean', 'Furniture Assembly', 'Glass Work', 'Pest Control', 'Waterproofing', 'Gate Fabrication', 'Inverter Service', 'Deep Well Pump', 'Marble Polish', 'Aluminium Work', 'Sound System Rent'];
  return roles.map((r, i) => ({
    id: `lead-${i + 1}`,
    name: r,
    location: LOCATIONS[i % LOCATIONS.length],
    rate: 400 + (i * 37) % 1600,
    source: 'LeadScrape Pro',
  }));
}
