// ==========================================
// MY CROPS - LocalStorage
// ==========================================

// Safe localStorage JSON parser to avoid breaking when stored data is corrupted
function safeGetJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw);
    } catch (e) {
        try { console.warn('safeGetJSON parse error for', key, e); } catch (err) {}
        return fallback;
    }
}

const openCropForm = document.getElementById("openCropForm");
const cropForm = document.getElementById("cropForm");
const saveCrop = document.getElementById("saveCrop");
const cancelCrop = document.getElementById("cancelCrop");
const cropGrid = document.getElementById("cropGrid");

let savedCrops = safeGetJSON("kisanCrops", []);

let editIndex = -1;


// Open crop form
if (openCropForm) {
    openCropForm.addEventListener("click", () => {
        cropForm.classList.add("show");
        document.getElementById("cropName").focus();
    });
}


// Cancel crop
if (cancelCrop) {
    cancelCrop.addEventListener("click", () => {
        closeCropForm();
    });
}


// Save / Update Crop
if (saveCrop) {
    saveCrop.addEventListener("click", () => {

        const name =
            document.getElementById("cropName").value.trim();

        const area =
            document.getElementById("cropArea").value;

        const sowing =
            document.getElementById("sowingDate").value;

        const harvest =
            document.getElementById("harvestDate").value;


        if (!name || !area || !sowing || !harvest) {
            alert("Please fill all crop details.");
            return;
        }


        const crop = {
            name,
            area,
            sowing,
            harvest
        };


        if (editIndex !== -1) {

            savedCrops[editIndex] = crop;
            editIndex = -1;

            saveCrop.textContent = "Save Crop";

            alert("Crop updated successfully! ✅");

        } else {

            savedCrops.push(crop);

            alert(`${name} added successfully! 🌾`);
        }


        localStorage.setItem(
            "kisanCrops",
            JSON.stringify(savedCrops)
        );


        renderCrops();
        closeCropForm();

    });
}


// Close crop form
function closeCropForm() {

    if (!cropForm) return;

    cropForm.classList.remove("show");

    document.getElementById("cropName").value = "";
    document.getElementById("cropArea").value = "";
    document.getElementById("sowingDate").value = "";
    document.getElementById("harvestDate").value = "";

    editIndex = -1;

    if (saveCrop) {
        saveCrop.textContent = "Save Crop";
    }
}


// Display crops
function renderCrops() {

    if (!cropGrid) return;

    cropGrid.innerHTML = "";


    if (savedCrops.length === 0) {

        savedCrops.push({
            name: "Wheat",
            area: "2.5",
            sowing: "2026-07-15",
            harvest: "2026-08-28"
        });


        localStorage.setItem(
            "kisanCrops",
            JSON.stringify(savedCrops)
        );
    }


    savedCrops.forEach((crop, index) => {

        const card =
            document.createElement("div");

        card.className =
            "crop-detail-card";


        card.innerHTML = `

            <div class="big-crop-icon">
                🌾
            </div>

            <h3>${crop.name}</h3>

            <p>
                Land Area:
                <strong>${crop.area} Acres</strong>
            </p>

            <p>
                Sowing:
                <strong>${formatDate(crop.sowing)}</strong>
            </p>

            <p>
                Harvest:
                <strong>${formatDate(crop.harvest)}</strong>
            </p>

            <span class="crop-status">
                Growing
            </span>

            <div class="crop-actions">

                <button onclick="editCrop(${index})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteCrop(${index})"
                >
                    Delete
                </button>

            </div>
        `;


        cropGrid.appendChild(card);

    });
}


// Format date
function formatDate(date) {

    const d = new Date(date);

    return d.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}


// Edit crop
function editCrop(index) {

    const crop =
        savedCrops[index];

    document.getElementById("cropName").value =
        crop.name;

    document.getElementById("cropArea").value =
        crop.area;

    document.getElementById("sowingDate").value =
        crop.sowing;

    document.getElementById("harvestDate").value =
        crop.harvest;

    editIndex = index;

    saveCrop.textContent =
        "Update Crop";

    cropForm.classList.add("show");

    window.scrollTo({
        top: cropForm.offsetTop - 30,
        behavior: "smooth"
    });
}


// Delete crop
function deleteCrop(index) {

    const crop =
        savedCrops[index];

    const confirmDelete =
        confirm(
            `Delete ${crop.name} from your crops?`
        );


    if (!confirmDelete) return;


    savedCrops.splice(index, 1);

    localStorage.setItem(
        "kisanCrops",
        JSON.stringify(savedCrops)
    );


    renderCrops();

    alert(
        "Crop deleted successfully. 🗑️"
    );
}


renderCrops();


// ==========================================
// EXPENSES & INCOME
// ==========================================

const openFinanceForm =
    document.getElementById("openFinanceForm");

const financeForm =
    document.getElementById("financeForm");

const saveTransaction =
    document.getElementById("saveTransaction");

const cancelFinance =
    document.getElementById("cancelFinance");

const transactionList =
    document.getElementById("transactionList");

let transactions = safeGetJSON("kisanTransactions", []);


// Open finance form
if (openFinanceForm) {

    openFinanceForm.addEventListener(
        "click",
        () => {

            financeForm.classList.add("show");

        }
    );
}


// Cancel
if (cancelFinance) {

    cancelFinance.addEventListener(
        "click",
        () => {

            financeForm.classList.remove("show");

            clearFinanceForm();

        }
    );
}


// Save transaction
if (saveTransaction) {

    saveTransaction.addEventListener(
        "click",
        () => {

            const type =
                document.getElementById(
                    "transactionType"
                ).value;

            const amount =
                Number(
                    document.getElementById(
                        "transactionAmount"
                    ).value
                );

            const category =
                document.getElementById(
                    "transactionCategory"
                ).value;

            const date =
                document.getElementById(
                    "transactionDate"
                ).value;


            if (!amount || amount <= 0 || !date) {

                alert(
                    "Please enter a valid amount and date."
                );

                return;
            }


            const transaction = {

                id: Date.now(),

                type,

                amount,

                category,

                date
            };


            transactions.push(transaction);


            localStorage.setItem(
                "kisanTransactions",
                JSON.stringify(transactions)
            );


            renderTransactions();

            updateFinancialSummary();

            clearFinanceForm();

            financeForm.classList.remove("show");


            alert(
                "Transaction added successfully! ✅"
            );

        }
    );
}


// Clear finance form
function clearFinanceForm() {

    document.getElementById(
        "transactionAmount"
    ).value = "";

    document.getElementById(
        "transactionDate"
    ).value = "";
}


// Financial summary
function updateFinancialSummary() {

    let expense = 0;

    let income = 0;


    transactions.forEach(
        transaction => {

            if (
                transaction.type === "expense"
            ) {

                expense +=
                    transaction.amount;

            } else {

                income +=
                    transaction.amount;
            }

        }
    );


    const profit =
        income - expense;


    const totalExpense =
        document.getElementById(
            "totalExpense"
        );

    const totalIncome =
        document.getElementById(
            "totalIncome"
        );

    const netProfit =
        document.getElementById(
            "netProfit"
        );


    if (totalExpense) {

        totalExpense.textContent =
            `₹${expense.toLocaleString("en-IN")}`;
    }


    if (totalIncome) {

        totalIncome.textContent =
            `₹${income.toLocaleString("en-IN")}`;
    }


    if (netProfit) {

        netProfit.textContent =
            `₹${profit.toLocaleString("en-IN")}`;
    }
}


// Display transactions
function renderTransactions() {

    if (!transactionList) return;

    transactionList.innerHTML = "";


    if (transactions.length === 0) {

        transactionList.innerHTML = `
            <p class="empty-message">
                No transactions yet.
            </p>
        `;

        return;
    }


    transactions
        .slice()
        .reverse()
        .forEach(transaction => {

            const item =
                document.createElement("div");

            item.className =
                "transaction-item";


            const isExpense =
                transaction.type === "expense";


            item.innerHTML = `

                <div class="transaction-icon
                    ${
                        isExpense
                            ? "expense-icon"
                            : "income-icon"
                    }">

                    ${
                        isExpense
                            ? "💸"
                            : "💰"
                    }

                </div>


                <div class="transaction-info">

                    <h4>
                        ${transaction.category}
                    </h4>

                    <p>
                        ${formatFinanceDate(
                            transaction.date
                        )}
                    </p>

                </div>


                <div class="transaction-amount
                    ${
                        isExpense
                            ? "expense-amount"
                            : "income-amount"
                    }">

                    ${
                        isExpense
                            ? "-"
                            : "+"
                    }

                    ₹${transaction.amount.toLocaleString(
                        "en-IN"
                    )}

                </div>

            `;


            transactionList.appendChild(item);

        });
}


// Finance date
function formatFinanceDate(date) {

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}


renderTransactions();
updateFinancialSummary();


// ==========================================
// WEATHER MODULE
// ==========================================

