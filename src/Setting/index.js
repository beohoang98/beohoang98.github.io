class Setting {
    load() {
        this.data = JSON.parse(localStorage.getItem('setting')) || {};
    }

    save() {
        localStorage.setItem('setting', JSON.stringify(this.data));
    }

    get theme() {
        return this.data.theme || '';
    }

    set theme(theme) {
        this.data.theme = theme;
    }
}

module.exports = Setting;
