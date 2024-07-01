const UAParser = require('ua-parser-js');

class Browser {
    constructor() {
        // 准备缓存浏览器信息
        this.info = undefined;
    }
    init() {
        if (!this.info) {
            const parser = new UAParser();
            this.parse = parser;
            this.info = parser.getResult();
        }
        return this.info;
    }
    // 是否为chrome
    isChrome(version) {
        this.init();
        return this.info.browser.name === "Chrome"
    }
}

export default new Browser();
