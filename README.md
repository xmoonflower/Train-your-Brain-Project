# Train your Brain
used with Express and Node.js

# Features
Users can create and delete quizzes.
Users can play different games chose between Linux and Solution Architect.
A scoreboard is available showing the best players and their scores.
Users can share quizzes.
The software offers a user-friendly interface.

# Setup and operation

Commissioning of the solution (installation instructions)
Download the latest version of the quiz software from the GitHub page. Unzip the downloaded archive on the computer. Open a terminal or command line and navigate to the directory of the extracted files. Enter the npm init command, this command will create a package.json. After that, some dependencies like Express, Cors, Body-Parser and Fs will be installed.
npm install cors body parser fs express
Start the quiz software by running the node server.js command in the terminal or command line.


Use of the Software
Open the web browser and navigate to the URL http://localhost:3000. You see the homepage of the quiz software. Here users can create, share and delete new questions and play quizzes. Click on "Make Quiz" to add a new question. Choose 4 possible answers and confirm the correct answer. Click "Enter Quiz" to play a game, you can choose between Linux and Solution Architect. Click on “Play my Quiz” to play your own questions. Answer the questions in the quiz game and see your score at the end.

# Routes

http://localhost:3000/registration

http://localhost:3000/startseite

http://localhost:3000/play1

http://localhost:3000/play2

http://localhost:3000/make-quiz

http://localhost:3000/frageliste

http://localhost:3000/scoreboard

http://localhost:3000/scoreboard-aws

http://localhost:3000/scoreboard-linux
