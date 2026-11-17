import {
  ServiceItem,
  ProductItem,
  ProjectItem,
  GalleryItem,
  BlogPostItem,
  TestimonialItem,
  WebsiteSettings,
} from '../types';

export const initialSettings: WebsiteSettings = {
  companyName: 'Desi Signs',
  tagline: 'Architectural & Commercial Signage Solutions in Edmonton',
  address: '9845 62 Ave NW',
  city: 'Edmonton',
  province: 'Alberta',
  postalCode: 'T6E 0E3',
  country: 'Canada',
  phone: '(780) 555-0192',
  email: 'Save@desisigns.com',
  businessHours: 'Monday – Friday: 8:00 AM – 5:00 PM | Saturday: By Appointment',
  serviceArea: [
    'Edmonton',
    'Strathcona County',
    'Sherwood Park',
    'St. Albert',
    'Leduc',
    'Spruce Grove',
    'Nisku',
    'Fort Saskatchewan',
  ],
  socialLinks: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    googleMaps: 'https://maps.google.com',
  },
  seoGlobalTitle: 'Desi Signs | Custom Architectural & Commercial Signage in Edmonton, AB',
  seoGlobalDescription:
    'Desi Signs delivers premium commercial signage in Edmonton, Alberta. Specializing in front-lit and halo-lit channel letters, 3D architectural letters, storefront fascias, pylon monuments, and custom LED installations with city permit management.',
};

