const rewards = [
    [5000, "#FF0000"],
    [10, "#0000FF"],
    [500, "#FFDD00"],
    [100, "#FFA500"],
    [2500, "#4B0082"],
    [50, "#00CC00"],
    [250, "#EE82EE"],
    ["x2", "#FF0000"], // double
    [100, "#FFA500"],
    [":2", "#FFDD00"], // half
    [1000, "#00CC00"],
    [50, "#0000FF"],
    [250, "#4B0082"],
    [20, "#EE82EE"],
    ["*", "#222222"] // lost all
];

const w = document.getElementById("w"),
    c = document.getElementById("c"),
    s = document.getElementById("s"),
    r = document.getElementById("r"),
    p = document.getElementById("p");

const segmentMaxWidth = Math.ceil((400 * Math.PI) / rewards.length),
    segmentHalfWidth = 0.5 * segmentMaxWidth,
    segmentRotate = 360 / rewards.length;

const STATE_IDLE = "idle",
    STATE_ROTATING = "rotating",
    MAX_ROUNDS = 10;

let state = STATE_IDLE,
    round = MAX_ROUNDS,
    score = 0;

updateGui();

// segments
for (let i = 0, j = 0; i < rewards.length; i++) {
    j = rewards.length - 1 - i; // backwards because of reverse index at lookup
    const segment = document.createElement("div");
    segment.classList.add("segment");
    segment.style.left = `${-segmentHalfWidth}px`;
    segment.style.borderColor = `transparent transparent ${rewards[i][1]} transparent`;
    segment.style.borderWidth = `0 ${segmentHalfWidth}px 200px ${segmentHalfWidth}px`; // overshoot 2px for arc
    segment.style.transform = `rotateZ(${180 + j * segmentRotate}deg)`;

    const txt = document.createElement("div");
    txt.classList.add("txt");
    const reward = rewards[i][0].toString();
    const str = ["x2", ":2", "*"].includes(reward)
        ? reward
        : reward.split("").join("<br>");
    txt.innerHTML = str;
    txt.style.width = `${segmentMaxWidth}px`;
    segment.appendChild(txt);

    c.appendChild(segment);
}

// dividers
for (let i = 0; i < rewards.length; i++) {
    const divider = document.createElement("div");
    divider.classList.add("divider");
    divider.style.transform = `rotateZ(${180 + 0.5 * segmentRotate + i * segmentRotate
        }deg)`;
    c.appendChild(divider);
}

// turn
function turn(deg = null) {
    // stats
    --round;
    updateGui();
    // turn
    const currentRotation = getRotationAngle(w),
        minimumRotation = 600,
        newRotation = deg || minimumRotation + Math.round(Math.random() * 720),
        time = Math.round((1 + newRotation / 180) * 1000);
    state = STATE_ROTATING;
    w.style.transition = `transform ${time}ms cubic-bezier(0.42, -0.1, 0.58, 1.02)`;
    w.style.transform = `rotate(${newRotation}deg)`;

    // post turn
    setTimeout(() => {
        const rot = newRotation % 360;
        w.style.transition = "none";
        w.style.transform = `rotate(${rot}deg)`;

        const segmentIndex =
            rot < 0.5 * segmentRotate
                ? rewards.length - 1
                : Math.floor((rot - 0.5 * segmentRotate) / segmentRotate);

        score = updateScore(score, rewards[segmentIndex][0]);

        updateGui();

        if (round == 0) {
            gameOver();
        } else {
            state = STATE_IDLE;
        }
    }, time + 100);
}

// Update texts
function updateGui() {
    r.innerText = round.toString();
    s.innerText = score.toString();
}

// Return updated score
function updateScore(score, reward) {
    if (reward == "x2") return Math.min(score * 2);
    if (reward == ":2") return Math.min(score / 2);
    if (reward == "*") return 0;
    return Math.min(score + reward);
}

// Gameover function
function gameOver() {
    console.log("end");
    setTimeout(() => {
        score = 0;
        round = MAX_ROUNDS;
        state = STATE_IDLE;
        updateGui();
    }, 2000);
}

// Get angle from element
function getRotationAngle(element) {
    const computedStyle = window.getComputedStyle(element);
    const transform =
        computedStyle.transform ||
        computedStyle.webkitTransform ||
        computedStyle.mozTransform;

    if (transform === "none") {
        return 0;
    }

    const values = transform.split("(")[1].split(")")[0].split(",");
    const a = parseFloat(values[0]);
    const b = parseFloat(values[1]);
    return Math.round(Math.atan2(b, a) * (180 / Math.PI));
}

// Click listener
w.addEventListener("click", () => state !== STATE_ROTATING && turn());
