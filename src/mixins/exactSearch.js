import BasicSearch from "@/components/basicSearch";

/**
 * 列表页查询表单公共方法混入
 */
export default {
    components: {
        BasicSearch
    },
    props: {
        // 是否立即查询
        immediate: {
            type: Boolean,
            default: true
        },
        // 查询模块编码
        searchCode: String,
        updateState: Function,
        queryList: Function,
        searchHeightChange: Function,
        showQueryBtn: {
            type: Boolean,
            default: true
        },
        showResetBtn: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            // 查询数据模型
            query: this.getDefaultQuery(),
            //表单标签长度
            formLabelWidth: 80
        };
    },
    mounted() {
        if (this.immediate) {
            this.handleSearch();
        }
    },
    render() {
        return (
            <basic-search
                show-query-btn={this.showQueryBtn}
                show-reset-btn={this.showResetBtn}
                search-render={this.searchRender}
                handle-search={this.handleSearch}
                handle-reset={this.handleReset}
                onSearchHeightChange={this.searchHeightChange}
            />
        );
    },
    methods: {
        getFieldKeys(fields) {
            fields = fields || this.fields || [];
            const keys = [];
            for (let i = 0, len = fields.length; i < len; i++) {
                if (_.isObject(fields[i])) {
                    keys[i] = fields[i].key;
                } else {
                    keys[i] = fields[i];
                }
            }
            return keys;
        },
        getDefaultQuery(exclude) {
            const fields = this.fields;
            const query = {};
            for (let i = 0; i < fields.length; i++) {
                if (_.isObject(fields[i])) {
                    if (exclude && fields[i].exclude) {
                        continue;
                    }
                    query[fields[i].key] = fields[i].default;
                } else {
                    query[fields[i]] = undefined;
                }
            }
            return query;
        },
        toEnd() {
            const query = _.cloneDeep(this.query);
            jt.object.removeEmptyAttr(query);
            return query;
        },
        handleReset() {
            this.query = this.getDefaultQuery(true);
            this.handleSearch();
        },
        handleSearch() {
            const query = this.toEnd();
            this.updateState({ query, pageIndex: 0 });
            this.queryList();
        },
        // 获取字段渲染集合
        getFormItems(tpls) {
            const keys = this.getFieldKeys();
            const items = [];

            for (let i = 0, len = keys.length; i < len; i++) {
                if (tpls[keys[i]]) {
                    items.push(tpls[keys[i]]);
                }
            }
            if(this.$children[0].size==="large"){ this.$children[0].showMore = keys.length > 10;}else if (this.$children[0].size==="medium"){this.$children[0].showMore = keys.length > 8;} else if (this.$children[0].size==="small"){this.$children[0].showMore = keys.length > 6;}
          
            return items;
        },
        // 查询表单渲染器
        searchRender() {
            const tpls = this.getFieldTpls(this.query);

            return (
                <el-form size="small" label-width={this.formLabelWidth + "px"}>
                    {this.getFormItems(tpls)}
                </el-form>
            );
        }
    }
};
