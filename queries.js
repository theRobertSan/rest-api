// Connect to database using module in db.js
const dbConn = require('./lib/db');

// Return a city with all data required for display
function giveCityRecord(id, name, countryCode, district, population) {
  return {
    ID: parseInt(id, 10),
    Name: name,
    Country: countryCode,
    District: district,
    PopulationCount: parseInt(population, 10),
  };
}

// GET function
const getCity = (req, res) => {
  // Name of the country obtained from url
  const { name } = req.params;

  // Select where name is the inserted name
  dbConn('city')
    .select('*')
    .where({ Name: name })
    .then((rows) => {
      if (rows.length !== 0) {
        res.status(200).json(rows);
      } else {
        // If name does not correspond to any city, send error message
        res.status(404).json({ error: 'CityNotFound' });
      }
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

// POST function
const createCity = (req, res) => {
  // Get needed data from request body
  const {
    name, countryCode, district, population,
  } = req.body;

  if (name == null || countryCode == null || district == null || population == null) {
    res.status(422).json({ error: 'MissingBodyParameter' });
    return;
  }

  let idIncremented;
  // Get biggest id so that the new city can have that (id+1) to keep things in order
  dbConn('city')
    .select('ID')
    .orderBy('ID', 'desc')
    .limit(1)
    .then((rows) => {
      idIncremented = rows[0].ID;

      // Insert city
      dbConn('city')
        .insert({
          ID: idIncremented + 1,
          Name: name,
          CountryCode: countryCode,
          District: district,
          Population: population,
        })
        .then(() => {
          // Show only what's needed
          const city = giveCityRecord(idIncremented + 1, name, countryCode, district, population);

          res.json(city);
        });
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

// PUT function
const updateCity = (req, res) => {
  // Get name of city to update from params
  const { name } = req.params;

  // Get new population from body
  const { population } = req.body;

  if (population == null) {
    res.status(422).json({ error: 'MissingBodyParameter' });
    return;
  }

  dbConn('city')
    .update({ Population: population })
    .where({ Name: name })
    .then((rows) => {
      if (rows !== 0) {
        // Display data if modified
        dbConn('city')
          .select('*')
          .where({ Name: name })
          .then((rows2) => {
            res.status(200).json(rows2);
          });
      } else {
        // If name does not correspond to any city, send error message
        res.status(404).json({ error: 'CityNotFound' });
      }
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

// DELETE function
const removeCity = (req, res) => {
  // Get name of city to delete from params
  const { name } = req.params;

  dbConn('city')
    .del()
    .where({ Name: name })
    .then((rows) => {
      if (rows !== 0) {
        res.status(200).json({ success: true });
      } else {
        res.status(404).json({ success: false });
      }
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

// Export modules
module.exports = {
  getCity,
  createCity,
  updateCity,
  removeCity,
};
