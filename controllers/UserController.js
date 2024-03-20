const { Users, Markers, Reports } = require("../models/UserModel.js");
const { Op, sequelize } = require("sequelize");

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

const heckLogin = async (req, res) => {
  try {
    const { user_name, password } = req.body;

    // Znajdź użytkownika o podanym loginie
    const user = await Users.findOne({ where: { user_name } });

    // Sprawdź, czy użytkownik istnieje i czy hasło się zgadza
    if (user && user.password === password) {
      res
        .status(200)
        .json({ message: "Logowanie udane!", user_id: user.user_id });
    } else {
      res.status(401).json({
        error: "Nieprawidłowy login lub hasło.",
        message: "coś nie tak",
      });
    }
  } catch (error) {
    console.error("Błąd podczas logowania:", error);
    res.status(500).json({ error: "Wystąpił błąd podczas logowania." });
  }
};

const createMarker = async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      threats,
      description,
      user_id,
      date_createMarker,
      status,
    } = req.body;

    // Sprawdź, czy użytkownik istnieje
    const user = await Users.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: "Użytkownik nie istnieje." });
    }

    const radiusInMeters = 1000; // Zakładamy promień 1000 metrów

    // Wyszukujemy markery, które znajdują się w określonej odległości od punktu referencyjnego
    const nearbyMarker = await Markers.findAll({
      where: {
        latitude: { [Op.overlap]: [latitude - 1, latitude + 1] },
      },
    });

    console.log(nearbyMarker);

    if (nearbyMarker.length) {
      // Jeśli znaleziono inny marker o zbliżonej lokalizacji, zaktualizuj go
      await nearbyMarker[0].update({
        latitude,
        longitude,
        threats,
        description,
        user_id,
        date_createMarker,
        status,
      });
      return res
        .status(200)
        .json({ message: "Zaktualizowano istniejący marker." });
    } else {
      const newMarker = await Markers.create({
        latitude,
        longitude,
        threats,
        description,
        user_id,
        date_createMarker,
        status,
      });

      // // Sprawdź, czy istnieje marker w tabeli Reports o podanej lokalizacji

      // Zwróć utworzony marker
      res.status(201).json(newMarker);
    }
  } catch (error) {
    console.error("Błąd podczas tworzenia markera:", error);
    res.status(500).json({ error: "Wystąpił błąd podczas tworzenia markera." });
  }
};

module.exports = { getUser, createUser, heckLogin, createMarker };
