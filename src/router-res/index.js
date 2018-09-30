class RouterRes {
    constructor() {
        this.isEnd = false;
    }

    render(page, data) {
        this.isEnd = true;

        fetch(`/page/${page}`)
        .then(res => res.text())
        .then((text) => {
            const varData = data || [];
            let textRendered = text;

            for (const key of Object.keys(varData)) {
                textRendered = textRendered.replace(`{{${key}}}`, varData[key]);
            }

            return textRendered;
        }).then((text) => {
            $('body').html(text);
        });
    }

    end() {
        this.isEnd = true;
    }
}

module.exports = RouterRes;