const refreshWeather =
    document.getElementById("refreshWeather");


if (refreshWeather) {

    refreshWeather.addEventListener(
        "click",
        () => {

            const temperature =
                document.getElementById(
                    "temperature"
                );

            const feelsLike =
                document.getElementById(
                    "feelsLike"
                );

            const humidity =
                document.getElementById(
                    "humidity"
                );

            const windSpeed =
                document.getElementById(
                    "windSpeed"
                );

            const rainChance =
                document.getElementById(
                    "rainChance"
                );

            const farmingAdvice =
                document.getElementById(
                    "farmingAdvice"
                );


            const temp =
                Math.floor(
                    Math.random() * 8
                ) + 25;

            const humidityValue =
                Math.floor(
                    Math.random() * 20
                ) + 55;

            const rain =
                Math.floor(
                    Math.random() * 50
                );

            const wind =
                Math.floor(
                    Math.random() * 10
                ) + 8;


            if (temperature) {
                temperature.textContent =
                    `${temp}°C`;
            }

            if (feelsLike) {
                feelsLike.textContent =
                    `${temp + 1}°C`;
            }

            if (humidity) {
                humidity.textContent =
                    `${humidityValue}%`;
            }

            if (windSpeed) {
                windSpeed.textContent =
                    `${wind} km/h`;
            }

            if (rainChance) {
                rainChance.textContent =
                    `${rain}%`;
            }


            if (farmingAdvice) {

                if (rain >= 60) {

                    farmingAdvice.textContent =
                        "High chance of rain. Avoid unnecessary irrigation and postpone pesticide spraying.";

                } else if (temp >= 32) {

                    farmingAdvice.textContent =
                        "High temperature detected. Increase irrigation carefully and monitor crops for heat stress.";

                } else {

                    farmingAdvice.textContent =
                        "Weather conditions look suitable for normal farming activities. Monitor soil moisture regularly.";
                }
            }


            alert(
                "Weather information refreshed! 🌦️"
            );

        }
    );
}


// ==========================================
// MANDI RATES
// ==========================================

const mandiSearch =
    document.getElementById("mandiSearch");

const mandiTableBody =
    document.getElementById("mandiTableBody");

const refreshMandi =
    document.getElementById("refreshMandi");


if (mandiSearch && mandiTableBody) {

    mandiSearch.addEventListener(
        "input",
        () => {

            const search =
                mandiSearch.value
                    .toLowerCase()
                    .trim();

            const rows =
                mandiTableBody.querySelectorAll(
                    "tr"
                );


            rows.forEach(row => {

                const text =
                    row.textContent
                        .toLowerCase();

                row.style.display =
                    text.includes(search)
                        ? ""
                        : "none";

            });

        }
    );
}


if (refreshMandi) {

    refreshMandi.addEventListener(
        "click",
        () => {

            const updated =
                document.getElementById(
                    "mandiUpdated"
                );

            if (updated) {

                updated.textContent =
                    "Updated Just Now";
            }


            alert(
                "Mandi rates refreshed successfully! 📈"
            );

        }
    );
}


// ==========================================
// AI FARMING ASSISTANT
// ==========================================

const aiInput =
    document.getElementById("aiInput");

const sendAI =
    document.getElementById("sendAI");

const chatArea =
    document.getElementById("chatArea");


function sendAIMessage() {

    if (!aiInput) return;

    const question =
        aiInput.value.trim();


    if (!question) return;


    addChatMessage(
        question,
        "user"
    );


    aiInput.value = "";


    setTimeout(
        () => {

            const answer =
                getFarmingAdvice(question);

            addChatMessage(
                answer,
                "ai"
            );

        },
        700
    );
}


function addChatMessage(
    text,
    type
) {

    if (!chatArea) return;


    const message =
        document.createElement("div");

    message.className =
        `message ${type}-message`;


    const avatar =
        type === "ai"
            ? "🤖"
            : "👨‍🌾";


    message.innerHTML = `

        <div class="message-avatar">
            ${avatar}
        </div>

        <div class="message-content">
            <p>${text}</p>
        </div>

    `;


    chatArea.appendChild(message);


    chatArea.scrollTop =
        chatArea.scrollHeight;
}


function getFarmingAdvice(question) {

    const q =
        question.toLowerCase();


    if (
        q.includes("wheat") &&
        q.includes("fertilizer")
    ) {

        return `
            Wheat crop me fertilizer ka use
            soil condition aur crop stage ke
            according karna chahiye. Soil test
            ke basis par nutrient requirement
            determine karna sabse better hai.
        `;
    }


    if (
        q.includes("yellow") ||
        q.includes("yellow leaves")
    ) {

        return `
            Yellow leaves ke kai reasons ho sakte hain,
            jaise nutrient deficiency, overwatering,
            disease ya pest attack. Pehle soil moisture
            aur leaves ke spots ko check karein.
        `;
    }


    if (
        q.includes("irrigation") ||
        q.includes("water")
    ) {

        return `
            Irrigation crop, soil type aur weather
            par depend karti hai. Soil ko unnecessarily
            waterlogged na rakhein aur irrigation se
            pehle soil moisture check karein.
        `;
    }


    if (
        q.includes("pest") ||
        q.includes("insect") ||
        q.includes("कीड़ा")
    ) {

        return `
            Pest problem me pehle affected leaves
            aur insects ko identify karein. Integrated
            Pest Management (IPM) methods ko prefer
            karein aur pesticide use karne se pehle
            local agricultural expert ki advice lein.
        `;
    }


    return `
        Aapka question important hai. 🌱
        Better advice ke liye crop ka naam,
        crop ki current stage, soil condition aur
        problem ke symptoms batayein.
    `;
}


if (sendAI) {

    sendAI.addEventListener(
        "click",
        sendAIMessage
    );
}


if (aiInput) {

    aiInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                sendAIMessage();
            }

        }
    );
}


function askSuggestedQuestion(question) {

    if (!aiInput) return;

    aiInput.value =
        question;

    sendAIMessage();
}


// ==========================================
// FARMING REMINDERS
// ==========================================

const openReminderForm =
    document.getElementById(
        "openReminderForm"
    );

const reminderForm =
    document.getElementById(
        "reminderForm"
    );

const saveReminder =
    document.getElementById(
        "saveReminder"
    );

const cancelReminder =
    document.getElementById(
        "cancelReminder"
    );

const reminderList =
    document.getElementById(
        "reminderList"
    );


let reminders = safeGetJSON("kisanReminders", []);


if (openReminderForm) {

    openReminderForm.addEventListener(
        "click",
        () => {

            reminderForm.classList.add(
                "show"
            );

        }
    );
}


if (cancelReminder) {

    cancelReminder.addEventListener(
        "click",
        () => {

            reminderForm.classList.remove(
                "show"
            );

            clearReminderForm();

        }
    );
}


if (saveReminder) {

    saveReminder.addEventListener(
        "click",
        () => {

            const task =
                document.getElementById(
                    "reminderTask"
                ).value.trim();

            const crop =
                document.getElementById(
                    "reminderCrop"
                ).value.trim();

            const date =
                document.getElementById(
                    "reminderDate"
                ).value;

            const time =
                document.getElementById(
                    "reminderTime"
                ).value;


            if (
                !task ||
                !crop ||
                !date ||
                !time
            ) {

                alert(
                    "Please fill all reminder details."
                );

                return;
            }


            const reminder = {

                id: Date.now(),

                task,

                crop,

                date,

                time,

                completed: false

            };


            reminders.push(
                reminder
            );


            localStorage.setItem(
                "kisanReminders",
                JSON.stringify(reminders)
            );


            renderReminders();

            clearReminderForm();

            reminderForm.classList.remove(
                "show"
            );


            alert(
                "Reminder added successfully! 🔔"
            );

        }
    );
}


function clearReminderForm() {

    document.getElementById(
        "reminderTask"
    ).value = "";

    document.getElementById(
        "reminderCrop"
    ).value = "";

    document.getElementById(
        "reminderDate"
    ).value = "";

    document.getElementById(
        "reminderTime"
    ).value = "";
}


