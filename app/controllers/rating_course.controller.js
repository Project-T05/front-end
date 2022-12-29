const db = require("../models");
const Rating_course = db.Rating_course;

// Create and Save a new fav_course
exports.create = (req, res) => {
  // Validate request
  if (!req.body.utente_id || !req.body.corso_id) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const rating_course = new Rating_course({
    utente_id: req.body.utente_id,
    corso_id: req.body.corso_id,
  });

  Rating_course.find({ utente_id: req.body.utente_id, corso_id: req.body.corso_id })
  .then((associations) => {
    if (associations.length > 0){
      res.status(500).send({
        message: "There is already a rating association for this user."
      });
    } else {
      rating_course.save(rating_course)
      .then(data => {
          res.send(data);
      })
      .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while creating the fav_course."
        })
      });
    }
  })
  .catch((err) => {
    res.status(500).send({
      message: err.message || "Error occurred while checking for existing rating association."
    });
  });
};

// Delete a Course with the specified id in the request
exports.delete = (req, res) => {
  if (!req.body.utente_id || !req.body.corso_id) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  Rating_course.deleteOne({ utente_id: req.body.utente_id, corso_id: req.body.corso_id })
  .then(() => {
    res.send({ message: "Rating course was deleted successfully." });
  })
  .catch((err) => {
    res.status(500).send({ message: err.message || "Error occurred while deleting rating course." });
  });
};

exports.findAndUpdate = (req, res) => {
  // Trova il documento con l'utente e il corso specificati
  Rating_course.findOneAndUpdate(
    { utente_id: req.params.utente_id, corso_id: req.params.corso_id },
    { $set: { valutazione: req.body.valutazione } },
    { upsert: true, new: true }
  )
    .then((rating) => {
      res.send(rating);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating rating.",
      });
    });
};