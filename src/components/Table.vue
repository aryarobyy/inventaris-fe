<template>
  <div>
    <!-- Mobile View -->
    <div class="block sm:hidden space-y-3">
      <div v-for="loan in loansData" :key="loan.id" class="bg-white rounded-lg shadow p-3">
        <div class="flex justify-between items-start mb-1">
          <div>
            <p class="text-sm text-gray-600">ID: {{ loan.id }}</p>
            <p class="font-semibold">{{ loan.borrower.name }}</p>
          </div>
          <span :class="[statusClass(loan.loanStatus)]">{{ loan.loanStatus }}</span>
        </div>
        <div class="mb-1">
          <p class="text-sm text-gray-600 mb-1">Barang:</p>
          <ul class="text-sm text-gray-700">
            <li v-for="item in loan.loanItems" :key="item.item.id">• {{ item.item.name }}</li>
          </ul>
        </div>
        <div class="flex justify-between text-sm text-gray-600">
          <p>Pinjam: {{ formatDate(loan.loanDate) }}</p>
          <p>Tempo: {{ formatDate(loan.dueDate) }}</p>
        </div>
      </div>
    </div>

    <!-- Desktop View -->
    <div class="hidden sm:block">
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                <th 
                  v-for="(label, index) in labels" 
                  :key="index" 
                  class="p-2 text-left whitespace-nowrap"
                >
                  {{ label }}
                </th>
              </tr>

            </thead>
            <tbody class="text-gray-700 text-sm divide-y divide-gray-200">
              <tr v-for="loan in loansData" :key="loan.id" class="hover:bg-gray-50">
                <td class="p-2 whitespace-nowrap">{{ loan.id }}</td>
                <td class="p-2 whitespace-nowrap">{{ loan.borrower.name }}</td>
                <td class="p-2">
                  <ul class="list-disc pl-4">
                    <li v-for="item in loan.loanItems" :key="item.item.id">{{ item.item.name }}</li>
                  </ul>
                </td>
                <td class="p-2 whitespace-nowrap">{{ formatDate(loan.loanDate) }}</td>
                <td class="p-2 whitespace-nowrap">{{ formatDate(loan.dueDate) }}</td>
                <td class="p-2 whitespace-nowrap">{{ formatDate(loan.returnDate) }}</td>
                <td class="p-2 whitespace-nowrap">
                  <span :class="[statusClass(loan.loanStatus)]">{{ loan.loanStatus }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LoanModel } from '../models/loan.model';

defineProps<{
  labels: string[]
  loansData: LoanModel[]
  formatDate: (date: string | null | undefined) => string
  statusClass: (status: string) => string
}>()

</script>
