
const STORAGE_kEY = 'TODO_kEY';

export default {
    get() {
        return JSON.parse(localStorage.getItem(STORAGE_kEY)) || [];
    },
    set(todo) {
        localStorage.setItem(STORAGE_kEY, JSON.stringify(todo))
    }
}