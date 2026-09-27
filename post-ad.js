const toLetForm = document.getElementById("toLetForm");
const adImageInput = document.getElementById("adImage");
const previewContainer = document.getElementById("imagePreviewContainer");
const previewGrid = document.getElementById("previewGrid");
const previewCountText = document.getElementById("previewCountText");
const citySelect = document.getElementById("citySelect");
const thanaSelect = document.getElementById("thanaSelect");

let uploadedImagesList = [];

function compressImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 750;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = (img.width > MAX_WIDTH) ? MAX_WIDTH : img.width;
        canvas.height = (img.width > MAX_WIDTH) ? (img.height * scaleSize) : img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.65));
      };
    };
  });
}

adImageInput.addEventListener("change", async function () {
  const files = Array.from(this.files);

  if (files.length === 0) return;

  if (files.length > 8) {
    alert("আপনি সর্বোচ্চ ৮টি ছবি আপলোড করতে পারবেন! অনুগ্রহ করে ৮টি বা তার কম ছবি সিলেক্ট করুন।");
    this.value = "";
    if (previewContainer) previewContainer.style.display = "none";
    uploadedImagesList = [];
    return;
  }

  uploadedImagesList = [];
  if (previewGrid) previewGrid.innerHTML = "";

  for (const file of files) {
    const base64 = await compressImage(file);
    uploadedImagesList.push(base64);

    if (previewGrid) {
      const thumb = document.createElement("img");
      thumb.src = base64;
      previewGrid.appendChild(thumb);
    }
  }

  if (previewCountText) {
    previewCountText.textContent = `ছবি প্রিভিউ (${uploadedImagesList.length}/৮টি সিলেক্ট করা হয়েছে):`;
  }
  if (previewContainer) {
    previewContainer.style.display = "block";
  }
});

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

citySelect.addEventListener("change", function () {
  const selectedCity = this.value;
  thanaSelect.innerHTML = '<option value="">থানা নির্বাচন করুন</option>';

  if (selectedCity && areaData[selectedCity]) {
    thanaSelect.disabled = false;
    areaData[selectedCity].forEach(function (thana) {
      const option = document.createElement("option");
      option.value = thana;
      option.textContent = thana;
      thanaSelect.appendChild(option);
    });
  } else {
    thanaSelect.disabled = true;
    thanaSelect.innerHTML = '<option value="">প্রথমে শহর নির্বাচন করুন</option>';
  }
});

toLetForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (uploadedImagesList.length === 0) {
    alert("অনুগ্রহ করে অন্তত ১টি ছবি সিলেক্ট করুন!");
    return;
  }

  const phoneValue = document.getElementById("adPhone").value.trim();
  const bdPhoneRegex = /^01[3-9]\d{8}$/;

  if (!bdPhoneRegex.test(phoneValue)) {
    alert("ভুল মোবাইল নম্বর! অনুগ্রহ করে সঠিক ১১ ডিজিটের নম্বর দিন (যেমন: 017XXXXXXXX)।");
    document.getElementById("adPhone").focus();
    return;
  }

  const selectedCityKey = citySelect.value;
  const cityName = selectedCityKey === "chattogram" ? "চট্টগ্রাম" : "ঢাকা";
  const selectedThana = thanaSelect.value;
  const detailedAddress = document.getElementById("adAddress").value;

  const fullAddressString = `${detailedAddress}, ${selectedThana}, ${cityName}`;

  const newProperty = {
    id: Date.now(),
    title: document.getElementById("adTitle").value,
    category: document.getElementById("adCategory").value,
    area: selectedThana,
    address: fullAddressString,
    rent: Number(document.getElementById("adRent").value),
    beds: Number(document.getElementById("adBeds").value),
    baths: Number(document.getElementById("adBaths").value),
    phone: phoneValue,
    image: uploadedImagesList[0], 
    images: uploadedImagesList,   
    tags: ["মালিকের সরাসরি বিজ্ঞাপন", "নতুন পোস্ট"]
  };

  try {
    let customProperties = JSON.parse(localStorage.getItem("rentbd_custom_ads")) || [];
    customProperties.unshift(newProperty);
    localStorage.setItem("rentbd_custom_ads", JSON.stringify(customProperties));

    alert("অভিনন্দন! আপনার বাসা ভাড়ার বিজ্ঞাপনটি সফলভাবে প্রকাশিত হয়েছে।");
    window.location.href = "catalog.html";
  } catch (err) {
    alert("ছবির সাইজ মেমোরি সীমার অতিরিক্ত হয়ে গেছে। অনুগ্রহ করে কম সংখ্যক ছবি দিয়ে চেষ্টা করুন।");
  }
});