const Component = require('../Component.js');
const Link = require('../Link');

class NavItem extends Component {
    constructor(title = '') {
        super('li');
        this.link = new Link(title);
        this.element.addClass('nav-item');
        this.element.append(this.link.render());
    }

    onClick(func) {
        this.link.onClick(func);
    }
}

module.exports = NavItem;
