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
