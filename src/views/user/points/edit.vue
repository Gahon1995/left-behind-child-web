<template>
  <point-detail :is-edit="true"/>
</template>

<script>
import PointDetail from './components/PointDetail'
export default {
  name: 'EditForm',
  components: { PointDetail }
}
</script>
