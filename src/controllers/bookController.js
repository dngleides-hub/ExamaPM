const Book = require('../models/Book');
const fs = require('fs');
const path = require('path');

exports.createBook = async (req, res) => {
  try {
    const { title, author, description, category, isbn, publishedYear } = req.body;

    if (!req.files || !req.files.cover || !req.files.pdfFile) {
      return res.status(400).json({
        success: false,
        message: 'Capa e arquivo PDF são obrigatórios'
      });
    }

    const coverPath = `/uploads/covers/${req.files.cover[0].filename}`;
    const pdfPath = `/uploads/pdfs/${req.files.pdfFile[0].filename}`;

    const book = await Book.create({
      title,
      author,
      description,
      category,
      isbn,
      publishedYear,
      coverImage: coverPath,
      pdfFile: pdfPath,
      uploadedBy: req.userId
    });

    await book.populate('uploadedBy', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Livro criado com sucesso',
      book
    });
  } catch (error) {
    console.error('Erro ao criar livro:', error);

    if (req.files) {
      if (req.files.cover) {
        fs.unlinkSync(req.files.cover[0].path);
      }
      if (req.files.pdfFile) {
        fs.unlinkSync(req.files.pdfFile[0].path);
      }
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Erro de validação',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'ISBN já está cadastrado'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro ao criar livro'
    });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    
    let query = {};

    if (req.user.role === 'client') {
      query.uploadedBy = req.userId;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    const skip = (page - 1) * limit;

    const books = await Book.find(query)
      .populate('uploadedBy', 'name email role')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Book.countDocuments(query);

    res.json({
      success: true,
      count: books.length,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      books
    });
  } catch (error) {
    console.error('Erro ao listar livros:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar livros'
    });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('uploadedBy', 'name email role');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Livro não encontrado'
      });
    }

    if (req.user.role === 'client' && book.uploadedBy._id.toString() !== req.userId.toString()) {
      return res.status(404).json({
        success: false,
        message: 'Livro não encontrado'
      });
    }

    res.json({
      success: true,
      book
    });
  } catch (error) {
    console.error('Erro ao buscar livro:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Livro não encontrado'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro ao buscar livro'
    });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Livro não encontrado'
      });
    }

    if (req.user.role === 'client' && book.uploadedBy.toString() !== req.userId.toString()) {
      return res.status(404).json({
        success: false,
        message: 'Livro não encontrado'
      });
    }

    const coverPath = path.join(__dirname, '../public', book.coverImage);
    const pdfPath = path.join(__dirname, '../public', book.pdfFile);

    if (fs.existsSync(coverPath)) {
      fs.unlinkSync(coverPath);
    }
    if (fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }

    await Book.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Livro deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar livro:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Livro não encontrado'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro ao deletar livro'
    });
  }
};