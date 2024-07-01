import Vue from "vue";
import VueRouter from "vue-router";
import staticRoutes from "@/router/static";

// 用于处理本地location报错的问题
const VPUSH = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onComplete, onAbort) {
    try {
        return VPUSH.call(this, location, onComplete, onAbort).catch(
            err => err
        );
    } catch (error) {
        console.log(error);
    }
};

Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    routes: staticRoutes
});

// router.beforeEach((to, from, next) => {
//     if (to.path == "/applyConfig") {
//         let docmn = document.getElementsByClassName("g-mn")[0];
//         if (docmn) {
//             docmn.style.backgroundColor = "#EFEFEF";
//             docmn.style.paddingBottom = "0px";
//         }
//         let doc = document.querySelector(".g-mnc");
//         if (doc) {
//             doc.style.boxShadow = "none";
//             doc.style.padding = "0";
//             docmn.style.backgroundColor = "#EFEFEF";
//         }
//         next();
//     } else {
//         let docmn = document.getElementsByClassName("g-mn")[0];
//         if (docmn) {
//             docmn.style.backgroundColor = "#f3f7ff";
//             docmn.style.paddingBottom = "20px";
//         }
//         let doc = document.querySelector(".g-mnc");
//         if (doc) {
//             doc.style.backgroundColor = "#fff";
//             doc.style.boxShadow = "0px 2px 11px 0px rgba(56, 62, 68, 0.09)";
//             doc.style.paddingLeft = "20px";
//             doc.style.paddingRight = "20px";
//         }
//         next();
//     }
// });

export default router;