export const initialServices: ServiceItem[] = [
  {
    id: 'srv-1',
    slug: 'channel-letters',
    title: 'Front-Lit & Halo-Lit Channel Letters',
    subtitle: 'High-impact illuminated dimensional letters engineered for commercial retail visibility.',
    shortDescription:
      'Custom three-dimensional letters with energy-efficient LED modules, UL-certified components, and custom painted aluminum returns.',
    fullDescription:
      'Illuminated channel letters represent the gold standard for modern retail storefronts and corporate headquarters. Engineered specifically to withstand extreme Alberta freeze-thaw cycles, every set is fabricated from heavy-gauge marine aluminum and impact-resistant cast acrylic. We provide front-lit (face-lit), reverse halo-lit (silhouette warm glow against the facade), and combination dual-illuminated configurations. Our team handles complete city permits, engineering sign-offs, and professional master-electrician installations across Greater Edmonton.',
    features: [
      'UL / CSA certified high-output Samsung LED modules',
      'Heavy-gauge welded aluminum backplates & returns',
      'Impact-resistant Plexiglas cast acrylic faces with trim cap',
      'Choice of raceway mount or seamless direct flush mount',
      'Day/Night perforated vinyl options for changing daytime/nighttime colors',
      'Full municipal permit compliance with City of Edmonton Bylaw 12800',
    ],
    specifications: [
      { label: 'Standard Depth', value: '3" (Halo) to 5" (Front-Lit)' },
      { label: 'Illumination', value: 'UL-Listed Class 2 low-voltage LEDs' },
      { label: 'Operating Temp', value: '-45°C to +40°C tested for Alberta' },
      { label: 'Power Draw', value: '12V / 24V energy efficient' },
      { label: 'Warranty', value: '5-Year comprehensive LED & structural warranty' },
    ],
    materials: ['Fabricated Marine-Grade Aluminum', 'Cast Impact Acrylic', 'UL-Certified LEDs', 'AkzoNobel Matthews Polyurethane Paint'],
    applications: ['Retail Shopping Centers', 'Standalone Plazas', 'Medical & Professional Clinics', 'Restaurants & Cafes', 'Corporate Offices'],
    image: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
    ],
    metaTitle: 'Channel Letter Signs Edmonton | Halo-Lit & Front-Lit Storefront Signage',
    metaDescription: 'Expert fabricated channel letter signs in Edmonton. Front-lit and reverse halo illumination, UL certified LED components, city permits and crane installation.',
    featured: true,
    order: 1,
  },
  {
    id: 'srv-2',
    slug: '3d-architectural-letters',
    title: '3D Dimensional Architectural Letters',
    subtitle: 'Precision CNC-routed and laser-cut metal, acrylic, and brass dimensional signage.',
    shortDescription:
      'Clean, unlit architectural letters and logos crafted from brushed aluminum, brass, stainless steel, and high-density urethane.',
    fullDescription:
      'For corporate interiors, executive boardrooms, and sophisticated exterior facades where subtle elegance speaks loudest, three-dimensional dimensional letters provide timeless craftsmanship. Desi Signs uses state-of-the-art precision laser and waterjet cutting technology to replicate corporate logos and typography with microscopic accuracy down to 0.1mm tolerances. Available in brushed aluminum, polished brass, blackened stainless steel, acrylic, and high-density urethane (HDU) foam with architectural standoffs.',
    features: [
      'Precision waterjet & 5-axis CNC routing',
      'Finishes: Brushed, Satin, Mirror Polish, Powder Coated, or Natural Patina',
      'Precision mounting templates with threaded stainless stud mounts',
      'Floating architectural standoffs from 1/4" to 2" depth',
      'UV-stable pigments for 10+ year interior & exterior color retention',
    ],
    specifications: [
      { label: 'Available Thicknesses', value: '1/8", 1/4", 1/2", 3/4", 1", and fabricated hollow up to 4"' },
      { label: 'Mounting Styles', value: 'Flush VHB adhesive, threaded studs, or raised floating sleeves' },
      { label: 'Finishing Options', value: 'Directional brushing, bead-blast, satin clear coat, custom PMS match' },
      { label: 'Interior / Exterior', value: 'Engineered for both indoor executive lobbies and outdoor masonry' },
    ],
    materials: ['Solid Aluminum Plate', 'Architectural C360 Brass', '316 Marine Stainless Steel', 'Cast Clear & Color Acrylic', 'Precision HDU'],
    applications: ['Executive Corporate Lobbies', 'Law & Accounting Firms', 'Financial Institutions', 'Boutique Hotels', 'Educational Campuses'],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
    ],
    metaTitle: '3D Architectural Lettering Edmonton | Metal, Acrylic & Brass Lobby Signs',
    metaDescription: 'Precision waterjet cut and CNC milled 3D architectural signage in Edmonton. Solid brushed aluminum, brass, and acrylic lobby signs for corporate offices.',
    featured: true,
    order: 2,
  },
  {
    id: 'srv-3',
    slug: 'storefront-commercial-signs',
    title: 'Commercial Storefront Signs & Fascias',
    subtitle: 'Turnkey storefront identity systems designed for high foot-traffic visibility.',
    shortDescription:
      'Engineered fascia panels, illuminated push-through acrylic signboards, cantilevered projecting blade signs, and architectural awnings.',
    fullDescription:
      'Your storefront is your most vital physical marketing asset. We partner with Edmonton business owners, architects, and franchise operators to transform plain exterior walls into striking, brand-defining storefronts. We engineer durable aluminum composite material (ACM) cladding, structural lightbox cabinets, and double-sided projecting blade signs that capture pedestrian traffic from both directions.',
    features: [
      'Heavy-duty extruded aluminum cabinet construction',
      'Shatter-resistant polycarbonate and flexible tensioned vinyl faces',
      'Push-through acrylic lettering with polished beveled edges',
      'Perpendicular double-sided blade signs for pedestrian sidewalks',
      'Architectural ACM facade cladding to modernize dated exteriors',
    ],
    specifications: [
      { label: 'Structural Framework', value: 'Welded 6061-T6 structural aluminum tubing' },
      { label: 'Wind Load Rating', value: 'Engineered to withstand 130 km/h prairie wind gusts' },
      { label: 'Illumination', value: 'High CRI 6500K daylight LED edge & backlighting' },
      { label: 'Installation', value: 'Boom truck & certified rigging crew' },
    ],
    materials: ['Alpolic / Dibond ACM Panels', 'Lexan Polycarbonate', 'Cast Acrylic', 'Powder Coated Steel Brackets'],
    applications: ['Retail Strip Malls', 'Downtown Pedestrian Corridors', 'Restaurants & Bakeries', 'Health Centers', 'Automotive Dealerships'],
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    ],
    metaTitle: 'Storefront Signs Edmonton | Commercial Facade & Building Signage',
    metaDescription: 'Custom commercial storefront signs in Edmonton. Building fascias, illuminated push-through cabinets, projecting blade signs, and permit management.',
    featured: true,
    order: 3,
  },
  {
    id: 'srv-4',
    slug: 'pylon-monument-signs',
    title: 'Freestanding Pylon & Monument Signs',
    subtitle: 'Commanding roadside signage designed for multi-tenant plazas and corporate campuses.',
    shortDescription:
      'High-stature illuminated pylon signs and architectural ground-level monuments engineered to withstand Alberta soils and wind loads.',
    fullDescription:
      'Freestanding monument and pylon signs give your property presence before customers even turn into your parking lot. Desi Signs oversees the entire lifecycle: geotechnical soil analysis, structural engineering stamps, concrete foundation piles, internal steel skeletal fabrication, and electrical hookups. Whether you require a sleek low-profile stone monument for a corporate campus or a multi-tenant pylon sign along major Edmonton arterial routes (such as Anthony Henday, Gateway Boulevard, or Yellowhead Trail), we deliver unmatched structural integrity.',
    features: [
      'Certified structural engineering calculations & stamped drawings',
      'Reinforced concrete sonotube / screw pile foundation engineering',
      'Interchangeable tenant directories with modular slide-in retainers',
      'Optional electronic programmable message centers (EMC integration)',
      'Masonry, stucco, architectural stone, and brushed metal finishes',
    ],
    specifications: [
      { label: 'Heights Available', value: 'Monuments: 4ft - 10ft | Pylons: 15ft - 35ft+' },
      { label: 'Foundation Type', value: 'Reinforced concrete cage / screw piles (depth 12ft-18ft)' },
      { label: 'Face Materials', value: 'Unbreakable polycarbonate or routed aluminum with push-through' },
      { label: 'Permits', value: 'Full City of Edmonton Development & Building Permit coordination' },
    ],
    materials: ['HSS Structural Steel Tubing', 'Architectural Masonry / Stucco', 'Extruded Aluminum Extrusions', 'Heavy Lexan Faces'],
    applications: ['Commercial Plazas', 'Industrial Business Parks', 'Hospital & Healthcare Grounds', 'Schools & Universities', 'Car Dealerships'],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    ],
    metaTitle: 'Pylon & Monument Signs Edmonton | Commercial Roadside Signage',
    metaDescription: 'Custom pylon signs and architectural monument signs in Edmonton. Stamped engineering, concrete pile foundations, multi-tenant panels, and LED lighting.',
    featured: true,
    order: 4,
  },
  {
    id: 'srv-5',
    slug: 'interior-reception-signs',
    title: 'Interior, Reception & Wayfinding Signage',
    subtitle: 'Sophisticated lobby focal walls, boardroom logos, and cohesive directional signage.',
    shortDescription:
      'Elevate client confidence the moment they step into your office with premium dimensional reception walls and compliant wayfinding.',
    fullDescription:
      'A professionally crafted reception sign is the centerpiece of your physical office space. We design bespoke lobby displays utilizing layered materials—such as frosted tempered glass with stainless steel standoffs, backlit dimensional logos with warm halo lighting, and rich wood backdrops. In addition, we design full interior architectural wayfinding systems including room identification, tactile ADA/barrier-free compliant Braille signage, and department directory boards.',
    features: [
      'Layered mixed-media construction (wood, metal, glass, acrylic)',
      'Concealed low-voltage wiring for subtle warm white halo backlighting',
      'Alberta Building Code compliant tactile Braille signage',
      'Precision installation with zero visible screw heads or damage to drywall',
    ],
    specifications: [
      { label: 'Mounting', value: 'Precision laser-machined standoffs or flush hidden keyhole cleats' },
      { label: 'Illumination', value: 'Low-profile 24V edge illumination / halo back-glow' },
      { label: 'Acoustics', value: 'Available with integrated sound-dampening felt backing' },
    ],
    materials: ['Tempered Opti-White Glass', 'Brushed Marine Aluminum', 'Warm Walnut & White Oak', 'Frosted Cast Acrylic'],
    applications: ['Corporate Headquarters', 'Medical Clinics & Dental Suites', 'Financial Advisory Offices', 'Design Studios', 'Hotels'],
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    ],
    metaTitle: 'Interior Reception Signs Edmonton | Office Lobby & Wayfinding Signs',
    metaDescription: 'High-end office reception signs, corporate lobby logo walls, and architectural wayfinding signage in Edmonton, Alberta.',
    featured: false,
    order: 5,
  },
  {
    id: 'srv-6',
    slug: 'custom-led-neon',
    title: 'Custom LED Neon & Artistic Signage',
    subtitle: 'Modern, shatterproof, energy-efficient LED neon signage for hospitality and retail.',
    shortDescription:
      'Vibrant faux-neon scripts, custom slogans, and photo-ready wall art crafted with durable food-safe silicone and low-voltage LEDs.',
    fullDescription:
      'Capture the timeless nostalgic warmth of vintage neon with none of the glass fragility, high voltage hazards, or buzzing transformers. Our custom LED neon signs utilize premium UV-resistant optical silicone tubing packed with ultra-dense micro-LEDs, mounted on crystal clear laser-cut acrylic backplates. Designed to serve as the ultimate photo moment for restaurants, cocktail bars, fitness boutiques, and creative workspaces.',
    features: [
      '100% shatterproof, lightweight, and child-safe',
      'Uses 80% less power than traditional neon gas glass tubes',
      'Includes RF wireless dimmer switch with brightness controls & party modes',
      'Lifespan rated for 50,000+ continuous hours',
    ],
    specifications: [
      { label: 'Input Voltage', value: '110-240V AC to 12V DC power adapter (cULus certified)' },
      { label: 'Backing Options', value: 'Cut-to-shape, full rectangle, or stand-alone acrylic stand' },
      { label: 'Cord Length', value: '2-meter transparent cord + 1.5-meter black power cord' },
    ],
    materials: ['Flexible Food-Grade Silicone', 'Precision Clear Cast Acrylic', 'High-Lumen SMD LEDs'],
    applications: ['Cafes & Bakeries', 'Bars & Lounges', 'Boutique Gyms & Salons', 'Event Venues', 'Home & Executive Suites'],
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    ],
    metaTitle: 'Custom LED Neon Signs Edmonton | Modern Neon Art & Slogans',
    metaDescription: 'Custom designed LED neon signs in Edmonton. Shatterproof, energy-saving, dimmable, and handcrafted for businesses and events.',
    featured: false,
    order: 6,
  },
];