function renderReminders() {

    if (!reminderList) return;

    reminderList.innerHTML = "";


    if (reminders.length === 0) {

        reminderList.innerHTML = `
            <p class="empty-message">
                No reminders yet.
            </p>
        `;

        updateReminderStats();

        return;
    }


    reminders
        .slice()
        .sort(
            (a, b) => {

                const dateA =
                    new Date(
                        `${a.date}T${a.time}`
                    );

                const dateB =
                    new Date(
                        `${b.date}T${b.time}`
                    );

                return dateA - dateB;
            }
        )
        .forEach(reminder => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                `reminder-item ${
                    reminder.completed
                        ? "reminder-completed"
                        : ""
                }`;


            item.innerHTML = `

                <div class="reminder-icon">
                    ${
                        reminder.completed
                            ? "✅"
                            : "🔔"
                    }
                </div>


                <div class="reminder-info">

                    <h4>
                        ${reminder.task}
                    </h4>

                    <p>
                        🌾 ${reminder.crop}
                    </p>

                </div>


                <div class="reminder-time">

                    📅 ${formatReminderDate(
                        reminder.date
                    )}

                    <br>

                    🕐 ${reminder.time}

                </div>


                <div class="reminder-actions">

                    ${
                        reminder.completed
                            ? ""
                            : `
                                <button
                                    class="complete-btn"
                                    onclick="completeReminder(${reminder.id})"
                                >
                                    Complete
                                </button>
                            `
                    }


                    <button
                        class="delete-reminder"
                        onclick="deleteReminder(${reminder.id})"
                    >
                        Delete
                    </button>

                </div>

            `;


            reminderList.appendChild(item);

        });


    updateReminderStats();
}


function formatReminderDate(date) {

    return new Date(
        date
    ).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}


function completeReminder(id) {

    const reminder =
        reminders.find(
            item => item.id === id
        );


    if (!reminder) return;


    reminder.completed = true;


    localStorage.setItem(
        "kisanReminders",
        JSON.stringify(reminders)
    );


    renderReminders();
}


function deleteReminder(id) {

    const reminder =
        reminders.find(
            item => item.id === id
        );


    if (!reminder) return;


    const confirmDelete =
        confirm(
            `Delete "${reminder.task}" reminder?`
        );


    if (!confirmDelete) return;


    reminders =
        reminders.filter(
            item => item.id !== id
        );


    localStorage.setItem(
        "kisanReminders",
        JSON.stringify(reminders)
    );


    renderReminders();
}


function updateReminderStats() {

    const total =
        reminders.length;

    const completed =
        reminders.filter(
            item => item.completed
        ).length;

    const pending =
        total - completed;


    const totalElement =
        document.getElementById(
            "totalReminders"
        );

    const pendingElement =
        document.getElementById(
            "pendingReminders"
        );

    const completedElement =
        document.getElementById(
            "completedReminders"
        );


    if (totalElement) {
        totalElement.textContent =
            total;
    }

    if (pendingElement) {
        pendingElement.textContent =
            pending;
    }

    if (completedElement) {
        completedElement.textContent =
            completed;
    }
}


renderReminders();


// ==========================================
// FARMER PROFILE
// ==========================================

const saveProfile =
    document.getElementById(
        "saveProfile"
    );

const farmerName =
    document.getElementById(
        "farmerName"
    );

const farmerVillage =
    document.getElementById(
        "farmerVillage"
    );

const farmerDistrict =
    document.getElementById(
        "farmerDistrict"
    );

const farmerState =
    document.getElementById(
        "farmerState"
    );

const profileDisplayName =
    document.getElementById(
        "profileDisplayName"
    );

const profileLocation =
    document.getElementById(
        "profileLocation"
    );

const profileAvatar =
    document.getElementById(
        "profileAvatar"
    );


let farmerProfile =
    JSON.parse(
        localStorage.getItem(
            "kisanProfile"
        )
    ) || null;


if (saveProfile) {

    saveProfile.addEventListener(
        "click",
        () => {

            const name =
                farmerName.value.trim();

            const village =
                farmerVillage.value.trim();

            const district =
                farmerDistrict.value.trim();

            const state =
                farmerState.value.trim();


            if (
                !name ||
                !village ||
                !district ||
                !state
            ) {

                alert(
                    "Please fill all profile details."
                );

                return;
            }


            farmerProfile = {

                name,
                village,
                district,
                state

            };


            localStorage.setItem(
                "kisanProfile",
                JSON.stringify(
                    farmerProfile
                )
            );


            updateProfile();


            alert(
                "Profile saved successfully! 👨‍🌾"
            );

        }
    );
}


function updateProfile() {

    if (!farmerProfile) return;


    if (farmerName) {
        farmerName.value =
            farmerProfile.name;
    }

    if (farmerVillage) {
        farmerVillage.value =
            farmerProfile.village;
    }

    if (farmerDistrict) {
        farmerDistrict.value =
            farmerProfile.district;
    }

    if (farmerState) {
        farmerState.value =
            farmerProfile.state;
    }


    if (profileDisplayName) {

        profileDisplayName.textContent =
            farmerProfile.name;
    }


    if (profileLocation) {

        profileLocation.textContent =
            `${farmerProfile.village}, ${farmerProfile.district}, ${farmerProfile.state}`;
    }


    if (profileAvatar) {

        const initials =
            farmerProfile.name
                .split(" ")
                .map(
                    word => word[0]
                )
                .join("")
                .substring(0, 2)
                .toUpperCase();


        profileAvatar.textContent =
            initials;
    }
}


updateProfile();

// ==========================================
// LANGUAGE SWITCH
// ==========================================

const langEnglishBtn = document.getElementById("englishBtn");
const langHindiBtn = document.getElementById("hindiBtn");

function setAppLanguage(language) {

    localStorage.setItem("kisanLanguage", language);

    const navLinks =
        document.querySelectorAll(".sidebar nav a");

    const bottomLinks =
        document.querySelectorAll(".sidebar-bottom a");


    if (language === "hi") {

        // Sidebar
        if (navLinks[0])
            navLinks[0].innerHTML = "🏠 डैशबोर्ड";

        if (navLinks[1])
            navLinks[1].innerHTML = "🌱 मेरी फसलें";

        if (navLinks[2])
            navLinks[2].innerHTML = "💰 खर्च";

        if (navLinks[3])
            navLinks[3].innerHTML = "📊 लाभ कैलकुलेटर";

        if (navLinks[4])
            navLinks[4].innerHTML = "🌦️ मौसम";

        if (navLinks[5])
            navLinks[5].innerHTML = "📈 मंडी भाव";

        if (navLinks[6])
            navLinks[6].innerHTML = "🤖 AI सहायक";

        if (navLinks[7])
            navLinks[7].innerHTML = "🔔 रिमाइंडर";


        // Bottom sidebar
        if (bottomLinks[0])
            bottomLinks[0].innerHTML = "⚙️ सेटिंग्स";

        if (bottomLinks[1])
            bottomLinks[1].innerHTML = "👨‍🌾 प्रोफाइल";


        // Header
        const langHeading =
            document.querySelector(".topbar h1");

        const langWelcome =
            document.querySelector(".topbar p");


        if (langHeading)
            langHeading.textContent =
                "सुप्रभात, किसान 👨‍🌾";

        if (langWelcome)
            langWelcome.textContent =
                "स्मार्ट किसान साथी में आपका स्वागत है";


        // Dashboard
        const langDashboardTitle =
            document.querySelector(
                ".dashboard .section-title h2"
            );

        const langDashboardText =
            document.querySelector(
                ".dashboard .section-title p"
            );


        if (langDashboardTitle)
            langDashboardTitle.textContent =
                "🌾 खेती का अवलोकन";

        if (langDashboardText)
            langDashboardText.textContent =
                "अपनी खेती की जानकारी एक नज़र में देखें।";


        // Statistics
        const langStats =
            document.querySelectorAll(
                ".dashboard > .stats-grid .stat-card p"
            );


        if (langStats[0])
            langStats[0].textContent = "कुल फसलें";

        if (langStats[1])
            langStats[1].textContent = "कुल खर्च";

        if (langStats[2])
            langStats[2].textContent = "अनुमानित आय";

        if (langStats[3])
            langStats[3].textContent = "अनुमानित लाभ";


        // Buttons
        const langAddButtons =
            document.querySelectorAll(
                ".dashboard .add-btn"
            );


        langAddButtons.forEach(button => {
            button.textContent = "+ फसल जोड़ें";
        });


        // Active button
        if (langHindiBtn)
            langHindiBtn.classList.add("active");

        if (langEnglishBtn)
            langEnglishBtn.classList.remove("active");


    } else {

        // Sidebar
        if (navLinks[0])
            navLinks[0].innerHTML = "🏠 Dashboard";

        if (navLinks[1])
            navLinks[1].innerHTML = "🌱 My Crops";

        if (navLinks[2])
            navLinks[2].innerHTML = "💰 Expenses";

        if (navLinks[3])
            navLinks[3].innerHTML = "📊 Profit Calculator";

        if (navLinks[4])
            navLinks[4].innerHTML = "🌦️ Weather";

        if (navLinks[5])
            navLinks[5].innerHTML = "📈 Mandi Rates";

        if (navLinks[6])
            navLinks[6].innerHTML = "🤖 AI Assistant";

        if (navLinks[7])
            navLinks[7].innerHTML = "🔔 Reminders";


        // Bottom sidebar
        if (bottomLinks[0])
            bottomLinks[0].innerHTML = "⚙️ Settings";

        if (bottomLinks[1])
            bottomLinks[1].innerHTML = "👨‍🌾 Profile";


        // Header
        const langHeading =
            document.querySelector(".topbar h1");

        const langWelcome =
            document.querySelector(".topbar p");


        if (langHeading)
            langHeading.textContent =
                "Good Morning, Farmer 👨‍🌾";

        if (langWelcome)
            langWelcome.textContent =
                "Welcome back to Smart Kisan Saathi";


        // Dashboard
        const langDashboardTitle =
            document.querySelector(
                ".dashboard .section-title h2"
            );

        const langDashboardText =
            document.querySelector(
                ".dashboard .section-title p"
            );


        if (langDashboardTitle)
            langDashboardTitle.textContent =
                "🌾 Farm Overview";

        if (langDashboardText)
            langDashboardText.textContent =
                "Track your farming business at a glance.";


        // Statistics
        const langStats =
            document.querySelectorAll(
                ".dashboard > .stats-grid .stat-card p"
            );


        if (langStats[0])
            langStats[0].textContent = "Total Crops";

        if (langStats[1])
            langStats[1].textContent = "Total Expenses";

        if (langStats[2])
            langStats[2].textContent = "Expected Income";

        if (langStats[3])
            langStats[3].textContent = "Expected Profit";


        // Button
        const langAddButtons =
            document.querySelectorAll(
                ".dashboard .add-btn"
            );


        langAddButtons.forEach(button => {
            button.textContent = "+ Add Crop";
        });


        // Active button
        if (langEnglishBtn)
            langEnglishBtn.classList.add("active");

        if (langHindiBtn)
            langHindiBtn.classList.remove("active");
    }
}


