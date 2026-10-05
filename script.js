// ==========================================
// GOLFSCO
// VALLE DEL SOL GOLF COURSE
// ==========================================


// ==========================================
// VALLE DEL SOL COURSE DATA
// ==========================================

const holes = [
    {
        number: 1,
        name: "El Amanecer",
        par: 4,
        hcp: 8,
        yards: 365
    },
    {
        number: 2,
        name: "Los Malinches",
        par: 4,
        hcp: 2,
        yards: 424
    },
    {
        number: 3,
        name: "La Garza Tigre",
        par: 5,
        hcp: 4,
        yards: 596
    },
    {
        number: 4,
        name: "La Jacana Norteña",
        par: 4,
        hcp: 6,
        yards: 393
    },
    {
        number: 5,
        name: "El Jardin",
        par: 3,
        hcp: 18,
        yards: 158
    },
    {
        number: 6,
        name: "El Pozo",
        par: 4,
        hcp: 16,
        yards: 359
    },
    {
        number: 7,
        name: "La Isla",
        par: 3,
        hcp: 14,
        yards: 181
    },
    {
        number: 8,
        name: "La Gallareta Morada",
        par: 5,
        hcp: 10,
        yards: 569
    },
    {
        number: 9,
        name: "El Martin Pescador",
        par: 4,
        hcp: 12,
        yards: 409
    },
    {
        number: 10,
        name: "La Cascada",
        par: 5,
        hcp: 11,
        yards: 521
    },
    {
        number: 11,
        name: "La Garza",
        par: 4,
        hcp: 7,
        yards: 376
    },
    {
        number: 12,
        name: "El Cenizaro",
        par: 4,
        hcp: 1,
        yards: 456
    },
    {
        number: 13,
        name: "El Roble Sabana",
        par: 4,
        hcp: 15,
        yards: 354
    },
    {
        number: 14,
        name: "El Coyote",
        par: 4,
        hcp: 9,
        yards: 403
    },
    {
        number: 15,
        name: "El Gavilan",
        par: 3,
        hcp: 5,
        yards: 219
    },
    {
        number: 16,
        name: "Las Veraneras",
        par: 4,
        hcp: 17,
        yards: 388
    },
    {
        number: 17,
        name: "La Quebrada",
        par: 3,
        hcp: 13,
        yards: 142
    },
    {
        number: 18,
        name: "La Puesta del Sol",
        par: 5,
        hcp: 3,
        yards: 632
    }
];


// ==========================================
// CURRENT ROUND
// ==========================================

let scores = Array(18).fill(null);


// ==========================================
// SAVED ROUNDS
// ==========================================

let savedRounds = JSON.parse(
    localStorage.getItem("golfScoRounds")
) || [];


// ==========================================
// CREATE SCORECARD
// ==========================================

function createScorecard() {

    const scoreRows =
        document.querySelector("#scoreRows");

    scoreRows.innerHTML = "";


    for (let i = 0; i < holes.length; i++) {

        const hole = holes[i];

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <th>${hole.number}</th>

            <td class="hole-name">
                ${hole.name}
            </td>

            <td>${hole.par}</td>

            <td>${hole.hcp}</td>

            <td>${hole.yards}</td>

            <td>
                <input
                    class="score-input"
                    type="number"
                    min="1"
                    max="20"
                    value="${scores[i] ?? ""}"
                    onchange="updateScore(${i}, this.value)"
                >
            </td>

            <td id="holePar-${i}">
                —
            </td>
        `;


        scoreRows.appendChild(row);
    }


    updateTotals();
}


// ==========================================
// UPDATE SCORE
// ==========================================

function updateScore(hole, value) {

    if (value === "") {

        scores[hole] = null;

    } else {

        scores[hole] = Number(value);
    }


    updateTotals();
}


// ==========================================
// UPDATE TOTALS
// ==========================================

function updateTotals() {

    let total = 0;

    let frontNine = 0;

    let backNine = 0;

    let completedPar = 0;

    let completedHoles = 0;


    for (let i = 0; i < 18; i++) {

        if (scores[i] !== null) {

            total += scores[i];

            completedPar += holes[i].par;

            completedHoles++;


            if (i < 9) {

                frontNine += scores[i];

            } else {

                backNine += scores[i];
            }


            const difference =
                scores[i] - holes[i].par;


            const cell =
                document.querySelector(
                    `#holePar-${i}`
                );


            if (difference === 0) {

                cell.textContent = "0";

            } else if (difference > 0) {

                cell.textContent =
                    "+" + difference;

            } else {

                cell.textContent =
                    difference;
            }
        }
    }


    const toPar =
        total - completedPar;


    document.querySelector("#totalScore").textContent =
        completedHoles > 0 ? total : "0";


    document.querySelector("#frontNine").textContent =
        frontNine || "0";


    document.querySelector("#backNine").textContent =
        backNine || "0";


    document.querySelector("#summaryTotal").textContent =
        total || "0";


    if (completedHoles === 0) {

        document.querySelector("#totalPar").textContent = "0";

        document.querySelector("#summaryPar").textContent = "0";

    } else {

        const formatted =
            formatToPar(toPar);


        document.querySelector("#totalPar").textContent =
            formatted;


        document.querySelector("#summaryPar").textContent =
            formatted;
    }
}


