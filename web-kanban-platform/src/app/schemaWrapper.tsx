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
    startDate?: Date
    endDate?: Date
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
        startDate: DateTime
        endDate: DateTime
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
        addTask(id: ID!, name: String!, columnId: Int!, serverId: Int!, userId: Int!): Task
      }
    `;
    
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

          //console.log(id);
          // console.log(Object.values(tasks))
          // console.log(Object.values(tasks).filter(elem => elem.userid == id))

            try{
                if(done!=undefined && done!=null){
                    // console.log("0040404004040-1")
                    // console.log(Object.values(tasks).filter(elem => elem.done==done && elem.userid==id));

                    return Object.values(tasks).filter(elem => elem.done==done && elem.userid==id);
                }
                else{
                    // console.log("0040404004040-2")
                    // console.log(Object.values(tasks).filter(elem => elem.userid==id))

                    return Object.values(tasks).filter(elem => elem.userid==id);
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

          setUsers({[userData.id.toString()]: userData})

          return 'Logado com sucesso';
        },
        populateTasks: async (_: unknown, { id }: { id: number }): Promise<string> => {
            const userData = await fetchTasks(id);

            if (!userData) {
              //console.log('Tasks not found');
            }

            const newTasks: Record<string, Task> = {}

            userData?.forEach(elem => {
                newTasks[elem.id] = elem
            })

            //console.log(newTasks);

            setTasks(newTasks)

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
                done: (value) ? true : false
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
          }
          
          tasks[id.toString()] = resElem;

          if(columnId==1){
            users[userId.toString()] = {
              ...users[userId.toString()],
              column1: [...users[userId.toString()].column1, id]
            }
          }
          else if(columnId==2){
            users[userId.toString()] = {
              ...users[userId.toString()],
              column2: [...users[userId.toString()].column2, id]
            }
          } 
          else if(columnId==3){
            users[userId.toString()] = {
              ...users[userId.toString()],
              column3: [...users[userId.toString()].column3, id]
            }
          }

          return resElem;

        }
      },
      DateTime
    };
    
    const schema = makeExecutableSchema({ typeDefs: schemaString, resolvers });

    const loginFunction = async () =>{
        const query = `mutation Login($username: String!) {
          login(username: $username)
          }
        `

        const vars = {
            "username": "Caio",
            "id": 1725277995
        }

        const result: ExecutionResult = await graphql({
            schema,
            source: query,
            variableValues: vars
        })

        //console.log(result);
    }

    const popFunction = async () =>{
        const query = `mutation PopTasks($id: Int!) {
          populateTasks(id: $id)
        }
        `

        const vars = {
            "username": "Caio",
            "id": 1725277995
        }

        const result: ExecutionResult = await graphql({
            schema,
            source: query,
            variableValues: vars
        })
        //console.log(result);
    }

    const getUserFunction = async () =>{
        const query = `
        query getUser {
        user(name: "Caio") {
          id
          name
          column1
          column1_name
					column2
					column2_name
					column3
					column3_name
  }
}
        `
        const result: ExecutionResult = await graphql({
            schema,
            source: query
        })
        //console.log(result);
    }

    const getTasksFunction = async () =>{
        const query = `query AllTasks {
        tasks(done: true){
		id,
		name,
		description,
		color,
		done,
	}
}`
        const result: ExecutionResult = await graphql({
            schema,
            source: query
        })
        //console.log(result);
    }


      // Pass schemaObject to children


  // Helper function to recursively clone children and pass props
  const cloneChildrenWithProps = (child: ReactNode): ReactNode => {
      if (React.isValidElement(child)) {
        // Recursively apply the function to children
        const clonedChild = React.cloneElement(
          child as React.ReactElement<ChildComponentProps>,
          { schema, users_schema: users, tasks_schema: tasks },
          child.props.children ? React.Children.map(child.props.children, cloneChildrenWithProps) : null
        );
        return clonedChild;
      }
      return child;
    };

    // Recursively apply props to all children
    const childrenWithProps = React.Children.map(children, cloneChildrenWithProps);

    return <>{childrenWithProps}</>;
}

export default SchemaWrapper