// Hindi button
if (langHindiBtn) {

    langHindiBtn.addEventListener(
        "click",
        function () {

            setAppLanguage("hi");

        }
    );
}


// English button
if (langEnglishBtn) {

    langEnglishBtn.addEventListener(
        "click",
        function () {

            setAppLanguage("en");

        }
    );
}


// Load saved language
const langSaved =
    localStorage.getItem("kisanLanguage") || "en";

setAppLanguage(langSaved);
// ==========================================
// MY CROPS + EXPENSES LANGUAGE
// ==========================================

function translateCropsAndExpenses(language) {

    if (language === "hi") {

        // =========================
        // MY CROPS
        // =========================

        const cropsSection =
            document.getElementById("crops-section");

        if (cropsSection) {

            const title =
                cropsSection.querySelector(
                    ".section-title h2"
                );

            const description =
                cropsSection.querySelector(
                    ".section-title p"
                );

            const addButton =
                cropsSection.querySelector(
                    ".add-btn"
                );


            if (title)
                title.textContent = "🌱 मेरी फसलें";

            if (description)
                description.textContent =
                    "अपनी वर्तमान फसलों को मैनेज करें।";

            if (addButton)
                addButton.textContent =
                    "+ फसल जोड़ें";


            const formTitle =
                cropsSection.querySelector(
                    "#cropForm h3"
                );

            if (formTitle)
                formTitle.textContent =
                    "फसल जोड़ें";


            const labels =
                cropsSection.querySelectorAll(
                    "#cropForm .form-group label"
                );


            if (labels[0])
                labels[0].textContent =
                    "फसल का नाम";

            if (labels[1])
                labels[1].textContent =
                    "भूमि क्षेत्र";

            if (labels[2])
                labels[2].textContent =
                    "बुवाई की तारीख";

            if (labels[3])
                labels[3].textContent =
                    "कटाई की तारीख";


            const saveCropButton =
                document.getElementById(
                    "saveCrop"
                );

            const cancelCropButton =
                document.getElementById(
                    "cancelCrop"
                );


            if (saveCropButton)
                saveCropButton.textContent =
                    "फसल सेव करें";

            if (cancelCropButton)
                cancelCropButton.textContent =
                    "रद्द करें";
        }


        // =========================
        // EXPENSES
        // =========================

        const financeSection =
            document.getElementById(
                "finance-section"
            );

        if (financeSection) {

            const title =
                financeSection.querySelector(
                    ".section-title h2"
                );

            const description =
                financeSection.querySelector(
                    ".section-title p"
                );

            const addButton =
                financeSection.querySelector(
                    ".add-btn"
                );


            if (title)
                title.textContent =
                    "💰 खर्च और आय";

            if (description)
                description.textContent =
                    "अपनी खेती की आय और खर्च को ट्रैक करें।";

            if (addButton)
                addButton.textContent =
                    "+ लेन-देन जोड़ें";


            const formTitle =
                financeSection.querySelector(
                    "#financeForm h3"
                );

            if (formTitle)
                formTitle.textContent =
                    "नया लेन-देन";


            const labels =
                financeSection.querySelectorAll(
                    "#financeForm .form-group label"
                );


            if (labels[0])
                labels[0].textContent =
                    "लेन-देन का प्रकार";

            if (labels[1])
                labels[1].textContent =
                    "राशि";

            if (labels[2])
                labels[2].textContent =
                    "श्रेणी";

            if (labels[3])
                labels[3].textContent =
                    "तारीख";


            const saveButton =
                document.getElementById(
                    "saveTransaction"
                );

            const cancelButton =
                document.getElementById(
                    "cancelFinance"
                );


            if (saveButton)
                saveButton.textContent =
                    "सेव करें";

            if (cancelButton)
                cancelButton.textContent =
                    "रद्द करें";
        }


    } else {

        // =========================
        // MY CROPS - ENGLISH
        // =========================

        const cropsSection =
            document.getElementById("crops-section");

        if (cropsSection) {

            const title =
                cropsSection.querySelector(
                    ".section-title h2"
                );

            const description =
                cropsSection.querySelector(
                    ".section-title p"
                );

            const addButton =
                cropsSection.querySelector(
                    ".add-btn"
                );


            if (title)
                title.textContent =
                    "🌱 My Crops";

            if (description)
                description.textContent =
                    "Manage your current crops.";

            if (addButton)
                addButton.textContent =
                    "+ Add Crop";


            const formTitle =
                cropsSection.querySelector(
                    "#cropForm h3"
                );

            if (formTitle)
                formTitle.textContent =
                    "Add Crop";


            const labels =
                cropsSection.querySelectorAll(
                    "#cropForm .form-group label"
                );


            if (labels[0])
                labels[0].textContent =
                    "Crop Name";

            if (labels[1])
                labels[1].textContent =
                    "Land Area";

            if (labels[2])
                labels[2].textContent =
                    "Sowing Date";

            if (labels[3])
                labels[3].textContent =
                    "Harvest Date";


            const saveCropButton =
                document.getElementById(
                    "saveCrop"
                );

            const cancelCropButton =
                document.getElementById(
                    "cancelCrop"
                );


            if (saveCropButton)
                saveCropButton.textContent =
                    "Save Crop";

            if (cancelCropButton)
                cancelCropButton.textContent =
                    "Cancel";
        }


        // =========================
        // EXPENSES - ENGLISH
        // =========================

        const financeSection =
            document.getElementById(
                "finance-section"
            );

        if (financeSection) {

            const title =
                financeSection.querySelector(
                    ".section-title h2"
                );

            const description =
                financeSection.querySelector(
                    ".section-title p"
                );

            const addButton =
                financeSection.querySelector(
                    ".add-btn"
                );


            if (title)
                title.textContent =
                    "💰 Expenses & Income";

            if (description)
                description.textContent =
                    "Track your farming income and expenses.";

            if (addButton)
                addButton.textContent =
                    "+ Add Transaction";


            const formTitle =
                financeSection.querySelector(
                    "#financeForm h3"
                );

            if (formTitle)
                formTitle.textContent =
                    "New Transaction";


            const labels =
                financeSection.querySelectorAll(
                    "#financeForm .form-group label"
                );


            if (labels[0])
                labels[0].textContent =
                    "Transaction Type";

            if (labels[1])
                labels[1].textContent =
                    "Amount";

            if (labels[2])
                labels[2].textContent =
                    "Category";

            if (labels[3])
                labels[3].textContent =
                    "Date";


            const saveButton =
                document.getElementById(
                    "saveTransaction"
                );

            const cancelButton =
                document.getElementById(
                    "cancelFinance"
                );


            if (saveButton)
                saveButton.textContent =
                    "Save";

            if (cancelButton)
                cancelButton.textContent =
                    "Cancel";
        }
    }
}


// ==========================================
// CONNECT WITH LANGUAGE SWITCH
// ==========================================

const oldSetAppLanguage =
    setAppLanguage;


setAppLanguage = function(language) {

    oldSetAppLanguage(language);

    translateCropsAndExpenses(language);

};
// ==========================================
// WEATHER + MANDI LANGUAGE
// ==========================================

