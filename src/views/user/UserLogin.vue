<template>
  <div class="min-h-screen flex items-center justify-center bg-blue-100 px-4">
    <div class="card w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Daftar</h2>

      <div class="space-y-5">
        <MyInput
          v-model="identityNumber"
          title="Student ID"
          placeHolder="Enter your Student ID"
          :required="true"
          type="text"
          id="identityNumber"
        />
        <Button 
          @click="handleSubmit"
          text="Submit" 
          class="w-full mt-4" />
      </div>

      <div class="text-center mt-6 text-sm text-gray-600">
        <p>Belum Punya akun?</p>
        <p
          @click="router.push('/user/loan')"
          class="text-blue-600 hover:underline cursor-pointer font-medium mt-1"
        >
          Daftar di sini
        </p>
      </div>
    </div>
    <MyPopup
      :isOpen="showUserExistsPopup"
      @close="closePopup"
      @left-click="cancelUser"
      @right-click="goToLoan"
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
</template>

<script lang="ts" setup>
import { ref, onMounted} from 'vue';
import MyInput from '../../components/Input.vue';
import MyPopup from '../../components/Popup.vue';
import { useRouter } from 'vue-router';
import Button from '../../components/Button.vue';
import { getLocalData, postLocalUser, removeLocalData } from '../../libs/localData';
import { USERKEY } from '../../core/contants';
import { getUserByIdentity } from '../../provider/user.provider';

interface Props {
  isLoan?: boolean
  /**
   * @default true
   */
}

const props = withDefaults(defineProps<Props>(),{
    isLoan: true
  })

const router = useRouter();

const identityNumber = ref<string>('');

const showUserExistsPopup = ref(false);
const popupTitle = ref('');
const popupMessage = ref('');
const popupDetailMessage = ref('');
const popupVariant = ref<'info' | 'error'>('info');
const showRightButton = ref(true);

onMounted(() => {
  const existingUser = getLocalData(USERKEY);
  if (existingUser) {
    popupTitle.value = 'Data Peminjam Terdeteksi!';
    popupMessage.value = `Pengguna dengan NIM ${existingUser.identityNumber} sudah pernah mendaftar.`;
    popupDetailMessage.value = `
      Nama: ${existingUser.name}
      Jurusan: ${existingUser.majorName}
      Tahun Akademik: ${existingUser.academicYear}
      No. Telepon: ${existingUser.phoneNumber}
      Organisasi: ${existingUser.organization}
    `.replace(/^\s+|\s+$/gm, '').replace(/\n/g, '<br/>');

    showUserExistsPopup.value = true;
  }
});

const goToLoan = () => {
  showUserExistsPopup.value = false;
  props.isLoan ? router.push('/loan/item'): router.push('/booking/request');
};

const cancelUser = () => {
  removeLocalData(USERKEY);
  showUserExistsPopup.value = false;
};

const handleSubmit = async () => {
  showUserExistsPopup.value = false;
  if (!identityNumber.value) {
    popupVariant.value = 'error';
    showRightButton.value = false;
    popupTitle.value = 'Input Tidak Lengkap';
    popupMessage.value = 'Nomor Induk Mahasiswa (NIM) harus diisi untuk melakukan pendaftaran.';
    popupDetailMessage.value = '';
    showUserExistsPopup.value = true;
    return;
  }
  try {
    const existingUser = getLocalData(USERKEY);

    if (existingUser && existingUser.identityNumber === identityNumber.value) {
      popupVariant.value = 'info';
      popupTitle.value = 'Pengguna Sudah Terdaftar!';
      popupMessage.value = `Pengguna dengan NIM ${identityNumber.value} sudah ada.`;
      popupDetailMessage.value = `
        Nama: ${existingUser.name}
        Jurusan: ${existingUser.majorName}
        Tahun Akademik: ${existingUser.academicYear}
        No. Telepon: ${existingUser.phoneNumber}
        Organisasi: ${existingUser.organization}
      `.trim().replace(/\n/g, '<br/>');

      showUserExistsPopup.value = true;
      return;
    }

    const userData = await getUserByIdentity(identityNumber.value);
    console.log('User Data:', userData);
    
    if (!userData) {
      popupVariant.value = 'error';
      showRightButton.value = false;
      popupVariant.value = 'error';
      popupTitle.value = 'Data Tidak Ditemukan!';
      popupMessage.value = `Tidak ada data pengguna dengan NIM ${identityNumber.value}.`;
      popupDetailMessage.value = '';
      showUserExistsPopup.value = true;
      return;
    }

    postLocalUser(userData, USERKEY);
    props.isLoan ? router.push('/loan/item') : router.push('/booking/request');

    identityNumber.value = '';
  } catch (error) {
    console.error('Error during user registration:', error);
    popupVariant.value = 'error';
    showRightButton.value = false;
    popupTitle.value = 'Terjadi Kesalahan!';
    popupMessage.value = 'Gagal memproses pendaftaran. Silakan coba lagi.';
    popupDetailMessage.value = '';
    showUserExistsPopup.value = true;
  }
};

const closePopup = () => {
  showUserExistsPopup.value = false;
  showRightButton.value = true;
}
</script>