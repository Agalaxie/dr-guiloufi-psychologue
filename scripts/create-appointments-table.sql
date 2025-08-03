-- Créer la table appointments
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  time TIME NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(20) NOT NULL,
  reason VARCHAR(500) NOT NULL,
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  stripe_session_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contrainte unique pour éviter les doubles réservations confirmées au même moment
CREATE UNIQUE INDEX idx_unique_confirmed_slot 
ON appointments(date, time) 
WHERE status = 'confirmed';

-- Index pour les requêtes fréquentes
CREATE INDEX idx_appointments_date_time ON appointments(date, time);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_stripe_session ON appointments(stripe_session_id);

-- RLS (Row Level Security) - Optionnel pour plus tard si besoin d'authentification
-- ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;