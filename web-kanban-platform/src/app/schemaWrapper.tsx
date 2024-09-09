"use client";
import React, { useState, useEffect, ReactNode } from 'react'

import { graphql, ExecutionResult, GraphQLScalarType, Kind, GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';

import DateTime from './api/graphql/resolve_defs';


import App from './app';
import SetUserModal from '@/components/setUserModal';

export type Id = string | number;

export interface User {
  id: string;
  name: string;
  column1: number[];
  column1_name: string;
  column2: number[];
  column2_name?: string;
  column3: number[];
  column3_name?: string;
}

export interface Task {
    id: number
    name: string
    columnId: Id,
    description?: string
    color?: string

    startdate?: Date,
    enddate?: Date,

    done?: boolean

    serverId: number
    userid?: number
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



//

interface SchemaWrapperProps {
  children: ReactNode;
}

interface ChildComponentProps {
  schema: GraphQLSchema;
  users_schema: Record<string, User>;
  tasks_schema: Record<string, Task>;
}

const SchemaWrapper: React.FC<SchemaWrapperProps> = ({ children }) => {
    // Alvo mock de infos
    const [users, setUsers] =  useState<Record<string, User>>({});
    const [tasks, setTasks] =  useState<Record<string, Task>>({});
    
    // Função populadora do Mock Object de início (login), único momento de fetch para funções primárias da aplicação
    async function fetchUserData(username: string): Promise<User | null> {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user?name=${username}`);
      const data: ResponseUser = await response.json();
    
      //console.log(data);
    
      if (data.resposta && data.resposta.rows.length > 0) {
        return data.resposta.rows[0];
      }
    
      return null;
    }
    
    // Função populadora de tasks do usuário logado
    async function fetchTasks(id: number): Promise<Task[] | null> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/getAll?user=${id}`);
        const data: ResponseTasks = await response.json();
      
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
        startdate: DateTime
        enddate: DateTime
        done: Boolean
        serverId: Int!
      }
    
      type Query {
        user(id: ID, name: String): User
        tasks(id: ID, done: Boolean): [Task]
      }
    
      type Mutation {
        login(username: String!): String
        populateTasks(id: Int!): String
        updateTask(id: ID!, attribute: String!, value: String!): Task
        updateColumn(userId: ID!, column_name: String!, value: String!): User
        addTask(id: Int!, name: String!, columnId: Int!, serverId: Int!, userId: Int!): Task
        deleteTask(id: Int!, userId: ID!): Task
        orderColumn(userId: ID!, column_name: String!, value: [Int]!): User
      }
    `;

    // Uso de INT ao invés do ID em alguns casos de organização de colunas
    // para manter a lógica original de contextos do código
    
    const resolvers = {
      Query: {
        user: (_: unknown, { id, name }: { id?: string; name?: string }): User | undefined => {    
          if (id) {
            return users[id];
          } else if (name) {
            return Object.values(users).find((user) => user.name === name);
          }
          throw new Error('ID or name are required');
        },
        tasks: (_: unknown, { id, done }: {id: number, done: boolean}): Task[] | undefined => {
            try{
                if(done!=undefined && done!=null){

                    const resObject = Object.values(tasks)
                      .map(item => {
                        return {
                          ...item,
                          startdate: item.startdate ? new Date(item.startdate) : undefined,
                          enddate: item.enddate ? new Date(item.enddate) : undefined
                        }
                      })
                      .filter(elem => elem.done==done && elem.userid==id)

                    return resObject
                }
                else{

                    const resObject = Object.values(tasks)
                      .map(item => {
                        return {
                          ...item,
                          startdate: item.startdate ? new Date(item.startdate) : undefined,
                          enddate: item.enddate ? new Date(item.enddate) : undefined
                        }
                      })
                      .filter(elem => elem.userid==id)

                    return resObject
                }
            }
            catch{
                throw new Error('ID or name are required');
            }
            
        }
      },
      Mutation: {
        login: async (_: unknown, { username }: { username: string }): Promise<string> => {
    
          const userData = await fetchUserData(username);
    
          if (!userData) {
            throw new Error('User not found');
          }

          users[userData.id.toString()] = userData;

          return 'Logado com sucesso';
        },
        populateTasks: async (_: unknown, { id }: { id: number }): Promise<string> => {
            const userData = await fetchTasks(id);

            if (!userData) {
              //console.log('Tasks not found');
            }

            userData?.forEach(elem => {
                tasks[elem.id] = elem
            })

            return 'Tasks populadas com sucesso';
          },
        updateTask: (_: unknown, { id, attribute, value }: { id: number, attribute: string, value: string}): Task | null => {
          const foundTask = tasks[id.toString()];
          if(foundTask){

            if(attribute=="name"){
              const alteredTask: Task = {
                ...foundTask,
                name: value
              }

              tasks[id] = alteredTask;

              return alteredTask;
            }
            else if (attribute=="description"){
              const alteredTask: Task = {
                ...foundTask,
                description: value
              }

              tasks[id] = alteredTask;

              return alteredTask;
            }
            else if (attribute=="color"){
              const alteredTask: Task = {
                ...foundTask,
                color: value
              }

              tasks[id] = alteredTask;

              return alteredTask;
            }

            else if (attribute=="done"){

              const alteredTask: Task = {
                ...foundTask,
                done: (value) ? true : false,
                enddate: new Date()
              }

              tasks[id] = alteredTask;

              return alteredTask;
            }

          }
          return null;
        },
        updateColumn: (_: unknown, {userId, column_name, value }: { userId:number, column_name: string, value: string}): User | null => {
          const user = users[userId.toString()];
          if (user) {
            if (['column1', 'column2', 'column3'].includes(column_name)) {
              (user as any)[`${column_name}_name`] = value;
              
              return user;
            
            } else {
              throw new Error('Nome de coluna inválido');
            }
          }
          throw new Error('UserID inválido');
        },

        addTask: (_: unknown, {id, name, columnId, serverId, userId} : {id: number, name: string, columnId: number, serverId: number, userId: number}): Task | null => {
          const resElem = {
            id: id,
            name: name,
            columnId: columnId,
            serverId: serverId,
            userid: userId,
            done: false
          };

          tasks[id.toString()] = resElem;

          if(
            users[userId.toString()].column1.includes(id) ||
            users[userId.toString()].column2.includes(id) ||
            users[userId.toString()].column3.includes(id)
            ) return null;

          if (columnId === 1) {
            users[userId.toString()].column1 = [...users[userId.toString()].column1, id];
          } else if (columnId === 2) {
            users[userId.toString()].column2 = [...users[userId.toString()].column2, id];
          } else if (columnId === 3) {
            users[userId.toString()].column3 = [...users[userId.toString()].column3, id];
          }

          return resElem;
      },

      deleteTask: (_: unknown, {id, userId} : {id: number, userId: string}): Task | null => {
        
        const deletedTask = tasks[id];

        users[userId] = {
          ...users[userId],
          column1: users[userId].column1.filter(elem => elem!=id),
          column2: users[userId].column2.filter(elem => elem!=id),
          column3: users[userId].column3.filter(elem => elem!=id)
        }
        // console.log('!!!!!!!!!!')
        // //console.log(tasks);
        // //console.log(deletedTask);
        // console.log(id.toString());
        // console.log(tasks[id.toString()]);
        // console.log('!!!!!!!!!!')

        delete tasks[id.toString()];

        return deletedTask
      },

      orderColumn: (_: unknown, {userId, column_name, value }: { userId:number, column_name: string, value: number[]}): User | null => {
        const user = users[userId.toString()];
        if (user) {
          if (['column1', 'column2', 'column3'].includes(column_name)) {
            (user as any)[`${column_name}`] = value;
            return user;
          
          } else {
            throw new Error('Coluna inválida');
          }
        }
        throw new Error('UserID inválido');
      }

      },
      DateTime: DateTime
    };
    
    const schema = makeExecutableSchema({ typeDefs: schemaString, resolvers });


  const cloneChildrenWithProps = (child: ReactNode): ReactNode => {
      if (React.isValidElement(child)) {
        const clonedChild = React.cloneElement(
          child as React.ReactElement<ChildComponentProps>,
          { schema, users_schema: users, tasks_schema: tasks },
          child.props.children ? React.Children.map(child.props.children, cloneChildrenWithProps) : null
        );
        return clonedChild;
      }
      return child;
    };

    const childrenWithProps = React.Children.map(children, cloneChildrenWithProps);

    return <>{childrenWithProps}</>;
}

export default SchemaWrapper