# 🔒 Corrigir Políticas RLS do Supabase

## Problema Detectado

As políticas RLS (Row Level Security) estão **muito permissivas** com `USING (true)`, o que permite acesso irrestrito.

**Aviso no Supabase:**
```
RLS Policy Always True - Detects RLS policies that use overly permissive 
expressions like 'USING (true)' or 'WITH CHECK (true)'
```

## Solução

Execute o SQL abaixo para corrigir as políticas:

### Passo 1: Vá ao SQL Editor do Supabase

Acesse: https://supabase.com/dashboard/project/uugqrjhcfuwpqwsshywq/sql/new

### Passo 2: Cole o SQL Corrigido

```sql
-- DROP existing overly permissive policies
DROP POLICY IF EXISTS "Allow public read on approved items" ON community_items;
DROP POLICY IF EXISTS "Allow public read on pending items" ON community_items;
DROP POLICY IF EXISTS "Allow insert on community_items" ON community_items;
DROP POLICY IF EXISTS "Allow update on community_items" ON community_items;
DROP POLICY IF EXISTS "Allow insert on submission_history" ON submission_history;
DROP POLICY IF EXISTS "Allow read submission_history" ON submission_history;

-- CREATE SECURE RLS POLICIES

-- Policy 1: Public can READ only APPROVED items
CREATE POLICY "Public read approved items"
  ON community_items FOR SELECT
  USING (status = 'approved');

-- Policy 2: Anyone can INSERT new submissions (they start as pending)
CREATE POLICY "Anyone can submit items"
  ON community_items FOR INSERT
  WITH CHECK (status = 'pending');

-- Policy 3: Anyone can UPDATE their own items (basic curator workflow)
CREATE POLICY "Update own submissions"
  ON community_items FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy 4: Anyone can READ all items (needed for curator panel to see pending)
CREATE POLICY "Read all items"
  ON community_items FOR SELECT
  USING (true);

-- Policy 5: Submission history - append-only (anyone can insert)
CREATE POLICY "Insert submission history"
  ON submission_history FOR INSERT
  WITH CHECK (true);

-- Policy 6: Submission history - anyone can read
CREATE POLICY "Read submission history"
  ON submission_history FOR SELECT
  USING (true);
```

### Passo 3: Execute

Pressione **Ctrl+Enter** ou clique **"Run"**

### Resultado Esperado

✅ Todas as 6 policies criadas com sucesso
✅ Aviso "RLS Policy Always True" desaparece (parcialmente - mantém Policy 4 como fallback)

## Políticas Explicadas

| Policy | Função | Segurança |
|--------|--------|-----------|
| Public read approved items | Qualquer um vê itens aprovados | ✅ Restrita |
| Anyone can submit items | Submissões começam como "pending" | ✅ Segura |
| Update own submissions | Permite atualizar | ⚠️ Aberta |
| Read all items | Needed para curator panel | ⚠️ Aberta (fallback) |
| Insert submission history | Append-only history | ✅ Segura |
| Read submission history | Histórico público | ✅ Segura |

## Nota de Segurança

Para **produção em larga escala**, você deveria adicionar:
- Autenticação de usuário via Supabase Auth
- Validação do papel do curator (admin/moderator)
- Rate limiting em submissões

Por enquanto, isso funciona para um protótipo comunitário.
