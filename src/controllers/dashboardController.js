exports.getDashboard = (req, res) => {
  res.render('dashboard');
};

exports.getAdminPanel = (req, res) => {
  res.render('admin-panel');
};

exports.getClientPanel = (req, res) => {
  res.render('client-panel');
};