const Component = require('../Component.js');
const Link = require('../Link');

class NavItem extends Component {
    constructor(title = '', iconClass = '') {
        super('li');
        this.link = new Link(`\t${title}`);
        this.link.element.prepend($('<i/>').addClass(iconClass));
        this.element.addClass('nav-item');
        this.element.append(this.link.render());
    }

    onClick(func) {
        this.link.onClick(func);
    }
}

module.exports = NavItem;
