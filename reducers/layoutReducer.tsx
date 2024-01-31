export interface State {
  sidebarOpen: Boolean;
}

export interface Action {
  type: String;
}

export default function layoutReducer(state: State, action: Action) {
  switch (action.type) {
    case 'open_sidebar': {
      return {
        ...state,
        sidebarOpen: true
      }
    }
    case 'hide_sidebar': {
      return {
        ...state,
        sidebarOpen: false
      }
    }
  }
}
