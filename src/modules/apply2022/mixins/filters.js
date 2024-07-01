import moment from "moment";

const applyHistoryState = CNST.ENUMS.applyHistoryState;
const applyHistoryStateMap = {};
applyHistoryState.forEach(state => {
    applyHistoryStateMap[state.value] = state.label;
});

export const userSystemType = function (val) {
    switch (+val) {
        case 1:
            return "ERP";
        case 2:
            return "PASSPORT";
        default:
            return val;
    }
}

export default {
    filters: {
        userSystemType,
        booleanToYN(val) {
            return Boolean(val) ? "是" : "否"
        },
        accountType(val) {
            switch (+val) {
                case 1:
                    return "ERP";
                case 2:
                    return "PIN";
                default:
                    return val;
            }
        },
        applyHistoryState(val) {
            return applyHistoryStateMap[val] || val
        },
        timeFormat(val, format = 'YYYY-MM-DD HH:mm:ss') {
            if(val) {
                return moment(val).format(format)
            }
            return val
        },

        dataTypeFilter(val, options) {
            if(val !== null && options) {
                const instance = options.find(option => option.value == val);
                if(instance) {
                    return instance.label || val;
                }
            }
            return val
        }
    }
}