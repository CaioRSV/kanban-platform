# kanban-platform

##### Descrição do projeto:

Plataforma de lista de tarefas com funcionalidades de Kanban e Dashboard com relatórios úteis sobre as tarefas do usuário.

##### Plataformas:
- Web
- Mobile (Android)

##### Stack:
- TypeScript
- React.js
- Next.js
- React Native (+Expo)
- Shadcnui
- Radix
- GraphQL
- PostgreSQL (Vercel Serverless)

---

##### Features:
- [x] Funcionalidades de Kanban 
- [x] Dashboard com gráficos
- [x] Arrastar e soltar (drag and drop)
- [x] Persistência de dados (serverless functions)
- [x] Relatórios gráficos dinâmicos
- [x] Documentação do projeto


###### Extras
- [x] Tags de importância ou prioridade para as tarefas (cores)
- [x] Aprimoramento ao design da interface

---

### Como rodar

Para se rodar localmente as versões de de desenvolvimento, devem se seguir os seguintes passos:

Para a aplicação web:
```
cd web-kanban-platform

npm run dev
```

Para a aplicação mobile:
```
cd mobile-kanban-platform

npx expo start
```
---

### Como utilizar a plataforma

https://kanban-platform.vercel.app/

Informe o seu nome de usuário para criar ou acessar sua área de trabalho. 
- Obs: Todas as áreas de trabalho são públicas (até então)
  - Usuário para visualização: `demo`

![image1](https://github.com/user-attachments/assets/c6538e25-6059-4723-b9f2-f158c2bed9b8)

---

![web_features_explanation](https://github.com/user-attachments/assets/59a59ef8-e1ee-45dd-b6da-8ef4efa7b3df)


- **A)** Nome do usuário (Botão direito para mudar de usuário)

- **B)** Carregar templates de tarefas, fazendo fetch de uma base GraphQL mockada independente da base geral da aplicação (Disponível apenas caso não existam tarefas em sua área de trabalho)

- **C)** Componente que permite visualizar o estado atual da base local GraphQL (por meio de resultado de queries)

- **D)** Salvar suas alterações na área de trabalho

- **E)** Colunas kanban que podem ser trocadas de lugar entre si, e que também podem ter seus nomes personalizados para cada usuário

- **F)** Adicionar uma nova tarefa à uma coluna

- **G)** Botão que marca as tarefas na coluna como concluídas e as libera da área de trabalho

- **H)** Visualizar relatórios em formato de gráficos sobre sua área de trabalho e tarefas concluídas anteriormente

---

Para cada tarefa individual, se tem um "card", que permite a edição dos dados dessas tarefas e também que elas sejam movidas de posição entre colunas ou na coluna de origem.

- Nome pode ser editado (Se habilita a edição clicando no texto de nome)
- Descrição pode ser editada (Se habilita a edição clicando no texto de descrição)
- Prioridade/Cor da tarefa pode ser modificada (Clicando no elemento circular colorido à esquerda)
- Tarefa pode ser arrastada (arrastar e soltar) para reordenar na coluna de origem ou em outras colunas
- Tarefa pode ser excluída (botão direito para a opção aparecer)

![image3](https://github.com/user-attachments/assets/f7679896-97bf-4d63-a834-e6d1d7261bca)

![image4](https://github.com/user-attachments/assets/d1415096-40fa-4e5d-805e-3753ab69d1e2)

