let currentSubject = '';
let currentGrade = 2;
let currentTopic = '';
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

document.getElementById('grade').addEventListener('change', (e) => {
    currentGrade = parseInt(e.target.value);
});

function startSubject(subject) {
    currentSubject = subject;
    score = 0;
    attempts = 0;
    
    document.getElementById('home').style.display = 'none';
    showTopicMenu(subject);
}

function showTopicMenu(subject) {
    const topics = subject === 'math' ? mathTopics : englishTopics;
    const container = document.getElementById(subject + 'Options');
    const grid = container.querySelector('.topic-grid');
    
    grid.innerHTML = '';
    
    for (const [key, topic] of Object.entries(topics)) {
        if (currentGrade >= topic.minGrade && currentGrade <= topic.maxGrade) {
            const btn = document.createElement('button');
            btn.className = 'topic-btn';
            btn.style.background = subject === 'math' ? getMathColor(key) : getEnglishColor(key);
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

function startTopic(topic) {
    currentTopic = topic;
    document.getElementById('mathOptions').style.display = 'none';
    document.getElementById('englishOptions').style.display = 'none';
    document.getElementById('questionArea').style.display = 'block';
    generateQuestion();
}

function goHome() {
    document.getElementById('home').style.display = 'flex';
    document.getElementById('mathOptions').style.display = 'none';
    document.getElementById('englishOptions').style.display = 'none';
    document.getElementById('questionArea').style.display = 'none';
    document.getElementById('feedback').innerHTML = '';
}

function changeSubject() {
    document.getElementById('questionArea').style.display = 'none';
    document.getElementById('mathOptions').style.display = 'none';
    document.getElementById('englishOptions').style.display = 'none';
    document.getElementById('home').style.display = 'flex';
}

function changeTopic() {
    document.getElementById('questionArea').style.display = 'none';
    showTopicMenu(currentSubject);
}

function generateQuestion() {
    document.getElementById('feedback').innerHTML = '';
    selectedOption = null;
    
    if (currentSubject === 'math') {
        generateMathQuestion();
    } else {
        generateEnglishQuestion();
    }
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
    
    document.getElementById('score').textContent = `Score: ${score}/${attempts}`;
}
