# Guia de Configuração - Supabase + Vale Vêneto

## O que foi ajustado

Para resolver a página em branco e estabelecer uma integração segura com Supabase, foram criados:

1. **`src/config/supabase.ts`** - Inicialização do cliente Supabase com validação
2. **`src/hooks/useSupabase.ts`** - Hooks React para sincronização de dados
3. **`supabase/migrations/001_init.sql`** - Schema SQL do banco de dados
4. **`.env.example`** - Variáveis de ambiente corrigidas com prefixo VITE_

## Setup do Supabase

### 1. Criar projeto no Supabase

1. Vá para [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Configure:
   - **Name**: vale-veneto-memoria-e-musica
   - **Database Password**: Guarde em local seguro
   - **Region**: Escolha a mais próxima (ex: São Paulo - sa-east-1)

### 2. Executar migrations SQL

1. No painel Supabase, vá para "SQL Editor"
2. Clique em "New Query"
3. Cole o conteúdo de `supabase/migrations/001_init.sql`
4. Execute (Cmd+Enter ou botão "Run")

### 3. Configurar variáveis de ambiente

1. Na raiz do projeto, crie um arquivo `.env` (cópia de `.env.example`)
2. No Supabase, vá para **Settings > API**
3. Copie seus valores:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
   ```

### 4. Testar localmente

```bash
npm run dev
```

Verifique no console do navegador (F12) se aparece a mensagem:
- ✅ "Supabase configurado corretamente" → Tudo certo!
- ⚠️ "Supabase não está configurado" → Verifique `.env`

## Funcionamento

### Modo de Fallback Seguro

A aplicação foi desenvolvida com **fallback automático**:

```
Supabase Configurado?
  ├─ SIM → Sincroniza dados em tempo real
  └─ NÃO → Usa localStorage automaticamente
```

**Vantagens:**
- ✅ Funciona offline com localStorage
- ✅ Sincroniza quando Supabase está disponível
- ✅ Sem erros críticos se Supabase falhar
- ✅ Deploy no GitHub Pages funciona sem credentials

### Fluxo de Dados

```
1. Carregamento
   └─ Tenta Supabase → Se falhar, carrega localStorage

2. Submissão (Deixar Memória)
   ├─ Salva em localStorage (imediato)
   └─ Sincroniza com Supabase (assíncrono)

3. Curadoria (Aprovação)
   ├─ Atualiza localStorage
   └─ Registra em submission_history do Supabase
```

## Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|----------|-----------|------------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase | Não (fallback localStorage) |
| `VITE_SUPABASE_ANON_KEY` | Chave API anônima | Não (fallback localStorage) |
| `VITE_GEMINI_API_KEY` | Chave do Google Gemini (futuro) | Não |
| `VITE_APP_URL` | URL base da aplicação | Não |

## Troubleshooting

### Página ainda em branco?

1. **Abra DevTools** (F12 → Console)
2. **Procure por erros** (vermelho em cor)
3. **Verifique localStorage**:
   ```javascript
   // No console:
   JSON.parse(localStorage.getItem('communityItems'))
   ```

### Dados não sincronizam?

- Verifique se `VITE_SUPABASE_URL` está correto
- Teste conexão no console:
  ```javascript
  import { supabase } from './src/config/supabase'
  supabase.from('community_items').select('count')
  ```

### Erro "401 Unauthorized"?

- Copie a chave correta de **Settings > API > anon (public)** no Supabase
- Certifique-se de que RLS policies estão habilitadas

## Próximos Passos

1. ✅ Integração Supabase (feito)
2. ⏳ Teste com dados reais
3. ⏳ Deploy em produção
4. ⏳ Implementar autenticação de curador
5. ⏳ Backup automático de dados

---

**Nota**: A chave anônica é segura de expor (é pública). Use `.env` local para development e variáveis de ambiente seguras em produção (GitHub Secrets para GitHub Pages, ou deploy em Vercel/Railway).
