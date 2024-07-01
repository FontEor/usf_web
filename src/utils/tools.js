import { clone, cloneDeep } from "lodash";

/**
 * 表单验证函数
 * @param {*} options
 */
export function genValidator (options) {
    const { validateFn, message = '' } = options;
    return (rule, value, callback) => {
        if (validateFn(rule, value, options)) {
            callback();
        } else {
            callback(new Error(message));
        }
    };
}

/**
 * maxCNValidator 字符串长度验证函数
 * @param {*} rule 规则
 * @param {*} value 值
 * @param {*} options maxLength字段为字符限制
 */
export function maxCNValidator (rule, value = '', options = {}) {
    if (typeof value !== 'string') value = String(value)
    const { maxLength = 500 } = options
    const cnStringRegs = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/mg
    const match = value.match(cnStringRegs)
    let length = value.length
    if (match && match.length) {
        length = (match.length + (value.length - match.length) * 0.5)
        return length <= maxLength
    } else {
        return value.length * 0.5 <= maxLength
    }
}
/**
 * maxENValidator 英文编码字符串长度验证函数
 * @param {*} rule 规则
 * @param {*} value 值
 * @param {*} options maxLength字段为字符限制
 */
export function maxENValidator (rule, value = '', options = {}) {
    if (typeof value !== 'string') value = String(value)
    const { minLength = 0, maxLength = 50 } = options
    const regs = new RegExp(`^[0-9a-zA-Z_#.-]{${minLength},${maxLength}}$`, 'mg')
    // const regs = /^[0-9a-zA-Z_]{1,50}$/mg
    if (regs.test(value)) {
        return true
    } else {
        return false
    }
}

/**
 * 不为空验证
 * @param {*} rule 规则
 * @param {*} value 值
 */
export function isNotEmptyStr (rule, value = '') {
    if (typeof value === 'string') {
        return value && value.length !== 0;
    } else if (typeof value === 'number' || typeof value === 'boolean' || (Array.isArray(value) && value.length)) {
        return true
    } else {
        return false
    }
}

/**
 * 树状结构生成器
 * @param {*} rows 传入普通数组
 * @param {*} options 选填-扩展属性（订制需求）
 * 【songchunrui-20191122补充说明】dataToTree函数大致分2种使用情况:
 * 1、显示根节点 -- 普通情况，接口返回有根节点，...返回树状数组
 * 2、不显示根节点 -- 接口返回数据中，没有根节点，将那些没有父节点的设置为根节点，...返回树状数组
 */
export function dataToTree (rows = [], options = {}) {
    if (!rows.length) return []
    let rootTrees = []
    let leftRows = _.cloneDeep(rows)
    try {
        rows.forEach((item = {}, index) => {
            if (!item.parentId && typeof item.parentId !== 'number') {
                item.isRoot = true
                rootTrees.push(item)
                leftRows = leftRows.filter((_item) => _item.parentId === item.parentId)
            }
        })
        rootTrees.forEach(item => {
            addChildrens (leftRows, item)
        })
        function addChildrens (data = [], parent = {}) {
            parent.children = parent.children || []
            for (let i = 0; i < data.length; i++) {
                if (data[i].parentId === parent.id) {
                    parent.children.push(data[i])
                    addChildrens(data, data[i])
                }
            }
        }
        function isRootTrees (row = {}, allRows = []) {
            for (let i = 0; i < allRows.length; i++) {
                if (row.parentId === allRows[i].id) {
                    return false
                }
            }
            return true
        }
        if (!rootTrees.length) {
            for (let i = 0; i < leftRows.length; i++) {
                if (isRootTrees(leftRows[i], rows)) {
                    rootTrees.push(_.cloneDeep(leftRows[i]))
                }
            }
            if (rootTrees.length) {
                rootTrees.forEach(item => {
                    addChildrens (leftRows, item)
                })
            }
        }
        if (options.id && typeof options.iterators === 'function') {
            rootTrees = options.iterators(rootTrees, options.id)
        }
        return rootTrees
    } catch (error) {
        console.log('error:', error)
        return []
    }
}

/**
 * 整理树状数据结构 保留原始数据引用状态
 * @param {Array} rows 
 * @returns 
 */
export function listToTree(rows = []) {
    const tree = [];
    rows.forEach(row => {
        if (row.parentId) {
            const parent = rows.find(r => r.id === row.parentId);
            if (parent) {
                if (parent.children) {
                    parent.children.push(row);
                } else {
                    parent.children = [row];
                }
            }
        } else {
            tree.push(row);
        }
    })
    return tree;
}

