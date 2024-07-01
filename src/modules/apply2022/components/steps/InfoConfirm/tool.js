export default {
    methods: {
        pickUserData(list = []) {
            // pick(item, ['userCode', 'orgCode', 'ext1', 'ext2', 'ext3', 'ext4', 'ext5', 'ext6', 'ext7', 'ext8', 'ext9', 'ext10', 'ext11', 'ext12', 'ext13', 'ext14', 'ext15', 'ext16', 'ext17', 'ext18', 'ext19', 'ext20'])
            return list.map(item => ({
                userCode: item.userCode,
                orgCode: item.orgCode,
                ext1: item.ext1,
                ext2: item.ext2,
                ext3: item.ext3,
                ext4: item.ext4,
                ext5: item.ext5,
                ext6: item.ext6,
                ext7: item.ext7,
                ext8: item.ext8,
                ext9: item.ext9,
                ext10: item.ext10,
                ext11: item.ext11,
                ext12: item.ext12,
                ext13: item.ext13,
                ext14: item.ext14,
                ext15: item.ext15,
                ext16: item.ext16,
                ext17: item.ext17,
                ext18: item.ext18,
                ext19: item.ext19,
                ext20: item.ext20
            }));
        },
        pickUserDataAssignType(list = []) {
            return list.map(item => ({
                id: item.id,
                orgCode: item.orgId,
                orgName: item.orgName,
                userCode: item.userCode,
                ext1: item.ext1,
                ext2: item.ext2,
                ext3: item.ext3,
                ext4: item.ext4,
                ext5: item.ext5,
                ext6: item.ext6,
                ext7: item.ext7,
                ext8: item.ext8,
                ext9: item.ext9,
                ext10: item.ext10,
                ext11: item.ext11,
                ext12: item.ext12,
                ext13: item.ext13,
                ext14: item.ext14,
                ext15: item.ext15,
                ext16: item.ext16,
                ext17: item.ext17,
                ext18: item.ext18,
                ext19: item.ext19,
                ext20: item.ext20
            }));
        }
    }
};
