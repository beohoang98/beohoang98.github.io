const Component = require('../Component.js');

class Link extends Component {
    constructor(text = '') {
        super('a');
        this.clickEvent = [];

        this.element.addClass('nav-link')
                    .attr('href', '#')
                    .text(text);
        this.element.on('click', (e) => {
            for (const func of Array.from(this.clickEvent)) {
                if (typeof func === 'function') {
                    func(e);
                }
            }
        });
    }

    onClick(func) {
        this.clickEvent.push(func);
    }
}

module.exports = Link;
