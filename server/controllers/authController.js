const User = require("../models/user");

// Renderiza página de login
exports.getLogin = (req, res) => {
  res.render("auth/login");
};

// Login POST
exports.postLogin = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.send("Usuário não encontrado");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.send("Senha incorreta");

  req.session.userId = user._id;
  res.redirect("/");
};

// Logout GET — usado para encerrar sessão ao voltar com a seta
exports.logout = (req, res) => {
  req.session.destroy(() => {
    // Evita cache da página anterior
    res.setHeader("Cache-Control", "no-store");
    res.redirect("/login");
  });
};

// Registro inicial (opcional, só para criar usuário admin)
exports.register = async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  await user.save();
  res.send("Usuário registrado com sucesso");
};
