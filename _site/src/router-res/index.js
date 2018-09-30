class RouterRes {
    constructor() {
        this.isEnd = false;
    }

    render(page, data) {
        this.isEnd = true;

        fetch("/page/" + page)
        .then(res=>res.text())
        .then(text=>{
            data = data || [];

            for (const key of Object.keys(data)) {
                text = text.replace("{{" + key + "}}", data[key]);
            }

            return text;
        }).then(text=>{
            $("body").html(text);
        });
    }

    end() {
        this.isEnd = true;
    } 
}

module.exports = RouterRes;