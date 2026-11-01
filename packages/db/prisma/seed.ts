import { prisma } from "../src/index";
import { hashPassword } from "../src/auth";

const U = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const IMG = {
  colosseum: U("photo-1552832230-c0197dd311b5"),
  vatican: U("photo-1531572753322-ad063cecc140"),
  trevi: U("photo-1525874684015-58379d421a52"),
  rome1: U("photo-1555992828-ca4dbe41d294"),
  rome2: U("photo-1529260830199-42c24126f198"),
  rome3: U("photo-1515542622106-78bda8ba0e5b"),
  rome4: U("photo-1498307833015-e7b400441eb8"),
  rome5: U("photo-1569416078500-3857b00616f8"),
  rome6: U("photo-1604580864964-0462f5d5b1a8"),
  italy1: U("photo-1523906834658-6e24ef2386f9"),
  night: U("photo-1541370976299-4d24ebbc9077"),
  street: U("photo-1512918728675-ed5a9ecdebfd"),
  forum: U("photo-1551867633-194f125bddfa"),
  basilica: U("photo-1593698054469-2bb6fdf4b512"),
};

interface TourSeed {
  title: string;
  description: string;
  fullDescription: string;
  priceAdult: number;
  priceChild: number;
  priceYouth: number;
  priceStudentEu: number;
  priceInfant: number;
  durationDays: number;
  freeCancellation: boolean;
  pickupIncluded: boolean;
  highlights: string[];
  includes: string[];
  excludes: string[];
  notSuitableFor: string[];
  notAllowed: string[];
  knowBeforeYouGo: string[];
  images: string[];
  locations: string[];
}

