// src/data/flightResultsData.js

export const flightRoutes = [
  // ASIA PACIFIC ROUTES
  {
    id: 1,
    airline: "Korean Air",
    airlineCode: "KE",
    flightNumber: "KE123",
    from: { code: "GMP", city: "Seoul", airport: "Gimpo International", country: "South Korea", countryCode: "KR", terminal: "D" },
    to: { code: "CJU", city: "Jeju", airport: "Jeju International", country: "South Korea", countryCode: "KR", terminal: "1" },
    departureTime: "08:30",
    arrivalTime: "09:40",
    duration: "1h 10m",
    stops: 0,
    stopInfo: null,
    price: 185,
    cabinClass: "Economy",
    seats: 24,
    aircraft: "Boeing 737-900",
    date: "2026-03-15"
  },
  {
    id: 2,
    airline: "Asiana Airlines",
    airlineCode: "OZ",
    flightNumber: "OZ567",
    from: { code: "GMP", city: "Seoul", airport: "Gimpo International", country: "South Korea", countryCode: "KR", terminal: "D" },
    to: { code: "CJU", city: "Jeju", airport: "Jeju International", country: "South Korea", countryCode: "KR", terminal: "1" },
    departureTime: "11:45",
    arrivalTime: "12:55",
    duration: "1h 10m",
    stops: 0,
    stopInfo: null,
    price: 165,
    cabinClass: "Economy",
    seats: 18,
    aircraft: "Airbus A330-300",
    date: "2026-03-15"
  },
  {
    id: 3,
    airline: "Japan Airlines",
    airlineCode: "JL",
    flightNumber: "JL123",
    from: { code: "HND", city: "Tokyo", airport: "Haneda", country: "Japan", countryCode: "JP", terminal: "1" },
    to: { code: "CTS", city: "Sapporo", airport: "New Chitose", country: "Japan", countryCode: "JP", terminal: "D" },
    departureTime: "09:20",
    arrivalTime: "10:50",
    duration: "1h 30m",
    stops: 0,
    stopInfo: null,
    price: 210,
    cabinClass: "Economy",
    seats: 32,
    aircraft: "Boeing 787-8",
    date: "2026-03-15"
  },
  {
    id: 4,
    airline: "ANA",
    airlineCode: "NH",
    flightNumber: "NH456",
    from: { code: "HND", city: "Tokyo", airport: "Haneda", country: "Japan", countryCode: "JP", terminal: "2" },
    to: { code: "FUK", city: "Fukuoka", airport: "Fukuoka", country: "Japan", countryCode: "JP", terminal: "D" },
    departureTime: "10:30",
    arrivalTime: "12:15",
    duration: "1h 45m",
    stops: 0,
    stopInfo: null,
    price: 195,
    cabinClass: "Economy",
    seats: 28,
    aircraft: "Boeing 777-200",
    date: "2026-03-15"
  },
  {
    id: 5,
    airline: "Vietnam Airlines",
    airlineCode: "VN",
    flightNumber: "VN789",
    from: { code: "SGN", city: "Ho Chi Minh City", airport: "Tan Son Nhat", country: "Vietnam", countryCode: "VN", terminal: "1" },
    to: { code: "HAN", city: "Hanoi", airport: "Noi Bai", country: "Vietnam", countryCode: "VN", terminal: "T1" },
    departureTime: "13:40",
    arrivalTime: "15:50",
    duration: "2h 10m",
    stops: 0,
    stopInfo: null,
    price: 145,
    cabinClass: "Economy",
    seats: 42,
    aircraft: "Airbus A321",
    date: "2026-03-15"
  },
  {
    id: 6,
    airline: "Bangkok Airways",
    airlineCode: "PG",
    flightNumber: "PG901",
    from: { code: "BKK", city: "Bangkok", airport: "Suvarnabhumi", country: "Thailand", countryCode: "TH", terminal: "B" },
    to: { code: "HKT", city: "Phuket", airport: "Phuket International", country: "Thailand", countryCode: "TH", terminal: "D" },
    departureTime: "14:15",
    arrivalTime: "15:40",
    duration: "1h 25m",
    stops: 0,
    stopInfo: null,
    price: 115,
    cabinClass: "Economy",
    seats: 36,
    aircraft: "Airbus A319",
    date: "2026-03-15"
  },

  // NORTH AMERICAN ROUTES
  {
    id: 7,
    airline: "Delta Airlines",
    airlineCode: "DL",
    flightNumber: "DL452",
    from: { code: "JFK", city: "New York", airport: "John F. Kennedy International", country: "USA", countryCode: "US", terminal: "4" },
    to: { code: "LAX", city: "Los Angeles", airport: "Los Angeles International", country: "USA", countryCode: "US", terminal: "3" },
    departureTime: "08:30",
    arrivalTime: "11:40",
    duration: "6h 10m",
    stops: 0,
    stopInfo: null,
    price: 299,
    cabinClass: "Economy",
    seats: 45,
    aircraft: "Boeing 757-300",
    date: "2026-03-15"
  },
  {
    id: 8,
    airline: "American Airlines",
    airlineCode: "AA",
    flightNumber: "AA102",
    from: { code: "JFK", city: "New York", airport: "John F. Kennedy International", country: "USA", countryCode: "US", terminal: "8" },
    to: { code: "LAX", city: "Los Angeles", airport: "Los Angeles International", country: "USA", countryCode: "US", terminal: "4" },
    departureTime: "11:20",
    arrivalTime: "14:35",
    duration: "6h 15m",
    stops: 0,
    stopInfo: null,
    price: 279,
    cabinClass: "Economy",
    seats: 52,
    aircraft: "Airbus A321",
    date: "2026-03-15"
  },
  {
    id: 9,
    airline: "United Airlines",
    airlineCode: "UA",
    flightNumber: "UA389",
    from: { code: "LAX", city: "Los Angeles", airport: "Los Angeles International", country: "USA", countryCode: "US", terminal: "7" },
    to: { code: "LAS", city: "Las Vegas", airport: "McCarran International", country: "USA", countryCode: "US", terminal: "3" },
    departureTime: "09:45",
    arrivalTime: "11:00",
    duration: "1h 15m",
    stops: 0,
    stopInfo: null,
    price: 89,
    cabinClass: "Economy",
    seats: 64,
    aircraft: "Boeing 737-800",
    date: "2026-03-15"
  },
  {
    id: 10,
    airline: "Hawaiian Airlines",
    airlineCode: "HA",
    flightNumber: "HA150",
    from: { code: "HNL", city: "Honolulu", airport: "Daniel K. Inouye", country: "USA", countryCode: "US", terminal: "1" },
    to: { code: "OGG", city: "Kahului", airport: "Maui Airport", country: "USA", countryCode: "US", terminal: "2" },
    departureTime: "10:15",
    arrivalTime: "11:00",
    duration: "45m",
    stops: 0,
    stopInfo: null,
    price: 119,
    cabinClass: "Economy",
    seats: 38,
    aircraft: "Boeing 717",
    date: "2026-03-15"
  },
  {
    id: 11,
    airline: "Southwest Airlines",
    airlineCode: "WN",
    flightNumber: "WN2355",
    from: { code: "LAX", city: "Los Angeles", airport: "Los Angeles International", country: "USA", countryCode: "US", terminal: "1" },
    to: { code: "SFO", city: "San Francisco", airport: "San Francisco International", country: "USA", countryCode: "US", terminal: "2" },
    departureTime: "13:30",
    arrivalTime: "15:00",
    duration: "1h 30m",
    stops: 0,
    stopInfo: null,
    price: 105,
    cabinClass: "Economy",
    seats: 42,
    aircraft: "Boeing 737-700",
    date: "2026-03-15"
  },
  {
    id: 12,
    airline: "Alaska Airlines",
    airlineCode: "AS",
    flightNumber: "AS123",
    from: { code: "SEA", city: "Seattle", airport: "Seattle-Tacoma", country: "USA", countryCode: "US", terminal: "N" },
    to: { code: "ANC", city: "Anchorage", airport: "Ted Stevens", country: "USA", countryCode: "US", terminal: "S" },
    departureTime: "12:45",
    arrivalTime: "16:15",
    duration: "3h 30m",
    stops: 0,
    stopInfo: null,
    price: 259,
    cabinClass: "Economy",
    seats: 28,
    aircraft: "Boeing 737-900",
    date: "2026-03-15"
  },

  // EUROPEAN ROUTES
  {
    id: 13,
    airline: "Iberia",
    airlineCode: "IB",
    flightNumber: "IB888",
    from: { code: "BCN", city: "Barcelona", airport: "Barcelona-El Prat", country: "Spain", countryCode: "ES", terminal: "1" },
    to: { code: "PMI", city: "Palma", airport: "Palma de Mallorca", country: "Spain", countryCode: "ES", terminal: "A" },
    departureTime: "09:15",
    arrivalTime: "10:10",
    duration: "55m",
    stops: 0,
    stopInfo: null,
    price: 75,
    cabinClass: "Economy",
    seats: 56,
    aircraft: "Airbus A320",
    date: "2026-03-15"
  },
  {
    id: 14,
    airline: "British Airways",
    airlineCode: "BA",
    flightNumber: "BA456",
    from: { code: "LHR", city: "London", airport: "Heathrow", country: "UK", countryCode: "GB", terminal: "5" },
    to: { code: "DUB", city: "Dublin", airport: "Dublin Airport", country: "Ireland", countryCode: "IE", terminal: "2" },
    departureTime: "11:30",
    arrivalTime: "12:50",
    duration: "1h 20m",
    stops: 0,
    stopInfo: null,
    price: 145,
    cabinClass: "Economy",
    seats: 34,
    aircraft: "Airbus A320",
    date: "2026-03-15"
  },
  {
    id: 15,
    airline: "Air France",
    airlineCode: "AF",
    flightNumber: "AF770",
    from: { code: "CDG", city: "Paris", airport: "Charles de Gaulle", country: "France", countryCode: "FR", terminal: "2E" },
    to: { code: "NCE", city: "Nice", airport: "Côte d'Azur", country: "France", countryCode: "FR", terminal: "1" },
    departureTime: "10:45",
    arrivalTime: "12:15",
    duration: "1h 30m",
    stops: 0,
    stopInfo: null,
    price: 119,
    cabinClass: "Economy",
    seats: 48,
    aircraft: "Airbus A321",
    date: "2026-03-15"
  },
  {
    id: 16,
    airline: "KLM",
    airlineCode: "KL",
    flightNumber: "KL1009",
    from: { code: "AMS", city: "Amsterdam", airport: "Schiphol", country: "Netherlands", countryCode: "NL", terminal: "B" },
    to: { code: "LHR", city: "London", airport: "Heathrow", country: "UK", countryCode: "GB", terminal: "4" },
    departureTime: "14:20",
    arrivalTime: "14:30",
    duration: "1h 10m",
    stops: 0,
    stopInfo: null,
    price: 155,
    cabinClass: "Economy",
    seats: 42,
    aircraft: "Boeing 737-800",
    date: "2026-03-15"
  },
  {
    id: 17,
    airline: "Lufthansa",
    airlineCode: "LH",
    flightNumber: "LH178",
    from: { code: "FRA", city: "Frankfurt", airport: "Frankfurt Airport", country: "Germany", countryCode: "DE", terminal: "1" },
    to: { code: "BER", city: "Berlin", airport: "Berlin Brandenburg", country: "Germany", countryCode: "DE", terminal: "T1" },
    departureTime: "16:30",
    arrivalTime: "17:40",
    duration: "1h 10m",
    stops: 0,
    stopInfo: null,
    price: 135,
    cabinClass: "Economy",
    seats: 52,
    aircraft: "Airbus A320",
    date: "2026-03-15"
  },

  // MIDDLE EASTERN ROUTES
  {
    id: 18,
    airline: "Emirates",
    airlineCode: "EK",
    flightNumber: "EK923",
    from: { code: "CAI", city: "Cairo", airport: "Cairo International", country: "Egypt", countryCode: "EG", terminal: "3" },
    to: { code: "JED", city: "Jeddah", airport: "King Abdulaziz", country: "Saudi Arabia", countryCode: "SA", terminal: "H" },
    departureTime: "08:40",
    arrivalTime: "10:55",
    duration: "2h 15m",
    stops: 0,
    stopInfo: null,
    price: 225,
    cabinClass: "Economy",
    seats: 38,
    aircraft: "Boeing 777-300ER",
    date: "2026-03-15"
  },
  {
    id: 19,
    airline: "Saudia",
    airlineCode: "SV",
    flightNumber: "SV1010",
    from: { code: "JED", city: "Jeddah", airport: "King Abdulaziz", country: "Saudi Arabia", countryCode: "SA", terminal: "1" },
    to: { code: "RUH", city: "Riyadh", airport: "King Khalid", country: "Saudi Arabia", countryCode: "SA", terminal: "4" },
    departureTime: "12:15",
    arrivalTime: "13:55",
    duration: "1h 40m",
    stops: 0,
    stopInfo: null,
    price: 135,
    cabinClass: "Economy",
    seats: 44,
    aircraft: "Airbus A330-300",
    date: "2026-03-15"
  },
  {
    id: 20,
    airline: "Emirates",
    airlineCode: "EK",
    flightNumber: "EK161",
    from: { code: "DXB", city: "Dubai", airport: "Dubai International", country: "UAE", countryCode: "AE", terminal: "3" },
    to: { code: "LHR", city: "London", airport: "Heathrow", country: "UK", countryCode: "GB", terminal: "4" },
    departureTime: "07:30",
    arrivalTime: "12:00",
    duration: "7h 30m",
    stops: 0,
    stopInfo: null,
    price: 589,
    cabinClass: "Economy",
    seats: 52,
    aircraft: "Airbus A380",
    date: "2026-03-15"
  },
  {
    id: 21,
    airline: "Qatar Airways",
    airlineCode: "QR",
    flightNumber: "QR1016",
    from: { code: "DOH", city: "Doha", airport: "Hamad International", country: "Qatar", countryCode: "QA", terminal: "1" },
    to: { code: "DXB", city: "Dubai", airport: "Dubai International", country: "UAE", countryCode: "AE", terminal: "1" },
    departureTime: "15:45",
    arrivalTime: "16:55",
    duration: "1h 10m",
    stops: 0,
    stopInfo: null,
    price: 165,
    cabinClass: "Economy",
    seats: 46,
    aircraft: "Airbus A320",
    date: "2026-03-15"
  },

  // AFRICAN ROUTES
  {
    id: 22,
    airline: "South African Airways",
    airlineCode: "SA",
    flightNumber: "SA301",
    from: { code: "CPT", city: "Cape Town", airport: "Cape Town International", country: "South Africa", countryCode: "ZA", terminal: "A" },
    to: { code: "JNB", city: "Johannesburg", airport: "O.R. Tambo", country: "South Africa", countryCode: "ZA", terminal: "B" },
    departureTime: "06:15",
    arrivalTime: "08:25",
    duration: "2h 10m",
    stops: 0,
    stopInfo: null,
    price: 159,
    cabinClass: "Economy",
    seats: 42,
    aircraft: "Airbus A320",
    date: "2026-03-15"
  },
  {
    id: 23,
    airline: "EgyptAir",
    airlineCode: "MS",
    flightNumber: "MS123",
    from: { code: "CAI", city: "Cairo", airport: "Cairo International", country: "Egypt", countryCode: "EG", terminal: "3" },
    to: { code: "DXB", city: "Dubai", airport: "Dubai International", country: "UAE", countryCode: "AE", terminal: "1" },
    departureTime: "09:30",
    arrivalTime: "13:50",
    duration: "3h 20m",
    stops: 0,
    stopInfo: null,
    price: 325,
    cabinClass: "Economy",
    seats: 34,
    aircraft: "Boeing 787-9",
    date: "2026-03-15"
  },
  {
    id: 24,
    airline: "Kenya Airways",
    airlineCode: "KQ",
    flightNumber: "KQ456",
    from: { code: "NBO", city: "Nairobi", airport: "Jomo Kenyatta", country: "Kenya", countryCode: "KE", terminal: "1A" },
    to: { code: "JNB", city: "Johannesburg", airport: "O.R. Tambo", country: "South Africa", countryCode: "ZA", terminal: "A" },
    departureTime: "12:20",
    arrivalTime: "16:20",
    duration: "4h",
    stops: 0,
    stopInfo: null,
    price: 289,
    cabinClass: "Economy",
    seats: 28,
    aircraft: "Boeing 737-800",
    date: "2026-03-15"
  },

  // LONG-HAUL INTERNATIONAL
  {
    id: 25,
    airline: "British Airways",
    airlineCode: "BA",
    flightNumber: "BA178",
    from: { code: "LHR", city: "London", airport: "Heathrow", country: "UK", countryCode: "GB", terminal: "5" },
    to: { code: "JFK", city: "New York", airport: "John F. Kennedy", country: "USA", countryCode: "US", terminal: "7" },
    departureTime: "18:20",
    arrivalTime: "21:30",
    duration: "7h 10m",
    stops: 0,
    stopInfo: null,
    price: 495,
    cabinClass: "Economy",
    seats: 52,
    aircraft: "Boeing 777-200",
    date: "2026-03-15"
  },
  {
    id: 26,
    airline: "Virgin Atlantic",
    airlineCode: "VS",
    flightNumber: "VS153",
    from: { code: "LHR", city: "London", airport: "Heathrow", country: "UK", countryCode: "GB", terminal: "3" },
    to: { code: "JFK", city: "New York", airport: "John F. Kennedy", country: "USA", countryCode: "US", terminal: "4" },
    departureTime: "17:45",
    arrivalTime: "20:55",
    duration: "7h 10m",
    stops: 0,
    stopInfo: null,
    price: 475,
    cabinClass: "Economy",
    seats: 44,
    aircraft: "Airbus A330-300",
    date: "2026-03-15"
  },
  {
    id: 27,
    airline: "ANA",
    airlineCode: "NH",
    flightNumber: "NH107",
    from: { code: "HND", city: "Tokyo", airport: "Haneda", country: "Japan", countryCode: "JP", terminal: "3" },
    to: { code: "LAX", city: "Los Angeles", airport: "Los Angeles International", country: "USA", countryCode: "US", terminal: "B" },
    departureTime: "16:45",
    arrivalTime: "10:15",
    duration: "9h 30m",
    stops: 0,
    stopInfo: null,
    price: 725,
    cabinClass: "Economy",
    seats: 38,
    aircraft: "Boeing 787-9",
    date: "2026-03-16"
  },
  {
    id: 28,
    airline: "Qantas",
    airlineCode: "QF",
    flightNumber: "QF11",
    from: { code: "SYD", city: "Sydney", airport: "Kingsford Smith", country: "Australia", countryCode: "AU", terminal: "1" },
    to: { code: "LAX", city: "Los Angeles", airport: "Los Angeles International", country: "USA", countryCode: "US", terminal: "B" },
    departureTime: "10:30",
    arrivalTime: "05:30",
    duration: "14h",
    stops: 0,
    stopInfo: null,
    price: 899,
    cabinClass: "Economy",
    seats: 42,
    aircraft: "Airbus A380",
    date: "2026-03-16"
  },
  {
    id: 29,
    airline: "Singapore Airlines",
    airlineCode: "SQ",
    flightNumber: "SQ12",
    from: { code: "SIN", city: "Singapore", airport: "Changi", country: "Singapore", countryCode: "SG", terminal: "3" },
    to: { code: "NRT", city: "Tokyo", airport: "Narita", country: "Japan", countryCode: "JP", terminal: "1" },
    departureTime: "09:15",
    arrivalTime: "16:15",
    duration: "7h",
    stops: 0,
    stopInfo: null,
    price: 445,
    cabinClass: "Economy",
    seats: 48,
    aircraft: "Boeing 777-300ER",
    date: "2026-03-15"
  },
  {
    id: 30,
    airline: "Lufthansa",
    airlineCode: "LH",
    flightNumber: "LH400",
    from: { code: "FRA", city: "Frankfurt", airport: "Frankfurt Airport", country: "Germany", countryCode: "DE", terminal: "1" },
    to: { code: "JFK", city: "New York", airport: "John F. Kennedy", country: "USA", countryCode: "US", terminal: "1" },
    departureTime: "13:30",
    arrivalTime: "16:00",
    duration: "8h 30m",
    stops: 0,
    stopInfo: null,
    price: 545,
    cabinClass: "Economy",
    seats: 56,
    aircraft: "Boeing 747-8",
    date: "2026-03-15"
  },
  // ADD MORE ROUTES FOR LONDON TO DUBAI
  {
    id: 31,
    airline: "Emirates",
    airlineCode: "EK",
    flightNumber: "EK002",
    from: { code: "LHR", city: "London", airport: "Heathrow", country: "UK", countryCode: "GB", terminal: "3" },
    to: { code: "DXB", city: "Dubai", airport: "Dubai International", country: "UAE", countryCode: "AE", terminal: "3" },
    departureTime: "13:45",
    arrivalTime: "00:30",
    duration: "6h 45m",
    stops: 0,
    stopInfo: null,
    price: 529,
    cabinClass: "Economy",
    seats: 42,
    aircraft: "Airbus A380",
    date: "2026-03-15"
  },
  {
    id: 32,
    airline: "Emirates",
    airlineCode: "EK",
    flightNumber: "EK004",
    from: { code: "LHR", city: "London", airport: "Heathrow", country: "UK", countryCode: "GB", terminal: "3" },
    to: { code: "DXB", city: "Dubai", airport: "Dubai International", country: "UAE", countryCode: "AE", terminal: "3" },
    departureTime: "15:30",
    arrivalTime: "02:15",
    duration: "6h 45m",
    stops: 0,
    stopInfo: null,
    price: 549,
    cabinClass: "Economy",
    seats: 38,
    aircraft: "Airbus A380",
    date: "2026-03-15"
  },
  {
    id: 33,
    airline: "British Airways",
    airlineCode: "BA",
    flightNumber: "BA107",
    from: { code: "LHR", city: "London", airport: "Heathrow", country: "UK", countryCode: "GB", terminal: "5" },
    to: { code: "DXB", city: "Dubai", airport: "Dubai International", country: "UAE", countryCode: "AE", terminal: "1" },
    departureTime: "09:40",
    arrivalTime: "20:20",
    duration: "6h 40m",
    stops: 0,
    stopInfo: null,
    price: 489,
    cabinClass: "Economy",
    seats: 52,
    aircraft: "Boeing 777-200",
    date: "2026-03-15"
  },
  {
    id: 34,
    airline: "Qatar Airways",
    airlineCode: "QR",
    flightNumber: "QR008",
    from: { code: "LHR", city: "London", airport: "Heathrow", country: "UK", countryCode: "GB", terminal: "4" },
    to: { code: "DOH", city: "Doha", airport: "Hamad International", country: "Qatar", countryCode: "QA", terminal: "1" },
    departureTime: "15:55",
    arrivalTime: "01:20",
    duration: "6h 25m",
    stops: 0,
    stopInfo: "Connection in DOH",
    price: 445,
    cabinClass: "Economy",
    seats: 46,
    aircraft: "Boeing 787-9",
    date: "2026-03-15"
  },
  {
    id: 35,
    airline: "Qatar Airways",
    airlineCode: "QR",
    flightNumber: "QR108",
    from: { code: "DOH", city: "Doha", airport: "Hamad International", country: "Qatar", countryCode: "QA", terminal: "1" },
    to: { code: "DXB", city: "Dubai", airport: "Dubai International", country: "UAE", countryCode: "AE", terminal: "1" },
    departureTime: "02:45",
    arrivalTime: "04:55",
    duration: "1h 10m",
    stops: 1,
    stopInfo: "Via Doha",
    price: 0, // This is a connecting flight, price included in main
    cabinClass: "Economy",
    seats: 46,
    aircraft: "Airbus A320",
    date: "2026-03-16"
  },
  {
    id: 36,
    airline: "Etihad Airways",
    airlineCode: "EY",
    flightNumber: "EY012",
    from: { code: "LHR", city: "London", airport: "Heathrow", country: "UK", countryCode: "GB", terminal: "4" },
    to: { code: "AUH", city: "Abu Dhabi", airport: "Abu Dhabi International", country: "UAE", countryCode: "AE", terminal: "3" },
    departureTime: "09:30",
    arrivalTime: "20:15",
    duration: "6h 45m",
    stops: 0,
    stopInfo: "Connection in AUH",
    price: 465,
    cabinClass: "Economy",
    seats: 42,
    aircraft: "Boeing 787-9",
    date: "2026-03-15"
  },
  {
    id: 37,
    airline: "Etihad Airways",
    airlineCode: "EY",
    flightNumber: "EY018",
    from: { code: "AUH", city: "Abu Dhabi", airport: "Abu Dhabi International", country: "UAE", countryCode: "AE", terminal: "3" },
    to: { code: "DXB", city: "Dubai", airport: "Dubai International", country: "UAE", countryCode: "AE", terminal: "1" },
    departureTime: "21:30",
    arrivalTime: "22:30",
    duration: "1h",
    stops: 1,
    stopInfo: "Via Abu Dhabi",
    price: 0,
    cabinClass: "Economy",
    seats: 38,
    aircraft: "Airbus A320",
    date: "2026-03-15"
  }
];

