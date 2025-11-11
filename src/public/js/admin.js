const API_URL = 'http://localhost:3000/api';
let token = null;
let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    token = localStorage.getItem('token');
    if (token) {
        checkAuth();
    }

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('createBookForm').addEventListener('submit', handleCreateBook);
});

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            token = data.token;
            currentUser = data.user;
            localStorage.setItem('token', token);
            
            if (currentUser.role !== 'admin') {
                showMessage('Acesso negado! Esta área é apenas para administradores.', 'error');
                logout();
                return;
            }

            showMessage('Login realizado com sucesso!', 'success');
            showMainContent();
            loadBooks();
        } else {
            showMessage(data.message || 'Erro ao fazer login', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        showMessage('Erro ao conectar com o servidor', 'error');
    }
}

async function checkAuth() {
    try {
        const response = await fetch(`${API_URL}/auth/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (data.success) {
            currentUser = data.user;
            if (currentUser.role === 'admin') {
                showMainContent();
                loadBooks();
            } else {
                logout();
            }
        } else {
            logout();
        }
    } catch (error) {
        logout();
    }
}

function showMainContent() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('userName').textContent = currentUser.name;
}

function logout() {
    token = null;
    currentUser = null;
    localStorage.removeItem('token');
    document.getElementById('loginSection').style.display = 'flex';
    document.getElementById('mainContent').style.display = 'none';
}

function showTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');
}

async function loadBooks() {
    try {
        const search = document.getElementById('searchInput').value;
        const category = document.getElementById('categoryFilter').value;
        
        let url = `${API_URL}/books?`;
        if (search) url += `search=${encodeURIComponent(search)}&`;
        if (category) url += `category=${encodeURIComponent(category)}`;

        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (data.success) {
            displayBooks(data.books);
            updateCategoryFilter(data.books);
        } else {
            showMessage(data.message || 'Erro ao carregar livros', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        showMessage('Erro ao carregar livros', 'error');
    }
}

function displayBooks(books) {
    const container = document.getElementById('booksList');
    
    if (books.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📚</div>
                <h3>Nenhum livro encontrado</h3>
                <p>Comece adicionando um novo livro ao catálogo</p>
            </div>
        `;
        return;
    }

    container.innerHTML = books.map(book => `
        <div class="book-card">
            <img src="${book.coverImage}" alt="${book.title}" class="book-cover" 
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22250%22><rect fill=%22%23f1f5f9%22 width=%22300%22 height=%22250%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%2364748b%22 font-size=%2218%22>📚 Sem Capa</text></svg>'">
            <div class="book-content">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">👤 ${book.author}</p>
                <p class="book-description">${book.description}</p>
                <div class="book-meta">
                    <span class="badge">📁 ${book.category}</span>
                    ${book.publishedYear ? `<span class="badge">📅 ${book.publishedYear}</span>` : ''}
                    ${book.isbn ? `<span class="badge">📖 ${book.isbn}</span>` : ''}
                </div>
                <div class="book-actions">
                    <a href="${book.pdfFile}" target="_blank" class="btn-view">📄 Ver PDF</a>
                    <button onclick="deleteBook('${book._id}')" class="btn-delete">🗑️</button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateCategoryFilter(books) {
    const categories = [...new Set(books.map(book => book.category))];
    const select = document.getElementById('categoryFilter');
    
    const currentValue = select.value;
    select.innerHTML = '<option value="">Todas as categorias</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });
    
    select.value = currentValue;
}

async function handleCreateBook(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);

    try {
        const response = await fetch(`${API_URL}/books`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            showMessage('Livro criado com sucesso!', 'success');
            e.target.reset();
            showTab('list');
            loadBooks();
        } else {
            showMessage(data.message || 'Erro ao criar livro', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        showMessage('Erro ao criar livro', 'error');
    }
}

async function deleteBook(bookId) {
    if (!confirm('Tem certeza que deseja deletar este livro?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/books/${bookId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (data.success) {
            showMessage('Livro deletado com sucesso!', 'success');
            loadBooks();
        } else {
            showMessage(data.message || 'Erro ao deletar livro', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        showMessage('Erro ao deletar livro', 'error');
    }
}

function showMessage(message, type) {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = message;
    messageBox.className = `message-box ${type} show`;
    
    setTimeout(() => {
        messageBox.classList.remove('show');
    }, 3000);
}