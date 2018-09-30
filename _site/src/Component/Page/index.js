const Component = require('../Component.js');
const SideBar = require('../Sidebar');
const Content = require('../Content');
const Setting = require('../../Setting');

class Page extends Component {
    constructor() {
        super('div');
        this.element.addClass('site').attr('id', 'site');

        this.setting = new Setting();
        this.setting.load();
        this.element.addClass(this.setting.theme);

        this.sideBar = new SideBar();
        this.content = new Content();

        this.element.append(this.sideBar.render());
        this.element.append(this.content.render());

        this.handleMenu();
    }

    handleMenu() {
        this.sideBar.menu.changeTheme.onClick((e) => {
            e.preventDefault();
            this.element.toggleClass('theme-dark');
            if (this.setting.theme !== 'theme-dark') {
                this.setting.theme = 'theme-dark';
            } else {
                this.setting.theme = '';
            }
            this.setting.save();
        });

        this.sideBar.menu.homePage.onClick((e) => {
            e.preventDefault();
            this.switchPage('home');
        });

        this.sideBar.menu.aboutPage.onClick((e) => {
            e.preventDefault();
            this.switchPage('about');
        });

        this.sideBar.menu.blogPage.onClick((e) => {
            e.preventDefault();
            this.switchPage('blog');
        });
    }

    switchPage(pageName) {
        window.history.pushState('', '', `/${pageName}`);
        this.rerender(pageName);
    }

    async rerender(pageName) {
        const res = await this.content.loadAsync(`/page/${pageName}`);
        return res;
    }
}

module.exports = Page;
