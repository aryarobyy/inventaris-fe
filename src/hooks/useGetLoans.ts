import { ref, computed, onMounted } from 'vue'
import type { LoanModel } from '../models/loan.model'
import { getLoans } from '../provider/loan.provider';

const useGetLoans = () => {
  const loans = ref<LoanModel[]>([]);
  const isLoading = ref(true); 
  const error = ref<string | null>(null);

  onMounted( async () => {
    try {
      const data = await getLoans();
      loans.value = data;
    } catch (err) {
      console.error("Failed to fetch loans:", err);
      error.value = "Gagal mengambil data pinjaman.";
    } finally {
      isLoading.value = false;
    }
  });

  return {
    loans,
    isLoading,
    error 
  }
}

export default useGetLoans;