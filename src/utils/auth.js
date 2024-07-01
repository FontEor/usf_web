import Cookies from "js-cookie";

/**
 * getCookie 获取cookie
 * @param {*} cookieName
 */
export function getCookie(cookieName) {
    if (cookieName && typeof cookieName === "string") {
        return Cookies.get(cookieName);
    }
}

/**
 * removeCookie 删除cookie
 * @param {*} cookieName
 */
export function removeCookie(cookieName) {
    if (cookieName && typeof cookieName === "string") {
        Cookies.remove(cookieName);
    }
}

/**
 * setCookie 设置cookie
 * @param {*} cookieName cookie名称
 * @param {*} data cookie值
 * @param {*} expires 过期日期
 */
export function setCookie(cookieName, data, expires = 7) {
    if (cookieName && typeof cookieName === "string") {
        Cookies.set(cookieName, data, { expires });
    }
}

/**
 * getTenementCookie 获取某租户cookie
 * @param {*} cookieName
 */
export function getTenementCookie(cookieName) {
    if (cookieName && typeof cookieName === "string") {
        let tenementObj = Cookies.get(cookieName) || {};
        tenementObj =
            typeof tenementObj === "string"
                ? JSON.parse(tenementObj)
                : tenementObj;
        return tenementObj.tenementInfoObj || {};
    }
}
