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
