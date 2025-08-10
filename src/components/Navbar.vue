<template>
<nav class="bg-sunset h-20">
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <router-link to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
      <img :src="Logo" class="h-8" alt="Flowbite Logo" />
      <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Inventaris</span>
    </router-link>
    <button data-collapse-toggle="navbar-default" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
      <span class="sr-only">Open main menu</span>
      <AlignJustify  class="w-6 h-6" />
    </button>
    <div class="hidden w-full md:block md:w-auto" id="navbar-default">
      <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 text-xl">
        <li>
          <router-link to="/" class="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">Home</router-link>
        </li>
        <li>
          <router-link to="/item" class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">List Barang</router-link>
        </li>
        <li>
          <router-link to="/loan" class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Ajukan peminjaman</router-link>
        </li>
        <li v-if="user" class="relative">
          <button @click="toggleAdminDropdown" class="flex items-center py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
            Admin
            <ChevronDown :class="['w-4 h-4 ml-1 transition-transform', { 'rotate-180': isAdminDropdownOpen }]" />
          </button>
          
          <div v-show="isAdminDropdownOpen" class="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 z-50">
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
              <li>
                <router-link to="/admin" @click="closeAdminDropdown" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  <LayoutDashboard class="w-4 h-4 inline mr-2" />
                  Dashboard
                </router-link>
              </li>
              <li>
                <router-link to="/admin/add" @click="closeAdminDropdown" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  <Package class="w-4 h-4 inline mr-2" />
                  Kelola Barang
                </router-link>
              </li>
              <li>
                <router-link to="/maintanance" @click="closeAdminDropdown" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  <Users class="w-4 h-4 inline mr-2" />
                  Kelola Pengguna
                </router-link>
              </li>
              <li>
                <router-link to="/maintanance" @click="closeAdminDropdown" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  <BarChart3 class="w-4 h-4 inline mr-2" />
                  Laporan
                </router-link>
              </li>
              <li>
                <hr class="my-1 border-gray-200 dark:border-gray-600" />
              </li>
              <li>
                <router-link to="/maintanance" @click="closeAdminDropdown" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  <Settings class="w-4 h-4 inline mr-2" />
                  Pengaturan
                </router-link>
              </li>
              <li>
                <button @click="handleLogout" class="w-full text-left px-4 py-2 hover:bg-red-100 dark:hover:bg-red-600 text-red-600 dark:text-red-400 dark:hover:text-white">
                  <LogOut class="w-4 h-4 inline mr-2" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </li>
        <li v-if="!user">
          <router-link to="/login" class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Login</router-link>
        </li>
        <li v-if="!user">
          <router-link to="/register" class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Register</router-link>
        </li>
      </ul>
    </div>
  </div>
</nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { ADMINKEY } from '../core/contants';
import { getLocalData, removeLocalData } from '../libs/localData';
import type { AdminModel } from '../models/admin.model';
import Logo from '../assets/logo.png';
import { 
  AlignJustify, 
  ChevronDown, 
  LayoutDashboard, 
  Package, 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut 
} from 'lucide-vue-next';

const router = useRouter();
const isAdminDropdownOpen = ref(false);

const getUserData = (): AdminModel | null => {
  try {
    const userData = getLocalData(ADMINKEY)
    
    if (!userData || !userData) {
      console.warn('No user data found in local storage')
      return null
    }
    const user = userData
    console.log('User data in Navbar:', user)
    
    return user
  } catch (error: any) {
    console.error('Error getting user data:', error.response?.data || error.message)
    return null
  }
}

const user = ref<AdminModel | null>(getUserData())
console.log('User in Navbar:', user.value?.id)

const toggleAdminDropdown = () => {
  isAdminDropdownOpen.value = !isAdminDropdownOpen.value;
}

const closeAdminDropdown = () => {
  isAdminDropdownOpen.value = false;
}

const handleLogout = () => {
  try {
    removeLocalData(ADMINKEY);
    user.value = null;
    closeAdminDropdown();
    router.push('/login');
  } catch (error) {
    console.error('Error during logout:', error);
  }
}

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  const dropdown = target.closest('.relative');
  if (!dropdown && isAdminDropdownOpen.value) {
    closeAdminDropdown();
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>