// Helper function to filter flights by route with flexible matching
export const getFlightsByRoute = (fromQuery, toQuery) => {
  console.log(`Searching routes from "${fromQuery}" to "${toQuery}"`);
  
  // Convert queries to lowercase for case-insensitive matching
  const fromLower = fromQuery?.toLowerCase() || '';
  const toLower = toQuery?.toLowerCase() || '';
  
  return flightRoutes.filter(flight => {
    // Match FROM location (airport code, city name, country name, country code)
    const fromMatch = 
      flight.from.code.toLowerCase() === fromLower || // Exact airport code match
      flight.from.city.toLowerCase() === fromLower || // Exact city name match
      flight.from.country.toLowerCase() === fromLower || // Exact country name match
      flight.from.countryCode?.toLowerCase() === fromLower || // Country code match (US, UK, etc.)
      flight.from.city.toLowerCase().includes(fromLower) || // City contains search term
      flight.from.country.toLowerCase().includes(fromLower) || // Country contains search term
      flight.from.airport.toLowerCase().includes(fromLower); // Airport name contains search term
    
    // Match TO location (airport code, city name, country name, country code)
    const toMatch = 
      flight.to.code.toLowerCase() === toLower || // Exact airport code match
      flight.to.city.toLowerCase() === toLower || // Exact city name match
      flight.to.country.toLowerCase() === toLower || // Exact country name match
      flight.to.countryCode?.toLowerCase() === toLower || // Country code match (US, UK, etc.)
      flight.to.city.toLowerCase().includes(toLower) || // City contains search term
      flight.to.country.toLowerCase().includes(toLower) || // Country contains search term
      flight.to.airport.toLowerCase().includes(toLower); // Airport name contains search term
    
    return fromMatch && toMatch;
  });
};

