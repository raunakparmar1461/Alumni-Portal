let alumniData = [];
let currentBranch = "All";

const recordsPerPage = 12;
let currentPage = 1;
let filteredData = [];


// =========================
// Load Alumni from Firebase
// =========================

async function loadAlumni() {

    console.log("Loading alumni from Firebase...");

    try {

        const snapshot = await db
            .collection("alumni")
            .orderBy("name")
            .get();

        alumniData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log("Firebase records:", alumniData.length);
        console.log("FIRST FIREBASE RECORD:", alumniData[0]);

        applyFilters();

    } catch (error) {

        console.error("Firebase Error:", error);

        document.getElementById("alumni-container").innerHTML = `
            <div class="no-results">
                Unable to load alumni data.
            </div>
        `;
    }
}

loadAlumni();


// =========================
// Display Alumni
// =========================

function displayAlumni(data) {

    const container = document.getElementById("alumni-container");

    container.innerHTML = "";

    if (data.length === 0) {

        container.innerHTML = `
            <div class="no-results">
                No Alumni Found
            </div>
        `;

        document.getElementById("pageNumbers").innerHTML = "";

        return;
    }

    const start = (currentPage - 1) * recordsPerPage;
    const end = start + recordsPerPage;

    const pageData = data.slice(start, end);

    pageData.forEach(alumni => {

        container.innerHTML += `

        <div class="card">

            <div class="profile">

                <div class="avatar">👤</div>

                <div>

                    <h2>${alumni.name || "Not Available"}</h2>

                    <span>
                        ${alumni.designation || "Not Available"}
                    </span>

                </div>

            </div>

            <hr>

            <div class="info">

                <p>
                    <strong>🎓 Branch:</strong>
                    ${alumni.branch || "Not Available"}
                </p>

                <p>
                    <strong>📅 Batch:</strong>
                    ${alumni.batch || "Not Available"}
                </p>

                <p>
                    <strong>🏢 Organisation:</strong>
                    ${alumni.organisation_name || "Not Available"}
                </p>

                <p>
                    <strong>🏛 Sector:</strong>
                    ${alumni.organisation_type || "Not Available"}
                </p>

                <p>
                    <strong>✉ Email:</strong>
                    ${alumni.email || "Not Available"}
                </p>

            </div>

            <button class="profile-btn">
                View Profile
            </button>

        </div>

        `;
    });

    createPagination(data.length);
}


// =========================
// Pagination
// =========================

function createPagination(totalRecords) {

    const totalPages = Math.ceil(totalRecords / recordsPerPage);

    const pageNumbers = document.getElementById("pageNumbers");

    pageNumbers.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {

        pageNumbers.innerHTML += `

            <button
                class="page-number ${i === currentPage ? "active" : ""}"
                onclick="goToPage(${i})">

                ${i}

            </button>

        `;
    }

    document.getElementById("prevBtn").disabled =
        currentPage === 1;

    document.getElementById("nextBtn").disabled =
        currentPage === totalPages;
}


function goToPage(page) {

    currentPage = page;

    displayAlumni(filteredData);
}


// =========================
// Filters
// =========================

function applyFilters() {

    const searchText =
        document
            .getElementById("search")
            .value
            .toLowerCase();

    const searchType =
        document
            .getElementById("searchType")
            .value;

    const organisation =
        document
            .getElementById("organisation")
            .value;


    filteredData = alumniData.filter(alumni => {

        const searchMatch =
            String(alumni[searchType] || "")
                .toLowerCase()
                .includes(searchText);


        const organisationMatch =
            organisation === "All" ||
            alumni.organisation_type === organisation;


        const branchMatch =
            currentBranch === "All" ||
            alumni.branch === currentBranch;


        return (
            searchMatch &&
            organisationMatch &&
            branchMatch
        );

    });


    const totalPages =
        Math.ceil(
            filteredData.length /
            recordsPerPage
        );


    if (
        currentPage > totalPages &&
        totalPages > 0
    ) {

        currentPage = 1;

    }


    displayAlumni(filteredData);
}


// =========================
// Search
// =========================

document
    .getElementById("search")
    .addEventListener(
        "input",
        () => {

            currentPage = 1;

            applyFilters();

        }
    );


// =========================
// Search Type
// =========================

document
    .getElementById("searchType")
    .addEventListener(
        "change",
        () => {

            currentPage = 1;

            applyFilters();

        }
    );


// =========================
// Organisation Filter
// =========================

document
    .getElementById("organisation")
    .addEventListener(
        "change",
        () => {

            currentPage = 1;

            applyFilters();

        }
    );


// =========================
// Branch Buttons
// =========================

document
    .querySelectorAll(".branch-buttons button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".branch-buttons button"
                    )
                    .forEach(btn =>
                        btn.classList.remove("active")
                    );


                button.classList.add("active");


                currentBranch =
                    button.dataset.branch;


                currentPage = 1;

                applyFilters();

            }
        );

    });


// =========================
// Previous Button
// =========================

document
    .getElementById("prevBtn")
    .addEventListener(
        "click",
        () => {

            if (currentPage > 1) {

                currentPage--;

                displayAlumni(filteredData);

            }

        }
    );


// =========================
// Next Button
// =========================

document
    .getElementById("nextBtn")
    .addEventListener(
        "click",
        () => {

            const totalPages =
                Math.ceil(
                    filteredData.length /
                    recordsPerPage
                );


            if (currentPage < totalPages) {

                currentPage++;

                displayAlumni(filteredData);

            }

        }
    );