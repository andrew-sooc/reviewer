
// ================================
// SCIENCE QUEST
// GRADE 10 SECOND QUARTER
// ================================

const $ = id => document.getElementById(id);

// XP SYSTEM

let xp = Number(localStorage.getItem("sq_xp") || 0);

let flashSeen = JSON.parse(
    localStorage.getItem("sq_seen") || "[]"
);

let quizCorrect = 0;
let quizAnswered = 0;

function save() {

    localStorage.setItem("sq_xp", xp);

    localStorage.setItem(
        "sq_seen",
        JSON.stringify(flashSeen)
    );

    $("headerScore").textContent = xp;
    $("xpStat").textContent = xp + " XP";

    $("totalXP").textContent = xp + " XP";

    updateRank();
}

function addXP(amount) {

    xp += amount;

    save();
}

// ================================
// NAVIGATION
// ================================

function showPage(id) {

    document.querySelectorAll(".section")
        .forEach(section => {

            section.classList.toggle(
                "active",
                section.id === id
            );

        });

    document.querySelectorAll("nav button")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.page === id
            );

        });

    if (id === "progress") {
        updateProgress();
    }

    if (id === "quiz" && !quizStarted) {
        startQuiz();
    }
}

document.querySelectorAll("nav button")
.forEach(button => {

    button.addEventListener("click", () => {

        showPage(button.dataset.page);

    });

});

// ================================
// FLASHCARDS
// ================================

const cards = [

    [
        "What is linear momentum?",
        "The quantity of motion of an object. p = mv."
    ],

    [
        "What is the formula for momentum?",
        "p = mv (mass multiplied by velocity)."
    ],

    [
        "What is the SI unit of momentum?",
        "Kilogram-meter per second (kg·m/s)."
    ],

    [
        "What is impulse?",
        "The effect of a net force acting over time. I = FΔt."
    ],

    [
        "What is the impulse-momentum theorem?",
        "Impulse equals the change in momentum."
    ],

    [
        "What is conservation of momentum?",
        "Total momentum before an interaction equals total momentum after it in an isolated system."
    ],

    [
        "What is an elastic collision?",
        "A collision where both momentum and kinetic energy are conserved."
    ],

    [
        "What is an inelastic collision?",
        "A collision where momentum is conserved but kinetic energy is not."
    ],

    [
        "What is electromagnetic induction?",
        "The production of an induced voltage due to changing magnetic flux."
    ],

    [
        "What does an electric motor do?",
        "Converts electrical energy into mechanical energy."
    ],

    [
        "What does a generator do?",
        "Converts mechanical energy into electrical energy."
    ],

    [
        "What is a step-up transformer?",
        "A transformer that increases voltage."
    ]

];

let cardIndex = 0;
let flipped = false;

function renderCard() {

    let card = cards[cardIndex];

    $("flashText").textContent =
        flipped ? card[1] : card[0];

    $("flashLabel").textContent =
        flipped ? "ANSWER" : "QUESTION";

    $("flashHint").textContent =
        "Click to flip the card.";

    $("flashCount").textContent =
        `Card ${cardIndex + 1} of ${cards.length}`;

    $("flashProgress").style.width =
        ((cardIndex + 1) / cards.length * 100) + "%";

}

function flipCard() {

    if (!flipped && !flashSeen.includes(cardIndex)) {

        flashSeen.push(cardIndex);

        addXP(5);

    }

    flipped = !flipped;

    renderCard();

}

$("flashcard").onclick = flipCard;

$("prevCard").onclick = () => {

    cardIndex =
        (cardIndex - 1 + cards.length) % cards.length;

    flipped = false;

    renderCard();

};

$("nextCard").onclick = () => {

    cardIndex =
        (cardIndex + 1) % cards.length;

    flipped = false;

    renderCard();

};

// ================================
// FORMULA CALCULATOR
// ================================

const calcFields = {

    momentum: [
        ["mass", "Mass (kg)"],
        ["velocity", "Velocity (m/s)"]
    ],

    impulse: [
        ["force", "Force (N)"],
        ["time", "Time (s)"]
    ],

    change: [
        ["mass", "Mass (kg)"],
        ["vi", "Initial velocity (m/s)"],
        ["vf", "Final velocity (m/s)"]
    ]

};

function renderFields() {

    let type = $("calcType").value;

    $("fields").innerHTML = calcFields[type]
        .map(([id, label]) => `

            <label>${label}</label>

            <input
                id="${id}"
                type="number"
                step="any"
                placeholder="Enter ${label}"
            >

        `).join("");

    $("calcResult").innerHTML = "";

}

$("calcType").onchange = renderFields;

renderFields();

