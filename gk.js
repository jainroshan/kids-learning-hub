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
    
    if (currentTopic === 'animals') {
        const questions = [
            {q: 'What sound does a dog make?', opts: ['Bark', 'Meow', 'Moo', 'Quack'], a: 'Bark'},
            {q: 'What is the largest land animal?', opts: ['Elephant', 'Lion', 'Giraffe', 'Bear'], a: 'Elephant'},
            {q: 'Which animal has a long trunk?', opts: ['Elephant', 'Monkey', 'Tiger', 'Zebra'], a: 'Elephant'},
            {q: 'What do bees make?', opts: ['Honey', 'Milk', 'Eggs', 'Butter'], a: 'Honey'},
            {q: 'Which animal is known as the king of the jungle?', opts: ['Lion', 'Tiger', 'Bear', 'Elephant'], a: 'Lion'},
            {q: 'What do cows give us?', opts: ['Milk', 'Honey', 'Eggs', 'Wool'], a: 'Milk'},
            {q: 'Which bird cannot fly?', opts: ['Penguin', 'Eagle', 'Parrot', 'Sparrow'], a: 'Penguin'},
            {q: 'How many legs does a spider have?', opts: ['8', '6', '4', '10'], a: '8'},
            {q: 'What is the fastest land animal?', opts: ['Cheetah', 'Lion', 'Horse', 'Dog'], a: 'Cheetah'},
            {q: 'Which animal has a pouch?', opts: ['Kangaroo', 'Bear', 'Rabbit', 'Squirrel'], a: 'Kangaroo'},
            {q: 'What do sheep give us?', opts: ['Wool', 'Milk', 'Eggs', 'Honey'], a: 'Wool'},
            {q: 'Which animal lives in water and on land?', opts: ['Frog', 'Fish', 'Bird', 'Snake'], a: 'Frog'},
            {q: 'What is a baby dog called?', opts: ['Puppy', 'Kitten', 'Calf', 'Cub'], a: 'Puppy'},
            {q: 'Which animal has black and white stripes?', opts: ['Zebra', 'Tiger', 'Leopard', 'Horse'], a: 'Zebra'},
            {q: 'What do chickens lay?', opts: ['Eggs', 'Milk', 'Honey', 'Wool'], a: 'Eggs'}
        ];
        const item = questions[Math.floor(Math.random() * questions.length)];
        const shuffled = shuffleArray([...item.opts]);
        q.textContent = item.q;
        currentAnswer = item.a;
        a.innerHTML = '<div class="options">' + shuffled.map(opt => 
            `<button class="option-btn" onclick="selectOption('${opt}')">${opt}</button>`
        ).join('') + '</div><button class="submit-btn" onclick="checkAnswer()">Check Answer</button><button class="next-btn" onclick="generateQuestion()">Next Question</button>';
    } else if (currentTopic === 'geography') {
        const questions = [
            {q: 'What is the capital of the United States?', opts: ['Washington D.C.', 'New York', 'Los Angeles', 'Chicago'], a: 'Washington D.C.'},
            {q: 'Which is the largest ocean?', opts: ['Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'], a: 'Pacific Ocean'},
            {q: 'How many continents are there?', opts: ['7', '5', '6', '8'], a: '7'},
            {q: 'Which continent is the largest?', opts: ['Asia', 'Africa', 'Europe', 'North America'], a: 'Asia'},
            {q: 'What is the longest river in the world?', opts: ['Nile', 'Amazon', 'Mississippi', 'Yangtze'], a: 'Nile'},
            {q: 'Which country has the most people?', opts: ['China', 'India', 'USA', 'Russia'], a: 'China'},
            {q: 'What is the tallest mountain?', opts: ['Mount Everest', 'K2', 'Kilimanjaro', 'Denali'], a: 'Mount Everest'}
        ];
        const item = questions[Math.floor(Math.random() * questions.length)];
        q.textContent = item.q;
        currentAnswer = item.a;
        a.innerHTML = '<div class="options">' + shuffleArray([...item.opts]).map(opt => 
            `<button class="option-btn" onclick="selectOption('${opt}')">${opt}</button>`
        ).join('') + '</div><button class="submit-btn" onclick="checkAnswer()">Check Answer</button><button class="next-btn" onclick="generateQuestion()">Next Question</button>';
    } else if (currentTopic === 'science') {
        const questions = [
            {q: 'What do plants need to grow?', opts: ['Sunlight and water', 'Only water', 'Only sunlight', 'Only soil'], a: 'Sunlight and water'},
            {q: 'How many bones are in the human body?', opts: ['206', '150', '300', '100'], a: '206'},
            {q: 'What is the center of our solar system?', opts: ['The Sun', 'The Earth', 'The Moon', 'Mars'], a: 'The Sun'},
            {q: 'What gas do we breathe in?', opts: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Helium'], a: 'Oxygen'},
            {q: 'What is water made of?', opts: ['Hydrogen and oxygen', 'Only hydrogen', 'Only oxygen', 'Carbon and oxygen'], a: 'Hydrogen and oxygen'},
            {q: 'What is the hardest natural substance?', opts: ['Diamond', 'Gold', 'Iron', 'Silver'], a: 'Diamond'},
            {q: 'What force keeps us on the ground?', opts: ['Gravity', 'Magnetism', 'Friction', 'Electricity'], a: 'Gravity'}
        ];
        const item = questions[Math.floor(Math.random() * questions.length)];
        q.textContent = item.q;
        currentAnswer = item.a;
        a.innerHTML = '<div class="options">' + shuffleArray([...item.opts]).map(opt => 
            `<button class="option-btn" onclick="selectOption('${opt}')">${opt}</button>`
        ).join('') + '</div><button class="submit-btn" onclick="checkAnswer()">Check Answer</button><button class="next-btn" onclick="generateQuestion()">Next Question</button>';
    } else if (currentTopic === 'history') {
        const questions = [
            {q: 'Who was the first president of the United States?', opts: ['George Washington', 'Abraham Lincoln', 'Thomas Jefferson', 'John Adams'], a: 'George Washington'},
            {q: 'In which year did World War II end?', opts: ['1945', '1944', '1946', '1943'], a: '1945'},
            {q: 'Who discovered America?', opts: ['Christopher Columbus', 'George Washington', 'Benjamin Franklin', 'Thomas Edison'], a: 'Christopher Columbus'},
            {q: 'What year did man first land on the moon?', opts: ['1969', '1965', '1970', '1968'], a: '1969'},
            {q: 'Who wrote the Declaration of Independence?', opts: ['Thomas Jefferson', 'George Washington', 'Benjamin Franklin', 'John Adams'], a: 'Thomas Jefferson'},
            {q: 'What ancient wonder is in Egypt?', opts: ['Pyramids', 'Colosseum', 'Great Wall', 'Taj Mahal'], a: 'Pyramids'}
        ];
        const item = questions[Math.floor(Math.random() * questions.length)];
        q.textContent = item.q;
        currentAnswer = item.a;
        a.innerHTML = '<div class="options">' + shuffleArray([...item.opts]).map(opt => 
            `<button class="option-btn" onclick="selectOption('${opt}')">${opt}</button>`
        ).join('') + '</div><button class="submit-btn" onclick="checkAnswer()">Check Answer</button><button class="next-btn" onclick="generateQuestion()">Next Question</button>';
    } else if (currentTopic === 'space') {
        const questions = [
            {q: 'How many planets are in our solar system?', opts: ['8', '7', '9', '10'], a: '8'},
            {q: 'Which planet is closest to the Sun?', opts: ['Mercury', 'Venus', 'Earth', 'Mars'], a: 'Mercury'},
            {q: 'Which planet is known as the Red Planet?', opts: ['Mars', 'Venus', 'Jupiter', 'Saturn'], a: 'Mars'},
            {q: 'What is the largest planet?', opts: ['Jupiter', 'Saturn', 'Earth', 'Neptune'], a: 'Jupiter'},
            {q: 'What do we call a person who travels to space?', opts: ['Astronaut', 'Pilot', 'Sailor', 'Explorer'], a: 'Astronaut'},
            {q: 'How long does it take Earth to orbit the Sun?', opts: ['365 days', '30 days', '100 days', '500 days'], a: '365 days'},
            {q: 'What is the name of Earth\'s natural satellite?', opts: ['Moon', 'Sun', 'Mars', 'Venus'], a: 'Moon'}
        ];
        const item = questions[Math.floor(Math.random() * questions.length)];
        q.textContent = item.q;
        currentAnswer = item.a;
        a.innerHTML = '<div class="options">' + shuffleArray([...item.opts]).map(opt => 
            `<button class="option-btn" onclick="selectOption('${opt}')">${opt}</button>`
        ).join('') + '</div><button class="submit-btn" onclick="checkAnswer()">Check Answer</button><button class="next-btn" onclick="generateQuestion()">Next Question</button>';
    } else if (currentTopic === 'nature') {
        const questions = [
            {q: 'What color are emeralds?', opts: ['Green', 'Red', 'Blue', 'Yellow'], a: 'Green'},
            {q: 'How many seasons are there in a year?', opts: ['4', '2', '3', '5'], a: '4'},
            {q: 'What is the tallest type of tree?', opts: ['Redwood', 'Oak', 'Pine', 'Maple'], a: 'Redwood'},
            {q: 'What do caterpillars turn into?', opts: ['Butterflies', 'Birds', 'Bees', 'Beetles'], a: 'Butterflies'},
            {q: 'What is the hottest season?', opts: ['Summer', 'Winter', 'Spring', 'Fall'], a: 'Summer'},
            {q: 'What falls from clouds?', opts: ['Rain', 'Leaves', 'Snow only', 'Rocks'], a: 'Rain'},
            {q: 'What do bees collect from flowers?', opts: ['Nectar', 'Water', 'Leaves', 'Seeds'], a: 'Nectar'}
        ];
        const item = questions[Math.floor(Math.random() * questions.length)];
        q.textContent = item.q;
        currentAnswer = item.a;
        a.innerHTML = '<div class="options">' + shuffleArray([...item.opts]).map(opt => 
            `<button class="option-btn" onclick="selectOption('${opt}')">${opt}</button>`
        ).join('') + '</div><button class="submit-btn" onclick="checkAnswer()">Check Answer</button><button class="next-btn" onclick="generateQuestion()">Next Question</button>';
    } else if (currentTopic === 'sports') {
        const questions = [
            {q: 'How many players are on a soccer team?', opts: ['11', '9', '10', '12'], a: '11'},
            {q: 'What sport uses a bat and ball?', opts: ['Baseball', 'Soccer', 'Basketball', 'Tennis'], a: 'Baseball'},
            {q: 'How many points is a touchdown in football?', opts: ['6', '7', '3', '5'], a: '6'},
            {q: 'What sport is played at Wimbledon?', opts: ['Tennis', 'Golf', 'Cricket', 'Soccer'], a: 'Tennis'},
            {q: 'How many rings are in the Olympic symbol?', opts: ['5', '4', '6', '3'], a: '5'},
            {q: 'What sport uses a puck?', opts: ['Hockey', 'Soccer', 'Basketball', 'Baseball'], a: 'Hockey'},
            {q: 'How many bases are on a baseball field?', opts: ['4', '3', '5', '2'], a: '4'}
        ];
        const item = questions[Math.floor(Math.random() * questions.length)];
        q.textContent = item.q;
        currentAnswer = item.a;
        a.innerHTML = '<div class="options">' + shuffleArray([...item.opts]).map(opt => 
            `<button class="option-btn" onclick="selectOption('${opt}')">${opt}</button>`
        ).join('') + '</div><button class="submit-btn" onclick="checkAnswer()">Check Answer</button><button class="next-btn" onclick="generateQuestion()">Next Question</button>';
    } else if (currentTopic === 'countries') {
        const questions = [
            {q: 'What is the capital of France?', opts: ['Paris', 'London', 'Berlin', 'Rome'], a: 'Paris'},
            {q: 'Which country is famous for pizza?', opts: ['Italy', 'France', 'Spain', 'Greece'], a: 'Italy'},
            {q: 'What is the largest country by area?', opts: ['Russia', 'Canada', 'China', 'USA'], a: 'Russia'},
            {q: 'Which country has a maple leaf on its flag?', opts: ['Canada', 'USA', 'Mexico', 'Australia'], a: 'Canada'},
            {q: 'What is the capital of Japan?', opts: ['Tokyo', 'Beijing', 'Seoul', 'Bangkok'], a: 'Tokyo'},
            {q: 'Which country is home to kangaroos?', opts: ['Australia', 'India', 'Brazil', 'South Africa'], a: 'Australia'},
            {q: 'What country is the Great Wall in?', opts: ['China', 'Japan', 'India', 'Korea'], a: 'China'}
        ];
        const item = questions[Math.floor(Math.random() * questions.length)];
        q.textContent = item.q;
        currentAnswer = item.a;
        a.innerHTML = '<div class="options">' + shuffleArray([...item.opts]).map(opt => 
            `<button class="option-btn" onclick="selectOption('${opt}')">${opt}</button>`
        ).join('') + '</div><button class="submit-btn" onclick="checkAnswer()">Check Answer</button><button class="next-btn" onclick="generateQuestion()">Next Question</button>';
    }
}
