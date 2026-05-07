/*
  # Hadid Online Transportation Platform - Core Schema

  ## Tables Created:
  1. **vehicles** - Fleet management (buses, vans)
  2. **drivers** - Driver profiles and availability
  3. **clients** - Individual, corporate, school clients
  4. **bookings** - Trip bookings (tourist, corporate, school, private)
  5. **contracts** - Corporate and school contracts
  6. **trips** - Scheduled trip instances
  7. **invoices** - Billing records
  8. **tour_packages** - Tourist tour packages
  9. **routes** - Predefined routes
  10. **activity_logs** - Audit trail

  ## Security: RLS enabled on all tables
*/

-- VEHICLES TABLE
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('bus', 'van', 'minibus')),
  plate_number text UNIQUE NOT NULL,
  capacity integer NOT NULL DEFAULT 0,
  model text,
  year integer,
  has_ac boolean DEFAULT true,
  has_wifi boolean DEFAULT false,
  has_luggage_space boolean DEFAULT true,
  comfort_level text DEFAULT 'standard' CHECK (comfort_level IN ('standard', 'business', 'vip')),
  status text DEFAULT 'available' CHECK (status IN ('available', 'busy', 'maintenance', 'out_of_service')),
  image_url text,
  notes text,
  last_maintenance_date date,
  next_maintenance_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- DRIVERS TABLE
CREATE TABLE IF NOT EXISTS drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  license_number text UNIQUE NOT NULL,
  license_expiry date NOT NULL,
  national_id text,
  status text DEFAULT 'available' CHECK (status IN ('available', 'on_trip', 'off_duty', 'inactive')),
  rating decimal(3,2) DEFAULT 5.0,
  total_trips integer DEFAULT 0,
  notes text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- CLIENTS TABLE
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('individual', 'corporate', 'school')),
  phone text NOT NULL,
  email text,
  address text,
  contact_person text,
  company_name text,
  tax_number text,
  notes text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- TOUR PACKAGES TABLE
CREATE TABLE IF NOT EXISTS tour_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_ar text NOT NULL,
  description text,
  description_ar text,
  destination text NOT NULL,
  duration_days integer NOT NULL DEFAULT 1,
  price_per_person decimal(10,2),
  min_passengers integer DEFAULT 1,
  max_passengers integer NOT NULL,
  includes text[],
  excludes text[],
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ROUTES TABLE
CREATE TABLE IF NOT EXISTS routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_ar text,
  from_location text NOT NULL,
  to_location text NOT NULL,
  distance_km decimal(8,2),
  estimated_duration_minutes integer,
  is_recurring boolean DEFAULT false,
  recurring_days text[],
  notes text,
  created_at timestamptz DEFAULT now()
);

