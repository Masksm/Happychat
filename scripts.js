document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login');
    const signupForm = document.getElementById('signup');
    const goToSignup = document.getElementById('goToSignup');
    const goToLogin = document.getElementById('goToLogin');

    function showSignup() {
        loginForm.style.transform = 'rotateY(-180deg)';
        signupForm.style.transform = 'rotateY(0deg)';
    }

    function showLogin() {
        loginForm.style.transform = 'rotateY(0deg)';
        signupForm.style.transform = 'rotateY(180deg)';
    }

    goToSignup.addEventListener('click', () => {
        showSignup();
    });

    goToLogin.addEventListener('click', () => {
        showLogin();
    });
});
