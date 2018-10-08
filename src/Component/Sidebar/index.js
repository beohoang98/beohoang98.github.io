const Component = require('../Component.js');
const NavItem = require('../NavItem');

class Sidebar extends Component {
    constructor() {
        super('ul');
        this.element
        .addClass('site-sidebar navbar-nav flex-column')
        .attr('id', 'site-menu');

        this.menu = {
            homePage: new NavItem('HOME', 'fas fa-home'),
            aboutPage: new NavItem('ABOUT', 'fas fa-info-circle'),
            blogPage: new NavItem('BLOG', 'fas fa-pen'),
            changeTheme: new NavItem('CHANGE THEME', 'fas fa-cog'),
        };

        for (const navName of Object.keys(this.menu)) {
            this.element.append(this.menu[navName].render());
        }
    }
}

module.exports = Sidebar;