function translateWeatherAndMandi(language) {

    const weatherSection =
        document.getElementById("weather-section");

    const mandiSection =
        document.getElementById("mandi-section");


    // =========================
    // HINDI
    // =========================

    if (language === "hi") {

        // WEATHER
        if (weatherSection) {

            const title =
                weatherSection.querySelector(
                    ".section-title h2"
                );

            const text =
                weatherSection.querySelector(
                    ".section-title p"
                );


            if (title)
                title.textContent =
                    "🌦️ आज का मौसम";

            if (text)
                text.textContent =
                    "खेती के लिए मौसम की जानकारी देखें.";


            const refresh =
                document.getElementById(
                    "refreshWeather"
                );

            if (refresh)
                refresh.textContent =
                    "🔄 मौसम अपडेट करें";


            const advice =
                weatherSection.querySelector(
                    ".farming-advice h3"
                );

            if (advice)
                advice.textContent =
                    "🌱 किसान सलाह";
        }


        // MANDI
        if (mandiSection) {

            const title =
                mandiSection.querySelector(
                    ".section-title h2"
                );

            const text =
                mandiSection.querySelector(
                    ".section-title p"
                );


            if (title)
                title.textContent =
                    "📈 मंडी भाव";

            if (text)
                text.textContent =
                    "अपनी फसलों के आज के मंडी भाव देखें.";


            const search =
                document.getElementById(
                    "mandiSearch"
                );

            if (search)
                search.placeholder =
                    "फसल खोजें...";


            const refresh =
                document.getElementById(
                    "refreshMandi"
                );

            if (refresh)
                refresh.textContent =
                    "🔄 भाव अपडेट करें";
        }


    // =========================
    // ENGLISH
    // =========================

    } else {

        // WEATHER
        if (weatherSection) {

            const title =
                weatherSection.querySelector(
                    ".section-title h2"
                );

            const text =
                weatherSection.querySelector(
                    ".section-title p"
                );


            if (title)
                title.textContent =
                    "🌦️ Today's Weather";

            if (text)
                text.textContent =
                    "Check weather information for farming.";


            const refresh =
                document.getElementById(
                    "refreshWeather"
                );

            if (refresh)
                refresh.textContent =
                    "🔄 Refresh Weather";


            const advice =
                weatherSection.querySelector(
                    ".farming-advice h3"
                );

            if (advice)
                advice.textContent =
                    "🌱 Farming Advice";
        }


        // MANDI
        if (mandiSection) {

            const title =
                mandiSection.querySelector(
                    ".section-title h2"
                );

            const text =
                mandiSection.querySelector(
                    ".section-title p"
                );


            if (title)
                title.textContent =
                    "📈 Mandi Rates";

            if (text)
                text.textContent =
                    "Check today's market rates for your crops.";


            const search =
                document.getElementById(
                    "mandiSearch"
                );

            if (search)
                search.placeholder =
                    "Search crop...";


            const refresh =
                document.getElementById(
                    "refreshMandi"
                );

            if (refresh)
                refresh.textContent =
                    "🔄 Refresh Rates";
        }
    }
}


// ==========================================
// CONNECT WEATHER + MANDI
// ==========================================

const previousSetAppLanguage =
    setAppLanguage;


setAppLanguage = function(language) {

    previousSetAppLanguage(language);

    translateCropsAndExpenses(language);

    translateWeatherAndMandi(language);

};
// ==========================================
// AI ASSISTANT + REMINDERS LANGUAGE
// ==========================================

function translateAIAndReminders(language) {

    const aiSection =
        document.getElementById("ai-section");

    const remindersSection =
        document.getElementById("reminders-section");


    // =========================
    // HINDI
    // =========================

    if (language === "hi") {

        // AI ASSISTANT
        if (aiSection) {

            const title =
                aiSection.querySelector(
                    ".section-title h2"
                );

            const text =
                aiSection.querySelector(
                    ".section-title p"
                );

            if (title)
                title.textContent =
                    "🤖 AI सहायक";

            if (text)
                text.textContent =
                    "खेती से जुड़े सवाल पूछें और सलाह पाएं।";


            const input =
                document.getElementById("aiInput");

            if (input)
                input.placeholder =
                    "खेती से जुड़ा सवाल लिखें...";


            const send =
                document.getElementById("sendAI");

            if (send)
                send.textContent =
                    "पूछें";


            const suggested =
                aiSection.querySelector(
                    ".suggested-questions h3"
                );

            if (suggested)
                suggested.textContent =
                    "💡 सुझाए गए सवाल";
        }


        // REMINDERS
        if (remindersSection) {

            const title =
                remindersSection.querySelector(
                    ".section-title h2"
                );

            const text =
                remindersSection.querySelector(
                    ".section-title p"
                );

            const add =
                document.getElementById(
                    "openReminderForm"
                );


            if (title)
                title.textContent =
                    "🔔 खेती के रिमाइंडर";

            if (text)
                text.textContent =
                    "खेती के जरूरी कामों को समय पर याद रखें।";

            if (add)
                add.textContent =
                    "+ रिमाइंडर जोड़ें";


            const formTitle =
                remindersSection.querySelector(
                    "#reminderForm h3"
                );

            if (formTitle)
                formTitle.textContent =
                    "रिमाइंडर जोड़ें";


            const labels =
                remindersSection.querySelectorAll(
                    "#reminderForm .form-group label"
                );


            if (labels[0])
                labels[0].textContent =
                    "काम";

            if (labels[1])
                labels[1].textContent =
                    "फसल";

            if (labels[2])
                labels[2].textContent =
                    "तारीख";

            if (labels[3])
                labels[3].textContent =
                    "समय";


            const save =
                document.getElementById(
                    "saveReminder"
                );

            const cancel =
                document.getElementById(
                    "cancelReminder"
                );


            if (save)
                save.textContent =
                    "रिमाइंडर सेव करें";

            if (cancel)
                cancel.textContent =
                    "रद्द करें";


            // Statistics
            const statTexts =
                remindersSection.querySelectorAll(
                    ".reminder-stats .stat-card p"
                );


            if (statTexts[0])
                statTexts[0].textContent =
                    "कुल रिमाइंडर";

            if (statTexts[1])
                statTexts[1].textContent =
                    "बाकी";

            if (statTexts[2])
                statTexts[2].textContent =
                    "पूरा हुआ";


            const listTitle =
                remindersSection.querySelector(
                    ".dashboard-card .card-header h3"
                );

            const listText =
                remindersSection.querySelector(
                    ".dashboard-card .card-header p"
                );


            if (listTitle)
                listTitle.textContent =
                    "आपके खेती के रिमाइंडर";

            if (listText)
                listText.textContent =
                    "खेती के जरूरी कामों पर नज़र रखें.";
        }


    // =========================
    // ENGLISH
    // =========================

    } else {

        // AI ASSISTANT
        if (aiSection) {

            const title =
                aiSection.querySelector(
                    ".section-title h2"
                );

            const text =
                aiSection.querySelector(
                    ".section-title p"
                );


            if (title)
                title.textContent =
                    "🤖 AI Assistant";

            if (text)
                text.textContent =
                    "Ask farming questions and get helpful advice.";


            const input =
                document.getElementById("aiInput");

            if (input)
                input.placeholder =
                    "Ask a farming question...";


            const send =
                document.getElementById("sendAI");

            if (send)
                send.textContent =
                    "Ask";


            const suggested =
                aiSection.querySelector(
                    ".suggested-questions h3"
                );

            if (suggested)
                suggested.textContent =
                    "💡 Suggested Questions";
        }


        // REMINDERS
        if (remindersSection) {

            const title =
                remindersSection.querySelector(
                    ".section-title h2"
                );

            const text =
                remindersSection.querySelector(
                    ".section-title p"
                );

            const add =
                document.getElementById(
                    "openReminderForm"
                );


            if (title)
                title.textContent =
                    "🔔 Farming Reminders";

            if (text)
                text.textContent =
                    "Never miss an important farming activity.";

            if (add)
                add.textContent =
                    "+ Add Reminder";


            const formTitle =
                remindersSection.querySelector(
                    "#reminderForm h3"
                );

            if (formTitle)
                formTitle.textContent =
                    "Add Farming Reminder";


            const labels =
                remindersSection.querySelectorAll(
                    "#reminderForm .form-group label"
                );


            if (labels[0])
                labels[0].textContent =
                    "Task";

            if (labels[1])
                labels[1].textContent =
                    "Crop";

            if (labels[2])
                labels[2].textContent =
                    "Date";

            if (labels[3])
                labels[3].textContent =
                    "Time";


            const save =
                document.getElementById(
                    "saveReminder"
                );

            const cancel =
                document.getElementById(
                    "cancelReminder"
                );


            if (save)
                save.textContent =
                    "Save Reminder";

            if (cancel)
                cancel.textContent =
                    "Cancel";


            // Statistics
            const statTexts =
                remindersSection.querySelectorAll(
                    ".reminder-stats .stat-card p"
                );


            if (statTexts[0])
                statTexts[0].textContent =
                    "Total Reminders";

            if (statTexts[1])
                statTexts[1].textContent =
                    "Pending";

            if (statTexts[2])
                statTexts[2].textContent =
                    "Completed";


            const listTitle =
                remindersSection.querySelector(
                    ".dashboard-card .card-header h3"
                );

            const listText =
                remindersSection.querySelector(
                    ".dashboard-card .card-header p"
                );


            if (listTitle)
                listTitle.textContent =
                    "Your Farming Reminders";

            if (listText)
                listText.textContent =
                    "Keep track of important farming tasks.";
        }
    }
}


