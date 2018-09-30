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
