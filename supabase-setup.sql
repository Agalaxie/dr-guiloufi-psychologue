-- Script d'initialisation pour Supabase
-- À exécuter dans l'éditeur SQL de Supabase

-- Table pour les réservations de rendez-vous
CREATE TABLE IF NOT EXISTS appointment_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    time TIME NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20),
    reason TEXT,
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    stripe_session_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les créneaux bloqués par l'admin
CREATE TABLE IF NOT EXISTS blocked_slots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    time TIME NOT NULL,
    reason VARCHAR(255) DEFAULT 'Indisponible',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date, time)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_appointment_bookings_date_time ON appointment_bookings(date, time);
CREATE INDEX IF NOT EXISTS idx_appointment_bookings_status ON appointment_bookings(status);
CREATE INDEX IF NOT EXISTS idx_appointment_bookings_stripe ON appointment_bookings(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_blocked_slots_date_time ON blocked_slots(date, time);

-- RLS (Row Level Security) - Optionnel, pour sécuriser l'accès
ALTER TABLE appointment_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_slots ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique des créneaux occupés (pour le calendrier)
CREATE POLICY IF NOT EXISTS "Allow public read for availability check" ON appointment_bookings
    FOR SELECT USING (status = 'confirmed');

CREATE POLICY IF NOT EXISTS "Allow public read blocked slots" ON blocked_slots
    FOR SELECT USING (true);

-- Politique pour permettre l'insertion de nouvelles réservations
CREATE POLICY IF NOT EXISTS "Allow public insert for bookings" ON appointment_bookings
    FOR INSERT WITH CHECK (true);

-- Politique pour permettre la mise à jour des réservations (pour confirmation)
CREATE POLICY IF NOT EXISTS "Allow public update for confirmation" ON appointment_bookings
    FOR UPDATE USING (true);

-- Politiques admin pour les créneaux bloqués (nécessite service_role)
-- Ces politiques seront bypassées quand on utilise la service_role key