import Bus from "./bus";
import store from "../store/index";

export default {
    computed: {
        tenantId() {
            return store.state.form.tenantId
        },
        usfOrgId() {
            return store.state.form.usfOrgId
        },
        storeForm() {
            return store.state.form
        }
    },
    watch: {
        tenantId () {
            this.tenantIdChange && this.tenantIdChange();
        },
        usfOrgId () {
            this.usfOrgIdChange && this.usfOrgIdChange();
        }
    },
    // created() {
    //     Bus.$on('tenantIdChange', this.tenantIdChange);
    // },
    // beforeDestroy() {
    //     Bus.$on('usfOrgIdChange', this.usfOrgIdChange);
    // },
}
