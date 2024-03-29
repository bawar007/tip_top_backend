const { Markers, Reports, AccessToken } = require("../models/UserModel");
const { Op, Sequelize, where } = require("sequelize");
const jwt = require("jsonwebtoken");

const createNewMarkerAndReport = async (
  latitude,
  longitude,
  threats_json,
  description,
  user_id,
  date_createMarker,
  status
) => {
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
    last_updateTime: new Date(),
    number_of_reports: 1,
  });
};

const updateOldMarkerAndUpdateReport = async (
  latitude,
  longitude,
  threats_json,
  description,
  user_id,
  date_createMarker,
  status,
  nearbyMarker
) => {
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

  await nearbyMarker.update({ status: "archive" });

  const reportAlertOld = await Reports.findOne({
    where: {
      marker_id: nearbyMarker.marker_id,
    },
  });

  if (reportAlertOld) {
    await reportAlertOld.update({
      marker_id: newMarker.marker_id,
      number_of_reports: reportAlertOld.number_of_reports + 1,
      last_updateTime: newMarker.date_createMarker,
    });
  }
};

const findNerbyMarker = async (longitude, latitude) => {
  const radiusInMeters = 100;
  const nearbyMarker = await Markers.findOne({
    where: {
      [Sequelize.Op.and]: [
        Sequelize.where(
          Sequelize.fn(
            "ST_Distance_Sphere",
            Sequelize.col("location"),
            Sequelize.fn("ST_GeomFromText", `POINT(${longitude} ${latitude})`)
          ),
          "<=",
          radiusInMeters
        ),
        { status: "active" }, // Dodajemy sprawdzenie statusu
      ],
    },
  });
  if (nearbyMarker) return nearbyMarker;
  return false;
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

    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];

    // Sprawdź, czy użytkownik istnieje

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Nieprawidłowy token" });
      } else {
        const userWithAccess = await AccessToken.findOne({
          where: {
            accessToken: token,
            user_id: decoded.user_id,
          },
        });
        if (!userWithAccess) {
          return res.status(403).json({ error: "Brak dostępu" });
        } else {
          const threats_json = JSON.stringify(threats);

          // Wyszukujemy markery, które znajdują się w określonej odległości od punktu referencyjnego

          const nearbyMarker = await findNerbyMarker(longitude, latitude);

          if (nearbyMarker) {
            // Jeśli istnieje pobliski marker, aktualizuj istniejący marker i raport
            await updateOldMarkerAndUpdateReport(
              latitude,
              longitude,
              threats_json,
              description,
              user_id,
              date_createMarker,
              status,
              nearbyMarker
            );

            return res
              .status(200)
              .json({ message: "Zaktualizowano istniejący marker." });
          } else {
            // Jeśli nie istnieje pobliski marker, utwórz nowy marker i raport
            await createNewMarkerAndReport(
              latitude,
              longitude,
              threats_json,
              description,
              user_id,
              date_createMarker,
              status
            );

            return res.status(201).json({
              message: "marker i raport zostały utworzone",
            });
          }
        }
      }
    });
  } catch (error) {
    console.error("Błąd podczas tworzenia markera:", error);
    return res
      .status(500)
      .json({ error: "Wystąpił błąd podczas tworzenia markera." });
  }
};

const getMarkersInReports = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Nieprawidłowy token" });
      } else {
        const userWithAccess = await AccessToken.findOne({
          where: {
            accessToken: token,
            user_id: decoded.user_id,
          },
        });
        if (!userWithAccess) {
          return res.status(403).json({ error: "Brak dostępu" });
        } else {
          // Znajdź wszystkie raporty z markerami
          const reportsWithMarkers = await Reports.findAll({
            include: [{ model: Markers }], // Relacja między raportami a markerami
          });

          // Zbierz wszystkie markery z raportów
          const markers = reportsWithMarkers;

          return res.status(200).json(markers);
        }
      }
    });
  } catch (error) {
    console.error("Błąd podczas pobierania markerów:", error);
    throw error;
  }
};

async function deleteOldRecords() {
  try {
    const oneHalfHourAgo = new Date(Date.now() + 1800000);

    const deletedRows = await Reports.destroy({
      where: {
        last_updateTime: {
          [Sequelize.Op.lt]: oneHalfHourAgo,
        },
      },
    });

    await Markers.update(
      {
        status: "archive", // Przykładowa zaktualizowana wartość
      },
      {
        where: {
          date_createMarker: {
            [Sequelize.Op.lt]: oneHalfHourAgo,
          },
        },
      }
    );

    console.log(`Usunięto ${deletedRows} nieaktualizowane wpisy. `);
  } catch (error) {
    console.error("Błąd podczas usuwania nieaktualizowanych wpisów:", error);
  }
}

// Uruchomienie funkcji usuwającej co godzinę
setInterval(deleteOldRecords, 600000);

module.exports = {
  createMarker,
  getMarkersInReports,
};
