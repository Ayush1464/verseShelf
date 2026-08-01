// Dummy data for VerseShelf

export const INITIAL_COMMISSION_RATE = 20; // 20% commission

export const CATEGORIES = [
  "Classical Poetry",
  "Modern Verse",
  "Haiku & Short Form",
  "Sonnets",
  "Spoken Word",
  "Prose Poetry"
];

export const DUMMY_AUTHORS = [
  {
    id: "auth-1",
    name: "Aria Sterling",
    bio: "Award-winning contemporary poet exploring themes of nature, solitude, and digital connection.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    sales: 142,
    earnings: 17040,
    balance: 3400
  },
  {
    id: "auth-2",
    name: "Julian Vane",
    bio: "Classical revivalist writing structured sonnets and lyrical poetry in the tradition of the Romantics.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    sales: 98,
    earnings: 11760,
    balance: 1950
  },
  {
    id: "auth-3",
    name: "Kaelen Moss",
    bio: "Spoken word artist and modern experimentalist merging verse with visual elements.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    sales: 64,
    earnings: 7680,
    balance: 800
  }
];

export const DUMMY_BOOKS = [
  {
    id: "book-1",
    title: "Whispers of the Wind",
    authorId: "auth-1",
    authorName: "Aria Sterling",
    category: "Modern Verse",
    price: 150,
    rating: 4.8,
    reviewsCount: 34,
    description: "A collection of 50 contemporary poems reflecting on the transient beauty of our natural world and the quiet moments in between our busy lives.",
    coverColor: "from-teal-800 to-emerald-950",
    coverPattern: "pattern-1",
    publishedDate: "2026-03-12",
    approved: true,
    previewPages: [
      "I. The Call\n\nThe wind does not speak in words,\nbut in the rustle of dry leaves,\nthe bending of the long grass,\nand the sigh of the old pine trees.\n\nIt tells of where it has been,\nof oceans crossed in the dark,\nof mountains climbed without effort,\nand of fires started from a spark.",
      "II. Digital Rain\n\nGlowing screens in the midnight hour,\nwe search for warmth in a sea of blue.\nA pixelated promise of human touch,\nbut the glass remains cold, and so do you.\n\nWe stream our souls into the ether,\nhoping someone on the other shore\ncatches the digital bottle we cast,\nand answers us, forevermore."
    ],
    pagesCount: 84
  },
  {
    id: "book-2",
    title: "Sonnets for the Moon",
    authorId: "auth-2",
    authorName: "Julian Vane",
    category: "Sonnets",
    price: 200,
    rating: 4.9,
    reviewsCount: 22,
    description: "A masterfully crafted set of 30 sonnets exploring love, loss, and the celestial watch of the moon over our nightly dreams.",
    coverColor: "from-indigo-950 to-slate-900",
    coverPattern: "pattern-2",
    publishedDate: "2026-04-05",
    approved: true,
    previewPages: [
      "Sonnet I\n\nWhen silver beams dissect the heavy night,\nAnd cast long shadows on the silent floor,\nI think of thee, my guiding, distant light,\nWhom I shall love till time exists no more.\n\nThe stars look down with cold, uncaring eyes,\nWhile thou, fair moon, dost weep in silver dew,\nA witness to the painful, quiet sighs\nOf one whose heart remains forever true.",
      "Sonnet II\n\nThe tide obeys thy soft and silent call,\nAnd rises high to touch the sandy shore,\nJust as my thoughts in rhythm rise and fall,\nTo seek thy presence at my chamber door.\n\nNo lock can hold the memory of thy grace,\nNo wall can bar the dream of thy embrace."
    ],
    pagesCount: 68
  },
  {
    id: "book-3",
    title: "Leaves of Ink",
    authorId: "auth-3",
    authorName: "Kaelen Moss",
    category: "Prose Poetry",
    price: 120,
    rating: 4.5,
    reviewsCount: 15,
    description: "Experimental prose poetry exploring urban architecture, industrial decay, and the green shoots of nature reclaimining the spaces we build.",
    coverColor: "from-stone-850 to-amber-950",
    coverPattern: "pattern-3",
    publishedDate: "2026-05-20",
    approved: true,
    previewPages: [
      "Concrete Gardens\n\nBetween the cracked slabs of pavement, a single dandelion dares to exist. It does not ask for permission. It does not seek sunlight with apology. It drinks the gray rain, digests the exhaust fumes, and explodes in brilliant, defiant yellow. We walk past it, heads bowed to our rectangular screens, ignoring the revolution happening at our feet.",
      "Neon Sleep\n\nThe streetlights flicker in a three-beat waltz. Red, amber, green. Red, amber, green. The city breathes in diesel and exhales steam. Under the bridge, someone is painting a blue horse on a concrete pillar. It runs through the dark, carrying the weight of the highway on its back, seeking a field of wild oats that has been buried for a hundred years."
    ],
    pagesCount: 92
  },
  {
    id: "book-4",
    title: "Echoes of the Silent Valley",
    authorId: "auth-1",
    authorName: "Aria Sterling",
    category: "Classical Poetry",
    price: 180,
    rating: 4.7,
    reviewsCount: 19,
    description: "Stunning lyrical reflections written during a three-month residency in an isolated mountain valley. A meditation on silence.",
    coverColor: "from-emerald-950 to-yellow-950",
    coverPattern: "pattern-4",
    publishedDate: "2026-06-01",
    approved: true,
    previewPages: [
      "The Solitary Path\n\nNo footsteps mark the dew,\nNo voices break the morning chill.\nThe mountain stands in purple hue,\nImmovable, and grand, and still.\n\nI walk because the path is there,\nI stop because the silence calls.\nA drop of frost upon the air,\nA single leaf that softly falls."
    ],
    pagesCount: 75
  },
  {
    id: "book-5",
    title: "Ink and Rain",
    authorId: "auth-2",
    authorName: "Julian Vane",
    category: "Haiku & Short Form",
    price: 100,
    rating: 4.3,
    reviewsCount: 8,
    description: "A compact collection of traditional and modern haiku capturing the atmosphere of rainy afternoons in old libraries.",
    coverColor: "from-blue-950 to-slate-800",
    coverPattern: "pattern-1",
    publishedDate: "2026-06-18",
    approved: false, // Pending Approval for testing
    previewPages: [
      "Haiku I\n\nOld pages turning,\nScent of paper and damp earth,\nRain taps on the glass.",
      "Haiku II\n\nInk bleeds on the page,\nA word half-written fades out,\nSilence in the room."
    ],
    pagesCount: 50
  }
];

