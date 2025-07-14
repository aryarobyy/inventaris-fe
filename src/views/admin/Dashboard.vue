<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <input v-model="search" placeholder="Cari barang..." class="p-2 border rounded w-1/3" />
      <select v-model="filterStatus" class="p-2 border rounded">
        <option value="">Semua Status</option>
        <option value="pending">Pending</option>
        <option value="approved">Disetujui</option>
        <option value="rejected">Ditolak</option>
      </select>
    </div>

    <table class="min-w-full table-auto border-collapse">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2 border">No</th>
          <th class="p-2 border">Nama Barang</th>
          <th class="p-2 border">Peminjam</th>
          <th class="p-2 border">Tanggal</th>
          <th class="p-2 border">Status</th>
          <th class="p-2 border">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(loan, i) in filteredLoans"
          :key="loan.id"
          class="hover:bg-gray-50 transition"
        >
          <td class="p-2 border text-center">{{ i + 1 }}</td>
          <td class="p-2 border">{{ loan.item }}</td>
          <td class="p-2 border">{{ loan.borrower }}</td>
          <td class="p-2 border">{{ loan.date }}</td>
          <td class="p-2 border">
            <span
              :class="[
                'px-2 py-1 rounded text-white text-sm',
                loan.status === 'pending'
                  ? 'bg-yellow-500'
                  : loan.status === 'approved'
                  ? 'bg-green-500'
                  : 'bg-red-500'
              ]"
            >
              {{ loan.status }}
            </span>
          </td>
          <td class="p-2 border space-x-2">
            <button class="text-blue-600 hover:underline">Detail</button>
            <button class="text-green-600 hover:underline">Setujui</button>
            <button class="text-red-600 hover:underline">Tolak</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

type Loan = {
  id: number
  item: string
  borrower: string
  date: string
  status: 'pending' | 'approved' | 'rejected'
}

const search = ref('')
const filterStatus = ref('')

const loans = ref<Loan[]>([
  { id: 1, item: 'Proyektor', borrower: 'Andi', date: '2025-07-10', status: 'pending' },
  { id: 2, item: 'Laptop', borrower: 'Budi', date: '2025-07-09', status: 'approved' },
  { id: 3, item: 'HDMI Cable', borrower: 'Citra', date: '2025-07-08', status: 'rejected' }
])

const filteredLoans = computed(() => {
  return loans.value.filter(
    (loan) =>
      (loan.item.toLowerCase().includes(search.value.toLowerCase()) ||
        loan.borrower.toLowerCase().includes(search.value.toLowerCase())) &&
      (filterStatus.value === '' || loan.status === filterStatus.value)
  )
})
</script>