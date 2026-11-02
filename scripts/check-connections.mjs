// check-connections.mjs - verifies connections for the upgrade
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local
function loadEnv() {
  const envPath = path.resolve('C:\\Users\\sky\\Desktop\\New folder (2)\\galaxy-workforce\\.env.local');
  try {
    const env = fs.readFileSync(envPath, 'utf8');
    for (const line of env.split('\n')) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
    }
  } catch {}
}

// Load env before checking
loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Loaded env vars:');
console.log(`  NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? 'SET' : 'MISSING'}`);
console.log(`  NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'SET' : 'MISSING'}`);
console.log(`  SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? 'SET' : 'MISSING'}`);
console.log(`  OPENROUTER_API_KEY: ${process.env.OPENROUTER_API_KEY ? 'SET' : 'MISSING'}`);
console.log('');

async function checkSupabaseAuth() {
  console.log('Supabase Auth API check...');
  const url = `${supabaseUrl}/auth/v1/verify`;
  const headers = {
    'apikey': supabaseAnonKey,
    'Authorization': `Bearer ${supabaseAnonKey}`,
    'Content-Type': 'application/json',
  };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({}),
    });
    console.log(`Supabase Auth: ${response.status} - ${response.statusText}`);
    return response.ok;
  } catch (error) {
    console.log(`Supabase Auth error: ${error.message}`);
    return false;
  }
}

async function checkSupabaseREST() {
  console.log('Supabase REST API check...');
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    const { data, error } = await supabase.from('categories').select('count').limit(1);
    if (error) {
      console.log(`Supabase REST error: ${error.message}`);
      return false;
    }
    console.log('Supabase REST: OK (categories accessible)');
    return true;
  } catch (error) {
    console.log(`Supabase REST error: ${error.message}`);
    return false;
  }
}

async function checkOpenRouter() {
  console.log('OpenRouter API check...');
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.log('OpenRouter: NO API KEY - skip test');
    return false;
  }
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 1,
      }),
    });
    console.log(`OpenRouter: ${response.status} - ${response.statusText}`);
    return response.ok;
  } catch (error) {
    console.log(`OpenRouter error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('=== Galaxy Workforce Connection Check ===\n');
  
  const results = {};
  results.supabaseAuth = await checkSupabaseAuth();
  console.log('');
  results.supabaseRest = await checkSupabaseREST();
  console.log('');
  results.openRouter = await checkOpenRouter();
  console.log('');
  
  console.log('=== Summary ===');
  for (const [service, status] of Object.entries(results)) {
    console.log(`${service}: ${status ? 'PASS' : 'FAIL'}`);
  }
  
  const allPassed = Object.values(results).every(Boolean);
  console.log(`\nOverall: ${allPassed ? 'ALL CONNECTIONS OK' : 'SOME CONNECTIONS FAILED'}`);
  process.exit(allPassed ? 0 : 1);
}

main().catch(console.error);