const { createClient } = require('@supabase/supabase-js');

// Variables d'environnement en dur pour ce script
const SUPABASE_URL = 'https://xzgqhbgfdxeinkoyuxwo.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6Z3FoYmdmZHhlaW5rb3l1eHdvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA3MTAzNCwiZXhwIjoyMDY5NjQ3MDM0fQ.GZTGjHu88MT-9FlDcoTh07C2GXOhtrWLmaUHaAIcneA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function setupDatabase() {
  console.log('🔧 Configuration de la base de données...');
  
  try {
    // Créer la table appointments
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS appointments (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          date DATE NOT NULL,
          time TIME NOT NULL,
          client_name VARCHAR(255) NOT NULL,
          client_email VARCHAR(255) NOT NULL,
          client_phone VARCHAR(20) NOT NULL,
          reason VARCHAR(500) NOT NULL,
          message TEXT,
          status VARCHAR(20) DEFAULT 'pending',
          stripe_session_id VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (tableError) {
      console.error('❌ Erreur création table:', tableError);
      return;
    }

    console.log('✅ Table appointments créée avec succès');

    // Test de connexion
    const { data, error } = await supabase.from('appointments').select('count');
    
    if (error) {
      console.error('❌ Erreur test connexion:', error);
    } else {
      console.log('✅ Connexion à la base de données réussie');
      console.log('🎉 Configuration terminée !');
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

setupDatabase();