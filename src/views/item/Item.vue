<template>
  <div>
    <TableItem 
      :showAction="showAction ?? false"
    />
  </div>
</template>

<script setup lang="ts">
  import TableItem from '../../components/TableItem.vue';
import { ADMINKEY } from '../../core/contants';
import { getLocalData } from '../../libs/localData';

  const adminData = getLocalData(ADMINKEY);
  let showAction;

  if(adminData && adminData !== null && adminData !== undefined) {
    showAction = true;
  } else {
    showAction = false;
  }
</script>

<style scoped>

</style>