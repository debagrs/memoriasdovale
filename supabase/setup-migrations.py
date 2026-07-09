#!/usr/bin/env python3
"""
Script para executar migrations SQL no Supabase via API
"""

import os
import re

# Ler variáveis do .env
def load_env():
    env_vars = {}
    env_file = '.env'
    if os.path.exists(env_file):
        with open(env_file, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    key, value = line.split('=', 1)
                    env_vars[key] = value.strip('"').strip("'")
    return env_vars

env = load_env()
supabase_url = env.get('VITE_SUPABASE_URL')
supabase_key = env.get('VITE_SUPABASE_ANON_KEY')

if not supabase_url or not supabase_key:
    print('❌ ERRO: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não encontradas em .env')
    exit(1)

print(f'🔧 Conectando ao Supabase...')
print(f'   URL: {supabase_url}')

# Ler arquivo SQL
with open('supabase/migrations/001_init.sql', 'r') as f:
    sql_content = f.read()

# Split por ; e filtra comentários
statements = []
current = ''
for line in sql_content.split('\n'):
    stripped = line.strip()
    if stripped and not stripped.startswith('--'):
        current += line + '\n'
        if ';' in line:
            statements.append(current.strip())
            current = ''

print(f'📄 Encontrados {len(statements)} statements SQL')

# Para cada statement, precisamos usar a API SQL do Supabase
# Nota: A API direta de SQL não está disponível publicamente
# Vamos apenas informar o usuário para fazer manualmente

print('\n⚠️  Manual Setup Required:')
print('=' * 60)
print('1. Abra: https://supabase.com/dashboard/project/uugqrjhcfuwpqwsshywq/sql/new')
print('2. Cole o SQL abaixo:')
print('=' * 60)
print(sql_content)
print('=' * 60)
print('3. Clique em "Run"')
print('\n✅ Após executar, as tabelas estarão criadas!')
