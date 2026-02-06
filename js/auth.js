const Auth = {
    users: JSON.parse(localStorage.getItem('gymshark_users')) || [
        { email: 'admin@gymshark.com', password: 'admin', role: 'admin', name: 'Admin Master' }
    ],
    currentUser: JSON.parse(localStorage.getItem('gymshark_session')) || null,

    register(userData) {
        if (this.users.find(u => u.email === userData.email)) return false;
        this.users.push(userData);
        localStorage.setItem('gymshark_users', JSON.stringify(this.users));
        return true;
    },

    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('gymshark_session', JSON.stringify(user));
            return true;
        }
        return false;
    },

    logout() {
        this.currentUser = null;
        localStorage.removeItem('gymshark_session');
        window.location.href = 'index.html';
    },

    getCurrentUser() {
        return this.currentUser;
    },

    isLoggedIn() {
        return !!this.currentUser;
    },

    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }
};

// Site-wide auth UI update
document.addEventListener('DOMContentLoaded', () => {
    const authLinks = document.querySelector('.auth-links');
    const user = Auth.getCurrentUser();

    if (authLinks && user) {
        authLinks.innerHTML = `
            <div class="dropdown">
                <a class="nav-link dropdown-toggle text-warning" href="#" role="button" data-bs-toggle="dropdown">
                    Hi, ${user.name.split(' ')[0]}
                </a>
                <ul class="dropdown-menu dropdown-menu-dark">
                    <li><a class="dropdown-item" href="${user.role === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html'}">Dashboard</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="#" onclick="Auth.logout()">Logout</a></li>
                </ul>
            </div>
        `;
    }
});
