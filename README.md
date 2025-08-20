# 🏦 Hacktoon - Plataforma de Inovação CAIXA

Sistema de gestão de ideias de inovação para a CAIXA Econômica Federal, desenvolvido com React, TypeScript e Tailwind CSS seguindo o design system oficial da instituição.

## 🚀 Características

- **Design System CAIXA**: Interface seguindo as diretrizes visuais oficiais
- **Autenticação por Matrícula**: Login usando matrícula CAIXA
- **Sistema de Aprovação**: Cadastros aprovados por gestores
- **Interface Responsiva**: Funciona em desktop e mobile
- **TypeScript**: Tipagem forte para maior segurança
- **Tailwind CSS**: Estilização moderna e consistente

## 🎨 Design System

### Cores
- **Azul CAIXA**: `#005CA9` (cor principal)
- **Laranja CAIXA**: `#F78100` (cor de destaque)
- **Azul Claro**: `#007DC5` (complementar)
- **Cinza**: `#6E6E6E` (texto secundário)

### Tipografia
- **Fonte Principal**: Nunito (Google Fonts)
- **Hierarquia**: H1 (34px), H2 (26px), H3 (20px), Body (15-16px)

### Componentes
- Botões primários, secundários e de destaque
- Campos de formulário com validação
- Cards e layouts responsivos
- Estados de loading e erro

## 📦 Instalação

1. **Clone o repositório:**
```bash
git clone <repository-url>
cd hacktoon-app
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Execute o projeto:**
```bash
npm run dev
```

4. **Acesse no navegador:**
```
http://localhost:5173
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── LoginForm.tsx   # Formulário de login
│   └── RegisterForm.tsx # Formulário de cadastro
├── contexts/           # Contextos React
│   └── AuthContext.tsx # Contexto de autenticação
├── pages/              # Páginas da aplicação
│   ├── AuthPage.tsx    # Página de autenticação
│   └── DashboardPage.tsx # Dashboard principal
├── types/              # Definições TypeScript
│   └── auth.ts         # Tipos de autenticação
├── App.tsx             # Componente principal
└── index.css           # Estilos globais
```

## 🔐 Funcionalidades de Autenticação

### Login
- Autenticação por matrícula CAIXA
- Validação de campos obrigatórios
- Estados de loading e erro
- Redirecionamento automático

### Cadastro
- Formulário completo com validação
- Campos: matrícula, nome, email, cargo, unidade
- Confirmação de senha
- Status de aprovação pendente

### Dashboard
- Informações do usuário logado
- Status da conta (ativo/pendente/inativo)
- Cards de funcionalidades
- Logout

## 🎯 Próximas Funcionalidades

- [ ] Sistema de submissão de ideias
- [ ] Dashboard para gestores
- [ ] Sistema de aprovação de cadastros
- [ ] Ranking de ideias
- [ ] Notificações em tempo real
- [ ] Integração com APIs CAIXA

## 🛠️ Tecnologias Utilizadas

- **React 18**: Biblioteca de interface
- **TypeScript**: Tipagem estática
- **Vite**: Build tool e dev server
- **Tailwind CSS**: Framework CSS
- **React Context**: Gerenciamento de estado

## 📱 Responsividade

O projeto é totalmente responsivo e funciona em:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Inicia o servidor de desenvolvimento
npm run build        # Gera build de produção
npm run preview      # Preview do build de produção
npm run lint         # Executa o linter
```

## 📄 Licença

Este projeto é desenvolvido para uso interno da CAIXA Econômica Federal.

## 👥 Equipe

Desenvolvido pela equipe de inovação da CAIXA em parceria com a GEINA (Gerência Nacional de Inovação).

---

**CAIXA Econômica Federal** - Transformando ideias em inovação 🚀
