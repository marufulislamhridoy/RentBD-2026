const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
  const questionBtn = item.querySelector(".faq-question");
  questionBtn.addEventListener("click", () => {
    faqItems.forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.classList.remove("active");
      }
    });
    item.classList.toggle("active");
  });
});

const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const nameInput = document.getElementById("senderName");
  const emailInput = document.getElementById("senderEmail");
  const subjectInput = document.getElementById("msgSubject");
  const messageInput = document.getElementById("senderMessage");

  const nameErr = document.getElementById("nameErr");
  const emailErr = document.getElementById("emailErr");
  const subjectErr = document.getElementById("subjectErr");
  const msgErr = document.getElementById("msgErr");

  nameErr.textContent = "";
  emailErr.textContent = "";
  subjectErr.textContent = "";
  msgErr.textContent = "";

  let isValid = true;

  if (!nameInput.value.trim()) {
    nameErr.textContent = "দয়া করে আপনার পুরো নাম লিখুন।";
    isValid = false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailInput.value.trim()) {
    emailErr.textContent = "ইমেইল ঠিকানা প্রদান আবশ্যক।";
    isValid = false;
  } else if (!emailPattern.test(emailInput.value.trim())) {
    emailErr.textContent = "একটি সঠিক ইমেইল ঠিকানা দিন (যেমন: user@example.com)।";
    isValid = false;
  }

  if (!subjectInput.value) {
    subjectErr.textContent = "বার্তার একটি বিষয় নির্বাচন করুন।";
    isValid = false;
  }

  if (messageInput.value.trim().length < 10) {
    msgErr.textContent = "বার্তাটি কমপক্ষে ১০ অক্ষরের হতে হবে।";
    isValid = false;
  }

  if (isValid) {
    alert(`ধন্যবাদ ${nameInput.value.trim()}! আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে। আমাদের সাপোর্ট টিম দ্রুত আপনার সাথে যোগাযোগ করবে।`);
    contactForm.reset();
  }
});