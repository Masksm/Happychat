document.addEventListener('DOMContentLoaded', function() {
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const forgotPassword = document.getElementById('forgot-password');
    const backToLogin = document.getElementById('back-to-login');
    const formInner = document.getElementById('form-inner');

    showSignup.addEventListener('click', function(e) {
        e.preventDefault();
        formInner.classList.add('show-signup');
        formInner.classList.remove('show-forgot-password');
    });

    showLogin.addEventListener('click', function(e) {
        e.preventDefault();
        formInner.classList.remove('show-signup', 'show-forgot-password');
    });

    forgotPassword.addEventListener('click', function(e) {
        e.preventDefault();
        formInner.classList.add('show-forgot-password');
        formInner.classList.remove('show-signup');
    });

    backToLogin.addEventListener('click', function(e) {
        e.preventDefault();
        formInner.classList.remove('show-forgot-password');
    });
});

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function setRandomGradient() {
    document.documentElement.style.setProperty('--color1', getRandomColor());
    document.documentElement.style.setProperty('--color2', getRandomColor());
    document.documentElement.style.setProperty('--color3', getRandomColor());
    document.documentElement.style.setProperty('--color4', getRandomColor());
}

// Call the function to set random gradient colors on page load
setRandomGradient();

// Optionally, call the function periodically to update the gradient with new random colors
setInterval(setRandomGradient, 30000); // Update every 30 seconds
