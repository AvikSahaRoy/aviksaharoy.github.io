
// Loading animation here -------------------
// function removeLoader() {
//   let loader = document.getElementById('loader');
//   let loaderContent = document.getElementById('loader-content');
//   let homeSection = document.getElementById('home');

//   let count = 0;

//   let interval = setInterval(() => {
//     count++;
//     loaderContent.innerText = `${count}%`;

//     // hide the loader after the count reaches a certain value (e.g., 100)
//     if (count === 100) {
//       clearInterval(interval);
//       loader.style.display = 'none';

//       // add a class to the home section for fade-in animation
//       homeSection.classList.add('loaded');
//     }
//   }, 50);
// }

function removeLoader() {
  let loader = document.getElementById('loader');
  let loaderContent = document.getElementById('loader-content');
  let homeSection = document.getElementById('home');
  let circle = document.querySelector('.circle');

  let count = 0;

  let interval = setInterval(() => {
    count++;
    loaderContent.innerText = `${count}%`;

    // increase the size of the circle based on the count percentage
    let newSize = 150 + (count * 1.5); // Adjust the factor as needed
    circle.style.height = `${newSize}px`;
    circle.style.width = `${newSize}px`;

    // hide the loader after the count reaches a certain value (e.g., 100)
    if (count === 101) {
      clearInterval(interval);
      loader.style.display = 'none';

      // add a class to the home section for fade-in animation
      homeSection.classList.add('loaded');
    }
  }, 40);
}


// Blink ---------------------------------------------
var blink = document.getElementById('blink');
setInterval(function () {
  blink.style.opacity =
    (blink.style.opacity == 0 ? 1 : 0);
}, 500);





$(document).ready(function () {
  $(window).scroll(function () {
    //  sticky navbar on scroll script  //
    if (this.scrollY > 20) {
      $(".navbar").addClass("sticky");
    } else {
      $(".navbar").removeClass("sticky");
    }

    //  scroll-up button show/hide script  //
    if (this.scrollY > 500) {
      $(".scroll-up-btn").addClass("show");
    } else {
      $(".scroll-up-btn").removeClass("show");
    }
  });

  //  slide-up script  //

  $(".scroll-up-btn").click(function () {
    $("html").animate({ scrollTop: 0 });
    //  removing smooth scroll on slide-up button click  //
    $("html").css("scrollBehavior", "auto");
  });

  $(".navbar .menu li a").click(function () {
    //  Smooth scroll on Menu Items click  //

    $("html").css("scrollBehavior", "smooth");
  });

  //  Toggle Navbar  //

  $(".menu-btn").click(function () {
    $(".navbar .menu").toggleClass("active");
    $(".menu-btn i").toggleClass("active");
  });

  //  Typing Text Animation  //

  var typed = new Typed(".typing", {
    strings: [
      "Fullstack Developer",
      "Software Developer",
      "Oracle Certified Java Programmer"
    ],
    typeSpeed: 100,
    backSpeed: 60,
    loop: true
  });

  var typed = new Typed(".typing-2", {
    strings: [
      "Avik Saha Roy"
    ],
    typeSpeed: 100,
    backSpeed: 60,
    loop: true
  });

  //  Owl Carousel  //

  $(".carousel").owlCarousel({
    margin: 20,
    loop: true,
    autoplay: true,
    autoplayTimeOut: 2000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1,
        nav: false
      },
      600: {
        items: 2,
        nav: false
      },
      1000: {
        items: 3,
        nav: false
      }
    }
  });
});

function about() {
  var reveals = document.querySelectorAll(".about");

  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}
window.addEventListener("scroll", about);


function services() {
  var reveals = document.querySelectorAll(".services");

  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}
window.addEventListener("scroll", services);


function skills() {
  var reveals = document.querySelectorAll(".skills");

  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}
window.addEventListener("scroll", skills);


function projects() {
  var reveals = document.querySelectorAll(".projects");

  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}
window.addEventListener("scroll", projects);


function contact() {
  var reveals = document.querySelectorAll(".contact");

  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}
window.addEventListener("scroll", contact);


// disable inspect, cut, copy, pest --------------------------
const disabledKeys = ["c", "C", "x", "J", "u", "I"]; // keys that will be disabled

const showAlert = e => {
  e.preventDefault(); // preventing its default behaviour
  // return alert("Sorry, you can't view or copy source codes this way!");
  return Swal.fire({
    icon: 'warning',
    title: 'Oops...',
    text: 'Sorry, you can not view or copy source codes this way!',
  })
}

document.addEventListener("contextmenu", e => {
  showAlert(e); // calling showAlert() function on mouse right click
});

document.addEventListener("keydown", e => {
  // calling showAlert() function, if the pressed key matched to disabled keys
  if ((e.ctrlKey && disabledKeys.includes(e.key)) || e.key === "F12") {
    showAlert(e);
  }
});


/* Active underline nav items -------------------*/
$(document).ready(function () {
  $('a').click(function () {
    // Remove 'active' class from all menu items
    $('a').removeClass('active');

    // Add 'active' class to the clicked menu item
    $(this).addClass('active');
  });
});



// Dark mode ----------------
document.addEventListener('DOMContentLoaded', function () {
  const darkModeToggle = document.getElementById('checkbox');

  // Function to toggle dark mode
  function toggleDarkMode() {
    if (darkModeToggle.checked) {
      enableDarkMode();
      localStorage.setItem('darkMode', 'true');
    } else {
      disableDarkMode();
      localStorage.setItem('darkMode', 'false');
    }
  }

  // Function to enable dark mode
  function enableDarkMode() {
    document.body.classList.add('dark-mode');
  }

  // Function to disable dark mode
  function disableDarkMode() {
    document.body.classList.remove('dark-mode');
  }

  // Attach the toggleDarkMode function to the checkbox's click and touch events
  // for mobile
  darkModeToggle.addEventListener('click', toggleDarkMode);
  darkModeToggle.addEventListener('touchstart', toggleDarkMode);

  // Check local storage for dark mode preference
  const isDarkMode = localStorage.getItem('darkMode') === 'true';

  // Initialize dark mode based on local storage
  darkModeToggle.checked = isDarkMode;
  if (isDarkMode) {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});


