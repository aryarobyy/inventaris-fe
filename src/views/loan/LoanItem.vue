<template>
  <div class="flex flex-col items-center justify-center min-h-screen gap-8">
    <div class="card p-6 bg-blue-50 shadow-md rounded-lg w-full max-w-2xl">
      <h3 class="text-lg font-semibold mb-4">Form Peminjaman</h3>
      
      <form>
        <div v-if="!user" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p class="text-sm">⚠️ User Tidak ada. Please login again.</p>
        </div>

        <div v-if="user" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          <p class="text-sm">✅ Logged in as: {{ user.name || 'Unknown' }}</p>
        </div>

        <div class="gap-5 flex flex-col">
          <DateInput 
            v-model="loanDate"
            label="Loan Date"
            name="Loan Date"
          />
          <DateInput 
            v-model="dueDate"
            label="Until"
            name="Until"
          />
          
          <div>
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-medium">Selected Items</h4>
              <span class="text-xs text-gray-500">{{ allSelectedItems.length }} items selected</span>
            </div>
            
            <div v-if="allSelectedItems.length > 0" class="mb-4 p-3 bg-gray-50 rounded border max-h-60 overflow-y-auto">
              <div v-for="item in allSelectedItems" :key="item.id" class="flex items-center justify-between py-2 border-b last:border-b-0">
                <div class="flex-1">
                  <span class="font-medium">{{ item.name }}</span>
                  <span v-if="item.brand" class="text-gray-500"> - {{ item.brand }}</span>
                  <div class="text-xs text-gray-400">{{ getCategoryLabel(item.category) }}</div>
                </div>
                <div class="flex items-center gap-2">
                  <Input
                    :modelValue="String(item.quantity)"
                    @update:modelValue="val => updateItemQuantity(item.id, val)"
                    type="number"
                    placeHolder="Qty"
                  />
                  <Button
                    type="button"
                    text="×"
                    @click="removeSelectedItem(item.id)"
                    variant="destructive"
                    class="text-red-500 hover:bg-red-100 px-2 py-1 text-sm"
                  />
                </div>
              </div>
            </div>

            <div class="border rounded p-4 bg-white">
              <h5 class="text-sm font-medium mb-3">Item Yang dipinjam</h5>
              
              <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Select Category</label>
                <Dropdown
                  v-model="selectedCategory"
                  :options="categoryOptions"
                  placeHolder="Choose category"
                  valueKey="value"
                  labelKey="label"
                />
              </div>

              <div v-if="selectedCategory.value !== null">
                <div v-if="isLoadingItems" class="flex items-center justify-center p-4">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span class="ml-2 text-gray-600">Loading items...</span>
                </div>
                
                <div v-else>
                  <div v-if="items.length === 0" class="p-3 text-center text-gray-500 bg-gray-100 rounded">
                    Tidak ada item tersedia untuk kategori ini
                  </div>
                  
                  <div v-else class="max-h-48 overflow-y-auto border rounded">
                    <div 
                      v-for="item in items" 
                      :key="item.id"
                      class="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <div class="flex-1">
                        <span class="font-medium">{{ item.name }}</span>
                        <span v-if="item.brand" class="text-gray-500"> - {{ item.brand }}</span>
                        <div class="text-xs text-gray-400">Stock: {{ item.borrowedQuantity }}</div>
                      </div>
                      <Button
                        type="button"
                        :text="isItemAlreadySelected(item.id) ? 'Added' : 'Add'"
                        @click="addItemToSelection(item)"
                        :disabled="isItemAlreadySelected(item.id)"
                        :class="isItemAlreadySelected(item.id) ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'"
                        class="text-white px-3 py-1 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex gap-3">
          <Button 
            @click="handleSubmit"
            text="Submit"
            class="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300"
            :disabled="!isFormValid"
          />
          <Button 
            type="button" 
            text="Reset"
            @click="resetForm"
            variant="destructive"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import DateInput from '../../components/DateInput.vue'
import Button from '../../components/Button.vue'
import Dropdown from '../../components/Dropdown.vue'
import Input from '../../components/Input.vue'
import { getItemByCat } from '../../provider/item.provider'
import { ItemCategory, LoanStatus } from '../../models/enums'
import type { ItemModel } from '../../models/item.model'
import type { PostLoanModel } from '../../models/loan.model'
import { postLoan } from '../../provider/loan.provider'
import { postUser } from '../../provider/user.provider'
import { postLocalItem, removeLocalItem } from '../../libs/itemData'
import { getLocalData } from '../../libs/localData'
import { USERKEY } from '../../core/contants'
import type { UserModel } from '../../models/user.model'
import router from '../../router'

const loanDate = ref<string>('')
const dueDate = ref<string>('')

