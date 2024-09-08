import { NextResponse } from 'next/server';
import { graphql, ExecutionResult, GraphQLScalarType, Kind } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import DateTime from './resolve_defs';


export type Id = string | number;

interface User {
  id: string;
  name: string;
  column1: number[];
  column1_name: string;
  column2: number[];
  column2_name?: string;
  column3: number[];
  column3_name?: string;
}

interface Task {
    id: number
    name: string
    columnId: Id,
    description?: string
    color?: string
    startDate?: Date
    endDate?: Date
    done?: boolean

    serverId: number
};


interface ResponseUser {
  resposta: {
    rows: User[];
  };
}

interface ResponseTasks {
    resposta: {
      rows: Task[];
    };
  }

// Alvo mock de infos
let users: Record<string, User> = {};

let tasks: Record<string, Task> = {};


// Função populadora do Mock Object de início (login), único momento de fetch para funções primárias da aplicação
async function fetchUserData(username: string): Promise<User | null> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user?name=${username}`);
  const data: ResponseUser = await response.json();

  console.log(data);

  if (data.resposta && data.resposta.rows.length > 0) {
    return data.resposta.rows[0];
  }

  return null;
}

// Função populadora de tasks do usuário logado
async function fetchTasks(id: number): Promise<Task[] | null> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/getAll?user=${id}`);
    const data: ResponseTasks = await response.json();
  
    console.log(data);
  
    if (data.resposta && data.resposta.rows.length > 0) {
      return data.resposta.rows;
    }
  
    return null;
  }


const schemaString = `
  scalar DateTime

  type User {
    id: ID!
    name: String!
    column1: [Int]
    column1_name: String
    column2: [Int]
    column2_name: String
    column3: [Int]
    column3_name: String
  }

  type Task {
    id: ID!
    name: String!
    columnId: Int!
    description: String
    color: String
    startDate: DateTime
    endDate: DateTime
    done: Boolean
    serverId: Int!
  }

  type Query {
    user(id: ID, name: String): User
    tasks(id: ID, done: Boolean): [Task]  # Updated to return a list of tasks
  }

  type Mutation {
    login(username: String!): String
    populateTasks(id: Int!): String
    updateColumnName(id: ID!, column: String!, newColumnName: String!): User

  }
`;

const resolvers = {
  Query: {
    user: (_: unknown, { id, name }: { id?: string; name?: string }): User | undefined => {

      console.log(users);

      if (id) {
        return users[id];
      } else if (name) {
        return Object.values(users).find((user) => user.name === name);
      }
      throw new Error('ID or name are required');
    },
    tasks: (_: unknown, { done }: {id: string, done: boolean}): Task[] | undefined => {

        console.log(users);
        console.log("=====================================")
        console.log(tasks);

        try{
            if(done!=undefined && done!=null){
                return Object.values(tasks).filter(elem => elem.done==done);
            }
            else{
                return Object.values(tasks);
            }
        }
        catch{
            throw new Error('ID or name are required');
        }
        

    }
  },
  Mutation: {
    login: async (_: unknown, { username }: { username: string }): Promise<string> => {
      if (Object.values(users).find((user) => user.name === username)) {
        return 'User already logged in';
      }

      const userData = await fetchUserData(username);

      if (!userData) {
        throw new Error('User not found');
      }
      
      users[userData.id.toString()] = userData;

      console.log(users);
      return 'Logado com sucesso';
    },
    populateTasks: async (_: unknown, { id }: { id: number }): Promise<string> => {
        if (Object.values(tasks).length > 0) {
            console.log(tasks)
          return 'User already has tasks populated';
        }
  
        const userData = await fetchTasks(id);
  
        if (!userData) {
          console.log('Tasks not found');
        }
        
        userData?.forEach(elem => {
            tasks[elem.id] = elem
        })
  
        console.log(tasks);
        return 'Tasks populadas com sucesso';
      },

    updateColumnName: (
      _: unknown,
      { id, column, newColumnName }: { id: string; column: string; newColumnName: string }
    ): User | undefined => {
      const user = users[id];
      if (user) {
        if (['column1', 'column2', 'column3'].includes(column)) {
          (user as any)[`${column}_name`] = newColumnName;
          return user;
        } else {
          throw new Error('Invalid column name');
        }
      }
      throw new Error('User not found');
    },
  },
  DateTime
};

const schema = makeExecutableSchema({ typeDefs: schemaString, resolvers });

interface GraphQLRequestBody {
  query: string;
  variables?: Record<string, any>;
}

export async function POST(req: Request) {
  const { query, variables }: GraphQLRequestBody = await req.json();

  const result: ExecutionResult = await graphql({
    schema,
    source: query,
    variableValues: variables,
  });

  return NextResponse.json(result);
}