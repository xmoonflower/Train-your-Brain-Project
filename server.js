const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');

/////////////Module

//////////////Registration

// Middleware for JSON data processing
app.use(bodyParser.json());
app.use(cookieParser());

// Serve the index.html file
app.get('/registration', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

// POST request for registration
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Check if the user already exists
  if (userExists(username)) {
    return res.status(400).json({ error: 'Username already taken' });
  }

  // Create a new user
  const newUser = {
    username,
    password
  };

  // Save the new user to the users.json file
  saveUser(newUser);

  res.json({ message: 'Registration successful' });
});

/////////////////Anmeldung

// POST request for login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Validate user credentials
  if (validateUserCredentials(username, password)) {
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Check if a user already exists
function userExists(username) {
  const userData = loadUserData();

  return userData.some(user => user.username === username);
}

// Save a new user to the users.json file
function saveUser(user) {
  const userData = loadUserData();

  userData.push(user);
  fs.writeFileSync('data/users.json', JSON.stringify(userData, null, 2));
}

// Load user data from the users.json file
function loadUserData() {
  if (!fs.existsSync('data/users.json')) {
    return [];
  }

  const userData = fs.readFileSync('data/users.json', 'utf8');

  return JSON.parse(userData);
}

// Validate user credentials
function validateUserCredentials(username, password) {
  const userData = loadUserData();

  return userData.some(user => user.username === username && user.password === password);
}

//////////////////////// Startseite mit Usercookie

// Serve startseite
app.get('/startseite', (req, res) => {
  const username = req.cookies.username; // Abrufen des Benutzernamen-Cookies

  if (!username) {
    res.redirect('/registration');
  } else {
    res.sendFile(path.join(__dirname, 'public/startseite.html'));
  }
});

// POST request for logout
app.post('/logout', (req, res) => {
  // Clear the username cookie
  res.clearCookie('username');

  res.json({ message: 'Logout successful' });
});

// Set the username cookie upon successful login
app.post('/login', (req, res) => {
  const { username } = req.body;

  // Set the username cookie
  res.cookie('username', username);

  res.json({ message: 'Login successful' });
});

// POST request for logout
app.post('/logout', (req, res) => {
    // Clear the username cookie
    res.clearCookie('username');
  
    // Redirect to the registration page
    res.redirect('/registration');
  });
////////////////////////////////////////////////////////////make Quiz
  // POST-Anfrage für das Hinzufügen einer Quizfrage
app.post('/frage-hinzufuegen', (req, res) => {
  const quizData = req.body;

  // Lese die vorhandenen Fragen aus der Datei
  let existingData = [];
  try {
    const fileData = fs.readFileSync('data/fragen.json', 'utf8');
    existingData = JSON.parse(fileData);
  } catch (error) {
    console.error('Fehler beim Lesen der Datei: ' + error);
  }

  // Generiere eine eindeutige ID für die neue Quizfrage
  const newId = existingData.length.toString();

  // Erstelle ein neues Frageobjekt im gewünschten Format
  const newQuestion = {
    id: newId,
    question: quizData.question,
    answer: {
      A: quizData.answer.A,
      B: quizData.answer.B,
      C: quizData.answer.C,
      D: quizData.answer.D
    },
    correct_answer: quizData.correct_answer
  };

  // Füge die neue Quizfrage zu den vorhandenen Fragen hinzu
  existingData.push(newQuestion);

  // Schreibe die Fragen zurück in die Datei
  try {
    fs.writeFileSync('data/fragen.json', JSON.stringify(existingData));
    console.log('Die Quizfrage wurde erfolgreich gespeichert.');
    // Sende eine Erfolgsantwort zurück
    res.sendStatus(200);
  } catch (error) {
    console.error('Fehler beim Schreiben der Datei: ' + error);
    // Sende eine Fehlerantwort zurück
    res.sendStatus(500);
  }
});

/////////////////////////////////////////////////////////////////////7777    
  
  // GET-Anfrage für das Abrufen der make-quiz.html
  app.get('/make-quiz', (req, res) => {
      fs.readFile('quiz/make-quiz.html', 'utf8', (err, data) => {
        if (err) {
          console.error('Fehler beim Lesen der Datei: ' + err);
          res.sendStatus(500);
        } else {
          res.send(data);
        }
      });
    });
///////////////////////////////////////Löschen Quizfrage
// Middleware for JSON data processing
app.use(express.json());

// DELETE route for deleting a question
app.delete('/delete-question/:questionId', (req, res) => {
  const questionId = req.params.questionId;

  // Read the questions from the JSON file
  fs.readFile('data/fragen.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Fehler beim Lesen der Datei: ' + err);
      return res.sendStatus(500);
    }

    try {
      // Parse the JSON data
      const questions = JSON.parse(data);

      // Find the question with the given ID
      const questionIndex = questions.findIndex(question => question.id === questionId);

      // If the question exists, remove it from the array
      if (questionIndex !== -1) {
        questions.splice(questionIndex, 1);

        // Write the updated questions back to the file
        fs.writeFile('data/fragen.json', JSON.stringify(questions, null, 2), err => {
          if (err) {
            console.error('Fehler beim Schreiben der Datei: ' + err);
            return res.sendStatus(500);
          }

          // Question successfully deleted
          res.sendStatus(200);
        });
      } else {
        // Question not found
        res.sendStatus(404);
      }
    } catch (error) {
      console.error('Fehler beim Parsen der JSON-Daten: ' + error);
      res.sendStatus(500);
    }
  });
});