const TOURS: TourSeed[] = [
  {
    title: "Colosseum, Roman Forum & Palatine Hill — Skip-the-Line Guided Tour",
    description:
      "Walk in the footsteps of emperors and gladiators on a guided tour of ancient Rome's greatest icons, with priority entrance included.",
    fullDescription:
      "Skip the long ticket lines and step straight into the Colosseum with your expert local guide. Explore the arena where gladiators fought, then continue to the Roman Forum — the beating heart of the ancient empire — and climb Palatine Hill for sweeping views over the city. Along the way, your guide brings 2,000 years of history to life with stories you won't find in guidebooks.",
    priceAdult: 59.0,
    priceChild: 29.0,
    priceYouth: 45.0,
    priceStudentEu: 39.0,
    priceInfant: 0,
    durationDays: 1,
    freeCancellation: true,
    pickupIncluded: false,
    highlights: [
      "Skip-the-line entry to the Colosseum, Roman Forum and Palatine Hill",
      "Expert English-speaking archaeologist guide",
      "Small groups of maximum 15 people",
      "Panoramic views of ancient Rome from Palatine Hill",
    ],
    includes: [
      "Priority entrance tickets",
      "Licensed professional guide",
      "Headsets to hear your guide clearly",
    ],
    excludes: ["Hotel pickup and drop-off", "Food and drinks", "Gratuities"],
    notSuitableFor: ["Wheelchair users (Palatine Hill section)", "People with mobility impairments"],
    notAllowed: ["Large bags or suitcases", "Glass bottles", "Pets"],
    knowBeforeYouGo: [
      "Arrive 20 minutes before your time slot at the meeting point",
      "A valid photo ID is required for entry",
      "The tour runs rain or shine — bring sun protection in summer",
    ],
    images: [IMG.colosseum, IMG.forum, IMG.rome2, IMG.rome1],
    locations: ["Colosseum", "Roman Forum", "Palatine Hill"],
  },
  {
    title: "Vatican Museums & Sistine Chapel — Fast-Track Entry Ticket",
    description:
      "Beat the queues at one of the world's greatest museums and stand beneath Michelangelo's Sistine Chapel ceiling.",
    fullDescription:
      "With over 20,000 works on display across 54 galleries, the Vatican Museums are unmissable — and so are their queues. This fast-track ticket gets you through a dedicated entrance, free to explore the Raphael Rooms, the Gallery of Maps and the breathtaking Sistine Chapel at your own pace. An optional audio guide reveals the stories behind the masterpieces.",
    priceAdult: 42.0,
    priceChild: 19.0,
    priceYouth: 32.0,
    priceStudentEu: 27.0,
    priceInfant: 0,
    durationDays: 1,
    freeCancellation: true,
    pickupIncluded: false,
    highlights: [
      "Fast-track entry through a dedicated turnstile",
      "Full access to the Vatican Museums and Sistine Chapel",
      "See the Raphael Rooms and Gallery of Maps",
      "Optional multilingual audio guide",
    ],
    includes: ["Fast-track admission ticket", "Access to all open galleries"],
    excludes: ["Guided tour", "St. Peter's Basilica entry", "Food and drinks"],
    notSuitableFor: ["Visitors with less than 2 hours available"],
    notAllowed: ["Shorts or bare shoulders (dress code)", "Flash photography in the Sistine Chapel", "Large backpacks"],
    knowBeforeYouGo: [
      "The Vatican Museums are closed on most Sundays",
      "Strict dress code: knees and shoulders must be covered",
      "Allow at least 3 hours for your visit",
    ],
    images: [IMG.vatican, IMG.basilica, IMG.rome3, IMG.italy1],
    locations: ["Vatican City", "Sistine Chapel"],
  },
  {
    title: "St. Peter's Basilica Dome Climb with Audio Guide",
    description:
      "Climb to the top of Michelangelo's dome for the most spectacular panorama in Rome, then explore the basilica below.",
    fullDescription:
      "Rise above St. Peter's Square on a climb to the summit of the world's most famous dome. Take the elevator to the terrace level, then ascend the final 320 steps through the dome's double shell to a breathtaking 360° view over Rome and the Vatican Gardens. Afterwards, descend into the basilica itself to admire Michelangelo's Pietà and Bernini's baldachin with your included audio guide.",
    priceAdult: 29.0,
    priceChild: 15.0,
    priceYouth: 24.0,
    priceStudentEu: 19.0,
    priceInfant: 0,
    durationDays: 1,
    freeCancellation: true,
    pickupIncluded: false,
    highlights: [
      "Elevator to the terrace, then climb to the lantern",
      "360° panorama over Rome from 136 metres",
      "Audio guide for the basilica included",
      "Skip the general admission queue",
    ],
    includes: ["Dome admission with elevator to terrace level", "Basilica audio guide"],
    excludes: ["Guided tour", "Vatican Museums entry"],
    notSuitableFor: ["People with claustrophobia", "People with heart conditions", "Wheelchair users beyond terrace level"],
    notAllowed: ["Luggage", "Sharp objects"],
    knowBeforeYouGo: [
      "The final ascent is 320 narrow steps with no elevator",
      "Dress code applies: knees and shoulders covered",
      "Early morning slots have the clearest views",
    ],
    images: [IMG.basilica, IMG.vatican, IMG.rome4],
    locations: ["Vatican City", "St. Peter's Basilica"],
  },
  {
    title: "Pantheon & Historic Center Walking Tour",
    description:
      "Stroll Rome's cobbled heart — the Pantheon, Piazza Navona and the Spanish Steps — with a storytelling local guide.",
    fullDescription:
      "Some of Rome's greatest wonders are free to walk between — if you know where to look. On this relaxed walking tour, your guide leads you through the historic center: the perfectly preserved Pantheon with its 2,000-year-old concrete dome, baroque Piazza Navona built over an ancient stadium, the Spanish Steps, and hidden alleys where Caravaggio once brawled. Finish with a tip-list of the neighborhood's best gelato and espresso.",
    priceAdult: 25.0,
    priceChild: 12.0,
    priceYouth: 19.0,
    priceStudentEu: 16.0,
    priceInfant: 0,
    durationDays: 1,
    freeCancellation: true,
    pickupIncluded: false,
    highlights: [
      "Guided visit inside the Pantheon",
      "Piazza Navona, Campo de' Fiori and the Spanish Steps",
      "Hidden courtyards and local legends",
      "Small-group experience with max 12 guests",
    ],
    includes: ["Professional local guide", "Pantheon reserved entry"],
    excludes: ["Food and drinks", "Hotel pickup"],
    notSuitableFor: [],
    notAllowed: ["Pets (except service animals)"],
    knowBeforeYouGo: [
      "The route covers about 2.5 km on cobblestones — wear comfortable shoes",
      "The Pantheon enforces silence inside",
    ],
    images: [IMG.rome1, IMG.street, IMG.rome5],
    locations: ["Pantheon", "Piazza Navona", "Historic Center"],
  },
  {
    title: "Trevi Fountain & Underground Domus Secret Tour",
    description:
      "Toss your coin at the Trevi Fountain, then descend beneath it to discover the ancient Roman streets hidden below.",
    fullDescription:
      "Everyone sees the Trevi Fountain — almost no one sees what lies beneath it. After the classic coin toss above ground, your guide takes you into the Vicus Caprarius archaeological site: an underground Roman apartment block and the ancient Aqua Virgo aqueduct that still feeds the fountain today, 19 centuries later. A short tour packed with secrets, perfect for your first evening in Rome.",
    priceAdult: 22.0,
    priceChild: 10.0,
    priceYouth: 17.0,
    priceStudentEu: 14.0,
    priceInfant: 0,
    durationDays: 1,
    freeCancellation: true,
    pickupIncluded: false,
    highlights: [
      "Guided visit of the Vicus Caprarius 'City of Water'",
      "See the ancient aqueduct that still feeds the Trevi Fountain",
      "Learn the real story of the coin-toss tradition",
    ],
    includes: ["Underground site admission", "Expert guide"],
    excludes: ["Hotel transfers"],
    notSuitableFor: ["Wheelchair users (stairs to the underground site)"],
    notAllowed: ["Tripods", "Large bags"],
    knowBeforeYouGo: [
      "The underground site is cool year-round — bring a light layer",
      "Evening slots see the fountain beautifully lit",
    ],
    images: [IMG.trevi, IMG.night, IMG.rome6],
    locations: ["Trevi Fountain", "Historic Center"],
  },
  {
    title: "Rome by Night — Illuminated City E-Bike Tour",
    description:
      "Glide past floodlit monuments on an easy e-bike ride — the Colosseum, Trevi and St. Peter's glowing after dark.",
    fullDescription:
      "When the day-trippers leave, Rome turns golden. This small-group e-bike tour rolls past the city's icons at their most magical hour: the floodlit Colosseum, the Imperial Forums, Piazza Venezia, the Trevi Fountain and across the river to St. Peter's Square. Electric pedal-assist makes the seven hills feel flat, and frequent photo stops mean you'll go home with the best shots of your trip.",
    priceAdult: 49.0,
    priceChild: 25.0,
    priceYouth: 39.0,
    priceStudentEu: 35.0,
    priceInfant: 0,
    durationDays: 1,
    freeCancellation: true,
    pickupIncluded: false,
    highlights: [
      "Premium e-bike, helmet and safety lights included",
      "See 10+ illuminated landmarks in one evening",
      "Guided photo stops at the best viewpoints",
      "Maximum 10 riders per guide",
    ],
    includes: ["E-bike and helmet rental", "Local cycling guide", "Bottled water"],
    excludes: ["Dinner", "Hotel pickup"],
    notSuitableFor: ["Children under 10", "Riders under 140 cm"],
    notAllowed: ["Riding without a helmet", "Alcohol before the ride"],
    knowBeforeYouGo: [
      "Basic cycling confidence is required",
      "The route is about 14 km over 3 hours at a relaxed pace",
    ],
    images: [IMG.night, IMG.rome2, IMG.colosseum],
    locations: ["Colosseum", "Trevi Fountain", "Vatican City", "Historic Center"],
  },
  {
    title: "Tivoli Day Trip — Villa d'Este & Hadrian's Villa from Rome",
    description:
      "Escape to the hills: two UNESCO World Heritage villas, Renaissance fountains and imperial ruins on a full-day trip.",
    fullDescription:
      "Just an hour from Rome, Tivoli hides two of Italy's most extraordinary estates. Wander Hadrian's Villa, the sprawling 2nd-century retreat of Rome's traveler-emperor, then climb to Villa d'Este, whose terraced Renaissance gardens cascade with five hundred fountains. Round-trip transport from central Rome, entrance tickets and a guide are all included — just bring your camera.",
    priceAdult: 89.0,
    priceChild: 45.0,
    priceYouth: 69.0,
    priceStudentEu: 59.0,
    priceInfant: 0,
    durationDays: 1,
    freeCancellation: true,
    pickupIncluded: true,
    highlights: [
      "Two UNESCO World Heritage sites in one day",
      "Round-trip air-conditioned coach from central Rome",
      "Guided visits of both villas with free time in Tivoli",
    ],
    includes: ["Transport from Rome", "Entrance to both villas", "Professional guide"],
    excludes: ["Lunch", "Gratuities"],
    notSuitableFor: ["Wheelchair users (steep garden paths)"],
    notAllowed: ["Drones", "Picnics inside the villas"],
    knowBeforeYouGo: [
      "The day involves 4–5 km of walking, some of it uphill",
      "Villa d'Este's fountains run at full power in the morning",
    ],
    images: [IMG.italy1, IMG.rome5, IMG.rome4],
    locations: ["Tivoli", "Villa d'Este", "Hadrian's Villa"],
  },
  {
    title: "Castel Sant'Angelo — Skip-the-Line Ticket with Terrace Access",
    description:
      "Storm Hadrian's mausoleum-turned-fortress and finish on the terrace with Rome's most cinematic river view.",
    fullDescription:
      "Tomb, fortress, papal refuge, prison, movie set: Castel Sant'Angelo has lived many lives in 1,900 years. This skip-the-line ticket takes you up the spiral ramp of Hadrian's mausoleum, through Renaissance papal apartments and past the secret corridor that once connected the castle to the Vatican. The reward at the top is the terrace made famous by Tosca — with the dome of St. Peter's rising across the Tiber.",
    priceAdult: 24.0,
    priceChild: 12.0,
    priceYouth: 18.0,
    priceStudentEu: 15.0,
    priceInfant: 0,
    durationDays: 1,
    freeCancellation: true,
    pickupIncluded: false,
    highlights: [
      "Skip-the-line entry to Castel Sant'Angelo",
      "Panoramic terrace over the Tiber and St. Peter's",
      "Renaissance papal apartments and historic armory",
    ],
    includes: ["Priority admission ticket", "Castle map"],
    excludes: ["Guided tour", "Audio guide"],
    notSuitableFor: ["Visitors unable to climb stairs"],
    notAllowed: ["Large luggage", "Weapons of any kind (it's no longer that kind of castle)"],
    knowBeforeYouGo: [
      "Sunset slots offer the best light from the terrace",
      "Allow about 2 hours for the full visit",
    ],
    images: [IMG.rome3, IMG.rome6, IMG.street],
    locations: ["Castel Sant'Angelo", "Historic Center"],
  },
];

