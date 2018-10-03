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
    constructor(title = '') {
        super('li');
        this.link = new Link(title);
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
            homePage: new NavItem('HOME'),
            aboutPage: new NavItem('ABOUT'),
            blogPage: new NavItem('BLOG'),
            changeTheme: new NavItem('CHANGE THEME'),
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


(function afterLoad() {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQ29tcG9uZW50L0NvbXBvbmVudC5qcyIsInNyYy9Db21wb25lbnQvQ29udGVudC9pbmRleC5qcyIsInNyYy9Db21wb25lbnQvTGluay9pbmRleC5qcyIsInNyYy9Db21wb25lbnQvTG9hZGluZy9pbmRleC5qcyIsInNyYy9Db21wb25lbnQvTmF2SXRlbS9pbmRleC5qcyIsInNyYy9Db21wb25lbnQvUGFnZS9pbmRleC5qcyIsInNyYy9Db21wb25lbnQvU2lkZWJhci9pbmRleC5qcyIsInNyYy9TZXR0aW5nL2luZGV4LmpzIiwic3JjL21haW4uanMiLCJzcmMvcm91dGVyLXJlcy9pbmRleC5qcyIsInNyYy9yb3V0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjbGFzcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHN0cikge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSAkKGA8JHtzdHJ9Lz5gKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQ7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvbmVudDtcbiIsImNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJy4uL0NvbXBvbmVudC5qcycpO1xuY29uc3QgTG9hZGluZyA9IHJlcXVpcmUoJy4uL0xvYWRpbmcnKTtcblxuY2xhc3MgQ29udGVudCBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IodXJsID0gJycpIHtcbiAgICAgICAgc3VwZXIoJ2RpdicpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkQ2xhc3MoJ3NpdGUtY29udGVudCcpLmF0dHIoJ2lkJywgJ3NpdGUtY29udGVudCcpO1xuICAgICAgICB0aGlzLnVybCA9IHVybDtcblxuICAgICAgICB0aGlzLmxvYWRpbmdTY3JlZW4gPSBuZXcgTG9hZGluZygpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kKHRoaXMubG9hZGluZ1NjcmVlbi5yZW5kZXIoKSk7XG4gICAgfVxuXG4gICAgbG9hZCh1cmwsIGNhbGxiYWNrID0gKCkgPT4ge30pIHtcbiAgICAgICAgdGhpcy5sb2FkaW5nU2NyZWVuLnNob3coKTtcblxuICAgICAgICBmZXRjaCh1cmwpXG4gICAgICAgIC50aGVuKHJlcyA9PiByZXMudGV4dCgpKVxuICAgICAgICAudGhlbigodGV4dCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50Lmh0bWwoJycpLmh0bWwodGV4dCk7XG5cbiAgICAgICAgICAgIHRoaXMubG9hZGluZ1NjcmVlbiA9IG5ldyBMb2FkaW5nKCk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kKHRoaXMubG9hZGluZ1NjcmVlbi5yZW5kZXIoKSk7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBsb2FkQXN5bmModXJsKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5sb2FkKHVybCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udGVudDtcbiIsImNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJy4uL0NvbXBvbmVudC5qcycpO1xuXG5jbGFzcyBMaW5rIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcih0ZXh0ID0gJycpIHtcbiAgICAgICAgc3VwZXIoJ2EnKTtcbiAgICAgICAgdGhpcy5jbGlja0V2ZW50ID0gW107XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZENsYXNzKCduYXYtbGluaycpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCdocmVmJywgJyMnKVxuICAgICAgICAgICAgICAgICAgICAudGV4dCh0ZXh0KTtcbiAgICAgICAgdGhpcy5lbGVtZW50Lm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGZ1bmMgb2YgQXJyYXkuZnJvbSh0aGlzLmNsaWNrRXZlbnQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBmdW5jID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGZ1bmMoZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvbkNsaWNrKGZ1bmMpIHtcbiAgICAgICAgdGhpcy5jbGlja0V2ZW50LnB1c2goZnVuYyk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExpbms7XG4iLCJjb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCcuLi9Db21wb25lbnQuanMnKTtcblxuY2xhc3MgTG9hZGluZyBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCdkaXYnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZENsYXNzKCdsb2FkaW5nJykuYXR0cignaWQnLCAnc2l0ZS1sb2FkaW5nJykuaGlkZSgpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuaHRtbChgXG4gICAgICAgIDxkaXY+PC9kaXY+XG4gICAgICAgIGApO1xuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5mYWRlSW4oMjAwKTtcbiAgICB9XG5cbiAgICBoaWRlKGNhbGxiYWNrID0gKCkgPT4ge30pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuZmFkZU91dCgyMDAsICgpID0+IHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTG9hZGluZztcbiIsImNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJy4uL0NvbXBvbmVudC5qcycpO1xuY29uc3QgTGluayA9IHJlcXVpcmUoJy4uL0xpbmsnKTtcblxuY2xhc3MgTmF2SXRlbSBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IodGl0bGUgPSAnJykge1xuICAgICAgICBzdXBlcignbGknKTtcbiAgICAgICAgdGhpcy5saW5rID0gbmV3IExpbmsodGl0bGUpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkQ2xhc3MoJ25hdi1pdGVtJyk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmQodGhpcy5saW5rLnJlbmRlcigpKTtcbiAgICB9XG5cbiAgICBvbkNsaWNrKGZ1bmMpIHtcbiAgICAgICAgdGhpcy5saW5rLm9uQ2xpY2soZnVuYyk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5hdkl0ZW07XG4iLCJjb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCcuLi9Db21wb25lbnQuanMnKTtcbmNvbnN0IFNpZGVCYXIgPSByZXF1aXJlKCcuLi9TaWRlYmFyJyk7XG5jb25zdCBDb250ZW50ID0gcmVxdWlyZSgnLi4vQ29udGVudCcpO1xuY29uc3QgU2V0dGluZyA9IHJlcXVpcmUoJy4uLy4uL1NldHRpbmcnKTtcblxuY2xhc3MgUGFnZSBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCdkaXYnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZENsYXNzKCdzaXRlJykuYXR0cignaWQnLCAnc2l0ZScpO1xuXG4gICAgICAgIHRoaXMuc2V0dGluZyA9IG5ldyBTZXR0aW5nKCk7XG4gICAgICAgIHRoaXMuc2V0dGluZy5sb2FkKCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRDbGFzcyh0aGlzLnNldHRpbmcudGhlbWUpO1xuXG4gICAgICAgIHRoaXMuc2lkZUJhciA9IG5ldyBTaWRlQmFyKCk7XG4gICAgICAgIHRoaXMuY29udGVudCA9IG5ldyBDb250ZW50KCk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZCh0aGlzLnNpZGVCYXIucmVuZGVyKCkpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kKHRoaXMuY29udGVudC5yZW5kZXIoKSk7XG5cbiAgICAgICAgdGhpcy5oYW5kbGVNZW51KCk7XG4gICAgfVxuXG4gICAgaGFuZGxlTWVudSgpIHtcbiAgICAgICAgdGhpcy5zaWRlQmFyLm1lbnUuY2hhbmdlVGhlbWUub25DbGljaygoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnRvZ2dsZUNsYXNzKCd0aGVtZS1kYXJrJyk7XG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5nLnRoZW1lICE9PSAndGhlbWUtZGFyaycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmcudGhlbWUgPSAndGhlbWUtZGFyayc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZy50aGVtZSA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXR0aW5nLnNhdmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zaWRlQmFyLm1lbnUuaG9tZVBhZ2Uub25DbGljaygoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5zd2l0Y2hQYWdlKCdob21lJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2lkZUJhci5tZW51LmFib3V0UGFnZS5vbkNsaWNrKChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLnN3aXRjaFBhZ2UoJ2Fib3V0Jyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2lkZUJhci5tZW51LmJsb2dQYWdlLm9uQ2xpY2soKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuc3dpdGNoUGFnZSgnYmxvZycpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzd2l0Y2hQYWdlKHBhZ2VOYW1lKSB7XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSgnJywgJycsIGAvJHtwYWdlTmFtZX1gKTtcbiAgICAgICAgdGhpcy5yZXJlbmRlcihwYWdlTmFtZSk7XG4gICAgfVxuXG4gICAgYXN5bmMgcmVyZW5kZXIocGFnZU5hbWUpIHtcbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgdGhpcy5jb250ZW50LmxvYWRBc3luYyhgL3BhZ2UvJHtwYWdlTmFtZX1gKTtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGFnZTtcbiIsImNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJy4uL0NvbXBvbmVudC5qcycpO1xuY29uc3QgTmF2SXRlbSA9IHJlcXVpcmUoJy4uL05hdkl0ZW0nKTtcblxuY2xhc3MgU2lkZWJhciBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCd1bCcpO1xuICAgICAgICB0aGlzLmVsZW1lbnRcbiAgICAgICAgLmFkZENsYXNzKCdzaXRlLXNpZGViYXIgbmF2YmFyLW5hdiBmbGV4LWNvbHVtbicpXG4gICAgICAgIC5hdHRyKCdpZCcsICdzaXRlLW1lbnUnKTtcblxuICAgICAgICB0aGlzLm1lbnUgPSB7XG4gICAgICAgICAgICBob21lUGFnZTogbmV3IE5hdkl0ZW0oJ0hPTUUnKSxcbiAgICAgICAgICAgIGFib3V0UGFnZTogbmV3IE5hdkl0ZW0oJ0FCT1VUJyksXG4gICAgICAgICAgICBibG9nUGFnZTogbmV3IE5hdkl0ZW0oJ0JMT0cnKSxcbiAgICAgICAgICAgIGNoYW5nZVRoZW1lOiBuZXcgTmF2SXRlbSgnQ0hBTkdFIFRIRU1FJyksXG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yIChjb25zdCBuYXZOYW1lIG9mIE9iamVjdC5rZXlzKHRoaXMubWVudSkpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmQodGhpcy5tZW51W25hdk5hbWVdLnJlbmRlcigpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTaWRlYmFyO1xuIiwiY2xhc3MgU2V0dGluZyB7XG4gICAgbG9hZCgpIHtcbiAgICAgICAgdGhpcy5kYXRhID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2V0dGluZycpKSB8fCB7fTtcbiAgICB9XG5cbiAgICBzYXZlKCkge1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc2V0dGluZycsIEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YSkpO1xuICAgIH1cblxuICAgIGdldCB0aGVtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS50aGVtZSB8fCAnJztcbiAgICB9XG5cbiAgICBzZXQgdGhlbWUodGhlbWUpIHtcbiAgICAgICAgaWYgKHRoZW1lICE9PSAndGhlbWUtZGFyaycpIHRoaXMuZGF0YS50aGVtZSA9ICcnO1xuICAgICAgICBlbHNlIHRoaXMuZGF0YS50aGVtZSA9IHRoZW1lO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZXR0aW5nO1xuIiwiY29uc3QgUm91dGVyID0gcmVxdWlyZSgnLi9yb3V0ZXInKTtcbmNvbnN0IFBhZ2UgPSByZXF1aXJlKCcuL0NvbXBvbmVudC9QYWdlJyk7XG5cblxuKGZ1bmN0aW9uIGFmdGVyTG9hZCgpIHtcbiAgICBjb25zdCByb3V0ZXIgPSBuZXcgUm91dGVyKCk7XG4gICAgY29uc3QgcGFnZSA9IG5ldyBQYWdlKCcnKTtcblxuICAgIGNvbnN0IFBBR0VfTElTVCA9IFsnaG9tZScsICdhYm91dCcsICdibG9nJ107XG5cbiAgICByb3V0ZXIubWFwKCcvJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9ICcvaG9tZSc7XG4gICAgfSk7XG5cbiAgICByb3V0ZXIubWFwKCcvOnBhZ2VuYW1lJywgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgIGNvbnN0IHsgcGFyYW1zOiB7IHBhZ2VuYW1lIH0gfSA9IHJlcTtcbiAgICAgICAgY29uc29sZS5sb2cocGFnZW5hbWUpO1xuICAgICAgICBpZiAoUEFHRV9MSVNULmluY2x1ZGVzKHBhZ2VuYW1lKSkge1xuICAgICAgICAgICAgcGFnZS5yZXJlbmRlcihwYWdlbmFtZSk7XG4gICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJvdXRlci5tYXAoJy9zZWUtYmxvZy86cG9zdE5hbWUnLCAocmVxLCByZXMpID0+IHtcbiAgICAgICAgcGFnZS5yZXJlbmRlcihgYmxvZy8ke3JlcS5wYXJhbXMucG9zdE5hbWV9YCk7XG4gICAgICAgIHJlcy5lbmQoKTtcbiAgICB9KTtcblxuICAgIHJvdXRlci5tYXAoJy8uKicsIChyZXEsIHJlcykgPT4ge1xuICAgICAgICByZXMucmVuZGVyKCc0MDQuaHRtbCcsIHJlcSk7XG4gICAgICAgIHJlcy5lbmQoKTtcbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcbiAgICAgICAgJCgnYm9keScpLmh0bWwoJycpLmFwcGVuZChwYWdlLnJlbmRlcigpKTtcbiAgICAgICAgcm91dGVyLnJlYWR5KCk7XG4gICAgfSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgKCkgPT4ge1xuICAgICAgICByb3V0ZXIucmVhZHkoKTtcbiAgICB9KTtcbn0oalF1ZXJ5KSk7XG4iLCJjbGFzcyBSb3V0ZXJSZXMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmlzRW5kID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmVuZGVyKHBhZ2UsIGRhdGEpIHtcbiAgICAgICAgdGhpcy5pc0VuZCA9IHRydWU7XG5cbiAgICAgICAgZmV0Y2goYC9wYWdlLyR7cGFnZX1gKVxuICAgICAgICAudGhlbihyZXMgPT4gcmVzLnRleHQoKSlcbiAgICAgICAgLnRoZW4oKHRleHQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHZhckRhdGEgPSBkYXRhIHx8IFtdO1xuICAgICAgICAgICAgbGV0IHRleHRSZW5kZXJlZCA9IHRleHQ7XG5cbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHZhckRhdGEpKSB7XG4gICAgICAgICAgICAgICAgdGV4dFJlbmRlcmVkID0gdGV4dFJlbmRlcmVkLnJlcGxhY2UoYHt7JHtrZXl9fX1gLCB2YXJEYXRhW2tleV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGV4dFJlbmRlcmVkO1xuICAgICAgICB9KS50aGVuKCh0ZXh0KSA9PiB7XG4gICAgICAgICAgICAkKCdib2R5JykuaHRtbCh0ZXh0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZW5kKCkge1xuICAgICAgICB0aGlzLmlzRW5kID0gdHJ1ZTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUm91dGVyUmVzO1xuIiwiY29uc3QgUm91dGVyUmVzID0gcmVxdWlyZSgnLi9yb3V0ZXItcmVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUm91dGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5yb3V0ZSA9IFtdO1xuICAgICAgICB0aGlzLnJlcXVlc3QgPSB7fTtcbiAgICB9XG5cbiAgICByZWFkeSgpIHtcbiAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTCh3aW5kb3cubG9jYXRpb24pO1xuXG4gICAgICAgIGNvbnN0IHsgc2VhcmNoUGFyYW1zLCBwYXRobmFtZSB9ID0gdXJsO1xuICAgICAgICBjb25zdCBzZWFyY2ggPSB7fTtcblxuICAgICAgICBzZWFyY2hQYXJhbXMuZm9yRWFjaCgodmFsLCBrZXkpID0+IHtcbiAgICAgICAgICAgIHNlYXJjaFtrZXldID0gdmFsO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZXF1ZXN0ID0ge1xuICAgICAgICAgICAgdXJsLFxuICAgICAgICAgICAgcGFyYW1zOiB7fSxcbiAgICAgICAgICAgIHNlYXJjaCxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5yZXNwb25zZSA9IG5ldyBSb3V0ZXJSZXMoKTtcblxuICAgICAgICB0aGlzLm1hdGNoKHBhdGhuYW1lKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBtYXAgcmVxdWVzdFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIGxpa2UgYC9hc2QvOmFiYy9gXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgZnVuY3Rpb24gKHJlcXVlc3QsIHJlc3BvbnNlLCBuZXh0KVxuICAgICAqL1xuICAgIG1hcChwYXRoLCBjYWxsYmFjaykge1xuICAgICAgICBjb25zdCByZWdNYXRjaCA9IChuZXcgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy52YXIgPSBbXTtcbiAgICAgICAgICAgIC8vIGNvcHkgZnJvbSBodHRwOi8va3Jhc2ltaXJ0c29uZXYuY29tL2Jsb2cvYXJ0aWNsZS9kZWVwLWRpdmUtaW50by1jbGllbnQtc2lkZS1yb3V0aW5nLW5hdmlnby1wdXNoc3RhdGUtaGFzaFxuICAgICAgICAgICAgdGhpcy5tYXRjaF9wYXRoID0gbmV3IFJlZ0V4cChgXiR7cGF0aC5yZXBsYWNlKC8oOikoXFx3KykvZywgKGZ1bGwsIGRvdHMsIG5hbWUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnZhci5wdXNoKG5hbWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiAnKFteXFxcXC9dKyknO1xuICAgICAgICAgICAgfSl9KD86KD86XFxcXC8kKXwkKWApO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSgpKTtcblxuICAgICAgICB0aGlzLnJvdXRlLnB1c2goeyBwYXRoLCByZWdleDogcmVnTWF0Y2gsIGNhbGxiYWNrIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIGZpbmQgcGF0aCBtYXRjaGVkIGluIHJvdXRlXG4gICAgICogQHJldHVybiB7RnVuY3Rpb24gfCBudWxsfSBjYWxsYmFjayBvZiBtYXBwZWQgcm91dGVcbiAgICAgKi9cbiAgICBhc3luYyBtYXRjaChwYXRoKSB7XG4gICAgICAgIGZvciAoY29uc3Qgcm91dGUgb2YgdGhpcy5yb3V0ZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucmVzcG9uc2UuaXNFbmQpIGJyZWFrO1xuXG4gICAgICAgICAgICBjb25zdCBtYXRjaCA9IHBhdGgubWF0Y2gocm91dGUucmVnZXgubWF0Y2hfcGF0aCk7XG4gICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IG1hdGNoLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdC5wYXJhbXNbcm91dGUucmVnZXgudmFyW2kgLSAxXV0gPSBtYXRjaFtpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYXdhaXQgcm91dGUuY2FsbGJhY2sodGhpcy5yZXF1ZXN0LCB0aGlzLnJlc3BvbnNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG4iXX0=
