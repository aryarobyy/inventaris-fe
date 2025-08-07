<template>
  <div>
    <TableAdmin 
    />
  </div>
</template>

<script setup lang="ts">
import TableAdmin from '../../components/TableAdmin.vue';
import type { AdminModel } from '../../models/admin.model';

interface Props {
  showAction?: boolean;
  admin: AdminModel;
}

const props = withDefaults(defineProps<Props>(), {
  showAction: false,
})

</script>