export const initialProducts: ProductItem[] = [
  {
    id: 'prod-1',
    slug: 'front-lit-channel-letters',
    title: 'Custom Front-Lit Channel Letters',
    category: 'Channel Letters',
    shortDescription: 'The classic retail storefront sign: vibrant face illumination with aluminum returns.',
    fullDescription:
      'Our front-lit channel letters feature computer-bent aluminum returns and translucent acrylic faces with UV-resistant vinyl overlays. Every letter is sealed against weather and dust, ensuring decades of reliable service in Edmonton conditions.',
    leadTime: '2 to 3 weeks (including municipal permits)',
    warranty: '5 Years LED & Structural',
    customizationOptions: ['Font styling', 'Letter height (8" to 60"+)', 'Return paint color', 'Face color / Day-Night film', 'Mounting raceway or direct pin'],
    materialSpecs: ['.063 marine aluminum backs', '.040 aluminum returns', '3/16" cast acrylic faces', '1" jewelite trim cap'],
    image: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
    ],
    priceRange: 'Custom Quoted per Project',
    featured: true,
    order: 1,
  },
  {
    id: 'prod-2',
    slug: 'reverse-halo-channel-letters',
    title: 'Reverse Halo-Lit Channel Letters',
    category: 'Channel Letters',
    shortDescription: 'Sophisticated architectural glow: solid metal faces projecting soft ambient light backward.',
    fullDescription:
      'Halo-lit letters have welded aluminum faces and open or clear acrylic backs. LEDs reflect light off the building wall, creating a distinctive floating halo silhouette favored by upscale restaurants, luxury boutiques, and financial firms.',
    leadTime: '2 to 3 weeks',
    warranty: '5 Years LED & Structural',
    customizationOptions: ['Warm white (2700K - 3000K)', 'Pure white (4000K - 5000K)', 'Brushed metal face', 'Custom powder coat', 'Standoff depth (0.5" - 2")'],
    materialSpecs: ['Welded aluminum faces', 'Clear polycarbonate protective back covers', 'High-efficiency IP68 Samsung LEDs'],
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    ],
    priceRange: 'Custom Quoted per Project',
    featured: true,
    order: 2,
  },
  {
    id: 'prod-3',
    slug: 'push-through-acrylic-lightbox',
    title: 'Push-Through Acrylic Lightbox Fascia',
    category: 'Storefront Cabinets',
    shortDescription: 'Routed aluminum face panels with 1/2" acrylic graphics extending forward.',
    fullDescription:
      'Push-through acrylic cabinets provide a modern, seamless appearance. The aluminum face blocks all stray light, leaving only the polished acrylic letters glowing brightly from both their faces and edges.',
    leadTime: '3 weeks',
    warranty: '5 Years',
    customizationOptions: ['Matte black, bronze, or silver fascia', 'Dual-color push-through layers', 'RGB colour changing options'],
    materialSpecs: ['3mm architectural ACM face', '1/2" clear acrylic with 1/8" colored acrylic cap', 'Heavy welded internal tubing'],
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    ],
    priceRange: 'Custom Quoted',
    featured: true,
    order: 3,
  },
  {
    id: 'prod-4',
    slug: 'brushed-metal-lobby-logo',
    title: 'Architectural Brushed Metal Lobby Signs',
    category: 'Interior & Reception',
    shortDescription: 'Solid precision-cut aluminum and brass logos for executive reception walls.',
    fullDescription:
      'Make an unforgettable first impression. Our precision waterjet cut metal dimensional letters are hand-finished with horizontal brushing and protected with a satin architectural clear coat.',
    leadTime: '10 to 14 business days',
    warranty: 'Lifetime structural & finish warranty',
    customizationOptions: ['Brushed Aluminum', 'Brushed Brass', 'Polished Chrome', 'Black Anodized', 'Custom Standoffs'],
    materialSpecs: ['Solid 6061 aluminum plate (1/4" to 1/2")', 'Threaded rear steel pins', 'Standoff spacers'],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    ],
    priceRange: 'From $850 CAD',
    featured: true,
    order: 4,
  },
  {
    id: 'prod-5',
    slug: 'double-sided-blade-sign',
    title: 'Illuminated Projecting Blade Signs',
    category: 'Storefront Signs',
    shortDescription: 'Perpendicular bracket-mounted signs designed to capture sidewalk foot traffic.',
    fullDescription:
      'Ideal for pedestrian shopping districts like Whyte Avenue, 104th Street Downtown, and Old Strathcona. Our blade signs feature structural steel wall mounting plates engineered to resist high wind shear.',
    leadTime: '2 to 3 weeks',
    warranty: '5 Years',
    customizationOptions: ['Circular, square, or custom contoured shapes', 'Internal illumination or external gooseneck spotlights', 'Decorative scrollwork or minimalist brackets'],
    materialSpecs: ['Laser-cut heavy steel mounting flange', 'Dual-sided acrylic or aluminum face panels', 'Internal waterproof LED array'],
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    ],
    priceRange: 'From $1,400 CAD',
    featured: false,
    order: 5,
  },
  {
    id: 'prod-6',
    slug: 'custom-led-neon-signboard',
    title: 'Bespoke LED Neon Signboards',
    category: 'Neon Signs',
    shortDescription: 'Flexible silicone LED neon custom designed with brand logos or typographic slogans.',
    fullDescription:
      'Crafted with hand-bent flexible silicone LED neon tubes, backed by laser-cut acrylic. Safe, cool to the touch, and dimmable with included wireless remote.',
    leadTime: '7 to 10 business days',
    warranty: '2 Years Comprehensive',
    customizationOptions: ['12 vibrant vibrant LED colors', 'Clear, black, or mirrored acrylic backplate', 'Dimmer & wireless remote control'],
    materialSpecs: ['Flexible food-grade silicone LED', '8mm cast acrylic backboard', '12V DC power transformer'],
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
    ],
    priceRange: 'From $450 CAD',
    featured: false,
    order: 6,
  },
];

