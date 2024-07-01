import BasicList from "@/components/basicList";
import UmyBasicList from "@/components/basicList/umyBasicList.vue";
import { mapState } from "vuex";
import permissionMixins from "./permission";
/**
 * 列表页数据列表公共方法混入
 */
export default {
    mixins: [permissionMixins],
    components: {
        BasicList,
        UmyBasicList,
    },
    props: {
        state: Object,
        tableH: Number,
        tableCode: String,
        handleAdd: Function,
        handleEdit: Function,
        handleDelete: Function,
        handleSelectionChange: Function,
        handleWorkflow: Function,
        tabEmptyText:String
    },
    data() {
        return {
            // 选中行
            selRows: [],
            // 是否显示列设置
            showColSet: true,
            // 导出弹窗是否可见
            expSetDlgVis: false,
            // 已选导出字段
            expFields: [],
            listItem: {}, // 更新列表后刷新数据状态
            changeIndex: null, // 记录选中下标
            pageIndexNow: 0, // 选中项所在页面存储
            radioIndexNow: null, // 选中项下标存储
            extendList: this.getDefaultExtendList() // 扩展字段默认数据
        };
    },
    watch: {
        "state.list": {
            deep: true,
            immediate: false,
            handler: function(newVal) {
                // 清空选中状态 清空item
                this.$children[0].radioIndex = null;
                this.listItem = {};
                this.state.selectItem &&
                    newVal.forEach((_item, _ind) => {
                        if (_item.id === this.state.selectItem.id) {
                            // 更新选中状态
                            this.$children[0].radioIndex = _ind;
                            // 更新item
                            this.listItem = _item;
                        }
                    });
            }
        }
    },
    computed: {
        ...mapState("app", [
            "tenementCode",
            "tenementInfoObj"
        ])
    },
    methods: {
        selectionChange(rows) {
            this.selRows = rows;
            this.handleSelectionChange && this.handleSelectionChange(rows);
        },
        updateExpSetDlgVis(vis) {
            this.expSetDlgVis = vis;
        },
        expProxy(command) {
            if (command === "expSet") {
                this.updateExpSetDlgVis(true);
            } else if (command === "doExp") {
            }
        },
        handleSaveExpSet({ valFields, done }) {
            const cols = [];
            for (let i = 0, len = valFields.length; i < len; i++) {
                cols.push({
                    paramNo: valFields[i].key,
                    paramName: valFields[i].name,
                    paramSeq: i + 1
                });
            }
            if (!this.tableCode) {
                return;
            }
            api.custom
                .updateCustomCols({
                    data: {
                        tableCode: this.tableCode + "|exp",
                        customRowParamList: cols
                    }
                })
                .then(({ code, msg }) => {
                    if (code === 200) {
                        done && done();
                        this.expFields = valFields;
                    } else {
                        this.$message.error(msg);
                    }
                });
        },
        // 切换页数
        pageIndexChange(_index) {
            let _ind = _index - 1;
            // 更新页面数据
            this.$parent.updateState({ pageIndex: _ind });
            // 查询列表
            this.$parent.dispatch(this.apiName || "queryList");
        },
        // 切换每页显示条数
        pageSizeChange(_size) {
            // 查询列表
            this.$parent.updateState({ pageSize: _size });
            // 查询列表
            this.$parent.dispatch(this.apiName || "queryList");
        },
        // 默认的可扩展字段数量
        getDefaultExtendList(length = 18) {
            const listLen = Array(length).fill(0);
            const list = listLen.map((item, index) => {
                const extNo = index + 1;
                const row = {
                    id: null,
                    extNo,
                    extCode: `ext_${extNo}`,
                    isEffective: 0,
                    isRequired: 0,
                    extName: "",
                    isEnum: 0,
                    enumValue: "",
                    tenementCode: this.tenementCode
                };
                return row;
            });
            return list;
        },
        /**
         * 扩展列表展示列
         * @param {Array} extendList 扩展字段的数据
         * @param {Number} [insertIndex] 扩展字段插入的位置 默认插在最后
         * */
        setListExtendFields(extendList, insertIndex, isMenuResource = false) {
            const fields = this.fields || [];
            insertIndex = insertIndex || fields.length - 1;
            const showExtendFields = extendList.filter(
                item => item.isEffective === 1
            );
            // 除扩展字段外的字段
            const uListFields = [];
            fields.forEach(elem => {
                if (!/^ext\d+$/.test(elem.key)) {
                    uListFields.push(elem);
                }
            });
            const extendFields = showExtendFields.map(item => {
                const col = { key: `ext${item.extNo}`, name: item.extName };
                if (item.isEnum === 1) {
                    col.render = (h, { row }) => {
                        const enums = jt.fn.generateEnums(item.enumValue, ",");
                        const enumValue = enums.find(
                            subItem => subItem.value === row[col.key]
                        );
                        return <span>{enumValue ? enumValue.label : ""}</span>;
                    };
                }
                return col;
            });
            // TODO menuResource
            isMenuResource
                ? uListFields.splice(uListFields.length - 1, 0, ...extendFields)
                : uListFields.splice(insertIndex, 0, ...extendFields);

            this.fields = uListFields;
            this.queryList && this.queryList();
        },
        /**
         * 扩展字段入参校验
         * @return {Boolean}
         * */
        checkExtendFieldParams() {
            for (
                let i = 0, list = this.extendList, len = list.length;
                i < len;
                i++
            ) {
                const row = list[i];
                const nextRow = i !== len - 1 ? list[i + 1] : {};
                if (
                    row.isEffective === 0 &&
                    nextRow.isEffective === 1 &&
                    i !== len - 1
                ) {
                    this.$message.error("请依次启用扩展字段");
                    return false;
                }
                // 將null&undefined轉為字符串
                row.enumValue =
                    typeof row.enumValue === "string"
                        ? row.enumValue.trim()
                        : "";
                row.extName =
                    typeof row.extName === "string"
                        ? row.extName.trim()
                        : row.extName;
                if (row.isEffective === 1 && _.isEmpty(row.extName)) {
                    this.$message.error("请填写启用字段的字段名称");
                    return false;
                }
                if (
                    typeof row.extName === "string" &&
                    row.extName.length > 20
                ) {
                    this.$message.error(
                        `字段序号${row.extNo}的字段名称最多可输入20个字符`
                    );
                    return false;
                }
                if (
                    row.isEffective === 1 &&
                    !CNST.REG_EXP.ENGNUMLINEZH.test(row.extName)
                ) {
                    this.$message.error(
                        `字段序号${
                            row.extNo
                        }的字段名称只允许输入数字，字母，下划线，中文`
                    );
                    return false;
                }
                if (
                    typeof row.enumValue === "string" &&
                    row.enumValue.length > 200
                ) {
                    this.$message.error(
                        `字段序号${row.extNo}的枚举值最多可输入200个字符`
                    );
                    return false;
                }
                if (row.isEnum === 1 && _.isEmpty(row.enumValue.trim())) {
                    this.$message.error("枚举类型的枚举值不允许为空");
                    return false;
                }
                // 不允许最后一个字符为逗号
                if (
                    row.isEnum === 1 &&
                    row.enumValue.length &&
                    row.enumValue[row.enumValue.length - 1] === ","
                ) {
                    this.$message.error(
                        `字段序号${row.extNo}枚举值尾部不允许有多余的逗号`
                    );
                    return false;
                }
                if (row.isEnum === 1 && !_.isEmpty(row.enumValue)) {
                    const enumStr = row.enumValue;
                    if (enumStr.includes(",")) {
                        const keys = [];
                        const values = [];
                        const array = enumStr.split(",");
                        for (let j = 0; j < array.length; j++) {
                            if (!CNST.REG_EXP.ENUM_VALUE_STR.test(array[j])) {
                                this.$message.error(
                                    `字段序号${
                                        row.extNo
                                    }的枚举值需要以: 展示值:Value值这种格式出现，英文冒号和逗号为分隔符，除分隔符外可以输入数字、字母、下划线、中文`
                                );
                                return false;
                            }
                            const itemInfo = array[j].split(":");
                            const itemKey = itemInfo[0].trim();
                            const itemValue = itemInfo[1].trim();
                            if (!itemKey || !itemValue) {
                                this.$message.error(
                                    `字段序号${row.extNo}的key或value不能为空`
                                );
                                return false;
                            }
                            if (keys.includes(itemKey)) {
                                this.$message.error(
                                    `字段序号${
                                        row.extNo
                                    }枚举值的key值${itemKey}不允许重复`
                                );
                                return false;
                            } else {
                                keys.push(itemKey);
                            }
                            if (values.includes(itemValue)) {
                                this.$message.error(
                                    `字段序号${
                                        row.extNo
                                    }枚举值的value值${itemValue}不允许重复`
                                );
                                return false;
                            } else {
                                values.push(itemValue);
                            }
                        }
                    } else if (!CNST.REG_EXP.ENUM_VALUE_STR.test(enumStr)) {
                        this.$message.error(
                            `字段序号${
                                row.extNo
                            }的枚举值需要以: 展示值:Value值这种格式出现，英文冒号和逗号为分隔符，除分隔符外可以输入数字、字母、下划线、中文`
                        );
                        return false;
                    }
                }
            }
            return true;
        },
        // 扩展字段数据入参处理
        extendToFront(data = []) {
            data = data.map(item => _.omit(item, ["extNo"]));
            data.forEach((item, index) => {
                Object.assign(this.extendList[index], item);
            });
        }
    }
};
