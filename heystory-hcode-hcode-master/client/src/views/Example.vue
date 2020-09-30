<template>
  <div class="page page-index" ref="container">
    <div></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      initState: false
    }
  },
  components: {},
  computed: {
  },
  filters: {
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {
    init () {
    },
    navBack () {
      if (history.length > 1) {
        window.history.go(-1)
      } else {
        window.location.href = 'http://39.108.59.150/dg/index'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/style/mixin.scss';

.container{
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
.navbar{
  background-color: #fff;
  position: absolute;
  z-index: 10;
  left: 0;
  right: 0;
  top: 0;
  box-shadow: 0 10px 10px 0 rgba(220, 220, 220, 0.5);
}
</style>