export const initialProjects: ProjectItem[] = [
  {
    id: 'proj-1',
    slug: 'aurora-motel-pylon-sign',
    title: 'Aurora Motel – Illuminated Pylon Sign',
    client: 'Aurora Motel',
    location: 'Edmonton, AB',
    category: 'Pylon & Monument Signs',
    year: '2025',
    summary:
      'Night-ready multi-panel pylon with illuminated brand header, vacancy lightbox, and rate messaging for strong roadside visibility.',
    challenge:
      'The property needed brighter roadside presence after dark while keeping service messaging clear for weekly and monthly guests.',
    solution:
      'We fabricated a multi-cabinet illuminated pylon with high-contrast brand panels, vacancy lightbox, and durable weather-sealed LED internals for Alberta nights.',
    materialsUsed: ['Aluminum lightbox cabinets', 'Polycarbonate faces', 'High-output LED modules', 'Powder-coated steel posts'],
    image: '/d0d97e90-4168-44ff-9e37-bdb1211172f3.jpg',
    additionalImages: [],
    featured: true,
    published: true,
    order: 1,
  },
  {
    id: 'proj-2',
    slug: 'blooming-futures-daycare-channel-letters',
    title: 'Blooming Futures Foundation Daycare',
    client: 'Blooming Futures Foundation Daycare',
    location: '9807 71 St, Edmonton, AB',
    category: 'Channel Letters & Window Graphics',
    year: '2025',
    summary:
      'Illuminated channel letters with brand logo mark, daycare capsule sign, and full-color window graphics for a welcoming storefront.',
    challenge:
      'The daycare needed a friendly, highly readable identity that worked on a modern commercial facade and large glass frontage.',
    solution:
      'We installed illuminated channel letters with logo identity, a complementary capsule sign, matching address lettering, and colorful window graphics.',
    materialsUsed: ['LED channel letters', 'ACM / aluminum returns', 'Vinyl window graphics', 'Dimensional logo fabrication'],
    image: '/9675c0a4-66ed-48ff-ab92-9fb93437264a.jpg',
    additionalImages: [
      '/165498e9-07b3-4c02-a542-578931d13005.jpg',
      '/d98870d3-1cb1-4e0a-a9e5-8da48131250f.jpg',
    ],
    featured: false,
    published: true,
    order: 2,
  },
  {
    id: 'proj-3',
    slug: 'vape-smoke-more-storefront',
    title: 'Vape Smoke & More – Storefront Package',
    client: 'Vape Smoke & More',
    location: 'Edmonton, AB',
    category: 'Channel Letters & Window Graphics',
    year: '2025',
    summary:
      'Bold dimensional lettering paired with high-impact window wraps and entrance wayfinding for a complete retail exterior identity.',
    challenge:
      'The retailer needed strong street visibility plus clear entrance direction for customers approaching from the parking lot.',
    solution:
      'We combined stacked channel letters with full-color window graphics and directional messaging for a complete storefront package.',
    materialsUsed: ['Dimensional channel letters', 'Printed vinyl window wraps', 'Exterior LED flood accent'],
    image: '/1943da0a-ee2e-42f6-86e9-5f85f68c9959.jpg',
    additionalImages: [],
    featured: false,
    published: true,
    order: 3,
  },
  {
    id: 'proj-4',
    slug: 'gopal-sweets-backlit-sign',
    title: 'Gopal Sweets – Custom Backlit Sign',
    client: 'Gopal Sweets',
    location: 'Edmonton, AB',
    category: 'Custom Fabrication & Halo Lighting',
    year: '2025',
    summary:
      'Laser-cut rose-gold face with mirrored detail and warm LED backlighting for a distinctive sweets-shop brand mark.',
    challenge:
      'The brand required a custom illustrated mark that felt premium and cultural while remaining durable for commercial use.',
    solution:
      'We laser-cut a rose-gold faceplate with mirrored internal detail and warm LED halo lighting for a standout backlit identity piece.',
    materialsUsed: ['Laser-cut metal face', 'Mirrored acrylic detail', 'Warm white LED backlighting'],
    image: '/9e85633c-bfd7-4011-85a1-866453712a7b.jpg',
    additionalImages: [],
    featured: false,
    published: true,
    order: 4,
  },
  {
    id: 'proj-5',
    slug: 'blooming-futures-plaza-storefront',
    title: 'Blooming Futures – Plaza Storefront View',
    client: 'Blooming Futures Foundation Daycare',
    location: '9807 71 St, Edmonton, AB',
    category: 'Commercial Storefront Branding',
    year: '2025',
    summary:
      'Full plaza view of the daycare storefront package with channel letters, logo mark, and window branding in context.',
    challenge:
      'The client needed a complete exterior identity that read clearly from the parking lot and neighboring units.',
    solution:
      'We delivered a coordinated storefront package with dimensional channel letters, logo mark, capsule sign, and window graphics visible across the plaza.',
    materialsUsed: ['LED channel letters', 'Dimensional logo', 'Window vinyl graphics'],
    image: '/d98870d3-1cb1-4e0a-a9e5-8da48131250f.jpg',
    additionalImages: [
      '/165498e9-07b3-4c02-a542-578931d13005.jpg',
      '/9675c0a4-66ed-48ff-ab92-9fb93437264a.jpg',
    ],
    featured: false,
    published: true,
    order: 5,
  },
];

