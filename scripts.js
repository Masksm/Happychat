document.getElementById('to-signup').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('login').style.transform = 'rotateY(-180deg)';
    document.getElementById('signup').style.transform = 'rotateY(0deg)';
    document.getElementById('signup').classList.remove('hidden');
    document.getElementById('login').classList.add('hidden');
});

document.getElementById('to-login').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('login').style.transform = 'rotateY(0deg)';
    document.getElementById('signup').style.transform = 'rotateY(180deg)';
    document.getElementById('signup').classList.add('hidden');
    document.getElementById('login').classList.remove('hidden');
});
