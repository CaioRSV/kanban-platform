import { Task, User } from "@/app/schemaWrapper"
import { ExecutionResult, graphql, GraphQLSchema } from "graphql"

// Queries

export const getTasksFunction_GQL = async (id: number, done: boolean, schema?: GraphQLSchema): Promise<Task[] | undefined> => {
    if(schema){
      const query = `query AllTasks {
        tasks(id: ${id},done: ${done}){
      id,
      name,
      description,
      color,
      done,
      enddate,
      }
      }`
        const result: ExecutionResult = await graphql({
            schema,
            source: query
        })

        console.log(result);
        
        if (result.data && result.data.tasks) {
          const tasks: Task[] = result.data.tasks as Task[];
      
          return tasks
        }
      
        return undefined
    }
  }

//

export const getUserFunction_GQL = async (username: String, schema?: GraphQLSchema): Promise<User | undefined> => {
    if(schema){
      const query = `
    query getUser {
      user(name: "${username}") {
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
  
    if (result.data && result.data.user) {
      const user: User = result.data.user as User;
  
      return user
    }
  
    return undefined

    }
  }


// Mutations

export const updateTask_GQL = async (id: number, attribute: string, value: string, schema?: GraphQLSchema) =>{
    if(schema){
        const query = `mutation AttTask($id: ID!, $attribute: String!, $value: String!) {
            updateTask(id: $id, attribute: $attribute, value: $value){
                    id,
                    name,
                    description,
                    color
                }
            }
          `
      
          const vars = {
              "id": id,
              "attribute": attribute,
              "value": value
          }
      
          const result: ExecutionResult = await graphql({
              schema,
              source: query,
              variableValues: vars
          })

          //console.log(result);
          return result;
    }
}

export const addTask_GQL = async (id: number, name: String, columnId: number, serverId: number, userId: number, schema?: GraphQLSchema) =>{
  if(schema){
        const query = `mutation addTask($id: Int!, $name: String!, $columnId: Int!, $serverId: Int!, $userId: Int!) {
            addTask(id: $id, name: $name, columnId: $columnId, serverId: $serverId, userId: $userId){
                    id,
                    name,
                    columnId,
                    color
                }
            }
          `
      
          const vars = {
              "id": id,
              "name": name,
              "columnId": columnId,
              "serverId": serverId,
              "userId": userId
          }
      
          const result: ExecutionResult = await graphql({
              schema,
              source: query,
              variableValues: vars
          })
        
          // console.log("¨¨¨¨")
          // console.log(result);
          return result;
    }
}

//

export const deleteTask_GQL = async (id: number, userId:string, schema?: GraphQLSchema) =>{
  if(schema){
        const query = `mutation removeTask($id: Int!, $userId: ID!) {
            deleteTask(id: $id, userId: $userId){
                    id,
                    name,
                    columnId,
                    color
                }
            }
          `
      
          const vars = {
              "id": id,
              "userId": userId
          }
      
          const result: ExecutionResult = await graphql({
              schema,
              source: query,
              variableValues: vars
          })
        
          //console.log("¨¨¨¨")
          //console.log(result);
          return result;
    }
}


//

export const updateColumn_GQL = async (userId: number, columnName: string, value: string, schema?: GraphQLSchema) =>{
    if(schema){
        const query = `mutation AttColumn($userId: ID!, $column_name: String!, $value: String!) {
            updateColumn(userId: $userId, column_name: $column_name, value: $value){
                    id,
                    name,
                    column1_name,
                    column2_name,
                    column3_name
                }
            }
          `
      
          const vars = {
              "userId": userId,
              "column_name": columnName,
              "value": value
          }
      
          const result: ExecutionResult = await graphql({
              schema,
              source: query,
              variableValues: vars
          })
        
          //console.log(result);
          return result;
    }
}

//

export const orderColumn_GQL = async (userId: number, columnName: string, value: number[], schema?: GraphQLSchema) =>{
  if(schema){
      const query = `mutation OrderColumn($userId: ID!, $column_name: String!, $value: [Int]!) {
          orderColumn(userId: $userId, column_name: $column_name, value: $value){
                  id,
                  name,
                  column1_name,
                  column2_name,
                  column3_name
              }
          }
        `
    
        const vars = {
            "userId": userId,
            "column_name": columnName,
            "value": value
        }
    
        const result: ExecutionResult = await graphql({
            schema,
            source: query,
            variableValues: vars
        })
      
        //console.log(result);
        return result;
  }
}