export const initialGallery: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Front-Lit LED Channel Letters',
    category: 'Channel Letters',
    image: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=1200&q=80',
    location: 'South Edmonton Common',
    aspectRatio: 'landscape',
    featured: true,
  },
  {
    id: 'gal-2',
    title: 'Warm Halo-Lit Architectural Letters',
    category: 'Channel Letters',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    location: 'Whyte Avenue',
    aspectRatio: 'landscape',
    featured: true,
  },
  {
    id: 'gal-3',
    title: 'Solid Brushed Brass Dimensional Logo',
    category: 'Interior & Reception',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    location: 'Downtown Corporate Tower',
    aspectRatio: 'landscape',
    featured: true,
  },
  {
    id: 'gal-4',
    title: 'Modern Retail Storefront Facade',
    category: 'Storefront Signs',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    location: 'Sherwood Park',
    aspectRatio: 'landscape',
    featured: true,
  },
  {
    id: 'gal-5',
    title: 'Custom LED Neon Artwork & Script',
    category: 'LED Neon',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
    location: '104th Street Cafe',
    aspectRatio: 'portrait',
    featured: true,
  },
  {
    id: 'gal-6',
    title: 'Multi-Tenant Commercial Monument Sign',
    category: 'Monuments & Pylons',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    location: 'St. Albert Trail',
    aspectRatio: 'landscape',
    featured: true,
  },
  {
    id: 'gal-7',
    title: 'Executive Boardroom Frosted Wall Display',
    category: 'Interior & Reception',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
    location: 'Nisku Industrial Park',
    aspectRatio: 'landscape',
    featured: false,
  },
  {
    id: 'gal-8',
    title: 'Illuminated Projecting Blade Sign',
    category: 'Storefront Signs',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    location: 'Old Strathcona Historic District',
    aspectRatio: 'portrait',
    featured: false,
  },
];

