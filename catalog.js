const cardsContainer = document.getElementById("cardsContainer");
const categoryFilter = document.getElementById("categoryFilter");
const filterCity = document.getElementById("filterCity");
const filterThana = document.getElementById("filterThana");
const emptyMsg = document.getElementById("emptyMsg");
const paginationWrapper = document.getElementById("paginationWrapper");
const paginationControls = document.getElementById("paginationControls");
const paginationInfo = document.getElementById("paginationInfo");

let currentPage = 1;
const itemsPerPage = 6;
let currentFilteredList = [];

function toBengaliNumber(num) {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num.toString().replace(/\d/g, (d) => bnDigits[d]);
}

const areaData = {
  chattogram: [
    "পাঁচলাইশ", "চকবাজার", "জিইসি (GEC)", "খুলশী", "আগ্রাবাদ", 
    "নাসিরাবাদ", "হালিশহর", "কোতোয়ালী", "চান্দগাঁও", "বাকলিয়া", "পাহাড়তলী"
  ],
  dhaka: [
    "ধানমন্ডি", "গুলশান", "বনানী", "উত্তরা", "মিরপুর", 
    "মোহাম্মদপুর", "বাড্ডা", "মতিঝিল", "নিউ মার্কেট", "খিলগাঁও"
  ]
};

const customAds = JSON.parse(localStorage.getItem("rentbd_custom_ads")) || [];
const allHomes = [...customAds, ...(typeof initialProperties !== "undefined" ? initialProperties : [])];

function renderCards(list) {
  currentFilteredList = list;
  cardsContainer.innerHTML = "";

  if (list.length === 0) {
    if (emptyMsg) emptyMsg.style.display = "block";
    if (paginationWrapper) paginationWrapper.style.display = "none";
    return;
  }
  
  if (emptyMsg) emptyMsg.style.display = "none";
  if (paginationWrapper) paginationWrapper.style.display = "flex";

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageItems = list.slice(startIndex, endIndex);

  pageItems.forEach(home => {
    const card = document.createElement("div");
    card.className = "property-card";

    const badgeCat = (home.category || "General").toLowerCase();

    card.innerHTML = `
      <div class="card-img-wrapper">
        <img src="${home.image}" alt="${home.title}">
        <span class="cat-badge ${badgeCat}">${home.category}</span>
      </div>

      <div class="card-details">
        <div class="card-rent">৳ ${Number(home.rent).toLocaleString()} <span>/মাস</span></div>
        <h3 class="card-title">${home.title}</h3>
        <p class="card-loc">📍 ${home.address}</p>
        
        <div class="card-rooms">
          <span>🛏️ ${home.beds} Bed</span>
          <span>🚿 ${home.baths} Bath</span>
        </div>

        <div class="card-action-bar">
          <a href="tel:${home.phone}" class="call-btn">📞 ${home.phone}</a>
          <a href="details.html?id=${home.id}" class="view-btn">বিস্তারিত &rarr;</a>
        </div>
      </div>
    `;

    cardsContainer.appendChild(card);
  });

  updatePagination(list.length);
}

function updatePagination(totalItems) {
  paginationControls.innerHTML = "";
  paginationInfo.innerHTML = "";

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) {
    paginationInfo.textContent = `মোট ${toBengaliNumber(totalItems)} টির মধ্যে ${toBengaliNumber(totalItems)} টি দেখানো হচ্ছে`;
    return;
  }

  const prevBtn = document.createElement("button");
  prevBtn.className = "page-btn";
  prevBtn.textContent = "PREV";
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderCards(currentFilteredList);
      window.scrollTo({ top: 150, behavior: "smooth" });
    }
  });
  paginationControls.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.className = `page-btn ${i === currentPage ? "active" : ""}`;
    pageBtn.textContent = toBengaliNumber(i);

    pageBtn.addEventListener("click", () => {
      currentPage = i;
      renderCards(currentFilteredList);
      window.scrollTo({ top: 150, behavior: "smooth" });
    });
    paginationControls.appendChild(pageBtn);
  }

  const nextBtn = document.createElement("button");
  nextBtn.className = "page-btn";
  nextBtn.textContent = "NEXT";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderCards(currentFilteredList);
      window.scrollTo({ top: 150, behavior: "smooth" });
    }
  });
  paginationControls.appendChild(nextBtn);

  const startCount = (currentPage - 1) * itemsPerPage + 1;
  const endCount = Math.min(currentPage * itemsPerPage, totalItems);

  paginationInfo.textContent = `মোট ${toBengaliNumber(totalItems)} টির মধ্যে ${toBengaliNumber(startCount)} থেকে ${toBengaliNumber(endCount)} দেখাচ্ছে (${toBengaliNumber(totalPages)} টি পেজ)`;
}

function filterHomes() {
  const selectedCat = categoryFilter.value;
  const selectedCity = filterCity.value;
  const selectedThana = filterThana.value;

  const filtered = allHomes.filter(home => {
    const address = (home.address || "").toLowerCase();
    const area = (home.area || "").toLowerCase();

    const matchCat = (selectedCat === "all") || (home.category && home.category.toLowerCase() === selectedCat.toLowerCase());

    let matchCity = true;
    if (selectedCity === "chattogram") {
      matchCity = address.includes("চট্টগ্রাম") || address.includes("chattogram") || address.includes("ctg") || area.includes("chattogram");
    } else if (selectedCity === "dhaka") {
      matchCity = address.includes("ঢাকা") || address.includes("dhaka") || area.includes("dhaka");
    }

    let matchThana = true;
    if (selectedThana !== "all") {
      matchThana = address.includes(selectedThana.toLowerCase()) || area.includes(selectedThana.toLowerCase());
    }

    return matchCat && matchCity && matchThana;
  });

  currentPage = 1;
  renderCards(filtered);
}

if (filterCity) {
  filterCity.addEventListener("change", function () {
    const city = this.value;
    filterThana.innerHTML = '<option value="all">সকল থানা / এলাকা</option>';

    if (city !== "all" && areaData[city]) {
      filterThana.disabled = false;
      areaData[city].forEach(thana => {
        const opt = document.createElement("option");
        opt.value = thana;
        opt.textContent = thana;
        filterThana.appendChild(opt);
      });
    } else {
      filterThana.disabled = true;
    }

    filterHomes();
  });
}

if (filterThana) filterThana.addEventListener("change", filterHomes);
if (categoryFilter) categoryFilter.addEventListener("change", filterHomes);

renderCards(allHomes);