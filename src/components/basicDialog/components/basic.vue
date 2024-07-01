<script>
export default {
    props: {
        query: Object,
        searchItem: Object,
        render: Function
    },
    render(h) {
        return this.render(h, { query: this.query, searchItem: this.searchItem })
    }
}
</script>