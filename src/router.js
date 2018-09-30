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