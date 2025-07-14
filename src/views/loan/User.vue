<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-2xl font-bold mb-4">Data Peminjam</h1>

    <div class="card p-6 bg-blue-50 shadow-md rounded-lg w-96">
      <form @submit.prevent="handleSubmit">
        <div class="gap-5 flex flex-col">
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
        </div>

        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 mt-4">
          Daftar Peminjam
        </button>
      </form>
    </div>

    <MyPopup
      :isOpen="showUserExistsPopup"
      @close="closePopup"
      @left-click="cancelUser"
      @right-click="goToLoan"
      variant="info"
      :title="popupTitle"
      :message="popupMessage"
      :detailMessage="popupDetailMessage"
      :showIcon="true"
      :showLeftButton="true"
      :showRightButton="true"
      leftButtonText="Batalkan"
      rightButtonText="Lanjut"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted} from 'vue';
import MyInput from '../../components/Input.vue';
import { getLocalUser, postLocalUser, removeLocalUser } from '../../libs/userData';
import type { PostUserModel } from '../../models/user.model';
import MyPopup from '../../components/Popup.vue';
import { useRouter } from 'vue-router';

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

onMounted(() => {
  const existingUser = getLocalUser();
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
  router.push('/loan/item');
};

const cancelUser = () => {
  removeLocalUser();
  showUserExistsPopup.value = false;
};

const handleSubmit = async () => {
  showUserExistsPopup.value = false;

  if (!studentId.value) {
    popupTitle.value = 'Input Tidak Lengkap';
    popupMessage.value = 'Nomor Induk Mahasiswa (NIM) harus diisi untuk melakukan pendaftaran.';
    popupDetailMessage.value = '';
    showUserExistsPopup.value = true;
    return;
  }

  try {
    const existingUser = getLocalUser();

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

    postLocalUser(userData);
    console.log('User data submitted successfully!');
    router.push('/loan/item');

    name.value = '';
    studentId.value = '';
    majorName.value = '';
    academicYear.value = '';
    phoneNumber.value = '';
    organization.value = '';

  } catch (error) {
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