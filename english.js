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
        options.sort(() => Math.random() - 0.5);
        
        q.textContent = `Which letter is "${letter.toLowerCase()}"?`;
        currentAnswer = letter;
        a.innerHTML = '<div class="options">' + shuffleArray([...options]).map(opt => 
            `<button class="option-btn" onclick="selectOption('${opt}')">${opt}</button>`
        ).join('') + '</div><button class="submit-btn" onclick="checkAnswer()">Check Answer</button><button class="next-btn" onclick="generateQuestion()">Next Question</button>';
    } else if (currentTopic === 'spelling') {
        const words = ['cat', 'dog', 'sun', 'tree', 'book', 'house', 'water', 'happy', 'friend', 'school'];
        const word = words[Math.floor(Math.random() * words.length)];
        q.textContent = `Spell the word: "${word}"`;
        currentAnswer = word;
        a.innerHTML = '<input type="text" class="answer-input" id="answer" onkeypress="if(event.key===\'Enter\')checkAnswer()"><br><button class="submit-btn" onclick="checkAnswer()">Check Answer</button><button class="next-btn" onclick="generateQuestion()">Next Question</button>';
    } else if (currentTopic === 'grammar') {
        const questions = [
            {q: 'Choose the correct verb: She ___ to school.', opts: ['goes', 'go', 'going', 'went'], a: 'goes'},
            {q: 'Choose the correct: They ___ playing.', opts: ['are', 'is', 'am', 'be'], a: 'are'},
            {q: 'Which is correct: I ___ a student.', opts: ['am', 'is', 'are', 'be'], a: 'am'},
            {q: 'Choose correct: He ___ happy.', opts: ['is', 'am', 'are', 'be'], a: 'is'},
            {q: 'Choose correct: We ___ friends.', opts: ['are', 'is', 'am', 'be'], a: 'are'}
        ];
        const item = questions[Math.floor(Math.random() * questions.length)];
        q.textContent = item.q;
        currentAnswer = item.a;
        a.innerHTML = '<div class="options">' + shuffleArray([...item.opts]).map(opt => 
            `<button class="option-btn" onclick="selectOption('${opt}')">${opt}</button>`
        ).join('') + '</div><button class="submit-btn" onclick="checkAnswer()">Check Answer</button><button class="next-btn" onclick="generateQuestion()">Next Question</button>';
    } else if (currentTopic === 'vocabulary') {
        const questions = [
            {q: 'What is a synonym for "happy"?', opts: ['joyful', 'sad', 'angry', 'tired'], a: 'joyful'},
            {q: 'What is an antonym for "big"?', opts: ['small', 'large', 'huge', 'giant'], a: 'small'},
            {q: 'What is a synonym for "smart"?', opts: ['intelligent', 'dumb', 'slow', 'lazy'], a: 'intelligent'},
            {q: 'What is an antonym for "hot"?', opts: ['cold', 'warm', 'burning', 'fire'], a: 'cold'},
            {q: 'What is a synonym for "fast"?', opts: ['quick', 'slow', 'lazy', 'tired'], a: 'quick'}
        ];
        const item = questions[Math.floor(Math.random() * questions.length)];
        q.textContent = item.q;
        currentAnswer = item.a;
        a.innerHTML = '<div class="options">' + shuffleArray([...item.opts]).map(opt => 
            `<button class="option-btn" onclick="selectOption('${opt}')">${opt}</button>`
        ).join('') + '</div><button class="submit-btn" onclick="checkAnswer()">Check Answer</button><button class="next-btn" onclick="generateQuestion()">Next Question</button>';
    } else if (currentTopic === 'nouns') {
        const questions = [
            {q: 'Which is a noun?', opts: ['table', 'run', 'quickly', 'blue'], a: 'table'},
            {q: 'Which is a noun?', opts: ['book', 'jump', 'slowly', 'red'], a: 'book'},
            {q: 'Which is a noun?', opts: ['car', 'walk', 'fast', 'green'], a: 'car'},
            {q: 'Which is a noun?', opts: ['dog', 'sleep', 'happy', 'big'], a: 'dog'},
            {q: 'Which is a noun?', opts: ['house', 'eat', 'sad', 'small'], a: 'house'}
        ];
        const item = questions[Math.floor(Math.random() * questions.length)];
        q.textContent = item.q;
        currentAnswer = item.a;
        a.innerHTML = '<div class="options">' + shuffleArray([...item.opts]).map(opt => 
            `<button class="option-btn" onclick="selectOption('${opt}')">${opt}</button>`
        ).join('') + '</div><button class="submit-btn" onclick="checkAnswer()">Check Answer</button><button class="next-btn" onclick="generateQuestion()">Next Question</button>';
    } else if (currentTopic === 'verbs') {
        const questions = [
            {q: 'Which is a verb?', opts: ['run', 'table', 'quickly', 'blue'], a: 'run'},
            {q: 'Which is a verb?', opts: ['jump', 'book', 'slowly', 'red'], a: 'jump'},
            {q: 'Which is a verb?', opts: ['walk', 'car', 'fast', 'green'], a: 'walk'},
            {q: 'Which is a verb?', opts: ['sleep', 'dog', 'happy', 'big'], a: 'sleep'},
            {q: 'Which is a verb?', opts: ['eat', 'house', 'sad', 'small'], a: 'eat'}
        ];
        const item = questions[Math.floor(Math.random() * questions.length)];
        q.textContent = item.q;
        currentAnswer = item.a;
        a.innerHTML = '<div class="options">' + shuffleArray([...item.opts]).map(opt => 
            `<button class="option-btn" onclick="selectOption('${opt}')">${opt}</button>`
        ).join('') + '</div><button class="submit-btn" onclick="checkAnswer()">Check Answer</button><button class="next-btn" onclick="generateQuestion()">Next Question</button>';
    } else if (currentTopic === 'reading') {
        const passages = [
            {text: 'The cat sat on the mat.', q: 'Where did the cat sit?', opts: ['on the mat', 'on the chair', 'on the bed', 'on the floor'], a: 'on the mat'},
            {text: 'Tom likes to play soccer.', q: 'What does Tom like to play?', opts: ['soccer', 'basketball', 'tennis', 'baseball'], a: 'soccer'},
            {text: 'The sun is bright today.', q: 'How is the sun today?', opts: ['bright', 'dark', 'cloudy', 'rainy'], a: 'bright'}
        ];
        const item = passages[Math.floor(Math.random() * passages.length)];
        q.innerHTML = `<div style="margin-bottom:20px; font-size:0.8em; font-style:italic;">"${item.text}"</div>${item.q}`;
        currentAnswer = item.a;
        a.innerHTML = '<div class="options">' + shuffleArray([...item.opts]).map(opt => 
            `<button class="option-btn" onclick="selectOption('${opt}')">${opt}</button>`
        ).join('') + '</div><button class="submit-btn" onclick="checkAnswer()">Check Answer</button><button class="next-btn" onclick="generateQuestion()">Next Question</button>';
    } else if (currentTopic === 'punctuation') {
        const questions = [
            {q: 'Which sentence is correct?', opts: ['I am happy.', 'I am happy', 'i am happy.', 'i am happy'], a: 'I am happy.'},
            {q: 'Which sentence is correct?', opts: ['What is your name?', 'What is your name', 'what is your name?', 'what is your name'], a: 'What is your name?'},
            {q: 'Which sentence is correct?', opts: ['Stop!', 'Stop', 'stop!', 'stop'], a: 'Stop!'}
        ];
        const item = questions[Math.floor(Math.random() * questions.length)];
        q.textContent = item.q;
        currentAnswer = item.a;
        a.innerHTML = '<div class="options">' + shuffleArray([...item.opts]).map(opt => 
            `<button class="option-btn" onclick="selectOption('${opt}')">${opt}</button>`
        ).join('') + '</div><button class="submit-btn" onclick="checkAnswer()">Check Answer</button><button class="next-btn" onclick="generateQuestion()">Next Question</button>';
    }
}
