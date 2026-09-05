const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envLocal = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envLocal.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envLocal.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const url = urlMatch ? urlMatch[1].trim() : '';
const key = keyMatch ? keyMatch[1].trim() : '';

const supabase = createClient(url, key);

async function seedData() {
  const { MODULES_DATA } = require('./src/data/modulesData');
  console.log('Seeding initial MODULES_DATA to Supabase...');

  const { data, error } = await supabase.from('study_hub_data').upsert({
    id: 'global',
    modules: MODULES_DATA,
    completed_tutorials: {},
    updated_at: new Date().toISOString()
  });

  if (error) {
    console.error('Seed Error:', error.message);
  } else {
    console.log('Successfully seeded global modules to Supabase!');
  }
}

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('study_hub_data')
      .select('*')
      .eq('id', 'global');

    if (error) {
      console.log('STATUS: Table study_hub_data not created yet.');
      console.log('Error message:', error.message);
    } else {
      console.log('STATUS: Table study_hub_data exists! Rows found:', data.length);
      if (data.length === 0) {
        await seedData();
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testConnection();
