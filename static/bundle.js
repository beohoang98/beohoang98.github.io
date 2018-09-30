(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Router = require("./router");
const router = new Router();

router.map("/home", (req, res) => {
    console.log(req);
    res.render("home.html", {
        id: req.params.id,
        name: req.search.name
    });
});

router.map("/about", (req, res) => {
    res.render("about.html");
});

router.map("/.*", (req, res) => {
    res.render("real404.html", {
        url: req.url
    });
});

(function() {
    $(document).ready(function() {
        router.ready();
    });

    $(window).on("popstate", function(event) {
        router.ready();
    });
})(jQuery);

},{"./router":3}],2:[function(require,module,exports){
class RouterRes {
    constructor() {
        this.isEnd = false;
    }

    render(page, data) {
        this.isEnd = true;

        fetch("/page/" + page)
        .then(res=>res.text())
        .then(text=>{
            data = data || [];

            for (const key of Object.keys(data)) {
                text = text.replace("{{" + key + "}}", data[key]);
            }

            return text;
        }).then(text=>{
            $("body").html(text);
        });
    }

    end() {
        this.isEnd = true;
    } 
}

module.exports = RouterRes;
},{}],3:[function(require,module,exports){
const RouterRes = require("./router-res");

module.exports = class Router {
    constructor() {
        this.route = [];
    }

    ready() {
        const path = window.location;
        this._match(path);
    }
    /**
     * map request
     * @param {String} path like `/asd/:abc/`
     * @param {Function} callback function (request, response, next)
     */
    map(path, callback) {
        const regMatch = function () {
            this.var = [];

            // copy from http://krasimirtsonev.com/blog/article/deep-dive-into-client-side-routing-navigo-pushstate-hash
            this.match_path = new RegExp("^" + path.replace(/(:)(\w+)/g, (full, dots, name)=>{
                this.var.push(name);
                return '([^\\/]+)';
            }) + "(?:(?:\\/$)|$)");

            return this;
        }

        this.route.push({path, regex: new regMatch(), callback});
    }

    /**
     * 
     * @param {string} path find path matched in route
     * @return {Function | null} callback of mapped route
     */
    _match(url) {
        const path = new URL(url).pathname;
        const searchParams = (new URL(url)).searchParams;
        const search = {}; 
        searchParams.forEach(function (val, key) {
            search[key] = val;
        });

        for (const route of this.route) {
            let isNext = true;
            
            const match = path.match(route.regex.match_path);
            
            if (!match) continue;

            const request = {
                url: url,
                match: match,
                params: {},
                search: search
            }
            for (let i = 1; i < match.length; ++i) {
                request.params[route.regex.var[i-1]] = match[i];
            }
            
            const nextFunc = () => {
                isNext = true;
            }
            const responseFunc = new RouterRes();

            route.callback(request, responseFunc, nextFunc);
            
            if (responseFunc.isEnd) break;
        }
    }
}
},{"./router-res":2}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi5qcyIsInNyYy9yb3V0ZXItcmVzL2luZGV4LmpzIiwic3JjL3JvdXRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IFJvdXRlciA9IHJlcXVpcmUoXCIuL3JvdXRlclwiKTtcbmNvbnN0IHJvdXRlciA9IG5ldyBSb3V0ZXIoKTtcblxucm91dGVyLm1hcChcIi9ob21lXCIsIChyZXEsIHJlcykgPT4ge1xuICAgIGNvbnNvbGUubG9nKHJlcSk7XG4gICAgcmVzLnJlbmRlcihcImhvbWUuaHRtbFwiLCB7XG4gICAgICAgIGlkOiByZXEucGFyYW1zLmlkLFxuICAgICAgICBuYW1lOiByZXEuc2VhcmNoLm5hbWVcbiAgICB9KTtcbn0pO1xuXG5yb3V0ZXIubWFwKFwiL2Fib3V0XCIsIChyZXEsIHJlcykgPT4ge1xuICAgIHJlcy5yZW5kZXIoXCJhYm91dC5odG1sXCIpO1xufSk7XG5cbnJvdXRlci5tYXAoXCIvLipcIiwgKHJlcSwgcmVzKSA9PiB7XG4gICAgcmVzLnJlbmRlcihcInJlYWw0MDQuaHRtbFwiLCB7XG4gICAgICAgIHVybDogcmVxLnVybFxuICAgIH0pO1xufSk7XG5cbihmdW5jdGlvbigpIHtcbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICAgICAgcm91dGVyLnJlYWR5KCk7XG4gICAgfSk7XG5cbiAgICAkKHdpbmRvdykub24oXCJwb3BzdGF0ZVwiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICByb3V0ZXIucmVhZHkoKTtcbiAgICB9KTtcbn0pKGpRdWVyeSk7XG4iLCJjbGFzcyBSb3V0ZXJSZXMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmlzRW5kID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmVuZGVyKHBhZ2UsIGRhdGEpIHtcbiAgICAgICAgdGhpcy5pc0VuZCA9IHRydWU7XG5cbiAgICAgICAgZmV0Y2goXCIvcGFnZS9cIiArIHBhZ2UpXG4gICAgICAgIC50aGVuKHJlcz0+cmVzLnRleHQoKSlcbiAgICAgICAgLnRoZW4odGV4dD0+e1xuICAgICAgICAgICAgZGF0YSA9IGRhdGEgfHwgW107XG5cbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZShcInt7XCIgKyBrZXkgKyBcIn19XCIsIGRhdGFba2V5XSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICB9KS50aGVuKHRleHQ9PntcbiAgICAgICAgICAgICQoXCJib2R5XCIpLmh0bWwodGV4dCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGVuZCgpIHtcbiAgICAgICAgdGhpcy5pc0VuZCA9IHRydWU7XG4gICAgfSBcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSb3V0ZXJSZXM7IiwiY29uc3QgUm91dGVyUmVzID0gcmVxdWlyZShcIi4vcm91dGVyLXJlc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBSb3V0ZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnJvdXRlID0gW107XG4gICAgfVxuXG4gICAgcmVhZHkoKSB7XG4gICAgICAgIGNvbnN0IHBhdGggPSB3aW5kb3cubG9jYXRpb247XG4gICAgICAgIHRoaXMuX21hdGNoKHBhdGgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBtYXAgcmVxdWVzdFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIGxpa2UgYC9hc2QvOmFiYy9gXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgZnVuY3Rpb24gKHJlcXVlc3QsIHJlc3BvbnNlLCBuZXh0KVxuICAgICAqL1xuICAgIG1hcChwYXRoLCBjYWxsYmFjaykge1xuICAgICAgICBjb25zdCByZWdNYXRjaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudmFyID0gW107XG5cbiAgICAgICAgICAgIC8vIGNvcHkgZnJvbSBodHRwOi8va3Jhc2ltaXJ0c29uZXYuY29tL2Jsb2cvYXJ0aWNsZS9kZWVwLWRpdmUtaW50by1jbGllbnQtc2lkZS1yb3V0aW5nLW5hdmlnby1wdXNoc3RhdGUtaGFzaFxuICAgICAgICAgICAgdGhpcy5tYXRjaF9wYXRoID0gbmV3IFJlZ0V4cChcIl5cIiArIHBhdGgucmVwbGFjZSgvKDopKFxcdyspL2csIChmdWxsLCBkb3RzLCBuYW1lKT0+e1xuICAgICAgICAgICAgICAgIHRoaXMudmFyLnB1c2gobmFtZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcoW15cXFxcL10rKSc7XG4gICAgICAgICAgICB9KSArIFwiKD86KD86XFxcXC8kKXwkKVwiKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJvdXRlLnB1c2goe3BhdGgsIHJlZ2V4OiBuZXcgcmVnTWF0Y2goKSwgY2FsbGJhY2t9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCBmaW5kIHBhdGggbWF0Y2hlZCBpbiByb3V0ZVxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9uIHwgbnVsbH0gY2FsbGJhY2sgb2YgbWFwcGVkIHJvdXRlXG4gICAgICovXG4gICAgX21hdGNoKHVybCkge1xuICAgICAgICBjb25zdCBwYXRoID0gbmV3IFVSTCh1cmwpLnBhdGhuYW1lO1xuICAgICAgICBjb25zdCBzZWFyY2hQYXJhbXMgPSAobmV3IFVSTCh1cmwpKS5zZWFyY2hQYXJhbXM7XG4gICAgICAgIGNvbnN0IHNlYXJjaCA9IHt9OyBcbiAgICAgICAgc2VhcmNoUGFyYW1zLmZvckVhY2goZnVuY3Rpb24gKHZhbCwga2V5KSB7XG4gICAgICAgICAgICBzZWFyY2hba2V5XSA9IHZhbDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZm9yIChjb25zdCByb3V0ZSBvZiB0aGlzLnJvdXRlKSB7XG4gICAgICAgICAgICBsZXQgaXNOZXh0ID0gdHJ1ZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBwYXRoLm1hdGNoKHJvdXRlLnJlZ2V4Lm1hdGNoX3BhdGgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIW1hdGNoKSBjb250aW51ZTtcblxuICAgICAgICAgICAgY29uc3QgcmVxdWVzdCA9IHtcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICBtYXRjaDogbWF0Y2gsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7fSxcbiAgICAgICAgICAgICAgICBzZWFyY2g6IHNlYXJjaFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBtYXRjaC5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIHJlcXVlc3QucGFyYW1zW3JvdXRlLnJlZ2V4LnZhcltpLTFdXSA9IG1hdGNoW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBuZXh0RnVuYyA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpc05leHQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2VGdW5jID0gbmV3IFJvdXRlclJlcygpO1xuXG4gICAgICAgICAgICByb3V0ZS5jYWxsYmFjayhyZXF1ZXN0LCByZXNwb25zZUZ1bmMsIG5leHRGdW5jKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlRnVuYy5pc0VuZCkgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59Il19
