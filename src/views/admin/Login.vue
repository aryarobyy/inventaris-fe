<template>
<div class="min-h-screen flex flex-col justify-center items-center bg-gray-100 font-sans">
  <h1 class="text-4xl font-bold text-gray-800 mb-8 drop-shadow-sm">Login</h1>
  <div class="gap-5 flex flex-col w-120 p-10 bg-green-200 rounded-2xl">
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
  </div>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Input from '../../components/Input.vue';
import Button from '../../components/Button.vue';
import { loginAdmin } from '../../provider/admin.provider';
import type { LoginAdminModel } from '../../models/admin.model';
import { postLocalData } from '../../libs/localData';
import { ADMINKEY } from '../../core/contants';
import { useRouter } from 'vue-router';

const username = ref<string>('');
const password = ref<string>('');

const router = useRouter()

const handleLogin = async () => {
  try {
    const loginData : LoginAdminModel = {
      username: username.value,
      password: password.value
    }
    const data = await loginAdmin(loginData);
    postLocalData(data.data, ADMINKEY)
    router.push("/admin")
  } catch (error) {
    console.error(error)
  }
}
</script>
