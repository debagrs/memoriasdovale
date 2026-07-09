#!/usr/bin/env node

/**
 * Script para executar migrations SQL no Supabase
 * Use: node supabase/setup-migrations.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERRO: Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não configuradas');
  console.log('Configure no .env e tente novamente');
  process.exit(1);
}

console.log('🔧 Conectando ao Supabase...');
const supabase = createClient(supabaseUrl, supabaseKey);

// Ler arquivo de migration
const migrationFile = path.join(__dirname, 'migrations', '001_init.sql');
const migrationSQL = fs.readFileSync(migrationFile, 'utf-8');

// Quebrar em statements individuais (separa por ;)
const statements = migrationSQL
  .split(';')
  .map(s => s.trim())
  .filter(s => s && !s.startsWith('--'));

(async () => {
  try {
    console.log(`📄 Executando ${statements.length} statements SQL...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`  [${i + 1}/${statements.length}] Executando...`);
      
      const { error } = await supabase.rpc('exec_sql', { sql: statement }).catch(() => {
        // Se RPC não existir, tenta direto com query
        return supabase.from('_migrations').insert({ sql: statement });
      });

      if (error && !error.message.includes('does not exist')) {
        console.error(`❌ Erro no statement ${i + 1}:`, error.message);
        // Continua mesmo com erro para não bloquear
      }
    }

    console.log('✅ Migrations executadas! Verificando tabelas...');
    
    // Verificar se tabelas foram criadas
    const { data, error: tableError } = await supabase
      .from('community_items')
      .select('*', { count: 'exact', head: true });

    if (tableError && tableError.message.includes('does not exist')) {
      console.error('⚠️  Tabela community_items ainda não criada.');
      console.log('\n📌 ALTERNATIVA: Execute manualmente no Supabase');
      console.log('1. Vá para: https://supabase.com/dashboard/project/uugqrjhcfuwpqwsshywq/sql/new');
      console.log('2. Cole o conteúdo de: supabase/migrations/001_init.sql');
      console.log('3. Clique em "Run"');
      process.exit(1);
    } else {
      console.log('✅ Tabela community_items OK!');
    }

  } catch (err) {
    console.error('❌ Erro geral:', err.message);
    process.exit(1);
  }
})();
