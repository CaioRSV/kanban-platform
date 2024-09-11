import { View } from 'react-native'
import { ScrollView } from 'react-native-virtualized-view'

import { useColorScheme } from 'nativewind';

import SetUserModal from './setUserModal';
import TopBar from './topBar/topBar';
import SaveColumns from './saveColumns';
import Workspace from './dragNdrop/workspace';
import GraphDrawer from './graphs/graphDrawer';

import SchemaWrapper from './schemaComponents/schemaWrapper';
import SchemaVisualizer from './schemaComponents/schemaVisualizer';

// SchemaWrapper: "Provider" de props da base GraphQL local mockada para permitir queries e mutations nela

// SetUserModal: Pop up/alerta de definição de usuário/área de trabalho 
// TopBar: Elementos do topo da página
// GraphQlMocker: Botão para importação de templates (query utilizando GraphQL Tools - Mock)
// SaveColumns: Botão que salva modificações na área de trabalho
// Workspace: Área Kanban
// GraphDrawer: Botão que apresenta o Drawer com relatórios em formato de gráfico

const Main = () => {
  const {colorScheme} = useColorScheme();

  return (
    <View style={{overflow: 'scroll'}} className={`h-full w-full dark:bg-black p-8 relative`}>
      <SchemaWrapper>
        
        <SetUserModal theme={colorScheme=='dark'?'dark':'light'}/> 

        <TopBar/>

        <ScrollView>
          <SaveColumns/>
          <Workspace theme={colorScheme=='dark' ? 'dark' : 'light'}/>
          <SchemaVisualizer theme={colorScheme=='dark' ? 'dark' : 'light'}/>
          <GraphDrawer/>
        </ScrollView>

      </SchemaWrapper>
    </View>
  )
}

export default Main