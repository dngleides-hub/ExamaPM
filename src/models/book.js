const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true,
    minlength: [2, 'Título deve ter no mínimo 2 caracteres']
  },
  author: {
    type: String,
    required: [true, 'Autor é obrigatório'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    trim: true,
    minlength: [10, 'Descrição deve ter no mínimo 10 caracteres']
  },
  category: {
    type: String,
    required: [true, 'Categoria é obrigatória'],
    trim: true
  },
  isbn: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  publishedYear: {
    type: Number,
    min: [1000, 'Ano inválido'],
    max: [new Date().getFullYear(), 'Ano não pode ser no futuro']
  },
  coverImage: {
    type: String,
    required: [true, 'Imagem da capa é obrigatória']
  },
  pdfFile: {
    type: String,
    required: [true, 'Arquivo PDF é obrigatório']
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

bookSchema.index({ title: 'text', author: 'text', description: 'text' });

module.exports = mongoose.model('Book', bookSchema);