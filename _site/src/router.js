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