////////////////////////////////////////////////////////


////////////////////////// AWS Quiz    
  
  app.use(express.static('public'));
  
  app.get('/questions', (req, res) => {
    fs.readFile('data/aws.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Fehler beim Lesen der Fragen.');
      } else {
        const questions = JSON.parse(data);
        res.json(questions);
      }
    });
  });
  
  app.get('/play', (req, res) => {
    const filePath = path.join(__dirname, 'quiz/quizplayaws.html');
    res.sendFile(filePath);
  });
  
///////////////Speicherapi Linuxfragen
  app.use(express.static('public'));
  
  app.get('/fragen-linux', (req, res) => {
    fs.readFile('data/linux.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Fehler beim Lesen der Fragen.');
      } else {
        const questions = JSON.parse(data);
        res.json(questions);
      }
    });
  });
  //////////////////////////////// Linux
  app.get('/play1', (req, res) => {
    const filePath = path.join(__dirname, 'quiz/quizplaylinux.html');
    res.sendFile(filePath);
  });
  
  app.use(express.static('public'));
  
  app.get('/frage', (req, res) => {
    fs.readFile('data/fragen.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Fehler beim Lesen der Fragen.');
      } else {
        const questions = JSON.parse(data);
        res.json(questions);
      }
    });
  });
  ////////////////////////////////////////////////// play my Quiz
  
  app.get('/play2', (req, res) => {
    const filePath = path.join(__dirname, 'quiz/playmyquiz.html');
    res.sendFile(filePath);
  });

////////////////////////////////////////////////////7

////Scorepunkte my Quiz speichern vom Quiz in die json Datei, damit diese vom Scoreboard gefechted werden kann
// POST-Anfrage zum Speichern des Benutzernamens und der Punktzahl
app.post('/score-myquiz', (req, res) => {
  const { username, score } = req.body;

  // Lese die vorhandenen Daten aus der Datei
  let existingData = [];
  try {
    const fileData = fs.readFileSync('data/Punkte-myquiz.json', 'utf8');
    existingData = JSON.parse(fileData);
  } catch (error) {
    console.error('Fehler beim Lesen der Datei: ' + error);
  }

  // Füge den neuen Datensatz hinzu
  existingData.push({ username, score });

  // Speichere die aktualisierten Daten in der Datei
  try {
    fs.writeFileSync('data/score-myquiz.json', JSON.stringify(existingData, null, 2));
    res.sendStatus(200);
  } catch (error) {
    console.error('Fehler beim Schreiben der Datei: ' + error);
    res.sendStatus(500);
  }
});

// Funktion zum Aktualisieren des Scores
function updateScore(username, score) {
  const userData = loadUserData();

  const user = userData.find(user => user.username === username);
  if (user) {
    user.score = score;
    fs.writeFileSync('data/score-myquiz.json', JSON.stringify(userData, null, 2));
  }
}

///////////////////////////Scoreboardabfrage für Scoreboard my Quiz

app.get('/score-myquiz', (req, res) => {
  const filePath = path.join(__dirname, 'data/score-myquiz.json');
  res.sendFile(filePath);
});


// Endpoint to update scores von my Quiz 
app.post('/score-myquiz', (req, res) => {
  // Read the JSON file
  fs.readFile('data/score-myquiz.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading JSON file');
      return;
    }

    try {
      const scores = JSON.parse(data);
      scores.forEach(score => {
        updateScore(score.username, score.score);
      });
      res.send('Scores updated successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating scores');
    }
  });
});
/////////////////////////// Ende Scoreboard my Quiz

///////////////////////////////// Scoreboard AWS

