const { Users, Markers, Reports } = require("../models/UserModel.js");
const { Op, Sequelize } = require("sequelize");

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
    const threats_json = JSON.stringify(threats);

    // Wyszukujemy markery, które znajdują się w określonej odległości od punktu referencyjnego
    const nearbyMarker = await Markers.findOne({
      where: Sequelize.where(
        Sequelize.fn(
          "ST_Distance_Sphere",
          Sequelize.col("location"),
          Sequelize.fn("ST_GeomFromText", `POINT(${longitude} ${latitude})`)
        ),
        "<=",
        radiusInMeters
      ),
      status: "active",
    });

    if (nearbyMarker) {
      const newMarker = await Markers.create({
        latitude,
        longitude,
        threats: threats_json,
        description,
        user_id,
        date_createMarker,
        status,
        location: Sequelize.literal(`POINT(${longitude}, ${latitude})`),
      });

      const updatedMarker = await Markers.findOne({
        where: {
          user_id: user_id,
          status: "active",
        },
      });

      if (updatedMarker) {
        updatedMarker.update({
          status: "archive",
        });
      }

      const reportAlertOld = await Reports.findOne({
        where: {
          marker_id: nearbyMarker.marker_id,
        },
      });

      if (reportAlertOld) {
        reportAlertOld.update({
          marker_id: newMarker.marker_id,
          number_of_reports: reportAlertOld.number_of_reports + 1,
          last_updateTime: newMarker.date_createMarker,
        });
      }

      return res
        .status(200)
        .json({ message: "Zaktualizowano istniejący marker." });
    } else {
      const newMarker = await Markers.create({
        latitude,
        longitude,
        threats: threats_json,
        description,
        user_id,
        date_createMarker,
        status,
        location: Sequelize.literal(`POINT(${longitude}, ${latitude})`),
      });

      await Reports.create({
        marker_id: newMarker.marker_id,
        last_updateTime: newMarker.date_createAccount,
        number_of_reports: 1,
      });

      // Zwróć utworzony marker
      res.status(201).json(newMarker);
    }
  } catch (error) {
    console.error("Błąd podczas tworzenia markera:", error);
    res.status(500).json({ error: "Wystąpił błąd podczas tworzenia markera." });
  }
};

const getMarkersInReports = async (req, res) => {
  try {
    // Znajdź wszystkie raporty z markerami
    const reportsWithMarkers = await Reports.findAll({
      include: [{ model: Markers }], // Relacja między raportami a markerami
    });

    // Zbierz wszystkie markery z raportów
    const markers = reportsWithMarkers;

    res.status(200).json(markers);
  } catch (error) {
    console.error("Błąd podczas pobierania markerów:", error);
    throw error;
  }
};

async function deleteOldRecords() {
  try {
    const oneHalfHourAgo = new Date(Date.now() - 1800000);

    const deletedRows = await Reports.destroy({
      where: {
        last_updateTime: {
          [Sequelize.Op.lt]: oneHalfHourAgo,
        },
      },
    });

    console.log(`Usunięto ${deletedRows} nieaktualizowanych wpisów.`);
  } catch (error) {
    console.error("Błąd podczas usuwania nieaktualizowanych wpisów:", error);
  }
}

// Uruchomienie funkcji usuwającej co godzinę
setInterval(deleteOldRecords, 600000);

module.exports = {
  getUser,
  createUser,
  heckLogin,
  createMarker,
  getMarkersInReports,
};
