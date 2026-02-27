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
        window.currentQuestionMeta = { subject: 'english', topic: currentTopic, letter };
        a.innerHTML = '<div class="options">' + shuffled.map(opt => 
            `<button class="option-btn" onclick="selectOption('${opt}')">${opt}</button>`
        ).join('') + '</div><button class="next-btn" onclick="checkAnswer()">Next Question</button>';
    } else if (currentTopic === 'spelling') {
        const spellingBank = [
            { correct: 'cat', wrong: ['kat', 'cta', 'caat'] },
            { correct: 'dog', wrong: ['doog', 'gdo', 'dgo'] },
            { correct: 'sun', wrong: ['sunn', 'snu', 'son'] },
            { correct: 'tree', wrong: ['tre', 'tere', 'tire'] },
            { correct: 'book', wrong: ['bok', 'boook', 'boko'] },
            { correct: 'house', wrong: ['hause', 'houes', 'hosue'] },
            { correct: 'water', wrong: ['watre', 'watar', 'waetr'] },
            { correct: 'happy', wrong: ['hapy', 'haapy', 'happie'] },
            { correct: 'friend', wrong: ['freind', 'frend', 'firend'] },
            { correct: 'school', wrong: ['scool', 'schol', 'shcool'] },
            { correct: 'apple', wrong: ['aple', 'appel', 'appple'] },
            { correct: 'table', wrong: ['tabel', 'taable', 'tabble'] },
            { correct: 'chair', wrong: ['chiar', 'chare', 'chaer'] },
            { correct: 'pencil', wrong: ['pencel', 'pencill', 'penncil'] },
            { correct: 'paper', wrong: ['papper', 'paer', 'papre'] },
            { correct: 'window', wrong: ['windoe', 'widnow', 'windaw'] },
            { correct: 'door', wrong: ['dor', 'dooor', 'doar'] },
            { correct: 'flower', wrong: ['flour', 'flowre', 'flwer'] },
            { correct: 'garden', wrong: ['gardan', 'gardin', 'garrden'] },
            { correct: 'family', wrong: ['famly', 'famliy', 'fammily'] }
        ];

        function mutateWord(word) {
            if (word.length < 3) return word + word[word.length - 1];
            const i = Math.floor(Math.random() * (word.length - 1));
            const swapped = word.split('');
            [swapped[i], swapped[i + 1]] = [swapped[i + 1], swapped[i]];
            return swapped.join('');
        }

        const item = spellingBank[Math.floor(Math.random() * spellingBank.length)];
        const options = [item.correct];
        item.wrong.forEach(w => options.push(w));
        while (options.length < 4) {
            const candidate = mutateWord(item.correct);
            if (!options.includes(candidate)) options.push(candidate);
        }
        const shuffled = shuffleArray(options.slice(0, 4));

        q.textContent = 'Which word is spelled correctly?';
        currentAnswer = item.correct;
        window.currentQuestionMeta = { subject: 'english', topic: currentTopic, item };
        a.innerHTML = '<div class="options">' + shuffled.map(opt => 
            `<button class="option-btn" onclick="selectOption('${opt}')">${opt}</button>`
        ).join('') + '</div><button class="next-btn" onclick="checkAnswer()">Next Question</button>';
    } else {
    let questions = englishQuestions[currentTopic];
    if (!questions || questions.length === 0) {
        q.textContent = 'Loading questions...';
        a.innerHTML = '';
        return;
    }

    questions = filterQuestionsByGrade(questions);
    if (questions.length === 0) {
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
        window.currentQuestionMeta = { subject: 'english', topic: currentTopic, item };
        a.innerHTML = '<div class="options">' + shuffled.map(opt => 
            `<button class="option-btn" onclick="selectOption('${opt}')">${opt}</button>`
        ).join('') + '</div><button class="next-btn" onclick="checkAnswer()">Next Question</button>';
    }
}

function filterQuestionsByGrade(questions) {
    if (!Array.isArray(questions) || questions.length === 0) return [];
    const grade = typeof currentGrade === 'number' ? currentGrade : 2;
    const quarter = Math.max(1, Math.floor(questions.length / 4));
    if (grade <= 1) {
        return questions.slice(0, quarter);
    }
    if (grade <= 3) {
        return questions.slice(quarter, quarter * 2);
    }
    if (grade <= 5) {
        return questions.slice(quarter * 2, quarter * 3);
    }
    return questions.slice(quarter * 3);
}
