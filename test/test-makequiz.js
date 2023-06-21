// Importiere die Funktion, die getestet werden soll
const { createQuizQuestion } = require('./quiz/make-quiz.html');

// Mock für die fetch-Funktion
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true })
  })
);

// Testfall für das Erstellen einer Quizfrage
describe('createQuizQuestion', () => {
  it('should create a quiz question successfully', async () => {
    // Simuliere Benutzereingaben
    document.getElementById('question').value = 'Sample question';
    document.getElementById('option1').value = 'Option A';
    document.getElementById('option2').value = 'Option B';
    document.getElementById('option3').value = 'Option C';
    document.getElementById('option4').value = 'Option D';
    document.getElementById('correctOption').value = 'A';

    // Simuliere das Klicken auf den Submit-Button
    document.getElementById('quizForm').dispatchEvent(new Event('submit'));

    // Warte auf die asynchrone Funktion
    await Promise.resolve();

    // Überprüfe, ob der fetch-Aufruf mit den erwarteten Parametern erfolgt ist
    expect(fetch).toHaveBeenCalledWith('/frage-hinzufuegen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question: 'Sample question',
        answer: {
          A: 'Option A',
          B: 'Option B',
          C: 'Option C',
          D: 'Option D'
        },
        correct_answer: ['A'],
        username: 'TestUser'
      })
    });

    // Überprüfe, ob die Erfolgsmeldung angezeigt wird
    expect(alert).toHaveBeenCalledWith('Die Quizfrage wurde erfolgreich erstellt und gespeichert.');

    // Überprüfe, ob die Eingabefelder zurückgesetzt wurden
    expect(document.getElementById('quizForm').reset).toHaveBeenCalled();
  });
});