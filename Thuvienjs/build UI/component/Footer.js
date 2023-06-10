



import html from "../core.js";
import { connect } from "../store.js";

function Footer({todos, filters, filter}) {
    return html`
        <footer class="footer">
            <span class="todo-count">
                <strong>
                    ${todos.filter(filters.active).length}
                </strong> item left
            </span>
            <ul class="filters">
                ${Object.keys(filters).map(select => {
                    return html`
                        <li>
                            <a class="${filter === select && 'selected'}"
                            onclick="dispatch('switchFilter', '${select}')"
                            href="#"
                            >
                                ${select[0].toUpperCase() + select.slice(1)}
                            </a>
                        </li>
                    `
                })}
                
            </ul>
            ${todos.find(filters.completed) && 
                html`
                    <button onclick = "dispatch('clearCompleted')" class="clear-completed">Clear completed</button>
                `
            }
        </footer>
    `
}

export default connect()(Footer);