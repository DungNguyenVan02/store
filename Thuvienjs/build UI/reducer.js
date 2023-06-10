
import storage from "./util/storage.js"

const init = {
    todos: storage.get(),
    filter: 'all',
    filters: {
        all: () => true,
        active: todo => !todo.completed,
        completed: todo => todo.completed
    },
    indexEdit: null
    
}

const actions = {
    add({todos}, title) {
        if(title) {
            todos.push({
                title,
                completed: false
            })
            storage.set(todos);
        }
    },
    delete({todos}, index) {
        todos.splice(index, 1);
        storage.set(todos);
    },
    toggleChecked({todos}, index) {
        const todo = todos[index];
        todo.completed = !todo.completed;
        storage.set(todos)
    },
    toggleAll({todos}, type) {
        todos.forEach(todo => todo.completed = type)
        storage.set(todos)
    },
    switchFilter(state, select) {
        state.filter = select
    },
    clearCompleted(state) {
        state.todos = state.todos.filter(todo => !todo.completed)
        storage.set(state.todos)
    },
    startEdit(state, index) {
        state.indexEdit = index
    },
    endEdit(state, value) {
        if(state.indexEdit !== null) {
            if(value) {
                state.todos[state.indexEdit].title = value;
                storage.set(state.todos)
            } else{
                this.delete(state, state.indexEdit)
            }
            state.indexEdit = null;
        }
        if(value === '') {
            this.delete(state.todos, state.indexEdit)
        }
    }
}


function reducer(state = init, action, args) {
    actions[action] && actions[action](state, ...args)
    return state
}

export default reducer