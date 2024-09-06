import React from 'react';

import SetUserModal from '@/components/setUserModal';
import TopBar from '@/components/topBar/topBar';
import Workspace from '@/components/dragNdrop/workspace';
import GraphDrawer from '@/components/graphBar/graphDrawer';

import SaveColumns from '@/components/saveColumns';
import GraphQlMocker from '@/components/graphQlMocker';

// SetUserModal: Pop up/alerta de definição de usuário/área de trabalho 
// TopBar: Elementos do topo da página
// GraphQlMocker: Botão para importação de templates (query utilizando GraphQL Tools - Mock)
// SaveColumns: Botão que salva modificações na área de trabalho
// Workspace: Área Kanban
// GraphDrawer: Botão que apresenta o Drawer com relatórios em formato de gráfico

export default function App() {
  return (
        <main className="min-h-screen p-12 flex flex-col transition-all duration-500">
          <SetUserModal/>

          <div className={`w-full h-fit flex justify-center items-center`}>
            <TopBar/>
          </div>

          <div className="flex-1 flex-col w-full h-full flex justify-center items-center">
            
            <div className={`flex w-[80%] pt-4 pb-4`}>
              <GraphQlMocker/>
              <div className={`flex-1`}/>
              <SaveColumns/>
            </div>

            <div className={`w-[80%] h-full lg:flex justify-center items-center gap-4`}>
              <Workspace/>
            </div>

            <div className={`flex w-[80%] justify-center pt-4 pb-4`}>
              <GraphDrawer/>
            </div>

          </div>
        </main>
  );
}
