function sendToWhatsApp(){

let name = document.getElementById("name").value;
let phone = document.getElementById("phone").value;
let apartment = document.getElementById("apartment").value;
let msg = document.getElementById("msg").value;

// Save inquiry to localStorage for admin panel
var inquiries = JSON.parse(localStorage.getItem("hb_inquiries") || "[]");
inquiries.push({
  id: Date.now().toString(),
  name: name,
  phone: phone,
  apartment: apartment,
  message: msg,
  date: new Date().toLocaleString(),
  status: "new"
});
localStorage.setItem("hb_inquiries", JSON.stringify(inquiries));

let url = "https://wa.me/923356909090?text="
+ "Name: " + name + "%0a"
+ "Phone: " + phone + "%0a"
+ "Apartment: " + apartment + "%0a"
+ "Message: " + msg;

window.open(url,'_blank');
}

document.addEventListener("DOMContentLoaded", function () {
  var heroVideo = document.querySelector(".hero-video");
  if (heroVideo) {
    function showHeroVideo() {
      heroVideo.classList.add("loaded");
      heroVideo.classList.add("active");
    }
    if (heroVideo.readyState >= 3) {
      showHeroVideo();
    } else {
      heroVideo.addEventListener("canplay", showHeroVideo);
    }
  }
});
