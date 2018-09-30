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
