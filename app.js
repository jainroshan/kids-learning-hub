let currentSubject = '';
let currentGrade = 2;
let currentTopic = '';
let difficulty = 'medium';
let totalQuestions = 10;
let questionCount = 0;
let score = 0;
let attempts = 0;
let currentAnswer = '';
let selectedOption = null;

const mathTopics = {
    counting: { minGrade: 0, maxGrade: 1, label: 'Counting' },
    addition: { minGrade: 1, maxGrade: 11, label: 'Addition' },
    subtraction: { minGrade: 1, maxGrade: 11, label: 'Subtraction' },
    multiplication: { minGrade: 3, maxGrade: 11, label: 'Multiplication' },
    division: { minGrade: 3, maxGrade: 11, label: 'Division' },
    fractions: { minGrade: 4, maxGrade: 11, label: 'Fractions' },
    percentages: { minGrade: 5, maxGrade: 11, label: 'Percentages' },
    algebra: { minGrade: 7, maxGrade: 11, label: 'Algebra' }
};

const englishTopics = {
    letters: { minGrade: 0, maxGrade: 1, label: 'Letters' },
    spelling: { minGrade: 1, maxGrade: 11, label: 'Spelling' },
    nouns: { minGrade: 2, maxGrade: 6, label: 'Nouns' },
    verbs: { minGrade: 2, maxGrade: 6, label: 'Verbs' },
    grammar: { minGrade: 3, maxGrade: 11, label: 'Grammar' },
    vocabulary: { minGrade: 3, maxGrade: 11, label: 'Vocabulary' },
    punctuation: { minGrade: 2, maxGrade: 8, label: 'Punctuation' },
    reading: { minGrade: 2, maxGrade: 11, label: 'Reading' }
};

const gkTopics = {
    animals: { minGrade: 0, maxGrade: 11, label: 'Animals' },
    geography: { minGrade: 2, maxGrade: 11, label: 'Geography' },
    science: { minGrade: 2, maxGrade: 11, label: 'Science' },
    history: { minGrade: 3, maxGrade: 11, label: 'History' },
    space: { minGrade: 2, maxGrade: 11, label: 'Space' },
    nature: { minGrade: 1, maxGrade: 11, label: 'Nature' },
    sports: { minGrade: 2, maxGrade: 11, label: 'Sports' },
    countries: { minGrade: 3, maxGrade: 11, label: 'Countries' }
};

document.getElementById('grade').addEventListener('change', (e) => {
    currentGrade = parseInt(e.target.value);
    
    // Refresh topic menu if currently viewing one
    if (document.getElementById('mathOptions').style.display === 'block') {
        showTopicMenu('math');
    } else if (document.getElementById('englishOptions').style.display === 'block') {
        showTopicMenu('english');
    } else if (document.getElementById('gkOptions').style.display === 'block') {
        showTopicMenu('gk');
    }
});

document.getElementById('difficulty').addEventListener('change', (e) => {
    difficulty = e.target.value;
});

document.getElementById('questionCount').addEventListener('change', (e) => {
    totalQuestions = parseInt(e.target.value);
});

function startSubject(subject) {
    currentSubject = subject;
    score = 0;
    attempts = 0;
    
    document.getElementById('home').style.display = 'none';
    showTopicMenu(subject);
}

function showTopicMenu(subject) {
    const topics = subject === 'math' ? mathTopics : subject === 'english' ? englishTopics : gkTopics;
    const container = document.getElementById(subject + 'Options');
    const grid = container.querySelector('.topic-grid');
    
    grid.innerHTML = '';
    
    for (const [key, topic] of Object.entries(topics)) {
        if (currentGrade >= topic.minGrade && currentGrade <= topic.maxGrade) {
            const btn = document.createElement('button');
            btn.className = 'topic-btn';
            btn.style.background = subject === 'math' ? getMathColor(key) : subject === 'english' ? getEnglishColor(key) : getGKColor(key);
            btn.textContent = topic.label;
            btn.onclick = () => startTopic(key);
            grid.appendChild(btn);
        }
    }
    
    container.style.display = 'block';
}

function getMathColor(topic) {
    const colors = {
        counting: '#ff6b6b', addition: '#ff8787', subtraction: '#ffa94d',
        multiplication: '#ffd43b', division: '#74c0fc', fractions: '#b197fc',
        percentages: '#da77f2', algebra: '#ff6b9d'
    };
    return colors[topic];
}