const getUserData = (): UserModel | null => {
  try {
    const userData = getLocalData(USERKEY)
    console.log('Raw user data from localStorage:', userData)
    
    if (!userData || !userData.data) {
      console.warn('No user data found in localStorage')
      return null
    }
    
    const user = userData.data
    console.log('Parsed user data:', user)
    
    return user
  } catch (error) {
    console.error('Error getting user data:', error)
    return null
  }
}

const user = ref<UserModel | null>(getUserData())

const selectedCategory = ref<{ label: string; value: ItemCategory | null }>({
  label: '--Pilih--',
  value: null
})

const items = ref<ItemModel[]>([])
const isLoadingItems = ref(false)

const allSelectedItems = ref<(ItemModel & { quantity: number })[]>([])

const categoryOptions = Object.entries(ItemCategory).map(([key, value]) => ({
  label: key.replace(/_/g, ' ').toUpperCase(),
  value,
}))

watch(selectedCategory, async (newCategory) => {
  if (newCategory.value !== null) {
    isLoadingItems.value = true
    try {
      const response = await getItemByCat(newCategory.value)
      items.value = Array.isArray(response) ? response : []
    } catch (error) {
      console.error('Error fetching items:', error)
      items.value = []
    } finally {
      isLoadingItems.value = false
    }
  } else {
    items.value = []
  }
}, { deep: true })

const getCategoryLabel = (category: ItemCategory) => {
  const entry = Object.entries(ItemCategory).find(([, value]) => value === category)
  return entry ? entry[0].replace(/_/g, ' ').toUpperCase() : 'Unknown'
}

const isItemAlreadySelected = (itemId: number) => {
  return allSelectedItems.value.some(item => item.id === itemId)
}

const addItemToSelection = (item: ItemModel) => {
  if (!isItemAlreadySelected(item.id)) {
    allSelectedItems.value.push({
      ...item,
      quantity: 1
    })
    
    postLocalItem(allSelectedItems.value)
  }
}

const removeSelectedItem = (itemId: number) => {
  const index = allSelectedItems.value.findIndex(item => item.id === itemId)
  if (index >= 0) {
    allSelectedItems.value.splice(index, 1)
    
    postLocalItem(allSelectedItems.value)
  }
}

const updateItemQuantity = (itemId: number, value: string) => {
  const item = allSelectedItems.value.find(item => item.id === itemId)
  if (item) {
    const quantity = parseInt(value) || 1
    item.quantity = Math.max(1, quantity) 

    postLocalItem(allSelectedItems.value,)
  }
}

const isFormValid = computed(() => {
  return loanDate.value && 
         dueDate.value && 
         user.value !== null && 
         allSelectedItems.value.length > 0 &&
         allSelectedItems.value.every(item => item.quantity && item.quantity > 0)
})

const handleSubmit = async () => {
  if (!user.value) {
    console.error('User not found. Please login again.')
    alert('User tidak ditemukan. Login lagi..')
    return
  }

  if (!loanDate.value || !dueDate.value || allSelectedItems.value.length === 0) {
    console.warn('Form tidak valid')
    alert('Isi semua field yang diperlukan.')
    return
  }

  const hasInvalidQuantities = allSelectedItems.value.some(item => 
    !item.quantity || item.quantity <= 0
  )

  if (hasInvalidQuantities) {
    console.warn('Semua item harus memiliki quantity yang valid')
    alert('Semua item harus memiliki quantity yang valid')
    return
  }

  try {
    const createdUser = await postUser(user.value)

    const formData: PostLoanModel = {
      borrowerId: createdUser.id,
      loanDate: loanDate.value,
      dueDate: dueDate.value,
      loanItems: allSelectedItems.value.map(item => ({
        itemId: item.id,
        borrowedQuantity: item.quantity
      })),
      loanStatus: LoanStatus.PENDING,
    }

    await postLoan(formData)
    localStorage.removeItem(USERKEY)
    removeLocalItem()

    alert('Berhasil Meminjam successfully!')
    router.push("/")
    resetForm()
    user.value = null

  } catch (error: any) {
    console.error('Error in submission process:', error)
    
    if (error.message?.includes('user')) {
      alert('Error Membuat user. Cek datamu lagi.')
    } else if (error.message?.includes('loan')) {
      alert('Error submit form. Coba Lagi.')
    } else {
      alert('Error tidak diketahui. Coba lagi.')
    }
  }
}

const resetForm = () => {
  loanDate.value = ''
  dueDate.value = ''
  selectedCategory.value = { label: '--Pilih--', value: null }
  items.value = []
  allSelectedItems.value = []
  
  localStorage.removeItem(USERKEY)
  removeLocalItem()
  
  user.value = null
}
</script>