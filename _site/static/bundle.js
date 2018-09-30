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

const router = new Router();
const page = new Page('');

const PAGE_LIST = ['home', 'about', 'blog'];

router.map('/:pagename', async (req, res) => {
    const { params: { pagename } } = req;
    console.log(pagename);
    if (PAGE_LIST.includes(pagename)) {
        page.rerender(pagename);
        res.end();
    }
});

router.map('/.*', (req, res) => {
    res.render('404.html', req);
    res.end();
});

(function afterLoad() {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQ29tcG9uZW50L0NvbXBvbmVudC5qcyIsInNyYy9Db21wb25lbnQvQ29udGVudC9pbmRleC5qcyIsInNyYy9Db21wb25lbnQvTGluay9pbmRleC5qcyIsInNyYy9Db21wb25lbnQvTG9hZGluZy9pbmRleC5qcyIsInNyYy9Db21wb25lbnQvTmF2SXRlbS9pbmRleC5qcyIsInNyYy9Db21wb25lbnQvUGFnZS9pbmRleC5qcyIsInNyYy9Db21wb25lbnQvU2lkZWJhci9pbmRleC5qcyIsInNyYy9TZXR0aW5nL2luZGV4LmpzIiwic3JjL21haW4uanMiLCJzcmMvcm91dGVyLXJlcy9pbmRleC5qcyIsInNyYy9yb3V0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY2xhc3MgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcihzdHIpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gJChgPCR7c3RyfS8+YCk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50O1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb21wb25lbnQ7XG4iLCJjb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCcuLi9Db21wb25lbnQuanMnKTtcbmNvbnN0IExvYWRpbmcgPSByZXF1aXJlKCcuLi9Mb2FkaW5nJyk7XG5cbmNsYXNzIENvbnRlbnQgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHVybCA9ICcnKSB7XG4gICAgICAgIHN1cGVyKCdkaXYnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZENsYXNzKCdzaXRlLWNvbnRlbnQnKS5hdHRyKCdpZCcsICdzaXRlLWNvbnRlbnQnKTtcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XG5cbiAgICAgICAgdGhpcy5sb2FkaW5nU2NyZWVuID0gbmV3IExvYWRpbmcoKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZCh0aGlzLmxvYWRpbmdTY3JlZW4ucmVuZGVyKCkpO1xuICAgIH1cblxuICAgIGxvYWQodXJsLCBjYWxsYmFjayA9ICgpID0+IHt9KSB7XG4gICAgICAgIHRoaXMubG9hZGluZ1NjcmVlbi5zaG93KCk7XG5cbiAgICAgICAgZmV0Y2godXJsKVxuICAgICAgICAudGhlbihyZXMgPT4gcmVzLnRleHQoKSlcbiAgICAgICAgLnRoZW4oKHRleHQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5odG1sKCcnKS5odG1sKHRleHQpO1xuXG4gICAgICAgICAgICB0aGlzLmxvYWRpbmdTY3JlZW4gPSBuZXcgTG9hZGluZygpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZCh0aGlzLmxvYWRpbmdTY3JlZW4ucmVuZGVyKCkpO1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbG9hZEFzeW5jKHVybCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHRoaXMubG9hZCh1cmwsICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRlbnQ7XG4iLCJjb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCcuLi9Db21wb25lbnQuanMnKTtcblxuY2xhc3MgTGluayBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IodGV4dCA9ICcnKSB7XG4gICAgICAgIHN1cGVyKCdhJyk7XG4gICAgICAgIHRoaXMuY2xpY2tFdmVudCA9IFtdO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRDbGFzcygnbmF2LWxpbmsnKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignaHJlZicsICcjJylcbiAgICAgICAgICAgICAgICAgICAgLnRleHQodGV4dCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5vbignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgZm9yIChjb25zdCBmdW5jIG9mIEFycmF5LmZyb20odGhpcy5jbGlja0V2ZW50KSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZnVuYyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBmdW5jKGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb25DbGljayhmdW5jKSB7XG4gICAgICAgIHRoaXMuY2xpY2tFdmVudC5wdXNoKGZ1bmMpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMaW5rO1xuIiwiY29uc3QgQ29tcG9uZW50ID0gcmVxdWlyZSgnLi4vQ29tcG9uZW50LmpzJyk7XG5cbmNsYXNzIExvYWRpbmcgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcignZGl2Jyk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRDbGFzcygnbG9hZGluZycpLmF0dHIoJ2lkJywgJ3NpdGUtbG9hZGluZycpLmhpZGUoKTtcbiAgICAgICAgdGhpcy5lbGVtZW50Lmh0bWwoYFxuICAgICAgICA8ZGl2PjwvZGl2PlxuICAgICAgICBgKTtcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmFkZUluKDIwMCk7XG4gICAgfVxuXG4gICAgaGlkZShjYWxsYmFjayA9ICgpID0+IHt9KSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmZhZGVPdXQoMjAwLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExvYWRpbmc7XG4iLCJjb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCcuLi9Db21wb25lbnQuanMnKTtcbmNvbnN0IExpbmsgPSByZXF1aXJlKCcuLi9MaW5rJyk7XG5cbmNsYXNzIE5hdkl0ZW0gZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHRpdGxlID0gJycpIHtcbiAgICAgICAgc3VwZXIoJ2xpJyk7XG4gICAgICAgIHRoaXMubGluayA9IG5ldyBMaW5rKHRpdGxlKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZENsYXNzKCduYXYtaXRlbScpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kKHRoaXMubGluay5yZW5kZXIoKSk7XG4gICAgfVxuXG4gICAgb25DbGljayhmdW5jKSB7XG4gICAgICAgIHRoaXMubGluay5vbkNsaWNrKGZ1bmMpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOYXZJdGVtO1xuIiwiY29uc3QgQ29tcG9uZW50ID0gcmVxdWlyZSgnLi4vQ29tcG9uZW50LmpzJyk7XG5jb25zdCBTaWRlQmFyID0gcmVxdWlyZSgnLi4vU2lkZWJhcicpO1xuY29uc3QgQ29udGVudCA9IHJlcXVpcmUoJy4uL0NvbnRlbnQnKTtcbmNvbnN0IFNldHRpbmcgPSByZXF1aXJlKCcuLi8uLi9TZXR0aW5nJyk7XG5cbmNsYXNzIFBhZ2UgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcignZGl2Jyk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRDbGFzcygnc2l0ZScpLmF0dHIoJ2lkJywgJ3NpdGUnKTtcblxuICAgICAgICB0aGlzLnNldHRpbmcgPSBuZXcgU2V0dGluZygpO1xuICAgICAgICB0aGlzLnNldHRpbmcubG9hZCgpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkQ2xhc3ModGhpcy5zZXR0aW5nLnRoZW1lKTtcblxuICAgICAgICB0aGlzLnNpZGVCYXIgPSBuZXcgU2lkZUJhcigpO1xuICAgICAgICB0aGlzLmNvbnRlbnQgPSBuZXcgQ29udGVudCgpO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmQodGhpcy5zaWRlQmFyLnJlbmRlcigpKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZCh0aGlzLmNvbnRlbnQucmVuZGVyKCkpO1xuXG4gICAgICAgIHRoaXMuaGFuZGxlTWVudSgpO1xuICAgIH1cblxuICAgIGhhbmRsZU1lbnUoKSB7XG4gICAgICAgIHRoaXMuc2lkZUJhci5tZW51LmNoYW5nZVRoZW1lLm9uQ2xpY2soKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC50b2dnbGVDbGFzcygndGhlbWUtZGFyaycpO1xuICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZy50aGVtZSAhPT0gJ3RoZW1lLWRhcmsnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5nLnRoZW1lID0gJ3RoZW1lLWRhcmsnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmcudGhlbWUgPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2V0dGluZy5zYXZlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2lkZUJhci5tZW51LmhvbWVQYWdlLm9uQ2xpY2soKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuc3dpdGNoUGFnZSgnaG9tZScpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNpZGVCYXIubWVudS5hYm91dFBhZ2Uub25DbGljaygoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5zd2l0Y2hQYWdlKCdhYm91dCcpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNpZGVCYXIubWVudS5ibG9nUGFnZS5vbkNsaWNrKChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLnN3aXRjaFBhZ2UoJ2Jsb2cnKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3dpdGNoUGFnZShwYWdlTmFtZSkge1xuICAgICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoJycsICcnLCBgLyR7cGFnZU5hbWV9YCk7XG4gICAgICAgIHRoaXMucmVyZW5kZXIocGFnZU5hbWUpO1xuICAgIH1cblxuICAgIGFzeW5jIHJlcmVuZGVyKHBhZ2VOYW1lKSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IHRoaXMuY29udGVudC5sb2FkQXN5bmMoYC9wYWdlLyR7cGFnZU5hbWV9YCk7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBhZ2U7XG4iLCJjb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCcuLi9Db21wb25lbnQuanMnKTtcbmNvbnN0IE5hdkl0ZW0gPSByZXF1aXJlKCcuLi9OYXZJdGVtJyk7XG5cbmNsYXNzIFNpZGViYXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigndWwnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50XG4gICAgICAgIC5hZGRDbGFzcygnc2l0ZS1zaWRlYmFyIG5hdmJhci1uYXYgZmxleC1jb2x1bW4nKVxuICAgICAgICAuYXR0cignaWQnLCAnc2l0ZS1tZW51Jyk7XG5cbiAgICAgICAgdGhpcy5tZW51ID0ge1xuICAgICAgICAgICAgaG9tZVBhZ2U6IG5ldyBOYXZJdGVtKCdIT01FJyksXG4gICAgICAgICAgICBhYm91dFBhZ2U6IG5ldyBOYXZJdGVtKCdBQk9VVCcpLFxuICAgICAgICAgICAgYmxvZ1BhZ2U6IG5ldyBOYXZJdGVtKCdCTE9HJyksXG4gICAgICAgICAgICBjaGFuZ2VUaGVtZTogbmV3IE5hdkl0ZW0oJ0NIQU5HRSBUSEVNRScpLFxuICAgICAgICB9O1xuXG4gICAgICAgIGZvciAoY29uc3QgbmF2TmFtZSBvZiBPYmplY3Qua2V5cyh0aGlzLm1lbnUpKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kKHRoaXMubWVudVtuYXZOYW1lXS5yZW5kZXIoKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2lkZWJhcjtcbiIsImNsYXNzIFNldHRpbmcge1xuICAgIGxvYWQoKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NldHRpbmcnKSkgfHwge307XG4gICAgfVxuXG4gICAgc2F2ZSgpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3NldHRpbmcnLCBKU09OLnN0cmluZ2lmeSh0aGlzLmRhdGEpKTtcbiAgICB9XG5cbiAgICBnZXQgdGhlbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEudGhlbWUgfHwgJyc7XG4gICAgfVxuXG4gICAgc2V0IHRoZW1lKHRoZW1lKSB7XG4gICAgICAgIGlmICh0aGVtZSAhPT0gJ3RoZW1lLWRhcmsnKSB0aGlzLmRhdGEudGhlbWUgPSAnJztcbiAgICAgICAgZWxzZSB0aGlzLmRhdGEudGhlbWUgPSB0aGVtZTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2V0dGluZztcbiIsImNvbnN0IFJvdXRlciA9IHJlcXVpcmUoJy4vcm91dGVyJyk7XG5jb25zdCBQYWdlID0gcmVxdWlyZSgnLi9Db21wb25lbnQvUGFnZScpO1xuXG5jb25zdCByb3V0ZXIgPSBuZXcgUm91dGVyKCk7XG5jb25zdCBwYWdlID0gbmV3IFBhZ2UoJycpO1xuXG5jb25zdCBQQUdFX0xJU1QgPSBbJ2hvbWUnLCAnYWJvdXQnLCAnYmxvZyddO1xuXG5yb3V0ZXIubWFwKCcvOnBhZ2VuYW1lJywgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgY29uc3QgeyBwYXJhbXM6IHsgcGFnZW5hbWUgfSB9ID0gcmVxO1xuICAgIGNvbnNvbGUubG9nKHBhZ2VuYW1lKTtcbiAgICBpZiAoUEFHRV9MSVNULmluY2x1ZGVzKHBhZ2VuYW1lKSkge1xuICAgICAgICBwYWdlLnJlcmVuZGVyKHBhZ2VuYW1lKTtcbiAgICAgICAgcmVzLmVuZCgpO1xuICAgIH1cbn0pO1xuXG5yb3V0ZXIubWFwKCcvLionLCAocmVxLCByZXMpID0+IHtcbiAgICByZXMucmVuZGVyKCc0MDQuaHRtbCcsIHJlcSk7XG4gICAgcmVzLmVuZCgpO1xufSk7XG5cbihmdW5jdGlvbiBhZnRlckxvYWQoKSB7XG4gICAgJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xuICAgICAgICAkKCdib2R5JykuaHRtbCgnJykuYXBwZW5kKHBhZ2UucmVuZGVyKCkpO1xuICAgICAgICByb3V0ZXIucmVhZHkoKTtcbiAgICB9KTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCAoKSA9PiB7XG4gICAgICAgIHJvdXRlci5yZWFkeSgpO1xuICAgIH0pO1xufShqUXVlcnkpKTtcbiIsImNsYXNzIFJvdXRlclJlcyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaXNFbmQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZW5kZXIocGFnZSwgZGF0YSkge1xuICAgICAgICB0aGlzLmlzRW5kID0gdHJ1ZTtcblxuICAgICAgICBmZXRjaChgL3BhZ2UvJHtwYWdlfWApXG4gICAgICAgIC50aGVuKHJlcyA9PiByZXMudGV4dCgpKVxuICAgICAgICAudGhlbigodGV4dCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdmFyRGF0YSA9IGRhdGEgfHwgW107XG4gICAgICAgICAgICBsZXQgdGV4dFJlbmRlcmVkID0gdGV4dDtcblxuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXModmFyRGF0YSkpIHtcbiAgICAgICAgICAgICAgICB0ZXh0UmVuZGVyZWQgPSB0ZXh0UmVuZGVyZWQucmVwbGFjZShge3ske2tleX19fWAsIHZhckRhdGFba2V5XSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0ZXh0UmVuZGVyZWQ7XG4gICAgICAgIH0pLnRoZW4oKHRleHQpID0+IHtcbiAgICAgICAgICAgICQoJ2JvZHknKS5odG1sKHRleHQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBlbmQoKSB7XG4gICAgICAgIHRoaXMuaXNFbmQgPSB0cnVlO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSb3V0ZXJSZXM7XG4iLCJjb25zdCBSb3V0ZXJSZXMgPSByZXF1aXJlKCcuL3JvdXRlci1yZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBSb3V0ZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnJvdXRlID0gW107XG4gICAgICAgIHRoaXMucmVxdWVzdCA9IHt9O1xuICAgIH1cblxuICAgIHJlYWR5KCkge1xuICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKHdpbmRvdy5sb2NhdGlvbik7XG5cbiAgICAgICAgY29uc3QgeyBzZWFyY2hQYXJhbXMsIHBhdGhuYW1lIH0gPSB1cmw7XG4gICAgICAgIGNvbnN0IHNlYXJjaCA9IHt9O1xuXG4gICAgICAgIHNlYXJjaFBhcmFtcy5mb3JFYWNoKCh2YWwsIGtleSkgPT4ge1xuICAgICAgICAgICAgc2VhcmNoW2tleV0gPSB2YWw7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJlcXVlc3QgPSB7XG4gICAgICAgICAgICB1cmwsXG4gICAgICAgICAgICBwYXJhbXM6IHt9LFxuICAgICAgICAgICAgc2VhcmNoLFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnJlc3BvbnNlID0gbmV3IFJvdXRlclJlcygpO1xuXG4gICAgICAgIHRoaXMubWF0Y2gocGF0aG5hbWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG1hcCByZXF1ZXN0XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGggbGlrZSBgL2FzZC86YWJjL2BcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBmdW5jdGlvbiAocmVxdWVzdCwgcmVzcG9uc2UsIG5leHQpXG4gICAgICovXG4gICAgbWFwKHBhdGgsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNvbnN0IHJlZ01hdGNoID0gKG5ldyBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnZhciA9IFtdO1xuICAgICAgICAgICAgLy8gY29weSBmcm9tIGh0dHA6Ly9rcmFzaW1pcnRzb25ldi5jb20vYmxvZy9hcnRpY2xlL2RlZXAtZGl2ZS1pbnRvLWNsaWVudC1zaWRlLXJvdXRpbmctbmF2aWdvLXB1c2hzdGF0ZS1oYXNoXG4gICAgICAgICAgICB0aGlzLm1hdGNoX3BhdGggPSBuZXcgUmVnRXhwKGBeJHtwYXRoLnJlcGxhY2UoLyg6KShcXHcrKS9nLCAoZnVsbCwgZG90cywgbmFtZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudmFyLnB1c2gobmFtZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcoW15cXFxcL10rKSc7XG4gICAgICAgICAgICB9KX0oPzooPzpcXFxcLyQpfCQpYCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9KCkpO1xuXG4gICAgICAgIHRoaXMucm91dGUucHVzaCh7IHBhdGgsIHJlZ2V4OiByZWdNYXRjaCwgY2FsbGJhY2sgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggZmluZCBwYXRoIG1hdGNoZWQgaW4gcm91dGVcbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbiB8IG51bGx9IGNhbGxiYWNrIG9mIG1hcHBlZCByb3V0ZVxuICAgICAqL1xuICAgIGFzeW5jIG1hdGNoKHBhdGgpIHtcbiAgICAgICAgZm9yIChjb25zdCByb3V0ZSBvZiB0aGlzLnJvdXRlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5yZXNwb25zZS5pc0VuZCkgYnJlYWs7XG5cbiAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gcGF0aC5tYXRjaChyb3V0ZS5yZWdleC5tYXRjaF9wYXRoKTtcbiAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbWF0Y2gubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0LnBhcmFtc1tyb3V0ZS5yZWdleC52YXJbaSAtIDFdXSA9IG1hdGNoW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhd2FpdCByb3V0ZS5jYWxsYmFjayh0aGlzLnJlcXVlc3QsIHRoaXMucmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcbiJdfQ==