// ==========================================
// FORMAT TO PAR
// ==========================================

function formatToPar(number) {

    if (number === 0) {

        return "0";
    }


    if (number > 0) {

        return "+" + number;
    }


    return number;
}


// ==========================================
// SAVE ROUND
// ==========================================

function saveRound() {

    const playerName =
        document
            .querySelector("#playerName")
            .value
            .trim();


    const roundDate =
        document
            .querySelector("#roundDate")
            .value;


    if (playerName === "") {

        alert("Please enter your name.");

        return;
    }


    const completedHoles =
        scores.filter(
            score => score !== null
        ).length;


    if (completedHoles === 0) {

        alert("Please enter at least one score.");

        return;
    }


    let total = 0;

    let par = 0;


    for (let i = 0; i < 18; i++) {

        if (scores[i] !== null) {

            total += scores[i];

            par += holes[i].par;
        }
    }


    const toPar =
        total - par;


    const round = {

        id: Date.now(),

        player: playerName,

        course: "Valle del Sol",

        date:
            roundDate ||
            new Date()
                .toISOString()
                .split("T")[0],

        scores: [...scores],

        total: total,

        toPar: toPar
    };


    savedRounds.push(round);


    localStorage.setItem(
        "golfScoRounds",
        JSON.stringify(savedRounds)
    );


    document.querySelector("#saveMessage").textContent =
        "Round saved successfully!";


    displayHistory();


    setTimeout(() => {

        document
            .querySelector("#history")
            .scrollIntoView({
                behavior: "smooth"
            });

    }, 500);
}


// ==========================================
// DISPLAY ROUND HISTORY
// ==========================================

function displayHistory() {

    const history =
        document.querySelector("#roundHistory");


    history.innerHTML = "";


    if (savedRounds.length === 0) {

        history.innerHTML = `
            <div class="empty-history">
                No rounds saved yet.
                Start your first Valle del Sol round.
            </div>
        `;

        return;
    }


    const reversedRounds =
        [...savedRounds].reverse();


    reversedRounds.forEach(round => {

        const card =
            document.createElement("div");


        card.className =
            "history-card";


        card.innerHTML = `
            <div>

                <div class="history-course">
                    Valle del Sol
                </div>

                <div class="history-player">
                    ${round.player}
                </div>

            </div>


            <div>
                ${formatDate(round.date)}
            </div>


            <div>

                <div class="history-score">
                    ${round.total}
                </div>

                <div class="history-par">
                    ${formatToPar(round.toPar)}
                </div>

            </div>


            <div class="history-buttons">

                <button
                    class="history-button"
                    onclick="openRound(${round.id})"
                >
                    Open
                </button>

                <button
                    class="history-button delete-button"
                    onclick="deleteRound(${round.id})"
                >
                    Delete
                </button>

            </div>
        `;


        history.appendChild(card);
    });
}


// ==========================================
// OPEN SAVED ROUND
// ==========================================

function openRound(id) {

    const round =
        savedRounds.find(
            round => round.id === id
        );


    if (!round) {

        return;
    }


    document.querySelector("#playerName").value =
        round.player;


    document.querySelector("#roundDate").value =
        round.date;


    scores = [...round.scores];


    createScorecard();


    document
        .querySelector("#scorecard")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ==========================================
// DELETE ROUND
// ==========================================

function deleteRound(id) {

    const confirmed =
        confirm("Delete this round?");


    if (!confirmed) {

        return;
    }


    savedRounds =
        savedRounds.filter(
            round => round.id !== id
        );


    localStorage.setItem(
        "golfScoRounds",
        JSON.stringify(savedRounds)
    );


    displayHistory();
}


// ==========================================
// RESET CURRENT ROUND
// ==========================================

function resetRound() {

    scores =
        Array(18).fill(null);


    document.querySelector("#playerName").value =
        "";


    document.querySelector("#roundDate").value =
        "";


    document.querySelector("#saveMessage").textContent =
        "";


    createScorecard();
}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(date) {

    if (!date) {

        return "No date";
    }


    const parts =
        date.split("-");


    if (parts.length !== 3) {

        return date;
    }


    return `${parts[1]}/${parts[2]}/${parts[0]}`;
}


// ==========================================
// NAVIGATION
// ==========================================

function goToScorecard() {

    document
        .querySelector("#scorecard")
        .scrollIntoView({
            behavior: "smooth"
        });
}


function goToHistory() {

    document
        .querySelector("#history")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ==========================================
// START
// ==========================================

createScorecard();

displayHistory();