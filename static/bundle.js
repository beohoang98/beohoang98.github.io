(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
class Component {
    constructor(str) {
        this.element = $(`<${str}/>`);
    }

    render() {
        return this.element;
    }
}

module.exports = Component;

},{}],2:[function(require,module,exports){
const Component = require('../Component.js');
const Loading = require('../Loading');

class Content extends Component {
    constructor(url = '') {
        super('div');
        this.element.addClass('site-content').attr('id', 'site-content');
        this.url = url;

        this.loadingScreen = new Loading();
        this.element.append(this.loadingScreen.render());
    }

    load(url, callback = () => {}) {
        this.loadingScreen.show();

        fetch(url)
        .then(res => res.text())
        .then((text) => {
            this.element.html('').html(text);

            this.loadingScreen = new Loading();
            this.element.append(this.loadingScreen.render());
            callback();
        });
    }

    loadAsync(url) {
        return new Promise((resolve) => {
            this.load(url, () => {
                resolve();
            });
        });
    }
}

module.exports = Content;

},{"../Component.js":1,"../Loading":4}],3:[function(require,module,exports){
const Component = require('../Component.js');

class Link extends Component {
    constructor(text = '') {
        super('a');
        this.clickEvent = [];

        this.element.addClass('nav-link')
                    .attr('href', '#')
                    .text(text);
        this.element.on('click', (e) => {
            for (const func of Array.from(this.clickEvent)) {
                if (typeof func === 'function') {
                    func(e);
                }
            }
        });
    }

    onClick(func) {
        this.clickEvent.push(func);
    }
}

module.exports = Link;

},{"../Component.js":1}],4:[function(require,module,exports){
const Component = require('../Component.js');

class Loading extends Component {
    constructor() {
        super('div');
        this.element.addClass('loading').attr('id', 'site-loading').hide();
        this.element.html(`
        <div></div>
        `);
    }

    show() {
        this.element.fadeIn(200);
    }

    hide(callback = () => {}) {
        return new Promise((resolve) => {
            this.element.fadeOut(200, () => {
                callback();
                resolve();
            });
        });
    }
}

module.exports = Loading;

},{"../Component.js":1}],5:[function(require,module,exports){
const Component = require('../Component.js');
const Link = require('../Link');

class NavItem extends Component {
    constructor(title = '', iconClass = '') {
        super('li');
        this.link = new Link(`\t${title}`);
        this.link.element.prepend($('<i/>').addClass(iconClass));
        this.element.addClass('nav-item');
        this.element.append(this.link.render());
    }

    onClick(func) {
        this.link.onClick(func);
    }
}

module.exports = NavItem;

},{"../Component.js":1,"../Link":3}],6:[function(require,module,exports){
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

},{"../../Setting":8,"../Component.js":1,"../Content":2,"../Sidebar":7}],7:[function(require,module,exports){
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

},{"../Component.js":1,"../NavItem":5}],8:[function(require,module,exports){
class Setting {
    load() {
        this.data = JSON.parse(localStorage.getItem('setting')) || {};
    }

    save() {
        localStorage.setItem('setting', JSON.stringify(this.data));
    }

    get theme() {
        return this.data.theme || '';
    }

    set theme(theme) {
        if (theme !== 'theme-dark') this.data.theme = '';
        else this.data.theme = theme;
    }
}

module.exports = Setting;

},{}],9:[function(require,module,exports){
const Router = require('./router');
const Page = require('./Component/Page');


(function afterLoad($) {
    const router = new Router();
    const page = new Page('');

    const PAGE_LIST = ['home', 'about', 'blog'];

    router.map('/', (req, res) => {
        window.location = '/home';
    });

    router.map('/:pagename', async (req, res) => {
        const { params: { pagename } } = req;
        console.log(pagename);
        if (PAGE_LIST.includes(pagename)) {
            page.rerender(pagename);
            res.end();
        }
    });

    router.map('/see-blog/:postName', (req, res) => {
        page.rerender(`blog/${req.params.postName}`);
        res.end();
    });

    router.map('/.*', (req, res) => {
        res.render('404.html', req);
        res.end();
    });

    $(document).ready(() => {

        let oldScroll = 0;

        $(window).on('scroll', (event) => {
            const newScroll = +$(document).scrollTop();
            if (newScroll > oldScroll) {
                $('.site-sidebar').addClass('onscrolldown');
            } else {
                $('.site-sidebar').removeClass('onscrolldown');
            }

            oldScroll = newScroll;
        });

        $('body').html('').append(page.render());
        router.ready();
    });
    window.addEventListener('popstate', () => {
        router.ready();
    });
}(jQuery));

},{"./Component/Page":6,"./router":11}],10:[function(require,module,exports){
class RouterRes {
    constructor() {
        this.isEnd = false;
    }

    render(page, data) {
        this.isEnd = true;

        fetch(`/page/${page}`)
        .then(res => res.text())
        .then((text) => {
            const varData = data || [];
            let textRendered = text;

            for (const key of Object.keys(varData)) {
                textRendered = textRendered.replace(`{{${key}}}`, varData[key]);
            }

            return textRendered;
        }).then((text) => {
            $('body').html(text);
        });
    }

    end() {
        this.isEnd = true;
    }
}

module.exports = RouterRes;

},{}],11:[function(require,module,exports){
const RouterRes = require('./router-res');

module.exports = class Router {
    constructor() {
        this.route = [];
        this.request = {};
    }

    ready() {
        const url = new URL(window.location);

        const { searchParams, pathname } = url;
        const search = {};

        searchParams.forEach((val, key) => {
            search[key] = val;
        });
        this.request = {
            url,
            params: {},
            search,
        };
        this.response = new RouterRes();

        this.match(pathname);
    }

    /**
     * map request
     * @param {String} path like `/asd/:abc/`
     * @param {Function} callback function (request, response, next)
     */
    map(path, callback) {
        const regMatch = (new function () {
            this.var = [];
            // copy from http://krasimirtsonev.com/blog/article/deep-dive-into-client-side-routing-navigo-pushstate-hash
            this.match_path = new RegExp(`^${path.replace(/(:)(\w+)/g, (full, dots, name) => {
                this.var.push(name);
                return '([^\\/]+)';
            })}(?:(?:\\/$)|$)`);

            return this;
        }());

        this.route.push({ path, regex: regMatch, callback });
    }

    /**
     * @param {string} path find path matched in route
     * @return {Function | null} callback of mapped route
     */
    async match(path) {
        for (const route of this.route) {
            if (this.response.isEnd) break;

            const match = path.match(route.regex.match_path);
            if (match) {
                for (let i = 1; i < match.length; i += 1) {
                    this.request.params[route.regex.var[i - 1]] = match[i];
                }
                await route.callback(this.request, this.response);
            }
        }
    }
};

},{"./router-res":10}]},{},[9])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQ29tcG9uZW50L0NvbXBvbmVudC5qcyIsInNyYy9Db21wb25lbnQvQ29udGVudC9pbmRleC5qcyIsInNyYy9Db21wb25lbnQvTGluay9pbmRleC5qcyIsInNyYy9Db21wb25lbnQvTG9hZGluZy9pbmRleC5qcyIsInNyYy9Db21wb25lbnQvTmF2SXRlbS9pbmRleC5qcyIsInNyYy9Db21wb25lbnQvUGFnZS9pbmRleC5qcyIsInNyYy9Db21wb25lbnQvU2lkZWJhci9pbmRleC5qcyIsInNyYy9TZXR0aW5nL2luZGV4LmpzIiwic3JjL21haW4uanMiLCJzcmMvcm91dGVyLXJlcy9pbmRleC5qcyIsInNyYy9yb3V0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjbGFzcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHN0cikge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSAkKGA8JHtzdHJ9Lz5gKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQ7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvbmVudDtcbiIsImNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJy4uL0NvbXBvbmVudC5qcycpO1xuY29uc3QgTG9hZGluZyA9IHJlcXVpcmUoJy4uL0xvYWRpbmcnKTtcblxuY2xhc3MgQ29udGVudCBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IodXJsID0gJycpIHtcbiAgICAgICAgc3VwZXIoJ2RpdicpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkQ2xhc3MoJ3NpdGUtY29udGVudCcpLmF0dHIoJ2lkJywgJ3NpdGUtY29udGVudCcpO1xuICAgICAgICB0aGlzLnVybCA9IHVybDtcblxuICAgICAgICB0aGlzLmxvYWRpbmdTY3JlZW4gPSBuZXcgTG9hZGluZygpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kKHRoaXMubG9hZGluZ1NjcmVlbi5yZW5kZXIoKSk7XG4gICAgfVxuXG4gICAgbG9hZCh1cmwsIGNhbGxiYWNrID0gKCkgPT4ge30pIHtcbiAgICAgICAgdGhpcy5sb2FkaW5nU2NyZWVuLnNob3coKTtcblxuICAgICAgICBmZXRjaCh1cmwpXG4gICAgICAgIC50aGVuKHJlcyA9PiByZXMudGV4dCgpKVxuICAgICAgICAudGhlbigodGV4dCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50Lmh0bWwoJycpLmh0bWwodGV4dCk7XG5cbiAgICAgICAgICAgIHRoaXMubG9hZGluZ1NjcmVlbiA9IG5ldyBMb2FkaW5nKCk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kKHRoaXMubG9hZGluZ1NjcmVlbi5yZW5kZXIoKSk7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBsb2FkQXN5bmModXJsKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5sb2FkKHVybCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udGVudDtcbiIsImNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJy4uL0NvbXBvbmVudC5qcycpO1xuXG5jbGFzcyBMaW5rIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcih0ZXh0ID0gJycpIHtcbiAgICAgICAgc3VwZXIoJ2EnKTtcbiAgICAgICAgdGhpcy5jbGlja0V2ZW50ID0gW107XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZENsYXNzKCduYXYtbGluaycpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCdocmVmJywgJyMnKVxuICAgICAgICAgICAgICAgICAgICAudGV4dCh0ZXh0KTtcbiAgICAgICAgdGhpcy5lbGVtZW50Lm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGZ1bmMgb2YgQXJyYXkuZnJvbSh0aGlzLmNsaWNrRXZlbnQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBmdW5jID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGZ1bmMoZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvbkNsaWNrKGZ1bmMpIHtcbiAgICAgICAgdGhpcy5jbGlja0V2ZW50LnB1c2goZnVuYyk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExpbms7XG4iLCJjb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCcuLi9Db21wb25lbnQuanMnKTtcblxuY2xhc3MgTG9hZGluZyBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCdkaXYnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZENsYXNzKCdsb2FkaW5nJykuYXR0cignaWQnLCAnc2l0ZS1sb2FkaW5nJykuaGlkZSgpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuaHRtbChgXG4gICAgICAgIDxkaXY+PC9kaXY+XG4gICAgICAgIGApO1xuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5mYWRlSW4oMjAwKTtcbiAgICB9XG5cbiAgICBoaWRlKGNhbGxiYWNrID0gKCkgPT4ge30pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuZmFkZU91dCgyMDAsICgpID0+IHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTG9hZGluZztcbiIsImNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJy4uL0NvbXBvbmVudC5qcycpO1xuY29uc3QgTGluayA9IHJlcXVpcmUoJy4uL0xpbmsnKTtcblxuY2xhc3MgTmF2SXRlbSBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IodGl0bGUgPSAnJywgaWNvbkNsYXNzID0gJycpIHtcbiAgICAgICAgc3VwZXIoJ2xpJyk7XG4gICAgICAgIHRoaXMubGluayA9IG5ldyBMaW5rKGBcXHQke3RpdGxlfWApO1xuICAgICAgICB0aGlzLmxpbmsuZWxlbWVudC5wcmVwZW5kKCQoJzxpLz4nKS5hZGRDbGFzcyhpY29uQ2xhc3MpKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZENsYXNzKCduYXYtaXRlbScpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kKHRoaXMubGluay5yZW5kZXIoKSk7XG4gICAgfVxuXG4gICAgb25DbGljayhmdW5jKSB7XG4gICAgICAgIHRoaXMubGluay5vbkNsaWNrKGZ1bmMpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOYXZJdGVtO1xuIiwiY29uc3QgQ29tcG9uZW50ID0gcmVxdWlyZSgnLi4vQ29tcG9uZW50LmpzJyk7XG5jb25zdCBTaWRlQmFyID0gcmVxdWlyZSgnLi4vU2lkZWJhcicpO1xuY29uc3QgQ29udGVudCA9IHJlcXVpcmUoJy4uL0NvbnRlbnQnKTtcbmNvbnN0IFNldHRpbmcgPSByZXF1aXJlKCcuLi8uLi9TZXR0aW5nJyk7XG5cbmNsYXNzIFBhZ2UgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcignZGl2Jyk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRDbGFzcygnc2l0ZScpLmF0dHIoJ2lkJywgJ3NpdGUnKTtcblxuICAgICAgICB0aGlzLnNldHRpbmcgPSBuZXcgU2V0dGluZygpO1xuICAgICAgICB0aGlzLnNldHRpbmcubG9hZCgpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkQ2xhc3ModGhpcy5zZXR0aW5nLnRoZW1lKTtcblxuICAgICAgICB0aGlzLnNpZGVCYXIgPSBuZXcgU2lkZUJhcigpO1xuICAgICAgICB0aGlzLmNvbnRlbnQgPSBuZXcgQ29udGVudCgpO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmQodGhpcy5zaWRlQmFyLnJlbmRlcigpKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZCh0aGlzLmNvbnRlbnQucmVuZGVyKCkpO1xuXG4gICAgICAgIHRoaXMuaGFuZGxlTWVudSgpO1xuICAgIH1cblxuICAgIGhhbmRsZU1lbnUoKSB7XG4gICAgICAgIHRoaXMuc2lkZUJhci5tZW51LmNoYW5nZVRoZW1lLm9uQ2xpY2soKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC50b2dnbGVDbGFzcygndGhlbWUtZGFyaycpO1xuICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZy50aGVtZSAhPT0gJ3RoZW1lLWRhcmsnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5nLnRoZW1lID0gJ3RoZW1lLWRhcmsnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmcudGhlbWUgPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2V0dGluZy5zYXZlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2lkZUJhci5tZW51LmhvbWVQYWdlLm9uQ2xpY2soKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuc3dpdGNoUGFnZSgnaG9tZScpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNpZGVCYXIubWVudS5hYm91dFBhZ2Uub25DbGljaygoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5zd2l0Y2hQYWdlKCdhYm91dCcpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNpZGVCYXIubWVudS5ibG9nUGFnZS5vbkNsaWNrKChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLnN3aXRjaFBhZ2UoJ2Jsb2cnKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3dpdGNoUGFnZShwYWdlTmFtZSkge1xuICAgICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoJycsICcnLCBgLyR7cGFnZU5hbWV9YCk7XG4gICAgICAgIHRoaXMucmVyZW5kZXIocGFnZU5hbWUpO1xuICAgIH1cblxuICAgIGFzeW5jIHJlcmVuZGVyKHBhZ2VOYW1lKSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IHRoaXMuY29udGVudC5sb2FkQXN5bmMoYC9wYWdlLyR7cGFnZU5hbWV9YCk7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBhZ2U7XG4iLCJjb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCcuLi9Db21wb25lbnQuanMnKTtcbmNvbnN0IE5hdkl0ZW0gPSByZXF1aXJlKCcuLi9OYXZJdGVtJyk7XG5cbmNsYXNzIFNpZGViYXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigndWwnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50XG4gICAgICAgIC5hZGRDbGFzcygnc2l0ZS1zaWRlYmFyIG5hdmJhci1uYXYgZmxleC1jb2x1bW4nKVxuICAgICAgICAuYXR0cignaWQnLCAnc2l0ZS1tZW51Jyk7XG5cbiAgICAgICAgdGhpcy5tZW51ID0ge1xuICAgICAgICAgICAgaG9tZVBhZ2U6IG5ldyBOYXZJdGVtKCdIT01FJywgJ2ZhcyBmYS1ob21lJyksXG4gICAgICAgICAgICBhYm91dFBhZ2U6IG5ldyBOYXZJdGVtKCdBQk9VVCcsICdmYXMgZmEtaW5mby1jaXJjbGUnKSxcbiAgICAgICAgICAgIGJsb2dQYWdlOiBuZXcgTmF2SXRlbSgnQkxPRycsICdmYXMgZmEtcGVuJyksXG4gICAgICAgICAgICBjaGFuZ2VUaGVtZTogbmV3IE5hdkl0ZW0oJ0NIQU5HRSBUSEVNRScsICdmYXMgZmEtY29nJyksXG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yIChjb25zdCBuYXZOYW1lIG9mIE9iamVjdC5rZXlzKHRoaXMubWVudSkpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmQodGhpcy5tZW51W25hdk5hbWVdLnJlbmRlcigpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTaWRlYmFyO1xuIiwiY2xhc3MgU2V0dGluZyB7XG4gICAgbG9hZCgpIHtcbiAgICAgICAgdGhpcy5kYXRhID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2V0dGluZycpKSB8fCB7fTtcbiAgICB9XG5cbiAgICBzYXZlKCkge1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc2V0dGluZycsIEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YSkpO1xuICAgIH1cblxuICAgIGdldCB0aGVtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS50aGVtZSB8fCAnJztcbiAgICB9XG5cbiAgICBzZXQgdGhlbWUodGhlbWUpIHtcbiAgICAgICAgaWYgKHRoZW1lICE9PSAndGhlbWUtZGFyaycpIHRoaXMuZGF0YS50aGVtZSA9ICcnO1xuICAgICAgICBlbHNlIHRoaXMuZGF0YS50aGVtZSA9IHRoZW1lO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZXR0aW5nO1xuIiwiY29uc3QgUm91dGVyID0gcmVxdWlyZSgnLi9yb3V0ZXInKTtcbmNvbnN0IFBhZ2UgPSByZXF1aXJlKCcuL0NvbXBvbmVudC9QYWdlJyk7XG5cblxuKGZ1bmN0aW9uIGFmdGVyTG9hZCgkKSB7XG4gICAgY29uc3Qgcm91dGVyID0gbmV3IFJvdXRlcigpO1xuICAgIGNvbnN0IHBhZ2UgPSBuZXcgUGFnZSgnJyk7XG5cbiAgICBjb25zdCBQQUdFX0xJU1QgPSBbJ2hvbWUnLCAnYWJvdXQnLCAnYmxvZyddO1xuXG4gICAgcm91dGVyLm1hcCgnLycsIChyZXEsIHJlcykgPT4ge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24gPSAnL2hvbWUnO1xuICAgIH0pO1xuXG4gICAgcm91dGVyLm1hcCgnLzpwYWdlbmFtZScsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICAgICAgICBjb25zdCB7IHBhcmFtczogeyBwYWdlbmFtZSB9IH0gPSByZXE7XG4gICAgICAgIGNvbnNvbGUubG9nKHBhZ2VuYW1lKTtcbiAgICAgICAgaWYgKFBBR0VfTElTVC5pbmNsdWRlcyhwYWdlbmFtZSkpIHtcbiAgICAgICAgICAgIHBhZ2UucmVyZW5kZXIocGFnZW5hbWUpO1xuICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByb3V0ZXIubWFwKCcvc2VlLWJsb2cvOnBvc3ROYW1lJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgIHBhZ2UucmVyZW5kZXIoYGJsb2cvJHtyZXEucGFyYW1zLnBvc3ROYW1lfWApO1xuICAgICAgICByZXMuZW5kKCk7XG4gICAgfSk7XG5cbiAgICByb3V0ZXIubWFwKCcvLionLCAocmVxLCByZXMpID0+IHtcbiAgICAgICAgcmVzLnJlbmRlcignNDA0Lmh0bWwnLCByZXEpO1xuICAgICAgICByZXMuZW5kKCk7XG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeSgoKSA9PiB7XG5cbiAgICAgICAgbGV0IG9sZFNjcm9sbCA9IDA7XG5cbiAgICAgICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5ld1Njcm9sbCA9ICskKGRvY3VtZW50KS5zY3JvbGxUb3AoKTtcbiAgICAgICAgICAgIGlmIChuZXdTY3JvbGwgPiBvbGRTY3JvbGwpIHtcbiAgICAgICAgICAgICAgICAkKCcuc2l0ZS1zaWRlYmFyJykuYWRkQ2xhc3MoJ29uc2Nyb2xsZG93bicpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKCcuc2l0ZS1zaWRlYmFyJykucmVtb3ZlQ2xhc3MoJ29uc2Nyb2xsZG93bicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBvbGRTY3JvbGwgPSBuZXdTY3JvbGw7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJ2JvZHknKS5odG1sKCcnKS5hcHBlbmQocGFnZS5yZW5kZXIoKSk7XG4gICAgICAgIHJvdXRlci5yZWFkeSgpO1xuICAgIH0pO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsICgpID0+IHtcbiAgICAgICAgcm91dGVyLnJlYWR5KCk7XG4gICAgfSk7XG59KGpRdWVyeSkpO1xuIiwiY2xhc3MgUm91dGVyUmVzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pc0VuZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHJlbmRlcihwYWdlLCBkYXRhKSB7XG4gICAgICAgIHRoaXMuaXNFbmQgPSB0cnVlO1xuXG4gICAgICAgIGZldGNoKGAvcGFnZS8ke3BhZ2V9YClcbiAgICAgICAgLnRoZW4ocmVzID0+IHJlcy50ZXh0KCkpXG4gICAgICAgIC50aGVuKCh0ZXh0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YXJEYXRhID0gZGF0YSB8fCBbXTtcbiAgICAgICAgICAgIGxldCB0ZXh0UmVuZGVyZWQgPSB0ZXh0O1xuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyh2YXJEYXRhKSkge1xuICAgICAgICAgICAgICAgIHRleHRSZW5kZXJlZCA9IHRleHRSZW5kZXJlZC5yZXBsYWNlKGB7eyR7a2V5fX19YCwgdmFyRGF0YVtrZXldKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRleHRSZW5kZXJlZDtcbiAgICAgICAgfSkudGhlbigodGV4dCkgPT4ge1xuICAgICAgICAgICAgJCgnYm9keScpLmh0bWwodGV4dCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGVuZCgpIHtcbiAgICAgICAgdGhpcy5pc0VuZCA9IHRydWU7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJvdXRlclJlcztcbiIsImNvbnN0IFJvdXRlclJlcyA9IHJlcXVpcmUoJy4vcm91dGVyLXJlcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFJvdXRlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMucm91dGUgPSBbXTtcbiAgICAgICAgdGhpcy5yZXF1ZXN0ID0ge307XG4gICAgfVxuXG4gICAgcmVhZHkoKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uKTtcblxuICAgICAgICBjb25zdCB7IHNlYXJjaFBhcmFtcywgcGF0aG5hbWUgfSA9IHVybDtcbiAgICAgICAgY29uc3Qgc2VhcmNoID0ge307XG5cbiAgICAgICAgc2VhcmNoUGFyYW1zLmZvckVhY2goKHZhbCwga2V5KSA9PiB7XG4gICAgICAgICAgICBzZWFyY2hba2V5XSA9IHZhbDtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucmVxdWVzdCA9IHtcbiAgICAgICAgICAgIHVybCxcbiAgICAgICAgICAgIHBhcmFtczoge30sXG4gICAgICAgICAgICBzZWFyY2gsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMucmVzcG9uc2UgPSBuZXcgUm91dGVyUmVzKCk7XG5cbiAgICAgICAgdGhpcy5tYXRjaChwYXRobmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogbWFwIHJlcXVlc3RcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aCBsaWtlIGAvYXNkLzphYmMvYFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIGZ1bmN0aW9uIChyZXF1ZXN0LCByZXNwb25zZSwgbmV4dClcbiAgICAgKi9cbiAgICBtYXAocGF0aCwgY2FsbGJhY2spIHtcbiAgICAgICAgY29uc3QgcmVnTWF0Y2ggPSAobmV3IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudmFyID0gW107XG4gICAgICAgICAgICAvLyBjb3B5IGZyb20gaHR0cDovL2tyYXNpbWlydHNvbmV2LmNvbS9ibG9nL2FydGljbGUvZGVlcC1kaXZlLWludG8tY2xpZW50LXNpZGUtcm91dGluZy1uYXZpZ28tcHVzaHN0YXRlLWhhc2hcbiAgICAgICAgICAgIHRoaXMubWF0Y2hfcGF0aCA9IG5ldyBSZWdFeHAoYF4ke3BhdGgucmVwbGFjZSgvKDopKFxcdyspL2csIChmdWxsLCBkb3RzLCBuYW1lKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy52YXIucHVzaChuYW1lKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyhbXlxcXFwvXSspJztcbiAgICAgICAgICAgIH0pfSg/Oig/OlxcXFwvJCl8JClgKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0oKSk7XG5cbiAgICAgICAgdGhpcy5yb3V0ZS5wdXNoKHsgcGF0aCwgcmVnZXg6IHJlZ01hdGNoLCBjYWxsYmFjayB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCBmaW5kIHBhdGggbWF0Y2hlZCBpbiByb3V0ZVxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9uIHwgbnVsbH0gY2FsbGJhY2sgb2YgbWFwcGVkIHJvdXRlXG4gICAgICovXG4gICAgYXN5bmMgbWF0Y2gocGF0aCkge1xuICAgICAgICBmb3IgKGNvbnN0IHJvdXRlIG9mIHRoaXMucm91dGUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnJlc3BvbnNlLmlzRW5kKSBicmVhaztcblxuICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBwYXRoLm1hdGNoKHJvdXRlLnJlZ2V4Lm1hdGNoX3BhdGgpO1xuICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBtYXRjaC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3QucGFyYW1zW3JvdXRlLnJlZ2V4LnZhcltpIC0gMV1dID0gbWF0Y2hbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGF3YWl0IHJvdXRlLmNhbGxiYWNrKHRoaXMucmVxdWVzdCwgdGhpcy5yZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuIl19
