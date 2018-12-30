<template>
  <point-detail :is-edit="false"/>
</template>

<script>
import PointDetail from './components/PointDetail'
export default {
  name: 'CreateForm',
  components: { PointDetail }
}
</script>
