<template>
    <el-form class="search-form" size="small" :label-width="labelWidth" :model="query">
        <div class="col-l">
            <el-row v-for="(items, sub) of searchFields" :key="sub">
                <el-col v-for="item of items" :span="item.span || 8" :key="item.key">
                    <el-form-item :label="item.name" :label-width="item.labelWidth">
                        <el-input v-if="!item.render" v-model.trim="query[item.key]" clearable/>
                        <basic-el 
                            v-if="item.render"
                            :query="query"
                            :searchItem="item"
                            :render="item.render"
                            />
                    </el-form-item>
                </el-col>
            </el-row>
        </div>
        <div class="col-r">
            <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
            <el-button size="small" @click="handleReset">重置</el-button>
        </div>
    </el-form>
</template>

<script>
import BasicEl from './basic'
export default {
    components: {
        BasicEl
    },
    props: {
        query: {
            type: Object,
            default: function() {
                return []
            }
        },
        gutter: {
            type: Number,
            default: 0
        },
        fields: {
            type: Array,
            default: []
        },
        handleSearch: {
            type: Function,
            default: () => {}
        },
        handleReset: {
            type: Function,
            default: () => {}
        },
        labelWidth: {
            type: String,
            default: '80px'
        }
    },
    data() {
        return {
            searchFields: this.generateFields(this.fields)
        }
    },
    watch: {
        fields(nv) {
            this.searchFields = this.generateFields(nv)
        }
    },
    methods: {
        generateFields(list) {
            const res = [[]]
            let span = 0
            for (let i = 0, len = list.length; i < len; i++) {
                span += (list[i].span || 8)
                if (span <= 24) {
                    res[res.length-1].push(list[i])
                } else {
                    span = list[i].span
                    res.push([list[i]])
                }
            }
            return res
        }
    }
}
</script>

<style lang="scss" scoped>
.search-form {
    display: block;
    .col-l {
        float: left;
        width: calc(100% - 140px);
    }
    .col-r {
        float: right;
        width: 140px;
        text-align: center;
    }
    &:after {
        content: '';
        display: block;
        clear: both;
        height: 0;
        width: 100%;
        overflow: hidden;
    }
}
</style>