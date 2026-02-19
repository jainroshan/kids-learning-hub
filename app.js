let currentSubject = '';
let currentGrade = 2;
let currentTopic = '';
let score = 0;
let attempts = 0;
let currentAnswer = '';
let selectedOption = null;

document.getElementById('grade').addEventListener('change', (e) => {
    currentGrade = parseInt(e.target.value);
});

function startSubject(subject) {
    currentSubject = subject;
    score = 0;
    attempts = 0;
    
    document.getElementById('home').style.display = 'none';
    document.getElementById(subject + 'Options').style.display = 'block';
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