export const initialBlogs: BlogPostItem[] = [
  {
    id: 'blog-1',
    slug: 'edmonton-signage-bylaw-12800-permit-guide',
    title: 'The Complete Guide to Edmonton Signage Bylaws & City Permits (Bylaw 12800)',
    shortDescription:
      'Everything Edmonton business owners need to know about zoning restrictions, permit timelines, and engineering requirements for commercial signs.',
    content: `
Installing an exterior commercial sign in Edmonton is governed by Edmonton Zoning Bylaw 12800. Whether you are opening a new retail storefront in South Edmonton Common, redesigning a restaurant facade on Whyte Avenue, or erecting a roadside pylon sign along the Yellowhead, securing the proper municipal permits is mandatory before fabrication begins.

### 1. Types of Permits Required
In Edmonton, exterior business signage generally requires two levels of municipal approval:
- **Development Permit**: Verifies that the sign's dimensions, height, projection, illumination type, and location comply with the specific land use zoning of your parcel.
- **Building Permit**: Required whenever a sign is illuminated (electrical hookup), structurally attached to a building wall, or freestanding (requiring concrete footings and structural wind-load verification).

### 2. Illumination and Safety Regulations
The City of Edmonton enforces strict limits on light trespass and glare, particularly when commercial properties border residential zones. Front-lit channel letters and halo-lit signs must use UL/CSA certified Class 2 low-voltage drivers. Signs positioned near signalized traffic intersections are also evaluated to ensure they do not impair driver visibility or mimic traffic control signals.

### 3. How Desi Signs Manages the Permit Process
Navigating municipal applications can be time-consuming. Desi Signs offers comprehensive permit management:
- We prepare architectural elevation drawings and site plan schematics.
- We coordinate stamped structural engineering reviews for pylons, projecting blade signs, and heavy fascia cabinets.
- We submit documentation directly through Edmonton's online portal and liaise with city development officers.

Having your sign engineered and permitted correctly from day one protects your business from costly violation fines or forced removal orders.
    `,
    author: 'Harpreet Singh',
    authorRole: 'Founder & Senior Signage Engineer',
    category: 'Permits & Regulations',
    tags: ['Edmonton Permits', 'Bylaw 12800', 'Commercial Signage', 'Zoning'],
    publishedDate: '2025-10-14',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Commercial storefront signage in Edmonton',
    metaTitle: 'Edmonton Signage Permits & Bylaw 12800 Guide | Desi Signs',
    metaDescription: 'A complete guide to Edmonton sign permits, zoning regulations under Bylaw 12800, engineering stamps, and commercial sign compliance.',
    focusKeyword: 'Edmonton signage permits',
    canonicalUrl: '',
    published: true,
  },
  {
    id: 'blog-2',
    slug: 'channel-letters-vs-lightbox-signage-retail-roi',
    title: 'Channel Letters vs. Lightbox Signs: Which Delivers Higher ROI for Retail?',
    shortDescription:
      'A deep dive into upfront costs, architectural impact, energy consumption, and brand perception for Alberta retailers.',
    content: `
When selecting an exterior storefront sign for your business, the two most common options are individual illuminated channel letters and illuminated cabinet lightboxes. Both provide night-time visibility, but they convey markedly different impressions and have differing long-term return on investment (ROI).

### Channel Letters: Architectural Elegance and Prestige
Channel letters are individual three-dimensional letters, numbers, and logo symbols crafted from aluminum and acrylic. 
- **Aesthetic Appeal**: Because each letter stands individually on the wall or on a slim architectural raceway matching the facade, channel letters look customized, premium, and sophisticated.
- **Landlord Compliance**: Major commercial retail developments (such as West Edmonton Mall, Currents of Windermere, and South Edmonton Common) mandate channel letters in their tenant criteria.
- **Energy Efficiency**: Modern LED channel letters consume up to 70% less energy than old fluorescent lightboxes and require minimal maintenance over 5+ years.

### Lightbox Signs: Practical Utility and Budget Predictability
A lightbox sign is an extruded aluminum cabinet with a translucent polycarbonate or acrylic face featuring applied graphics.
- **Cost**: The initial capital cost of a lightbox is generally 30% to 40% lower than channel letters.
- **Flexibility**: If your tenant turnover is high or your business name changes frequently, updating a flat face panel is simple and economical.
- **Limitations**: In many modern commercial developments, flat lightboxes are restricted to rear service doors or industrial park settings.

### The Verdict
If your business is a professional clinic, restaurant, boutique retail store, or financial firm, channel letters yield significantly higher customer trust and brand authority that easily offsets the initial investment.
    `,
    author: 'Harpreet Singh',
    authorRole: 'Founder & Senior Signage Engineer',
    category: 'Business & ROI',
    tags: ['Channel Letters', 'Lightbox Signs', 'Retail ROI', 'Branding'],
    publishedDate: '2025-09-22',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Retail storefront with illuminated channel letter signage',
    metaTitle: 'Channel Letters vs Lightbox Signage ROI | Edmonton Sign Guide',
    metaDescription: 'Compare illuminated channel letters and lightbox sign cabinets for retail storefronts. Costs, aesthetics, landlord rules, and durability.',
    focusKeyword: 'channel letters ROI',
    canonicalUrl: '',
    published: true,
  },
  {
    id: 'blog-3',
    slug: 'exterior-signage-durability-alberta-winters',
    title: 'Exterior Signage Maintenance in Alberta Winters: Extreme Cold Durability',
    shortDescription:
      'How to protect illuminated signs, LED drivers, and structural mounting hardware from -40°C temperatures, snow buildup, and freezing rain.',
    content: `
Alberta's climate is notoriously harsh on exterior commercial signs. Between November and March, temperatures routinely plummet below -30°C, followed by rapid Chinook thawing cycles and relentless prairie wind gusts.

Signs that are fabricated using cheap materials, non-rated LED transformers, or inadequate water drainage will inevitably suffer from cracking acrylic, failed electronics, and water infiltration.

### 1. Specifying Low-Temperature LED Power Supplies
Standard commercial LED transformers operate reliably down to -20°C. In Edmonton, however, winter lows frequently exceed these thresholds. Desi Signs exclusively specifies Mean Well and Samsung IP68 Class 2 drivers engineered to start and operate efficiently at -40°C.

### 2. Weep Holes and Condensation Management
Temperature swings cause air inside sealed sign cabinets to expand and contract, drawing in moisture that condenses into water. Without properly placed weep holes equipped with bug screens, standing water freezes into ice, cracking the face panels or shorting connections.

### 3. Cast Acrylic vs. Extruded Plastic
Many budget sign makers use inexpensive extruded styrene or low-grade acrylic that turns brittle in freezing conditions. We exclusively use cast acrylic and high-impact polycarbonate (Lexan) that maintains structural flexibility even under sub-zero wind loads.

Regular pre-winter inspections by a certified signage contractor can save thousands of dollars in emergency service calls during January blizzards.
    `,
    author: 'Harpreet Singh',
    authorRole: 'Founder & Senior Signage Engineer',
    category: 'Materials & Durability',
    tags: ['Alberta Winter', 'Sign Maintenance', 'LED Durability', 'Edmonton Weather'],
    publishedDate: '2025-08-30',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Commercial building exterior during Alberta winter',
    metaTitle: 'Winter Signage Maintenance Alberta | Extreme Cold Durability Tips',
    metaDescription: 'Discover how to engineer and maintain exterior commercial signs for Alberta winters. Cold-weather LEDs, condensation drainage, and wind load safety.',
    focusKeyword: 'Alberta winter signage',
    canonicalUrl: '',
    published: true,
  },
];

