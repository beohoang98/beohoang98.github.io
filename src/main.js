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
