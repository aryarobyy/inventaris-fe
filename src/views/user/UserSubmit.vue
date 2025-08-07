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
          v-model="identityNumber"
          title="Identity Number"
          placeHolder="Enter your Identity Number (NIM/NIK/etc)"
          :required="true"
          type="text"
          id="identityNumber"
        />
        <MyDropdown
          v-model="selectedMajor"
          :options="majorOptions"
          label="Major Name"
          valueKey="value"
          labelKey="label"
          :multiple="false"
          id="majorName"
        />
        <MyInput
          v-model="phoneNumber"
          title="Phone Number"
          placeHolder="Enter your Phone Number"
          :required="true"
          type="tel"
          id="phoneNumber"
        />
        <Button
          @click="handleSubmit"
          text="Submit"
          class="w-full mt-4"
        />
      </div>

      <div class="text-center mt-6 text-sm text-gray-600">
        <p>Sudah pernah pinjam?</p>
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
import { ref, onMounted, computed} from 'vue';
import MyInput from '../../components/Input.vue';
import MyDropdown from '../../components/Dropdown.vue';
import type { PostUserModel, UserModel } from '../../models/user.model';
import MyPopup from '../../components/Popup.vue';
import { useRouter } from 'vue-router';
import Button from '../../components/Button.vue';
import { getLocalData, postLocalUser, removeLocalData } from '../../libs/localData';
import { USERKEY } from '../../core/contants';
import { MajorName } from '../../models/enums';
import { getUserByIdentity } from '../../provider/user.provider';

interface Props {
  isLoan?: boolean
}

const props = withDefaults(defineProps<Props>(),{
    isLoan: true
  })

const router = useRouter();

const name = ref('');
const identityNumber = ref('');
const selectedMajor = ref<{value: string, label: string} | null>(null);
const phoneNumber = ref('');

const majorOptions = ref([
  { value: MajorName.KEBIDANAN, label: 'Kebidanan' },
  { value: MajorName.KEPERAWATAN, label: 'Keperawatan' },
  { value: MajorName.PROMKES, label: 'Promosi Kesehatan' },
  { value: MajorName.TLM, label: 'Teknologi Laboratorium Medis' },
  { value: MajorName.FISIO, label: 'Fisioterapi' },
  { value: MajorName.REKTORAT, label: 'Rektorat' },
]);

const showUserExistsPopup = ref(false);
const popupTitle = ref('');
const popupMessage = ref('');
const popupDetailMessage = ref('');
const popupVariant = ref<'info' | 'error'>('info');
const showRightButton = ref(true);

const majorName = computed(() => selectedMajor.value?.label || '');

onMounted(() => {
  const existingUser: UserModel = getLocalData(USERKEY);
  if (existingUser) {
    popupTitle.value = 'Data Peminjam Terdeteksi!';
    popupMessage.value = `Pengguna dengan ID ${existingUser.identityNumber} sudah pernah mendaftar.`;
    popupDetailMessage.value = `
      Nama: ${existingUser.name}
      Jurusan: ${existingUser.majorName}
      No. Telepon: ${existingUser.phoneNumber}
    `.replace(/^\s+|\s+$/gm, '').replace(/\n/g, '<br/>');

    showUserExistsPopup.value = true;
  }
});

const goToLoan = () => {
  showUserExistsPopup.value = false;
  props.isLoan ? router.push('/loan/item') : router.push('/booking/request');
};

const cancelUser = () => {
  removeLocalData(USERKEY);
  showUserExistsPopup.value = false;
  
  name.value = '';
  identityNumber.value = '';
  selectedMajor.value = null;
  phoneNumber.value = '';
};

const handleSubmit = async () => {
  showUserExistsPopup.value = false;

  if (!identityNumber.value) {
    popupVariant.value = 'error';
    showRightButton.value = false;
    popupTitle.value = 'Input Tidak Lengkap';
    popupMessage.value = 'Nomor Identitas harus diisi untuk melakukan pendaftaran.';
    popupDetailMessage.value = '';
    showUserExistsPopup.value = true;
    return;
  }

  if (!selectedMajor.value) {
    popupVariant.value = 'error';
    showRightButton.value = false;
    popupTitle.value = 'Input Tidak Lengkap';
    popupMessage.value = 'Jurusan harus dipilih untuk melakukan pendaftaran.';
    popupDetailMessage.value = '';
    showUserExistsPopup.value = true;
    return;
  }

  if (!name.value || !phoneNumber.value) {
    popupVariant.value = 'error';
    showRightButton.value = false;
    popupTitle.value = 'Input Tidak Lengkap';
    popupMessage.value = 'Semua field harus diisi untuk melakukan pendaftaran.';
    popupDetailMessage.value = '';
    showUserExistsPopup.value = true;
    return;
  }

  try {
    const existingUser = await getUserByIdentity(identityNumber.value);
    
    if (existingUser && existingUser.identityNumber) {
      popupTitle.value = 'Data Peminjam Terdeteksi!';
      popupMessage.value = `Pengguna dengan ID ${existingUser.identityNumber} sudah pernah mendaftar.`;
      popupDetailMessage.value = `
        Nama: ${existingUser.name}
        Jurusan: ${existingUser.majorName}
        No. Telepon: ${existingUser.phoneNumber}
      `.replace(/^\s+|\s+$/gm, '').replace(/\n/g, '<br/>');
      showUserExistsPopup.value = true;
      return;
    }

    const userData: PostUserModel = {
      name: name.value,
      identityNumber: identityNumber.value,
      majorName: selectedMajor.value.label,
      phoneNumber: phoneNumber.value,
    };

    postLocalUser(userData, USERKEY);
    console.log('User data submitted successfully!');
    props.isLoan ? router.push('/loan/item'): router.push('/booking/request');

    name.value = '';
    identityNumber.value = '';
    selectedMajor.value = null;
    phoneNumber.value = '';

  } catch (error) {
    console.error('Error during user registration:', error);
    
    const userData: PostUserModel = {
      name: name.value,
      identityNumber: identityNumber.value,
      majorName: selectedMajor.value?.label || '',
      phoneNumber: phoneNumber.value,
    };

    console.log('Saving user data to localStorage due to API error:', userData);
    postLocalUser(userData, USERKEY);
    console.log('User saved to localStorage after API error');
    props.isLoan ? router.push('/loan/item'): router.push('/booking/request');

    name.value = '';
    identityNumber.value = '';
    selectedMajor.value = null;
    phoneNumber.value = '';
  }
};

const closePopup = () => {
  showUserExistsPopup.value = false;
};
</script>