export const initialTestimonials: TestimonialItem[] = [
  {
    id: 'test-1',
    clientName: 'Dr. Marcus Vance',
    companyName: 'Summit Health & Wellness Clinic',
    role: 'Clinical Director',
    content:
      'Desi Signs designed and installed both our outdoor front-lit channel letters and our frosted glass reception sign in Strathcona. Their craftsmanship is second to none, and they managed the entire City of Edmonton permit approval without any delay. Truly an exceptional partner.',
    projectType: 'Storefront Channel Letters & Lobby Display',
    location: 'Strathcona, Edmonton',
    rating: 5,
    featured: true,
  },
  {
    id: 'test-2',
    clientName: 'Elena Rostova',
    companyName: 'The Glasshouse Bistro',
    role: 'Co-Owner & General Manager',
    content:
      'We wanted a subtle, warm halo-lit sign that looked like an architectural feature rather than a flashy billboard. Desi Signs delivered exactly what we envisioned. The satin brass finish and warm ambient backlighting attract compliments from our guests every evening.',
    projectType: 'Reverse Halo-Lit Channel Letters',
    location: 'South Edmonton Common',
    rating: 5,
    featured: true,
  },
  {
    id: 'test-3',
    clientName: 'Tariq Al-Mansoor',
    companyName: 'Apex Commercial Plaza',
    role: 'Property Manager',
    content:
      'Managing a 12-tenant commercial retail plaza requires a robust, illuminated monument sign that holds up to traffic and weather. Desi Signs engineered the concrete foundation, handled stamped engineering, and installed a sign that has withstood two Alberta winters flawlessly.',
    projectType: 'Commercial Pylon Monument Sign',
    location: 'St. Albert Trail, Edmonton',
    rating: 5,
    featured: true,
  },
];

