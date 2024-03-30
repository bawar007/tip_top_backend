const { Users, AccessToken } = require("../models/UserModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
    } = req.body;

    // Stwórz nowego użytkownika w bazie danych

    const hashPassword = bcrypt.hashSync(password, 10);

    const newUser = await Users.create({
      user_name,
      password: hashPassword,
      email,
      first_name,
      second_name,
      date_createAccount,
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
    if (!user) {
      return res.status(401).json({
        error: "Nieprawidłowy login lub hasło.",
      });
    }

    const heckPassword = bcrypt.compareSync(password, user.password);

    if (heckPassword) {
      const tokenValue = jwt.sign(
        { user_id: user.user_id },
        process.env.JWT_SECRET,
        {
          expiresIn: "48h",
        }
      );

      // Save the access token to the database

      const findAccessById = await AccessToken.findOne({
        where: { user_id: user.user_id },
      });

      if (findAccessById) {
        await AccessToken.update(
          {
            accessToken: tokenValue,
          },
          {
            where: {
              user_id: user.user_id,
            },
          }
        );
      } else {
        await AccessToken.create({
          accessToken: tokenValue,
          user_id: user.user_id,
        });
      }

      res.status(200).json({
        message: "Logowanie udane!",
        accessToken: tokenValue,
        user_id: user.user_id,
      });
    } else {
      res.status(401).json({
        error: "Nieprawidłowy login lub hasło.",
      });
    }
  } catch (error) {
    console.error("Błąd podczas logowania:", error);
    res.status(500).json({ error: "Wystąpił błąd podczas logowania." });
  }
};

module.exports = {
  createUser,
  heckLogin,
};