$("calculate").onclick = () => {

    let type = $("calcType").value;

    let values = calcFields[type].map(
        ([id]) => $(id).value.trim()
    );

    if (values.some(v => v === "" || !Number.isFinite(Number(v)))) {

        $("calcResult").innerHTML =
            '<p class="feedback bad">Enter valid numbers first!</p>';

        return;

    }

    let nums = values.map(Number);

    let result;
    let formula;
    let unit;

    if (type === "momentum") {

        result = nums[0] * nums[1];

        formula = "p = mv";

        unit = "kg·m/s";

    }

    else if (type === "impulse") {

        result = nums[0] * nums[1];

        formula = "I = FΔt";

        unit = "N·s";

    }

    else {

        result = nums[0] * (nums[2] - nums[1]);

        formula = "Δp = m(vf - vi)";

        unit = "kg·m/s";

    }

    $("calcResult").innerHTML = `

        <div class="result">

            ${formula}

            <br>

            Answer: ${Number(result.toFixed(4))} ${unit}

        </div>

    `;

    addXP(2);

};

// ================================
// QUIZ QUESTIONS
// ================================

const questions = [

    [
        "What is the formula for linear momentum?",
        ["p = mv", "p = F/t", "p = m/v", "p = ma"],
        0,
        "Momentum equals mass multiplied by velocity."
    ],

    [
        "A 3 kg object moves at 4 m/s. What is its momentum?",
        ["7 kg·m/s", "12 kg·m/s", "1.33 kg·m/s", "24 kg·m/s"],
        1,
        "p = 3 × 4 = 12 kg·m/s."
    ],

    [
        "What is the SI unit of impulse?",
        ["Newton", "Joule", "Newton-second", "Watt"],
        2,
        "Impulse is measured in N·s."
    ],

    [
        "A force of 10 N acts for 2 seconds. What is the impulse?",
        ["5 N·s", "12 N·s", "20 N·s", "100 N·s"],
        2,
        "I = 10 × 2 = 20 N·s."
    ],

    [
        "Impulse is equal to the...",
        ["Change in momentum", "Change in mass", "Total energy", "Speed"],
        0,
        "Impulse equals the change in momentum."
    ],

    [
        "In an isolated system, total momentum is...",
        ["Always zero", "Conserved", "Destroyed", "Increasing"],
        1,
        "Total momentum remains constant."
    ],

    [
        "Which quantities are conserved in an elastic collision?",
        ["Momentum only", "Kinetic energy only", "Both", "Neither"],
        2,
        "Both momentum and kinetic energy are conserved."
    ],

    [
        "In an inelastic collision...",
        ["Momentum is not conserved", "Kinetic energy is not conserved", "Mass disappears", "Objects must bounce"],
        1,
        "Some kinetic energy transforms into other forms."
    ],

    [
        "What produces an induced voltage in a coil?",
        ["Changing magnetic field", "Increasing mass", "Light", "Sound"],
        0,
        "Changing magnetic flux induces voltage."
    ],

    [
        "An electric motor converts...",
        ["Mechanical to electrical", "Electrical to mechanical", "Heat to mass", "Sound to light"],
        1,
        "A motor converts electrical energy into mechanical energy."
    ],

    [
        "A generator converts...",
        ["Electrical to mechanical", "Chemical to sound", "Mechanical to electrical", "Light to heat"],
        2,
        "A generator produces electricity from mechanical energy."
    ],

    [
        "What does a step-up transformer do?",
        ["Lowers voltage", "Raises voltage", "Stops current", "Creates energy"],
        1,
        "A step-up transformer increases voltage."
    ],

    [
        "Why is high voltage used in transmission?",
        ["Increase resistance", "Reduce current and power losses", "Make wires heavier", "Stop electricity"],
        1,
        "Higher voltage means lower current for the same power."
    ],

    [
        "What carries electricity over long distances?",
        ["Transmission lines", "Household switches", "Batteries only", "Insulators"],
        0,
        "Transmission lines carry high-voltage electricity."
    ],

    [
        "What does a step-down transformer do?",
        ["Increases voltage", "Lowers voltage", "Stores momentum", "Creates fuel"],
        1,
        "It lowers voltage for distribution and use."
    ]

];

// ================================
// QUIZ SYSTEM
// ================================

let qIndex = 0;
let selected = false;
let quizStarted = false;

function startQuiz() {

    quizStarted = true;

    qIndex = 0;

    quizCorrect = 0;

    quizAnswered = 0;

    renderQuestion();

}

