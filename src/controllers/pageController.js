exports.getHomePage = (req, res) => {
  const projectInfo = {
    name: 'Sistema de Gestão de Livros Digitais',
    description: 'Plataforma completa para gerenciamento de e-books com funcionalidades separadas para administradores e clientes. Permite upload de capas e arquivos PDF, com sistema de autenticação JWT seguro.',
    features: [
      'Upload de livros digitais (PDF) com capas personalizadas',
      'Autenticação JWT com roles (Admin/Cliente)',
      'Gestão completa do catálogo de livros',
      'Interface intuitiva e responsiva',
      'API RESTful segura e documentada'
    ],
    team: [
      { name: 'Dalva Cristóvão Paixão', studentNumber: '2522023' },
      { name: 'Hélder Jorge Chivambo', studentNumber: '2023301' },
      { name: 'Gleides Wanga', studentNumber: '2023338' },
      { name: 'Wesley Arrides Matlombe', studentNumber: '2023305' }
      { name: 'Momed Ismael', studentNumber: '2023268' }
    ],
    course: 'Licenciatura em Docência de Programação Informática',
    subject: 'Programação Móvel - 3º Ano - 2º Semestre',
    institution: 'Instituto Superior Dom Bosco',
    year: 2025
  };

  res.render('index', { project: projectInfo });
};