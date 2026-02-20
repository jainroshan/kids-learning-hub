let englishQuestions = {};

// Load English questions from JSON
fetch('questions-english.json')
    .then(response => response.json())
    .then(data => {
        englishQuestions = data;
    })
    .catch(error => console.error('Error loading English questions:', error));

function generateEnglishQuestion() {
    const q = document.getElementById('question');
    const a = document.getElementById('answerSection');
    
    // Shuffle array helper
    function shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    
    if (currentTopic === 'letters') {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const letter = letters[Math.floor(Math.random() * letters.length)];
        const options = [letter];
        while (options.length < 4) {
            const opt = letters[Math.floor(Math.random() * letters.length)];
            if (!options.includes(opt)) options.push(opt);
        }
        const shuffled = shuffleArray(options);
        
        q.textContent = `Which letter is "${letter.toLowerCase()}"?`;
        currentAnswer = letter;
        a.innerHTML = '<div class="options">' + shuffled.map(opt => 
            `<button class="option-btn" onclick="selectOption('${opt}')">${opt}</button>`
        ).join('') + '</div><button class="next-btn" onclick="generateQuestion()">Next Question</button>';
    } else if (currentTopic === 'spelling') {
        const words = ['cat', 'dog', 'sun', 'tree', 'book', 'house', 'water', 'happy', 'friend', 'school', 
                       'apple', 'table', 'chair', 'pencil', 'paper', 'window', 'door', 'flower', 'garden', 'family'];
        const word = words[Math.floor(Math.random() * words.length)];
        q.textContent = `Spell the word: "${word}"`;
        currentAnswer = word;
        a.innerHTML = '<input type="text" class="answer-input" id="answer" onkeypress="if(event.key===\'Enter\')checkAnswer()"><br><button class="next-btn" onclick="generateQuestion()">Next Question</button>';
    } else {
        const questions = englishQuestions[currentTopic];
        if (!questions || questions.length === 0) {
            q.textContent = 'Loading questions...';
            a.innerHTML = '';
            return;
        }
        
        const item = questions[Math.floor(Math.random() * questions.length)];
        const shuffled = shuffleArray([...item.opts]);
        
        if (item.text) {
            q.innerHTML = `<div style="margin-bottom:20px; font-size:0.8em; font-style:italic;">"${item.text}"</div>${item.q}`;
        } else {
            q.textContent = item.q;
        }
        
        currentAnswer = item.a;
        a.innerHTML = '<div class="options">' + shuffled.map(opt => 
            `<button class="option-btn" onclick="selectOption('${opt}')">${opt}</button>`
        ).join('') + '</div><button class="next-btn" onclick="generateQuestion()">Next Question</button>';
    }
}
