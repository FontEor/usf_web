import Vue from "vue";
import Draggable from "vuedraggable";
import { UTable, UTableColumn } from "umy-ui";
import "umy-ui/lib/theme-chalk/index.css"; // 引入样式
import "./styles/umy-ui.reset.scss";
import "@/libs/element";
import "@/directives";
import router from "@/router";
import store from "@/store";
import App from "./App";
import "@/permission";
import "default-passive-events";

Vue.component("draggable", Draggable);
Vue.use(UTable);
Vue.use(UTableColumn);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");

api.users
    .getUserErpInfo({})
    .then(resolve => {
        const userCode = resolve.data.userCode;
        //子午线埋点
        var jaq = [];
        window.jaq = jaq || [];
        jaq.push(["account", "JA2021_1823313"]); //站点编号
        jaq.push(["domain", "susf.jd.com"]); //站点域名
        jaq.push(["erp_account", userCode]);

        //ERP帐号，erp_account为字段名固定不变，test填入用户erp帐号(调用方自己传,若不传,会记录用户的京东pin)
        (function() {
            var ja = document.createElement("script");
            ja.type = "text/javascript";
            ja.async = true;
            ja.src = "//wl.jd.com/joya.js";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(ja, s);
        })();
    })
    .catch(reject => {
        console.log("getUserErpInfoData 请求失败", reject);
    });