/**
 * 忽略子集节点数据 只保留最高父级数据
 * @param {Array} rows
 * @returns 
 */
export function listToTreeTop(rows = []) {
    const result = [];
    rows.forEach(row => {
        // 如果父级存在
        if (row.parentId) {
            // 查询父级
            const parent = rows.find(r => r.id === row.parentId);
            if (parent) {
                // 如果有父级标记过滤
                row.needfilter = true;
            } else {
                // 否则返回
                result.push(row);
            }
        } else {
            // 否则返回
            result.push(row);
        }
    })
    return result.filter(item => {
        delete item.children;
        return !item.needfilter
    });
}

/**
 * disabledTrees disabled数组某节点
 * @param {*} rows 数组rows
 * @param {*} orgId 节点orgId
 */
export function disabledTrees (rows = [], orgId = null) {
    if (!rows.length) return []
    const newRows = [...rows]
    function setDisabled (_row = []) {
        _row.forEach((item) => {
            item.disabled = true
            if (item.children && item.children.length) {
                setDisabled(item.children)
            }
        })
    }
    function iterators (_row = [], orgId = null) {
        for (let i = 0; i < _row.length; i++) {
            if (_row[i].id === orgId) {
                _row[i].disabled = true
                if (_row[i].children && _row[i].children.length) {
                    setDisabled(_row[i].children)
                }
                return true
            } else if (_row[i].children && _row[i].children.length) {
                iterators(_row[i].children, orgId)
            }
        }
        return false
    }
    iterators(newRows, orgId)
    return newRows
}

/**
 * isEmpty 是否为undefined null ''
 * @param {*} value
 */
export function isEmpty (value) {
    return value === undefined || value === null || value === ''
}

/**
 * getJSONKeys 提取对象数组中含有某属性，返回该属性值新数组
 * @param {*} arr 数组rows
 * @param {*} attr 属性字段
 */
export function getJSONKeys (arr, attr) {
    if (!_.isArray(arr) || isEmpty(attr)) return []
    const result = []
    arr.forEach(item => {
        if (!isEmpty(item[attr])) result.push(item[attr])
    });
    return result
}

/**
 * filterJSON 提取对象数组中含有某属性，返回该属性值新数组
 * @param {*} arr 数组rows
 * @param {*} attr 属性字段
 */
export function filterJSON (arr, attr, value) {
    if (!_.isArray(arr) || isEmpty(attr)) return []
    return [...arr.filter(item => item.isOwnRole === value)]
}

/**
 * setKeys 设置key字段值
 * @param {*} fields 表单循环字段列表
 * @param {*} key key值
 * @param {*} value set key值
 * @param {*} type 默认为value，可选'value', 'options'
 */
export function setKeys (fields = [], key, value, type = 'value', originRows = []) {
    if (!key || !fields.length) return
    const res = []
    const field = _.find(fields, { key }, -1)
    for (let i = 0; i < fields.length; i++) {
        if (fields[i] && fields[i].key === key) {
            if (Array.isArray(value)) {
                // 机构id回显和排序有关系，需要注意
                value = _.cloneDeep(value)
                if (originRows && originRows.length) {
                    sortByRows(value, originRows)
                    value = res
                }
            }
            fields[i][type] = value
            return
        }
    }
    function sortByRows (_rows = [], _originRows = []) {
        if (res.length === _rows.length) {
            return res
        } else {
            for (let i = 0; i < _originRows.length; i++) {
                if (!_originRows[i]) continue
                const _id = _originRows[i].id
                if (_rows.indexOf(_id) > -1) {
                    res.push(_id)
                    const _children = _originRows[i].children
                    if (_children && _children.length) {
                        sortByRows(_rows, _children)
                    } else {
                        return res
                    }
                }
            }
        }
    }
}

/**
 * filterDisabledKeys 设置某些字段不可选
 * @param {*} rows 要处理的数组
 * @param {*} key 判断依据
 */
export function filterDisabledKeys (rows = [], key = 'isOwnOrg') {
    if (rows && rows.length)
    rows.map((row) => {
        if (row && row[key]) {
            row.disabled = false
        } else {
            row.disabled = true
        }
    })
}


/**
 * 多余20个字符进行截取替换
 * @param value
 * @returns {string}
 */
export function ellipsis(value) {
    if (typeof value !== 'string') return ''; // null || undefined
    if (value.length > 20) {
        return value.slice(0, 20) + '...'
    }
    return value
}
