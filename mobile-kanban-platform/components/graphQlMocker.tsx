import { View, Text } from 'react-native'
import React, { useState } from 'react'

// Funções utils
import { addTask, updateLocal } from '../utils/graphQlMock_functions';

// Fazendo lógica de mock de um schema GraphQL
import { graphql, ExecutionResult } from 'graphql';
import { addMocksToSchema } from '@graphql-tools/mock';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { useTaskContext } from './contexts/tasksContext';
import { useUserContext } from './contexts/userContext';

// Schema a ser mockado
const schemaString = `
  type Template {
    id: ID!
    name: String!
    tasks: [Todo!]!
  }

  type Todo {
    id: ID!
    title: String!
    description: String!
    priority: Int!
  }

  type Query {
    template(id: ID!): Template
  }
`;

// Interfaces correspondentes aos tipos

interface Todo {
  id: string;
  title: string;
  description: string;
  priority: number;
}

interface TemplateData {
  id: string;
  name: string;
  tasks: Todo[];
}

const schema = makeExecutableSchema({ typeDefs: schemaString }); // Criando instância de schema mockado


// Populando schema com dados (que serão alvos da query mais abaixo)
const schemaWithMocks = addMocksToSchema({
  schema,
  mocks: {
    Template: () => {
      const templates = [
        {
          id: '1',
          name: 'Casual',
          tasks: [
            { id: '1', title: 'Comprar mantimentos', description: 'Leite, Pão, Queijo, Ovos', priority: 2 },
            { id: '2', title: 'Terminar projeto', description: 'Completar o projeto de GraphQL', priority: 3 },
            { id: '3', title: 'Planejar uma viagem', description: 'Planejar uma viagem com amigos', priority: 1 },
            { id: '4', title: 'Ir para a academia', description: 'Fazer exercícios', priority: 4 },
          ],
        },
        {
          id: '2',
          name: 'Profissional',
          tasks: [
            { id: '5', title: 'Revisar relatório financeiro', description: 'Completar a revisão e análise do relatório financeiro mensal', priority: 2 },
            { id: '6', title: 'Desenvolver estratégia de marketing', description: 'Elaborar o plano de marketing para o próximo trimestre', priority: 1 },
            { id: '7', title: 'Atualizar documentação de projeto', description: 'Revisar e atualizar a documentação técnica do projeto', priority: 3 },
            { id: '8', title: 'Agendar reuniões de equipe', description: 'Organizar e confirmar as reuniões semanais com a equipe', priority: 4 },
          ],
        },
      ];

      return templates[Math.floor(Math.random() * templates.length)];
    },
  },
});

//


const GraphQlMocker = () => {
    // Contextos
    const { tasks, setTasks } = useTaskContext();
    const {user, id, loadingTasks, setLoadingTasks} = useUserContext();

    // Variáveis de estado locais
    const [todo, setTodo] = useState<Todo[]>([]); // Lista a ser enviada e transformada em tasks
    const [alertOpen, setAlertOpen] = useState<boolean>(false); // Alert de confirmação de importação de templates

    // Função de query
    const fetchTodo = (chosenTemplate: number) => {
        graphql({
        schema: schemaWithMocks,
        source: `
        query tasksForTemplate {
            template(id: ${chosenTemplate}) {
            id
            name
            tasks {
                id
                title
                description
                priority
            }
            }
        }
        `,
        })
        .then((result: ExecutionResult) => {
            if (result.data && 'template' in result.data) {
            const templateData = result.data as { template: TemplateData };
            setTodo(templateData.template.tasks);
            } else {
            console.error("Unexpected result structure:", result);
            }
        })
        .catch((error) => {
            console.error("Error fetching todo:", error);
        });

        return [];
    };

    // Função para exibir alerta de confirmação 
    const populateTasks = (chosenNumber: number) => {
        fetchTodo(chosenNumber);
        setAlertOpen(true)
    }
    //

    return (
        <View>
            <Text>graphQlMocker</Text>
        </View>
    )
}

export default GraphQlMocker