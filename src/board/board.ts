declare module 'microrx' {
  interface MRXState {
    user?: {
      id: string;
      name: string;
    };
  }
}

//window.$state = reactive(SSR_STATE);

//$state.board.columns.push(...)
//$state.user = { id: '1', name: 'Leo' }
