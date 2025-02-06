import { db } from '@/firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const unusedVar = 'This should be flagged!';

export const fetchDepartmentsAndServices = async () => {
  try {
    const data = await getDocs(collection(db, 'CampusDepartmentAndServices'));

    return data.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    //should have better error handeling in the future, for testing purpose, will keep it like this
    console.log(error);
  }
};
