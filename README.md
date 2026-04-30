# GMJ Loreto - Site Institucional

Este é o site oficial do **Grupo Missionário Jovem (GMJ) Loreto**, da Paróquia Nossa Senhora de Loreto. O projeto foi desenvolvido para centralizar a comunicação do grupo, exibir cronogramas de missões, galerias de fotos e facilitar o contato com novos membros.

🌐 **URL Oficial:** [gmjloreto.com.br](https://gmjloreto.com.br)

## 🚀 Funcionalidades

- **Design Premium & Fluido:** Interface moderna, 100% responsiva (Mobile-First) e otimizada para qualquer tamanho de tela.
- **Cronograma Dinâmico:** Gerenciamento de missões e eventos em tempo real integrado ao Supabase.
- **Painel Administrativo:** Acesso restrito para edição de datas, eventos e configurações do grupo.
- **SEO Otimizado:** Configuração completa para Google Search Console, OpenGraph (social media) e Sitemap.
- **Galerias e Conteúdos:** Espaço dedicado para registros de retiros e atividades missionárias.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3 (Modern Architecture/Fluid Design), JavaScript Vanilla.
- **Backend-as-a-Service:** [Supabase](https://supabase.com/) (Autenticação e Banco de Dados em tempo real).
- **Hospedagem:** GitHub Pages.
- **Domínio:** Registro.br (Configurado via CNAME).

## 📂 Estrutura do Projeto

```text
/
├── assets/             # Recursos estáticos (imagens, ícones, favicons)
├── config/             # Configurações de API (Supabase)
├── css/                # Design System (style.css mobile-first)
├── js/                 # Lógica da aplicação (app.js)
├── index.html          # Página Inicial
├── mission.html        # Cronograma de Missões
├── content.html        # Galeria de Conteúdos
├── contact.html        # Página de Contato
├── admin.html          # Painel de Gerenciamento
├── CNAME               # Configuração de domínio personalizado
├── sitemap.xml         # Índice para motores de busca
└── robots.txt          # Instruções para robôs de busca
```

## 🔧 Como Rodar Localmente

1. Clone o repositório.
2. Certifique-se de configurar as chaves do Supabase em `config/supabase.js`.
3. Abra o `index.html` em um servidor local (recomenda-se a extensão *Live Server* do VS Code).
