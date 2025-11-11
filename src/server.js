require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const pageRoutes = require('./routes/pageRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', pageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

app.use((err, req, res, next) => {
  console.error('Erro:', err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Erro de validação',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Arquivo muito grande. Tamanho máximo permitido: 10MB'
      });
    }
    return res.status(400).json({
      success: false,
      message: 'Erro no upload do arquivo'
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor'
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📚 Sistema de Gestão de Livros Digitais`);
  console.log(`🌐 Acesse: http://localhost:${PORT}`);
});