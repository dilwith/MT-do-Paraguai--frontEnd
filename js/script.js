const baseURL = 'http://localhost:3001/tarefa';

const loadTasks = async () => {
    try {
        const response = await fetch(`${baseURL}/get`);
        const tasks = await response.json();
        displayTasks(tasks);
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
    }
};

const displayTasks = (tasks) => {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.map(task => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');

        const statusClass = task.status === 'pendente' ? 'pendente' : 'concluida';
        taskItem.innerHTML = `
            <span>${task.title}: ${task.description}</span>
            <span class="status ${statusClass}">${task.status}</span>
            <div class="task-actions">
                <button class="delete-btn" onclick="deleteTask(${task.id})">Excluir</button>
            </div>
        `;

        // Adiciona evento de edição apenas para tarefas pendentes
        if (task.status === 'pendente') {
            const editButton = document.createElement('button');
            editButton.innerText = 'Editar';
            editButton.onclick = () => openEditModal(task);
            taskItem.appendChild(editButton);
        }

        taskList.appendChild(taskItem);
    });
};

const addTask = async () => {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    if (!title || !description) {
        alert('Preencha todos os campos!');
        return;
    }

    const newTask = { title, description, status: 'pendente' };

    try {
        await fetch(`${baseURL}/post`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask),
        });

        loadTasks();
    } catch (error) {
        console.error('Erro ao adicionar tarefa:', error);
    }
};

const deleteTask = async (id) => {
    try {
        await fetch(`${baseURL}/delete/${id}`, {
            method: 'DELETE',
        });

        loadTasks();
    } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
    }
};

// Função para abrir o modal de edição
const openEditModal = (task) => {
    document.getElementById('editTitle').value = task.title;
    document.getElementById('editDescription').value = task.description;
    document.getElementById('saveEditBtn').setAttribute('data-id', task.id);
    document.getElementById('editModal').style.display = 'block';
};

// Função para fechar o modal
const closeModal = () => {
    document.getElementById('editModal').style.display = 'none';
};

// Função para salvar as alterações da tarefa
const saveEditTask = async () => {
    const id = document.getElementById('saveEditBtn').getAttribute('data-id');
    const title = document.getElementById('editTitle').value;
    const description = document.getElementById('editDescription').value;

    if (!title || !description) {
        alert('Preencha todos os campos!');
        return;
    }

    const updatedTask = { title, description };

    try {
        await fetch(`${baseURL}/put/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask),
        });

        closeModal(); // Fecha o modal após salvar
        loadTasks(); // Recarrega as tarefas
    } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
    }
};

// Adiciona eventos aos botões
document.getElementById('addTaskBtn').addEventListener('click', addTask);
document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('saveEditBtn').addEventListener('click', saveEditTask);

// Carrega as tarefas ao iniciar a página
window.onload = loadTasks;