////Scorepunkte my Quiz speichern vom Quiz in die json Datei, damit diese vom Scoreboard gefechted werden kann
// POST-Anfrage zum Speichern des Benutzernamens und der Punktzahl
app.post('/score-aws', (req, res) => {
  const { username, score } = req.body;

  // Lese die vorhandenen Daten aus der Datei
  let existingData = [];
  try {
    const fileData = fs.readFileSync('data/score-aws.json', 'utf8');
    existingData = JSON.parse(fileData);
  } catch (error) {
    console.error('Fehler beim Lesen der Datei: ' + error);
  }

  // Füge den neuen Datensatz hinzu
  existingData.push({ username, score });

  // Speichere die aktualisierten Daten in der Datei
  try {
    fs.writeFileSync('data/score-aws.json', JSON.stringify(existingData, null, 2));
    res.sendStatus(200);
  } catch (error) {
    console.error('Fehler beim Schreiben der Datei: ' + error);
    res.sendStatus(500);
  }
});

// Funktion zum Aktualisieren des Scores
function updateScore(username, score) {
  const userData = loadUserData();

  const user = userData.find(user => user.username === username);
  if (user) {
    user.score = score;
    fs.writeFileSync('data/score-aws.json', JSON.stringify(userData, null, 2));
  }
}

///////////////////////////Scoreboardabfrage für Scoreboard AWS

app.get('/score-aws', (req, res) => {
  const filePath = path.join(__dirname, 'data/score-aws.json');
  res.sendFile(filePath);
});


// Endpoint to update scores von my Quiz 
app.post('/score-aws', (req, res) => {
  // Read the JSON file
  fs.readFile('data/score-aws.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading JSON file');
      return;
    }

    try {
      const scores = JSON.parse(data);
      scores.forEach(score => {
        updateScore(score.username, score.score);
      });
      res.send('Scores updated successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating scores');
    }
  });
});

/////////////////////////////////// Ende AWS Board

///////////////////////////////// Scoreboard Linux

////Scorepunkte my Quiz speichern vom Quiz in die json Datei, damit diese vom Scoreboard gefechted werden kann
// POST-Anfrage zum Speichern des Benutzernamens und der Punktzahl
app.post('/score-linux', (req, res) => {
  const { username, score } = req.body;

  // Lese die vorhandenen Daten aus der Datei
  let existingData = [];
  try {
    const fileData = fs.readFileSync('data/score-linux.json', 'utf8');
    existingData = JSON.parse(fileData);
  } catch (error) {
    console.error('Fehler beim Lesen der Datei: ' + error);
  }

  // Füge den neuen Datensatz hinzu
  existingData.push({ username, score });

  // Speichere die aktualisierten Daten in der Datei
  try {
    fs.writeFileSync('data/score-linux.json', JSON.stringify(existingData, null, 2));
    res.sendStatus(200);
  } catch (error) {
    console.error('Fehler beim Schreiben der Datei: ' + error);
    res.sendStatus(500);
  }
});

// Funktion zum Aktualisieren des Scores
function updateScore(username, score) {
  const userData = loadUserData();

  const user = userData.find(user => user.username === username);
  if (user) {
    user.score = score;
    fs.writeFileSync('data/score-linux.json', JSON.stringify(userData, null, 2));
  }
}

///////////////////////////Scoreboardabfrage für Scoreboard Linux

app.get('/score-linux', (req, res) => {
  const filePath = path.join(__dirname, 'data/score-linux.json');
  res.sendFile(filePath);
});


// Endpoint to update scores von my Quiz 
app.post('/score-linux', (req, res) => {
  // Read the JSON file
  fs.readFile('score-linux.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading JSON file');
      return;
    }

    try {
      const scores = JSON.parse(data);
      scores.forEach(score => {
        updateScore(score.username, score.score);
      });
      res.send('Scores updated successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating scores');
    }
  });
});

/////////////////////////////////// Ende AWS Linux

//////////////Scoreboard online

app.get('/scoreboard', (req, res) => {
  const filePath = path.join(__dirname, 'scoreboard/scoreboard.html');
  res.sendFile(filePath);
});

app.get('/scoreboard-aws', (req, res) => {
  const filePath = path.join(__dirname, 'scoreboard/scoreboard-aws.html');
  res.sendFile(filePath);
});

app.get('/scoreboard-linux', (req, res) => {
  const filePath = path.join(__dirname, 'scoreboard/scoreboard-linux.html');
  res.sendFile(filePath);
});

/////////////////////// AllQuestion Funktion /////

app.get('/frageliste', (req, res) => {
  const filePath = path.join(__dirname, 'quiz/all-questions.html');
  res.sendFile(filePath);
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


