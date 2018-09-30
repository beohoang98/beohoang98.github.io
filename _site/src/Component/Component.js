class Component {
    constructor(str) {
        this.element = $(`<${str}/>`);
    }

    render() {
        return this.element;
    }
}

module.exports = Component;