// ==========================================
// CONNECT WITH LANGUAGE SWITCH
// ==========================================
const languageFunctionBeforeAI =
    setAppLanguage;

setAppLanguage = function(language) {

    languageFunctionBeforeAI(language);

    translateAIAndReminders(language);

    translateProfitCalculator(language);

    translateProfile(language);

};
// ==========================================
// PROFILE LANGUAGE
// ==========================================

function translateProfile(language) {

    const profileSection =
        document.getElementById("profile-section");

    if (!profileSection) return;

    const title =
        profileSection.querySelector(".section-title h2");

    const description =
        profileSection.querySelector(".section-title p");

    const cardTitle =
        profileSection.querySelector(".card-header h3");

    const cardText =
        profileSection.querySelector(".card-header p");

    const labels =
        profileSection.querySelectorAll(".form-group label");

    const saveButton =
        document.getElementById("saveProfile");


    if (language === "hi") {

        if (title)
            title.textContent =
                "👨‍🌾 किसान प्रोफाइल";

        if (description)
            description.textContent =
                "अपनी व्यक्तिगत और खेती की जानकारी मैनेज करें।";

        if (cardTitle)
            cardTitle.textContent =
                "व्यक्तिगत जानकारी";

        if (cardText)
            cardText.textContent =
                "अपनी किसान प्रोफाइल अपडेट करें।";

        if (labels[0])
            labels[0].textContent =
                "पूरा नाम";

        if (labels[1])
            labels[1].textContent =
                "गाँव";

        if (labels[2])
            labels[2].textContent =
                "जिला";

        if (labels[3])
            labels[3].textContent =
                "राज्य";

        if (saveButton)
            saveButton.textContent =
                "प्रोफाइल सेव करें";


    } else {

        if (title)
            title.textContent =
                "👨‍🌾 Farmer Profile";

        if (description)
            description.textContent =
                "Manage your personal and farming information.";

        if (cardTitle)
            cardTitle.textContent =
                "Personal Information";

        if (cardText)
            cardText.textContent =
                "Update your farming profile.";

        if (labels[0])
            labels[0].textContent =
                "Full Name";

        if (labels[1])
            labels[1].textContent =
                "Village";

        if (labels[2])
            labels[2].textContent =
                "District";

        if (labels[3])
            labels[3].textContent =
                "State";

        if (saveButton)
            saveButton.textContent =
                "Save Profile";
    }
}




// ==========================================
// LANGUAGE APPLY FUNCTION
// ==========================================

const translations = {
    en: {
        dashboard: "Dashboard",
        crops: "My Crops",
        expenses: "Expenses",
        profit: "Profit Calculator",
        weather: "Weather",
        mandi: "Mandi Rates",
        ai: "AI Assistant",
        reminders: "Reminders",
        settings: "Settings",
        profile: "Profile",
        goodMorning: "Good Morning, Farmer 👨‍🌾",
        welcome: "Welcome back to Smart Kisan Saathi",
        farmOverview: "Farm Overview",
        farmOverviewText: "Track your farming business at a glance.",
        addCrop: "+ Add Crop",
        totalCrops: "Total Crops",
        totalExpenses: "Total Expenses",
        expectedIncome: "Expected Income",
        expectedProfit: "Expected Profit",
        quickActions: "Quick Actions",
        manageFarm: "Manage your farm quickly",
        addExpense: "Add Expense",
        calculateProfit: "Calculate Profit",
        askAI: "Ask AI Assistant",
        farmerProfile: "Farmer Profile",
        profileText: "Manage your personal and farming information.",
        personalInfo: "Personal Information",
        updateProfile: "Update your farming profile.",
        fullName: "Full Name",
        village: "Village",
        district: "District",
        state: "State",
        saveProfile: "Save Profile"
    },
    hi: {
        dashboard: "डैशबोर्ड",
        crops: "मेरी फसलें",
        expenses: "खर्चे",
        profit: "लाभ कैलकुलेटर",
        weather: "मौसम",
        mandi: "मंडी रेट्स",
        ai: "एआई सहायक",
        reminders: "रिमाइंडर",
        settings: "सेटिंग्स",
        profile: "प्रोफ़ाइल",
        goodMorning: "सुप्रभात, किसान 👨‍🌾",
        welcome: "Smart Kisan Saathi में आपका स्वागत है",
        farmOverview: "फार्म ओवरव्यू",
        farmOverviewText: "अपनी खेती का एक नज़र में ट्रैक रखें।",
        addCrop: "+ फसल जोड़ें",
        totalCrops: "कुल फसलें",
        totalExpenses: "कुल खर्चे",
        expectedIncome: "अपेक्षित आय",
        expectedProfit: "अपेक्षित लाभ",
        quickActions: "त्वरित क्रियाएँ",
        manageFarm: "अपनी खेती जल्दी प्रबंधित करें",
        addExpense: "खर्च जोड़ें",
        calculateProfit: "लाभ निकालें",
        askAI: "एआई से पूछें",
        farmerProfile: "किसान प्रोफ़ाइल",
        profileText: "अपनी व्यक्तिगत और कृषि जानकारी प्रबंधित करें।",
        personalInfo: "व्यक्तिगत जानकारी",
        updateProfile: "प्रोफ़ाइल अपडेट करें।",
        fullName: "पूरा नाम",
        village: "गाँव",
        district: "जिला",
        state: "राज्य",
        saveProfile: "प्रोफ़ाइल सेव करें"
    }
};

function setLanguage(language) {

    const t =
        translations[language];

    if (!t) return;


    // Save selected language
    localStorage.setItem(
        "kisanLanguage",
        language
    );


    // HTML language
    document.documentElement.lang =
        language;


    // Sidebar
    const navLinks =
        document.querySelectorAll(
            ".sidebar nav a"
        );


    if (navLinks.length >= 8) {

        navLinks[0].innerHTML =
            `🏠 ${t.dashboard}`;

        navLinks[1].innerHTML =
            `🌱 ${t.crops}`;

        navLinks[2].innerHTML =
            `💰 ${t.expenses}`;

        navLinks[3].innerHTML =
            `📊 ${t.profit}`;

        navLinks[4].innerHTML =
            `🌦️ ${t.weather}`;

        navLinks[5].innerHTML =
            `📈 ${t.mandi}`;

        navLinks[6].innerHTML =
            `🤖 ${t.ai}`;

        navLinks[7].innerHTML =
            `🔔 ${t.reminders}`;
    }


    // Sidebar bottom
    const bottomLinks =
        document.querySelectorAll(
            ".sidebar-bottom a"
        );


    if (bottomLinks.length >= 2) {

        bottomLinks[0].innerHTML =
            `⚙️ ${t.settings}`;

        bottomLinks[1].innerHTML =
            `👨‍🌾 ${t.profile}`;
    }


    // Top header
    const topHeading =
        document.querySelector(
            ".topbar h1"
        );

    if (topHeading) {

        topHeading.textContent =
            t.goodMorning;
    }


    const topText =
        document.querySelector(
            ".topbar p"
        );

    if (topText) {

        topText.textContent =
            t.welcome;
    }


    // Dashboard section
    const dashboard =
        document.querySelector(
            ".dashboard"
        );


    if (dashboard) {

        const sectionTitle =
            dashboard.querySelector(
                ".section-title"
            );


        if (sectionTitle) {

            const h2 =
                sectionTitle.querySelector(
                    "h2"
                );

            const p =
                sectionTitle.querySelector(
                    "p"
                );

            const button =
                sectionTitle.querySelector(
                    ".add-btn"
                );


            if (h2) {
                h2.textContent =
                    `🌾 ${t.farmOverview}`;
            }

            if (p) {
                p.textContent =
                    t.farmOverviewText;
            }

            if (button) {
                button.textContent =
                    t.addCrop;
            }
        }
    }


    // Statistics
    const statTexts =
        document.querySelectorAll(
            ".dashboard > .stats-grid .stat-card p"
        );


    if (statTexts.length >= 4) {

        statTexts[0].textContent =
            t.totalCrops;

        statTexts[1].textContent =
            t.totalExpenses;

        statTexts[2].textContent =
            t.expectedIncome;

        statTexts[3].textContent =
            t.expectedProfit;
    }


    // Quick actions
    const quickCard =
        document.querySelector(
            ".quick-card"
        );


    if (quickCard) {

        const h3 =
            quickCard.querySelector(
                ".card-header h3"
            );

        const p =
            quickCard.querySelector(
                ".card-header p"
            );

        const buttons =
            quickCard.querySelectorAll(
                ".quick-actions button span"
            );


        if (h3) {
            h3.textContent =
                t.quickActions;
        }

        if (p) {
            p.textContent =
                t.manageFarm;
        }

        if (buttons.length >= 4) {

            buttons[0].textContent =
                t.addCrop;

            buttons[1].textContent =
                t.addExpense;

            buttons[2].textContent =
                t.calculateProfit;

            buttons[3].textContent =
                t.askAI;
        }
    }


    // Profile section
    const profileSection =
        document.getElementById(
            "profile-section"
        );


    if (profileSection) {

        const title =
            profileSection.querySelector(
                ".section-title h2"
            );

        const titleText =
            profileSection.querySelector(
                ".section-title p"
            );

        const personal =
            profileSection.querySelector(
                ".card-header h3"
            );

        const updateText =
            profileSection.querySelector(
                ".card-header p"
            );

        const labels =
            profileSection.querySelectorAll(
                ".form-group label"
            );

        const save =
            document.getElementById(
                "saveProfile"
            );


        if (title) {
            title.textContent =
                `👨‍🌾 ${t.farmerProfile}`;
        }

        if (titleText) {
            titleText.textContent =
                t.profileText;
        }

        if (personal) {
            personal.textContent =
                t.personalInfo;
        }

        if (updateText) {
            updateText.textContent =
                t.updateProfile;
        }


        if (labels.length >= 4) {

            labels[0].textContent =
                t.fullName;

            labels[1].textContent =
                t.village;

            labels[2].textContent =
                t.district;

            labels[3].textContent =
                t.state;
        }


        if (save) {
            save.textContent =
                t.saveProfile;
        }
    }


    // Language buttons
    if (englishBtn) {

        englishBtn.classList.toggle(
            "active",
            language === "en"
        );
    }


    if (hindiBtn) {

        hindiBtn.classList.toggle(
            "active",
            language === "hi"
        );
    }

}