async function main() {
  console.log("Seeding database…");

  // --- Admin user ---
  const adminEmail = "admin@iconicrometickets.com";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        firstName: "Iconic",
        lastName: "Admin",
        email: adminEmail,
        passwordHash: await hashPassword("Admin@Rome2026"),
        role: "admin",
        phone: "+39 06 0000 0000",
      },
    });
    console.log(`Created admin user ${adminEmail}`);
  }

  if ((await prisma.tour.count()) > 0) {
    console.log("Tours already present — skipping tour seed.");
    return;
  }

  // --- Locations ---
  const locationNames = Array.from(new Set(TOURS.flatMap((t) => t.locations)));
  const locations = new Map<string, number>();
  for (const name of locationNames) {
    const loc = await prisma.location.create({
      data: { name, description: `${name}, Rome, Italy` },
    });
    locations.set(name, loc.id);
  }

  // --- Tours with images, dates & time slots ---
  const today = new Date();
  const dates: string[] = [];
  for (let i = 1; i <= 60; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  const slotTemplates = [
    { startTime: "09:00", endTime: "12:00" },
    { startTime: "11:30", endTime: "14:30" },
    { startTime: "15:00", endTime: "18:00" },
  ];

  for (const t of TOURS) {
    const tour = await prisma.tour.create({
      data: {
        title: t.title,
        description: t.description,
        fullDescription: t.fullDescription,
        priceAdult: t.priceAdult,
        priceChild: t.priceChild,
        priceYouth: t.priceYouth,
        priceStudentEu: t.priceStudentEu,
        priceInfant: t.priceInfant,
        durationDays: t.durationDays,
        freeCancellation: t.freeCancellation,
        pickupIncluded: t.pickupIncluded,
        highlights: JSON.stringify(t.highlights),
        includes: JSON.stringify(t.includes),
        excludes: JSON.stringify(t.excludes),
        notSuitableFor: JSON.stringify(t.notSuitableFor),
        notAllowed: JSON.stringify(t.notAllowed),
        knowBeforeYouGo: JSON.stringify(t.knowBeforeYouGo),
        status: "published",
        isActive: true,
        images: {
          create: t.images.map((file, i) => ({ file, sortOrder: i })),
        },
        locations: {
          connect: t.locations.map((name) => ({ id: locations.get(name)! })),
        },
      },
    });

    for (const date of dates) {
      await prisma.tourDate.create({
        data: {
          date,
          tourId: tour.id,
          timeSlots: { create: slotTemplates.map((s) => ({ ...s })) },
        },
      });
    }
    console.log(`Seeded tour: ${t.title}`);
  }

  // --- Notice ---
  await prisma.notice.create({
    data: {
      title: "Spring in Rome — book early",
      description:
        "April–June is peak season at the Colosseum and Vatican. Book your time slot at least 3 days ahead to secure your first-choice time.",
      isActive: true,
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