// Helper function to get flights by country (all flights from/to a specific country)
export const getFlightsByCountry = (countryQuery) => {
  const countryLower = countryQuery?.toLowerCase() || '';
  
  return flightRoutes.filter(flight => 
    flight.from.country.toLowerCase().includes(countryLower) ||
    flight.to.country.toLowerCase().includes(countryLower) ||
    flight.from.countryCode?.toLowerCase() === countryLower ||
    flight.to.countryCode?.toLowerCase() === countryLower
  );
};

// Helper function to get all unique routes
export const getAllRoutes = () => {
  const routes = {};
  flightRoutes.forEach(flight => {
    const key = `${flight.from.code}-${flight.to.code}`;
    if (!routes[key]) {
      routes[key] = {
        from: flight.from,
        to: flight.to,
        count: 1,
        fromCountry: flight.from.country,
        toCountry: flight.to.country
      };
    } else {
      routes[key].count++;
    }
  });
  return Object.values(routes);
};

// Enhanced getPopularDestinations function
export const getPopularDestinations = () => {
  const uniqueRoutes = [];
  const seen = new Set();
  
  // Expanded list of popular destination cities
  const popularCities = [
    'London', 'Tokyo', 'Dubai', 'Sydney', 
    'Paris', 'New York', 'Los Angeles', 'San Francisco',
    'Bangkok', 'Singapore', 'Rome', 'Barcelona',
    'Istanbul', 'Hong Kong', 'Seoul', 'Amsterdam'
  ];
  
  // Sort flights to prioritize popular destinations
  const sortedFlights = [...flightRoutes].sort((a, b) => {
    const aPopular = popularCities.includes(a.to.city) ? -1 : 1;
    const bPopular = popularCities.includes(b.to.city) ? -1 : 1;
    return aPopular - bPopular;
  });
  
  sortedFlights.forEach(flight => {
    const key = `${flight.from.code}-${flight.to.code}`;
    if (!seen.has(key) && uniqueRoutes.length < 12) { // Increased to 12
      seen.add(key);
      uniqueRoutes.push({
        id: uniqueRoutes.length + 1,
        from: flight.from,
        to: flight.to,
        fromCity: flight.from.city,
        toCity: flight.to.city,
        fromCode: flight.from.code,
        toCode: flight.to.code,
        fromCountry: flight.from.country,
        toCountry: flight.to.country,
        price: flight.price
      });
    }
  });
  
  return uniqueRoutes;
};


// Helper function to get emoji for country
const getEmojiForRoute = (country) => {
  const emojiMap = {
    'South Korea': '🇰🇷',
    'Japan': '🇯🇵',
    'USA': '🇺🇸',
    'Vietnam': '🇻🇳',
    'Thailand': '🇹🇭',
    'Spain': '🇪🇸',
    'UK': '🇬🇧',
    'France': '🇫🇷',
    'Netherlands': '🇳🇱',
    'Germany': '🇩🇪',
    'Egypt': '🇪🇬',
    'Saudi Arabia': '🇸🇦',
    'UAE': '🇦🇪',
    'Qatar': '🇶🇦',
    'South Africa': '🇿🇦',
    'Kenya': '🇰🇪',
    'Australia': '🇦🇺',
    'Singapore': '🇸🇬',
    'Ireland': '🇮🇪',
    'Canada': '🇨🇦'
  };
  return emojiMap[country] || '🌍';
};

// Helper function to get all unique countries in the database
export const getAllCountries = () => {
  const countries = new Set();
  flightRoutes.forEach(flight => {
    countries.add(flight.from.country);
    countries.add(flight.to.country);
  });
  return Array.from(countries).sort();
};