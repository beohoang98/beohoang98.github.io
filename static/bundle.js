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
const Theme = require('../Theme.js');

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
            this.element.removeClass(this.setting.theme);

            let id = Theme.indexOf(this.setting.theme);
            id = (id === Theme.length - 1) ? 0 : id + 1;

            this.setting.theme = Theme[id];

            this.element.addClass(this.setting.theme);
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
        this.content.element.removeClass('fadeIn');
        this.rerender(pageName);
        this.content.element.addClass('fadeIn');
    }

    async rerender(pageName) {
        const res = await this.content.loadAsync(`/page/${pageName}`);
        return res;
    }
}

module.exports = Page;

},{"../../Setting":9,"../Component.js":1,"../Content":2,"../Sidebar":7,"../Theme.js":8}],7:[function(require,module,exports){
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
module.exports = [
    '', // default
    'theme-dark',
    'theme-cappuccino',
    'theme-gryffindor',
    'theme-retro',
];

},{}],9:[function(require,module,exports){
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
        this.data.theme = theme;
    }
}

module.exports = Setting;

},{}],10:[function(require,module,exports){
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
        page.rerender(`blog/${req.params.postName}/`);
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

},{"./Component/Page":6,"./router":12}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{"./router-res":11}]},{},[10])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQ29tcG9uZW50L0NvbXBvbmVudC5qcyIsInNyYy9Db21wb25lbnQvQ29udGVudC9pbmRleC5qcyIsInNyYy9Db21wb25lbnQvTGluay9pbmRleC5qcyIsInNyYy9Db21wb25lbnQvTG9hZGluZy9pbmRleC5qcyIsInNyYy9Db21wb25lbnQvTmF2SXRlbS9pbmRleC5qcyIsInNyYy9Db21wb25lbnQvUGFnZS9pbmRleC5qcyIsInNyYy9Db21wb25lbnQvU2lkZWJhci9pbmRleC5qcyIsInNyYy9Db21wb25lbnQvVGhlbWUuanMiLCJzcmMvU2V0dGluZy9pbmRleC5qcyIsInNyYy9tYWluLmpzIiwic3JjL3JvdXRlci1yZXMvaW5kZXguanMiLCJzcmMvcm91dGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNsYXNzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3Ioc3RyKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9ICQoYDwke3N0cn0vPmApO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudDtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcG9uZW50O1xuIiwiY29uc3QgQ29tcG9uZW50ID0gcmVxdWlyZSgnLi4vQ29tcG9uZW50LmpzJyk7XG5jb25zdCBMb2FkaW5nID0gcmVxdWlyZSgnLi4vTG9hZGluZycpO1xuXG5jbGFzcyBDb250ZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcih1cmwgPSAnJykge1xuICAgICAgICBzdXBlcignZGl2Jyk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRDbGFzcygnc2l0ZS1jb250ZW50JykuYXR0cignaWQnLCAnc2l0ZS1jb250ZW50Jyk7XG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xuXG4gICAgICAgIHRoaXMubG9hZGluZ1NjcmVlbiA9IG5ldyBMb2FkaW5nKCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmQodGhpcy5sb2FkaW5nU2NyZWVuLnJlbmRlcigpKTtcbiAgICB9XG5cbiAgICBsb2FkKHVybCwgY2FsbGJhY2sgPSAoKSA9PiB7fSkge1xuICAgICAgICB0aGlzLmxvYWRpbmdTY3JlZW4uc2hvdygpO1xuXG4gICAgICAgIGZldGNoKHVybClcbiAgICAgICAgLnRoZW4ocmVzID0+IHJlcy50ZXh0KCkpXG4gICAgICAgIC50aGVuKCh0ZXh0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuaHRtbCgnJykuaHRtbCh0ZXh0KTtcblxuICAgICAgICAgICAgdGhpcy5sb2FkaW5nU2NyZWVuID0gbmV3IExvYWRpbmcoKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmQodGhpcy5sb2FkaW5nU2NyZWVuLnJlbmRlcigpKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGxvYWRBc3luYyh1cmwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvYWQodXJsLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb250ZW50O1xuIiwiY29uc3QgQ29tcG9uZW50ID0gcmVxdWlyZSgnLi4vQ29tcG9uZW50LmpzJyk7XG5cbmNsYXNzIExpbmsgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHRleHQgPSAnJykge1xuICAgICAgICBzdXBlcignYScpO1xuICAgICAgICB0aGlzLmNsaWNrRXZlbnQgPSBbXTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkQ2xhc3MoJ25hdi1saW5rJylcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2hyZWYnLCAnIycpXG4gICAgICAgICAgICAgICAgICAgIC50ZXh0KHRleHQpO1xuICAgICAgICB0aGlzLmVsZW1lbnQub24oJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZnVuYyBvZiBBcnJheS5mcm9tKHRoaXMuY2xpY2tFdmVudCkpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGZ1bmMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgZnVuYyhlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uQ2xpY2soZnVuYykge1xuICAgICAgICB0aGlzLmNsaWNrRXZlbnQucHVzaChmdW5jKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTGluaztcbiIsImNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJy4uL0NvbXBvbmVudC5qcycpO1xuXG5jbGFzcyBMb2FkaW5nIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoJ2RpdicpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkQ2xhc3MoJ2xvYWRpbmcnKS5hdHRyKCdpZCcsICdzaXRlLWxvYWRpbmcnKS5oaWRlKCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5odG1sKGBcbiAgICAgICAgPGRpdj48L2Rpdj5cbiAgICAgICAgYCk7XG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZhZGVJbigyMDApO1xuICAgIH1cblxuICAgIGhpZGUoY2FsbGJhY2sgPSAoKSA9PiB7fSkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5mYWRlT3V0KDIwMCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMb2FkaW5nO1xuIiwiY29uc3QgQ29tcG9uZW50ID0gcmVxdWlyZSgnLi4vQ29tcG9uZW50LmpzJyk7XG5jb25zdCBMaW5rID0gcmVxdWlyZSgnLi4vTGluaycpO1xuXG5jbGFzcyBOYXZJdGVtIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcih0aXRsZSA9ICcnLCBpY29uQ2xhc3MgPSAnJykge1xuICAgICAgICBzdXBlcignbGknKTtcbiAgICAgICAgdGhpcy5saW5rID0gbmV3IExpbmsoYFxcdCR7dGl0bGV9YCk7XG4gICAgICAgIHRoaXMubGluay5lbGVtZW50LnByZXBlbmQoJCgnPGkvPicpLmFkZENsYXNzKGljb25DbGFzcykpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkQ2xhc3MoJ25hdi1pdGVtJyk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmQodGhpcy5saW5rLnJlbmRlcigpKTtcbiAgICB9XG5cbiAgICBvbkNsaWNrKGZ1bmMpIHtcbiAgICAgICAgdGhpcy5saW5rLm9uQ2xpY2soZnVuYyk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5hdkl0ZW07XG4iLCJjb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCcuLi9Db21wb25lbnQuanMnKTtcbmNvbnN0IFNpZGVCYXIgPSByZXF1aXJlKCcuLi9TaWRlYmFyJyk7XG5jb25zdCBDb250ZW50ID0gcmVxdWlyZSgnLi4vQ29udGVudCcpO1xuY29uc3QgU2V0dGluZyA9IHJlcXVpcmUoJy4uLy4uL1NldHRpbmcnKTtcbmNvbnN0IFRoZW1lID0gcmVxdWlyZSgnLi4vVGhlbWUuanMnKTtcblxuY2xhc3MgUGFnZSBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCdkaXYnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZENsYXNzKCdzaXRlJykuYXR0cignaWQnLCAnc2l0ZScpO1xuXG4gICAgICAgIHRoaXMuc2V0dGluZyA9IG5ldyBTZXR0aW5nKCk7XG4gICAgICAgIHRoaXMuc2V0dGluZy5sb2FkKCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRDbGFzcyh0aGlzLnNldHRpbmcudGhlbWUpO1xuXG4gICAgICAgIHRoaXMuc2lkZUJhciA9IG5ldyBTaWRlQmFyKCk7XG4gICAgICAgIHRoaXMuY29udGVudCA9IG5ldyBDb250ZW50KCk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZCh0aGlzLnNpZGVCYXIucmVuZGVyKCkpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kKHRoaXMuY29udGVudC5yZW5kZXIoKSk7XG5cbiAgICAgICAgdGhpcy5oYW5kbGVNZW51KCk7XG4gICAgfVxuXG4gICAgaGFuZGxlTWVudSgpIHtcbiAgICAgICAgdGhpcy5zaWRlQmFyLm1lbnUuY2hhbmdlVGhlbWUub25DbGljaygoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKHRoaXMuc2V0dGluZy50aGVtZSk7XG5cbiAgICAgICAgICAgIGxldCBpZCA9IFRoZW1lLmluZGV4T2YodGhpcy5zZXR0aW5nLnRoZW1lKTtcbiAgICAgICAgICAgIGlkID0gKGlkID09PSBUaGVtZS5sZW5ndGggLSAxKSA/IDAgOiBpZCArIDE7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0dGluZy50aGVtZSA9IFRoZW1lW2lkXTtcblxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFkZENsYXNzKHRoaXMuc2V0dGluZy50aGVtZSk7XG4gICAgICAgICAgICB0aGlzLnNldHRpbmcuc2F2ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNpZGVCYXIubWVudS5ob21lUGFnZS5vbkNsaWNrKChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLnN3aXRjaFBhZ2UoJ2hvbWUnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zaWRlQmFyLm1lbnUuYWJvdXRQYWdlLm9uQ2xpY2soKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuc3dpdGNoUGFnZSgnYWJvdXQnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zaWRlQmFyLm1lbnUuYmxvZ1BhZ2Uub25DbGljaygoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5zd2l0Y2hQYWdlKCdibG9nJyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHN3aXRjaFBhZ2UocGFnZU5hbWUpIHtcbiAgICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKCcnLCAnJywgYC8ke3BhZ2VOYW1lfWApO1xuICAgICAgICB0aGlzLmNvbnRlbnQuZWxlbWVudC5yZW1vdmVDbGFzcygnZmFkZUluJyk7XG4gICAgICAgIHRoaXMucmVyZW5kZXIocGFnZU5hbWUpO1xuICAgICAgICB0aGlzLmNvbnRlbnQuZWxlbWVudC5hZGRDbGFzcygnZmFkZUluJyk7XG4gICAgfVxuXG4gICAgYXN5bmMgcmVyZW5kZXIocGFnZU5hbWUpIHtcbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgdGhpcy5jb250ZW50LmxvYWRBc3luYyhgL3BhZ2UvJHtwYWdlTmFtZX1gKTtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGFnZTtcbiIsImNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJy4uL0NvbXBvbmVudC5qcycpO1xuY29uc3QgTmF2SXRlbSA9IHJlcXVpcmUoJy4uL05hdkl0ZW0nKTtcblxuY2xhc3MgU2lkZWJhciBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCd1bCcpO1xuICAgICAgICB0aGlzLmVsZW1lbnRcbiAgICAgICAgLmFkZENsYXNzKCdzaXRlLXNpZGViYXIgbmF2YmFyLW5hdiBmbGV4LWNvbHVtbicpXG4gICAgICAgIC5hdHRyKCdpZCcsICdzaXRlLW1lbnUnKTtcblxuICAgICAgICB0aGlzLm1lbnUgPSB7XG4gICAgICAgICAgICBob21lUGFnZTogbmV3IE5hdkl0ZW0oJ0hPTUUnLCAnZmFzIGZhLWhvbWUnKSxcbiAgICAgICAgICAgIGFib3V0UGFnZTogbmV3IE5hdkl0ZW0oJ0FCT1VUJywgJ2ZhcyBmYS1pbmZvLWNpcmNsZScpLFxuICAgICAgICAgICAgYmxvZ1BhZ2U6IG5ldyBOYXZJdGVtKCdCTE9HJywgJ2ZhcyBmYS1wZW4nKSxcbiAgICAgICAgICAgIGNoYW5nZVRoZW1lOiBuZXcgTmF2SXRlbSgnQ0hBTkdFIFRIRU1FJywgJ2ZhcyBmYS1jb2cnKSxcbiAgICAgICAgfTtcblxuICAgICAgICBmb3IgKGNvbnN0IG5hdk5hbWUgb2YgT2JqZWN0LmtleXModGhpcy5tZW51KSkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZCh0aGlzLm1lbnVbbmF2TmFtZV0ucmVuZGVyKCkpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNpZGViYXI7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFtcbiAgICAnJywgLy8gZGVmYXVsdFxuICAgICd0aGVtZS1kYXJrJyxcbiAgICAndGhlbWUtY2FwcHVjY2lubycsXG4gICAgJ3RoZW1lLWdyeWZmaW5kb3InLFxuICAgICd0aGVtZS1yZXRybycsXG5dO1xuIiwiY2xhc3MgU2V0dGluZyB7XG4gICAgbG9hZCgpIHtcbiAgICAgICAgdGhpcy5kYXRhID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2V0dGluZycpKSB8fCB7fTtcbiAgICB9XG5cbiAgICBzYXZlKCkge1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc2V0dGluZycsIEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YSkpO1xuICAgIH1cblxuICAgIGdldCB0aGVtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS50aGVtZSB8fCAnJztcbiAgICB9XG5cbiAgICBzZXQgdGhlbWUodGhlbWUpIHtcbiAgICAgICAgdGhpcy5kYXRhLnRoZW1lID0gdGhlbWU7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNldHRpbmc7XG4iLCJjb25zdCBSb3V0ZXIgPSByZXF1aXJlKCcuL3JvdXRlcicpO1xuY29uc3QgUGFnZSA9IHJlcXVpcmUoJy4vQ29tcG9uZW50L1BhZ2UnKTtcblxuXG4oZnVuY3Rpb24gYWZ0ZXJMb2FkKCQpIHtcbiAgICBjb25zdCByb3V0ZXIgPSBuZXcgUm91dGVyKCk7XG4gICAgY29uc3QgcGFnZSA9IG5ldyBQYWdlKCcnKTtcblxuICAgIGNvbnN0IFBBR0VfTElTVCA9IFsnaG9tZScsICdhYm91dCcsICdibG9nJ107XG5cbiAgICByb3V0ZXIubWFwKCcvJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9ICcvaG9tZSc7XG4gICAgfSk7XG5cbiAgICByb3V0ZXIubWFwKCcvOnBhZ2VuYW1lJywgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgIGNvbnN0IHsgcGFyYW1zOiB7IHBhZ2VuYW1lIH0gfSA9IHJlcTtcbiAgICAgICAgY29uc29sZS5sb2cocGFnZW5hbWUpO1xuICAgICAgICBpZiAoUEFHRV9MSVNULmluY2x1ZGVzKHBhZ2VuYW1lKSkge1xuICAgICAgICAgICAgcGFnZS5yZXJlbmRlcihwYWdlbmFtZSk7XG4gICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJvdXRlci5tYXAoJy9zZWUtYmxvZy86cG9zdE5hbWUnLCAocmVxLCByZXMpID0+IHtcbiAgICAgICAgcGFnZS5yZXJlbmRlcihgYmxvZy8ke3JlcS5wYXJhbXMucG9zdE5hbWV9L2ApO1xuICAgICAgICByZXMuZW5kKCk7XG4gICAgfSk7XG5cbiAgICByb3V0ZXIubWFwKCcvLionLCAocmVxLCByZXMpID0+IHtcbiAgICAgICAgcmVzLnJlbmRlcignNDA0Lmh0bWwnLCByZXEpO1xuICAgICAgICByZXMuZW5kKCk7XG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeSgoKSA9PiB7XG4gICAgICAgIGxldCBvbGRTY3JvbGwgPSAwO1xuXG4gICAgICAgICQod2luZG93KS5vbignc2Nyb2xsJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXdTY3JvbGwgPSArJChkb2N1bWVudCkuc2Nyb2xsVG9wKCk7XG4gICAgICAgICAgICBpZiAobmV3U2Nyb2xsID4gb2xkU2Nyb2xsKSB7XG4gICAgICAgICAgICAgICAgJCgnLnNpdGUtc2lkZWJhcicpLmFkZENsYXNzKCdvbnNjcm9sbGRvd24nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnLnNpdGUtc2lkZWJhcicpLnJlbW92ZUNsYXNzKCdvbnNjcm9sbGRvd24nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb2xkU2Nyb2xsID0gbmV3U2Nyb2xsO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKCdib2R5JykuaHRtbCgnJykuYXBwZW5kKHBhZ2UucmVuZGVyKCkpO1xuICAgICAgICByb3V0ZXIucmVhZHkoKTtcbiAgICB9KTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsICgpID0+IHtcbiAgICAgICAgcm91dGVyLnJlYWR5KCk7XG4gICAgfSk7XG59KGpRdWVyeSkpO1xuIiwiY2xhc3MgUm91dGVyUmVzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pc0VuZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHJlbmRlcihwYWdlLCBkYXRhKSB7XG4gICAgICAgIHRoaXMuaXNFbmQgPSB0cnVlO1xuXG4gICAgICAgIGZldGNoKGAvcGFnZS8ke3BhZ2V9YClcbiAgICAgICAgLnRoZW4ocmVzID0+IHJlcy50ZXh0KCkpXG4gICAgICAgIC50aGVuKCh0ZXh0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YXJEYXRhID0gZGF0YSB8fCBbXTtcbiAgICAgICAgICAgIGxldCB0ZXh0UmVuZGVyZWQgPSB0ZXh0O1xuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyh2YXJEYXRhKSkge1xuICAgICAgICAgICAgICAgIHRleHRSZW5kZXJlZCA9IHRleHRSZW5kZXJlZC5yZXBsYWNlKGB7eyR7a2V5fX19YCwgdmFyRGF0YVtrZXldKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRleHRSZW5kZXJlZDtcbiAgICAgICAgfSkudGhlbigodGV4dCkgPT4ge1xuICAgICAgICAgICAgJCgnYm9keScpLmh0bWwodGV4dCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGVuZCgpIHtcbiAgICAgICAgdGhpcy5pc0VuZCA9IHRydWU7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJvdXRlclJlcztcbiIsImNvbnN0IFJvdXRlclJlcyA9IHJlcXVpcmUoJy4vcm91dGVyLXJlcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFJvdXRlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMucm91dGUgPSBbXTtcbiAgICAgICAgdGhpcy5yZXF1ZXN0ID0ge307XG4gICAgfVxuXG4gICAgcmVhZHkoKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uKTtcblxuICAgICAgICBjb25zdCB7IHNlYXJjaFBhcmFtcywgcGF0aG5hbWUgfSA9IHVybDtcbiAgICAgICAgY29uc3Qgc2VhcmNoID0ge307XG5cbiAgICAgICAgc2VhcmNoUGFyYW1zLmZvckVhY2goKHZhbCwga2V5KSA9PiB7XG4gICAgICAgICAgICBzZWFyY2hba2V5XSA9IHZhbDtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucmVxdWVzdCA9IHtcbiAgICAgICAgICAgIHVybCxcbiAgICAgICAgICAgIHBhcmFtczoge30sXG4gICAgICAgICAgICBzZWFyY2gsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMucmVzcG9uc2UgPSBuZXcgUm91dGVyUmVzKCk7XG5cbiAgICAgICAgdGhpcy5tYXRjaChwYXRobmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogbWFwIHJlcXVlc3RcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aCBsaWtlIGAvYXNkLzphYmMvYFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIGZ1bmN0aW9uIChyZXF1ZXN0LCByZXNwb25zZSwgbmV4dClcbiAgICAgKi9cbiAgICBtYXAocGF0aCwgY2FsbGJhY2spIHtcbiAgICAgICAgY29uc3QgcmVnTWF0Y2ggPSAobmV3IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudmFyID0gW107XG4gICAgICAgICAgICAvLyBjb3B5IGZyb20gaHR0cDovL2tyYXNpbWlydHNvbmV2LmNvbS9ibG9nL2FydGljbGUvZGVlcC1kaXZlLWludG8tY2xpZW50LXNpZGUtcm91dGluZy1uYXZpZ28tcHVzaHN0YXRlLWhhc2hcbiAgICAgICAgICAgIHRoaXMubWF0Y2hfcGF0aCA9IG5ldyBSZWdFeHAoYF4ke3BhdGgucmVwbGFjZSgvKDopKFxcdyspL2csIChmdWxsLCBkb3RzLCBuYW1lKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy52YXIucHVzaChuYW1lKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyhbXlxcXFwvXSspJztcbiAgICAgICAgICAgIH0pfSg/Oig/OlxcXFwvJCl8JClgKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0oKSk7XG5cbiAgICAgICAgdGhpcy5yb3V0ZS5wdXNoKHsgcGF0aCwgcmVnZXg6IHJlZ01hdGNoLCBjYWxsYmFjayB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCBmaW5kIHBhdGggbWF0Y2hlZCBpbiByb3V0ZVxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9uIHwgbnVsbH0gY2FsbGJhY2sgb2YgbWFwcGVkIHJvdXRlXG4gICAgICovXG4gICAgYXN5bmMgbWF0Y2gocGF0aCkge1xuICAgICAgICBmb3IgKGNvbnN0IHJvdXRlIG9mIHRoaXMucm91dGUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnJlc3BvbnNlLmlzRW5kKSBicmVhaztcblxuICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBwYXRoLm1hdGNoKHJvdXRlLnJlZ2V4Lm1hdGNoX3BhdGgpO1xuICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBtYXRjaC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3QucGFyYW1zW3JvdXRlLnJlZ2V4LnZhcltpIC0gMV1dID0gbWF0Y2hbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGF3YWl0IHJvdXRlLmNhbGxiYWNrKHRoaXMucmVxdWVzdCwgdGhpcy5yZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuIl19
