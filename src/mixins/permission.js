import { mapState } from "vuex";

export default {
    provide () {
        return {
            buttonData: this.buttonData
        }
    },
    computed: {
        ...mapState("app", [
            "showButtonList",
            "showAllButton",
            "showExportButton"
        ])
    },
    methods: {
        buttonData(_str = "") {
            const btnItem = _.find(this.showButtonList, { code: _str }, null);
            let _btn = {};
            // 设置按钮全部显示
            this.showAllButton &&
                (_btn = {
                    item: {},
                    name: "button",
                    has: false
                });
            // 返回真实按钮
            btnItem &&
                (_btn = {
                    item: btnItem,
                    name: btnItem.name || "",
                    has: true
                });

            return _btn;
        },
    },
}