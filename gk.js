let gkQuestions = {};

// Load GK questions from JSON
fetch('questions-gk.json')
    .then(response => response.json())
    .then(data => {
        gkQuestions = data;
    })
    .catch(error => console.error('Error loading GK questions:', error));

function generateGKQuestion() {
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
    
    let questions = gkQuestions[currentTopic];
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
    window.currentQuestionMeta = { subject: 'gk', topic: currentTopic, item };
    a.innerHTML = '<div class="options">' + shuffled.map(opt => 
        `<button class="option-btn" onclick="selectOption('${opt}')">${opt}</button>`
    ).join('') + '</div><button class="next-btn" onclick="checkAnswer()">Next Question</button>';
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
