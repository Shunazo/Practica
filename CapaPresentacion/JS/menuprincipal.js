document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (!isLoggedIn || isLoggedIn !== 'true') {
        window.location.href = 'index.html';
    }

 
    const logoutButton = document.querySelector('button:last-of-type');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'index.html';
        });
    }
});

