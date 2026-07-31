const supabaseUrl = "https://qeitxsbfrdblabutksbw.supabase.co";
const supabaseKey = "sb_publishable_v5fVENr6OX6ld3aoUI9Yrw_uh56h6Ik";

const client = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

let alumniData = [];
let currentBranch = "All";

const recordsPerPage = 12;
let currentPage = 1;

// Load alumni from Supabase
async function loadAlumni() {

    console.log("Loading...");

    const { data, error } = await client
        .from("alumni")
        .select("*")
        .order("name");

    console.log("Data:", data);
    console.log("Error:", error);

    if (error) {
        console.error(error);
        return;
    }

    alumniData = data;

    console.log("Records:", alumniData.length);

    applyFilters();
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
                <h2>${alumni.name}</h2>
                <span>${alumni.designation || "Not Available"}</span>
            </div>

        </div>

        <hr>

        <div class="info">

            <p><strong>🎓 Branch:</strong> ${alumni.branch}</p>
            <p><strong>📅 Batch:</strong> ${alumni.batch}</p>
            <p><strong>🏢 Organisation:</strong> ${alumni.organisation_name}</p>
            <p><strong>🏛 Sector:</strong> ${alumni.organisation_type}</p>
            <p><strong>✉ Email:</strong> ${alumni.email}</p>

        </div>

        <button class="profile-btn">
            View Profile
        </button>

    </div>

    `;
})
createPagination(data.length);
};


function createPagination(totalRecords) {

    const totalPages = Math.ceil(totalRecords / recordsPerPage);

    console.log("Total Records:", totalRecords);
    console.log("Total Pages:", totalPages);

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

    document.getElementById("prevBtn").disabled = currentPage === 1;
    document.getElementById("nextBtn").disabled = currentPage === totalPages;

}

function goToPage(page){

    currentPage = page;

    applyFilters();

}


document.getElementById("prevBtn").addEventListener("click",()=>{

    if(currentPage>1){

        currentPage--;

        applyFilters();

    }

});

document.getElementById("nextBtn").addEventListener("click", () => {

    const totalPages = Math.ceil(filteredData.length / recordsPerPage);

    if (currentPage < totalPages) {

        currentPage++;

        applyFilters();

    }

});
let filteredData = [];

function applyFilters() {

    const searchText = document
        .getElementById("search")
        .value
        .toLowerCase();

    const searchType = document
        .getElementById("searchType")
        .value;

    const organisation = document
        .getElementById("organisation")
        .value;

    console.log("Search Text:", searchText);
    console.log("Search Type:", searchType);
    console.log("Organisation:", organisation);
    console.log("Current Branch:", currentBranch);

    filteredData = alumniData.filter(alumni => {

        const searchMatch = String(alumni[searchType] || "")
            .toLowerCase()
            .includes(searchText);

        const organisationMatch =
            organisation === "All" ||
            alumni.organisation_type === organisation;

        const branchMatch =
            currentBranch === "All" ||
            alumni.branch === currentBranch;

        return searchMatch && organisationMatch && branchMatch;

    });

    console.log("First record:", alumniData[0]);
    console.log("Filtered records:", filteredData.length);

    const totalPages = Math.ceil(filteredData.length / recordsPerPage);

    if (currentPage > totalPages) {
        currentPage = 1;
    }

    displayAlumni(filteredData);

};




// =========================
// Live Search
// =========================

document
    .getElementById("search")
    .addEventListener("input", applyFilters);



// =========================
// Search Type
// =========================

document
    .getElementById("searchType")
    .addEventListener("change", applyFilters);



// =========================
// Organisation Filter
// =========================

document
    .getElementById("organisation")
    .addEventListener("change", applyFilters);



// =========================
// Branch Buttons
// =========================

const buttons = document.querySelectorAll(".branch-buttons button");

buttons.forEach(button => {

    button.addEventListener("click", () => {

        buttons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentBranch = button.dataset.branch;

        applyFilters();

    });

});