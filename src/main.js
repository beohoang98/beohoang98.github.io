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
