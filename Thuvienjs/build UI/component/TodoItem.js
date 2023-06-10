

import html from "../core.js";
import {connect} from "../store.js";

function TodoItem({todo, index, indexEdit}) {
    return html`
        <li class="${todo.completed && 'completed'} ${indexEdit === index && 'editing'}  ">
            <div class="view">
                <input 
                    class="toggle" 
                    type="checkbox"
                    onchange="dispatch('toggleChecked', ${index})"
                    ${todo.completed && 'checked'}
                >
                <label ondblclick = "dispatch('startEdit', ${index})">${todo.title}</label>
                <button class="destroy" onclick = "dispatch('delete', ${index})"></button>
            </div>
            <input 
                class="edit" 
                onkeyup = "event.keyCode === 13 && dispatch('endEdit', this.value)" 
                onblur = "dispatch('endEdit', this.value)" 
                value="${todo.title}">
        </li>
    `
}




export default connect()(TodoItem);