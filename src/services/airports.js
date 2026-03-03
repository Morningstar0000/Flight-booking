// src/utils/airport.js

export const airportDatabase = [
  // USA - Major Airports
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International', city: 'Atlanta', country: 'USA', lat: 33.6407, lng: -84.4277, type: 'AIRPORT' },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'USA', lat: 33.9416, lng: -118.4085, type: 'AIRPORT' },
  { code: 'ORD', name: 'O\'Hare International', city: 'Chicago', country: 'USA', lat: 41.9742, lng: -87.9073, type: 'AIRPORT' },
  { code: 'DFW', name: 'Dallas/Fort Worth International', city: 'Dallas', country: 'USA', lat: 32.8998, lng: -97.0403, type: 'AIRPORT' },
  { code: 'DEN', name: 'Denver International', city: 'Denver', country: 'USA', lat: 39.8561, lng: -104.6737, type: 'AIRPORT' },
  { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'USA', lat: 40.6413, lng: -73.7781, type: 'AIRPORT' },
  { code: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'USA', lat: 37.6213, lng: -122.3790, type: 'AIRPORT' },
  { code: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle', country: 'USA', lat: 47.4502, lng: -122.3088, type: 'AIRPORT' },
  { code: 'LAS', name: 'McCarran International', city: 'Las Vegas', country: 'USA', lat: 36.0840, lng: -115.1537, type: 'AIRPORT' },
  { code: 'MCO', name: 'Orlando International', city: 'Orlando', country: 'USA', lat: 28.4312, lng: -81.3081, type: 'AIRPORT' },
  { code: 'EWR', name: 'Newark Liberty International', city: 'Newark', country: 'USA', lat: 40.6895, lng: -74.1745, type: 'AIRPORT' },
  { code: 'MIA', name: 'Miami International', city: 'Miami', country: 'USA', lat: 25.7932, lng: -80.2906, type: 'AIRPORT' },
  { code: 'CLT', name: 'Charlotte Douglas International', city: 'Charlotte', country: 'USA', lat: 35.2140, lng: -80.9431, type: 'AIRPORT' },
  { code: 'PHX', name: 'Phoenix Sky Harbor International', city: 'Phoenix', country: 'USA', lat: 33.4343, lng: -112.0116, type: 'AIRPORT' },
  { code: 'IAH', name: 'George Bush Intercontinental', city: 'Houston', country: 'USA', lat: 29.9844, lng: -95.3414, type: 'AIRPORT' },
  { code: 'BOS', name: 'Logan International', city: 'Boston', country: 'USA', lat: 42.3656, lng: -71.0096, type: 'AIRPORT' },
  { code: 'MSP', name: 'Minneapolis-St. Paul International', city: 'Minneapolis', country: 'USA', lat: 44.8820, lng: -93.2218, type: 'AIRPORT' },
  { code: 'FLL', name: 'Fort Lauderdale-Hollywood International', city: 'Fort Lauderdale', country: 'USA', lat: 26.0742, lng: -80.1506, type: 'AIRPORT' },
  { code: 'DTW', name: 'Detroit Metropolitan', city: 'Detroit', country: 'USA', lat: 42.2121, lng: -83.3534, type: 'AIRPORT' },
  { code: 'PHL', name: 'Philadelphia International', city: 'Philadelphia', country: 'USA', lat: 39.8744, lng: -75.2424, type: 'AIRPORT' },
  { code: 'HNL', name: 'Daniel K. Inouye International', city: 'Honolulu', country: 'USA', lat: 21.3187, lng: -157.9224, type: 'AIRPORT' },
  { code: 'OGG', name: 'Maui Airport', city: 'Kahului', country: 'USA', lat: 20.8987, lng: -156.4305, type: 'AIRPORT' },
  { code: 'ANC', name: 'Ted Stevens Anchorage International', city: 'Anchorage', country: 'USA', lat: 61.1744, lng: -149.9962, type: 'AIRPORT' },
  
  // UK
  { code: 'LHR', name: 'London Heathrow', city: 'London', country: 'UK', lat: 51.4700, lng: -0.4543, type: 'AIRPORT' },
  { code: 'LGW', name: 'London Gatwick', city: 'London', country: 'UK', lat: 51.1537, lng: -0.1821, type: 'AIRPORT' },
  { code: 'STN', name: 'London Stansted', city: 'London', country: 'UK', lat: 51.8850, lng: 0.2350, type: 'AIRPORT' },
  { code: 'LTN', name: 'London Luton', city: 'London', country: 'UK', lat: 51.8744, lng: -0.3683, type: 'AIRPORT' },
  { code: 'MAN', name: 'Manchester Airport', city: 'Manchester', country: 'UK', lat: 53.3538, lng: -2.2749, type: 'AIRPORT' },
  { code: 'BHX', name: 'Birmingham Airport', city: 'Birmingham', country: 'UK', lat: 52.4538, lng: -1.7480, type: 'AIRPORT' },
  { code: 'GLA', name: 'Glasgow Airport', city: 'Glasgow', country: 'UK', lat: 55.8719, lng: -4.4331, type: 'AIRPORT' },
  { code: 'EDI', name: 'Edinburgh Airport', city: 'Edinburgh', country: 'UK', lat: 55.9500, lng: -3.3725, type: 'AIRPORT' },
  
  // Canada
  { code: 'YYZ', name: 'Toronto Pearson International', city: 'Toronto', country: 'Canada', lat: 43.6777, lng: -79.6248, type: 'AIRPORT' },
  { code: 'YVR', name: 'Vancouver International', city: 'Vancouver', country: 'Canada', lat: 49.1967, lng: -123.1815, type: 'AIRPORT' },
  { code: 'YUL', name: 'Montréal-Trudeau International', city: 'Montreal', country: 'Canada', lat: 45.4706, lng: -73.7408, type: 'AIRPORT' },
  { code: 'YYC', name: 'Calgary International', city: 'Calgary', country: 'Canada', lat: 51.1215, lng: -114.0078, type: 'AIRPORT' },
  
  // Australia
  { code: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia', lat: -33.9399, lng: 151.1753, type: 'AIRPORT' },
  { code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia', lat: -37.6733, lng: 144.8433, type: 'AIRPORT' },
  { code: 'BNE', name: 'Brisbane Airport', city: 'Brisbane', country: 'Australia', lat: -27.3842, lng: 153.1175, type: 'AIRPORT' },
  { code: 'PER', name: 'Perth Airport', city: 'Perth', country: 'Australia', lat: -31.9403, lng: 115.9669, type: 'AIRPORT' },
  
  // Japan
  { code: 'HND', name: 'Tokyo Haneda', city: 'Tokyo', country: 'Japan', lat: 35.5494, lng: 139.7798, type: 'AIRPORT' },
  { code: 'NRT', name: 'Narita International', city: 'Tokyo', country: 'Japan', lat: 35.7720, lng: 140.3929, type: 'AIRPORT' },
  { code: 'KIX', name: 'Kansai International', city: 'Osaka', country: 'Japan', lat: 34.4349, lng: 135.2441, type: 'AIRPORT' },
  { code: 'CTS', name: 'New Chitose Airport', city: 'Sapporo', country: 'Japan', lat: 42.7758, lng: 141.6923, type: 'AIRPORT' },
  { code: 'FUK', name: 'Fukuoka Airport', city: 'Fukuoka', country: 'Japan', lat: 33.5869, lng: 130.4507, type: 'AIRPORT' },
  
  // UAE
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE', lat: 25.2532, lng: 55.3657, type: 'AIRPORT' },
  { code: 'AUH', name: 'Abu Dhabi International', city: 'Abu Dhabi', country: 'UAE', lat: 24.4333, lng: 54.6511, type: 'AIRPORT' },
  
  // France
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France', lat: 49.0097, lng: 2.5479, type: 'AIRPORT' },
  { code: 'ORY', name: 'Orly Airport', city: 'Paris', country: 'France', lat: 48.7262, lng: 2.3652, type: 'AIRPORT' },
  { code: 'NCE', name: 'Nice Côte d\'Azur', city: 'Nice', country: 'France', lat: 43.6654, lng: 7.2151, type: 'AIRPORT' },
  
  // Germany
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', lat: 50.0379, lng: 8.5622, type: 'AIRPORT' },
  { code: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany', lat: 48.3538, lng: 11.7861, type: 'AIRPORT' },
  { code: 'BER', name: 'Berlin Brandenburg', city: 'Berlin', country: 'Germany', lat: 52.3667, lng: 13.5033, type: 'AIRPORT' },
  
  // Italy
  { code: 'FCO', name: 'Leonardo da Vinci International', city: 'Rome', country: 'Italy', lat: 41.8045, lng: 12.2508, type: 'AIRPORT' },
  { code: 'MXP', name: 'Malpensa Airport', city: 'Milan', country: 'Italy', lat: 45.6301, lng: 8.7282, type: 'AIRPORT' },
  
  // Spain
  { code: 'MAD', name: 'Adolfo Suárez Madrid–Barajas', city: 'Madrid', country: 'Spain', lat: 40.4937, lng: -3.5668, type: 'AIRPORT' },
  { code: 'BCN', name: 'Barcelona–El Prat', city: 'Barcelona', country: 'Spain', lat: 41.2974, lng: 2.0833, type: 'AIRPORT' },
  { code: 'PMI', name: 'Palma de Mallorca Airport', city: 'Palma', country: 'Spain', lat: 39.5535, lng: 2.7316, type: 'AIRPORT' },
  
  // China
  { code: 'PEK', name: 'Beijing Capital International', city: 'Beijing', country: 'China', lat: 40.0799, lng: 116.6031, type: 'AIRPORT' },
  { code: 'PVG', name: 'Shanghai Pudong International', city: 'Shanghai', country: 'China', lat: 31.1443, lng: 121.8083, type: 'AIRPORT' },
  { code: 'HKG', name: 'Hong Kong International', city: 'Hong Kong', country: 'China', lat: 22.3080, lng: 113.9185, type: 'AIRPORT' },
  
  // India
  { code: 'DEL', name: 'Indira Gandhi International', city: 'New Delhi', country: 'India', lat: 28.5562, lng: 77.1000, type: 'AIRPORT' },
  { code: 'BOM', name: 'Chhatrapati Shivaji International', city: 'Mumbai', country: 'India', lat: 19.0896, lng: 72.8656, type: 'AIRPORT' },
  
  // Brazil
  { code: 'GRU', name: 'São Paulo–Guarulhos International', city: 'Sao Paulo', country: 'Brazil', lat: -23.4256, lng: -46.4818, type: 'AIRPORT' },
  { code: 'GIG', name: 'Rio de Janeiro–Galeão International', city: 'Rio de Janeiro', country: 'Brazil', lat: -22.8092, lng: -43.2506, type: 'AIRPORT' },
  
  // Mexico
  { code: 'MEX', name: 'Mexico City International', city: 'Mexico City', country: 'Mexico', lat: 19.4361, lng: -99.0719, type: 'AIRPORT' },
  { code: 'CUN', name: 'Cancún International', city: 'Cancun', country: 'Mexico', lat: 21.0365, lng: -86.8771, type: 'AIRPORT' },
  
  // South Africa
  { code: 'JNB', name: 'O.R. Tambo International', city: 'Johannesburg', country: 'South Africa', lat: -26.1392, lng: 28.2460, type: 'AIRPORT' },
  { code: 'CPT', name: 'Cape Town International', city: 'Cape Town', country: 'South Africa', lat: -33.9715, lng: 18.6047, type: 'AIRPORT' },
  
  // Netherlands
  { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', lat: 52.3105, lng: 4.7683, type: 'AIRPORT' },
  
  // Switzerland
  { code: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', lat: 47.4582, lng: 8.5480, type: 'AIRPORT' },
  { code: 'GVA', name: 'Geneva Airport', city: 'Geneva', country: 'Switzerland', lat: 46.2294, lng: 6.1089, type: 'AIRPORT' },
  
  // Singapore
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', lat: 1.3644, lng: 103.9915, type: 'AIRPORT' },
  
  // South Korea
  { code: 'ICN', name: 'Incheon International', city: 'Seoul', country: 'South Korea', lat: 37.4602, lng: 126.4407, type: 'AIRPORT' },
  { code: 'GMP', name: 'Gimpo International', city: 'Seoul', country: 'South Korea', lat: 37.5587, lng: 126.7945, type: 'AIRPORT' },
  { code: 'CJU', name: 'Jeju International', city: 'Jeju', country: 'South Korea', lat: 33.5121, lng: 126.4929, type: 'AIRPORT' },
  
  // Thailand
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', lat: 13.6900, lng: 100.7501, type: 'AIRPORT' },
  { code: 'HKT', name: 'Phuket International', city: 'Phuket', country: 'Thailand', lat: 8.1132, lng: 98.3169, type: 'AIRPORT' },
  
  // Turkey
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', lat: 41.2753, lng: 28.7519, type: 'AIRPORT' },
  
  // Ireland
  { code: 'DUB', name: 'Dublin Airport', city: 'Dublin', country: 'Ireland', lat: 53.4214, lng: -6.2700, type: 'AIRPORT' },
  
  // Portugal
  { code: 'LIS', name: 'Lisbon Airport', city: 'Lisbon', country: 'Portugal', lat: 38.7742, lng: -9.1342, type: 'AIRPORT' },
  
  // QATAR
  { code: 'DOH', name: 'Hamad International', city: 'Doha', country: 'Qatar', lat: 25.2731, lng: 51.6081, type: 'AIRPORT' },
  
  // EGYPT
  { code: 'CAI', name: 'Cairo International', city: 'Cairo', country: 'Egypt', lat: 30.1219, lng: 31.4056, type: 'AIRPORT' },
  
  // SAUDI ARABIA
  { code: 'JED', name: 'King Abdulaziz International', city: 'Jeddah', country: 'Saudi Arabia', lat: 21.6796, lng: 39.1565, type: 'AIRPORT' },
  { code: 'RUH', name: 'King Khalid International', city: 'Riyadh', country: 'Saudi Arabia', lat: 24.9576, lng: 46.6988, type: 'AIRPORT' },
  { code: 'DMM', name: 'King Fahd International', city: 'Dammam', country: 'Saudi Arabia', lat: 26.4711, lng: 49.7978, type: 'AIRPORT' },
  { code: 'MED', name: 'Prince Mohammad Bin Abdulaziz', city: 'Medina', country: 'Saudi Arabia', lat: 24.5533, lng: 39.7050, type: 'AIRPORT' },
  
  // KENYA
  { code: 'NBO', name: 'Jomo Kenyatta International', city: 'Nairobi', country: 'Kenya', lat: -1.3192, lng: 36.9278, type: 'AIRPORT' },
  { code: 'MBA', name: 'Moi International', city: 'Mombasa', country: 'Kenya', lat: -4.0348, lng: 39.5942, type: 'AIRPORT' },
  
  // VIETNAM
  { code: 'SGN', name: 'Tan Son Nhat International', city: 'Ho Chi Minh City', country: 'Vietnam', lat: 10.8188, lng: 106.6520, type: 'AIRPORT' },
  { code: 'HAN', name: 'Noi Bai International', city: 'Hanoi', country: 'Vietnam', lat: 21.2212, lng: 105.8072, type: 'AIRPORT' },
  { code: 'DAD', name: 'Da Nang International', city: 'Da Nang', country: 'Vietnam', lat: 16.0544, lng: 108.2022, type: 'AIRPORT' },
  
  // AUSTRIA
  { code: 'VIE', name: 'Vienna International', city: 'Vienna', country: 'Austria', lat: 48.1102, lng: 16.5697, type: 'AIRPORT' },
  
  // BELGIUM
  { code: 'BRU', name: 'Brussels Airport', city: 'Brussels', country: 'Belgium', lat: 50.9014, lng: 4.4844, type: 'AIRPORT' },
  
  // DENMARK
  { code: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'Denmark', lat: 55.6180, lng: 12.6508, type: 'AIRPORT' },
  
  // FINLAND
  { code: 'HEL', name: 'Helsinki Airport', city: 'Helsinki', country: 'Finland', lat: 60.3172, lng: 24.9633, type: 'AIRPORT' },
  
  // GREECE
  { code: 'ATH', name: 'Athens International', city: 'Athens', country: 'Greece', lat: 37.9364, lng: 23.9445, type: 'AIRPORT' },
  { code: 'SKG', name: 'Thessaloniki Airport', city: 'Thessaloniki', country: 'Greece', lat: 40.5197, lng: 22.9709, type: 'AIRPORT' },
  
  // ICELAND
  { code: 'KEF', name: 'Keflavík International', city: 'Reykjavik', country: 'Iceland', lat: 63.9850, lng: -22.6056, type: 'AIRPORT' },
  
  // INDONESIA
  { code: 'CGK', name: 'Soekarno-Hatta International', city: 'Jakarta', country: 'Indonesia', lat: -6.1275, lng: 106.6537, type: 'AIRPORT' },
  { code: 'DPS', name: 'Ngurah Rai International', city: 'Denpasar', country: 'Indonesia', lat: -8.7481, lng: 115.1675, type: 'AIRPORT' },
  { code: 'SUB', name: 'Juanda International', city: 'Surabaya', country: 'Indonesia', lat: -7.3798, lng: 112.7869, type: 'AIRPORT' },
  
  // ISRAEL
  { code: 'TLV', name: 'Ben Gurion Airport', city: 'Tel Aviv', country: 'Israel', lat: 32.0055, lng: 34.8854, type: 'AIRPORT' },
  
  // MALAYSIA
  { code: 'KUL', name: 'Kuala Lumpur International', city: 'Kuala Lumpur', country: 'Malaysia', lat: 2.7456, lng: 101.7099, type: 'AIRPORT' },
  { code: 'PEN', name: 'Penang International', city: 'George Town', country: 'Malaysia', lat: 5.2971, lng: 100.2768, type: 'AIRPORT' },
  
  // NEW ZEALAND
  { code: 'AKL', name: 'Auckland Airport', city: 'Auckland', country: 'New Zealand', lat: -37.0082, lng: 174.7850, type: 'AIRPORT' },
  { code: 'CHC', name: 'Christchurch Airport', city: 'Christchurch', country: 'New Zealand', lat: -43.4894, lng: 172.5322, type: 'AIRPORT' },
  { code: 'WLG', name: 'Wellington International', city: 'Wellington', country: 'New Zealand', lat: -41.3272, lng: 174.8050, type: 'AIRPORT' },
  
  // NORWAY
  { code: 'OSL', name: 'Oslo Airport', city: 'Oslo', country: 'Norway', lat: 60.1939, lng: 11.1004, type: 'AIRPORT' },
  { code: 'BGO', name: 'Bergen Airport', city: 'Bergen', country: 'Norway', lat: 60.2928, lng: 5.2181, type: 'AIRPORT' },
  
  // PHILIPPINES
  { code: 'MNL', name: 'Ninoy Aquino International', city: 'Manila', country: 'Philippines', lat: 14.5086, lng: 121.0194, type: 'AIRPORT' },
  { code: 'CEB', name: 'Mactan-Cebu International', city: 'Cebu', country: 'Philippines', lat: 10.3093, lng: 123.9794, type: 'AIRPORT' },
  { code: 'DVO', name: 'Francisco Bangoy International', city: 'Davao', country: 'Philippines', lat: 7.1255, lng: 125.6460, type: 'AIRPORT' },
  
  // POLAND
  { code: 'WAW', name: 'Warsaw Chopin Airport', city: 'Warsaw', country: 'Poland', lat: 52.1657, lng: 20.9671, type: 'AIRPORT' },
  { code: 'KRK', name: 'Kraków John Paul II', city: 'Krakow', country: 'Poland', lat: 50.0777, lng: 19.7848, type: 'AIRPORT' },
  
  // RUSSIA
  { code: 'SVO', name: 'Sheremetyevo International', city: 'Moscow', country: 'Russia', lat: 55.9726, lng: 37.4146, type: 'AIRPORT' },
  { code: 'DME', name: 'Domodedovo International', city: 'Moscow', country: 'Russia', lat: 55.4102, lng: 37.9025, type: 'AIRPORT' },
  { code: 'LED', name: 'Pulkovo Airport', city: 'St. Petersburg', country: 'Russia', lat: 59.8003, lng: 30.2625, type: 'AIRPORT' },
  
  // SWEDEN
  { code: 'ARN', name: 'Stockholm Arlanda', city: 'Stockholm', country: 'Sweden', lat: 59.6498, lng: 17.9239, type: 'AIRPORT' },
  { code: 'GOT', name: 'Göteborg Landvetter', city: 'Gothenburg', country: 'Sweden', lat: 57.6628, lng: 12.2798, type: 'AIRPORT' },
  
  // TAIWAN
  { code: 'TPE', name: 'Taiwan Taoyuan International', city: 'Taipei', country: 'Taiwan', lat: 25.0777, lng: 121.2322, type: 'AIRPORT' },
  { code: 'TSA', name: 'Taipei Songshan', city: 'Taipei', country: 'Taiwan', lat: 25.0697, lng: 121.5525, type: 'AIRPORT' },
  
  // UKRAINE
  { code: 'KBP', name: 'Boryspil International', city: 'Kyiv', country: 'Ukraine', lat: 50.3450, lng: 30.8947, type: 'AIRPORT' },
  
  // ARGENTINA
  { code: 'EZE', name: 'Ministro Pistarini', city: 'Buenos Aires', country: 'Argentina', lat: -34.8222, lng: -58.5358, type: 'AIRPORT' },
  { code: 'AEP', name: 'Jorge Newbery', city: 'Buenos Aires', country: 'Argentina', lat: -34.5592, lng: -58.4156, type: 'AIRPORT' },
  
  // CHILE
  { code: 'SCL', name: 'Arturo Merino Benítez', city: 'Santiago', country: 'Chile', lat: -33.3930, lng: -70.7858, type: 'AIRPORT' },
  
  // COLOMBIA
  { code: 'BOG', name: 'El Dorado International', city: 'Bogotá', country: 'Colombia', lat: 4.7016, lng: -74.1469, type: 'AIRPORT' },
  { code: 'MDE', name: 'José María Córdova', city: 'Medellín', country: 'Colombia', lat: 6.1645, lng: -75.4231, type: 'AIRPORT' },
  
  // PERU
  { code: 'LIM', name: 'Jorge Chávez International', city: 'Lima', country: 'Peru', lat: -12.0219, lng: -77.1143, type: 'AIRPORT' },
  { code: 'CUZ', name: 'Alejandro Velasco Astete', city: 'Cusco', country: 'Peru', lat: -13.5357, lng: -71.9388, type: 'AIRPORT' },
  
  // NIGERIA
  { code: 'LOS', name: 'Murtala Muhammed International', city: 'Lagos', country: 'Nigeria', lat: 6.5774, lng: 3.3211, type: 'AIRPORT' },
  { code: 'ABV', name: 'Nnamdi Azikiwe International', city: 'Abuja', country: 'Nigeria', lat: 9.0068, lng: 7.2632, type: 'AIRPORT' },
  
  // MOROCCO
  { code: 'CMN', name: 'Mohammed V International', city: 'Casablanca', country: 'Morocco', lat: 33.3675, lng: -7.5898, type: 'AIRPORT' },
  { code: 'RAK', name: 'Marrakech Menara', city: 'Marrakech', country: 'Morocco', lat: 31.6069, lng: -8.0363, type: 'AIRPORT' },
  
  // JORDAN
  { code: 'AMM', name: 'Queen Alia International', city: 'Amman', country: 'Jordan', lat: 31.7225, lng: 35.9933, type: 'AIRPORT' },
  
  // LEBANON
  { code: 'BEY', name: 'Beirut–Rafic Hariri International', city: 'Beirut', country: 'Lebanon', lat: 33.8209, lng: 35.4884, type: 'AIRPORT' },
  
  // KUWAIT
  { code: 'KWI', name: 'Kuwait International', city: 'Kuwait City', country: 'Kuwait', lat: 29.2266, lng: 47.9689, type: 'AIRPORT' },
  
  // BAHRAIN
  { code: 'BAH', name: 'Bahrain International', city: 'Manama', country: 'Bahrain', lat: 26.2708, lng: 50.6336, type: 'AIRPORT' },
  
  // OMAN
  { code: 'MCT', name: 'Muscat International', city: 'Muscat', country: 'Oman', lat: 23.5933, lng: 58.2844, type: 'AIRPORT' },
  
  // SRI LANKA
  { code: 'CMB', name: 'Bandaranaike International', city: 'Colombo', country: 'Sri Lanka', lat: 7.1811, lng: 79.8837, type: 'AIRPORT' },
  
  // BANGLADESH
  { code: 'DAC', name: 'Shahjalal International', city: 'Dhaka', country: 'Bangladesh', lat: 23.8433, lng: 90.3978, type: 'AIRPORT' },
  
  // PAKISTAN
  { code: 'KHI', name: 'Jinnah International', city: 'Karachi', country: 'Pakistan', lat: 24.9065, lng: 67.1608, type: 'AIRPORT' },
  { code: 'ISB', name: 'Islamabad International', city: 'Islamabad', country: 'Pakistan', lat: 33.5494, lng: 72.8258, type: 'AIRPORT' },
  { code: 'LHE', name: 'Allama Iqbal International', city: 'Lahore', country: 'Pakistan', lat: 31.5216, lng: 74.4036, type: 'AIRPORT' },
  
  // CZECH REPUBLIC
  { code: 'PRG', name: 'Václav Havel Airport', city: 'Prague', country: 'Czech Republic', lat: 50.1008, lng: 14.2600, type: 'AIRPORT' },
  
  // HUNGARY
  { code: 'BUD', name: 'Budapest Ferenc Liszt', city: 'Budapest', country: 'Hungary', lat: 47.4298, lng: 19.2611, type: 'AIRPORT' },
  
  // ROMANIA
  { code: 'OTP', name: 'Henri Coandă International', city: 'Bucharest', country: 'Romania', lat: 44.5711, lng: 26.0858, type: 'AIRPORT' },
  
  // BULGARIA
  { code: 'SOF', name: 'Sofia Airport', city: 'Sofia', country: 'Bulgaria', lat: 42.6967, lng: 23.4114, type: 'AIRPORT' },
  
  // CROATIA
  { code: 'ZAG', name: 'Franjo Tuđman Airport', city: 'Zagreb', country: 'Croatia', lat: 45.7429, lng: 16.0688, type: 'AIRPORT' },
  { code: 'DBV', name: 'Dubrovnik Airport', city: 'Dubrovnik', country: 'Croatia', lat: 42.5614, lng: 18.2682, type: 'AIRPORT' },
  
  // CYPRUS
  { code: 'LCA', name: 'Larnaca International', city: 'Larnaca', country: 'Cyprus', lat: 34.8751, lng: 33.6249, type: 'AIRPORT' },
  { code: 'PFO', name: 'Paphos International', city: 'Paphos', country: 'Cyprus', lat: 34.7180, lng: 32.4857, type: 'AIRPORT' },
  
  // ESTONIA
  { code: 'TLL', name: 'Lennart Meri Tallinn', city: 'Tallinn', country: 'Estonia', lat: 59.4133, lng: 24.8328, type: 'AIRPORT' },
  
  // LATVIA
  { code: 'RIX', name: 'Riga International', city: 'Riga', country: 'Latvia', lat: 56.9236, lng: 23.9711, type: 'AIRPORT' },
  
  // LITHUANIA
  { code: 'VNO', name: 'Vilnius Airport', city: 'Vilnius', country: 'Lithuania', lat: 54.6371, lng: 25.2878, type: 'AIRPORT' },
  
  // SERBIA
  { code: 'BEG', name: 'Belgrade Nikola Tesla', city: 'Belgrade', country: 'Serbia', lat: 44.8184, lng: 20.3091, type: 'AIRPORT' },
  
  // SLOVENIA
  { code: 'LJU', name: 'Ljubljana Jože Pučnik', city: 'Ljubljana', country: 'Slovenia', lat: 46.2237, lng: 14.4576, type: 'AIRPORT' },
  
  // SLOVAKIA
  { code: 'BTS', name: 'Bratislava Airport', city: 'Bratislava', country: 'Slovakia', lat: 48.1702, lng: 17.2127, type: 'AIRPORT' },
  
  // LUXEMBOURG
  { code: 'LUX', name: 'Luxembourg Airport', city: 'Luxembourg', country: 'Luxembourg', lat: 49.6233, lng: 6.2044, type: 'AIRPORT' },
  
  // MALTA
  { code: 'MLA', name: 'Malta International', city: 'Valletta', country: 'Malta', lat: 35.8575, lng: 14.4775, type: 'AIRPORT' },
  
  // URUGUAY
  { code: 'MVD', name: 'Carrasco International', city: 'Montevideo', country: 'Uruguay', lat: -34.8384, lng: -56.0308, type: 'AIRPORT' },
  
  // PANAMA
  { code: 'PTY', name: 'Tocumen International', city: 'Panama City', country: 'Panama', lat: 9.0714, lng: -79.3835, type: 'AIRPORT' },
  
  // COSTA RICA
  { code: 'SJO', name: 'Juan Santamaría International', city: 'San José', country: 'Costa Rica', lat: 9.9939, lng: -84.2088, type: 'AIRPORT' },
  { code: 'LIR', name: 'Daniel Oduber Quirós', city: 'Liberia', country: 'Costa Rica', lat: 10.5933, lng: -85.5444, type: 'AIRPORT' },
  
  // DOMINICAN REPUBLIC
  { code: 'PUJ', name: 'Punta Cana International', city: 'Punta Cana', country: 'Dominican Republic', lat: 18.5674, lng: -68.3634, type: 'AIRPORT' },
  { code: 'SDQ', name: 'Las Américas', city: 'Santo Domingo', country: 'Dominican Republic', lat: 18.4297, lng: -69.6689, type: 'AIRPORT' },
  
  // JAMAICA
  { code: 'MBJ', name: 'Sangster International', city: 'Montego Bay', country: 'Jamaica', lat: 18.5037, lng: -77.9134, type: 'AIRPORT' },
  { code: 'KIN', name: 'Norman Manley International', city: 'Kingston', country: 'Jamaica', lat: 17.9357, lng: -76.7875, type: 'AIRPORT' },
  
  // BAHAMAS
  { code: 'NAS', name: 'Lynden Pindling International', city: 'Nassau', country: 'Bahamas', lat: 25.0390, lng: -77.4664, type: 'AIRPORT' },
  
  // FIJI
  { code: 'NAN', name: 'Nadi International', city: 'Nadi', country: 'Fiji', lat: -17.7554, lng: 177.4433, type: 'AIRPORT' },
  
  // MAURITIUS
  { code: 'MRU', name: 'Sir Seewoosagur Ramgoolam', city: 'Port Louis', country: 'Mauritius', lat: -20.4302, lng: 57.6836, type: 'AIRPORT' },
  
  // SEYCHELLES
  { code: 'SEZ', name: 'Seychelles International', city: 'Mahé', country: 'Seychelles', lat: -4.6743, lng: 55.5218, type: 'AIRPORT' },
  
  // MALDIVES
  { code: 'MLE', name: 'Velana International', city: 'Malé', country: 'Maldives', lat: 4.1918, lng: 73.5291, type: 'AIRPORT' }
];

// Helper function to search local airports
export const searchLocalAirports = (keyword) => {
  if (!keyword || keyword.length < 2) return [];
  
  const searchLower = keyword.toLowerCase().trim();
  const searchWords = searchLower.split(/\s+/).filter(word => word.length > 0);
  
  const results = airportDatabase.filter(airport => {
    const nameLower = airport.name.toLowerCase();
    const cityLower = airport.city.toLowerCase();
    const countryLower = airport.country.toLowerCase();
    const codeLower = airport.code.toLowerCase();
    
    return searchWords.some(word => 
      nameLower.includes(word) ||
      cityLower.includes(word) ||
      countryLower.includes(word) ||
      codeLower.includes(word)
    );
  });
  
  // Sort results by relevance
  const sortedResults = results.sort((a, b) => {
    let aScore = 0;
    let bScore = 0;
    
    const calculateScore = (airport) => {
      let score = 0;
      const nameLower = airport.name.toLowerCase();
      const cityLower = airport.city.toLowerCase();
      const countryLower = airport.country.toLowerCase();
      const codeLower = airport.code.toLowerCase();
      
      searchWords.forEach(word => {
        if (cityLower === word) score += 10;
        if (codeLower === word) score += 10;
        if (countryLower === word) score += 8;
        if (cityLower.includes(word)) score += 5;
        if (codeLower.includes(word)) score += 5;
        if (nameLower.includes(word)) score += 3;
        if (countryLower.includes(word)) score += 2;
      });
      
      return score;
    };
    
    aScore = calculateScore(a);
    bScore = calculateScore(b);
    
    return bScore - aScore;
  });
  
  return sortedResults.slice(0, 15);
};