export const DUMMY_ORDERS = [
  {
    id: "ord-1001",
    bookId: "book-1",
    bookTitle: "Whispers of the Wind",
    authorId: "auth-1",
    authorName: "Aria Sterling",
    readerId: "read-1",
    readerName: "Jane Doe",
    price: 150,
    commission: 30,
    earnings: 120,
    date: "2026-07-28",
    status: "Completed"
  },
  {
    id: "ord-1002",
    bookId: "book-2",
    bookTitle: "Sonnets for the Moon",
    authorId: "auth-2",
    authorName: "Julian Vane",
    readerId: "read-1",
    readerName: "Jane Doe",
    price: 200,
    commission: 40,
    earnings: 160,
    date: "2026-07-29",
    status: "Completed"
  },
  {
    id: "ord-1003",
    bookId: "book-3",
    bookTitle: "Leaves of Ink",
    authorId: "auth-3",
    authorName: "Kaelen Moss",
    readerId: "read-2",
    readerName: "Sam Smith",
    price: 120,
    commission: 24,
    earnings: 96,
    date: "2026-07-30",
    status: "Completed"
  }
];

export const DUMMY_WITHDRAWALS = [
  {
    id: "wdr-101",
    authorId: "auth-1",
    authorName: "Aria Sterling",
    amount: 1500,
    date: "2026-07-25",
    status: "Approved",
    accountDetails: "HDFC Bank A/C ending in 8892"
  },
  {
    id: "wdr-102",
    authorId: "auth-2",
    authorName: "Julian Vane",
    amount: 2500,
    date: "2026-07-31",
    status: "Pending",
    accountDetails: "SBI Bank A/C ending in 1045"
  }
];
