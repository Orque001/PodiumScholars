// Listens for DOMContentLoaded event to ensure the DOm is loaded before execution
document.addEventListener('DOMContentLoaded', function() {
    fetchNavbar();
    addGlobalMessage();
    fetchLogin();
    fetchDashboardIcon();
});

// Moves the navbar up once we've scrolled down to fill gap left by demo banner
window.addEventListener('scroll', function() {
    var navbar = this.document.querySelector('.navbar');
    if (this.window.scrollY > 20) {
        navbar.style.top = '0px';
    } else {
        navbar.style.top = '40px';
    }
})

// Function that fetches the navbar for the html pages
function fetchNavbar() {
    fetch('/navbar')
        // If successful, response with the navbar
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-placeholder").innerHTML = data;
        })
        // If failure, log the error
        .catch(error => console.error('Error loading the navbar:', error));
}

// FUnction that adds a global message to all html pages
function addGlobalMessage() {
    const message = document.createElement("div");
    message.textContent = "SFSU Software Engineer Project CSC 648-848, Spring 2024 For Demonstration Only";
    message.classList.add("global-message");

    document.body.insertBefore(message, document.body.firstChild);
}

// Function that fetches the dashboardIcon for the html pages
function fetchDashboardIcon() {
    fetch('/dashboardicon')
        // If successful, response with the navbar
        .then(response => response.text())
        .then(data => {
            document.getElementById("dashboard-icon-placeholder").innerHTML = data;
        })
        // If failure, log the error
        .catch(error => console.error('Error loading the navbar:', error));
}

// Function that fetche the login page for all html pages
function fetchLogin() {
    fetch('/login')
        // If successful, response with the login
        .then(response => response.text())
        .then(data => {
            document.getElementById("login-placeholder").innerHTML = data;
        })
        // If failure, log the error
        .catch(error => console.error('Error loading the login:', error));
}
