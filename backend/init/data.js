const sampleListings = [
  {
    title: "Taj Mahal Palace Hotel",
    description: "Historic luxury hotel with sweeping views of the Arabian Sea, elegant rooms and world-class service.",
    Image: {
      url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      filename: "taj-mahal-palace"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80", filename: "taj-mahal-palace-1" },
      { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", filename: "taj-mahal-palace-2" }
    ],
    price: 12000,
    location: "Colaba",
    country: "India",
    category: "City",
    roomType: "Deluxe Room",
    totalRooms: 25,
    availableRooms: 9,
    geometry: {
      type: "Point",
      coordinates: [72.8204, 18.9220]
    }
  },
  {
    title: "The Leela Palace New Delhi",
    description: "Opulent palace hotel near diplomatic enclave with panoramic city views, lavish suites and signature dining.",
    Image: {
      url: "https://images.unsplash.com/photo-1533777324565-a040eb52fac2?auto=format&fit=crop&w=1200&q=80",
      filename: "leela-palace-delhi"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1533777324565-a040eb52fac2?auto=format&fit=crop&w=1200&q=80", filename: "leela-palace-delhi-1" },
      { url: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=1200&q=80", filename: "leela-palace-delhi-2" }
    ],
    price: 9500,
    location: "Chanakyapuri",
    country: "India",
    category: "City",
    roomType: "Luxury Suite",
    totalRooms: 30,
    availableRooms: 11,
    geometry: {
      type: "Point",
      coordinates: [77.1670, 28.6013]
    }
  },
  {
    title: "Oberoi Udaivilas",
    description: "Royal lakeside resort with heritage architecture, private courtyards and scenic views of Lake Pichola.",
    Image: {
      url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      filename: "oberoi-udaivilas"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", filename: "oberoi-udaivilas-1" },
      { url: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1200&q=80", filename: "oberoi-udaivilas-2" }
    ],
    price: 14000,
    location: "Udaipur",
    country: "India",
    category: "Heritage",
    roomType: "Court Room",
    totalRooms: 20,
    availableRooms: 5,
    geometry: {
      type: "Point",
      coordinates: [73.6804, 24.5768]
    }
  },
  {
    title: "Alila Diwa Goa",
    description: "Tranquil resort in scenic South Goa with spacious rooms, rice-paddy views and a private pool experience.",
    Image: {
      url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      filename: "alila-diwa-goa"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80", filename: "alila-diwa-goa-1" },
      { url: "https://images.unsplash.com/photo-1524777314-02b9e39f87f5?auto=format&fit=crop&w=1200&q=80", filename: "alila-diwa-goa-2" }
    ],
    price: 7800,
    location: "Majorda Beach",
    country: "India",
    category: "Beach",
    roomType: "Pool View Room",
    totalRooms: 22,
    availableRooms: 7,
    geometry: {
      type: "Point",
      coordinates: [73.9149, 15.2880]
    }
  },
  {
    title: "Taj Lake Palace",
    description: "Iconic heritage hotel floating on Lake Pichola, offering landmark luxury and panoramic palace views.",
    Image: {
      url: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=1200&q=80",
      filename: "taj-lake-palace"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=1200&q=80", filename: "taj-lake-palace-1" },
      { url: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80", filename: "taj-lake-palace-2" }
    ],
    price: 16000,
    location: "Udaipur",
    country: "India",
    category: "Heritage",
    roomType: "Heritage Suite",
    totalRooms: 18,
    availableRooms: 4,
    geometry: {
      type: "Point",
      coordinates: [73.6482, 24.5755]
    }
  },
  {
    title: "The Leela Kovalam",
    description: "Cliff-top beach resort in Kerala with private cabanas, ayurvedic spa treatments and sweeping sea views.",
    Image: {
      url: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1200&q=80",
      filename: "leela-kovalam"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1200&q=80", filename: "leela-kovalam-1" },
      { url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80", filename: "leela-kovalam-2" }
    ],
    price: 8500,
    location: "Kovalam",
    country: "India",
    category: "Beach",
    roomType: "Sea View Suite",
    totalRooms: 24,
    availableRooms: 10,
    geometry: {
      type: "Point",
      coordinates: [76.9756, 8.4119]
    }
  },
  {
    title: "The Oberoi Vanyavilas",
    description: "Luxury tented resort near Ranthambore, perfect for wildlife safaris and elegant jungle stays.",
    Image: {
      url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      filename: "oberoi-vanyavilas"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", filename: "oberoi-vanyavilas-1" },
      { url: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=1200&q=80", filename: "oberoi-vanyavilas-2" }
    ],
    price: 11000,
    location: "Ranthambore",
    country: "India",
    category: "Forest",
    roomType: "Luxury Tent",
    totalRooms: 16,
    availableRooms: 6,
    geometry: {
      type: "Point",
      coordinates: [76.5026, 26.0173]
    }
  },
  {
    title: "Rambagh Palace",
    description: "Grand palace hotel in Jaipur with royal interiors, sprawling gardens and signature dining.",
    Image: {
      url: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1200&q=80",
      filename: "rambagh-palace"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1200&q=80", filename: "rambagh-palace-1" },
      { url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80", filename: "rambagh-palace-2" }
    ],
    price: 12500,
    location: "Jaipur",
    country: "India",
    category: "Heritage",
    roomType: "Heritage Room",
    totalRooms: 20,
    availableRooms: 8,
    geometry: {
      type: "Point",
      coordinates: [75.8068, 26.9190]
    }
  },
  {
    title: "Wildflower Hall, Shimla",
    description: "Mountain resort in the Himalayas with cozy rooms, pine forest views and crisp fresh air.",
    Image: {
      url: "https://images.unsplash.com/photo-1526662092013-493e106629c5?auto=format&fit=crop&w=1200&q=80",
      filename: "wildflower-hall"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1526662092013-493e106629c5?auto=format&fit=crop&w=1200&q=80", filename: "wildflower-hall-1" },
      { url: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=1200&q=80", filename: "wildflower-hall-2" }
    ],
    price: 7200,
    location: "Shimla",
    country: "India",
    category: "Mountain",
    roomType: "Deluxe Mountain View",
    totalRooms: 18,
    availableRooms: 7,
    geometry: {
      type: "Point",
      coordinates: [77.1734, 31.1048]
    }
  },
  {
    title: "The Fern Gir Forest Resort",
    description: "Eco-friendly villa retreat near Gir National Park with open terraces, wildlife vibes and warm hospitality.",
    Image: {
      url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      filename: "fern-gir-forest"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80", filename: "fern-gir-forest-1" },
      { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80", filename: "fern-gir-forest-2" }
    ],
    price: 6800,
    location: "Gir",
    country: "India",
    category: "Forest",
    roomType: "Forest Villa",
    totalRooms: 12,
    availableRooms: 5,
    geometry: {
      type: "Point",
      coordinates: [70.9218, 21.1200]
    }
  }
];

module.exports = { data: sampleListings };
