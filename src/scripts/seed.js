require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Book = require('../models/Book');
const connectDB = require('../config/database');

const seedData = async () => {
  try {
    await connectDB();

    console.log('🗑️  Limpando banco de dados...');
    await User.deleteMany({});
    await Book.deleteMany({});

    console.log('👤 Criando usuários...');
    const adminUser = await User.create({
      name: 'Admin Principal',
      email: 'admin@ebooks.com',
      password: 'Admin@123',
      role: 'admin'
    });

    const clientUser = await User.create({
      name: 'Cliente Teste',
      email: 'cliente@ebooks.com',
      password: 'Cliente@123',
      role: 'client'
    });

    console.log('✅ Usuários criados:');
    console.log(`   Admin: ${adminUser.email} / Admin@123`);
    console.log(`   Cliente: ${clientUser.email} / Cliente@123`);

    console.log('\n📚 Criando livros de exemplo...');
    
    const books = [
      {
        title: 'Dom Casmurro',
        author: 'Machado de Assis',
        description: 'Romance clássico da literatura brasileira que narra a história de Bentinho e Capitu, explorando temas como ciúme, memória e ambiguidade.',
        category: 'Literatura Brasileira',
        isbn: '978-8535911664',
        publishedYear: 1899,
        coverImage: '/uploads/covers/sample-cover-1.jpg',
        pdfFile: '/uploads/pdfs/sample-book-1.pdf',
        uploadedBy: adminUser._id
      },
      {
        title: 'Grande Sertão: Veredas',
        author: 'João Guimarães Rosa',
        description: 'Obra-prima do regionalismo brasileiro, narra a história de Riobaldo, ex-jagunço que relembra suas aventuras pelo sertão.',
        category: 'Literatura Brasileira',
        isbn: '978-8535908770',
        publishedYear: 1956,
        coverImage: '/uploads/covers/sample-cover-2.jpg',
        pdfFile: '/uploads/pdfs/sample-book-2.pdf',
        uploadedBy: adminUser._id
      },
      {
        title: 'O Cortiço',
        author: 'Aluísio Azevedo',
        description: 'Romance naturalista que retrata a vida em uma habitação coletiva no Rio de Janeiro do século XIX.',
        category: 'Literatura Brasileira',
        isbn: '978-8508040537',
        publishedYear: 1890,
        coverImage: '/uploads/covers/sample-cover-3.jpg',
        pdfFile: '/uploads/pdfs/sample-book-3.pdf',
        uploadedBy: adminUser._id
      },
      {
        title: 'Memórias Póstumas de Brás Cubas',
        author: 'Machado de Assis',
        description: 'Romance revolucionário narrado por um defunto, que conta sua vida de forma irônica e filosófica.',
        category: 'Literatura Brasileira',
        isbn: '978-8535911671',
        publishedYear: 1881,
        coverImage: '/uploads/covers/sample-cover-4.jpg',
        pdfFile: '/uploads/pdfs/sample-book-4.pdf',
        uploadedBy: adminUser._id
      },
      {
        title: 'Capitães da Areia',
        author: 'Jorge Amado',
        description: 'Romance sobre um grupo de meninos de rua em Salvador, explorando temas sociais e humanísticos.',
        category: 'Literatura Brasileira',
        isbn: '978-8535914061',
        publishedYear: 1937,
        coverImage: '/uploads/covers/sample-cover-5.jpg',
        pdfFile: '/uploads/pdfs/sample-book-5.pdf',
        uploadedBy: clientUser._id
      }
    ];

    const createdBooks = await Book.insertMany(books);
    
    console.log(`✅ ${createdBooks.length} livros criados com sucesso!`);
    
    console.log('\n📊 Resumo:');
    console.log(`   Total de usuários: ${await User.countDocuments()}`);
    console.log(`   Total de livros: ${await Book.countDocuments()}`);
    
    console.log('\n🎉 Seed concluído com sucesso!');
    console.log('\n📝 Credenciais para teste:');
    console.log('   Admin: admin@ebooks.com / Admin@123');
    console.log('   Cliente: cliente@ebooks.com / Cliente@123');
    
    console.log('\n⚠️  NOTA: Os livros foram criados com caminhos de exemplo.');
    console.log('   Para ter imagens e PDFs reais, faça upload através da API.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  }
};

seedData();