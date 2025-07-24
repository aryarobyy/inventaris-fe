<template>
  <div class="flex">
    <div class="flex-1 min-h-screen ">
      <TableLoan />
    </div>
  </div>
</template>

<script lang="ts" setup>
// import Header from '@/components/Header.vue'
// import Sidebar from '@/components/Sidebar.vue'
import { ref, computed } from 'vue'
import TableLoan from '../../components/TableLoan.vue'

type Loan = {
  id: number
  item: string
  borrower: string
  status: 'pending' | 'approved' | 'rejected'
}

const loans = ref<Loan[]>([
  { id: 1, item: 'Proyektor', borrower: 'Andi', status: 'pending' },
  { id: 2, item: 'Laptop', borrower: 'Budi', status: 'approved' },
  { id: 3, item: 'HDMI Cable', borrower: 'Citra', status: 'rejected' },
  { id: 4, item: 'Speaker', borrower: 'Dina', status: 'approved' }
])

const total = computed(() => loans.value.length)
const pending = computed(() => loans.value.filter((l) => l.status === 'pending').length)
const approved = computed(() => loans.value.filter((l) => l.status === 'approved').length)

const latestLoans = computed(() => loans.value.slice(-3).reverse())
</script>
