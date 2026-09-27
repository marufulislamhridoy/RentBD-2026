const savedContainer = document.getElementById("savedContainer");
const emptySavedMsg = document.getElementById("emptySavedMsg");

function renderSavedProperties() {
  const savedIds = JSON.parse(localStorage.getItem("rentbd_saved")) || [];
  const customAds = JSON.parse(localStorage.getItem("rentbd_custom_ads")) || [];
  const allHomes = [...customAds, ...initialProperties];

  const savedHomes = allHomes.filter(home => savedIds.some(id => String(id) === String(home.id)));

  savedContainer.innerHTML = "";

  if (savedHomes.length === 0) {
    emptySavedMsg.style.display = "block";
    return;
  }
  emptySavedMsg.style.display = "none";

  savedHomes.forEach(home => {
    const card = document.createElement("div");
    card.className = "property-card";

    card.innerHTML = `
      <div class="card-img-wrapper">
        <img src="${home.image}" alt="${home.title}">
        <span class="cat-badge ${home.category}">${home.category}</span>
      </div>

      <div class="card-details">
        <div class="card-rent">৳ ${home.rent.toLocaleString()} <span>/মাস</span></div>
        <h3 class="card-title">${home.title}</h3>
        <p class="card-loc">📍 ${home.address}</p>
        
        <div class="card-rooms">
          <span>🛏️ ${home.beds} Bed</span>
          <span>🚿 ${home.baths} Bath</span>
        </div>

        <div class="card-action-bar" style="gap: 8px;">
          <a href="tel:${home.phone}" class="call-btn" style="flex: 1; text-align: center; justify-content: center;">
            📞 ${home.phone}
          </a>
          <button onclick="removeSaved(${home.id})" style="background: #f1f5f9; color: #ef4444; border: 1px solid #cbd5e1; padding: 8px 10px; border-radius: 8px; cursor: pointer; font-size: 13px;" title="তালিকা থেকে বাদ দিন">
            ✕
          </button>
        </div>
      </div>
    `;

    savedContainer.appendChild(card);
  });
}

function removeSaved(id) {
  let savedIds = JSON.parse(localStorage.getItem("rentbd_saved")) || [];
  savedIds = savedIds.filter(savedId => String(savedId) !== String(id));
  localStorage.setItem("rentbd_saved", JSON.stringify(savedIds));
  renderSavedProperties();
}

function clearAllSaved() {
  if (confirm("আপনি কি নিশ্চিত যে সব সেভ করা বাসা তালিকা থেকে মুছে ফেলতে চান?")) {
    localStorage.removeItem("rentbd_saved");
    renderSavedProperties();
  }
}

renderSavedProperties();