// ==========================================
// LANGUAGE BUTTONS
// ==========================================

if (englishBtn) {

    englishBtn.addEventListener(
        "click",
        () => {

            setLanguage("en");

        }
    );
}


if (hindiBtn) {

    hindiBtn.addEventListener(
        "click",
        () => {

            setLanguage("hi");

        }
    );
}


// ==========================================
// LOAD SAVED LANGUAGE
// ==========================================

const savedLanguage =
    localStorage.getItem(
        "kisanLanguage"
    ) || "en";


setLanguage(savedLanguage);
// ==========================================
// SIDEBAR NAVIGATION
// ==========================================

const sidebarLinks =
    document.querySelectorAll(".sidebar nav a");

const pageSections =
    document.querySelectorAll(".page-section");

const dashboard =
    document.querySelector(".dashboard");


function showSection(sectionId) {

    // Hide dashboard
    if (dashboard) {
        dashboard.style.display = "none";
    }

    // Hide all page sections
    pageSections.forEach(section => {
        section.style.display = "none";
    });


    // Show selected section
    const selectedSection =
        document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.style.display = "block";
    }
}


// Sidebar click
sidebarLinks.forEach((link, index) => {

    link.addEventListener("click", function(event) {

        event.preventDefault();


        // Remove active from all links
        sidebarLinks.forEach(item => {
            item.classList.remove("active");
        });


        // Add active to clicked link
        this.classList.add("active");


        // Open section
        switch (index) {

            case 0:

                // Dashboard
                if (dashboard) {
                    dashboard.style.display = "block";
                }

                pageSections.forEach(section => {
                    section.style.display = "none";
                });

                break;


            case 1:

                // My Crops
                showSection("crops-section");

                break;


            case 2:

                // Expenses
                showSection("finance-section");

                break;

            case 3:

                // Profit Calculator
                showSection("profit-section");

                 break;


            case 4:

                // Weather
                showSection("weather-section");

                break;


            case 5:

                // Mandi Rates
                showSection("mandi-section");

                break;


            case 6:

                // AI Assistant
                showSection("ai-section");

                break;


            case 7:

                // Reminders
                showSection("reminders-section");

                break;

        }


        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

});
// ==========================================
// PROFILE NAVIGATION
// ==========================================

const profileLink =
    document.querySelector(".sidebar-bottom a:last-child");

const profileSection =
    document.getElementById("profile-section");

if (profileLink && profileSection) {

    profileLink.addEventListener("click", function (event) {

        event.preventDefault();

        // Hide Dashboard
        if (dashboard) {
            dashboard.style.display = "none";
        }

        // Hide all sections
        pageSections.forEach(section => {
            section.style.display = "none";
        });

        // Show Profile
        profileSection.style.display = "block";

        // Remove active from sidebar links
        sidebarLinks.forEach(link => {
            link.classList.remove("active");
        });

        // Remove active from Settings
        const bottomLinks =
            document.querySelectorAll(
                ".sidebar-bottom a"
            );

        bottomLinks.forEach(link => {
            link.classList.remove("active");
        });

        // Make Profile active
        profileLink.classList.add("active");

        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}
// ==========================================
// SETTINGS NAVIGATION
// ==========================================

const settingsLink =
    document.querySelector(".sidebar-bottom a:first-child");

const settingsSection =
    document.getElementById("settings-section");

if (settingsLink && settingsSection) {

    settingsLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            // Hide Dashboard
            if (dashboard) {
                dashboard.style.display = "none";
            }

            // Hide all sections
            pageSections.forEach(section => {
                section.style.display = "none";
            });

            // Show Settings
            settingsSection.style.display = "block";

            // Remove active from main sidebar
            sidebarLinks.forEach(link => {
                link.classList.remove("active");
            });

            // Remove active from bottom links
            const bottomLinks =
                document.querySelectorAll(
                    ".sidebar-bottom a"
                );

            bottomLinks.forEach(link => {
                link.classList.remove("active");
            });

            // Make Settings active
            settingsLink.classList.add("active");

            // Scroll top
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    );
}

// ==========================================
// PROFIT CALCULATOR
// ==========================================

const calculateProfitBtn =
    document.getElementById("calculateProfit");

const clearProfitBtn =
    document.getElementById("clearProfit");


// Named handler so it can be attached and reused (and delegated if button isn't present at load)
function calculateProfitHandler(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    try {
        // read and parse inputs robustly
        const cropNameEl = document.getElementById("profitCropName");
        const areaEl = document.getElementById("profitArea");
        const productionEl = document.getElementById("production");
        const sellingPriceEl = document.getElementById("sellingPrice");
        const totalCostEl = document.getElementById("totalCost");

        const cropName = (cropNameEl && cropNameEl.value) ? cropNameEl.value.trim() : "";
        const area = parseFloat(areaEl && areaEl.value ? areaEl.value : NaN);
        const production = parseFloat(productionEl && productionEl.value ? productionEl.value : NaN);
        const sellingPrice = parseFloat(sellingPriceEl && sellingPriceEl.value ? sellingPriceEl.value : NaN);
        const totalCost = parseFloat(totalCostEl && totalCostEl.value ? totalCostEl.value : NaN);

        // Validation
        if (
            !cropName ||
            isNaN(area) || area <= 0 ||
            isNaN(production) || production <= 0 ||
            isNaN(sellingPrice) || sellingPrice <= 0 ||
            isNaN(totalCost) || totalCost < 0
        ) {
            alert("Please enter all valid crop and financial details.");
            return;
        }

        // Income & Profit calculation
        const expectedIncome = production * sellingPrice;
        const expectedProfit = expectedIncome - totalCost;

        // Display results (guard elements exist)
        const resProd = document.getElementById("resultProduction");
        const resIncome = document.getElementById("resultIncome");
        const resExpense = document.getElementById("resultExpense");
        const resProfit = document.getElementById("resultProfit");

        if (resProd) resProd.textContent = `${production} Quintal`;
        if (resIncome) resIncome.textContent = `₹${expectedIncome.toLocaleString("en-IN")}`;
        if (resExpense) resExpense.textContent = `₹${totalCost.toLocaleString("en-IN")}`;
        if (resProfit) resProfit.textContent = `₹${expectedProfit.toLocaleString("en-IN")}`;

        // Dashboard update (best-effort)
        const dashboardIncome = document.querySelector(".stat-card:nth-child(3) h3");
        const dashboardProfit = document.querySelector(".stat-card:nth-child(4) h3");

        if (dashboardIncome) dashboardIncome.textContent = `₹${expectedIncome.toLocaleString("en-IN")}`;
        if (dashboardProfit) dashboardProfit.textContent = `₹${expectedProfit.toLocaleString("en-IN")}`;

        // Success feedback (non-blocking)
        try { if (typeof console !== 'undefined') console.log(cropName + ' profit calculated.'); } catch (e) {}

    } catch (err) {
        alert("Error calculating profit: " + (err && err.message ? err.message : String(err)));
    }
}

// Attach to button if available, otherwise set up delegated listener as fallback
if (calculateProfitBtn) {
    calculateProfitBtn.addEventListener('click', calculateProfitHandler);
} else {
    try { console.warn('calculateProfit button not found at script load; using delegated listener'); } catch (e) {}
    document.addEventListener('click', function (e) {
        var tgt = e.target; try { if (tgt && typeof tgt.closest === 'function' && tgt.closest('#calculateProfit')) { calculateProfitHandler(e); } } catch (er) { }
    });
}


// Clear calculator
if (clearProfitBtn) {

    clearProfitBtn.addEventListener(
        "click",
        function () {

            document.getElementById(
                "profitCropName"
            ).value = "";

            document.getElementById(
                "profitArea"
            ).value = "";

            document.getElementById(
                "production"
            ).value = "";

            document.getElementById(
                "sellingPrice"
            ).value = "";

            document.getElementById(
                "totalCost"
            ).value = "";


            document.getElementById(
                "resultProduction"
            ).textContent =
                "0 Quintal";


            document.getElementById(
                "resultIncome"
            ).textContent =
                "₹0";


            document.getElementById(
                "resultExpense"
            ).textContent =
                "₹0";


            document.getElementById(
                "resultProfit"
            ).textContent =
                "₹0";

        }
    );
}
// ==========================================
// PROFIT CALCULATOR LANGUAGE
// ==========================================

function translateProfitCalculator(language) {

    const profitSection =
        document.getElementById("profit-section");

    if (!profitSection) return;


    const title =
        profitSection.querySelector(".section-title h2");

    const description =
        profitSection.querySelector(".section-title p");

    const cardTitle =
        profitSection.querySelector(".card-header h3");

    const cardText =
        profitSection.querySelector(".card-header p");

    const labels =
        profitSection.querySelectorAll(".form-group label");

    const calculateButton =
        document.getElementById("calculateProfit");

    const clearButton =
        document.getElementById("clearProfit");


    // =========================
    // HINDI
    // =========================

    if (language === "hi") {

        if (title)
            title.textContent =
                "📊 लाभ कैलकुलेटर";

        if (description)
            description.textContent =
                "अपनी खेती का अनुमानित लाभ निकालें।";

        if (cardTitle)
            cardTitle.textContent =
                "खेती लाभ कैलकुलेटर";

        if (cardText)
            cardText.textContent =
                "फसल की जानकारी डालकर लाभ की गणना करें।";


        if (labels[0])
            labels[0].textContent =
                "फसल का नाम";

        if (labels[1])
            labels[1].textContent =
                "भूमि क्षेत्र (एकड़)";

        if (labels[2])
            labels[2].textContent =
                "अनुमानित उत्पादन (क्विंटल)";

        if (labels[3])
            labels[3].textContent =
                "बिक्री मूल्य (₹/क्विंटल)";

        if (labels[4])
            labels[4].textContent =
                "कुल खर्च (₹)";


        if (calculateButton)
            calculateButton.textContent =
                "📊 लाभ की गणना करें";

        if (clearButton)
            clearButton.textContent =
                "साफ करें";


        // Result cards
        const resultTexts =
            profitSection.querySelectorAll(
                ".profit-results .stat-card p"
            );

        if (resultTexts[0])
            resultTexts[0].textContent =
                "अनुमानित उत्पादन";

        if (resultTexts[1])
            resultTexts[1].textContent =
                "अनुमानित आय";

        if (resultTexts[2])
            resultTexts[2].textContent =
                "कुल खर्च";

        if (resultTexts[3])
            resultTexts[3].textContent =
                "अनुमानित लाभ";


    } else {

        // =========================
        // ENGLISH
        // =========================

        if (title)
            title.textContent =
                "📊 Profit Calculator";

        if (description)
            description.textContent =
                "Calculate your expected farming profit.";

        if (cardTitle)
            cardTitle.textContent =
                "Farm Profit Calculator";

        if (cardText)
            cardText.textContent =
                "Enter your crop details and calculate profit.";


        if (labels[0])
            labels[0].textContent =
                "Crop Name";

        if (labels[1])
            labels[1].textContent =
                "Land Area (Acres)";

        if (labels[2])
            labels[2].textContent =
                "Expected Production (Quintal)";

        if (labels[3])
            labels[3].textContent =
                "Selling Price (₹/Quintal)";

        if (labels[4])
            labels[4].textContent =
                "Total Expense (₹)";


        if (calculateButton)
            calculateButton.textContent =
                "📊 Calculate Profit";

        if (clearButton)
            clearButton.textContent =
                "Clear";


        const resultTexts =
            profitSection.querySelectorAll(
                ".profit-results .stat-card p"
            );

        if (resultTexts[0])
            resultTexts[0].textContent =
                "Expected Production";

        if (resultTexts[1])
            resultTexts[1].textContent =
                "Expected Income";

        if (resultTexts[2])
            resultTexts[2].textContent =
                "Total Expense";

        if (resultTexts[3])
            resultTexts[3].textContent =
                "Expected Profit";
    }
}

// Ensure buttons don't submit forms by default: set missing types to button and improve a11y
(function ensureButtonTypes(){
  try{
    document.querySelectorAll('button').forEach(b=>{
      if(!b.hasAttribute('type')) b.setAttribute('type','button');
      try{
        // Add simple aria-label from text if missing
        if(!b.hasAttribute('aria-label')){
          const txt = (b.textContent || '').trim();
          const id = b.id && b.id.trim();
          if(id) b.setAttribute('aria-label', txt || id);
          else if(txt) b.setAttribute('aria-label', txt.replace(/\s+/g,' '));
        }
        if(!b.hasAttribute('tabindex')) b.setAttribute('tabindex','0');
      }catch(_){}
    });
  }catch(e){try{console.warn('ensureButtonTypes error',e);}catch(e){} }
})();

// Small accessibility mappings for key controls
(function addA11yMappings(){
  try{
    const sendAI = document.getElementById('sendAI');
    if(sendAI && !sendAI.hasAttribute('aria-label')) sendAI.setAttribute('aria-label','Send message to AI');
    const openCrop = document.getElementById('openCropForm');
    if(openCrop && !openCrop.hasAttribute('aria-label')) openCrop.setAttribute('aria-label','Open Add Crop form');
    const openFinance = document.getElementById('openFinanceForm');
    if(openFinance && !openFinance.hasAttribute('aria-label')) openFinance.setAttribute('aria-label','Open Add Transaction form');
  }catch(e){try{console.warn('addA11yMappings error',e);}catch(e){} }
})();
// ==========================================
// DARK MODE
// ==========================================

const darkModeToggle =
    document.getElementById("darkModeToggle");

if (darkModeToggle) {

    // Load saved setting
    const savedDarkMode =
        localStorage.getItem("kisanDarkMode");

    if (savedDarkMode === "on") {
        document.body.classList.add("dark-mode");
        darkModeToggle.checked = true;
    }

    // Toggle Dark Mode
    darkModeToggle.addEventListener("change", function () {

        if (this.checked) {

            document.body.classList.add("dark-mode");

            localStorage.setItem(
                "kisanDarkMode",
                "on"
            );

        } else {

            document.body.classList.remove("dark-mode");

            localStorage.setItem(
                "kisanDarkMode",
                "off"
            );
        }

    });
}
// ==========================================
// NOTIFICATIONS SETTING
// ==========================================

const notificationToggle =
    document.getElementById("notificationToggle");

if (notificationToggle) {

    // Load saved notification setting
    const savedNotifications =
        localStorage.getItem("kisanNotifications");

    if (savedNotifications === "off") {
        notificationToggle.checked = false;
    } else {
        notificationToggle.checked = true;
    }

    // Toggle notifications
    notificationToggle.addEventListener(
        "change",
        function () {

            if (this.checked) {

                localStorage.setItem(
                    "kisanNotifications",
                    "on"
                );

                alert("Notifications enabled 🔔");

            } else {

                localStorage.setItem(
                    "kisanNotifications",
                    "off"
                );

                alert("Notifications disabled 🔕");
            }
        }
    );
}
// ==========================================
// SETTINGS LANGUAGE DROPDOWN
// ==========================================

const settingsLanguage =
    document.getElementById("settingsLanguage");

if (settingsLanguage) {

    // Load saved language
    const savedLanguage =
        localStorage.getItem("kisanLanguage") || "en";

    settingsLanguage.value = savedLanguage;

    // Change language
    settingsLanguage.addEventListener(
        "change",
        function () {

            const language = this.value;

            localStorage.setItem(
                "kisanLanguage",
                language
            );

            // Existing language function
            if (typeof setLanguage === "function") {
                setLanguage(language);
            }

            if (typeof setAppLanguage === "function") {
                setAppLanguage(language);
            }
        }
    );
}
