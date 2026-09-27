const urlParams = new URLSearchParams(window.location.search);
const propertyId = urlParams.get("id");

const container = document.getElementById("detailsContainer");

const customAds = JSON.parse(localStorage.getItem("rentbd_custom_ads")) || [];
const allHomes = [...customAds, ...initialProperties];

const property = allHomes.find(item => String(item.id) === String(propertyId));

if (!property) {
  container.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 60px 0;">
      <h2>দুঃখিত, কোনো বাসার তথ্য পাওয়া যায়নি!</h2>
      <p style="color: #64748b; margin-top: 8px;">হয়তো বিজ্ঞাপনটি মুছে ফেলা হয়েছে অথবা লিংকটি ভুল।</p>
      <a href="catalog.html" style="display: inline-block; margin-top: 16px; color: #2563eb; font-weight: 600;">ক্যাটালগে ফিরে যান</a>
    </div>
  `;
} else {
  container.innerHTML = `
    <div class="details-main">
      <div class="details-img-box">
        <img src="${property.image}" alt="${property.title}">
      </div>

      <div class="details-info">
        <span class="badge-tag">${property.category}</span>
        <h1 class="details-title">${property.title}</h1>
        <p class="details-address">📍 ${property.address}</p>

        <div class="specs-grid">
          <div class="spec-item">
            <span class="spec-label">বেডরুম</span>
            <span class="spec-val">${property.beds} Rooms</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">বাথরুম</span>
            <span class="spec-val">${property.baths} Baths</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">এলাকা</span>
            <span class="spec-val">${property.area}</span>
          </div>
        </div>

        <h3 style="font-size: 16px; margin-bottom: 8px;">সুযোগ-সুবিধা:</h3>
        <div class="features-list">
          <span class="feature-pill">✓ সার্বক্ষণিক গ্যাস ও পানি</span>
          <span class="feature-pill">✓ পর্যাপ্ত আলো-বাতাস</span>
          <span class="feature-pill">✓ সিকিউরিটি গার্ড ও সিসিটিভি</span>
          <span class="feature-pill">✓ প্রধান সড়কের কাছে</span>
        </div>
      </div>
    </div>

    <aside class="details-sidebar">
      <div class="owner-card">
        <div class="price-box">
          <h3>৳ ${property.rent.toLocaleString()} <span>/মাসিক ভাড়া</span></h3>
        </div>

        <a href="tel:${property.phone}" class="call-owner-btn">
          📞 সরাসরি কল করুন (${property.phone})
        </a>

        <button id="saveBtn" class="save-ad-btn" onclick="toggleSaveProperty(${property.id})">
          ❤️ পছন্দের তালিকায় রাখুন (Save)
        </button>
      </div>

      <div class="booking-card">
        <h4>বাসাটি সরাসরি দেখতে চান?</h4>
        <p>বাড়িওয়ালার কাছে আপনার পছন্দের দিন ও সময় জানান</p>

        <form id="visitForm" onsubmit="handleVisitSubmit(event)">
          <div class="booking-field">
            <label>আপনার নাম *</label>
            <input type="text" id="visitorName" placeholder="যেমন: আসিফ আহমেদ" required>
          </div>
          <div class="booking-field">
            <label>মোবাইল নম্বর *</label>
            <input type="tel" id="visitorPhone" placeholder="যেমন: 01XXXXXXXXX" required>
          </div>
          <div class="booking-field">
            <label>পরিদর্শনের সম্ভাব্য তারিখ *</label>
            <input type="date" id="visitDate" required>
          </div>
          <button type="submit" class="btn-book">অনুরোধ পাঠান</button>
        </form>
      </div>
    </aside>
  `;
}

function toggleSaveProperty(id) {
  let savedIds = JSON.parse(localStorage.getItem("rentbd_saved")) || [];
  
  if (savedIds.includes(id)) {
    savedIds = savedIds.filter(savedId => savedId !== id);
    alert("বাসাটি পছন্দের তালিকা থেকে সরানো হয়েছে।");
  } else {
    savedIds.push(id);
    alert("বাসাটি পছন্দের তালিকায় যুক্ত হয়েছে! (Saved পেজে দেখতে পাবেন)");
  }

  localStorage.setItem("rentbd_saved", JSON.stringify(savedIds));
}

function handleVisitSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("visitorName").value;
  const date = document.getElementById("visitDate").value;

  alert(`ধন্যবাদ ${name}! ${date} তারিখে বাসাটি পরিদর্শনের অনুরোধ বাড়িওয়ালার নিকট পৌঁছে গেছে।`);
  e.target.reset();
}