function getEnglishColor(topic) {
    const colors = {
        letters: '#4ecdc4', spelling: '#45b7d1', grammar: '#5f27cd',
        vocabulary: '#00d2d3', nouns: '#1dd1a1', verbs: '#10ac84',
        reading: '#54a0ff', punctuation: '#2e86de'
    };
    return colors[topic];
}

function getGKColor(topic) {
    const colors = {
        animals: '#f39c12', geography: '#3498db', science: '#9b59b6',
        history: '#e74c3c', space: '#34495e', nature: '#27ae60',
        sports: '#e67e22', countries: '#16a085'
    };
    return colors[topic];
}

function startTopic(topic) {
    currentTopic = topic;
    questionCount = 0;
    score = 0;
    attempts = 0;
    document.getElementById('mathOptions').style.display = 'none';
    document.getElementById('englishOptions').style.display = 'none';
    document.getElementById('gkOptions').style.display = 'none';
    document.getElementById('questionArea').style.display = 'block';
    document.getElementById('score').textContent = `Score: 0/${totalQuestions}`;
    updateProgress();
    generateQuestion();
}

function goHome() {
    document.getElementById('home').style.display = 'flex';
    document.getElementById('mathOptions').style.display = 'none';
    document.getElementById('englishOptions').style.display = 'none';
    document.getElementById('gkOptions').style.display = 'none';
    document.getElementById('questionArea').style.display = 'none';
    document.getElementById('feedback').innerHTML = '';
}

function changeSubject() {
    document.getElementById('questionArea').style.display = 'none';
    document.getElementById('mathOptions').style.display = 'none';
    document.getElementById('englishOptions').style.display = 'none';
    document.getElementById('gkOptions').style.display = 'none';
    document.getElementById('home').style.display = 'flex';
}

function changeTopic() {
    document.getElementById('questionArea').style.display = 'none';
    showTopicMenu(currentSubject);
}

function generateQuestion() {
    if (questionCount >= totalQuestions) {
        showResults();
        return;
    }
    
    questionCount++;
    document.getElementById('feedback').innerHTML = '';
    selectedOption = null;
    updateProgress();
    
    if (currentSubject === 'math') {
        generateMathQuestion();
    } else if (currentSubject === 'english') {
        generateEnglishQuestion();
    } else {
        generateGKQuestion();
    }
}

function updateProgress() {
    document.getElementById('progress').textContent = `Question ${questionCount}/${totalQuestions}`;
}

function showResults() {
    const q = document.getElementById('question');
    const a = document.getElementById('answerSection');
    const feedback = document.getElementById('feedback');
    
    const percentage = Math.round((score / totalQuestions) * 100);
    
    q.innerHTML = `🎉 Quiz Complete! 🎉`;
    a.innerHTML = '';
    feedback.innerHTML = `<div style="font-size:1.8em; margin:30px 0;">
        You got <strong>${score}</strong> out of <strong>${totalQuestions}</strong> correct!<br>
        Score: <strong>${percentage}%</strong>
    </div>
    <button class="next-btn" onclick="startTopic('${currentTopic}')">Try Again</button>
    <button class="change-topic-btn" onclick="changeTopic()">Different Topic</button>`;
    feedback.className = 'feedback';
}

function selectOption(option) {
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    selectedOption = option;
}

function checkAnswer() {
    const feedback = document.getElementById('feedback');
    let userAnswer = selectedOption || document.getElementById('answer')?.value.trim().toLowerCase();
    const correct = currentAnswer.toLowerCase();
    
    attempts++;
    
    if (currentTopic === 'fractions' && !isNaN(userAnswer) && !isNaN(correct)) {
        if (Math.abs(parseFloat(userAnswer) - parseFloat(correct)) < 0.01) {
            score++;
            feedback.innerHTML = '✅ Correct! Great job!';
            feedback.className = 'feedback correct';
        } else {
            feedback.innerHTML = `❌ Not quite. The answer is ${currentAnswer}`;
            feedback.className = 'feedback incorrect';
        }
    } else if (userAnswer === correct) {
        score++;
        feedback.innerHTML = '✅ Correct! Great job!';
        feedback.className = 'feedback correct';
    } else {
        feedback.innerHTML = `❌ Not quite. The answer is ${currentAnswer}`;
        feedback.className = 'feedback incorrect';
    }
    
    document.getElementById('score').textContent = `Score: ${score}/${totalQuestions}`;
}
