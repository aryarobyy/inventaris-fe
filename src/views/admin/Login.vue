<template>
<div class="min-h-screen flex flex-col justify-center items-center font-sans">
  <h1 class="text-4xl font-bold text-white mb-8 drop-shadow-sm">Login</h1>
  <div class="gap-5 flex flex-col w-120 p-10 bg-second rounded-2xl">
    <Input
      text="Login" 
      v-model="username"
      type="text" 
      id="username" 
      title="Username"
      placeHolder="Enter Your Username"
      :required="true"
      
    />    
    
    <Input 
      text="password" 
      v-model="password" 
      type="password" 
      title="Password"
      :required="true"
      placeHolder="Enter Your password"
    />

    <Button
      text="Login"
      @click="handleLogin"
      class="w-full"
    />
    <MyPopup
      :isOpen="showUserExistsPopup"
      @close="closePopup"
      @left-click="cancelUser"
      @right-click="$router.push('/')"
      :variant="popupVariant"
      :title="popupTitle"
      :message="popupMessage"
      :detailMessage="popupDetailMessage"
      :showIcon="true"
      :showLeftButton="true"
      :showRightButton="showRightButton"
      leftButtonText="Batalkan"
      rightButtonText="Lanjut"
    />
  </div>
  <Loading :isLoading="isLoading" />
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Input from '../../components/Input.vue';
import Button from '../../components/Button.vue';
import { loginAdmin } from '../../provider/admin.provider';
import type { LoginAdminModel } from '../../models/admin.model';
import { postLocalAdmin } from '../../libs/localData';
import { ADMINKEY } from '../../core/contants';
import { useRouter } from 'vue-router';
import MyPopup from '../../components/Popup.vue';
import Loading from '../../components/Loading.vue';

const username = ref<string>('');
const password = ref<string>('');

const router = useRouter();

const showUserExistsPopup = ref(false);
const popupTitle = ref('');
const popupMessage = ref('');
const popupDetailMessage = ref('');
const popupVariant = ref<'info' | 'error'>('info');
const showRightButton = ref(true);
const isLoading = ref(false);

const cancelUser = () => {
  showUserExistsPopup.value = false;
};

const handleLogin = async () => {
  showUserExistsPopup.value = false;
  
  if (!username.value && !password.value) {
    popupVariant.value = 'error';
    showRightButton.value = false;
    popupTitle.value = 'Input Tidak Lengkap';
    popupMessage.value = 'Username dan Password harus diisi untuk melakukan login.';
    popupDetailMessage.value = '';
    showUserExistsPopup.value = true;
    return;
  }

  isLoading.value = true;
  
  try {
    const loginData : LoginAdminModel = {
      username: username.value,
      password: password.value
    }
    
    const data = await loginAdmin(loginData);
    
    if(!data) {
      popupVariant.value = 'error';
      showRightButton.value = false;
      popupTitle.value = 'Data Tidak Ditemukan!';
      popupMessage.value = `Tidak ada data admin dengan username "${username.value}".`;
      popupDetailMessage.value = 'Pastikan username dan password yang Anda masukkan benar.';
      showUserExistsPopup.value = true;
      isLoading.value = false;
      return;
    }
    
    postLocalAdmin(data, ADMINKEY);
    
    setTimeout(() => {
      isLoading.value = false;
      router.push("/admin");
    }, 1000);
    
  } catch (error) {
    console.error('Login error:', error);
    popupVariant.value = 'error';
    showRightButton.value = false;
    popupTitle.value = 'Terjadi Kesalahan!';
    popupMessage.value = 'Login gagal. Silakan periksa koneksi internet dan coba lagi.';
    popupDetailMessage.value = 'Jika masalah berlanjut, hubungi administrator sistem.';
    showUserExistsPopup.value = true;
    isLoading.value = false;
  }
}

const closePopup = () => {
  showUserExistsPopup.value = false;
  showRightButton.value = true;
}
</script>