<template>
  <div class="table-footer">
    <p class="page-info">{{result}} trong {{totalHotels}} khách sạn</p>
    <paginate
      :page-count="totalPages"
      :page-range="3"
      :margin-pages="2"
      :prev-text="'Prev'"
      :next-text="'Next'"
      :click-handler="changePage"
      :container-class="'pages'"
      :page-class="'page-item'">
    </paginate>
  </div>
</template>
<script>
  import Paginate from 'vuejs-paginate'
  export default {
    props: ['totalPages', 'result', 'totalHotels'],
    components: { Paginate },
    methods: {
      changePage: function (current) {
        this.$emit('changePage', current)
      }
    }
  }
</script>