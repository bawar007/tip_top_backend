const { Users, Markers, Reports } = require("../models/UserModel.js");

const getUser = async (req, res) => {
  try {
    const response = await Users.findAll();
    res.status(200).json(response);
  } catch (err) {
    console.error(err.message);
  }
};

const createUser = async (req, res) => {
  try {
    // Pobierz dane o użytkowniku z ciała żądania
    const {
      user_name,
      password,
      email,
      first_name,
      second_name,
      date_createAccount,
      accesToken,
    } = req.body;

    console.log(req.body);

    // Stwórz nowego użytkownika w bazie danych
    const newUser = await Users.create({
      user_name,
      password,
      email,
      first_name,
      second_name,
      date_createAccount,
      accesToken,
    });

    // Zwróć odpowiedź sukcesu
    res.status(201).json(newUser);
  } catch (error) {
    // Obsłuż błędy
    console.error("Błąd podczas tworzenia użytkownika:", error);
    res
      .status(500)
      .json({ error: "Wystąpił błąd podczas tworzenia użytkownika." });
  }
};

module.exports = { getUser, createUser };
