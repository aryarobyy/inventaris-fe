<template>
  <div class="min-h-screen flex items-center justify-center bg-blue-100 px-4">
    <div class="card w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Register</h2>

      <div class="space-y-5">
        <MyInput
          v-model="name"
          title="Name"
          placeHolder="Enter your name"
          :required="true"
          type="text"
          id="name"
        />
        <MyInput
          v-model="studentId"
          title="Student ID"
          placeHolder="Enter your Student ID"
          :required="true"
          type="text"
          id="studentId"
        />
        <MyInput
          v-model="majorName"
          title="Major Name"
          placeHolder="Enter your Major Name"
          :required="true"
          type="text"
          id="majorName"
        />
        <MyInput
          v-model="academicYear"
          title="Academic Year"
          placeHolder="Enter your Academic Year"
          :required="true"
          type="text"
          id="academicYear"
        />
        <MyInput
          v-model="phoneNumber"
          title="Phone Number"
          placeHolder="Enter your Phone Number"
          :required="true"
          type="tel"
          id="phoneNumber"
        />
        <MyInput
          v-model="organization"
          title="Organization"
          placeHolder="Enter your Organization"
          :required="true"
          type="text"
          id="organization"
        />

        <Button
          @click="handleSubmit"
          text="Submit"
          class="w-full mt-4"
        />
      </div>

      <div class="text-center mt-6 text-sm text-gray-600">
        <p>Sudah punya akun?</p>
        <p
          @click="props.isLoan ? router.push('/user/login/loan'): router.push('/user/login/booking')"
          class="text-blue-600 hover:underline cursor-pointer font-medium mt-1"
        >
          Login di sini
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
import type { PostUserModel } from '../../models/user.model';
import MyPopup from '../../components/Popup.vue';
import { useRouter } from 'vue-router';
import Button from '../../components/Button.vue';
import { getLocalData, postLocalUser, removeLocalData } from '../../libs/localData';
import { USERKEY } from '../../core/contants';

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

const name = ref('');
const studentId = ref('');
const majorName = ref('');
const academicYear = ref('');
const phoneNumber = ref('');
const organization = ref('');

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
    popupMessage.value = `Pengguna dengan NIM ${existingUser.studentId} sudah pernah mendaftar.`;
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

  if (!studentId.value) {
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

    if (existingUser) {
      popupTitle.value = 'Pengguna Sudah Terdaftar!';
      popupMessage.value = `Pengguna dengan NIM ${studentId.value} sudah ada.`;
      popupDetailMessage.value = `
        Nama: ${existingUser.name}
        Jurusan: ${existingUser.majorName}
        Tahun Akademik: ${existingUser.academicYear}
        No. Telepon: ${existingUser.phoneNumber}
        Organisasi: ${existingUser.organization}
      `.replace(/^\s+|\s+$/gm, '').replace(/\n/g, '<br/>');

      showUserExistsPopup.value = true;
      return;
    }

    const userData: PostUserModel = {
      name: name.value,
      studentId: studentId.value,
      majorName: majorName.value,
      academicYear: academicYear.value,
      phoneNumber: phoneNumber.value,
      organization: organization.value,
    };

    postLocalUser(userData, USERKEY);
    console.log('User data submitted successfully!');
    props.isLoan ? router.push('/loan/item'): router.push('/booking/request');

    name.value = '';
    studentId.value = '';
    majorName.value = '';
    academicYear.value = '';
    phoneNumber.value = '';
    organization.value = '';

  } catch (error) {
    popupVariant.value = 'error';
    showRightButton.value = false;
    console.error('Error during user registration:', error);
    popupTitle.value = 'Terjadi Kesalahan!';
    popupMessage.value = 'Gagal memproses pendaftaran. Silakan coba lagi.';
    popupDetailMessage.value = '';
    showUserExistsPopup.value = true;
  }
};

const closePopup = () => {
  showUserExistsPopup.value = false;
};
</script>