-- CONTRACTS TABLE
CREATE TABLE IF NOT EXISTS contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_number text UNIQUE NOT NULL DEFAULT 'CNT-' || to_char(now(), 'YYYY') || '-' || floor(random()*10000)::text,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('corporate', 'school', 'tourist')),
  status text DEFAULT 'new' CHECK (status IN ('new', 'negotiating', 'active', 'expired', 'cancelled')),
  start_date date,
  end_date date,
  monthly_amount decimal(10,2),
  total_amount decimal(10,2),
  billing_cycle text DEFAULT 'monthly' CHECK (billing_cycle IN ('one_time', 'monthly', 'yearly')),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE SET NULL,
  driver_id uuid REFERENCES drivers(id) ON DELETE SET NULL,
  route_id uuid REFERENCES routes(id) ON DELETE SET NULL,
  notes text,
  terms text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number text UNIQUE NOT NULL DEFAULT 'BK-' || to_char(now(), 'YYYY') || '-' || floor(random()*100000)::text,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  client_name text NOT NULL,
  client_phone text NOT NULL,
  client_email text,
  trip_type text NOT NULL CHECK (trip_type IN ('tourist', 'corporate', 'school', 'private')),
  contract_type text DEFAULT 'one_time' CHECK (contract_type IN ('one_time', 'monthly', 'yearly', 'recurring')),
  status text DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled')),
  pickup_location text NOT NULL,
  destination text NOT NULL,
  trip_date date NOT NULL,
  trip_time time NOT NULL,
  return_trip boolean DEFAULT false,
  return_date date,
  return_time time,
  passengers integer NOT NULL DEFAULT 1,
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE SET NULL,
  driver_id uuid REFERENCES drivers(id) ON DELETE SET NULL,
  vehicle_preference text,
  price decimal(10,2),
  notes text,
  source text DEFAULT 'website' CHECK (source IN ('website', 'phone', 'whatsapp', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- TRIPS TABLE
CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  contract_id uuid REFERENCES contracts(id) ON DELETE SET NULL,
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE SET NULL,
  driver_id uuid REFERENCES drivers(id) ON DELETE SET NULL,
  route_id uuid REFERENCES routes(id) ON DELETE SET NULL,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  scheduled_date date NOT NULL,
  scheduled_time time NOT NULL,
  actual_start_time timestamptz,
  actual_end_time timestamptz,
  from_location text NOT NULL,
  to_location text NOT NULL,
  passengers integer DEFAULT 1,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- INVOICES TABLE
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL DEFAULT 'INV-' || to_char(now(), 'YYYY') || '-' || floor(random()*100000)::text,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  contract_id uuid REFERENCES contracts(id) ON DELETE SET NULL,
  amount decimal(10,2) NOT NULL,
  tax_amount decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  due_date date,
  paid_date date,
  payment_method text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid,
  action text NOT NULL,
  description text,
  user_name text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

-- ENABLE RLS ON ALL TABLES
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES (anon read for public data, authenticated full access)

-- Vehicles: public can read
CREATE POLICY "Public can view vehicles" ON vehicles FOR SELECT TO anon USING (true);
CREATE POLICY "Authenticated can manage vehicles" ON vehicles FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Tour packages: public can read active ones
CREATE POLICY "Public can view active tour packages" ON tour_packages FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Authenticated can manage tour packages" ON tour_packages FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Routes: public read
CREATE POLICY "Public can view routes" ON routes FOR SELECT TO anon USING (true);
CREATE POLICY "Authenticated can manage routes" ON routes FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Bookings: anon can insert (website form), authenticated can manage
CREATE POLICY "Anyone can create bookings" ON bookings FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Authenticated can manage bookings" ON bookings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Drivers: authenticated only
CREATE POLICY "Authenticated can manage drivers" ON drivers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Clients: authenticated only
CREATE POLICY "Authenticated can manage clients" ON clients FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Contracts: authenticated only
CREATE POLICY "Authenticated can manage contracts" ON contracts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Trips: authenticated only
CREATE POLICY "Authenticated can manage trips" ON trips FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Invoices: authenticated only
CREATE POLICY "Authenticated can manage invoices" ON invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Activity logs: authenticated only
CREATE POLICY "Authenticated can manage activity_logs" ON activity_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- INSERT SAMPLE DATA

-- Sample Vehicles
INSERT INTO vehicles (name, type, plate_number, capacity, model, year, has_ac, has_wifi, has_luggage_space, comfort_level, status) VALUES
('حافلة VIP الذهبية', 'bus', 'ح أ ب 1234', 50, 'Mercedes Tourismo', 2023, true, true, true, 'vip', 'available'),
('حافلة الأعمال', 'bus', 'ح ب ج 5678', 40, 'Volvo 9700', 2022, true, true, true, 'business', 'available'),
('فان التنفيذيين', 'van', 'ف أ ت 9012', 15, 'Mercedes Sprinter', 2024, true, true, true, 'vip', 'available'),
('فان المدارس', 'van', 'ف ب م 3456', 20, 'Toyota Hiace', 2023, true, false, true, 'standard', 'available'),
('حافلة السياحة الكبرى', 'bus', 'ح س ك 7890', 55, 'Scania Touring', 2023, true, true, true, 'vip', 'busy'),
('فان التنقلات اليومية', 'van', 'ف ت ي 2345', 12, 'Nissan Urvan', 2022, true, false, false, 'standard', 'available'),
('مينيباس المؤتمرات', 'minibus', 'م أ م 6789', 25, 'Yutong TC', 2023, true, true, true, 'business', 'maintenance')
ON CONFLICT (plate_number) DO NOTHING;

-- Sample Drivers
INSERT INTO drivers (full_name, phone, license_number, license_expiry, status, rating) VALUES
('أحمد محمد السيد', '+966501234567', 'DL-001-2020', '2026-12-31', 'available', 4.9),
('محمد علي حسن', '+966502345678', 'DL-002-2019', '2026-08-15', 'available', 4.8),
('خالد عبدالله الأحمد', '+966503456789', 'DL-003-2021', '2027-03-20', 'on_trip', 4.7),
('سعيد يوسف المنصور', '+966504567890', 'DL-004-2020', '2026-11-10', 'available', 4.9),
('عمر فهد الزهراني', '+966505678901', 'DL-005-2022', '2027-06-30', 'available', 5.0)
ON CONFLICT (license_number) DO NOTHING;

-- Sample Clients
INSERT INTO clients (name, type, phone, email, company_name) VALUES
('شركة أرامكو السعودية', 'corporate', '+966112345678', 'transport@aramco.com', 'أرامكو السعودية'),
('مدرسة الفيصل الدولية', 'school', '+966113456789', 'admin@faisal-school.edu.sa', 'مدرسة الفيصل الدولية'),
('مجموعة سياحية - حمد الغامدي', 'individual', '+966551234567', 'hamad@gmail.com', null),
('شركة البناء والتطوير', 'corporate', '+966114567890', 'hr@construction.sa', 'شركة البناء والتطوير')
ON CONFLICT DO NOTHING;

-- Sample Tour Packages
INSERT INTO tour_packages (name, name_ar, description, description_ar, destination, duration_days, price_per_person, min_passengers, max_passengers, is_active) VALUES
('Abha Mountain Adventure', 'مغامرة جبال أبها', 'Explore the stunning mountains of Abha with luxury transport', 'استكشف جبال أبها الخلابة مع وسائل نقل فاخرة', 'أبها', 3, 450, 10, 50, true),
('Madinah Holy Tour', 'جولة المدينة المنورة', 'Sacred journey to Madinah with premium service', 'رحلة مقدسة إلى المدينة المنورة بخدمة متميزة', 'المدينة المنورة', 2, 350, 15, 55, true),
('AlUla Heritage Trip', 'رحلة العلا التراثية', 'Discover the ancient wonders of AlUla', 'اكتشف عجائب العلا الأثرية', 'العلا', 4, 800, 20, 45, true),
('Taif Rose Festival Tour', 'جولة مهرجان ورد الطائف', 'Experience the famous rose season in Taif', 'اختبر موسم الورد الشهير في الطائف', 'الطائف', 2, 300, 10, 40, true)
ON CONFLICT DO NOTHING;
