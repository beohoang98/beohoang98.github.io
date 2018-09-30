(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Router = require('./router');

const router = new Router();

router.map('/home', (req, res) => {
    $('#site-menu').load('/layout/sidebar.html', () => {
        $('#site-menu a').on('click', (e) => {
            e.preventDefault();
            const page = $(e.target).data('page');
            $('#site-content').load(`/page${page}.html`);
        });
    });
    $('#site-content').load('/page/home.html');
    res.end();
});

router.map('/about', (req, res) => {
    $('#site-content').load('/page/about.html');
    res.end();
});

router.map('/.*', (req, res) => {
    res.render('real404.html', { url: req.url.toString() });
    res.end();
});

(function afterLoad() {
    $(document).ready(() => router.ready());
    $(window).on('popstate', () => router.ready());
}(jQuery));

},{"./router":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
const RouterRes = require('./router-res');

module.exports = class Router {
    constructor() {
        this.route = [];
        this.request = {};
        this.response = new RouterRes();
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

        this.match(pathname);
    }

    /**
     * map request
     * @param {String} path like `/asd/:abc/`
     * @param {Function} callback function (request, response, next)
     */
    map(path, callback) {
        const regMatch = {
            var: [],
            // copy from http://krasimirtsonev.com/blog/article/deep-dive-into-client-side-routing-navigo-pushstate-hash
            match_path: new RegExp(`^${path.replace(/(:)(\w+)/g, function replaceVar(full, dots, name) {
                this.var.push(name);
                return '([^\\/]+)';
            })}(?:(?:\\/$)|$)`),
        };

        this.route.push({ path, regex: regMatch, callback });
    }

    /**
     * @param {string} path find path matched in route
     * @return {Function | null} callback of mapped route
     */
    match(path) {
        for (const route of this.route) {
            if (this.response.isEnd) break;

            const match = path.match(route.regex.match_path);
            if (match) {
                for (let i = 1; i < match.length; i += 1) {
                    this.request.params[route.regex.var[i - 1]] = match[i];
                }
                route.callback(this.request, this.response);
            }
        }
    }
};

},{"./router-res":2}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi5qcyIsInNyYy9yb3V0ZXItcmVzL2luZGV4LmpzIiwic3JjL3JvdXRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBSb3V0ZXIgPSByZXF1aXJlKCcuL3JvdXRlcicpO1xuXG5jb25zdCByb3V0ZXIgPSBuZXcgUm91dGVyKCk7XG5cbnJvdXRlci5tYXAoJy9ob21lJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgJCgnI3NpdGUtbWVudScpLmxvYWQoJy9sYXlvdXQvc2lkZWJhci5odG1sJywgKCkgPT4ge1xuICAgICAgICAkKCcjc2l0ZS1tZW51IGEnKS5vbignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgY29uc3QgcGFnZSA9ICQoZS50YXJnZXQpLmRhdGEoJ3BhZ2UnKTtcbiAgICAgICAgICAgICQoJyNzaXRlLWNvbnRlbnQnKS5sb2FkKGAvcGFnZSR7cGFnZX0uaHRtbGApO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAkKCcjc2l0ZS1jb250ZW50JykubG9hZCgnL3BhZ2UvaG9tZS5odG1sJyk7XG4gICAgcmVzLmVuZCgpO1xufSk7XG5cbnJvdXRlci5tYXAoJy9hYm91dCcsIChyZXEsIHJlcykgPT4ge1xuICAgICQoJyNzaXRlLWNvbnRlbnQnKS5sb2FkKCcvcGFnZS9hYm91dC5odG1sJyk7XG4gICAgcmVzLmVuZCgpO1xufSk7XG5cbnJvdXRlci5tYXAoJy8uKicsIChyZXEsIHJlcykgPT4ge1xuICAgIHJlcy5yZW5kZXIoJ3JlYWw0MDQuaHRtbCcsIHsgdXJsOiByZXEudXJsLnRvU3RyaW5nKCkgfSk7XG4gICAgcmVzLmVuZCgpO1xufSk7XG5cbihmdW5jdGlvbiBhZnRlckxvYWQoKSB7XG4gICAgJChkb2N1bWVudCkucmVhZHkoKCkgPT4gcm91dGVyLnJlYWR5KCkpO1xuICAgICQod2luZG93KS5vbigncG9wc3RhdGUnLCAoKSA9PiByb3V0ZXIucmVhZHkoKSk7XG59KGpRdWVyeSkpO1xuIiwiY2xhc3MgUm91dGVyUmVzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pc0VuZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHJlbmRlcihwYWdlLCBkYXRhKSB7XG4gICAgICAgIHRoaXMuaXNFbmQgPSB0cnVlO1xuXG4gICAgICAgIGZldGNoKGAvcGFnZS8ke3BhZ2V9YClcbiAgICAgICAgLnRoZW4ocmVzID0+IHJlcy50ZXh0KCkpXG4gICAgICAgIC50aGVuKCh0ZXh0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YXJEYXRhID0gZGF0YSB8fCBbXTtcbiAgICAgICAgICAgIGxldCB0ZXh0UmVuZGVyZWQgPSB0ZXh0O1xuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyh2YXJEYXRhKSkge1xuICAgICAgICAgICAgICAgIHRleHRSZW5kZXJlZCA9IHRleHRSZW5kZXJlZC5yZXBsYWNlKGB7eyR7a2V5fX19YCwgdmFyRGF0YVtrZXldKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRleHRSZW5kZXJlZDtcbiAgICAgICAgfSkudGhlbigodGV4dCkgPT4ge1xuICAgICAgICAgICAgJCgnYm9keScpLmh0bWwodGV4dCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGVuZCgpIHtcbiAgICAgICAgdGhpcy5pc0VuZCA9IHRydWU7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJvdXRlclJlcztcbiIsImNvbnN0IFJvdXRlclJlcyA9IHJlcXVpcmUoJy4vcm91dGVyLXJlcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFJvdXRlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMucm91dGUgPSBbXTtcbiAgICAgICAgdGhpcy5yZXF1ZXN0ID0ge307XG4gICAgICAgIHRoaXMucmVzcG9uc2UgPSBuZXcgUm91dGVyUmVzKCk7XG4gICAgfVxuXG4gICAgcmVhZHkoKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uKTtcblxuICAgICAgICBjb25zdCB7IHNlYXJjaFBhcmFtcywgcGF0aG5hbWUgfSA9IHVybDtcbiAgICAgICAgY29uc3Qgc2VhcmNoID0ge307XG5cbiAgICAgICAgc2VhcmNoUGFyYW1zLmZvckVhY2goKHZhbCwga2V5KSA9PiB7XG4gICAgICAgICAgICBzZWFyY2hba2V5XSA9IHZhbDtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucmVxdWVzdCA9IHtcbiAgICAgICAgICAgIHVybCxcbiAgICAgICAgICAgIHBhcmFtczoge30sXG4gICAgICAgICAgICBzZWFyY2gsXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5tYXRjaChwYXRobmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogbWFwIHJlcXVlc3RcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aCBsaWtlIGAvYXNkLzphYmMvYFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIGZ1bmN0aW9uIChyZXF1ZXN0LCByZXNwb25zZSwgbmV4dClcbiAgICAgKi9cbiAgICBtYXAocGF0aCwgY2FsbGJhY2spIHtcbiAgICAgICAgY29uc3QgcmVnTWF0Y2ggPSB7XG4gICAgICAgICAgICB2YXI6IFtdLFxuICAgICAgICAgICAgLy8gY29weSBmcm9tIGh0dHA6Ly9rcmFzaW1pcnRzb25ldi5jb20vYmxvZy9hcnRpY2xlL2RlZXAtZGl2ZS1pbnRvLWNsaWVudC1zaWRlLXJvdXRpbmctbmF2aWdvLXB1c2hzdGF0ZS1oYXNoXG4gICAgICAgICAgICBtYXRjaF9wYXRoOiBuZXcgUmVnRXhwKGBeJHtwYXRoLnJlcGxhY2UoLyg6KShcXHcrKS9nLCBmdW5jdGlvbiByZXBsYWNlVmFyKGZ1bGwsIGRvdHMsIG5hbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZhci5wdXNoKG5hbWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiAnKFteXFxcXC9dKyknO1xuICAgICAgICAgICAgfSl9KD86KD86XFxcXC8kKXwkKWApLFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMucm91dGUucHVzaCh7IHBhdGgsIHJlZ2V4OiByZWdNYXRjaCwgY2FsbGJhY2sgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggZmluZCBwYXRoIG1hdGNoZWQgaW4gcm91dGVcbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbiB8IG51bGx9IGNhbGxiYWNrIG9mIG1hcHBlZCByb3V0ZVxuICAgICAqL1xuICAgIG1hdGNoKHBhdGgpIHtcbiAgICAgICAgZm9yIChjb25zdCByb3V0ZSBvZiB0aGlzLnJvdXRlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5yZXNwb25zZS5pc0VuZCkgYnJlYWs7XG5cbiAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gcGF0aC5tYXRjaChyb3V0ZS5yZWdleC5tYXRjaF9wYXRoKTtcbiAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbWF0Y2gubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0LnBhcmFtc1tyb3V0ZS5yZWdleC52YXJbaSAtIDFdXSA9IG1hdGNoW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByb3V0ZS5jYWxsYmFjayh0aGlzLnJlcXVlc3QsIHRoaXMucmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcbiJdfQ==