function renderQuestion() {

    selected = false;

    let q = questions[qIndex];

    $("quizNumber").textContent =
        `QUESTION ${qIndex + 1} / ${questions.length}`;

    $("quizProgress").style.width =
        (qIndex / questions.length * 100) + "%";

    $("questionText").textContent = q[0];

    $("feedback").textContent = "";

    $("feedback").className = "feedback";

    $("nextQuestion").disabled = true;

    $("nextQuestion").textContent =
        qIndex === questions.length - 1
        ? "See My Results"
        : "Next Question";

    $("answers").innerHTML = q[1].map((answer, index) => `

        <button class="answer" data-index="${index}">

            ${String.fromCharCode(65 + index)}. ${answer}

        </button>

    `).join("");

    document.querySelectorAll(".answer")
        .forEach(button => {

            button.onclick = () => {

                chooseAnswer(Number(button.dataset.index));

            };

        });

}

function chooseAnswer(index) {

    if (selected) return;

    selected = true;

    let q = questions[qIndex];

    let buttons = document.querySelectorAll(".answer");

    buttons.forEach((button, i) => {

        button.disabled = true;

        if (i === q[2]) {
            button.classList.add("correct");
        }

        if (i === index && index !== q[2]) {
            button.classList.add("wrong");
        }

    });

    if (index === q[2]) {

        quizCorrect++;

        addXP(10);

        $("feedback").textContent =
            "Correct! +10 XP. " + q[3];

        $("feedback").className = "feedback good";

    }

    else {

        $("feedback").textContent =
            "Not quite. " + q[3];

        $("feedback").className = "feedback bad";

    }

    quizAnswered++;

    $("nextQuestion").disabled = false;

}

function advanceQuiz() {

    if (qIndex < questions.length - 1) {

        qIndex++;

        renderQuestion();

        return;

    }

    let percent = Math.round(
        quizCorrect / questions.length * 100
    );

    $("quizProgress").style.width = "100%";

    $("questionText").textContent =
        `Challenge complete! You scored ${quizCorrect} out of ${questions.length}.`;

    $("answers").innerHTML = `

        <div class="result">

            Your Score: ${percent}%

            <br><br>

            ${
                percent >= 80
                ? "Excellent work, scientist!"
                : percent >= 60
                ? "Good effort! Keep reviewing."
                : "Keep practicing. You can improve!"
            }

        </div>

    `;

    $("feedback").textContent = "Quiz completed!";

    $("nextQuestion").textContent = "Try Again ↻";

    $("nextQuestion").onclick = () => {

        $("nextQuestion").onclick = advanceQuiz;

        startQuiz();

    };

    updateProgress();

}

$("nextQuestion").onclick = advanceQuiz;

// ================================
// RANK SYSTEM
// ================================

function updateRank() {

    const ranks = [

        ["Science Rookie", 0],

        ["Curious Explorer", 50],

        ["Momentum Master", 120],

        ["Electricity Expert", 220],

        ["Science Legend", 350]

    ];

    let current = ranks.filter(
        rank => xp >= rank[1]
    ).at(-1);

    let next = ranks.find(
        rank => rank[1] > xp
    );

    $("rank").textContent = current[0];

    $("rankMessage").textContent = next
        ? `${next[1] - xp} XP until ${next[0]}!`
        : "You reached the highest rank!";

    $("rankProgress").style.width = next
        ? ((xp - current[1]) / (next[1] - current[1]) * 100) + "%"
        : "100%";

}

// ================================
// PROGRESS SYSTEM
// ================================

function updateProgress() {

    $("accuracy").textContent = quizAnswered
        ? Math.round(quizCorrect / quizAnswered * 100) + "%"
        : "0%";

    $("accuracyText").textContent =
        `${quizCorrect} correct out of ${quizAnswered} answered questions.`;

    let tasks = [

        "I understand linear momentum.",

        "I understand impulse.",

        "I can explain conservation of momentum.",

        "I can compare elastic and inelastic collisions.",

        "I understand electromagnetic induction.",

        "I can distinguish motors from generators.",

        "I understand electricity distribution."

    ];

    $("checklist").innerHTML = tasks.map((task, i) => `

        <label style="display:flex;gap:10px;margin:13px 0">

            <input
                type="checkbox"
                data-task="${i}"
                style="width:auto"
            >

            ${task}

        </label>

    `).join("");

    document.querySelectorAll("[data-task]")
        .forEach(check => {

            check.checked =
                localStorage.getItem("sq_task_" + check.dataset.task) === "true";

            check.onchange = () => {

                localStorage.setItem(
                    "sq_task_" + check.dataset.task,
                    check.checked
                );

            };

        });

}

// ================================
// RESET PROGRESS
// ================================

$("reset").onclick = () => {

    if (confirm("Are you sure you want to reset your progress?")) {

        xp = 0;

        flashSeen = [];

        localStorage.removeItem("sq_xp");

        localStorage.removeItem("sq_seen");

        for (let i = 0; i < 7; i++) {

            localStorage.removeItem("sq_task_" + i);

        }

        save();

        updateProgress();

        renderCard();

    }

};

// ================================
// INITIALIZE WEBSITE
// ================================

save();

renderCard();
